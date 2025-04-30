

sap.ui.define([
    "sap/m/MessageToast", "sap/m/MessageBox"
], function(MessageToast,MessageBox) {
    'use strict';

    return {
        handle: function(oEvent) {
            MessageToast.show("Downloading PDF");
            
            
            let obj = oEvent.getObject()
            
            const filename = "AutosKikuldetes_"+obj["goal"]+".pdf"
            let id = obj["ID"];
            var url = `/odata/v4/app/getPDFCar?ID=${id}`
            fetch(url).then(response => {
               
                if (!response.ok) {
                  throw new Error('Hiba történt a fájl letöltése során.');
                }
                return response.json(); // A válasz JSON-ként való feldolgozása
              })
              .then(data => {
                
                if(data.value=='FuelPriceNotFound'){
                  MessageBox.error("Nem található üzemanyagár az adott hónapra")
                }
                else if(data.value == 'NoVolume'){
                  MessageBox.error("Belső égésű motor esetén töltse ki a hengerűrtartalmat!")
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
                  throw new Error('A válasz nem tartalmazza a szükséges adatokat.');
                }
              })
              .catch(error => {
                console.error('Hiba:', error);
              });
         
               
            
                    
                
            
             
        
    
        }
    }
}
)