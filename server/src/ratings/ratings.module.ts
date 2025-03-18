import { Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [RatingsController],
})
export class RatingsModule {}