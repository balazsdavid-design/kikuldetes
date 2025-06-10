const { isEmployeeDataMissing, compareByDate, getLocalCountryName ,getExchangeRates} = require("./functions");
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');




pdfMake.addVirtualFileSystem(pdfFonts);
async function createCarPDF(PostingWithCar){
    const date = new Date();
    const year = date.getFullYear()
    const month =  (date.getMonth()+1).toString().padStart(2,"0")
    const day = date.getDate().toString().padStart(2,"0")
    const yearMonth = year+"-"+month
    const employee = PostingWithCar.employee;
    if(isEmployeeDataMissing(employee)){
        return "EmployeeDataMissing"
    }
    const data = PostingWithCar.data.sort(compareByDate);
    const stickers = PostingWithCar.stickers.sort(compareByDate);
    var consumption = 3;
    var fuel_consumption;
    var cylinder_volume = PostingWithCar.cylinder_volume
    var fuel_type_name
    const fuel_type = await SELECT.one.from('FuelTypes.texts').where({locale:'hu',ID:PostingWithCar.fuel_type_ID})
    if(fuel_type){
        fuel_type_name = fuel_type.name
    }
    
    
    const fuelPrices = await SELECT.one.from('FuelPrices').where({yearMonth:yearMonth})
    if(fuelPrices == null){
        return "FuelPriceNotFound"
      
    }
    else if(cylinder_volume == null && PostingWithCar.fuel_type_ID != 5){
        return "NoVolume"
    }
    var fuelPrice = fuelPrices.petrolPrice
    if(PostingWithCar.fuel_type_ID == 2 || PostingWithCar.fuel_type_ID == 4){
        fuelPrice = fuelPrices.dieselPrice
    }
    if(PostingWithCar.fuel_type_ID != 5) {
        if(cylinder_volume < 3001){
            fuel_consumption = await SELECT.one.from('FuelConsumptions')
    .where(`${PostingWithCar.cylinder_volume} >= volumeStart and ${PostingWithCar.cylinder_volume} <= volumeEnd and fuelType_ID = ${PostingWithCar.fuel_type_ID} `)
        }
        else {
            fuel_consumption =  await SELECT.one.from('FuelConsumptions')
            .where(`3001 = volumeStart and fuelType_ID = ${PostingWithCar.fuel_type_ID} `)
            
            
        }
        consumption = fuel_consumption.consumption
    
    }
    else {
        cylinder_volume = '-'
    }
     
    if( PostingWithCar.fuel_type_ID == 3 || PostingWithCar.fuel_type_ID == 4){
        consumption = consumption*0.7
    }
    var tableBody =  [
        [{text :'Ssz.'},{text: 'A kiküldetés, külszolgálat',colSpan : 4},'','','',{text :'Futástelje-sítmény (km)', rowSpan: 2},{ text:'Üzemanyag-költség (Ft)',rowSpan : 2},{text:'Személygépkocsi normaköltség (Ft)',rowSpan :2}, {text:'Napidíj (Ft)', rowSpan:2}],
        ['','Dátuma','Honnan','Hova','elrendelőjének aláírása','','','',''],
        
        
      ]
      
      var index = 1;
      var sumMileage = 0;
      var sumFuel = 0; 
      var sumNorm = 0;
      var sumDaily = 0;  
    data.forEach( trip => {
        var fuel = Math.round( fuelPrice*(trip.mileage/100*consumption));
        var norm = trip.mileage*15;
       var tripData = [
        {text:index+"."},{text:trip.date,fillColor:'lightblue'},{text:trip.from_where,fillColor:'lightblue'},{text:trip.to_where,fillColor:'lightblue'},'',{text:trip.mileage,fillColor:'lightblue'},{text:fuel,fillColor:'lightblue'},{text:norm,fillColor:'lightblue'},{text:trip.daily_expense,fillColor:'lightblue'}]
        tableBody.push(tripData)
        sumMileage+= trip.mileage;
        sumFuel+= fuel;
        sumNorm += norm;
        sumDaily += trip.daily_expense
        index++;
    })  
    
        var total = sumDaily+sumFuel+sumNorm
        tableBody.push([{text:'Összesen:',colSpan:5,bold:true,alignment:'left',},'','','','',sumMileage,sumFuel,sumNorm,sumDaily],
            [{text:'',border:[false,false,false,false]},{text:'',border:[false]},{text:'',border:[false]},{text:'',border:[false]},{text:'',border:[false]},{text:'',border:[false]},{text:'',border:[false]},{text:'',border:[false]},{text:'',border:[false,false,false,false],marginBottom:10}],
            ['Ssz',{text:'Egyéb tételek',colSpan:3},'','',{text:'Valutanem',rowSpan:2},{text:'Összeg',rowSpan:2},{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2,colSpan:2},''],
            ['','Dátuma',{text:'Megnevezése',colSpan:2},'','','','','','']
        )
        var ind = 1
       for( const sticker of stickers){
            var country = await getLocalCountryName(sticker.country_code)
            
            currency = ''
            changeRate = ''
            price = ''
            huf = ''
            
            if (sticker.currency_code == 'HUF'){
                huf = sticker.price
            }
            else {
                currency = sticker.currency_code
                price = sticker.price
                try { 
                    changeRate = parseFloat(await getExchangeRates(sticker.date,currency))
                    
                }
                catch(error){
                    console.log(error)
                    return error
                }
                huf = changeRate*price

            }
            total+= huf
            var string = `Autopálya matrica ${country}`
            
            stickerData =  [ind+".",sticker.date,{text:string,colSpan:2,alignment:'left'},'',currency,price,{text:changeRate},{text:huf,colSpan:2},'']
             tableBody.push(stickerData)
            ind++;
        }
        if(stickers.length == 0){
            tableBody.push(['','',{text:'',marginTop:8,colSpan:2,alignment:'left'},'','','',{text:''},{text:'',colSpan:2},''])
        }
       
      tableBody.push(
        [{text:'Költségtérítés mindösszesen:',colSpan:6,alignment:'right',bold:true},'','','','','',{text:total,colSpan:3,alignment:'center',bold:true},'','']
      )  
    var docDefinition = {
        
        font:'Roboto',
        content: [
            { text: 'Kiküldetési rendelvény', style: 'header', marginBottom : 5},
             { text: 'a hivatali, üzleti utazás költségtéritéséhez, saját gépjármű használatával',
             style: 'subHeader' ,marginBottom : 5},
             
             
             
             
             
          
              {
                  
                  
                  marginLeft :220,
                  
                  marginBottom: 5,
                  layout: 'noBorders',
                  style: 'textBold',
                  alignment:'center',
                  
              table: {
                  
                  body:
                  [
                      [{text:year},{text:month,fillColor:'lightblue'},{text:'hó'}  ]
                      ],
                      widths: [19,40,10]
              }
              },
              {
                  layout: 'noBorders',
                  style: 'textBold',
                  marginLeft: 347,
                  
                  table: {
                      widths: [60,100],
                      body : [
                          ['ssz.',{text:PostingWithCar.serialNumber,fillColor:'lightblue',alignment:'center'}]
                          ]
                  }
                  
              },
              {
                  marginBottom:10,
                  marginRight:25,
                  style : 'textBold',
              columns : [
                  {
                      layout: 'noBorders',
                      alignment: 'left',
                      table : {
                        body : [
                            [{text:'A munkáltató',colSpan:2},''],
                            [{text:'Neve:'},{text: 'msg Plaut Hungary',fillColor:'lightblue'}],
                            [{text:'Címe:'},{text: '1066 Budapest, Nyugati tér 1.',fillColor:'lightblue'}],
                            [{text:'Adószáma'},{text: '28957795-2-42',fillColor:'lightblue'}],
                            
                            
                            ], 
                            widths: [60,170],
                      },
                      
                      
                      
                     
                      
                  },
                  {
                    layout: 'noBorders',
                      alignment: 'left',
                      table : {
                        body : [
                            [{text:'A munkavállaló',colSpan:2},''],
                            [{text:'Neve:'},{text: employee.name,fillColor:'lightblue'}],
                            [{text:'Lakcíme:'},{text: employee.address,fillColor:'lightblue'}],
                            [{text:'Születési helye, ideje'},{text: employee.birthPlace+", " + PostingWithCar.employee.birthDate,fillColor:'lightblue'}],
                            [{text:'anyja neve'},{text: employee.mothersName,fillColor:'lightblue'}],
                            [{text:'Adóazonosító jele'},{text: employee.taxNumber,fillColor:'lightblue'}],
                            
                            ],
                            widths: [80,170],
                      },
      
                  },
                  
                  ],
                  
                  columnGap : 0,
                  
              },
             
              {
                  marginBottom: 20,
                  style: 'textBold',
                  
                  table: {
                      widths: [25,40,43,70,60,50,45,60,'*'],
                      body: [
                          [{text:'Forgalmi rendszám, típus',colSpan:3},'','',{text:PostingWithCar.plateNum,colSpan:2,fillColor:'lightblue'},'',{text:'Fogyasztási normája:',colSpan:2},'',{text:consumption,fillColor:'lightblue',alignment:'center'},{text:'liter/100km'}],
                          [{text:'Üzemanyag:',colSpan:2},'',{text:fuel_type_name,fillColor:'lightblue'},{text:'Hengerűrtartalom:'},{text:cylinder_volume,fillColor:'lightblue',alignment:'center'},{text:'Üz.ag ár:'},{text:fuelPrice},{text:'Amort. (Ft/km):'},{text:15,fillColor:'lightblue',alignment:'center'}],
                          
                          ],
                          
                      
                  },
                  
              },
              
              
              {
                  
            table: {
                                               
              widths: ['auto',50,54,54,'auto',60,55,71,'*'],
              
               
              body: tableBody 
              
              
            },
            alignment:'center',
            marginBottom: 40,
          },
          {
             
              table: {
                  widths: [100,100,70,100,100],
                  
                  body:[
                      [{text:'Igazolta:',border: [false,false,false,false]}, {text:'',alignment:'center',border: [false,false,false,true]},{text:'',border: [false,false,false,false]},{text:'Utalványozta:',border: [false,false,false,false]}, {text:'',alignment:'center',border: [false,false,false,true]}],
                      
                     
                      ]
              },
              marginBottom: 20,
          },
          {
             
              table: {
                  widths: [50,150,70,50,150],
                  
                  body:[
                     
                      
                      [{text:'Dátum:',border: [false,false,false,false]},{text:'',border: [false,false,false,true]},{text:'',border: [false,false,false,false]},{text:'Dátum:',border: [false,false,false,false]},{text:'',border: [false,false,false,true]}]
                      ]
              },
          },
          
          
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            alignment: 'center'
          },
          subHeader : {
              fontsize:12,
              bold: true,
              alignment: 'center'
          },
          textStyle : {
              fontSize :10
          },
          textBold : {
              fontsize:10,
              bold : true
          }
         
        },
        
        defaultStyle: {
          fontSize: 8,
          font: 'Roboto'
          
          
          
        },

    }
    
    
    var pdf = pdfMake.createPdf(docDefinition)
    return new Promise((resolve, reject) => {
        pdf.getBuffer((blob) => {
          if (blob) {
            resolve(blob);  // Ha van blob, akkor teljesítjük a Promise-t
          } else {
            reject(new Error('Nem sikerült a blob lekérése'));
          }
        });
      });

   
   
    
    
    
    
}

module.exports = createCarPDF