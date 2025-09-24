const { isEmployeeDataMissing, compareByDate, getLocalCountryName ,getExchangeRates} = require("./functions");
const { Builder } = require('xml2js');
const builder = new Builder()

async function createCarXML(PostingWithCar){
    const date = new Date();
    const year = date.getFullYear()
    const month =  (date.getMonth()+1).toString().padStart(2,"0")
    const day = date.getDate().toString().padStart(2,"0")
    const yearMonth = year+"-"+month
    const employee = PostingWithCar.employee;
    if(isEmployeeDataMissing(employee)){
        return "EmployeeDataMissing"
    }
    const data = PostingWithCar.data.sort(compareByDate);
    const stickers = PostingWithCar.stickers.sort(compareByDate);
    var consumption = 3;
    var fuel_consumption;
    var cylinder_volume = PostingWithCar.cylinder_volume
    var fuel_type_name
    const fuel_type = await SELECT.one.from('FuelTypes.texts').where({locale:'hu',ID:PostingWithCar.fuel_type_ID})
    if(fuel_type){
        fuel_type_name = fuel_type.name
    }
    
    
    const fuelPrices = await SELECT.one.from('FuelPrices').where({yearMonth:yearMonth})
    if(fuelPrices == null){
        return "FuelPriceNotFound"
      
    }
    else if(cylinder_volume == null && PostingWithCar.fuel_type_ID != 5){
        return "NoVolume"
    }
    var fuelPrice = fuelPrices.petrolPrice
    if(PostingWithCar.fuel_type_ID == 2 || PostingWithCar.fuel_type_ID == 4){
        fuelPrice = fuelPrices.dieselPrice
    }
    if(PostingWithCar.fuel_type_ID != 5) {
        if(cylinder_volume < 3001){
            fuel_consumption = await SELECT.one.from('FuelConsumptions')
    .where(`${PostingWithCar.cylinder_volume} >= volumeStart and ${PostingWithCar.cylinder_volume} <= volumeEnd and fuelType_ID = ${PostingWithCar.fuel_type_ID} `)
        }
        else {
            fuel_consumption =  await SELECT.one.from('FuelConsumptions')
            .where(`3001 = volumeStart and fuelType_ID = ${PostingWithCar.fuel_type_ID} `)
            
            
        }
        consumption = fuel_consumption.consumption
    
    }
    else {
        cylinder_volume = '-'
    }
     
    if( PostingWithCar.fuel_type_ID == 3 || PostingWithCar.fuel_type_ID == 4){
        consumption = consumption*0.7
    }

    var stickerList =  []
    for( const sticker of PostingWithCar.stickers){
        var country = await getLocalCountryName(sticker.country_code)
            
            currency = ''
            changeRate = ''
            price = ''
            huf = ''
            
            if (sticker.currency_code == 'HUF'){
                huf = sticker.price
            }
            else {
                currency = sticker.currency_code
                price = sticker.price
                try { 
                    changeRate = parseFloat(await getExchangeRates(sticker.date,currency))
                    
                }
                catch(error){
                    console.log(error)
                    return error
                }

            }
            
            var string = `Autopálya matrica ${country}`

        stickerList.push({ 
            StickerDate : sticker.date,
            StickerName : string,
            Currency : currency,
            Price : price,
            ChangeRate : changeRate,
            HUF : huf
        })
    }
    var trips = []
    for(row of PostingWithCar.data.sort(compareByDate)){
        


        trips.push({
            Date : row.date,
            From_where : row.from_where,
            To_where : row.to_where,
            Mileage: row.mileage,
            Daily_expense : row.daily_expense

        })
    }

    const xml = {
        CarPosting : {
            Year : year,
            Month : month,
            SerialNumber : PostingWithCar.serialNumber,
            Employee_Name : employee.lastName+" "+employee.name,
            Employee_Address : employee.postal_code+" "+employee.city+" "+employee.address,
            Employee_BirthPlaceAndDate: employee.birthPlace+", " + employee.birthDate,
            MothersName: employee.mothersName,
            TaxNumber : employee.taxNumber,
            PlateNumber: PostingWithCar.plateNum,
            FuelConsumption : consumption,
            FuelType : fuel_type_name,
            CylinderVolume : cylinder_volume,
            FuelPrice : fuelPrice,
            Amortization : 15,
            TripDataRow : trips,
            HighwayStickers : stickerList
        }
    }
    return builder.buildObject(xml)
}
module.exports = { createCarXML}