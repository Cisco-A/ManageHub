import { describe, expect, it } from '@jest/globals';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  describe('Basic formatting', () => {
    it('should format NGN by default', () => {
      expect(formatCurrency(5000)).toBe('₦5,000.00');
    });

    it('should format USD when specified', () => {
      expect(formatCurrency(1200, 'USD')).toBe('$1,200.00');
    });


    it('should format GBP when specified', () => {
      expect(formatCurrency(500, 'GBP')).toBe('£500.00');
    });



  });

  describe('Decimal places', () => {
    it('should handle decimal amounts correctly', () => {
      expect(formatCurrency(1234.56, 'NGN')).toBe('₦1,234.56');
    });

    it('should round to 2 decimal places by default', () => {
      expect(formatCurrency(99.999, 'USD')).toBe('$100.00');
    });

    it('should respect custom minimumFractionDigits', () => {
      const result = formatCurrency(100, {
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      expect(result).toBe('$100');
    });

    it('should respect custom maximumFractionDigits', () => {
      const result = formatCurrency(123.456789, {
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      });
      expect(result).toBe('$123.4568');
    });
  });

  describe('Edge cases', () => {
    

    it('should handle negative numbers', () => {
      expect(formatCurrency(-500, 'USD')).toBe('-$500.00');
    });

    it('should handle very large numbers', () => {
      expect(formatCurrency(1000000000, 'NGN')).toBe('₦1,000,000,000.00');
    });

    it('should handle very small decimal numbers', () => {
      expect(formatCurrency(0.01, 'USD')).toBe('$0.01');
    });

    it('should throw error for non-finite numbers', () => {
      expect(() => formatCurrency(NaN)).toThrow(TypeError);
      expect(() => formatCurrency(Infinity)).toThrow(TypeError);
      expect(() => formatCurrency(-Infinity)).toThrow(TypeError);
    });

    it('should throw error for non-number input', () => {
      // @ts-expect-error - Testing invalid input
      expect(() => formatCurrency('100')).toThrow(TypeError);
      // @ts-expect-error - Testing invalid input
      expect(() => formatCurrency(null)).toThrow(TypeError);
    });
  });


  describe('Options object vs string parameter', () => {
    it('should accept currency as string parameter', () => {
      expect(formatCurrency(100, 'EUR')).toMatch(/100[.,]00/);
    });

    it('should accept currency in options object', () => {
      expect(formatCurrency(100, { currency: 'GBP' })).toBe('£100.00');
    });

    it('should work with no parameters (default NGN)', () => {
      expect(formatCurrency(250)).toBe('₦250.00');
    });
  });

  describe('TypeScript type safety', () => {
    it('should have proper return type', () => {
      const result: string = formatCurrency(100);
      expect(typeof result).toBe('string');
    });

    it('should accept CurrencyCode types', () => {
      const currencies: Array<'NGN' | 'USD' | 'EUR'> = ['NGN', 'USD', 'EUR'];
      currencies.forEach(currency => {
        const result = formatCurrency(100, currency);
        expect(typeof result).toBe('string');
      });
    });
  });
});
