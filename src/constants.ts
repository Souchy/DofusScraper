import puppeteer from 'puppeteer'

export class Constants {

	public static readonly outputdir: string = "./data/scraped/"


	public static async getPuppeteer(url: string): Promise<puppeteer.Page> {
		const browser: puppeteer.Browser = await puppeteer.launch();
		const page: puppeteer.Page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
		
		await page.goto(url, { waitUntil: 'networkidle2' }); // "https://www.dofus.com/fr/mmorpg/encyclopedie/classes/" + id + "-" + className
		await page.click(".ak-accept").catch(onreject => { });
		return page;
	}

}
