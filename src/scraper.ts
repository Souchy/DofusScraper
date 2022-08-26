import cheerio from 'cheerio';
import puppeteer from 'puppeteer'
import puppeteerextra from 'puppeteer-extra'
import fs from 'fs';
// static
import jsonClasses from './DofusDB/static/classes.json';
import jsonSpellLevels from './DofusDB/static/spellLevels.json'
// scraped
import jsonSpells from './DofusDB/scraped/spells.json';
import jsonPetsIds from './DofusDB/scraped/petIds.json'
// scrapers
import { SpellScraper } from './scrapers/spells';
import { ItemScraper } from './scrapers/items';
import { Pets } from './scrapers/pets';

const dofusurl = "https://www.dofus.com/fr/mmorpg/encyclopedie/";
const staticurl = "https://static.ankama.com/dofus/www/game/"; // + "spells/55/3772.png"


/*
 *	Décomenter ou ajouter la ligne voulue et rouler le fichier avec `npm run scraper` 
 */

// SpellScraper.scrapSpellIds();
// SpellScraper.scrapSpellData();
// SpellScraper.scrapSpellImg();

// Pets.scrapeIds();
// Pets.scrapeDataAll();

// ItemScraper.scrapItemIds();
// ItemScraper.scrapItems();
