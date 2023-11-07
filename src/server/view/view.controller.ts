import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { ViewService } from './view.service';

@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get([ 'home', 'dashboard', '_next*', 'favicon.ico'])
  public async handleRequest(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
