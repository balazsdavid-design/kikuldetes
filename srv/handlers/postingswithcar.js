async function beforeDeletePostingWithCar(req) {
  const ID = req.data.ID
  const serialNumberKey = await SELECT.one`serialNumberEntity_yearMonth, serialNumberEntity_number`.from`PostingsWithCar`.where`ID = ${ID}`
  const yearMonth = serialNumberKey.serialNumberEntity_yearMonth;
  const number = serialNumberKey.serialNumberEntity_number;
  await UPDATE`SerialNumbers`.where`yearMonth = ${yearMonth} and number = ${number}`.set`inUse = false`
  
}
async function beforeCreatePostingWithCarDraft(req){

        
        req.data.employee_ID = req.user.id
      req.data.status_ID = 1
}

async function beforeCreatePostingWithCar(req){
          /*
          if(req.data.stickers){
            var date = new Date();
            for(var sticker of req.data.stickers){
              // Validálom az autópálya matricák dátumát
              var reqDate = new Date(sticker.date)
              if(reqDate > date){
                req.error(400,'StickerError')
              }
            } 
          }*/
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
      if(req.data.data.length < 2){ // Ha kevesebb mint két sor akkor hiba
        req.error(400,'TripDataAtleastTwo')
      }
      
      

      const maxDate = new Date(Math.max(...req.data.data.map(o => new Date(o.date))));
      const yearMonth = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}`;
      // Sorszám létrehozása
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
async function beforeUpdatePostingWithCar(req) {
    
      /*
      if(req.data.stickers){
        var date = new Date();
        for(var sticker of req.data.stickers){
          
          var reqDate = new Date(sticker.date)
          if(reqDate > date){
            req.error(400,'StickerError')
          }
        }
      }*/

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
      if(!req.user.is('Backoffice')){
          req.warn('SubmitReminder');
        }
      
}

async function beforeReadPostingWithCar(req) {
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
async function beforeReadPostingWithCarDraft(req){
  
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
async function afterReadPostingWithCar(results,req) {
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
async function afterReadPostingWithCarDraft(results,req) {
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

module.exports = {
    afterReadPostingWithCar,
    afterReadPostingWithCarDraft,
    beforeCreatePostingWithCar,
    beforeCreatePostingWithCarDraft,
    beforeReadPostingWithCar,
    beforeUpdatePostingWithCar,
    beforeReadPostingWithCarDraft,
    beforeDeletePostingWithCar,
}