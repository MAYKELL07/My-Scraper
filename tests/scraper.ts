import express from 'express';
import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const stealth = StealthPlugin();
const playwright = addExtra(require('playwright')).use(stealth);

const app = express();
const PORT = 3000;

app.get('/scrape', async (req, res) => {
    try {
        const scrapedText = await scrapeYouChatText();
        res.json({ message: scrapedText });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape the website.' });
    }
});

async function scrapeYouChatText() {
    const maxRetries = 3; // Define the maximum number of retries
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const browser = await playwright.firefox.launch({ headless: true });
            const context = await browser.newContext();
            const page = await context.newPage();

            await context.addCookies([
                {name:"cf_clearance", value:"NzEi2GfcGJ5uPW0OCPKYCvZllhg0dbDSjdd3DWrSN0w-1697299466-0-1-ddac301c.367d7b30.8aad6ffc-0.2.1697299466", path:"/", domain:".poe.com"},
                {name:"__cf_bm", value:"H3tINjphomcxvN4KaOJaQcCeVcJiWND3.Ncw.6gQ5gg-1697300951-0-AR5jwW3n6T2AC2cIzpu2+OiaGzDkWM1Qb7ZHzo3XBJKvvES/cweEoryrvnzTAaKXpMUQRZ1FJ01s2AbcWKyvtEQ=", path:"/", domain:".poe.com"},
                {name:"p-b", value:"dxHBxsxbqjcCjcfsR1qOBQ%3D%3D", path:"/", domain:"poe.com"}
            ]);

            // Navigate to the target website
            await page.goto('https://poe.com/PythonMind');
        
            // Fill in the text area and press Enter
            await page.fill('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > footer > div > div > div.GrowingTextArea_growWrap__im5W3.ChatMessageInputContainer_textArea__fNi6E > textarea', 'what are you');
            await page.keyboard.press('Enter');
        
            // Wait for the response message to show up
            await page.waitForSelector('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > div.InfiniteScroll_container__PHsd4.ChatMessagesView_infiniteScroll__vk3VX > div:nth-child(4) > div:nth-child(2) > div.ChatMessage_messageRow__DHlnq > div.ChatMessage_messageWrapper__4Ugd6 > div > div.Message_row__ug_UU > div > div > p');
        
            await page.waitForSelector('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > div.InfiniteScroll_container__PHsd4.ChatMessagesView_infiniteScroll__vk3VX > div:nth-child(4) > section.ChatMessageActionBar_actionBar__gyeEs > button:nth-child(2)')
            // Scrape the text and log the output
            const responseText = await page.textContent('#__next > div.AnnouncementWrapper_container__Z51yh > div > main > div > div > div > div > div.InfiniteScroll_container__PHsd4.ChatMessagesView_infiniteScroll__vk3VX > div:nth-child(4) > div:nth-child(2) > div.ChatMessage_messageRow__DHlnq > div.ChatMessage_messageWrapper__4Ugd6 > div > div.Message_row__ug_UU > div > div > p');
            console.log(responseText);

            await browser.close();
            return responseText; // Return the scraped text
        } catch (error) {
            console.error(`Attempt ${retries + 1} failed. Retrying...`);
            retries++;
            if (retries === maxRetries) {
                throw new Error('Max retries reached.');
            }
        }
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
