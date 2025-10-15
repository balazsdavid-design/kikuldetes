
const soap = require('soap')
const xml2js = require('xml2js');
const tx = cds.tx();
const axios = require('axios');

const { serialize } = require('@sap/cds/lib/utils/csv-reader');
const { Builder } = require('xml2js');
const builder = new Builder()
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
                    
                    const rate = parseFloat(parsedResult.MNBExchangeRates.Day.Rate["_"].replace(',','.'));
                    
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

async function getBearerToken(username,password,authURL){
     var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
         var tokenOptions = {
                'method': 'POST',
                'url': authURL + "/oauth/token?grant_type=client_credentials",
                'headers': {
                    'Authorization': auth,
                    'Content-Type': 'application/json'
                },
                'redirect': 'follow'
            };
    
           const tokenResponse = await axios(tokenOptions);
           
            const token = tokenResponse.data.access_token
            return token
}
async function getFormsInfo(token,apiURL){
    var options = {
            'method': 'GET',
            'url': apiURL + "/v1/forms",
            'headers': {
                'Authorization': 'Bearer ' + token,
                
            },
            
        };
        const response = await axios(options)
        return response
}

async function getPDF(token,apiURL,templateStr,xmlData){
    if(xmlData.length<30){
        
        return xmlData
    }
    
    xmlData = Buffer.from(xmlData).toString('base64')
    
    var body =  JSON.stringify({
            "xdpTemplate": templateStr,
            "xmlData": xmlData,
            "formType": "print",
            "formLocale": "",
            "taggedPdf": 1,
            "embedFont": 0
        })
    var options = {
            'method': 'POST',
            'url': apiURL + "/v1/adsRender/pdf?templateSource=storageName",
            'headers': {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
                
            },
            'data': body
            
        };
        const response = await axios(options)
        if(response.data.fileContent == null){
            console.log(response.data)
            return response.data

        }
        return response.data.fileContent
}
async function attachFile(token,apiURL,base64pdf,attachment){

    const chunks = [];
 
 
  for await (const chunk of attachment.content) {
    
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const base64file = Buffer.concat(chunks).toString('base64');
   if(base64file == ""){
    return base64pdf
   }
  console.log(attachment)
    
    var body =  JSON.stringify({
            "fileName": attachment.filename,
            "fileContent":base64file,
            "mimeType": attachment.mimeType,
            "description":"",
            "pdf": base64pdf
        })
    var options = {
            'method': 'POST',
            'url': apiURL + "/v1/pdf/adsSet/attachment",
            'headers': {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
                
            },
            'data': body
            
        };
        try {
            const response = await axios(options)
            if(response.data.fileContent == null){
            //console.log(response.data)
            return response.data

        }
        return response.data.fileContent 
            
        }
        catch(exception){
            
            console.log(exception.response.data)
            return exception.response.data.trace
            
        }
        
        
        
}



module.exports = { getExchangeRates, getLocalCountryName, compareByDate, isEmployeeDataMissing, getBearerToken, getFormsInfo,getPDF, attachFile}