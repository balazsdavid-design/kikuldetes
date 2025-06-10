

sap.ui.define([
    "sap/m/MessageToast", "sap/m/MessageBox"
], function(MessageToast,MessageBox) {
    'use strict';

    return {
        handle: async function(oEvent) {
          
          const savingStr = this.getModel("i18n").getResourceBundle().getText("Saving")
          const errorStr = this.getModel("i18n").getResourceBundle().getText("BasicError")
          const fuelpriceError = this.getModel("i18n").getResourceBundle().getText("FuelPriceError")
          const noVolume = this.getModel("i18n").getResourceBundle().getText("NoVolumeError")
          const conversionError = this.getModel("i18n").getResourceBundle().getText("ConversionError")
          const currencyError = this.getModel("i18n").getResourceBundle().getText("FuelPriceError")
          const dateError = this.getModel("i18n").getResourceBundle().getText("DateError")
          const employeeError = this.getModel("i18n").getResourceBundle().getText("EmployeeDataMissing")
          
            MessageToast.show(savingStr);
            
            
            let obj = oEvent.getObject()
            
            const filename = "AutosKikuldetes_"+obj["goal"]+".pdf"
            let id = obj["ID"];
            
            const serviceUrl = this.getModel().getServiceUrl()

            var url = `${serviceUrl}/getPDFCar?ID=${id}`
            fetch(url).then(response => {
               
                if (!response.ok) {
                  MessageBox.error(errorStr)
                  throw new Error(errorStr);
                  
                }
                // teszt build
                
                return response.json(); // A válasz JSON-ként való feldolgozása
                
              })
              .then(data => {
                
                if(data.value=='FuelPriceNotFound'){
                  // Lokalizált hibaüzenetet megjelenítem
                  MessageBox.error(fuelpriceError)
                }
                else if(data.value == 'NoVolume'){
                  MessageBox.error(noVolume)
                }
                else if(data.value[0] == "CurrencyNotFound"){
                  MessageBox.error(currencyError+" "+data.value[1])
                }
                else if(data.value == "DateError"){
                  MessageBox.error(dateError)
                }
                else if(data.value == "EmployeeDataMissing"){
                  MessageBox.error(employeeError)
                }
                // Ellenőrzöm, hogy a válasz tartalmazza-e a szükséges adatokat
                else if (data && data.value && data.value.data) {
                  
                  // Uint8Array létrehozása a bináris adatokból
                  const uint8Array = new Uint8Array(data.value.data);
            
                  // Blob létrehozása a bináris adatokból
                  const blob = new Blob([uint8Array], { type: 'application/pdf' });
            
                  // Ideiglenes URL létrehozása a Blob-hoz
                  const url = window.URL.createObjectURL(blob);
            
                  // <a> elem létrehozása a letöltéshez
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename; // A letöltött fájl neve
                  document.body.appendChild(a);
                  a.click();
            
                  // <a> elem eltávolítása és az URL felszabadítása
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                } else {
                  MessageBox.error(conversionError)
                  throw new Error(conversionError);
                }
              })
              .catch(error => {
                console.error('Hiba:', error);
              });
         
               
            
                    
                
            
             
        
    
        }
    }
}
)