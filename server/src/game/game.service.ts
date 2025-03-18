import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Text, TextDocument } from './schemas/text.schema';
import { GameResultDto } from './dto/game-result.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Text.name) private textModel: Model<TextDocument>,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<Text[]> {
    return this.textModel.find().exec();
  }

  async findByLanguage(language: string): Promise<Text[]> {
    return this.textModel.find({ language }).exec();
  }

  async findRandom(language: string = 'ru'): Promise<Text> {
    const count = await this.textModel.countDocuments({ language });
    const random = Math.floor(Math.random() * count);
    return this.textModel.findOne({ language }).skip(random).exec();
  }

  async create(text: Partial<Text>): Promise<Text> {
    const newText = new this.textModel(text);
    return newText.save();
  }

  async saveGameResult(gameResultDto: GameResultDto): Promise<any> {
    // Update user stats
    await this.usersService.updateStats(gameResultDto.userId, gameResultDto.speed);

    return {
      success: true,
      message: 'Game result saved successfully',
    };
  }
}