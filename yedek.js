const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const $ = require('cheerio');



async function getPageData(url,page){

  await page.goto(url);
  const h1 = await page.$eval("#wrapper > div.bg-grey2018 > div.container.detail-v2-identifier.bg-grey2018.mt10 > div > div.detail-column-detail.pr > p",h1 =>h1.textContent);
  //İLAN NO//const date = await page.$eval(".classifiedInfo .classifiedInfoList .classifiedId",date =>date.innerText);
  const pageNo = await page.$eval("#js-hook-for-observer-detail > div.banner-column-detail.bcd-mid-extended.p10.bg-white > ul > li:nth-child(1) > span.bli-particle.semi-bold",date =>date.textContent);
  const date = await page.$eval("#js-hook-for-observer-detail > div.banner-column-detail.bcd-mid-extended.p10.bg-white > ul > li:nth-child(2) > span:nth-child(2)",date =>date.innerText);

  return {
  ilanAdi:h1,
  ilanNumarasi:pageNo,
  yTarihi:date


 }
};

async function getLinks(){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0); 
  await page.goto("https://www.arabam.com/ikinci-el/otomobil/audi?take=50&sort=startedAt.desc&page=1");
  await page.click("#main-listing > thead > tr > td:nth-child(8) > a > span")
  const links= await page.$$eval("#main-listing .listing-modelname > h3 > a", allAs => allAs.map(a => a.href));

await browser.close();
return links;

}
async function main(){
  const allLinks  = await getLinks();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const scrapedData = [];
 page.waitForNavigation

  for (let link of allLinks) {
    const data = await getPageData(link,page);
   const secontToWait = (Math.floor( Math.random() *4)  + 1 ) * 1000
    await page.waitForTimeout(secontToWait); 
    scrapedData.push(data);
 
  }
  console.log(scrapedData);
  await browser.close();
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(scrapedData);
  xlsx.utils.book_append_sheet(wb,ws);
  xlsx.writeFile(wb,"cars.xlsx");

 

}
main();
