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

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
