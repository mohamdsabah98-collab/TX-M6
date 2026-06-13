enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

const colors = {
  ERROR: '\x1b[31m',
  WARN: '\x1b[33m',
  INFO: '\x1b[36m',
  DEBUG: '\x1b[35m',
  RESET: '\x1b[0m',
};

const getLogLevel = (): LogLevel => {
  const level = process.env.LOG_LEVEL || 'info';
  return level.toUpperCase() as LogLevel;
};

const shouldLog = (level: LogLevel): boolean => {
  const levels = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
  const configuredLevel = levels[getLogLevel()];
  return levels[level] <= configuredLevel;
};

const formatLog = (level: LogLevel, message: string, data?: unknown): string => {
  const timestamp = new Date().toISOString();
  const color = colors[level as keyof typeof colors];
  const reset = colors.RESET;
  const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
  return `${color}[${timestamp}] ${level}${reset}: ${message}${dataStr}`;
};

export const logger = {
  error: (message: string, error?: unknown) => {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(formatLog(LogLevel.ERROR, message, error));
    }
  },
  warn: (message: string, data?: unknown) => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatLog(LogLevel.WARN, message, data));
    }
  },
  info: (message: string, data?: unknown) => {
    if (shouldLog(LogLevel.INFO)) {
      console.log(formatLog(LogLevel.INFO, message, data));
    }
  },
  debug: (message: string, data?: unknown) => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(formatLog(LogLevel.DEBUG, message, data));
    }
  },
};
