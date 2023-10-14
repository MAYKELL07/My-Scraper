import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const stealth = StealthPlugin();
const playwright = addExtra(require('playwright')).use(stealth);


async function scrapeYouChatText() {
    const browser = await playwright.firefox.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await context.addCookies([
        {name:"cf_clearance", value:"NzEi2GfcGJ5uPW0OCPKYCvZllhg0dbDSjdd3DWrSN0w-1697299466-0-1-ddac301c.367d7b30.8aad6ffc-0.2.1697299466", path:"/", domain:".poe.com"},
        {name:"__cf_bm", value:"H3tINjphomcxvN4KaOJaQcCeVcJiWND3.Ncw.6gQ5gg-1697300951-0-AR5jwW3n6T2AC2cIzpu2+OiaGzDkWM1Qb7ZHzo3XBJKvvES/cweEoryrvnzTAaKXpMUQRZ1FJ01s2AbcWKyvtEQ=", path:"/", domain:".poe.com"},
        {name:"p-b", value:"dxHBxsxbqjcCjcfsR1qOBQ%3D%3D", path:"/", domain:"poe.com"},
    ]);

    // Navigate to the target website
    await page.goto('https://poe.com/explore?category=');
    
}

scrapeYouChatText();