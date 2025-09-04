import { ValidationStrategy } from './validation.strategy';

describe('ValidationStrategy', () => {
    let strategy: ValidationStrategy;

    beforeEach(() => {
        strategy = new ValidationStrategy();
    });

    describe('formatDate', () => {
        it('should format yyyymmdd number to dd/mm/yyyy', async () => {
            const input = 20250904;
            const result = await strategy.formatDate(input);
            expect(result).toBe('04/09/2025');
        });

        it('should handle single-digit days and months', async () => {
            const input = 20250904; // 4 de setembro de 2025
            const result = await strategy.formatDate(input);
            expect(result).toBe('05/01/2025');
        });
    });

    describe('formatToYYYYMMDD', () => {
        it('should convert date to yyyymmdd number', async () => {
            const input = new Date(Date.UTC(2025, 8, 4)); // 4 de setembro de 2025
            const result = await strategy.formatToYYYYMMDD(input);
            expect(result).toBe(20250904);
        });

        it('should pad single-digit days and months', async () => {
            const input = new Date(Date.UTC(2025, 8, 4)); // 4 de setembro de 2025
            const result = await strategy.formatToYYYYMMDD(input);
            expect(result).toBe(20250105);
        });
    });
});
