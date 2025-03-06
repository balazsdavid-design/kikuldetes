const ExcelJS = require('exceljs')
var ConvertApi = require('cloudmersive-convert-api-client');


const fs = require('node:fs');
async function createPDFCar(PostingWithCar) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./resources/kikuld_auto_template.xlsx')
        
            
            const worksheet = workbook.getWorksheet('Kiküldetési rendelvény')
            
            if(PostingWithCar.data > 4){
             // FIX STYLING BUG CAUSED BY EXCELJS INSERTROW
            var styles = []
            var styles1 = []
            var styles2 = []
            var styles3 = []
            var styles4 = []
          
            for(var cell of worksheet.getRow(21)._cells){
              
              styles.push(cell.style)
            }

            for(var cell of worksheet.getRow(22)._cells){
              
              styles1.push(cell.style)
            }
            
            for(cell of worksheet.getRow(23)._cells){
              styles2.push(cell.style)
            }
            for(cell of worksheet.getRow(24)._cells){
              styles3.push(cell.style)
            }
            for(cell of worksheet.getRow(25)._cells){
              styles4.push(cell.style)
            }
          }
            
         

            
            const date = new Date();
            const year = date.getFullYear()
            const month =  date.getMonth() < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            const day = date.getDay() < 10 ? "0"+date.getDay() : date.getDay();
            worksheet.getCell('D3').value = year
            worksheet.getCell('E3').value = month


            // Fill employee data
            worksheet.getCell('G7').value = PostingWithCar.employee.name;
            worksheet.getCell('G8').value = PostingWithCar.employee.address;
            worksheet.getCell('G9').value = PostingWithCar.employee.birthPlace+", " + PostingWithCar.employee.birthDate;
            worksheet.getCell('G10').value = PostingWithCar.employee.mothersName;
            worksheet.getCell('G11').value = PostingWithCar.employee.taxNumber;

            // Fill car data
            worksheet.getCell('D13').value = PostingWithCar.plateNum;
            worksheet.getCell('H13').value = PostingWithCar.fuel_consumption;
            worksheet.getCell('C14').value = PostingWithCar.fuel_type_name;
            worksheet.getCell('E14').value = PostingWithCar.cylinder_volume;
            worksheet.getCell('G14').value = PostingWithCar.fuel_price;
            worksheet.getCell('I14').value = PostingWithCar.amortization;

            
            //Fill trip data
            var index = 1;
            var rowInd = 18;
            var sumMileage = 0;
            var sumFuel = 0; 
            var sumNorm = 0;
            var sumDaily = 0;
            PostingWithCar.data.forEach(trip => {
              
                if(index > 4){
                    worksheet.insertRow(rowInd,[],'i+')
                    
                }

                var fuel = PostingWithCar.fuel_price*(trip.mileage/100*PostingWithCar.fuel_consumption);
                var norm = trip.mileage*PostingWithCar.amortization;
                worksheet.getCell(`A${rowInd}`).value = index+".";
                worksheet.getCell(`B${rowInd}`).value = trip.date;
                worksheet.getCell(`C${rowInd}`).value = trip.from_where;
                worksheet.getCell(`D${rowInd}`).value = trip.to_where;
                worksheet.getCell(`F${rowInd}`).value = trip.mileage;
                worksheet.getCell(`G${rowInd}`).value = fuel;
                worksheet.getCell(`H${rowInd}`).value = norm;
                worksheet.getCell(`I${rowInd}`).value = trip.daily_expense 
                

                
                sumMileage+= trip.mileage;
                sumFuel+= fuel;
                sumNorm += norm;
                sumDaily += trip.daily_expense
                index++;
                rowInd++
                
            });
                
            
            worksheet.getCell('F'+rowInd).value = sumMileage;
            worksheet.getCell('G'+rowInd).value = sumFuel;
            worksheet.getCell('H'+rowInd).value = sumNorm;
            worksheet.getCell('I'+rowInd).value = sumDaily;
            worksheet.getCell('G'+(rowInd+3)).value = sumDaily+sumFuel+sumNorm
           
            if(PostingWithCar.data.length > 4){
           
            worksheet.getRow(rowInd-1).eachCell( function(cell,num) {
              cell.style = styles[num-1]
              
                     
          })

            worksheet.getRow(rowInd).eachCell( function(cell,num) {
                cell.style = styles1[num-1]
                
                       
            })
            worksheet.getRow(rowInd+1).eachCell( function(cell,num) {
              
              cell.style = styles2[num-1]
            })
            worksheet.getRow(rowInd+2).eachCell( function(cell,num) {
              cell.style = styles3[num-1]
            })
            worksheet.getRow(rowInd+3).eachCell( function(cell,num) {
              cell.style = styles4[num-1]
            })
          }
            
            const filename = `/home/user/projects/kikuldetesek/${PostingWithCar.goal.replace(" ","")}_${year}_${month}_${day}.xlsx`
            workbook.xlsx.writeFile(filename)
            //console.log(worksheet.getRow(26))
            // /home/user/projects/kikuldetesek/
           //return await convertExcelToPDF(`${filename}`)
            
        
    
    
}

async function createPDF(PostingRegular) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./resources/kikuld_template.xlsx')
  const worksheet = workbook.getWorksheet('Kiküld-rendelvény')
  const date = new Date()
  worksheet.getCell('F2').value = date.getFullYear();
  worksheet.getCell()

}


async function convertExcelToPDF(file_path){
    var defaultClient = ConvertApi.ApiClient.instance;
    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = '6a93a7e1-6b28-4944-a0aa-0ab31eed8bd4';
    //Apikey.apiKeyPrefix = 'Token';


    var apiInstance = new ConvertApi.ConvertDocumentApi();
    
   var inputFile = fs.readFileSync(file_path)
   
    
       
      try {
        const data = await apiInstance.convertDocumentXlsxToPdf(inputFile)
        return data.body

      } catch(error) {
        console.error(error)
      }
      
      
      
      
      

}

module.exports = { createPDFCar, createPDF}