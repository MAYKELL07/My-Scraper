import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { Response } from 'express';

@Controller('scraper')
export class ScraperController {
    constructor(private readonly scraperService: ScraperService) {}

    @Post('AI')
    async AI(
        @Body('prompt') prompt: string,
        @Body('AIName') AIName: string
    ): Promise<string> {
        return await this.scraperService.AI(prompt, AIName);
    }

    @Post('alodokter')
    async scrapeAlodokter(@Body('inputText') inputText: string): Promise<string> {
        return await this.scraperService.scrapeAlodokter(inputText);
    }
    
    @Post('genshin-stats')
    async scrapeGenshinStats(@Body('userUID') userUID: string): Promise<any> {
        return await this.scraperService.scrapeGenshinStats(userUID);
    }

    @Get('indonesia-stock-data')
    async getIndonesiaStockData(@Res() res: Response) {
        try {
            const screenshotBuffer = await this.scraperService.scrapeIndonesiaStockData();
            res.setHeader('Content-Type', 'image/png');
            res.send(screenshotBuffer);
        } catch (error) {
            res.status(500).send('Failed to capture screenshot');
        }
    }
}
