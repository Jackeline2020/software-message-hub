import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;

    beforeEach(() => {
        strategy = new JwtStrategy();
    });

    describe('validate', () => {
        it('should return user data from payload', async () => {
            const payload = {
                sub: '123',
                username: 'test-user',
            };

            const result = await strategy.validate(payload);

            expect(result).toEqual({
                userId: '123',
                username: 'test-user',
            });
        });
    });
});
