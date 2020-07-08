const express = require('express');
const bcrypt = require('bcrypt');

const password = "password1234"

const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync(password, salt);

console.log(hash);