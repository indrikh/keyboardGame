import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return newUser.save();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async updateStats(userId: string, speed: number): Promise<User> {
    const user = await this.userModel.findById(userId);
    
    const newGamesPlayed = user.gamesPlayed + 1;
    const newAvgSpeed = ((user.avgSpeed * user.gamesPlayed) + speed) / newGamesPlayed;
    
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: { 
          avgSpeed: Math.round(newAvgSpeed * 100) / 100,
          gamesPlayed: newGamesPlayed,
        },
      },
      { new: true },
    );
  }

  async getTopUsers(limit: number = 10): Promise<User[]> {
    return this.userModel
      .find()
      .sort({ avgSpeed: -1 })
      .limit(limit)
      .select('-password')
      .exec();
  }
}