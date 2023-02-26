const { load } = require("cheerio"); //?
const tiny = require("tinyurl"); //?
const regex = require("./utils");
const superagent = require("superagent"); //?
const puppeteer = require("puppeteer-core");
// const puppeteer = require("puppeteer");
// const fs=require('fs')

const {
  promiseSetTimeOut,
  extractK,
  extractYtID,
  BROWSERLESS_API_KEY,
} = require("./constants");

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

    const url = "https://x2download.app/en48";

    // console.log('tomp3URL: ',url)

    const browser = await puppeteer.connect(options);
    // const browser = await puppeteer.launch({
    //   args: ["--no-sandbox"],
    //   executablePath: "./chromium/chrome-win/chrome.exe",
    //   headless: false,
    // });
    // .then(async(browser)=>{
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
    await page.evaluate((select) => {
      const options = select.querySelector('optgroup[label="mp3"]').children;

      options[0].selected = true;

      // for (let option of options) {
      //   if (option.value === quality) {
      //     option.selected = true;
      //   }
      // }

      document.querySelector("#btn-action").click();
    }, selectHandler);
    // document.querySelector('#asuccess')
    const aHandle = await page.waitForSelector(
      "a#asuccess.form-control.mesg-convert.success"
    );
    // console.log(aHandle);
    await promiseSetTimeOut(5000);
    const dlink = await page.evaluate((e) => e.getAttribute("href"), aHandle);

    browser.close();

    let urlDown = await tiny.shorten(dlink);
    // let urlDown = dlink;
    resolve({
      type: "mp3",

      urlDown,
    });
  });
}

module.exports = GetAudio;
