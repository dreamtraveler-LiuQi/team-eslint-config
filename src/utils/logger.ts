export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

export class Logger {
  static log(level: LogLevel, message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    
    switch (level) {
      case LogLevel.INFO:
        console.log(`[${timestamp}] INFO: ${message}`);
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}] WARN: ${message}`);
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}] ERROR: ${message}`);
        if (error) {
          console.error(error);
        }
        break;
      case LogLevel.DEBUG:
        if (process.env.DEBUG !== undefined) {
          console.debug(`[${timestamp}] DEBUG: ${message}`);
        }
        break;
    }
  }
} 
