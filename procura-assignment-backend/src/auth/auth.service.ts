import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from '../profiles/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Profile> {
    const user = await this.profileRepo.findOne({ where: { email } });
    console.log('User from DB:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    console.log('Password check =>', {
      plain: pass,
      hash: user.password,
      result: isMatch,
    });
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async register(userData: { name: string; email: string; username: string; password: string; role?: string }) {
    // Check if user already exists
    const existingUser = await this.profileRepo.findOne({ 
      where: [{ email: userData.email }, { username: userData.username }] 
    });
    
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const newUser = this.profileRepo.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user',
    });

    const savedUser = await this.profileRepo.save(newUser);

    // Return user without password
    const { password, ...userResponse } = savedUser;
    return userResponse;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    
    console.log('Auth Service - Generated token payload:', payload);
    console.log('Auth Service - Generated token (first 50 chars):', token.substring(0, 50) + '...');
    
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}
