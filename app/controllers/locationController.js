'use strict'

let Location = require('../models/locations')

// for this one, because the functions are async, mapping each data to the
// search results was a bit hard
let display = (data, cb) => {
  let r = JSON.stringify(data.businesses)

  let list = data.businesses.map(d => ({name: d.id}))
  Location.find({}).or(list).exec((err, results) => {
    let z = data.businesses.map(d => {
      let going = 0
      for (let i=0; i<results.length; i++)
	if (results[i].name === d.id) {
	  going = results[i].people.length
	  break
	}
      return {name: d.name, url: d.url, image_url: d.image_url,
	      id: d.id, rating: d.rating, review_count: d.review_count,
	      phone: d.phone, going}
    })
    cb(z)
  })
}

let click = (user, id, cb) => {
  Location.findOne({name: id}).exec((err, results) => {
    if (!results) {
      var d = new Location({
	name: id,
	people: [user]
      })
      d.save((err, results) => {
	cb({action: 'add'})
      })
    } else {
      let i = results.people.indexOf(user)
      results.people = results.people.slice()
      if (i === -1) results.people.push(user) // add
      else results.people.splice(i, 1) // remove
      results.save((err, results) => {
	if (i === -1) cb({action: 'add'})
	else cb({action: 'remove'})
      })
    }
  })
}

module.exports = {display, click}
