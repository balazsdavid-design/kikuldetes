const { isEmployeeDataMissing, compareByDate, getLocalCountryName ,getExchangeRates} = require("./functions");

const { Builder } = require('xml2js');
const builder = new Builder()


async function createRegularXML(PostingRegular){
    const date = new Date();
    const year = date.getFullYear()
    const month =  date.getMonth().toString().padStart(2,"0")
    const day = date.getDate().toString().padStart(2,"0")
    const employee = PostingRegular.employee;
    const postingCountry = await getLocalCountryName(PostingRegular.country_code)
    var borrowed = PostingRegular.borrowedHUF
    var borrowedEUR = PostingRegular.borrowedEUR
    var paidByCompany = 0;
    var paidByCompanyEUR = 0;
    var paidByEmployee = 0;
    var paidByEmployeeEUR = 0
    if(isEmployeeDataMissing(employee)){
        return "EmployeeDataMissing"
    }
    const departures_arrivals = PostingRegular.departures_arrivals.sort((a,b) => (
        a.departure > b.departure ? 1 : b.departure > a.departure ? -1 : 0
    ));
    var deparrs = []
    for(const deparr of departures_arrivals){
        
        

        var departure = new Date(deparr.departure);
        var arrival = new Date(deparr.arrival);
        
        departure_time = departure.toLocaleTimeString('hu-HU',{ timeZone: 'Europe/Budapest' }).split(":") 
        
        
        
        arrival_time = arrival.toLocaleTimeString('hu-HU',{ timeZone: 'Europe/Budapest' }).split(":")
        
        deparrs.push({
            From_where : deparr.from_where,
            Departure_month : departure.getMonth()+1,
            Departure_day : departure.getDate(),
            Departure_time : `${departure_time[0]}:${departure_time[1]}`,
            To_where : deparr.to_where,
            Arrival_month : arrival.getMonth()+1,
            Arrival_day : arrival.getDate(),
            Arrival_time : `${arrival_time[0]}:${arrival_time[1]}`,
            Transporation_method : deparr.meanOfTransport_name,

        })

    }
    const daily = PostingRegular.daily_expenses.sort(compareByDate);
    var dailies = []
    for(const current of daily){
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
                    changeRate = await getExchangeRates(current.date,'EUR')
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
                    
                   
                 }
                 priceText = price
                 try {
                 changeRate = await getExchangeRates(current.date,currency)
                 }
                 catch(err){
                    return err
                 }
                 
                 priceHUF = changeRate*price
                 
                 hufText = priceHUF
                }

        dailies.push({
            Date : current.date,
            Days : current.days,
            PricePer : daily_price,
            Price : priceText,
            ChangeRate : changeRate,
            HUF : hufText,
            PaymentMethod : current.paymentMethod_name

        })
        
    
}

    const accomodations = PostingRegular.accomodations.sort(compareByDate)
    var accs = []
    for(const accomodation of accomodations){
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
                changeRate = await getExchangeRates(accomodation.date,'EUR')
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
                
                
             }
             priceText = price
            
            try {
           
            changeRate = await getExchangeRates(accomodation.date,currency)
            
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
            
        accs.push({
            AccomodationName : accomodation_string,
            Days : accomodation.days,
            PricePer : daily_price,
            Price : priceText,
            ChangeRate : changeRate,
            HUF : hufText,
            PaymentMethod : accomodation.paymentMethod_name

        })

    }
    const material = PostingRegular.material_expenses.sort(compareByDate)
    var mati = []
    for(const expense of material){
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
                changeRate = await getExchangeRates(expense.date,'EUR')
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
                
               
             }
            priceText = price
            try {
                changeRate = await getExchangeRates(expense.date,currency)
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
        mati.push({
            MatReference : expense.reference,
            Time : expense.date,
            MatName : expense.name,
            Price : priceText,
            ChangeRate : changeRate,
            HUF : hufText,
            PaymentMethod : expense.paymentMethod_name

        })

    }
    const tripExpenses = PostingRegular.trip_expenses.sort(compareByDate)
    var  tripexps = []
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
                changeRate = await getExchangeRates(tripexp.date,'EUR')
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
                
                
             }
            priceText = price
            try {
                changeRate = await getExchangeRates(tripexp.date,currency)
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

         

        tripexps.push({
            TripExpReference : tripexp.reference,
            Time : tripexp.date,
            TripExpName : tripexp.name,
            Price : priceText,
            ChangeRate : changeRate,
            HUF : hufText,
            PaymentMethod : tripexp.paymentMethod_name
        })

    }
    var HUFback = 0
    var EURback = 0
    var EURmore = 0
    var HUFmore = 0
    
    if(borrowed < 0){
        HUFmore = borrowed*(-1)
    }
    else {
        HUFback = borrowed
    }
    
    const xml = {
        PostingRegular : {
            Year : year,
            SerialNumber : PostingRegular.serialNumber,
            PostingInfo : {
                Employee_Name : employee.lastName+" "+employee.name,
                Employee_Position : employee.position,
                Country : postingCountry,
                Goal : PostingRegular.goal,
                Travel_to : PostingRegular.travel_to,
                Travel_back : PostingRegular.travel_back,
            },
            DeparturesArrivals : {
                DepartureArrival : deparrs
            },
            DailyExpenses : {
                DailyExpense : dailies,
                SumDaily : {
                    SumDailyChangeRate : 0
                }
            },
            Accomodations : {
                Accomodation : accs,
                SumAccomodationChangeRate : 0
            },
            MaterialExpenses : {
                MaterialExpense : mati,
                SumMaterial : {
                    //SumMaterialPrice : price,
                    SumMaterialChangeRate : 0,
                    //SumMaterialHUF : 0
                }
            },
            TripExpenses : {
                TripExpense : tripexps,
                SumTripExp : {
                    SumTripExpChangeRate : 0 // EVERY SUM EXCHANGERATE IS TODO
                }
            },
            SummarizationTable : {
                Borrowed : {
                    EUR : PostingRegular.borrowedEUR,
                    HUF : PostingRegular.borrowedHUF
                },
                PaidByCompany : {
                    EUR : paidByCompanyEUR,
                    HUF : paidByCompany
                },
                PaidByEmployee : {
                     EUR : paidByEmployeeEUR,
                    HUF : paidByEmployee
                },
                
                CurrencyToEmployer : {
                    EUR : EURback,
                    HUF : HUFback
                },
                CurrencyToEmployee : {
                    EUR : EURmore,
                    HUF : HUFmore
                }

            }


        }
    }
    return builder.buildObject(xml)

}

module.exports = { createRegularXML }