export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

type LogMessage = {
  level: LogLevel;
  message: string;
  error?: Error;
  timestamp: string;
};

export class Logger {
  static log(level: LogLevel, message: string, error?: Error): void {
    const logMessage: LogMessage = {
      level,
      message,
      error,
      timestamp: new Date().toISOString()
    };
    
    switch (logMessage.level) {
      case LogLevel.INFO:
        console.log(`[${logMessage.timestamp}] INFO: ${logMessage.message}`);
        break;
      case LogLevel.WARN:
        console.warn(`[${logMessage.timestamp}] WARN: ${logMessage.message}`);
        break;
      case LogLevel.ERROR:
        console.error(`[${logMessage.timestamp}] ERROR: ${logMessage.message}`);
        if (logMessage.error) {
          console.error(logMessage.error);
        }
        break;
      case LogLevel.DEBUG:
        if (process.env.DEBUG !== undefined) {
          console.debug(`[${logMessage.timestamp}] DEBUG: ${logMessage.message}`);
        }
        break;
    }
  }
} 
