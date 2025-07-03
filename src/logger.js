export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

export class Logger {
  constructor(context = 'ReelScore') {
    this.context = context;
    this.enabled = true;
    this.errorCount = 0;
  }

  log(level, message, data = {}) {
    if (!this.enabled) return;

    const logData = {
      context: this.context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...data
    };

    const prefix = `[${this.context}]`;
    switch (level) {
      case LogLevel.ERROR:
        console.error(`${prefix} ${message}`, logData);
        this.errorCount++;
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${message}`, logData);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${message}`, logData);
        break;
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${message}`, logData);
        break;
    }
  }

  error(message, data = {}) {
    this.log(LogLevel.ERROR, message, data);
  }

  warn(message, data = {}) {
    this.log(LogLevel.WARN, message, data);
  }

  info(message, data = {}) {
    this.log(LogLevel.INFO, message, data);
  }

  debug(message, data = {}) {
    this.log(LogLevel.DEBUG, message, data);
  }

  getErrorCount() {
    return this.errorCount;
  }
}

export const logger = new Logger();

export function setupGlobalErrorHandling() {
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason?.message || event.reason,
      stack: event.reason?.stack
    });
  });
} 