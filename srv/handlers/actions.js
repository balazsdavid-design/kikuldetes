async function submit(req,entity) {
      entity = entity ? entity : 'PostingsWithCar'
      
      var id = req.params[0]['ID']
      const isHU = req.headers['accept-language'].includes('hu')
      const lang = isHU ? 'hu' : 'en'
      
      await UPDATE (entity,id).set({status_ID : 2})
      // Frissítem az entitásoldalon a státuszt
      const updated = await SELECT.one(entity, p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      // Beállítom a virtuális mezőket
      updated.submittable = false
      updated.backOffice = req.user.is('Backoffice')
     
      updated.IsActiveEntity =true
      // Lekérem a lokalizált szövegét 
      var text = await SELECT.one('Statuses.texts').where({ID:2,locale:lang})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
    
      
    }

    async function unsubmit(req,entity){
      entity = entity ? entity : 'PostingsWithCar'
      var id = req.params[0]['ID']
      const isHU = req.headers['accept-language'].includes('hu')
      const lang = isHU ? 'hu' : 'en'
      const oldstatus = (await SELECT.one.from(entity).columns('status_ID').where({ID:id}))['status_ID']
      const newstatus = oldstatus == 4 ? 2 : 1
      await UPDATE (entity,id).set({status_ID : newstatus})
      const updated = await SELECT.one(entity, p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      updated.submittable = oldstatus !== 4 
      updated.backOffice = req.user.is('Backoffice')
      updated.accepted = false;
      updated.IsActiveEntity =true
      
      var text = await SELECT.one('Statuses.texts').where({ID:newstatus,locale:lang})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
    
      
    }

    async function rejectPosting(req,entity) {
      entity = entity ? entity : 'PostingsWithCar'
      var id = req.params[0]['ID']
      const isHU = req.headers['accept-language'].includes('hu')
      const lang = isHU ? 'hu' : 'en'
      
      
      
      

      
      await UPDATE (entity,id).set({status_ID : 3})
      
      const updated = await SELECT.one(entity, p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      
      updated.submittable = true
      updated.backOffice = req.user.is('Backoffice')
      updated.accepted = false;
      updated.IsActiveEntity = true
      
      var text = await SELECT.one('Statuses.texts').where({ID:3,locale:lang})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
     
      
    }

    async function accept(req,entity) {
      entity = entity ? entity : 'PostingsWithCar'
      var id = req.params[0]['ID']
     
      const isHU = req.headers['accept-language'].includes('hu')
      const lang = isHU ? 'hu' : 'en'
      
      

      
      await UPDATE (entity,id).set({status_ID : 4})
      
      const updated = await SELECT.one(entity, p=> {
        p`.*`,p.status ( s => {s`.*` })
      }).where({ID:id});
      
      updated.submittable = false
      updated.backOffice = req.user.is('Backoffice')
      updated.accepted = true
      updated.IsActiveEntity = true
      
      var text = await SELECT.one('Statuses.texts').where({ID:4,locale:lang})
      
      updated.status.statusText = text.statusText
      
      
      return updated;
     
      
    }

    module.exports = { submit, unsubmit, rejectPosting, accept}