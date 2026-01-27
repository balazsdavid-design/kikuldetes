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
      
}
async function beforeReadPostingWithCar(req) {
    const { user } = req;
    
      if (!user.is('Backoffice')) {
          //req.query.where({ employee_ID: user.id });    
      }
}
async function afterReadPostingWithCar(results,req) {
    const { user} = req
    
    for(const each of results){ 
      if(each.employee){
        
      var employee = await SELECT.one('Employees').where({ID:each.employee.ID})//.columns('lastName','name')
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
          var employee = await SELECT.one('Employees').where({ID:each.employee.ID}).columns('lastName','name')
    each.employee.fullName = employee.name+" "+employee.lastName
        }
        each.editing = true
      if(!user.is('Backoffice')){
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
    beforeUpdatePostingWithCar
}