
const cds = require("@sap/cds");

const tx = cds.tx();
const axios = require('axios');
const { createRegularXML } = require("./regular");
const { createCarXML } = require("./car");
const { getPDF, getBearerToken, attachFile  } = require("./functions");
const statusActions = require("./handlers/actions")
const employees = require("./handlers/employees")
const postingswithcar = require("./handlers/postingswithcar")
const postingsregular = require("./handlers/postingsregular")

class AppService extends cds.ApplicationService {
  init() {
    
    // PostingsWithCar
    this.before('CREATE','PostingsWithCar.drafts', async(req) => {
      postingswithcar.beforeCreatePostingWithCarDraft(req)
    })
    this.before('CREATE', 'PostingsWithCar', async(req) => {
     postingswithcar.beforeCreatePostingWithCar(req)
    })
    this.before('UPDATE', 'PostingsWithCar', async(req) => {
      postingswithcar.beforeUpdatePostingWithCar(req)
    })

    this.before('READ','PostingsWithCar', async (req ) => {
      postingswithcar.beforeReadPostingWithCar(req)

  });

  this.after('READ', 'PostingsWithCar', async(results,req ) => {
    postingswithcar.afterReadPostingWithCar(results,req)
    
  })
  this.after('READ','PostingsWithCar.drafts', async(results,req)=>{
      postingswithcar.afterReadPostingWithCarDraft(results,req)
  })
  this.before('READ','PostingsWithCar.drafts',async(req) => {
    postingswithcar.beforeReadPostingWithCarDraft(req)
  })
  
    // PostingsWithCar

    // PostingsRegular
    this.before('CREATE','PostingsRegular.drafts', async(req) => {
      postingsregular.beforeCreatePostingRegularDraft(req)
    })
    this.after('READ', 'PostingsRegular', async(results,req ) => {
    postingsregular.afterReadPostingRegular(results,req)
  })
  this.after('READ', 'PostingsRegular.drafts', async(results,req ) => {
    postingsregular.afterReadPostingRegularDraft(results,req)
  })
  this.before('READ','PostingsRegular.drafts',async(req) => {
    postingsregular.beforeReadPostingRegularDraft(req)
  })
  this.before('CREATE', 'PostingsRegular', async(req) => {
   postingsregular.beforeCreatePostingRegular(req)
  })
  this.before("UPDATE",'PostingsRegular', async(req) => {
    postingsregular.beforeUpdatePostingRegular(req)
  }
)
this.before('READ','PostingsRegular', async (req) => {
    postingsregular.beforeReadPostingRegular(req)
});
    // PostingsRegular
    

  // EMPLOYEES
  this.after('READ','Employees',async(results,req) => {
    employees.afterReadEmployees(results)
  })

  this.before('READ','Employees', async(req) => {
    employees.beforeReadEmployees(req)
  })
  this.before('UPDATE','Employees',async(req) => {
    employees.beforeUpdateEmployees(req)
  })
  this.before('DELETE','Employees',async(req) => {
    employees.beforeDeleteEmployees(req)
  })
 
  this.before('CREATE','Employees.drafts', async(req) => {
    employees.beforeCreateEmployeesDraft(req)
  })
  // EMPLOYEES

  // UTIL
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
  // UTIL
  
    //ACTIONS
    this.on('getPDFCar',this.getPDFCar)
    

    this.on('getPDFRegular',this.getPDFRegular)

    this.on('submit', async(req) => {
      
  
      return statusActions.submit(req)
    
      
    })
    this.on('unsubmit', async(req) => {
      
      return statusActions.unsubmit(req)
    
      
    })
    this.on('reject_', async(req) => {
      
      return statusActions.rejectPosting(req)
      
    })
     this.on('accept', async(req) => {
      
      return statusActions.accept(req)
     
      
    })

    this.on('submitRegular', async(req) => {
      
      
      return statusActions.submit(req,'PostingsRegular')
      
    })
    this.on('unsubmitRegular', async(req) => {
      
      
      return statusActions.unsubmit(req,'PostingsRegular')
    
      
    })
    this.on('rejectRegular', async(req) => {
      
      return statusActions.rejectPosting(req,'PostingsRegular')
     
      
    })
    this.on('acceptRegular', async(req) => {
      
      return statusActions.accept(req,'PostingsRegular')
     
      
    })
    // ACTIONS

    return super.init()
  }
 
  
  async getPDFCar(id)  {
    
      // Lekérdezem az entity-t
    const entity =  await SELECT.one('PostingsWithCar', p => {
      p`.*`,p.employee (e => {e`.*`}), 
      p.fuel_type.name, p.data ( d => { d`.*`}), p.stickers ( s => {s`.*`}),  p.attachments( attachment => { attachment.filename,attachment.mimeType,attachment.content})
    }).where({ID:id})
    
    try {
      // A segédfüggvényemmel elkészítem buffer formátumba a PDF-et
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
    authURL =   vcap_services.adsrestapi[0].credentials.uaa.url
     apiURL = vcap_services.adsrestapi[0].credentials.uri
          var token = await getBearerToken(username,password,authURL)
          const xml = await createCarXML(entity)
          try {
          const base64pdf = await getPDF(token,apiURL,"CarPosting/carposting",xml)
          
           if(base64pdf.length > 30 && entity.attachments && entity.attachments.length != 0){
            var pdf = base64pdf
            for(const attachment of entity.attachments){
              pdf = attachFile(token,apiURL,pdf,attachment)
            }
            return pdf
            
          }
            return base64pdf 
          } catch(exception){
            console.log(exception)
            console.log(exception.response.data)
            return exception.response.data.trace
          }
    
    }
    catch(err) {
      console.log(err)
    }

  }
  
  async getPDFRegular(id) {
    const entity = await SELECT.one('PostingsRegular', p => {
      p`.*`,p.employee (e => {e`.*`}), 
      p.departures_arrivals ( d => {d`.*`,d.meanOfTransport.name} ), p.daily_expenses ( daily => {daily`.*`,daily.paymentMethod.name}),
      p.accomodations ( acc => {acc`.*`,acc.paymentMethod.name}), p.material_expenses ( mat=> {mat`.*`,mat.name,mat.paymentMethod.name}),
       p.trip_expenses ( trip=> {trip`.*`,trip.name,trip.paymentMethod.name}),
       p.attachments( attachment => { attachment.filename,attachment.mimeType,attachment.content})
    }).where({ID:id})
    //console.log(entity)
      const xml = await createRegularXML(entity) 
           var vcap_services
           var username
           var password
           var authURL
           var apiURL
           
      try {
      vcap_services = JSON.parse(process.env.VCAP_SERVICES)
       
      }
  catch(exception){
    //console.log(exception)
    
  }
 
    username = vcap_services.adsrestapi[0].credentials.uaa.clientid
     password = vcap_services.adsrestapi[0].credentials.uaa.clientsecret
    authURL = vcap_services.adsrestapi[0].credentials.uaa.url
     apiURL =  vcap_services.adsrestapi[0].credentials.uri
  

          var token = await getBearerToken(username,password,authURL)
          try {
            const base64pdf = await getPDF(token,apiURL,"RegularPosting/regularposting",xml)
          
          if(base64pdf.length > 30 && entity.attachments && entity.attachments.length != 0){
            var pdf = base64pdf
            for(const attachment of entity.attachments){
              pdf = attachFile(token,apiURL,pdf,attachment)
            }
            return pdf
            
          }
            return base64pdf 
          } catch(exception){
            console.log(exception)
            console.log(exception.response.data)
            return exception.response.data.trace
          }

  }
}

module.exports = AppService

