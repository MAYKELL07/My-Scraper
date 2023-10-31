import { Module } from '@nestjs/common';
import { ScraperService } from '../scraper/scraper.service';
import { ScraperController } from '../scraper/scraper.controller';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
  imports: [ ScraperModule ],
  controllers: [ ScraperController ],
  providers: [ ScraperService ],
})
export class AppModule {}
