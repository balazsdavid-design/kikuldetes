async function afterReadEmployees(results){
    for(let each of results){
      each.fullName = each.name+" "+each.lastName
      
    }
}

async function beforeReadEmployees(req){
    /*const { user } = req;
    const tx = cds.tx(req);  
    const employee = await tx.run(
      SELECT.one.from('Employees', e => { e`.*`}).where({ID:user.id}))
  
    if(!employee){
      const firstName =user.attr.givenName
      const lastName = user.attr.familyName
      
      const employee = [{ID:user.id,name:firstName,lastName:lastName}]
      await tx.run(INSERT.
      into('Employees')
      //.columns('ID','name','lastName')
      //.values(user.id,firstName,lastName))
      .entries(employee))
    }*/
      
        
    
        const existing = req.query.SELECT.columns
        .filter(c => c.ref)
        .map(c => c.ref[0])

        const required = ["name", "lastName"]

        for (const field of required) {
          if (!existing.includes(field)) {
            req.query.SELECT.columns.push({ ref: [field] })
            }
          }
}

async function beforeUpdateEmployees(req){
    const { user } = req;
    
      if(req.data.ID != user.id && !user.is('Backoffice')){
        req.error(400, "Restricted")
      }
}

async function beforeDeleteEmployees(req){
    const { user } = req;
    if(req.data.ID != user.id && !user.is('Backoffice')){
      req.error(400, "Restricted")
    }
}

async function beforeCreateEmployeesDraft(req){
    const { user } = req
    
   if (!req.data.ID) req.data.ID = user.id;
    const employee = await SELECT.one.from('Employees').where({ID:user.id})
    if(employee){
      req.error(400,"Restricted")
    }
   
}

module.exports = { 
    afterReadEmployees,
    beforeCreateEmployeesDraft,
    beforeDeleteEmployees,
    beforeReadEmployees,
    beforeUpdateEmployees,

                }