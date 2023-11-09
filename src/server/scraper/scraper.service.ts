import fs from 'fs/promises';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Locator } from 'playwright';

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
    private browser;
    private cookieData;

    async onModuleInit() {
        const playwright = addExtra(require('playwright')).use(StealthPlugin());
        this.browser = await playwright.chromium.launch({ headless: false });
        this.cookieData = await fs.readFile('./src/server/scraper/cookie.json', 'utf8');
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
            await context.close();
            return imgSrc;
        } else {
            const responseText = await page.textContent('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > div.InfiniteScroll_container__PHsd4.ChatMessagesView_infiniteScroll__vk3VX > div.ChatMessagesView_messagePair__ZEXUz > div:nth-child(2) > div.ChatMessage_messageRow__DHlnq > div.ChatMessage_messageWrapper__4Ugd6 > div > div.Message_row__ug_UU > div > div > p:nth-child(1)'); // Shortened for brevity
            await context.close();
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

    async scrapeGenshinStats(userUID: string): Promise<any> {
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();
        await page.goto('https://dak.gg/genshin/en');

        // Input the UID
        await page.fill('#__next > div > main > div > div.container > div.search-input > div > form > input[type=text]', userUID);
        await page.keyboard.press('Enter');

        // Capture screenshot of the chart
        /* const chartElement = await page.waitForSelector('#__next > div > main > div > div.contents-holder > div > div.sc-c1da52f4-0.loONIv > div.sc-e2832524-0.cBZWkv > div.detail > div.contents > div.chart');
        await chartElement.screenshot({ path: 'genshin_chart.png', animations: 'disabled' }); */

        // Scrape the numerical values
        const adventureRank = await page.textContent('#__next > div > main > div > div.contents-holder > div > div.sc-c1da52f4-0.loONIv > div.sc-e2832524-0.cBZWkv > div.detail > div.contents > div.sc-4cd95f9a-0.kIECDb.en > div:nth-child(1) > div:nth-child(3)');
        const worldLevel = await page.textContent('#__next > div > main > div > div.contents-holder > div > div.sc-c1da52f4-0.loONIv > div.sc-e2832524-0.cBZWkv > div.detail > div.contents > div.sc-4cd95f9a-0.kIECDb.en > div:nth-child(2) > div:nth-child(3)');
        const daysActive = await page.textContent('#__next > div > main > div > div.contents-holder > div > div.sc-c1da52f4-0.loONIv > div.sc-e2832524-0.cBZWkv > div.detail > div.contents > div.sc-4cd95f9a-0.kIECDb.en > div:nth-child(3) > div:nth-child(3)');
        const achievements = await page.textContent('#__next > div > main > div > div.contents-holder > div > div.sc-c1da52f4-0.loONIv > div.sc-e2832524-0.cBZWkv > div.detail > div.contents > div.sc-4cd95f9a-0.kIECDb.en > div:nth-child(4) > div:nth-child(3)');
        const spiralAbyss = await page.textContent('#__next > div > main > div > div.contents-holder > div > div.sc-c1da52f4-0.loONIv > div.sc-e2832524-0.cBZWkv > div.detail > div.contents > div.sc-4cd95f9a-0.kIECDb.en > div:nth-child(5) > div:nth-child(3)');
        const spiralAbyssBattle = await page.textContent('#__next > div > main > div > div.contents-holder > div > div.sc-c1da52f4-0.loONIv > div.sc-e2832524-0.cBZWkv > div.detail > div.contents > div.sc-4cd95f9a-0.kIECDb.en > div:nth-child(5) > div.battle-time');

        await context.close();

        return {
            adventureRank,
            worldLevel,
            daysActive,
            achievements,
            spiralAbyss,
            spiralAbyssBattle
        };
    }

    async scrapeIndonesiaStockData(): Promise<Buffer> {
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();
        await page.goto('https://www.idx.co.id/id/data-pasar/ringkasan-perdagangan/ringkasan-saham', { waitUntil: 'networkidle' });

        const elementLocator = page.locator('#app > div.sticky-footer-container-item.--pushed > main > div > div.vgt-boxed.mb-24.vgt-wrap > div > div.vgt-responsive');

        await elementLocator.waitFor();

        const overlayButton = page.locator('#app > div:nth-child(5) > a');
        await overlayButton.evaluate(node => node.style.display = 'none');

        const screenshotBuffer = await elementLocator.screenshot();

        await context.close();
        return screenshotBuffer;
    }

    async scrapeInstagramPost(postUrl: string): Promise<Buffer> {
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 } // Set high-resolution viewport
        });
        const page = await context.newPage();
        await page.goto(postUrl, { waitUntil: 'domcontentloaded' });

        // Locator for the target element to screenshot
        const targetElementLocator = page.locator('div._aagw');
        await targetElementLocator.waitFor();

        // Hide the specified element using locator
        const tagsDivLocator = page.locator('div._a9-5._a9-6._a9-7');
        if (await tagsDivLocator.count() > 0) {
            await tagsDivLocator.waitFor();
            await tagsDivLocator.evaluate(node => (node as HTMLElement).style.display = 'none');
        }

        // Take a high-quality screenshot of the target element
        const screenshotBuffer = await targetElementLocator.screenshot({ quality: 100, type: 'jpeg' });

        await context.close();
        return screenshotBuffer;
    }

    async scrapeTikTokVideo(downloadUrl: string): Promise<string | string[]> {
        try {
            const context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            });
            const page = await context.newPage();
            await page.goto('https://tiktokdownload.online/id', { waitUntil: 'domcontentloaded' });

            await page.fill('#main_page_text', downloadUrl);
            await page.press('#main_page_text', 'Enter');

            await page.waitForSelector('#trending-actions > div.d-flex.flex-1.align-items-center.justify-content-start > div:nth-child(2)');

            const listLocator = page.locator('#main_area_slides > ul');
            const listCount = await listLocator.count();
            console.log(listCount)

            if (listCount > 0) {
                const itemsLocator = listLocator.locator('li > a');
                const itemCount = await itemsLocator.count();
                const slideLinks: string[] = [];
                console.log(itemCount)

                for (let i = 0; i < itemCount; i++) {
                    const href = await itemsLocator.nth(i).getAttribute('href');
                    console.log(href)
                    if (href) {
                        slideLinks.push(href);
                    }
                }
                await context.close();

                return slideLinks;
            } else {
                const downloadButtonLocator: Locator = page.locator('#mainpicture > div > div.flex-1.result_overlay_buttons.pure-u-1.pure-u-sm-1-2 > a.pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link.without_watermark.vignette_active.notranslate');
                await downloadButtonLocator.waitFor();
                const href = await downloadButtonLocator.getAttribute('href');
                await context.close();

                return href;
            }
        } catch (error) {
            console.error('Error scraping TikTok:', error);
            throw error;
        }
    }
}