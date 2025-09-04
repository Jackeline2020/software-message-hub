import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn().mockResolvedValue({ accessToken: 'fake-token' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return the access token', async () => {
    const result = await authController.login();

    expect(authService.login).toHaveBeenCalled();
    expect(result).toEqual({ accessToken: 'fake-token' });
  });
});
