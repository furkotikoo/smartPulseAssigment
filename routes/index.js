const router = require('express').Router()

const { sonucJSON, sonucHTML } = require('../controllers/ConractController')

router.get('/json', sonucJSON) //json sonuc doner
router.get('/html', sonucHTML) //html tablo doner

module.exports = { router }