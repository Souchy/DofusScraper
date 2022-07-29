import cheerio from 'cheerio';
import puppeteer from 'puppeteer'
import puppeteerextra from 'puppeteer-extra'
import fs from 'fs';
// static
import jsonClasses from '../data/static/classes.json';
import jsonSpellLevels from '../data/static/spellLevels.json'
// scraped
import jsonSpells from '../data/scraped/spells.json';
import jsonPetsIds from '../data/scraped/petIds.json'
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

// Pets.scrapeIds();
// Pets.scrapeDataAll();

// ItemScraper.scrapItemIds();
// ItemScraper.scrapItems();
