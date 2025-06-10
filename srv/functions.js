
const soap = require('soap')
const xml2js = require('xml2js');
async function getExchangeRates(date,currency){
   
    var d = new Date(date)
    
    var today = new Date()
    
    if(d > today){
       
        throw 'DateError'
        
        
    }
    const url = 'http://www.mnb.hu/arfolyamok.asmx?wsdl';
    try {
        // 1️⃣ SOAP kliens létrehozása
        const client = await soap.createClientAsync(url);

        // 2️⃣ Paraméterek beállítása
        const params = {
            startDate: date,
            endDate: date,
            currencyNames: currency
        };

        // 3️⃣ SOAP kérés elküldése
        const [result] = await client.GetExchangeRatesAsync(params);
        
        const xmlData = result.GetExchangeRatesResult;

        // 4️⃣ XML -> JSON konvertálás
        const parser = new xml2js.Parser({ explicitArray: false });
        return new Promise((resolve, reject) => {
            parser.parseString(xmlData, (err, parsedResult) => {
                if (err) {
                    reject('XML feldolgozási hiba: ' + err);
                    return;
                }
 
                try {
                    // 5️⃣ Árfolyam kinyerése
                    
                    const rate = parsedResult.MNBExchangeRates.Day.Rate["_"];
                    resolve(rate);
                } catch (error) {
                   
                   reject(['CurrencyNotFound',currency])
                }
            });
        });

    } catch (error) {
        throw new Error('Hiba történt: ' + error);
    }

    

}
async function getLocalCountryName(country_code){
    const country = await SELECT.one.from('sap.common.Countries.texts').where({locale:'hu',code:country_code})
    return country.name
}
function compareByDate(a,b) {
    if(a.date  < b.date) {
        return -1;
    }
    if(a.date > b.date){
        return 1;
    }
    return 0;
}
function isEmployeeDataMissing(employee){
   
    return  (employee.position == null || employee.address == null || employee.birthDate == null 
        || employee.birthPlace == null || employee.taxNumber == null || employee.mothersName == null )
            
        
}

module.exports = { getExchangeRates, getLocalCountryName, compareByDate, isEmployeeDataMissing}