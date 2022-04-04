const axios = require('../utils/axios')
const dateIsValid = require('../utils/dateIsValid')

const getintraDayTradeHistoryList = async (endDate, startDate) => {
    //tarih bilgilerini kontrol et uygun formatta degilse bugune ayarla
    if (!startDate || !dateIsValid(startDate)) {
        startDate = new Date().toISOString().slice(0, 10); // 2022-04-03
    }
    if (!endDate || !dateIsValid(endDate)) {
        endDate = new Date().toISOString().slice(0, 10); // 2022-04-03
    }
    try {
        const response = await axios.get(`?endDate=${endDate}&startDate=${startDate}`) // servisten get metodu ile verileri oku
        const { intraDayTradeHistoryList } = response.data.body
        return intraDayTradeHistoryList;
    } catch (error) {
        console.log('error', error)
        return null
    }

}

const conractaGoreGrupla = (liste) => {
    const gruplanmisListe = liste.reduce((gruplanmisListe, item) => {
        const group = (gruplanmisListe[item.conract] || []); //PH22040305
        group.push(item);
        gruplanmisListe[item.conract] = group;
        return gruplanmisListe;
    }, {});
    return gruplanmisListe
}

const IslemMiktariHesapla = (quantity) => {
    return quantity / 10
}
const IslemTutariHesapla = (price, quantity) => {
    return (price * quantity) / 10
}
const TariheGoreGrupla = (liste) => {
    const conractPHileBaslayanlar = liste.filter(item => item.conract.startsWith('PH')) // conract'i PH ile baslayanlari ayikla
    const gruplanmisListe = conractaGoreGrupla(conractPHileBaslayanlar)

    const TarihFormat = new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    })
    const NumberFormat = new Intl.NumberFormat('tr-TR')
    const sonuc = Object.keys(gruplanmisListe).map(key => {
        const tarih = new Date(gruplanmisListe[key][0].date); //her bir conractin ilk elemanindan tarih bilgisini oku
        const year = tarih.getFullYear() //tarih bilgisinden yili cikart
        const month = tarih.getMonth() //tarih bilgisinden ayi cikart
        const day = key.slice(6, 8) //PH22040305 key bilgisinden gunu cikart 03
        const hour = key.slice(8, 10) //PH22040305 key bilgisinden saati cikart 05

        const Tarih = new Date(year, month, day, hour) //Tarihi ayarla
        let ToplamIslemMiktari = ToplamIslemTutari = 0

        gruplanmisListe[key].forEach(item => {
            ToplamIslemMiktari += IslemMiktariHesapla(item.quantity)
            ToplamIslemTutari += IslemTutariHesapla(item.price, item.quantity)
        })

        const AgirlikliOrtalamaFiyat = ToplamIslemMiktari ? ToplamIslemTutari / ToplamIslemMiktari : 0 // Toplam islem miktari0 ise Agirlikli ortalama fiyatinin sifir yap

        return {
            Tarih,
            ToplamIslemMiktari: NumberFormat.format(ToplamIslemMiktari),
            ToplamIslemTutari: NumberFormat.format(ToplamIslemTutari),
            AgirlikliOrtalamaFiyat: NumberFormat.format(AgirlikliOrtalamaFiyat)
        }

    })


    const siralanmisSonuc = sonuc.sort((a, b) => new Date(a.Tarih).getTime() - new Date(b.Tarih).getTime()).map(item => {
        item.Tarih = TarihFormat.format(item.Tarih); return item;
    })
    return siralanmisSonuc

}

const sonucJSON = async (req, res) => {
    const { endDate, startDate } = req.query //end pointlerde girilen baslangic ve bitis tarihleri
    const intraDayTradeHistoryList = await getintraDayTradeHistoryList(endDate, startDate);
    const sonuc = TariheGoreGurpla(intraDayTradeHistoryList)
    res.send(sonuc)
}

const sonucHTML = async (req, res) => {
    const { endDate, startDate } = req.query
    const intraDayTradeHistoryList = await getintraDayTradeHistoryList(endDate, startDate);
    const sonuc = TariheGoreGrupla(intraDayTradeHistoryList)

    let thead = `
    <thead>
        <th>Tarih</th>
        <th>Toplam İşlem Miktarı(MWh)</th>
        <th>Toplam İşlem Tutarı(TL)</th>
        <th>Ağırlık Ortalama Fiyat(TL/MWh)</th>
    </thead>
    `
    let tbody = '<tbody>';
    sonuc.forEach(item => {
        tbody += `<tr>
        <td>${item.Tarih}</td>
        <td style='text-align:right'>${item.ToplamIslemMiktari}</td>
        <td style='text-align:right'>${item.ToplamIslemTutari}</td>
        <td style='text-align:right'>${item.AgirlikliOrtalamaFiyat}</td>
        </tr>`
    })
    tbody += '</tbody>'

    const table = `
        <table>
            ${thead}
            ${tbody}
        </table>
    `

    res.send(table)
}

module.exports = {
    sonucJSON,
    sonucHTML
}