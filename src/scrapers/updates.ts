import puppeteer from 'puppeteer'
import fs from 'fs';
import { Constants } from './../constants';
import jsonClasses from './../../data/static/classes.json';
import {$, jQuery} from 'jquery';

export class Updates {

	public static mainUrl = "https://www.dofus.com/fr/mmorpg/actualites/maj";


	public static majs = [
		{
			url: "https://www.dofus.com" + "/fr/mmorpg/actualites/maj/1471367-mise-jour-2-64",
			date: "28 Juin 2022 :",
			version: "MÀJ 2.64 - Mise à jour 2.64",
			img: "https://static.ankama.com/ankama/cms/images/282/2022/06/28/1472896.jpg"
		}	
	];


	public static async asdf() {
		let url = Updates.majs[0].url;
		let urlDetails = url + "/details";

		let page = await Constants.getPuppeteer(urlDetails);

		let result = await page.evaluate(() => {
			let headerClasses = document.querySelector("CLASSES : ÉQUILIBRAGE ET CORRECTIFS");

			for(let i in jsonClasses.names) {
				let className = jsonClasses.names[i];
				let headerClasse = document.querySelector("h2" + className.toUpperCase());
				if(headerClasse) {
					let ele = headerClasses;
					ele = ele.nextElementSibling;
					// $(ele).next("h3");

					while(!ele.querySelector("h2")) {
						if(ele.querySelector("ul")) {

						}
					}
				}
			}

			var elems = $('h2:first').nextUntil('h2').andSelf().wrapAll('<div />');

			// document.querySelector("Détails des sorts", null);
			
			// ele.parentElement;
			// ele.nextSibling;
			// $('').next("");
			// $("").siblings("");
			

		});

		await page.browser().close();
		fs.appendFile(Constants.outputdir + 'petIds.json', JSON.stringify(result, null, "\t"), 'utf8', () => { });
	}

	
	public static async scrapeIds() {
		
	}

	public static async scrapeDataAll() {

	}

	public static async scrapeData() {

	}

}
