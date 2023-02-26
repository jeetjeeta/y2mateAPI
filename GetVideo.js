const { load } = require("cheerio");
const tiny = require("tinyurl");
const regex = require("./utils");
const superagent = require("superagent");

const puppeteer = require("puppeteer-core");
// const puppeteer = require("puppeteer");
// const fs=require('fs')

const {
  promiseSetTimeOut,
  extractK,
  // extractQuality,
  extractYtID,
  BROWSERLESS_API_KEY,
} = require("./constants");

async function GetVideo(ytURL, q = "480") {
  return new Promise(async (resolve, reject) => {
    if ((await regex(ytURL)) == false) {
      reject("Can't See Song ID");
    }

    // x2download

    let options = {
      // args: ["--no-sandbox"],
      browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}&stealth`,
    };

    const url = "https://x2download.app/en48";

    // console.log("tomp3URL: ", url);

    const browser = await puppeteer.connect(options);
    // const browser = await puppeteer.launch({
    //   args: ["--no-sandbox"],
    //   executablePath: "./chromium/chrome-win/chrome.exe",
    //   headless: false,
    // });

    const page = await browser.newPage();
    const totalStart = Date.now();
    await page.goto(url);

    const formHandle = await page.waitForSelector("#search-form");
    await page.evaluate(
      (form, ytURL) => {
        form.querySelector("#s_input").value = ytURL;
        form.querySelector(".btn-red").click();
      },
      formHandle,
      ytURL
    );

    const selectHandler = await page.waitForSelector("#formatSelect");
    const { highestQ, quality } = await page.evaluate(
      (select, q) => {
        const options = select.querySelector('optgroup[label="mp4"]').children;
        const highestQ = options[0].value;
        let quality;
        if (Number(q) > Number(highestQ)) {
          quality = highestQ;
        } else {
          quality = q + "p";
        }

        for (let option of options) {
          if (option.value === quality) {
            option.selected = true;
          }
        }

        document.querySelector("#btn-action").click();

        return { highestQ, quality };
      },
      selectHandler,
      q
    );
    // document.querySelector('#asuccess')
    const aHandle = await page.waitForSelector(
      "a#asuccess.form-control.mesg-convert.success"
    );
    // console.log(aHandle);
    await promiseSetTimeOut(5000);
    const dlink = await page.evaluate((e) => e.getAttribute("href"), aHandle);

    browser.close();

    console.log("highestQ: ", highestQ);
    console.log("quality: ", quality);

    let urlDown = await tiny.shorten(dlink);
    // let urlDown = dlink;
    resolve({
      type: "mp4",
      quality,

      urlDown,
      highestQ,
    });

    // superagent
    //   .post("https://x2download.app/api/ajaxSearch")
    //   .set("accept", "application/json")
    //   .field("q", ytURL)
    //   .field("vt", "home")
    //   .end(async (err, res) => {
    //     if (err) {
    //       reject(err);
    //     }

    //     console.log(res.text);
    //     const { links, token, vid, timeExpires, fn } = JSON.parse(res.text);
    //     const highestQ = links["mp4"]["3"]["q"];
    //     let quality;
    //     if (Number(q) > Number(highestQ)) {
    //       quality = highestQ;
    //     } else {
    //       quality = q + "p";
    //     }

    //     superagent
    //       .post(
    //         "https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994"
    //       )
    //       .set("accept", "application/json")
    //       .field("v_id", vid)
    //       .field("ftype", "mp4")
    //       .field("fquality", quality)
    //       .field("token", token)
    //       .field("timeExpire", timeExpires)
    //       .field("client", "X2Download.app")
    //       .end(async (err, res) => {
    //         if (err) {
    //           reject(err);
    //         }
    //         const { c_server, c_status } = JSON.parse(res.text);
    //         const url = `${c_server}/api/json/convert`;

    //         superagent
    //           .post(url)
    //           .set("accept", "application/json")
    //           .field("v_id", vid)
    //           .field("ftype", "mp4")
    //           .field("fquality", quality)
    //           .field("fname", fn)
    //           .field("timeExpire", timeExpires)
    //           .end(async (err, res) => {
    //             if (err) {
    //               reject(err);
    //             }
    //             const { result, status } = JSON.parse(res.text);

    //             let urlDown = await tiny.shorten(result);
    //             resolve({
    //               title,

    //               type: "mp4",
    //               quality,

    //               urlDown,
    //               highestQ,
    //             });
    //           });
    //       });
    //   });

    // const data={
    //    url: url,
    //    q_auto: 0,
    //    ajax: 2
    //  }
    //  const dataString=JSON.stringify(data)

    // let options = {
    //   // args: ["--no-sandbox"],
    //   browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}&stealth`,
    // };

    // const url = `https://tomp3.cc/youtube-downloader/${extractYtID(ytURL)}`;

    // console.log("tomp3URL: ", url);

    // const browser = await puppeteer.connect(options);

    // const browser = await puppeteer.launch({
    //   args: ["--no-sandbox"],
    //   headless: true,
    // });

    // // .then(async(browser)=>{
    // const page = await browser.newPage();
    // const totalStart = Date.now();
    // await page.goto(url, { timeout: 0 });
    // // await page.waitForSelector('#mp4',{timeout: 0})
    // const mp4Table = await page.waitForSelector("#mp4");

    // const { kdata, highestQ } = await page.evaluate(
    //   (mp4, q) => {
    //     console.log(q);
    //     const extractQuality = (str) => {
    //       // console.log('str: ',str)
    //       const regex1 = /\D*[-]\s([0-9]+)\D*/;
    //       const regex1Exec = regex1.exec(str);
    //       console.log("regex1Exec: ", regex1Exec);
    //       if (regex1Exec) {
    //         return regex1Exec[1];
    //       }

    //       return null;

    //       // return '720'
    //     };

    //     const trs = mp4.querySelectorAll("table > tbody > tr");

    //     let trchildren = [];
    //     let higherQ;
    //     // let q
    //     // let qty
    //     let i = 0;
    //     let f = 0;
    //     for (let tr of trs) {
    //       let quality = extractQuality(tr.children[0].innerText);
    //       if (i === 1) {
    //         higherQ = quality;
    //       }
    //       if (Number(q) > Number(higherQ)) {
    //         f = 1;
    //       }
    //       // console.log(tr.children[0]);
    //       // trchildren.push(extractQuality(tr.children[0].innerText));

    //       if (i >= 1) {
    //         if (q === quality || f === 1) {
    //           return {
    //             kdata: tr.children[2]
    //               .querySelector("button")
    //               .getAttribute("onclick"),
    //             highestQ: higherQ,
    //           };
    //         }
    //       }

    //       i++;
    //     }

    //     // return trchildren;
    //   },
    //   mp4Table,
    //   q
    // );

    // // console.log(trs);
    // // const aHandle = await page.waitForSelector("#btn-dl");
    // // const link = await page.evaluate((e) => e.href, aHandle);

    // console.log("Kdata: ", kdata);

    // // console.log("link: ", link);

    // browser.close();
    // const vid = extractYtID(ytURL);
    // const k = extractK(kdata);
    // console.log("k: ", k);

    // // await page.$$("#mp4")
    // // await promiseSetTimeOut(1000)
    // // const prop=await page.$('html')
    // // const html='<html>'+prop.getInnerHTML()+'</html>'
    // // const html=await page.content();
    // // await page.$$("#mp4")
    // console.log("got table");

    // // fs.writeFileSync('yt2.html',html)
    // // browser.close()
    // // const $=load(html)

    // // const getQualityK=(qt)=>{

    // //   const arr=[]
    // //   console.log('qt: ',qt)

    // //    const trs=$("#mp4 > table > tbody > tr")
    // //    trs.each((_,e)=>{
    // //     let row=$(e).find('td:nth-child(1)').text()
    // //     let kdata=$(e).find('td:nth-child(3)').html()

    // //     console.log('row: ',row)
    // //     console.log('kdata: ',kdata)

    // //     const qty=extractQuality(row)
    // //     const k=extractK(kdata)
    // //     let obj={}
    // //     obj['quantity']=qty
    // //     obj['k']=k

    // //     arr.push(obj)

    // //    })

    // //    console.log(arr)

    // //    for(let ob of arr){
    // //     const {quantity,k}=ob
    // //     if(quantity==qt){
    // //       return k
    // //     }
    // //    }

    // // }

    // // const data=

    // // // $("div")
    // //          // .find
    // //          $("#mp4 > table > tbody > tr:nth-child(2) > td:nth-child(1)")
    // //          .text()
    // //  const kdata=$("div")
    // //          .find("#mp4 > table > tbody > tr:nth-child(2) > td:nth-child(3)").html()

    // //  console.log('data: ',data)
    // //  let quality=extractQuality(data)
    // //  console.log('quality: ',quality)

    // //  console.log('kdata: ',kdata)

    // //  const vid=extractYtID(ytURL)
    // //  console.log('ytid: ',vid)

    // //   const highestQ = quality;
    // //   quality = Number(quality) > Number(q) ? q : quality;

    // //   const k=getQualityK(quality)

    // // console.log(title, quality);
    // // console.log('q: ',q)

    // superagent
    //   .post("https://tomp3.cc/api/ajax/convert?hl=en")
    //   .set("accept", "application/json")

    //   .field("vid", vid)
    //   .field("k", k)
    //   // .field('hl','en')
    //   // .field('q_auto','1')
    //   .end(async (err, res) => {
    //     if (err) {
    //       console.log(err);
    //       reject(err);
    //     }

    //     console.log(res.text);
    //     const obj = JSON.parse(res.text);
    //     console.log("obj: ", obj);
    //     const { dlink, c_status, title, ftype, fquality } = obj;

    // let urlDown = await tiny.shorten(dlink);
    // resolve({
    //   title,

    //   type: "mp4",
    //   quality: fquality,

    //   urlDown,
    //   highestQ,
    // });

    //     // const highestQ = quality;
    //     // quality = Number(quality) > Number(q) ? q : quality;
    //   });

    //   const highestQ = quality;
    //   quality = Number(quality) > Number(q) ? q : quality;

    //   superagent
    //     .post("https://www.y2mate.com/mates/en68/convert")
    //     .set("accept", "application/json")
    //     .field("type", "youtube")
    //     .field("v_id", await regex(url))
    //     .field("_id", id)
    //     .field("ajax", "1")
    //     .field("token", "")
    //     .field("ftype", type)
    //     .field("fquality", quality)
    //     .then(async function (body) {
    //       const resultString = JSON.parse(body.text).result.toString();
    //       // console.log('resultString: ',resultString)
    //       const $ = load(resultString);
    //       let urlDown = $('div[class="form-group has-success has-feedback"]')
    //         .find("a")
    //         .attr("href");
    //       // console.log('urlDown: ',urlDown)
    //       console.log('long url: ',urlDown)
    //       urlDown = await tiny.shorten(urlDown);
    //       resolve({
    //         title,
    //         size,
    //         type,
    //         quality,
    //         imageSrc,
    //         urlDown,
    //         highestQ,
    //       });
    //     })
    //     .catch((err) => {
    //       reject(err);
    //     });

    //   // console.log('err: ',err)
    // });

    // promise with then/catch
    // superagent.post('/api/pet').then(console.log).catch(console.error);

    //       const options = {
    //   hostname: 'www.y2mate.com',
    //   // port: 443,
    //   path: '/mates/en68/analyze/ajax',
    //   // path: '/mates/en68',
    //   method: 'POST',
    //   headers: {
    //        'Content-Type': 'multipart/form-data',
    //          // 'Content-Length': dataString.length,

    //      }
    // };

    //       // console.log('formData: ',formData)

    //       const  req = https.request(options, (res) => {
    //     console.log('statusCode:', res.statusCode);
    //     console.log('headers:', res.headers);

    //     res.on('data', (d) => {
    //       console.log('dd: ', d)
    //     });
    // });

    //       req.on('error', (e) => {
    //       console.error(e);
    //     });

    //     req.write(JSON.stringify(formData));
    //     req.end();

    // fetch('https://www.y2mate.com/mates/en423/analyze/ajax',{
    //   method: 'post',
    //   headers: {
    //     'accept': "application/json",
    //     'accept-language': "en-US,en;q=0.9,vi;q=0.8",
    //     'Content-Type': "multipart/form-data"

    //   },
    //   body: JSON.stringify(formData),
    //   // body: formData,

    // })
    // .then(res=>{
    //   // console.log('res: ',res)
    //   return res.body
    // })
    // .then(data=>{
    //   console.log('d: ',data)
    // })

    // axios({
    //   method: 'post',
    //   url: 'https://www.y2mate.com/mates/en423/analyze/ajax',
    //   headers: {
    //     // 'accept': "*/*",
    //     // 'accept-language': "en-US,en;q=0.9,vi;q=0.8",
    //     'content-type': "multipart/form-data"
    //   },
    //   data: {
    //     url: url,
    //     q_auto: 0,
    //     ajax: 2
    //   }
    // }).then(async (res) => {
    //   console.log('res:  ',typeof res.data.result)
    //   return
    //   const $ = load(res.data.result);
    //   const imageSrc = $('div[class="thumbnail cover"]').find('a > img').attr('src'),
    //     title = $('div[class="caption text-left"]').find('b').text(),
    //     size = $('div').find('#mp4 > table > tbody > tr > td:nth-child(2)').text(),
    //     type = $('div').find('#mp4 > table > tbody > tr > td:nth-child(3) > a').attr('data-ftype'),
    //     quality = $('div').find('#mp4 > table > tbody > tr > td:nth-child(3) > a').attr('data-fquality'),
    //     id = /var k__id = "(.*?)"/.exec(res.data.result)[1]
    //     // console.log('q: ',q)

    //     await axios({
    //       method: 'post',
    //       url: 'https://www.y2mate.com/mates/en68/convert',
    //       headers: {
    //         accept: "*/*",
    //         'accept-language': "en-US,en;q=0.9,vi;q=0.8",
    //         'content-type': "multipart/form-data"
    //       },
    //       data:{
    //         type: 'youtube',
    //         v_id: await regex(url),
    //         _id: id,
    //         ajax: '1',
    //         token: '',
    //         ftype: type,
    //         // fquality: quality
    //         fquality: Number(quality)>Number(q)?q:quality
    //       }
    //     }).then(async function (body) {
    //       const $ = load(body.data.result);
    //       var urlDown = $('div[class="form-group has-success has-feedback"]').find('a').attr("href");
    //       urlDown = await tiny.shorten(urlDown);
    //       resolve({
    //         title,
    //         size,
    //         type,
    //         quality,
    //         imageSrc,
    //         urlDown
    //       })
    //     })
    // })
  });
}

module.exports = GetVideo;
