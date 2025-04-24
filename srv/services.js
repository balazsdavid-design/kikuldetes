
const cds = require("@sap/cds");

const { createPDFCarDirect , createPDFRegularDirect} = require("./pdf_maker");




class Service extends cds.ApplicationService {
  init() {
    
      


    this.before('CREATE', 'PostingsWithCar', async(req) => {
     

      if(req.data.stickers){
        var date = new Date();
        for(var sticker of req.data.stickers){
          
          var reqDate = new Date(sticker.date)
          if(reqDate > date){
            req.error(400,'Matricát nem lehet felvenni a mainál későbbi dátumra!')
          }
        }
      }
      if(req.data.data.length < 2){
        req.error(400,'Legalább két elemet hozzá kell adni az utazás adatokhoz!')
      }
      req.data.userEmail = req.user.id
      
      const db = cds.transaction(req);
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      
      const result = await db.run(
        SELECT`lastNumber`.from`SerialNumbers`.where`yearMonth = ${yearMonth}`
        ) ?? [];
        const  {lastNumber = 0} = result[0] || {};
        console.log(lastNumber)
        const newNumber = lastNumber + 1;
        const formattedNumber = String(newNumber).padStart(2, '0'); 

        // Frissítjük a SerialNumbers táblát
        await db.run(
            UPSERT.into`SerialNumbers`.entries({ yearMonth, lastNumber: newNumber })
        );

        req.data.serialNumber = `${yearMonth}-${formattedNumber}`;
    })
    this.before('UPDATE', 'PostingsWithCar', async(req) => {
      

      if(req.data.stickers){
        var date = new Date();
        for(var sticker of req.data.stickers){
          console.log(sticker)
          var reqDate = new Date(sticker.date)
          if(reqDate > date){
            req.error(400,'Matricát nem lehet felvenni a mainál későbbi dátumra!')
          }
        }
      }

      if(req.data.data.length < 2){
        req.error(400,'Legalább két elemet hozzá kell adni az utazás adatokhoz!')
      }
      
    })
    this.before('READ','PostingsWithCar', async (req ) => {
      const { user } = req;
      
      
      if (!user.is('Backoffice')) {
        
          
          req.query.where({ userEmail: user.id });
          
          
           
      }
  });
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
      
      each.backOffice = user.is('Backoffice')
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
      
      each.backOffice = user.is('Backoffice')
    }
      
    
  
  })
  

  
  
  this.before('CREATE', 'PostingsRegular', async(req) => {
    
    
    
    var travelTo = new Date(req.data.travel_to)
    var travelBack = new Date(req.data.travel_back)
    if(travelTo > travelBack){
      req.error(400,"Az indulás nem lehet nagyobb az érkezésnél")
    }
      
    for(var departure_arrival of req.data.departures_arrivals){
      var arrival = new Date(departure_arrival.arrival)
      var departure = new Date(departure_arrival.departure)
      if(departure > arrival){
        req.error(400,'Az indulási és érkezési adatok közt az indulás időpontja nem lehet nagyobb mint az érkezésé!')
      }
    }   
      
    
    if(req.data.departures_arrivals.length < 2){
      req.error(400,'Legalább két elemet hozzá kell adni az indulási, érkezési adatokhoz!')
    }
    req.data.userEmail = req.user.id

    const db = cds.transaction(req);
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        
        const result = await db.run(
        SELECT`lastNumber`.from`SerialNumbers`.where`yearMonth = ${yearMonth}`
        ) ?? [];
        const  {lastNumber = 0} = result[0] || {};
        
        const newNumber = lastNumber + 1;
        const formattedNumber = String(newNumber).padStart(2, '0'); 
        
        // Frissítjük a SerialNumbers táblát
        await db.run(
            UPSERT.into`SerialNumbers`.entries({ yearMonth, lastNumber: newNumber })
        );

        req.data.serialNumber = `${yearMonth}-${formattedNumber}`;
  })
  this.before("UPDATE",'PostingsRegular', async(req) => {
    var travelTo = new Date(req.data.travel_to)
      var travelBack = new Date(req.data.travel_back)
      if(travelTo > travelBack){
        req.error(400,"Az indulás nem lehet nagyobb az érkezésnél")
      }
      

    if(req.data.departures_arrivals.length < 2){
      req.error(400,'Legalább két elemet hozzá kell adni az indulási, érkezési adatokhoz!')
    }
    for(var departure_arrival of req.data.departures_arrivals){
      var arrival = new Date(departure_arrival.arrival)
      var departure = new Date(departure_arrival.departure)
      if(departure > arrival){
        req.error(400,'Az indulási és érkezési adatok közt az indulás időpontja nem lehet nagyobb mint az érkezésé!')
      }
    }
    
  })

  
  this.before("CREATE", 'FuelPrices.drafts', async(req) => {
    var date = new Date();
    
    const yearMonth = date.getFullYear()+"-"+(date.getMonth()+1).toString().padStart(2,"0")
    var existing = await SELECT.one.from('FuelPrices').where({yearMonth:yearMonth})
    
    if(existing){
      req.error(400,'Már rögzítve van erre a hónapra üzemanyagár!')
    }
    else {
      req.data.yearMonth = yearMonth
    }
    
    
  })

  this.before('READ','PostingsRegular', async (req) => {
    const { user } = req;

    if (!user.is('Backoffice')) {
      
        req.query.where({ userEmail: user.id }); 
    }
    
});

    this.on('getPDFCar',this.getPDFCar)

    this.on('getPDFRegular',this.getPDFRegular)

    this.on('submit', async(req) => {
      
      
      var id = req.params[0]['ID']
     
      
      await UPDATE ('PostingsWithCar',id).set({status_ID : 2})
      const updated = await SELECT.one('PostingsWithCar', p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      updated.submittable = false
      updated.backOffice = req.user.is('Backoffice')
     
      updated.IsActiveEntity =true
      
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
      console.log(updated)
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


    super.init()
  }
 
  


  async getPDFCar(id)  {
    
      
    const entity =  await SELECT.one('PostingsWithCar', p => {
      p`.*`,p.employee (e => {e`.*`}),p.employer (emp => emp`.*`), 
      p.fuel_type.name, p.data ( d => { d`.*`}), p.stickers ( s => {s`*`}, )
    }).where({ID:id})
    try {
      const buffer = await createPDFCarDirect(entity)
    
    return buffer
    }
    catch(err) {
      if(err == 'FuelPriceNotFound'){
        return err
      }
    }
    
   
    
    

  }
  
  async getPDFRegular(id) {
    const entity = await SELECT.one('PostingsRegular', p => {
      p`.*`,p.employee (e => {e`.*`}),p.employer (emp => emp`.*`), 
      p.departures_arrivals ( d => {d`.*`,d.meanOfTransport.name} ), p.daily_expenses ( daily => {daily`.*`,daily.paymentMethod.name}),
      p.accomodations ( acc => {acc`.*`,acc.paymentMethod.name}), p.material_expenses ( mat=> {mat`.*`,mat.paymentMethod.name}), p.trip_expenses ( trip=> {trip`.*`,trip.paymentMethod.name})
    }).where({ID:id})


    const buffer = await createPDFRegularDirect(entity)
    
    return buffer

  

  }
}

module.exports = Service

