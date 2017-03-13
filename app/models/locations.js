'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let Location = new Schema({
  name: String,
  people: [String]
})

module.exports = mongoose.model('Location', Location);
