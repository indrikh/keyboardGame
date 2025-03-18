import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      // Используем деструктуризацию без метода toObject
      const { password, ...result } = user as any;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOne(createUserDto.email);
    
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    
    const user = await this.usersService.create(createUserDto);
    // Используем деструктуризацию без метода toObject
    const { password, ...result } = user as any;
    
    return this.login(result);
  }
}