import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResultDto } from './dto/game-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('text')
  async getRandomText(@Query('language') language: string = 'ru') {
    return this.gameService.findRandom(language);
  }

  @UseGuards(JwtAuthGuard)
  @Post('result')
  async saveResult(@Body() gameResultDto: GameResultDto) {
    return this.gameService.saveGameResult(gameResultDto);
  }

  // For initial DB seeding
  @Post('text')
  async createText(@Body() text: any) {
    return this.gameService.create(text);
  }
}