



const soap = require('soap')
const xml2js = require('xml2js');
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');



pdfMake.addVirtualFileSystem(pdfFonts);

async function createPDFCarDirect(PostingWithCar) {
    
    
    
    
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
    const fuel_type = await SELECT.one.from('FuelTypes.texts').where({locale:'hu',ID:PostingWithCar.fuel_type_ID})
    const fuel_type_name = fuel_type.name
    
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

async function createPDFRegularDirect(PostingRegular){
    
    const date = new Date();
    const year = date.getFullYear()
    const month =  date.getMonth().toString().padStart(2,"0")
    const day = date.getDate().toString().padStart(2,"0")
    const employee = PostingRegular.employee;
    if(isEmployeeDataMissing(employee)){
        return "EmployeeDataMissing"
    }
    const departures_arrivals = PostingRegular.departures_arrivals.sort((a,b) => (
        a.departure > b.departure ? 1 : b.departure > a.departure ? -1 : 0
    ));
    const daily = PostingRegular.daily_expenses.sort(compareByDate);
    const accomodations = PostingRegular.accomodations.sort(compareByDate)
    const material = PostingRegular.material_expenses.sort(compareByDate)
    const tripExpenses = PostingRegular.trip_expenses.sort(compareByDate)
    const postingCountry = await getLocalCountryName(PostingRegular.country_code)
    var borrowed = PostingRegular.borrowedHUF
    var borrowedEUR = PostingRegular.borrowedEUR
    
    var paidByCompany = 0;
    var paidByCompanyEUR = 0;
    var paidByEmployee = 0;
    var paidByEmployeeEUR = 0
    var tableBody =  [
        [{text:'',border:[false,false,false,false],colSpan:4},'','','',{text:'Év:',border:[false],alignment:'right'},{text:year,style:'fill',bold:true},{text:'Sorszám:',border:[false]},{text:PostingRegular.serialNumber,style:'fill',bold:true,colSpan:2},''],   
        [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','','',''],    
            
          // first table  
        [{text: '1. A kiküldetésre vonatkozó rendelkezések:',style:'subHeader',alignment:'start',colSpan:9,border:[false,false,false,false]},'','','','','','','',''],
        [{text:'Kiküldött neve',colSpan:2,alignment:'left'},'',{text:employee.name,style:'fill',bold:true,colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'beosztása',colSpan:2,alignment:'left'},'',{text:employee.position,style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'munkáltatója',colSpan:2,alignment:'lef'},'',{text:'msg Plaut Hungary Kft.',style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'Kiküldetési ország',colSpan:2,alignment:'left'},'',{text:postingCountry,style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'Kiküldetés célja',colSpan:2,alignment:'left'},'',{text: PostingRegular.goal,style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'Utazás oda',colSpan:2,alignment:'left'},'',{text:PostingRegular.travel_to,style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'vissza',alignment:'left',colSpan:2,marginLeft:33},'',{text:PostingRegular.travel_back,style:'fill',colSpan:7,alignment:'left'},'','','','','',''],    
        
        [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','','',''],
        // second table   
        [{text:'2. Indulási és érkezési adatok',style:'subHeader',border:[false,false,false,false],colSpan:9,alignment:'start'},'','','','','','','',''],
        [{text:'Indulás',colSpan:4,alignment:'center'},'','','',{text:'Érkezés',colSpan:4,alignment:'center'},'','','',''],
        [{text:'Honnan',rowSpan:2,alignment:'center'},{text:'Mikor',colSpan:3,alignment:'center'},'','',{text:'Hová',rowSpan:2,alignment:'center'},{text:'Mikor',colSpan:3,alignment:'center'},'','',''],
        ['',{text:'hó'},{text:'nap'},{text:'óra perc'},'',{text:'hó'},{text:'nap'},{text:'óra perc'},{text:"Mivel"}],
        
        ]

    
    var sumEUR = 0;
    var sumHUF = 0;
    
        // filling of second table
    departures_arrivals.forEach( data => {
        var departure = new Date(data.departure);
        var arrival = new Date(data.arrival);
        
        departure_time = departure.toTimeString().split(":")
        
        arrival_time = departure.toTimeString().split(":")
        tableBody.push( 
        [{text:data.from_where,style:'fill'},{text:departure.getMonth()+1,style:'fill'},{text:departure.getDate(),style:'fill'},{text:`${departure_time[0]}:${departure_time[1]}`,style:'fill'},
            {text:data.to_where,style:'fill'},{text:arrival.getMonth()+1,style:'fill'},{text:arrival.getDate(),style:'fill'},{text:`${arrival_time[0]}:${arrival_time[1]}`,style:'fill'},{text:data.meanOfTransport_name,style:'fill'}])
    })
    //third table setup
    tableBody.push( [{text:'',border:[false,false,false,false],colSpan:9,marginTop:15},'','','','','','','',''],
        [{text:'3.Napidíjelszámolás', style : 'subHeader',colSpan:5,alignment:'start'},'','','','',{text:'Kifizetés:',style:'bluefill'},{text:'bérrel együtt',colSpan:3,style:'bluefill'},'',''],
        [{text:'Viszonylat/dátum',rowSpan:2,colSpan:2},'',{text:'Napok',rowSpan:2},{text:'Felszámított napidíj',colSpan:3},'','',{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja',rowSpan:2,style:'bluefill'}],
        ['','','',{text:'Valutanem'},{text:'Egy napra'},{text:'Összes'},'','',''],
    )
    
        var sumDailyHUF = 0;
        var sumDailyEUR = 0;
        // third table filling
        

        for( const current of daily ){
            

            var price = current.days*current.daily_price
            
            var priceHUF = 0;
            var priceEUR = 0;
        
            var currency = current.currency_code;
            var currencyText = currency;
            
            var priceText = '';
            var hufText = '';
            var changeRate = ""
            if(currency == 'EUR'){
                priceEUR = price
                priceText = priceEUR
                if(priceText.toString().includes('.')){
                    priceText = priceText.toFixed(2)
                }
                current.daily_price = current.daily_price.toFixed(2)
             }
             else if(currency == 'HUF'){
                 priceHUF = price
                 currencyText = ''
                 hufText = priceHUF
             }
             else {
                 
                 priceText = price
                 try {
                 changeRate = parseFloat(await getExchangeRates(current.date,currency))
                 }
                 catch(err){
                    return err
                 }
                 
                 priceHUF = changeRate*price
                 
                 hufText = priceHUF
                 
     
             }
             sumDailyHUF+= priceHUF;
             sumDailyEUR += priceEUR;
             if(currency == 'EUR'){
                if(current.paymentMethod_ID < 4){
                    paidByCompanyEUR += price

                }
                else if(current.paymentMethod_ID < 8){
                    paidByEmployeeEUR += price

                }
                else {
                    borrowedEUR -= price

                }

             }
             else {
                if(current.paymentMethod_ID < 4){
                    paidByCompany += price

                }
                else if(current.paymentMethod_ID < 8){
                    paidByEmployee += price

                }
                else {
                    borrowed-= price

                }

             }
            
            
            tableBody.push(
                [{text:current.date,style:'fill',colSpan:2},'',{text:current.days,style:'fill'},{text:currency},{text:current.daily_price,style:'fill'},{text:price},{text:changeRate},{text:hufText},{text:current.paymentMethod_name,bold:true,rowSpan:1}]
            )

        }
        if(daily.length == 1 ){
            
                tableBody.push(
                    
                    [{text:"",style:'fill',colSpan:2,marginTop:8},'',{text:'',style:'fill'},{text:''},{text:'',style:'fill'},{text:''},{text:''},{text:''},{text:'',bold:true,rowSpan:1}]
                )
            
        }
        else if (daily.length == 0){
            tableBody.push(
                [{text:"",style:'fill',colSpan:2,marginTop:8},'',{text:'',style:'fill'},{text:''},{text:'',style:'fill'},{text:''},{text:''},{text:''},{text:'',bold:true,rowSpan:1}],
                [{text:"",style:'fill',colSpan:2,marginTop:8},'',{text:'',style:'fill'},{text:''},{text:'',style:'fill'},{text:''},{text:''},{text:''},{text:'',bold:true,rowSpan:1}]
            )
        }
        if(sumDailyEUR.toString().includes('.')){
            sumDailyEUR = sumDailyEUR.toFixed(2)
        }
        sumHUF += sumDailyHUF
        sumEUR += sumDailyEUR
        
        
        tableBody.push(
            [{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'EUR'},{text:sumDailyEUR == 0 ? "-" : sumDailyEUR,bold:true},{text:'HUF',bold:true,border:[]},{text:sumDailyHUF == 0 ? "-" : sumDailyHUF,bold:true},{text:'',border:[]}],
            [{text:'',border:[false,false,false,false],colSpan:9,marginTop:15},'','','','','','','',''],
            // setting up 4th table
            [{text:'4. Szállásköltségelszámolás',style:'subHeader',alignment:'start',colSpan:4},'','','','',{text:'Kifizetés:',style:'bluefill'},{text:'céges kártya/ banki utalás/ pénztár',style:'bluefill',colSpan:3},'',''],
            [{text:'Szálloda',rowSpan:2,colSpan:2},'',{text:'Napok',rowSpan:2},{text:'Felszámított szállásdíj',colSpan:3},'','',{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja*',style:'bluefill',rowSpan:2}],
            ['','','',{text:'Valutanem'},{text:'Egy napra'},{text:'Összes'},'','',''],
                    )
        

                    
    
    var sumAccomodationHUF = 0;
    var sumAccomodationEUR = 0;
    //console.log(PostingRegular)
    //filling 4th table
   for( const accomodation of accomodations) {
        var priceHUF = 0;
        var priceEUR = 0;
        ;
        var currency = accomodation.currency_code;
        var currencyText = currency;
        var price = accomodation.daily_price*accomodation.days
        var priceText = '';
        var hufText = '';
        var changeRate = ""
        var acc_date = new Date(accomodation.date)
        var endDate = new Date(accomodation.date)
        endDate.setDate(acc_date.getDate()+accomodation.days)
        
        const endDateString = (endDate.getMonth()+1).toString().padStart(2,"0")+"-"+endDate.getDate().toString().padStart(2,"0")
        const accomodation_string = `${accomodation.accomodation_name}, ${accomodation.date}-tól ${endDateString}-ig`
        if(currency == 'EUR'){
           priceEUR = price
           priceText = priceEUR
           if(priceText.toString().includes('.')){
            priceText = parseFloat(priceText).toFixed(2)
            accomodation.daily_price = accomodation.daily_price.toFixed(2)
        }
        }
        else if(currency == 'HUF'){
            priceHUF = price
            currencyText = ''
            hufText = priceHUF
        }
        else {
            
            priceText = price
            try {
            changeRate = parseFloat(await getExchangeRates(accomodation.date,currency))
            }
            catch(err){
                return err
            }
            
            priceHUF = changeRate*price
            
            hufText = priceHUF
            

        }
        if(currency == 'EUR'){
            if(accomodation.paymentMethod_ID < 4){
                paidByCompanyEUR += price

            }
            else if(accomodation.paymentMethod_ID < 8){
                paidByEmployeeEUR += price

            }
            else {
                borrowedEUR -= price

            }

         }
         else {
            if(accomodation.paymentMethod_ID < 4){
                paidByCompany += price

            }
            else if(accomodation.paymentMethod_ID < 8){
                paidByEmployee += price

            }
            else {
                borrowed -= price

            }

         }

        sumAccomodationHUF+= priceHUF;
        sumAccomodationEUR += priceEUR;
        tableBody.push(
            [{text:accomodation_string,style:'fill',colSpan:2},'',{text:accomodation.days,style:'fill'},currencyText,{text:accomodation.daily_price,style:'fill'},priceText,changeRate,hufText,{text:accomodation.paymentMethod_name}],
             )
    }
    if(accomodations.length == 1){
        tableBody.push(
            [{text:'',marginTop:8,style:'fill',colSpan:2},'',{text:'',style:'fill'},'',{text:'',style:'fill'},'','','',{text:''}],
             )

    }
    else if(accomodations.length == 0){
        tableBody.push(
            [{text:'',marginTop:8,style:'fill',colSpan:2},'',{text:'',style:'fill'},'',{text:'',style:'fill'},'','','',{text:''}],
            [{text:'',marginTop:8,style:'fill',colSpan:2},'',{text:'',style:'fill'},'',{text:'',style:'fill'},'','','',{text:''}]
             )

    }

       
    sumEUR += sumAccomodationEUR;
    sumHUF += sumAccomodationHUF;
    if(sumAccomodationEUR.toString().includes('.')){
        sumAccomodationEUR = sumAccomodationEUR.toFixed(2)
    }
    tableBody.push( 
        [{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'EUR'},{text:sumAccomodationEUR == 0 ? "-" : sumAccomodationEUR,bold:true},{text:'HUF',bold:true,border:[]},{text:sumAccomodationHUF == 0 ? "-" : sumAccomodationHUF,bold:true},{text:'',border:[]}],

        [{text:'',border:[false,false,false,false],colSpan:9,marginTop:60},{text:''},{text:''},{text:''},{text:''},{text:''},{text:''},{text:''},{text:''}],
        // setting up 5th table
        [{text:'5. Dologi kiadások elszámolása',style:'subHeader',alignment:'start',colSpan:5,pageBreak:'before'},{text:'',pageBreak:'before'},{text:'',pageBreak:'before'},{text:'',pageBreak:'before'},{text:'',pageBreak:'before'},{text:'Kifizetés:',style:'bluefill',pageBreak:'before'},{text:'céges kártya/ banki utalás/ pénztár',style:'bluefill',colSpan:3,pageBreak:'before'},{text:'',pageBreak:'before'},{text:'',pageBreak:'before'}],
        [{text:'Hivatk.',rowSpan:2},{text:'Felmerülés',colSpan:3},'','',{text:'Valutanem',rowSpan:2},{text:'Összeg',rowSpan:2},{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja*',style:'bluefill',rowSpan:2}],
        ['',{text:'Ideje'},{text:'Jogcíme',colSpan:2},'',{text:''},{text:''},'','',''],
    )

   
    var sumMaterialHUF = 0
    var sumMaterialEUR = 0
    for( const expense  of material) {
        var priceHUF = 0;
        var priceEUR = 0;
        
        var currency = expense.currency_code;
        var currencyText = currency;
        var price = expense.price
        var priceText = '';
        var hufText = '';
        var changeRate = ""
        
        if(currency == 'EUR'){
           priceEUR = price
           priceText = priceEUR
           if(priceText.toString().includes('.')){
            priceText = priceText.toFixed(2)
            
        }
        }
        else if(currency == 'HUF'){
            priceHUF = price
            currencyText = ''
            hufText = priceHUF
        }
        else {
            
            priceText = price
            try {
                changeRate = parseFloat(await getExchangeRates(expense.date,currency))
            }
            catch(err){
                return err
            }
            
            
            priceHUF = changeRate*price
            
            hufText = priceHUF
        }

        if(currency == 'EUR'){
            if(expense.paymentMethod_ID < 4){
                paidByCompanyEUR += price

            }
            else if(expense.paymentMethod_ID < 8){
                paidByEmployeeEUR += price

            }
            else {
                borrowedEUR -= price

            }

         }
         else {
            if(expense.paymentMethod_ID < 4){
                paidByCompany += price

            }
            else if(expense.paymentMethod_ID < 8){
                paidByEmployee += price

            }
            else {
                borrowed -= price

            }

         }

        
        sumMaterialHUF += priceHUF
        sumMaterialEUR += priceEUR
        //filling 5th table
        
        tableBody.push(
            [{text:expense.reference,style:'fill'},{text:expense.date,style:'fill'},{text:expense.name,style:'fill',colSpan:2},'',currencyText,{text:priceText,style:'fill'},changeRate,hufText,expense.paymentMethod_name]
        )
             

    }
    if(material.length == 1){
        tableBody.push(
            [{text:'',style:'fill',marginTop:8},{text:'',style:'fill'},{text:'',style:'fill',colSpan:2},'','',{text:'',style:'fill'},'','','']
             )

    }
    else if(material.length == 0){
        tableBody.push(
            [{text:'',style:'fill',marginTop:8},{text:'',style:'fill'},{text:'',style:'fill',colSpan:2},'','',{text:'',style:'fill'},'','',''],
            [{text:'',style:'fill',marginTop:8},{text:'',style:'fill'},{text:'',style:'fill',colSpan:2},'','',{text:'',style:'fill'},'','','']
             )

    }
    sumEUR += sumMaterialEUR;
    sumHUF += sumMaterialHUF
    if(sumMaterialEUR.toString().includes('.')){
        sumMaterialEUR = sumMaterialEUR.toFixed(2)
    }
    tableBody.push([{text:'',border:[false,false,false,false],colSpan:4},'','','',{text:'EUR'},{text:sumMaterialEUR == 0 ? "-" : sumMaterialEUR,bold:true},{text:'HUF',bold:true,border:[]},{text:sumMaterialHUF == 0 ? "-" : sumMaterialHUF,bold:true},{text:'',border:[]}],
                
        [{text:'',border:[false,false,false,false],colSpan:9,marginTop:15},'','','','','','','',''],
        

        //setting up 6th table
        [{text:'6. Utiköltség elszámolások',style:'subHeader',alignment:'start',colSpan:5},'','','','',{text:'Kifizetés:',style:'bluefill'},{text:'céges kártya/ banki utalás/ pénztár',style:'bluefill',colSpan:3},'',''],
        [{text:'msgPlaut HU iktatószám és megnevezés',rowSpan:2},{text:'Felmerülés',colSpan:3},'','',{text:'Valutanem',rowSpan:2},{text:'Összeg',rowSpan:2},{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja*',style:'bluefill',rowSpan:2}],
        ['',{text:'Ideje'},{text:'Jogcíme',colSpan:2},'',{text:''},{text:''},'','',''],

    )
    // filling 6th table
    var sumTripHUF = 0;
    var sumTripEUR = 0;
    for( const tripexp of tripExpenses){
        var priceHUF = 0;
        var priceEUR = 0;
        
        var currency = tripexp.currency_code;
        var currencyText = currency;
        var price = tripexp.price
        var priceText = '';
        var hufText = '';
        var changeRate = ""
        
        if(currency == 'EUR'){
           priceEUR = price
           priceText = priceEUR
           if(priceText.toString().includes('.')){
            priceText = parseFloat(priceText).toFixed(2)
            
        }
        }
        else if(currency == 'HUF'){
            priceHUF = price
            currencyText = ''
            hufText = priceHUF
        }
        else {
            
            priceText = price
            try {
                changeRate = parseFloat(await getExchangeRates(tripexp.date,currency))
            }
            catch(err){

                console.log(err)
                return err
            }
            
            
            priceHUF = changeRate*price
            
            hufText = priceHUF
        }

        if(currency == 'EUR'){
            if(tripexp.paymentMethod_ID < 4){
                paidByCompanyEUR += price

            }
            else if(tripexp.paymentMethod_ID < 8){
                paidByEmployeeEUR += price

            }
            else {
                borrowedEUR -= price

            }

         }
         else {
            if(tripexp.paymentMethod_ID < 4){
                paidByCompany += price

            }
            else if(tripexp.paymentMethod_ID < 8){
                paidByEmployee += price

            }
            else {
                borrowed -= price

            }

         }

        sumTripEUR += priceEUR
        sumTripHUF += priceHUF

        tableBody.push(
            [{text:tripexp.reference,style:'fill'},{text:tripexp.date,style:'fill'},{text:tripexp.name,style:'fill',colSpan:2},'',currency,{text:priceText,style:'fill'},changeRate,hufText,tripexp.paymentMethod_name],
        )


    }
    if(tripExpenses.length == 1){
        tableBody.push(
            [{text:'',style:'fill',marginTop:8},{text:'',style:'fill'},{text:'',style:'fill',colSpan:2},'','',{text:'',style:'fill'},'','','']
             )

    }
    else if(tripExpenses.length == 0){
        tableBody.push(
            [{text:'',style:'fill',marginTop:8},{text:'',style:'fill'},{text:'',style:'fill',colSpan:2},'','',{text:'',style:'fill'},'','',''],
            [{text:'',style:'fill',marginTop:8},{text:'',style:'fill'},{text:'',style:'fill',colSpan:2},'','',{text:'',style:'fill'},'','','']
             )

    }

    sumEUR += sumTripEUR
    sumHUF+= sumTripHUF
    if(sumTripEUR.toString().includes('.')){
        sumTripEUR = sumTripEUR.toFixed(2)
    }

    

    const options = {
  
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      if(sumEUR.toString().includes('.')){
        sumEUR = sumEUR.toFixed(2)  
    }

     
    

    var totalEUR = (PostingRegular.borrowedEUR-borrowedEUR)+paidByCompanyEUR+paidByEmployeeEUR-sumDailyEUR
    if(totalEUR.toString().includes('.')){
        totalEUR = totalEUR.toFixed(2)
    }
    if(borrowedEUR.toString().includes('.')){
        borrowedEUR = borrowedEUR.toFixed(2)  
    }
    if(PostingRegular.borrowedEUR.toString().includes('.')){
        PostingRegular.borrowedEUR = PostingRegular.borrowedEUR.toFixed(2)
    }
    if(paidByCompanyEUR.toString().includes('.')){
        paidByCompanyEUR = paidByCompanyEUR.toFixed(2)
    }
    if(paidByEmployeeEUR.toString().includes('.')){
        paidByEmployeeEUR = paidByEmployeeEUR.toFixed(2)
    }
    const totalHUF = (PostingRegular.borrowedHUF-borrowed)+paidByCompany+paidByEmployee-sumDailyHUF
    
    tableBody.push(
        
        
                [{text:'',border:[false,false,false,false],colSpan:4},'','','',{text:'EUR'},{text:sumTripEUR == 0 ? "-" : sumTripEUR,bold:true},{text:'HUF',bold:true,border:[]},{text:sumTripHUF == 0 ? "-" : sumTripHUF,bold:true},{text:'',border:[]}],
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                        
                [{text:'Összes elszámolt költség:',bold:true,border:[false,false,false,false],alignment:'start',colSpan:4,style:'subHeader'},'','','',{text:'EUR'},{text:sumEUR == 0 ? "-" : sumEUR,bold:true},{text:'HUF',border:[],bold:true},{text:sumHUF == 0 ? "-" : sumHUF,bold:true},{text:'',border:[]}],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                
                [{text:'Kijelentem, hogy a fentiekben felsorolt költségek teljes mértékben a vállalkozás érdekében merültek fel.',border:[false,false,false,false],colSpan:9,alignment:'left'},'','','','','','','',''],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                

                [{text:'',border:[false,false,false,false],colSpan:5},'','','','',{text:'kiküldetést elrendelő aláírása',border:[false,true,false,false],bold:true,colSpan:3,alignment:'center'},'','',{text:'',border:[]}],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                
                [{text:'7. Elszámolás valutában és forintban',border:[false,false,false,false],bold:true,alignment:'start',colSpan:4},'','','', {text:'Valutanem'},{text:'Összeg'},{text:'Árfolyam'},{text:'Forint'},{text:'',border:[]}],
                [{text:'Előre, utólagos elszámolásra felvett  valuta',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:PostingRegular.borrowedEUR,style:'fill'},{text:'-'},{text:PostingRegular.borrowedHUF},{text:'',border:[]}],
                [{text:'Cég által előre kifizetett összeg',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:paidByCompanyEUR,style:'fill'},{text:'-'},{text:paidByCompany},{text:'',border:[]}],
                [{text:'Dolgozó által fizetett összeg',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:paidByEmployeeEUR,style:'fill'},{text:'-'},{text:paidByEmployee},{text:'',border:[]}],
                [{text:'Elszámolt költségek (napidíjon kívül)',alignment:'left',bold:true,colSpan:4},'','','', {text:'EUR'},{text:totalEUR,style:'fill'},{text:'-'},{text:totalHUF},{text:'',border:[]}],
                [{text:'Visszafizetendő valuta',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:borrowedEUR,style:'fill'},{text:'-'},{text:borrowed},{text:'',border:[]}],
                [{text:'Még jár az utazónak valuta',alignment:'left',bold:true,colSpan:4},'','','', {text:'EUR'},{text:paidByEmployeeEUR,style:'fill'},{text:'-'},{text:paidByEmployee},{text:'',border:[]}],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:30},'','','','','','',''],
                [{text:date.toLocaleDateString('hu-HU',options),border:[false,false,false,true],colSpan:3},'','',{text:'',border:[false,false,false,false],colSpan:2},'',{text:'',border:[false,false,false,true],colSpan:3},'','',{text:'',border:[]}],
                    [{text:'dátum',border:[false,false,false,false],colSpan:3},'','',{text:'',border:[false,false,false,false],colSpan:2},'',{text:'kiküldött aláírása',bold:true,border:[false,false,false,false],colSpan:3},'','',{text:'',border:[]}]
                
                
               

    )
    
    
    

    var docDefinition = {
        
        pageMargins: [ 40, 60, 40, 60 ],
      content: [
          { text: 'Külföldi kiküldetési utasítás és költségelszámolás', style: 'header', marginBottom : 10},
           
           
           
           
        {
            table : {
                body : tableBody,
                widths: [60,'*','*','*','*',45,'*',40,'*'],
                
            },
            
            marginBottom: 30,
            
            alignment:'center'
        },
        
           
        
        
      ],
      
      
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center'
        },
        subHeader : {
            fontsize:10,
            bold: true,
            
        },
        textStyle : {
            fontSize :10
        },
        textBold : {
            fontsize:10,
            bold : true
        },
        fill : {
            fillColor: 'yellow'
        },
        bluefill : {
            fillColor: 'lightblue',
            bold: true
        }
       
      },
      
      defaultStyle: {
        fontSize: 8,
        font: 'Roboto'
        
      }
      
      
    }
    //console.log(JSON.stringify(docDefinition))
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

module.exports = { createPDFCarDirect, createPDFRegularDirect, getExchangeRates }