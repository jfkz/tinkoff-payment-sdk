import { SdkError } from '../common/sdk-error';

describe('SdkError', () => {
  it('should use the default message when no options are provided', () => {
    const err = new SdkError({});
    expect(err.message).toBe('Tinkoff Payment SDK error');
  });

  it('should use the provided message', () => {
    const err = new SdkError({ message: 'custom error' });
    expect(err.message).toBe('custom error');
  });

  it('should prefer payload.Message over provided message', () => {
    const err = new SdkError({ payload: { Message: 'from payload' }, message: 'override' });
    expect(err.message).toBe('from payload');
  });

  it('should store the payload on the instance', () => {
    const payload = { Message: 'oops', ErrorCode: '99' };
    const err = new SdkError({ payload });
    expect(err.payload).toEqual(payload);
  });

  it('should be an instance of Error', () => {
    const err = new SdkError({});
    expect(err).toBeInstanceOf(Error);
  });

  it('should have no payload when not provided', () => {
    const err = new SdkError({ message: 'no payload' });
    expect(err.payload).toBeUndefined();
  });
});
