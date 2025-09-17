
const cds = require("@sap/cds");

const tx = cds.tx();
const axios = require('axios');
const { createRegularXML } = require("./regular");
const { createCarXML } = require("./car");
const { getPDF, getBearerToken,  } = require("./functions");



class AppService extends cds.ApplicationService {
  init() {
      
    this.before('CREATE','PostingsWithCar.drafts', async(req) => {
      
      
      if(!req.user.is('Backoffice')){
        req.data.employee_ID = req.user.id
        
      }
      req.data.status_ID = 1
    })
    this.before('CREATE','PostingsRegular.drafts', async(req) => {
      
      if(!req.user.is('Backoffice')){
        req.data.employee_ID = req.user.id
      }
      req.data.status_ID = 1
    })


    this.before('CREATE', 'PostingsWithCar', async(req) => {
     

      if(req.data.stickers){
        var date = new Date();
        for(var sticker of req.data.stickers){
          // Validálom az autópálya matricák dátumát
          var reqDate = new Date(sticker.date)
          if(reqDate > date){
            req.error(400,'StickerError')
          }
        }
       outerloop: for(var data of req.data.data){
          for(var nextdata of req.data.data){
            if(data != nextdata){
              if(data.daily_expense > 0 && nextdata.daily_expense > 0 && data.date == nextdata.date){
                req.error(400,'DailyExpenseError')
                break outerloop;
              }
            }
          }
        }
      }
      if(req.data.data.length < 2){ // Ha kevesebb mint két sor akkor hiba
        req.error(400,'TripDataAtleastTwo')
      }
      
      
      const db = cds.transaction(req);
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      // Sorszám létrehozása
      
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
    })
    this.before('UPDATE', 'PostingsWithCar', async(req) => {
      

      if(req.data.stickers){
        var date = new Date();
        for(var sticker of req.data.stickers){
          
          var reqDate = new Date(sticker.date)
          if(reqDate > date){
            req.error(400,'StickerError')
          }
        }
      }
      outerloop : for(var data of req.data.data){
        for(var nextdata of req.data.data){
          if(data != nextdata){
            if(data.daily_expense > 0 && nextdata.daily_expense > 0 && data.date == nextdata.date){
              
              
              req.error(400,'DailyExpenseError')
              break outerloop;
              
            }
          }
        }
      }

      if(req.data.data.length < 2){//var vcap_services = JSON.parse(process.env.VCAP_SERVICES)
        req.error(400,'TripDataAtleastTwo')
      }
      
    })
    this.before('READ','PostingsWithCar', async (req ) => {
      const { user } = req;
      
        
      
      
      if (!user.is('Backoffice')) {
        
          
          req.query.where({ employee_ID: user.id });
          
          
           
      }
      
       
          
         
          
          

        
        
        

  });

  this.before('READ','Employees', async(req) => {
    const { user } = req;
      
    
    const employee = await SELECT.one.from('Employees', e => { e`.*`}).where({ID:user.id})
  
    if(!employee){
      const fullName = user.attr.familyName+" "+user.attr.givenName
    
    
      await INSERT.into`Employees`.entries({ID:user.id,name:fullName})
    }
      
        
        if(!user.is('Backoffice')){
          req.query.where({ ID: user.id });

        }  
          
          
          
           
      

  })
  this.before('UPDATE','Employees',async(req) => {
    const { user } = req;
    
      if(req.data.ID != user.id){
        req.error(400, "Restricted")
      }
      

    

  })
  this.before('DELETE','Employees',async(req) => {
    const { user } = req;
    if(req.data.ID != user.id){
      req.error(400, "Restricted")
    }
  })
 
  this.before('CREATE','Employees.drafts', async(req) => {
    
    const { user } = req
    
    
    const employee = await SELECT.one.from('Employees').where({ID:user.id})
    if(employee){
      req.error(400,"Restricted")
    }
    else {
      req.data.ID = req.user.id
    }
    
    
  })

  this.after('READ', 'PostingsWithCar', async(results,req ) => {
    
    const { user} = req
   
    for(let each of results){
       
      if(user.is('Backoffice')){
        

        each.backOffice = true
        
      }
      else {
        each.backOffice = false
      }
      if(each.status_ID == 1 || each.status_ID == 3){
        each.submittable = true
      }
      else {
        each.submittable = false
      }
      
    }
    
  })
  this.after('READ', 'PostingsRegular', async(results,req ) => {
    
    const { user} = req

    
    for(let each of results){
      
      each.backOffice =  true //user.is('Backoffice')
      if(each.status_ID == 1 || each.status_ID == 3){
        each.submittable = true
      }
      else {
        each.submittable = false
      }
      
    }
    
  })
  this.after('READ', 'PostingsRegular.drafts', async(results,req ) => {
    
    const { user} = req
    
    for(let each of results){
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
    
  })
  this.after('READ','PostingsWithCar.drafts', async(results,req)=>{
      const { user} = req
      
      
      for(let each of results){
        
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
      
    
  
  })
  
  
  
  
  this.before('CREATE', 'PostingsRegular', async(req) => {
   
    
    
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
      
    
    if(req.data.departures_arrivals.length < 2){
      req.error(400,'DepArrAtLeastTwo')
    }
    
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
  })
  this.before("UPDATE",'PostingsRegular', async(req) => {
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
    
    
      

    if(req.data.departures_arrivals.length < 2){
      req.error(400,'DepArrAtLeastTwo')
    }
    
    
  }}
)

  
  this.before("CREATE", 'FuelPrices.drafts', async(req) => {
    var date = new Date();
    
    const yearMonth = date.getFullYear()+"-"+(date.getMonth()+1).toString().padStart(2,"0")
    var existing = await SELECT.one.from('FuelPrices').where({yearMonth:yearMonth})
    
    if(existing){
      req.error(400,'FuelPriceAlready')
    }
    else {
      req.data.yearMonth = yearMonth
    }
    
    
  })
  this.before("CREATE",'PaymentMethods.drafts', async(req) => {
    
    var lastID = (await SELECT.from('PaymentMethods').orderBy('ID desc'))
    if(lastID.length == 0){
      lastID = 1
    }
    else {
      lastID = lastID[0].ID
    }
    
    req.data.ID = lastID+1;
  })
  this.before("CREATE",'MeansOfTransport.drafts', async(req) => {
    
    var lastID = (await SELECT.from('MeansOfTransport').orderBy('ID desc'))
    
    if(lastID.length == 0){
      lastID = 1
    }
    else {
      lastID = lastID[0].ID
    }
    
    req.data.ID = lastID+1;
  })
  this.before("CREATE",'FuelConsumptions.drafts', async(req) => {
    
    var lastID = (await SELECT.from('FuelConsumptions').orderBy('ID desc'))
    if(lastID.length == 0){
      lastID = 1
    }
    else {
      lastID = lastID[0].ID
    }
    
    req.data.ID = lastID+1;
  })

  this.before('READ','PostingsRegular', async (req) => {
    const { user } = req;

    if (!user.is('Backoffice')) {
      // Ha a user nem Backoffice, a query-ben szűrök a saját kiküldetéseire
        req.query.where({ employee_ID: user.id }); 
    }
    
});

    this.on('getPDFCar',this.getPDFCar)
    

    this.on('getPDFRegular',this.getPDFRegular)

    this.on('submit', async(req) => {
      
      
      var id = req.params[0]['ID']
     
      
      await UPDATE ('PostingsWithCar',id).set({status_ID : 2})
      // Frissítem az entitásoldalon a státuszt
      const updated = await SELECT.one('PostingsWithCar', p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      // Beállítom a virtuális mezőket
      updated.submittable = false
      updated.backOffice = req.user.is('Backoffice')
     
      updated.IsActiveEntity =true
      // Lekérem a lokalizált szövegét 
      var text = await SELECT.one('Statuses.texts').where({ID:2,locale:'hu'})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
    
      
    })
    this.on('unsubmit', async(req) => {
      
      var id = req.params[0]['ID']
     
      
      await UPDATE ('PostingsWithCar',id).set({status_ID : 1})
      const updated = await SELECT.one('PostingsWithCar', p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      updated.submittable = true
      updated.backOffice = req.user.is('Backoffice')
      
      updated.IsActiveEntity =true
      
      var text = await SELECT.one('Statuses.texts').where({ID:1,locale:'hu'})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
    
      
    })
    this.on('reject', async(req) => {
      
      var id = req.params[0]['ID']
     
      
      
      
      

      
      await UPDATE ('PostingsWithCar',id).set({status_ID : 3})
      
      const updated = await SELECT.one('PostingsWithCar', p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      
      updated.submittable = true
      updated.backOffice = req.user.is('Backoffice')
    
      updated.IsActiveEntity = true
      
      var text = await SELECT.one('Statuses.texts').where({ID:3,locale:'hu'})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
     
      
    })
    this.on('submitRegular', async(req) => {
      
      
      var id = req.params[0]['ID']
     
      
      await UPDATE ('PostingsRegular',id).set({status_ID : 2})
      const updated = await SELECT.one('PostingsRegular', p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      updated.submittable = false
      updated.backOffice = req.user.is('Backoffice')
     
      updated.IsActiveEntity =true
      
      var text = await SELECT.one('Statuses.texts').where({ID:2,locale:'hu'})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
    
      
    })
    this.on('unsubmitRegular', async(req) => {
      
      var id = req.params[0]['ID']
     
      
      await UPDATE ('PostingsRegular',id).set({status_ID : 1})
      const updated = await SELECT.one('PostingsRegular', p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      updated.submittable = true
      updated.backOffice = req.user.is('Backoffice')
      
      updated.IsActiveEntity =true
      
      var text = await SELECT.one('Statuses.texts').where({ID:1,locale:'hu'})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
    
      
    })
    this.on('rejectRegular', async(req) => {
      
      var id = req.params[0]['ID']
     
      
      
      
      

      
      await UPDATE ('PostingsRegular',id).set({status_ID : 3})
      
      const updated = await SELECT.one('PostingsRegular', p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      
      updated.submittable = true
      updated.backOffice = req.user.is('Backoffice')
    
      updated.IsActiveEntity = true
      
      var text = await SELECT.one('Statuses.texts').where({ID:3,locale:'hu'})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
     
      
    })


    return super.init()
  }
 
  


  async getPDFCar(id)  {
    
      // Lekérdezem az entity-t
    const entity =  await SELECT.one('PostingsWithCar', p => {
      p`.*`,p.employee (e => {e`.*`}), 
      p.fuel_type.name, p.data ( d => { d`.*`}), p.stickers ( s => {s`*`}, )
    }).where({ID:id})
    try {
      // A segédfüggvényemmel elkészítem buffer formátumba a PDF-et
        var vcap_services
           var username
           var password
           var authURL
           var apiURL
      try {
      //vcap_services = JSON.parse(process.env.VCAP_SERVICES)
      
    
      }
  catch(exception){
    console.log(exception)
  }
     username = vcap_services.adsrestapi[0].credentials.uaa.clientid
     password = vcap_services.adsrestapi[0].credentials.uaa.clientsecret
    authURL =  vcap_services.adsrestapi[0].credentials.uaa.url
     apiURL =  vcap_services.adsrestapi[0].credentials.uri
          var token = await getBearerToken(username,password,authURL)
          const xml = await createCarXML(entity)
          const base64pdf = await getPDF(token,apiURL,"CarPosting/carposting",xml)
      
    return base64pdf
    }
    catch(err) {
      console.log(err)
    }
    
   
    
    

  }
  
  async getPDFRegular(id) {
    const entity = await SELECT.one('PostingsRegular', p => {
      p`.*`,p.employee (e => {e`.*`}), 
      p.departures_arrivals ( d => {d`.*`,d.meanOfTransport.name} ), p.daily_expenses ( daily => {daily`.*`,daily.paymentMethod.name}),
      p.accomodations ( acc => {acc`.*`,acc.paymentMethod.name}), p.material_expenses ( mat=> {mat`.*`,mat.name,mat.paymentMethod.name}), p.trip_expenses ( trip=> {trip`.*`,trip.name,trip.paymentMethod.name})
    }).where({ID:id})
           var vcap_services
           var username
           var password
           var authURL
           var apiURL
      try {
      vcap_services = JSON.parse(process.env.VCAP_SERVICES)
       
      }
  catch(exception){
    console.log(exception)
  }
  username = vcap_services.adsrestapi[0].credentials.uaa.clientid
     password = vcap_services.adsrestapi[0].credentials.uaa.clientsecret
    authURL = vcap_services.adsrestapi[0].credentials.uaa.url
     apiURL =  vcap_services.adsrestapi[0].credentials.uri
    
   
    
    
          var token = await getBearerToken(username,password,authURL)
          const xml = await createRegularXML(entity)
          const base64pdf = await getPDF(token,apiURL,"RegularPosting/regularposting",xml)
    return base64pdf 

  

  }
}

module.exports = AppService

