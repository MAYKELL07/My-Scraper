import fs from 'fs/promises';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
    private browser;
    private cookieData;

    async onModuleInit() {
        const playwright = addExtra(require('playwright')).use(StealthPlugin());
        this.browser = await playwright.chromium.launch({ headless: false });
        this.cookieData = await fs.readFile('src/scraper/cookie.json', 'utf8');
    }

    async onModuleDestroy() {
        await this.browser.close();
    }

    async AI(prompt: string, AIName: string): Promise<string> {
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();
        const cookies = JSON.parse(this.cookieData);
        await context.addCookies(cookies);

        await page.goto(`https://poe.com/${AIName}`);
        await page.fill('textarea', prompt); // Shortened for brevity
        await page.keyboard.press('Enter');
        await page.waitForSelector('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > div.InfiniteScroll_container__PHsd4.ChatMessagesView_infiniteScroll__vk3VX > div.ChatMessagesView_messagePair__ZEXUz > section.ChatMessageActionBar_actionBar__gyeEs > button:nth-child(2)')

        const imgElement = await page.$('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > div.InfiniteScroll_container__PHsd4.ChatMessagesView_infiniteScroll__vk3VX > div.ChatMessagesView_messagePair__ZEXUz > div:nth-child(2) > div.ChatMessage_messageRow__DHlnq > div.ChatMessage_messageWrapper__4Ugd6 > div > div.Message_row__ug_UU > div > div > p > span > img');
        if (imgElement) {
            const imgSrc = await imgElement.getAttribute('src');
            return imgSrc;
        } else {
            const responseText = await page.textContent('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > div.InfiniteScroll_container__PHsd4.ChatMessagesView_infiniteScroll__vk3VX > div.ChatMessagesView_messagePair__ZEXUz > div:nth-child(2) > div.ChatMessage_messageRow__DHlnq > div.ChatMessage_messageWrapper__4Ugd6 > div > div.Message_row__ug_UU > div > div > p:nth-child(1)'); // Shortened for brevity
            return responseText;
        }
    }

    async scrapeAlodokter(inputText: string): Promise<any> {
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();
        await page.goto('https://www.alodokter.com', { waitUntil: 'domcontentloaded' });
    
        await page.fill('#searchinput', inputText);
        await page.keyboard.press('Enter');
        
        try {
            await page.waitForSelector('#articles-result > card-post-index:nth-child(1)', { state: 'attached', timeout: 5000 });
        } catch (error) {
            console.error('Element not found:', error);
            await context.close();
            return null;
        }
    
        const result = await page.evaluate(() => {
            const card = document.querySelector('#articles-result > card-post-index:nth-child(1)');
            if (card) {
                return {
                    title: card.getAttribute('title'),
                    link: card.getAttribute('url-path'),
                    image: card.getAttribute('image-url'),
                    shortDescription: card.getAttribute('short-description')
                };
            } else {
                return null;
            }
        });
    
        // Prepend "https://www.alodokter.com" to the link
        if (result && result.link) {
            result.link = `https://www.alodokter.com${result.link}`;
        }
    
        await context.close();
        return result;
    }
    
}
