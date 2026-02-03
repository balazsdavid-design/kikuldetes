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
    
  
    const db = cds.transaction(req);
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        
        const result = await db.run(
        SELECT`lastNumber`.from`SerialNumbers`.where`yearMonth = ${yearMonth}`
        ) ?? [];
        const  {lastNumber = 0} = result[0] || {};
        
        const newNumber = lastNumber + 1;
        const formattedNumber = String(newNumber).padStart(2, '0'); 
        
        
        await db.run(
            UPSERT.into`SerialNumbers`.entries({ yearMonth, lastNumber: newNumber })
        );

        req.data.serialNumber = `${yearMonth}-${formattedNumber}`;
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
    beforeReadPostingRegularDraft
}