import puppeteer from 'puppeteer'
import fs from 'fs';
import jsonClasses from '../DofusDB/static/classes.json';
import jsonSpellIds from '../DofusDB/scraped/spellIds.json';
import jsonSpells from '../DofusDB/scraped/spells.json';
import jsonSpellLevels from '../DofusDB/static/spellLevels.json'
import { Constants } from '../constants';
import http from 'https';


export class SpellScraper {

	public static async scrapSpellIds() {
		console.log("Scrap spells");
		let fullData = {};

		const browser: puppeteer.Browser = await puppeteer.launch();
		const page: puppeteer.Page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')

		for (let i = 0; i < jsonClasses.orderById.length; i++) {
			let className = jsonClasses.orderById[i];
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
		fs.writeFile(Constants.outputdir + 'spellIds.json', JSON.stringify(fullData, null, "\t"), 'utf8', () => { });
	}


	public static async scrapSpellData() {
		const browser: puppeteer.Browser = await puppeteer.launch();
		const page: puppeteer.Page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')

		let clazzId = 0;
		for (let clazzName in jsonSpellIds) {
			// if(clazzName == "feca") continue;
			// if(clazzId >= 1) break;
			// let spelli = 0;
			clazzId++;
			let clazz = jsonSpellIds[clazzName];
			for (let spelli in clazz) {
				// if(spelli >= "2") break;
				let level = jsonSpellLevels[spelli];
				// console.log("level: " + level);
				let spell = clazz[spelli];
				let urlstr: string = spell.url;
				let url = new URL(urlstr);
				url.searchParams.delete("level");
				url.searchParams.set("level", level + "");
				// console.log("url: " + url.toString());

				await page.goto(url.toString(), { waitUntil: 'networkidle2' });
				await page.click(".ak-accept").catch(onreject => { });


				let data = await page.evaluate(() => {
					let spellEle = document.querySelector(".ak-spell-details");

					const description = spellEle.querySelector(".ak-spell-description").textContent.trim();
					const po_pa = spellEle.querySelector(".ak-spell-po-pa").textContent.trim();
					const effects = spellEle.querySelector(".ak-spell-details-effects").querySelectorAll(".ak-list-element");
					const effectsCrit = spellEle.querySelector(".ak-spell-details-critical").querySelectorAll(".ak-list-element")
					const details = spellEle.querySelector(".ak-spell-details-other").querySelectorAll(".ak-list-element")
					const imgurl: string = spellEle.querySelector(".ak-spell-details-illu").querySelector("img").getAttribute("src");

					let obj = {};
					obj["img"] = imgurl;
					obj["description"] = description;
					obj["po"] = po_pa.split("/")[0].trim();
					obj["pa"] = po_pa.split("/")[1].trim();
					obj["effects"] = [];
					effects.forEach(effect => {
						let str = effect.querySelector(".ak-title").innerHTML.replace("\"", "").trim();
						let val = effect.querySelector(".ak-aside")?.innerHTML.trim();
						obj["effects"].push({
							effect: str,
							val: val
						});
					})
					obj["effectsCrit"] = [];
					effectsCrit.forEach(effect => {
						let str = effect.querySelector(".ak-title").innerHTML.replace("\"", "").trim();
						obj["effectsCrit"].push({
							effect: str,
						});
					})
					obj["details"] = [];
					details.forEach(effect => {
						let str = effect.querySelector(".ak-title").innerHTML.replace("\"", "").trim();
						let val = effect.querySelector(".ak-aside").innerHTML.replace("\"", "").trim();
						let info = effect.querySelector(".ak-text")?.innerHTML.trim();

						obj["details"].push({
							effect: str,
							info: info,
							val: val
						});
					})

					return obj;
				});
				for (var i in data) {
					var key = i;
					var val = data[i];
					spell[key] = val;
				}
				// clazz[spellName] = data;

				console.log("got " + clazzId + "-" + clazzName + ", " + spelli + "-" + spell.name + ": "); // + JSON.stringify(spell, null, "\t"));
			}
		}
		fs.writeFile(Constants.outputdir + 'spells.json', JSON.stringify(jsonSpellIds, null, "\t"), 'utf8', () => { });
	}


	public static async scrapSpellImg() {
		for(let breedName in jsonSpells) {
			let breed = jsonSpells[breedName];
			for(let spell of breed) {
				const file = fs.createWriteStream("./src/DofusDB/scraped/spells/" + spell.id + ".png");
				const request = http.get(spell.img, function(response) {
					response.pipe(file);
					// after download completed close filestream
					file.on("finish", () => {
						file.close();
						console.log("Download Completed for " + spell.name);
					});
				}); 
			}
		}
	}



	// var download = function(uri, filename, callback){
	// 	request.head(uri, function(err, res, body){
	// 	  console.log('content-type:', res.headers['content-type']);
	// 	  console.log('content-length:', res.headers['content-length']);

	// 	  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	// 	});
	//   };

	//   download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
	// 	console.log('done');
	//   });

	public download(url, filename) {
		fetch(url).then(function (t) {
			return t.blob().then((b) => {
				var a = document.createElement("a");
				a.href = URL.createObjectURL(b);
				a.setAttribute("download", filename);
				a.click();
			}
			);
		});
	}

	public downloadi(source){
		const fileName = source.split('/').pop();
		var el = document.createElement("a");
		el.setAttribute("href", source);
		el.setAttribute("download", fileName);
		document.body.appendChild(el);
		el.click();
		el.remove();
	}

}
