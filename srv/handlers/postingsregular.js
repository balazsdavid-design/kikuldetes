const { year } = require("@cap-js/postgres/lib/cql-functions");

async function beforeDeletePostingRegular(req) {
  const ID = req.data.ID
  const serialNumberKey = await SELECT.one`serialNumberEntity_yearMonth, serialNumberEntity_number`.from`PostingsRegular`.where`ID = ${ID}`
  const yearMonth = serialNumberKey.serialNumberEntity_yearMonth;
  const number = serialNumberKey.serialNumberEntity_number;
  await UPDATE`SerialNumbers`.where`yearMonth = ${yearMonth} and number = ${number}`.set`inUse = false`
}
async function beforeCreatePostingRegularDraft(req) {
     
        req.data.employee_ID = req.user.id
      
      req.data.status_ID = 1
      
}

async function afterReadPostingRegular(results,req) {
    const { user} = req

    for(const each of results){
      if(each.employee){
          var employee = each.employee
          each.employee.fullName = employee.name+" "+employee.lastName
        }
      each.backOffice =  user.is('Backoffice')

      each.submittable = (each.status_ID == 1 || each.status_ID == 3)

      each.accepted = each.status_ID == 4

    }
}

async function afterReadPostingRegularDraft(results,req) {
    const { user} = req
    
    for(const each of results){
      if(each.employee){
      var employee = each.employee
      each.employee.fullName = employee.name+" "+employee.lastName
    }
      each.editing = true
      if(user.is('Backoffice')){
        each.backOffice = true
        each.restriction = 2
      }
      else {
        each.backOffice = false
        each.restriction = 1 
      }
      
    }
}
async function beforeCreatePostingRegular(req) {
    
    
    var travelTo = new Date(req.data.travel_to)
    var travelBack = new Date(req.data.travel_back)
    travelBack.setHours(23)
    travelBack.setMinutes(59)
    travelBack.setSeconds(59)
    if(travelTo > travelBack){
      req.error(400,'DepartureLaterThanArrival')
    }
      
    for(var departure_arrival of req.data.departures_arrivals){
      var arrival = new Date(departure_arrival.arrival)
      var departure = new Date(departure_arrival.departure)
      if(departure > arrival){
        req.error(400,'DepArrArrivalLater')
      }
      if(departure < travelTo || departure > travelBack || arrival < travelTo || arrival > travelBack){
        req.error(400,'DepArrOutsideDate')
      }
    }   
    for (var daily of req.data.daily_expenses) {
        var dailyDate = new Date(daily.date)
        if(dailyDate < travelTo || dailyDate > travelBack){
          req.error(400,'DailyDateOutside')
        }
       
    }
    /*
    for(var accomodation of req.data.accomodations){
      var accDate = new Date(accomodation.date)
      if(accDate < travelTo || accDate > travelBack){
        req.error(400,'AccomodationDateOutside')
      }
     
    } 
    for( var material of req.data.material_expenses){
      var matDate = new Date(material.date)
      if(matDate< travelTo || matDate > travelBack){
        req.error(400,'MaterialDateOutside')
      }
      
    }
    for( var tripexp of req.data.trip_expenses){
      var tripDate = new Date(tripexp.date)
      if(tripDate< travelTo || tripDate > travelBack){
        req.error(400,'TripExpenseDateOutSide')
      }
    }
      
    */
    if(req.data.departures_arrivals.length < 2){
      req.error(400,'DepArrAtLeastTwo')
    }
    
  
      
        const yearMonth = `${travelBack.getFullYear()}-${String(travelBack.getMonth() + 1).padStart(2, '0')}`;
        let formattedNumber;
        let number;
        const freeSerialNumber = await (
        SELECT.one`number`.from`SerialNumbers`.where`yearMonth = ${yearMonth} and inUse = false`.orderBy`number asc`
        ) ?? {};
        if(freeSerialNumber.number){
       
          await UPDATE`SerialNumbers`.where`yearMonth = ${yearMonth} and number = ${freeSerialNumber.number}`.set`inUse = true`
          number = freeSerialNumber.number
        }
        else {
          const lastSerialNumber = await (
        SELECT.one`number`.from`SerialNumbers`.where`yearMonth = ${yearMonth} and inUse = true`.orderBy`number desc`
        ) ?? {};
          const lastNumber  = lastSerialNumber.number || 0;
          const newNumber = lastNumber + 1;
          number = newNumber
          await (
              INSERT.into`SerialNumbers`.entries({ yearMonth, number: newNumber, inUse: true })
          );
          
        }
        formattedNumber = String(number).padStart(2, '0');
        req.data.serialNumber = `${yearMonth}-${formattedNumber}`;
        req.data.serialNumberEntity_yearMonth = yearMonth;
        req.data.serialNumberEntity_number = number
       
        
        
        
          
        
        if(!req.user.is('Backoffice')){
          req.warn('SubmitReminder');
        }
        
        return req
}
async function beforeUpdatePostingRegular(req) {
    var borrowedHUF = req.data.borrowedHUF
    var borrowedEUR = req.data.borrowedEUR
    
    
    var travelTo = new Date(req.data.travel_to)
    var travelBack = new Date(req.data.travel_back)
    travelBack.setHours(23)
    travelBack.setMinutes(59)
    travelBack.setSeconds(59)
    if(travelTo > travelBack){
      req.error(400,'DepartureLaterThanArrival')
    }
      
    for(var departure_arrival of req.data.departures_arrivals){
      var arrival = new Date(departure_arrival.arrival)
      var departure = new Date(departure_arrival.departure)
      if(departure > arrival){
        req.error(400,'DepArrArrivalLater')
      }
      if(departure < travelTo || departure > travelBack || arrival < travelTo || arrival > travelBack){
        req.error(400,'DepArrOutsideDate')
      }
    }   
    for (var daily of req.data.daily_expenses) {
      var dailyDate = new Date(daily.date)
      if(dailyDate < travelTo || dailyDate > travelBack){
        req.error(400,'DailyDateOutside')
      }
      
  }
  /*
  for(var accomodation of req.data.accomodations){
    var accDate = new Date(accomodation.date)
    if(accDate < travelTo || accDate > travelBack){
      req.error(400,'AccomodationDateOutside')
    }
    
  } 
  for( var material of req.data.material_expenses){
    var matDate = new Date(material.date)
    if(matDate< travelTo || matDate > travelBack){
      req.error(400,'MaterialDateOutside')
    }
    
  }
  for( var tripexp of req.data.trip_expenses){
    var tripDate = new Date(tripexp.date)
    if(tripDate< travelTo || tripDate > travelBack){
      req.error(400,'TripExpenseDateOutSide ')
    }
    } */
    
    
      

    if(req.data.departures_arrivals.length < 2){
      req.error(400,'DepArrAtLeastTwo')
    }
    if(req.data.daily_expenses.length > 1){
      req.error(400,'MaxOneDaily')
    }
    if(!req.user.is('Backoffice')){
          req.warn('SubmitReminder');
        }
}
async function beforeReadPostingRegular(req) {
    const { user } = req;
    if(req.query.SELECT.columns){
      let i = 0
      while( i<req.query.SELECT.columns.length){
        if(req.query.SELECT.columns[i].ref){
        if(req.query.SELECT.columns[i].ref[0] == 'employee'){
          const existing = req.query.SELECT.columns[i].expand
          .filter(c => c.ref)
          .map(c => c.ref[0])

          const required = ["name", "lastName"]

          for (const field of required) {
            if (!existing.includes(field)) {
              req.query.SELECT.columns[i].expand.push({ ref: [field] })
              }
            }
            
            break
        }
      }
        i++

      }
    }

    
}
async function beforeReadPostingRegularDraft(req){
  if(req.query.SELECT.columns){
      let i = 0
      while( i<req.query.SELECT.columns.length){
        if(req.query.SELECT.columns[i].ref){
        if(req.query.SELECT.columns[i].ref[0] == 'employee'){
          const existing = req.query.SELECT.columns[i].expand
          .filter(c => c.ref)
          .map(c => c.ref[0])

          const required = ["name", "lastName"]

          for (const field of required) {
            if (!existing.includes(field)) {
              req.query.SELECT.columns[i].expand.push({ ref: [field] })
              }
            }
            
            break
        }
      }
        i++

      }
      
    }
}

module.exports = {
    afterReadPostingRegular,
    afterReadPostingRegularDraft,
    beforeCreatePostingRegular,
    beforeCreatePostingRegularDraft,
    beforeReadPostingRegular,
    beforeUpdatePostingRegular,
    beforeReadPostingRegularDraft,
    beforeDeletePostingRegular
}