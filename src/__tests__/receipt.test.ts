import { validateAndPrepareReceipt, validateAndPrepareCardData } from '../api-client/requests/common/receipt';
import { ReceiptTaxation, ReceiptTax } from '../api-client/requests/common/receipt';

describe('validateAndPrepareReceipt', () => {
  const baseItem = {
    Name: 'Widget',
    Price: 10,
    Quantity: 1,
    Tax: ReceiptTax.NONE,
  };

  const baseReceipt = {
    Taxation: ReceiptTaxation.OSN,
    Items: [baseItem],
  };

  it('should throw when Items is missing', () => {
    expect(() => validateAndPrepareReceipt({ Taxation: ReceiptTaxation.OSN } as any)).toThrow(
      'Receipt.Items must be set',
    );
  });

  it('should throw when Items is empty', () => {
    expect(() => validateAndPrepareReceipt({ ...baseReceipt, Items: [] })).toThrow(
      'Receipt.Items must contain at least one item',
    );
  });

  it('should throw when item Price is missing', () => {
    expect(() =>
      validateAndPrepareReceipt({
        ...baseReceipt,
        Items: [{ ...baseItem, Price: 0 }],
      }),
    ).toThrow('Price must be set');
  });

  it('should throw when item Quantity is zero or negative', () => {
    expect(() =>
      validateAndPrepareReceipt({
        ...baseReceipt,
        Items: [{ ...baseItem, Quantity: 0 }],
      }),
    ).toThrow('quantity must be greater than zero');
  });

  it('should convert item Price to kopecks', () => {
    const result = validateAndPrepareReceipt(baseReceipt);
    expect(result.Items[0].Price).toBe(1000); // 10 RUB -> 1000 kopecks
  });

  it('should auto-calculate Amount when not provided', () => {
    const result = validateAndPrepareReceipt({
      ...baseReceipt,
      Items: [{ ...baseItem, Price: 5, Quantity: 3 }],
    });
    // Price 5 RUB -> 500 kopecks; Amount = 500 * 3 = 1500
    expect(result.Items[0].Amount).toBe(1500);
  });

  it('should preserve provided Amount', () => {
    const result = validateAndPrepareReceipt({
      ...baseReceipt,
      Items: [{ ...baseItem, Price: 5, Quantity: 2, Amount: 999 }],
    });
    expect(result.Items[0].Amount).toBe(999);
  });
});

describe('validateAndPrepareCardData', () => {
  it('should serialize card data fields to key=value;... string', () => {
    const result = validateAndPrepareCardData({
      PAN: 4111111111111111 as any,
      ExpData: new Date('2025-12-01') as any,
      CVV: '123',
    });
    expect(result).toContain('PAN=');
    expect(result).toContain('CVV=123');
  });
});
