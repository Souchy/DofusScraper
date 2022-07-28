import puppeteer from 'puppeteer'
import fs from 'fs';
import jsonClasses from '../../data/static/classes.json';
import jsonSpells from '../../data/scraped/spells.json';
import jsonSpellLevels from '../../data/static/spellLevels.json';
import jsonPetIds from "../../data/scraped/petIds.json";
import { Constants } from '../constants';

export class Pets {
	public static mainUrl = "https://www.dofus.com/fr/mmorpg/encyclopedie/familiers";

	public static async scrapeIds() {
		let url = Pets.mainUrl;
		let fullData = [];

		let page = await Constants.getPuppeteer(url);
		// let nextBtn: Element = null;

		do {
			url = await page.evaluate(() => {
				let pages: NodeListOf<Element> = document.querySelectorAll(".ak-pagination li");
				let nextBtn: Element = pages[pages.length - 2];
				if(nextBtn.classList.contains("disabled")) {
					return null;
				} else {
					return "https://www.dofus.com" + nextBtn.querySelector("a").getAttribute("href");
				}
			});

			let pageData = await page.evaluate(() => {
				let lines = document.querySelectorAll("table tbody tr");
				console.log("lines: " + lines);
				let results = [];
				lines.forEach(line => {
					let linker = line?.querySelector(".ak-linker");
					let imgEle = linker?.querySelector("img");
					let hasqtip = linker?.getAttribute("data-hasqtip");
					let id = hasqtip?.substring(hasqtip.lastIndexOf("_"));
					let url = "https://www.dofus.com" + linker?.querySelector("a").getAttribute("href");
					
					results.push({
						id: id,
						name: imgEle?.getAttribute("alt"),
						url: url,
						img: imgEle?.getAttribute("src"),
						// bonus: line?.querySelectorAll(".ak-icon-small"),
						effects: [],
						type: line?.querySelector(".item-type")?.innerHTML.trim(),
						level: line?.querySelector(".item-level")?.innerHTML.trim(),
					});
				})
				return results;
			});

			console.log("next url: " + url);
			// console.log("data: " + JSON.stringify(pageData, null, "\t")); //JSON.stringify(pageData));
			console.log("data: " + pageData);
			pageData.forEach(d => {
				fullData.push(d);
			})
			// fullData.push(pageData);
			// fs.appendFile(Constants.outputdir + 'petIds.json', JSON.stringify(pageData, null, "\t"), 'utf8', () => { });

			if(url) await page.goto(url, { waitUntil: 'networkidle2' });
		} while(url != null);

		await page.browser().close();
		fs.writeFile(Constants.outputdir + 'petIds.json', JSON.stringify(fullData, null, "\t"), 'utf8', () => { });
	}

	public static async scrapeData(pet: any) {
		console.log("Pets.scrapeData from: " + pet.url);
		let page = await Constants.getPuppeteer(pet.url);

		// await page.select(".form-control .ak-details-select [name=\"level\"]", "100");
		try {
			let values = await page.select(".ak-details-select", "100");
			await page.waitForTimeout(1500);
			// console.log("select values: " + values);
			// await page.screenshot({path: 'screenshotPet.png', fullPage: true});
		} catch(e) {
		}

		let data = await page.evaluate(() => {
			const effects = document.querySelector(".ak-content-list")?.querySelectorAll(".ak-list-element");
			if(!effects) return null;
			let results = {};
			results["effects"] = [];
			effects.forEach(effect => {
			  let str = effect.querySelector(".ak-title").innerHTML.replace("\"", "").trim();
			  let val = effect.querySelector(".ak-aside")?.innerHTML.trim();
			  results["effects"].push({
				effect: str,
				val: val
			  });
			});
			return results;
		});
		// pet["effects"] = data["effects"];
		if(data) {
			pet.effects = data["effects"];
		}

		console.log("got pet: " + JSON.stringify(pet, null, "\t"));
		
		await page.browser().close();
		// fs.appendFile(Constants.outputdir + 'pets.json', JSON.stringify(pet, null, "\t") + "\n", 'utf8', () => { });
		return pet;
	}
	
	public static async scrapeDataAll() {
		// let page = await Constants.getPuppeteer(Pets.mainUrl);
		let fullData = [];
		for(let i in jsonPetIds) {
			let pet = jsonPetIds[i];
			pet = await Pets.scrapeData(pet);
			// delete pet["bonus"];
			fullData.push(pet);
		}
		// await page.browser().close();
		fs.writeFile(Constants.outputdir + 'pets.json', JSON.stringify(fullData, null, "\t"), 'utf8', () => { });
	}


}
