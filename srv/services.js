
const cds = require("@sap/cds");
const { createPDFCar , createPDF } = require("./pdf_creator")
const { createPDFCarDirect , createPDFRegularDirect} = require("./pdf_maker")

class Service extends cds.ApplicationService {
  init() {
    
    this.on('getPDFCar',this.getPDFCar)

    this.on('getPDFRegular',this.getPDFRegular)

    super.init()
  }
 
  


  async getPDFCar(id)  {
    
      
    return await SELECT.from('PostingsWithCar', p => {
      p`.*`,p.employee (e => {e`.*`}),p.employer (emp => emp`.*`), 
      p.fuel_type.name, p.data ( d => { d`.*`}), p.stickers ( s => {s`.*`})
    }).where({ID:id})
    .then( async (next) => {
      
      //const result = await createPDFCar(next[0])
      const result = await createPDFCarDirect(next[0])
      
      return result
    });
   
    
    

  }
  
  async getPDFRegular(id) {
    return await SELECT.from('PostingsRegular', p => {
      p`.*`,p.employee (e => {e`.*`}),p.employer (emp => emp`.*`), 
      p.departures_arrivals ( d => d`.*`), p.daily_expenses ( daily => daily`.*`),
      p.accomodations ( acc => acc`.*`), p.material_expenses ( mat=> mat`.*`)
    }).where({ID:id}).then( async (next) => {
      const result = await createPDFRegularDirect(next[0])
      return result
    });
  }

  

}

module.exports = Service

