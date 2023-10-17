import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { TasksController } from './tasks/tasks.controller';
import { ScraperService } from './scraper/scraper.service';
import { ScraperController } from './scraper/scraper.controller';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [TasksModule, ScraperModule],
  controllers: [AppController, TasksController, ScraperController],
  providers: [AppService, TasksService, ScraperService],
})
export class AppModule {}
