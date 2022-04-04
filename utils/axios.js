const axios = require('axios').create({
    baseURL: 'https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history'
})

module.exports = axios