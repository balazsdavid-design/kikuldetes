const cds = require('@sap/cds')
const { default: axios } = require('axios')
const { GET, POST, expect,test } = cds.test(__dirname + '/..')
const { createPDFCarDirect , createPDFRegularDirect, getExchangeRates} = require("../srv/pdf_maker");
cds.User.default = cds.User.privileged 


beforeEach(async() => {
  await test.data.reset()
})

describe('Test PDF errors',() =>{
  it("MissingEmployeeData", async() => {
    await expect(await createPDFCarDirect({employee : {}})).to.be.equal("EmployeeDataMissing")
  }
  )

  it("FuelPriceNotFound", async() => {
    await expect(await createPDFCarDirect({data : [],stickers: [],employee : { 
      ID:'david.balazs@msg-plaut.hu',
      name:'Balázs Dávid',
      position:"Dev",
      address:"adr",
      birthDate:"2003-07-17",
      birthPlace:"bp",
      mothersName:"anya",
      taxNumber:123
    }})).to.contain("FuelPriceNotFound")
  }
  )
  it("CurrencyNotFound",async() => {
      try {
        await getExchangeRates(new Date().toISOString().substring(0,10),'AED')
      } catch(error){
        expect(error).to.contain('CurrencyNotFound')
      }
      
      
  })
  it("CurrencyDateError",async() => {
    try {
      await getExchangeRates(new Date(Date.now() + 86400000).toISOString().substring(0, 10),'AED')
    } catch(error){
      expect(error).to.contain('DateError')
    }
    
    
})

})


describe('AppService API Tests via cds.test()', () => {
 
  describe('PostingsWithCar', () => {
    
    

    it('should reject sticker with future date', async () => {
      


      const futureDate = new Date(Date.now() + 86400000).toISOString().substring(0, 10)
        
       await expect( POST('/odata/v4/app/PostingsWithCar',
         {
        stickers: [{ 
          date: futureDate, 
          country_code: 'HU',   
          price: 10,      
          currency_code: 'HUF'  // currency_code string
        }],
        goal: "goal",
        fuel_type_ID: 1, 
        
        
        data: [{
          ID: '00000000-0000-0000-0000-000000000001',
          date: new Date().toISOString().substring(0,10),
          from_where: "A",
          to_where: "B",
          mileage: 100,
          daily_expense: 0

        },
        {
            ID: '00000000-0000-0000-0000-000000000002',
            date: new Date().toISOString().substring(0,10),
            from_where: "A",
            to_where: "B",
            mileage: 100,
            daily_expense: 0
          }]
        } 
        ))
       .to.be.fulfilled
        //.to.be.rejectedWith(/400/)
     
    
    
    
    
    })

    it('should reject when trip data has less than two entries', async () => {
      await expect(POST('/odata/v4/app/PostingsWithCar', {
        goal: "goal",
        fuel_type_ID: 1,
        plateNum: "JXH",
        cylinder_volume: 1393,
        stickers: [],
        data: []  
      })
    )
      .to.be.fulfilled
        //.to.be.rejectedWith(/400/)
      
    })

   
  })

  describe('PostingsRegular', () => {
    it('should reject if travel_to is after travel_back', async () => {
      await expect(POST('/odata/v4/app/PostingsRegular', {
        travel_to: '2025-05-10',
        travel_back: '2025-05-01'
      })
    )
      .to.be.fulfilled
      //.to.be.rejectedWith(/400/)
    })

    it('should reject if departure/arrival outside range', async () => {
      await expect(POST('/odata/v4/app/PostingsRegular', {
        travel_to: '2025-05-01',
        travel_back: '2025-05-10',
        departures_arrivals: [
          { 
            ID: '00000000-0000-0000-0000-000000000004',
            from_where: "X",
            departure: '2025-04-25T00:00:00Z',
            to_where: "Y",
            arrival: '2025-05-11T00:00:00Z'
          }
        ]
      })
    )
      .to.be.fulfilled
        //.to.be.rejectedWith(/400/)
    })

    it('should reject if borrowed EUR < total spent EUR', async () => {
      await expect(POST('/odata/v4/app/PostingsRegular', {
        travel_to: '2025-05-01',
        travel_back: '2025-05-10',
        departures_arrivals: [
          { 
            ID: '00000000-0000-0000-0000-000000000005',
            from_where: "A",
            departure: '2025-05-01T00:00:00Z',
            to_where: "B",
            arrival: '2025-05-03T00:00:00Z'
          }
        ],
        daily_expenses: [
          { 
            ID: '00000000-0000-0000-0000-000000000006',
            days: 1, 
            currency_code: 'EUR',  // currency_code string
            daily_price: 110,
            date: '2025-05-01'
          }
        ],
        borrowedEUR: 100
      })
    )
      .to.be.fulfilled
        //.to.be.rejectedWith(/400/)
    })

    
  })
})
