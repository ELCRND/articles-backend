// src/viewers/viewers.controller.ts
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ViewersService } from './viewers.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ObjectId } from 'mongodb';

@Public()
@Controller('viewers')
export class ViewersController {
  constructor(private readonly viewersService: ViewersService) {}

  @Post(':articleId')
  async trackView(@Param('articleId') articleId: string) {
    return this.viewersService.trackView(new ObjectId(articleId));
  }

  @Get()
  async getCurrentViewers() {
    return this.viewersService.getCurrentlyViewingArticles();
  }
}
