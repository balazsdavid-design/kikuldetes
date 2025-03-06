const PdfPrinter = require('pdfmake');

const {fonts  }= require('./fonts')

const printer = new PdfPrinter(fonts);

const fs = require('fs');


async function createPDFCarDirect(PostingWithCar) {
    const date = new Date();
    const year = date.getFullYear()
    const month =  date.getMonth() < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    const day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
    const employee = PostingWithCar.employee;
    const data = PostingWithCar.data;
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
        var fuel = PostingWithCar.fuel_price*(trip.mileage/100*PostingWithCar.fuel_consumption);
        var norm = trip.mileage*PostingWithCar.amortization;
       var tripData = [
        {text:index+"."},{text:trip.date,fillColor:'lightblue'},{text:trip.from_where,fillColor:'lightblue'},{text:trip.to_where,fillColor:'lightblue'},'',{text:trip.mileage,fillColor:'lightblue'},{text:fuel,fillColor:'lightblue'},{text:norm,fillColor:'lightblue'},{text:trip.daily_expense,fillColor:'lightblue'}]
        tableBody.push(tripData)
        sumMileage+= trip.mileage;
        sumFuel+= fuel;
        sumNorm += norm;
        sumDaily += trip.daily_expense
        index++;
    })
        const total = sumDaily+sumFuel+sumNorm
       
       
      tableBody.push(
        [{text:'Összesen:',colSpan:5,bold:true,alignment:'left',},'','','','',sumMileage,sumFuel,sumNorm,sumDaily],
        ['3.',{text:'Autopálya matrica Magyarország',colSpan:3,alignment:'left'},'','','','',{text:'',colSpan:3},'',''],
        ['4.',{text:'Autopálya matrica Szlovénia',colSpan:3,alignment:'left'},'','','','',{text:'',colSpan:3},'',''],
        [{text:'Költségtérítés mindösszesen:',colSpan:6,alignment:'right',bold:true},'','','','','',{text:total,colSpan:3,alignment:'center',bold:true},'',''],
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
                          ['ssz.',{text:'2023-01-01',fillColor:'lightblue',alignment:'center'}]
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
                            [{text:'Címe:'},{text: '1065 Budapest Bajcsy-Zsilinszky út. 65. 1/3.',fillColor:'lightblue'}],
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
                          [{text:'Forgalmi rendszám, típus',colSpan:3},'','',{text:PostingWithCar.plateNum,colSpan:2,fillColor:'lightblue'},'',{text:'Fogyasztási normája:',colSpan:2},'',{text:PostingWithCar.fuel_consumption,fillColor:'lightblue'},{text:'liter/100km'}],
                          [{text:'Üzemanyag:',colSpan:2},'',{text:PostingWithCar.fuel_type_name,fillColor:'lightblue'},{text:'Hengerűrtartalom:'},{text:PostingWithCar.cylinder_volume,fillColor:'lightblue'},{text:'Üz.ag ár:'},{text:PostingWithCar.fuel_price},{text:'Amort. (Ft/km):'},{text:PostingWithCar.amortization,fillColor:'lightblue'}],
                          
                          ],
                          
                      
                  },
                  
              },
              
              
              {
                  
            table: {
                                               
              widths: ['auto',50,50,54,'auto',60,55,75,'*'],
              
               
              body: tableBody 
              
              
            },
            alignment:'center',
            marginBottom: 40,
          },
          {
             
              table: {
                  widths: [100,100,70,100,100],
                  
                  body:[
                      [{text:'Igazolta:',border: [false,false,false,false]}, {text:'Bartha Levente',alignment:'center',border: [false,false,false,true]},{text:'',border: [false,false,false,false]},{text:'Utalványozta:',border: [false,false,false,false]}, {text:'Bartha Levente',alignment:'center',border: [false,false,false,true]}],
                      
                     
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
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`${PostingWithCar.goal.replace(" ","")}_${year}_${month}_${day}.pdf`));
    pdfDoc.end();
}

async function createPDFRegularDirect(PostingRegular){
    console.log(PostingRegular)
    const date = new Date();
    const year = date.getFullYear()
    const month =  date.getMonth() < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    const day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
    const employee = PostingRegular.employee;
    const departures_arrivals = PostingRegular.departures_arrivals;
    const daily = PostingRegular.daily_expenses;
    const accomodations = PostingRegular.accomodations
    const material = PostingRegular.material_expenses
    var tableBody =  [
        [{text:'',border:[false,false,false,false],colSpan:4},'','','',{text:'Év:',border:[false],alignment:'right'},{text:'2022',style:'fill',bold:true},{text:'Sorszám:',border:[false]},{text:'2025-00-00',style:'fill',bold:true,colSpan:2},''],   
        [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','','',''],    
            
          // first table  
        [{text: '1. A kiküldetésre vonatkozó rendelkezések:',style:'subHeader',alignment:'start',colSpan:9,border:[false,false,false,false]},'','','','','','','',''],
        [{text:'Kiküldött neve',colSpan:2,alignment:'left'},'',{text:employee.name,style:'fill',bold:true,colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'beosztása',colSpan:2,alignment:'left'},'',{text:employee.position,style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'munkáltatója',colSpan:2,alignment:'lef'},'',{text:'msg Plaut Hungary Kft.',style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
        [{text:'Kiküldetési ország',colSpan:2,alignment:'left'},'',{text:PostingRegular.country_code,style:'fill',colSpan:7,alignment:'left'},'','','','','',''],
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
            {text:data.to_where,style:'fill'},{text:arrival.getMonth()+1,style:'fill'},{text:arrival.getDate(),style:'fill'},{text:`${arrival_time[0]}:${arrival_time[1]}`,style:'fill'},{text:'',style:'fill'}])
    })
    //third table setup
    tableBody.push( [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','','',''],
        [{text:'3.Napidíjelszámolás', style : 'subHeader',colSpan:5,alignment:'start'},'','','','',{text:'Kifizetés:',style:'bluefill'},{text:'bérrel együtt',colSpan:3,style:'bluefill'},'',''],
        [{text:'Viszonylat/dátum',rowSpan:2,colSpan:2},'',{text:'Napok',rowSpan:2},{text:'Felszámított napidíj',colSpan:3},'','',{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja',rowSpan:2,style:'bluefill'}],
        ['','','',{text:'Valutanem'},{text:'Egy napra'},{text:'Összes'},'','',''],
    )
    
        var sumDaily = 0;
        // third table filling
        daily.forEach( current => {
            var price = current.days*current.daily_price
            sumDaily += price;
            var HUF = 0;
            var EUR = 0;
            if(current.currency == "HUF"){
                HUF= price
            }
            else {
                EUR= price
            }
            sumDaily+= price
             var currentDate = new Date(current.date)
             
             var cmonth =  currentDate.getMonth() < 10 ? "0"+(currentDate.getMonth()+1) : currentDate.getMonth()+1;
            var cday = currentDate.getDate() < 10 ? "0"+currentDate.getDate() : currentDate.getDate();
            var date = `${currentDate.getFullYear()}.${cmonth}.${cday}`
            text = '';
            if(current == daily[0]){
                text = 'Bérrel együtt'

            }
            tableBody.push(
                [{text:date,style:'fill',colSpan:2},'',{text:current.days,style:'fill'},{text:'EUR'},{text:current.daily_price,style:'fill'},{text:''},{text:''},{text:''},{text:text,bold:true,rowSpan:daily.length}]
            )

        })
        
        
        tableBody.push(
            [{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'EUR'},{text:'-',bold:true},{text:'HUF',bold:true,border:[]},{text:'-',bold:true},{text:'',border:[]}],
            [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','','',''],
            // setting up 4th table
            [{text:'4. Szállásköltségelszámolás',style:'subHeader',alignment:'start',colSpan:4},'','','','',{text:'Kifizetés:',style:'bluefill'},{text:'céges kártya/ banki utalás/ pénztár',style:'bluefill',colSpan:3},'',''],
            [{text:'Szálloda',rowSpan:2,colSpan:2},'',{text:'Napok',rowSpan:2},{text:'Felszámított napidíj',colSpan:3},'','',{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja*',style:'bluefill',rowSpan:2}],
            ['','','',{text:'Valutanem'},{text:'Egy napra'},{text:'Összes'},'','',''],
                    )
        

                    
    
    var sumAccomodationHUF = 0;
    var sumAccomodationEUR = 0;
    //filling 4th table
    accomodations.forEach( accomodation => {
        var priceHUF = 0;
        var priceEUR =  0;
        if(accomodation.currency == 'EUR'){
           priceEUR = accomodation.daily_price*accomodation.days
        }
        else {
            priceHUF = accomodation.daily_price*accomodation.days
        }
        sumAccomodationHUF+= priceHUF;
        sumAccomodationEUR += priceEUR;
        tableBody.push(
            [{text:accomodation.accomodation_name,style:'fill',colSpan:2},'',{text:accomodation.days,style:'fill'},'EUR',{text:accomodation.daily_price,style:'fill'},'','','',{text:'Banki utalás'}],
             )
    })

       
    sumEUR += sumAccomodationEUR;
    sumHUF += sumAccomodationHUF;
    tableBody.push( 
        [{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'',border:[]},{text:'EUR'},{text:'-',bold:true},{text:'HUF',bold:true,border:[]},{text:'-',bold:true},{text:'',border:[]}],
        [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','','',''],
        // setting up 5th table
        [{text:'5. Dologi kiadások elszámolása',style:'subHeader',alignment:'start',colSpan:5},'','','','',{text:'Kifizetés:',style:'bluefill'},{text:'céges kártya/ banki utalás/ pénztár',style:'bluefill',colSpan:3},'',''],
        [{text:'Hivatk.',rowSpan:2},{text:'Felmerülés',colSpan:3},'','',{text:'Valutanem',rowSpan:2},{text:'Összeg',rowSpan:2},{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja*',style:'bluefill',rowSpan:2}],
        ['',{text:'Ideje'},{text:'Jogcíme',colSpan:2},'',{text:''},{text:''},'','',''],
    )

   
    var sumMaterialHUF = 0
    var sumMaterialEUR = 0
    material.forEach( expense => {
        var priceHUF =0;
        var priceEUR= 0;
        
        if(expense.currency = 'HUF'){
            priceHUF = expense.price
        }
        else {
            priceEUR = expense.price
        }
        var expDate = new Date(expense.date)
        var matmonth =  expDate.getMonth() < 10 ? "0"+(expDate.getMonth()+1) : expense.date.getMonth()+1;
        var matday = expDate.getDate() < 10 ? "0"+expDate.getDate() : expDate.getDate();
        var matdate = `${expDate.getFullYear()}.${matmonth}.${matday}`
        sumMaterialHUF += priceHUF
        sumMaterialEUR += priceEUR
        //filling 5th table
        tableBody.push(
            [{text:expense.reference,style:'fill'},{text:matdate,style:'fill'},{text:expense.name,style:'fill',colSpan:2},'','EUR',{text:'',style:'fill'},'','','']
        )
             

    })
    sumEUR += sumMaterialEUR;
    sumHUF += sumMaterialHUF
    tableBody.push(
        [{text:'',border:[false,false,false,false],colSpan:4},'','','',{text:'EUR'},{text:'-',bold:true},{text:'HUF',bold:true,border:[]},{text:'-',bold:true},{text:'',border:[]}],
                
        [{text:'',border:[false,false,false,false],colSpan:9,marginTop:70},'','','','','','','',''],
        

        //setting up 6th table
        [{text:'6. Utiköltség elszámolások',style:'subHeader',alignment:'start',colSpan:5},'','','','',{text:'Kifizetés:',style:'bluefill'},{text:'céges kártya/ banki utalás/ pénztár',style:'bluefill',colSpan:3},'',''],
        [{text:'msgPlaut HU iktatószám és megnevezés',rowSpan:2},{text:'Felmerülés',colSpan:3},'','',{text:'Valutanem',rowSpan:2},{text:'Összeg',rowSpan:2},{text:'Árfolyam',rowSpan:2},{text:'Forint',rowSpan:2},{text:'Kifizetés módja*',style:'bluefill',rowSpan:2}],
        ['',{text:'Ideje'},{text:'Jogcíme',colSpan:2},'',{text:''},{text:''},'','',''],
        [{text:'',style:'fill'},{text:'',style:'fill'},{text:'',style:'fill',colSpan:2},'','EUR',{text:'',style:'fill'},'','','Céges EUR kártya'],
                [{text:'',border:[false,false,false,false],colSpan:4},'','','',{text:'EUR'},{text:'-',bold:true},{text:'HUF',bold:true,border:[]},{text:'-',bold:true},{text:'',border:[]}],
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                        
                [{text:'Összes elszámolt költség:',bold:true,border:[false,false,false,false],alignment:'start',colSpan:4,style:'subHeader'},'','','',{text:'EUR'},{text:'165,60',bold:true},{text:'HUF',border:[],bold:true},{text:'30020',bold:true},{text:'',border:[]}],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                
                [{text:'Kijelentem, hogy a fentiekben felsorolt költségek teljes mértékben a vállalkozás érdekében merültek fel.',border:[false,false,false,false],colSpan:9,alignment:'left'},'','','','','','','',''],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                

                [{text:'',border:[false,false,false,false],colSpan:5},'','','','',{text:'kiküldetést elrendelő aláírása',border:[false,true,false,false],bold:true,colSpan:3,alignment:'center'},'','',{text:'',border:[]}],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:10},'','','','','','',''],
                
                [{text:'7. Elszámolás valutában és forintban',border:[false,false,false,false],bold:true,alignment:'start',colSpan:4},'','','', {text:'Valutanem'},{text:'Összeg'},{text:'Árfolyam'},{text:'Forint'},{text:'',border:[]}],
                [{text:'Előre, utólagos elszámolásra felvett  valuta',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:'-',style:'fill'},{text:'-'},{text:'-'},{text:'',border:[]}],
                [{text:'Cég által előre kifizetett összeg',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:'165,60',style:'fill'},{text:'-'},{text:'-'},{text:'',border:[]}],
                [{text:'Dolgozó által fizetett összeg',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:'-',style:'fill'},{text:'-'},{text:'-'},{text:'',border:[]}],
                [{text:'Elszámolt költségek (napidíjon kívül',alignment:'left',bold:true,colSpan:4},'','','', {text:'EUR'},{text:'165,60',style:'fill'},{text:'-'},{text:'30020'},{text:'',border:[]}],
                [{text:'Visszafizetendő valuta',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:'-',style:'fill'},{text:'-'},{text:'-'},{text:'',border:[]}],
                [{text:'Még jár az utazónak valuta',alignment:'left',bold:true,colSpan:4},'','','', {text:'HUF'},{text:'-',style:'fill'},{text:'-'},{text:'-'},{text:'',border:[]}],
                
                [{text:'',border:[false,false,false,false],colSpan:9,marginTop:30},'','','','','','',''],
                [{text:'2022 június 16.',border:[false,false,false,true],colSpan:3},'','',{text:'',border:[false,false,false,false],colSpan:2},'',{text:'',border:[false,false,false,true],colSpan:3},'','',{text:'',border:[]}],
                    [{text:'dátum',border:[false,false,false,false],colSpan:3},'','',{text:'',border:[false,false,false,false],colSpan:2},'',{text:'kiküldött aláírása',bold:true,border:[false,false,false,false],colSpan:3},'','',{text:'',border:[]}]
                
                
               

    )
    
    
    

    var docDefinition = {
        
        pageMargins: [ 40, 60, 40, 120 ],
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
        
            {
                table: {
                    body : [
                        [{text:'*Kifizetés módja',border:[false,false,false,false],rowSpan:5,alignment:'left'}, {text:'HUF/EUR Pénztár',border:[false,false,false,false],alignment:'left'}],
                        ['',{text:'Banki utalás',border:[false,false,false,false],alignment:'left'}],
                        ['',{text:'Céges kártya',border:[false,false,false,false],alignment:'left'}],
                        ['',{text:'Hóközi kifizetés',border:[false,false,false,false],alignment:'left'}],
                        ['',{text:'Bérrel együtt',border:[false,false,false,false],alignment:'left'}]
                        
                        ],
                        
                    widths: [110,'auto']
                       
                    
                    
                },
                alignment:'center',
                
            }
        
        
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
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`${PostingRegular.goal.replace(" ","")}_${year}_${month}_${day}.pdf`));
    pdfDoc.end();

}

module.exports = { createPDFCarDirect, createPDFRegularDirect }