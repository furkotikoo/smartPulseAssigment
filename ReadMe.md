# smartPulse Assigment

> repostroy'i indirdikten sonra terminali açarak `npm install` komutunu çalıştırın. Böylece proje için gerekli modüller indirimiş olacak.


## Bu projede iki end point oluştruldu
> `localhost:3000/contracts/json` endpoint'i JSON sonuç döndürür.  
> `localhost:3000/contracts/html` endpoint'i HTML tablo döndürür.

> Her iki endpoint'te **endDate** ve **startDate** parametreleri query parametresi olarak eklenebilir.  
> Herhangi bir parametre gönderilmezse başlangıç ve bitiş tarihlerini bugün olarak alır.   
>  localhost:3000/contracts/json?endDate=2022-04-03&startDate=2022-04-03  
> localhost:3000/contracts/html?endDate=2022-04-03&startDate=2022-04-03