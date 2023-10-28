import { Module } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';
import { ScraperController } from './scraper/scraper.controller';
import { ScraperModule } from './scraper/scraper.module';
import { WebModule } from './web/web.module';
import { WebService } from './web/web.service';
import { WebController } from './web/web.controller';

@Module({
  imports: [ScraperModule, WebModule],
  controllers: [ScraperController, WebController],
  providers: [ScraperService, WebService],
})
export class AppModule {}
