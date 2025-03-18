import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getTopUsers() {
    return this.usersService.getTopUsers();
  }
}