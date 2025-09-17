import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      role: 'admin'
    };

    const user = await authService.register(testUser);
    console.log('Test user created:', user);
  } catch (error: any) {
    console.log('User might already exist or error occurred:', error.message);
  }

  await app.close();
}

bootstrap();
