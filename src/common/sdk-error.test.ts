import { SdkError, PayloadWithMessage } from './sdk-error';

describe('SdkError', () => {
  it('should create an error with the default message when no message or payload is provided', () => {
    const error = new SdkError({});
    expect(error.message).toBe('Tinkoff Payment SDK error');
    expect(error.payload).toBeUndefined();
  });

  it('should create an error with the provided message when no payload is provided', () => {
    const customMessage = 'Custom error message';
    const error = new SdkError({ message: customMessage });
    expect(error.message).toBe(customMessage);
    expect(error.payload).toBeUndefined();
  });

  it('should create an error with the message from the payload when provided', () => {
    const payload: PayloadWithMessage = { Message: 'Payload error message' };
    const error = new SdkError({ payload });
    expect(error.message).toBe(payload.Message);
    expect(error.payload).toEqual(payload);
  });

  it('should create an error with the provided message and payload', () => {
    const customMessage = 'Custom error message';
    const payload: PayloadWithMessage = { Message: 'Payload error message' };
    const error = new SdkError({ message: customMessage, payload });
    expect(error.message).toBe(payload.Message);
    expect(error.payload).toEqual(payload);
  });

  it('should create an error with the payload when provided without a message', () => {
    const payload: PayloadWithMessage = { data: 'Some data' };
    const error = new SdkError({ payload });
    expect(error.message).toBe('Tinkoff Payment SDK error');
    expect(error.payload).toEqual(payload);
  });
});
