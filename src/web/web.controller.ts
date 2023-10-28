import { Controller, Get, Res } from '@nestjs/common';
import { WebService } from './web.service';
import { Response } from 'express';

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Get()
  getWebInterface(@Res() res: Response) {
    const html = this.webService.getWebInterface();
    res.send(html);
  }
}
