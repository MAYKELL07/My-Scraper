import { Controller, Post, Body } from '@nestjs/common';
import { ScraperService } from './scraper.service';

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
}
