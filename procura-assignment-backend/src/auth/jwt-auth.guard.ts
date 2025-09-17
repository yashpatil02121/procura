import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    console.log('JWT Auth Guard - Token:', token ? 'Token exists' : 'No token');
    console.log('JWT Auth Guard - Full authorization header:', request.headers.authorization);

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('JWT Auth Guard - Error:', err);
    console.log('JWT Auth Guard - User:', user);
    console.log('JWT Auth Guard - Info:', info);

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
