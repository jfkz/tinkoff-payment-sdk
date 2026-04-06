import { Loggable, SdkLogLevel, SdkLogger, LoggableOptions } from '../logger/logger';

// Expose protected log method for testing
class TestLoggable extends Loggable {
  constructor(options?: LoggableOptions) {
    super(options);
  }

  public callLog(level: SdkLogLevel, ...args: unknown[]): void {
    this.log(level, ...args);
  }
}

describe('Loggable', () => {
  it('should not throw when no logger is provided', () => {
    const obj = new TestLoggable();
    expect(() => obj.callLog(SdkLogLevel.debug, 'msg')).not.toThrow();
  });

  it('should call logger.debug for debug level', () => {
    const calls: unknown[][] = [];
    const logger: SdkLogger = {
      debug: function (...args: unknown[]) {
        calls.push(args);
      },
    };
    const obj = new TestLoggable({ logger });
    obj.callLog(SdkLogLevel.debug, 'dbg');
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(['dbg']);
  });

  it('should call logger.info for info level', () => {
    const calls: unknown[][] = [];
    const logger: SdkLogger = {
      info: function (...args: unknown[]) {
        calls.push(args);
      },
    };
    const obj = new TestLoggable({ logger });
    obj.callLog(SdkLogLevel.info, 'info-msg');
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(['info-msg']);
  });

  it('should call logger.error for error level', () => {
    const calls: unknown[][] = [];
    const logger: SdkLogger = {
      error: function (...args: unknown[]) {
        calls.push(args);
      },
    };
    const obj = new TestLoggable({ logger });
    obj.callLog(SdkLogLevel.error, 'err-msg');
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(['err-msg']);
  });

  it('should call logger.warn for warn level', () => {
    const calls: unknown[][] = [];
    const logger: SdkLogger = {
      warn: function (...args: unknown[]) {
        calls.push(args);
      },
    };
    const obj = new TestLoggable({ logger });
    obj.callLog(SdkLogLevel.warn, 'warn-msg');
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(['warn-msg']);
  });

  it('should call logger.log for log level', () => {
    const calls: unknown[][] = [];
    const logger: SdkLogger = {
      log: function (...args: unknown[]) {
        calls.push(args);
      },
    };
    const obj = new TestLoggable({ logger });
    obj.callLog(SdkLogLevel.log, 'log-msg');
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(['log-msg']);
  });

  it('should not throw when logger method is not defined for a level', () => {
    const logger: SdkLogger = {}; // no methods
    const obj = new TestLoggable({ logger });
    expect(() => obj.callLog(SdkLogLevel.debug, 'msg')).not.toThrow();
    expect(() => obj.callLog(SdkLogLevel.error, 'msg')).not.toThrow();
    expect(() => obj.callLog(SdkLogLevel.info, 'msg')).not.toThrow();
    expect(() => obj.callLog(SdkLogLevel.warn, 'msg')).not.toThrow();
    expect(() => obj.callLog(SdkLogLevel.log, 'msg')).not.toThrow();
  });

  it('should pass multiple arguments to logger', () => {
    const calls: unknown[][] = [];
    const logger: SdkLogger = {
      debug: function (...args: unknown[]) {
        calls.push(args);
      },
    };
    const obj = new TestLoggable({ logger });
    obj.callLog(SdkLogLevel.debug, 'a', 'b', 'c');
    expect(calls[0]).toEqual(['a', 'b', 'c']);
  });
});
