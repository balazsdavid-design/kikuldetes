sap.ui.define([
    "sap/m/MessageToast", "sap/m/MessageBox"
], function(MessageToast,MessageBox) {
    'use strict';

    return {
        downloadPDF: function(oEvent) {
          const savingStr = this.getModel("i18n").getResourceBundle().getText("Saving")
          const errorStr = this.getModel("i18n").getResourceBundle().getText("BasicError")
          const currencyError = this.getModel("i18n").getResourceBundle().getText("FuelPriceError")
          const dateError = this.getModel("i18n").getResourceBundle().getText("DateError")
          const conversionError = this.getModel("i18n").getResourceBundle().getText("ConversionError")
          const employeeError = this.getModel("i18n").getResourceBundle().getText("EmployeeDataMissing")
            MessageToast.show(savingStr);
            
            
            
            let obj = oEvent.getObject()
            const filename = "Kikuldetes_"+obj["goal"]+".pdf"
            let id = obj["ID"];
            const serviceUrl = this.getModel().getServiceUrl()
            var url = `${serviceUrl}/getPDFRegular?ID=${id}`
            fetch(url).then(response => {
                if (!response.ok) {
                  MessageBox.error(errorStr)
                  throw new Error(errorStr);
                }
                return response.json(); 
              })
              .then(data => {
                
                  
                

                
                if(data.value[0] == "CurrencyNotFound"){
                  console.log(data)
                  MessageBox.error(currencyError+" "+data.value[1])
                }
                else if(data.value == "DateError"){
                  console.log(data)
                  MessageBox.error(dateError)
                }
                else if(data.value == "EmployeeDataMissing"){ű
                  console.log(data)
                  MessageBox.error(employeeError)
                }
                // Ellenőrizzük, hogy a válasz tartalmazza-e a szükséges adatokat
                else if (data && data.value ) {
                  // Uint8Array létrehozása a bináris adatokból
                  data = atob(data.value);
                   var byteArray = new Uint8Array(data.length)
            for(var i=0; i<data.length; i++){
                byteArray[i] = data.charCodeAt(i);
            }
            var blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
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
                // deprecated solution below 
                  // Uint8Array létrehozása a bináris adatokból
                  /*
                  const uint8Array = new Uint8Array(data);
            
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
                  window.URL.revokeObjectURL(url); */
                
                } else {
                  console.log(data)
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