const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const { router } = require('./routes')
app.use('/conracts', router)

app.listen(3000, () => { console.log('Server running on port 3000...') })