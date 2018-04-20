const { join } = require('path');

const config = require('config');
const winston = require('winston');
require('winston-daily-rotate-file');
const morgan = require('morgan');
const moment = require('moment');
const FileStreamRotator = require('file-stream-rotator');

const dateFormat = 'YYYY-MM-DD';

const setupLogger = app => {
  morgan.token('date', () => moment().format(config.server.timeFormat || 'YYYY-MM-DD HH:mm:ss'));

  if (process.env.NODE_ENV === 'development') {
    if (app) {
      app.use(morgan('dev'));
    }

    global.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.json(),
        winston.format.simple()
      ),
      transports: [new winston.transports.Console()],
    });
  } else {
    if (app) {
      app.use(
        morgan(config.server.logFormat, {
          skip: req => req.method.toUpperCase() === 'HEAD', // 忽略 HEAD 请求的 access-log
          stream: FileStreamRotator.getStream({
            date_format: dateFormat,
            filename: join(config.logPath, 'access', 'application.log.%DATE%'),
            frequency: 'daily',
            verbose: false,
          }),
        })
      );
    }

    const rotateTransport = new winston.transports.DailyRotateFile({
      filename: join(config.logPath, 'application.log.%DATE%'),
      datePattern: dateFormat,
    });

    global.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.json()),
      transports: [rotateTransport],
    });
  }

  return global.logger;
};

module.exports = setupLogger;
