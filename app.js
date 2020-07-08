require("dotenv").config();
// require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const FitbitStrategy = require("passport-fitbit-oauth2").FitbitOAuth2Strategy;
const axios = require("axios");

const app = express();

const bcrypt = require("bcrypt");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect("mongodb://localhost/fitme", { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: '${x.connections[0].name}'`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

//declaring the session in the app

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    // session is uninitialized when it is new but not modified - default is false
    saveUninitialized: false,
    //Forces the session to be saved back to the session store,
    // even if the session was never modified during the request.
    resave: true,
    store: new MongoStore({
      //When the session cookie has an expiration date, connect-mongo will use it.
      // Otherwise, it will create a new one, using ttl option - here ttl is one day.
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 1000,
    }),
  })
);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

// catch 404 and forward to error handler
/*app.use((req, res, next) => {
  //const err = new Error('Not Found');
  //err.status = 404;
  //next(err);
  //alert(12543);
});*/

//passport setup

const User = require("./models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// we serialize only the `_id` field of the user to keep the information stored minimum
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// when we need the information for the user, the deserializeUser function is called with the id that we previously serialized to fetch the user from the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((dbUser) => {
      done(null, dbUser);
    })
    .catch((err) => {
      done(err);
    });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then((found) => {
        if (found === null) {
          done(null, false, { message: "Wrong credentials" });
        } else if (!bcrypt.compareSync(password, found.password)) {
          done(null, false, { message: "Wrong credentials" });
        } else {
          done(null, found);
        }
      })
      .catch((err) => {
        done(err, false);
      });
  })
);

// authenticating the user with fitbit

passport.use(
  new FitbitStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/fitbit/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // find a user with profile.id as githubId or create one
      User.findOne({ fitbitId: profile.id })
        .then((found) => {
          if (found !== null) {
            // user with that githubId already exists
            done(null, found);
          } else {
            // no user with that githubId
            return User.create({ fitbitId: profile.id }).then((dbUser) => {
              done(null, dbUser);
            });
          }
        })
        .catch((err) => {
          console.log(found);
          done(err);
        });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

const index = require("./routes/index");
app.use("/", index);

const activity = require("./routes/activity");
app.use("/", activity);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const activitiesRoutes = require("./routes/activities");
app.use("/", activitiesRoutes);

const profile = require("./routes/profile");
app.use("/", profile);

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.locals.title = "Express - Generated with IronGenerator";

module.exports = app;
