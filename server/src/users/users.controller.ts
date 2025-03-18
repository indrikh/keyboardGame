import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    // Используем деструктуризацию без метода toObject
    const { password, ...result } = user as any;
    return result;
  }

  @Get('top')
  async getTopUsers() {
    return this.usersService.getTopUsers();
  }
}