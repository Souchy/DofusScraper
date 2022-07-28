import cheerio from 'cheerio';
import puppeteer from 'puppeteer'
import puppeteerextra from 'puppeteer-extra'
import fs from 'fs';
import jsonClasses from '../../data/static/classes.json';
import jsonSpells from '../../data/scraped/spells.json';
import jsonSpellLevels from '../../data/static/spellLevels.json'
import { Constants } from '../constants';

export class ItemScraper {

  public static async scrapItemIds() {
    console.log("Scrap spells");
    let fullData = {};

    const browser: puppeteer.Browser = await puppeteer.launch();
    const page: puppeteer.Page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')

    for (let i = 0; i < jsonClasses.ordered.length; i++) {
      let className = jsonClasses.ordered[i];
      let id = i + 1;

      await page.goto("https://www.dofus.com/fr/mmorpg/encyclopedie/classes/" + id + "-" + className, { waitUntil: 'networkidle2' });
      await page.click(".ak-accept").catch(onreject => { });

      let data = await page.evaluate(() => {
        let results = [];
        let spells = document.querySelectorAll(".ak-spell-list-row > .ak-spell-group > .ak-list-block");
        spells.forEach((spell) => {
          const tooltip = spell.querySelector(".ak-tooltip").textContent.trim();
          const variant: boolean = spell.classList.contains("ak-variant");
          const url: string = "https://dofus.com" + spell.querySelector("a").getAttribute("href");
          const imgurl: string = spell.querySelector("img").getAttribute("src");
          var urlParams = new URL(url);
          var id = urlParams.searchParams.get("id");
          results.push({
            id: id,
            name: tooltip,
            variant: variant,
            url: url,
            img: imgurl
          });
        })
        return results;
      })
      // console.log("data: " + JSON.stringify(data));
      fullData[className] = data;
      console.log("\tgot spells for " + id + "-" + className);
    }

    // console.log(fullData);
    console.log("\tgot all spells");
    await browser.close();
    fs.writeFile(Constants.outputdir + 'spells.json', JSON.stringify(fullData, null, "\t"), 'utf8', () => { });
  }
  
  public static async scrapItems() {
    
  }

}
