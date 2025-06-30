const { isEmployeeDataMissing, compareByDate, getLocalCountryName ,getExchangeRates} = require("./functions");

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');




pdfMake.addVirtualFileSystem(pdfFonts);
async function createRegularPDF(PostingRegular){
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
            var daily_price = current.daily_price
            var priceText = '';
            var hufText = '';
            var changeRate = ""
            
             if(currency == 'HUF'){
                 priceHUF = price
                 currencyText = 'EUR'
                 hufText = priceHUF
                 try {
                    changeRate = parseFloat(await getExchangeRates(current.date,'EUR'))
                    }
                    catch(err){
                       return err
                    }
                    daily_price = daily_price/changeRate
                    priceEUR = (daily_price*current.days)
                    priceText = priceEUR
             }
             else {
                if(currency == 'EUR'){
                    priceEUR = price
                    
                    if(priceText.toString().includes('.')){
                        priceText = priceText.toFixed(2)
                    }
                    current.daily_price = current.daily_price.toFixed(2)
                 }
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
            
                
                
                
             
             
                

             
            daily_price = daily_price.toString().includes('.') ? daily_price.toFixed(2) : daily_price
           priceText = priceText.toString().includes('.') ? priceText.toFixed(2) : priceText
            
            tableBody.push(
                [{text:current.date,style:'fill',colSpan:2},'',{text:current.days,style:'fill'},{text:currencyText},{text:daily_price,style:'fill'},{text:priceText},{text:changeRate},{text:hufText},{text:current.paymentMethod_name,bold:true,rowSpan:1}]
            )

        }
        // Minimum két sora legyen minden esetben, hogy nézzen ki valahogy
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
        sumHUF += sumDailyHUF
        sumEUR += sumDailyEUR
        if(sumDailyEUR.toString().includes('.')){
            sumDailyEUR = sumDailyEUR.toFixed(2)
        }
        
        
        
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
        daily_price = accomodation.daily_price
        const endDateString = (endDate.getMonth()+1).toString().padStart(2,"0")+"-"+endDate.getDate().toString().padStart(2,"0")
        const accomodation_string = `${accomodation.accomodation_name}, ${accomodation.date}-tól ${endDateString}-ig`
        
         if(currency == 'HUF'){
            priceHUF = price
            currencyText = 'EUR'
            hufText = priceHUF
            try {
                changeRate = parseFloat(await getExchangeRates(accomodation.date,'EUR'))
                }
                catch(err){
                    return err
                }
                daily_price = daily_price/changeRate
                priceEUR = daily_price*accomodation.days
                priceText = priceEUR
        }
        else {
            if(currency == 'EUR'){
                priceEUR = price
                
                if(priceText.toString().includes('.')){
                 priceText = parseFloat(priceText).toFixed(2)
                 accomodation.daily_price = accomodation.daily_price.toFixed(2)
             }
             }
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
        
        
            if(accomodation.paymentMethod_ID < 4){
                paidByCompanyEUR += priceEUR
                paidByCompany += priceHUF

            }
            else if(accomodation.paymentMethod_ID < 8){
                paidByEmployeeEUR += priceEUR
                paidByEmployee += priceHUF

            }
            else {
                borrowedEUR -= priceEUR
                borrowed -= priceHUF

            }

            
         
            

         

        sumAccomodationHUF+= priceHUF;
        sumAccomodationEUR += priceEUR;
        daily_price = daily_price.toString().includes('.') ? daily_price.toFixed(2) : daily_price
        priceText = priceText.toString().includes('.') ? priceText.toFixed(2) : priceText
        tableBody.push(
            [{text:accomodation_string,style:'fill',colSpan:2},'',{text:accomodation.days,style:'fill'},currencyText,{text:daily_price,style:'fill'},priceText,changeRate,hufText,{text:accomodation.paymentMethod_name,bold:true}],
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
        
        
        if(currency == 'HUF'){
            priceHUF = price
            currencyText = 'EUR'
            hufText = priceHUF
            try {
                changeRate = parseFloat(await getExchangeRates(expense.date,'EUR'))
                }
                catch(err){
                    return err
                }
                
                priceEUR = priceHUF/changeRate
                priceText = priceEUR
        }
        else {
            if(currency == 'EUR'){
                priceEUR = price
                
                if(priceText.toString().includes('.')){
                 priceText = priceText.toFixed(2)
                 
             }
             }
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

        
            if(expense.paymentMethod_ID < 4){
                paidByCompanyEUR += priceEUR
                paidByCompany += priceHUF

            }
            else if(expense.paymentMethod_ID < 8){
                paidByEmployeeEUR += priceEUR
                paidByEmployee += priceHUF

            }
            else {
                borrowedEUR -= priceEUR
                borrowed -= priceHUF

            }

         
         

        
        sumMaterialHUF += priceHUF
        sumMaterialEUR += priceEUR
        //filling 5th table
        
           priceText = priceText.toString().includes('.') ? priceText.toFixed(2) : priceText
        tableBody.push(
            [{text:expense.reference,style:'fill'},{text:expense.date,style:'fill'},{text:expense.name,style:'fill',colSpan:2},'',currencyText,{text:priceText,style:'fill'},changeRate,hufText,{text:expense.paymentMethod_name,bold:true}]
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
        
        
        if(currency == 'HUF'){
            priceHUF = price
            currencyText = ''
            hufText = priceHUF
            priceHUF = price
            currencyText = 'EUR'
            hufText = priceHUF
            try {
                changeRate = parseFloat(await getExchangeRates(tripexp.date,'EUR'))
                }
                catch(err){
                    return err
                }
                
                priceEUR = priceHUF/changeRate
                priceText = priceEUR
        }
        else {
            if(currency == 'EUR'){
                priceEUR = price
                
                if(priceText.toString().includes('.')){
                 priceText = parseFloat(priceText).toFixed(2)
                 
             }
             }
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

       
            if(tripexp.paymentMethod_ID < 4){
                paidByCompanyEUR += priceEUR
                paidByCompany += priceHUF

            }
            else if(tripexp.paymentMethod_ID < 8){
                paidByEmployeeEUR += priceEUR
                paidByEmployee += priceHUF

            }
            else {
                borrowedEUR -= priceEUR
                borrowed -= priceHUF

            }

         
         
            

         

        sumTripEUR += priceEUR
        sumTripHUF += priceHUF
        
        priceText = priceText.toString().includes('.') ? priceText.toFixed(2) : priceText
        tableBody.push(
            [{text:tripexp.reference,style:'fill'},{text:tripexp.date,style:'fill'},{text:tripexp.name,style:'fill',colSpan:2},'',currency,{text:priceText,style:'fill'},changeRate,hufText,{text:tripexp.paymentMethod_name,bold:true}],
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

     
    var HUFback = 0
    var EURback = 0
    var EURmore = 0
    var HUFmore = 0
    console.log(borrowed+" "+borrowedEUR)
    if(borrowed < 0){
        HUFmore = borrowed*(-1)
    }
    else {
        HUFback = borrowed
    }
    if(borrowedEUR < 0){
        EURmore = borrowedEUR*(-1)
        if(EURmore.toString().includes('.')){
            EURmore = EURmore.toFixed(2)  
        }
    }
    else {
        EURback = borrowedEUR
        if(EURback.toString().includes('.')){
            EURback = EURback.toFixed(2)  
        }
    }
    console.log(borrowed+" "+borrowedEUR)
    var totalEUR = (PostingRegular.borrowedEUR-borrowedEUR)+paidByCompanyEUR+paidByEmployeeEUR-sumDailyEUR
    if(totalEUR.toString().includes('.')){
        totalEUR = totalEUR.toFixed(2)
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
    const totalHUF = sumHUF-sumDailyHUF
    
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
                [{text:'Visszafizetendő valuta',alignment:'left',colSpan:4},'','','', {text:'EUR'},{text:EURback,style:'fill'},{text:'-'},{text:HUFback},{text:'',border:[]}],
                [{text:'Még jár az utazónak valuta',alignment:'left',bold:true,colSpan:4},'','','', {text:'EUR'},{text:EURmore,style:'fill'},{text:'-'},{text:HUFmore},{text:'',border:[]}],
                
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

module.exports = createRegularPDF