import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return the access token', async () => {
    const expectedPayload = {
      sub: 'guest',
      username: 'guest-user',
    };

    const result = await authService.login();

    expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
  });
});
