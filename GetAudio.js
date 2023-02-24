const { load } = require("cheerio"); //?
const tiny = require("tinyurl"); //?
const regex = require("./utils");
const superagent = require("superagent");//?
const puppeteer = require("puppeteer-core");
// const fs=require('fs')

const { promiseSetTimeOut,extractK,extractYtID,BROWSERLESS_API_KEY}=require('./constants')



async function GetAudio(ytURL) {
  return new Promise(async (resolve, reject) => {
    if ((await regex(ytURL)) == false) {
      reject("Can't See Song ID");
    }
    // const data={
    //    url: url,
    //    q_auto: 0,
    //    ajax: 2
    //  }
    //  const dataString=JSON.stringify(data)

     let options = {
    // args: ["--no-sandbox"],
    browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}&stealth`,
  };

  const url=`https://tomp3.cc/youtube-downloader/${extractYtID(ytURL)}`

  console.log('tomp3URL: ',url)

  const browser= await puppeteer.connect(options)
  // .then(async(browser)=>{
     const page = await browser.newPage();
  const totalStart = Date.now();
  await page.goto(url, { timeout: 0 });
  await page.waitForSelector('#audio',{timeout: 0})
  // await page.$$("#mp4")
  // await promiseSetTimeOut(1000)
  // const prop=await page.$('html')
  // const html='<html>'+prop.getInnerHTML()+'</html>'
  const html=await page.content();
  // await page.$$("#mp4")
  console.log('got it')
  // fs.writeFileSync('yt2.html',html)
  browser.close()
  const $=load(html)

  const getQualityK=(qt)=>{

    const arr=[]
    console.log('qt: ',qt)

     const trs=$("#audio > table > tbody > tr")
     trs.each((_,e)=>{
      let row=$(e).find('td:nth-child(1)').text()
      let kdata=$(e).find('td:nth-child(3)').html()

      console.log('row: ',row)
      console.log('kdata: ',kdata)

      const qty=extractQuality(row)
      const k=extractK(kdata)
      let obj={}
      obj['quantity']=qty
      obj['k']=k

      arr.push(obj)

     })

     console.log(arr)

     for(let ob of arr){
      const {quantity,k}=ob
      if(quantity==qt){
        return k
      }
     }
            
   
  }

   // const data=

   // // $("div")
   //          // .find
   //          $("#audio > table > tbody > tr:nth-child(2) > td:nth-child(1)")
   //          .text()
    const kdata=$("div")
            .find("#audio > table > tbody > tr:nth-child(1) > td:nth-child(3)").html()

    // console.log('data: ',data)        
    // let quality=extractQuality(data)
    // console.log('quality: ',quality)

    console.log('kdata: ',kdata)
   

    const vid=extractYtID(ytURL)
    console.log('ytid: ',vid)

     // const highestQ = quality;
     // quality = Number(quality) > Number(q) ? q : quality;

     // const k=getQualityK(quality)

     const k=extractK(kdata,'mp3')
     console.log('k :',k)

        // console.log(title, quality);
        // console.log('q: ',q)

    superagent.post('https://tomp3.cc/api/ajax/convert?hl=en')
 .set("accept", "application/json")
 
 .field('vid',vid)
.field('k',k)
// .field('hl','en')
// .field('q_auto','1')
.end(async(err,res  )=>{



  if(err){
    console.log(err)
    reject(err)
  }

  console.log(res.text)
  const obj=JSON.parse(res.text)
  console.log('obj: ',obj)
  const {dlink,c_status,title,ftype,fquality}=obj

       

  let urlDown = await tiny.shorten(dlink);
  resolve({
              title,
              
              type: 'mp3',
              
              
              urlDown,
              
            });
  
  // const highestQ = quality;
  // quality = Number(quality) > Number(q) ? q : quality;

})

   
  });
}

module.exports = GetAudio;
