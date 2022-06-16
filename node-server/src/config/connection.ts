import * as mongoose from 'mongoose';
import { default as config } from '../env/index';

/** @public */
declare const LoggerLevel: Readonly<{
  readonly ERROR: 'error';
  readonly WARN: 'warn';
  readonly INFO: 'info';
  readonly DEBUG: 'debug';
  readonly error: 'error';
  readonly warn: 'warn';
  readonly info: 'info';
  readonly debug: 'debug';
}>;

/** @public */
declare type LoggerLevel = typeof LoggerLevel[keyof typeof LoggerLevel];

/**
 * @interface IConnectOptions
 */
interface IConnectOptions {
  autoReconnect: boolean;
  reconnectTries: number; // Never stop trying to reconnect
  reconnectInterval: number;
  loggerLevel?: LoggerLevel;
  useNewUrlParser: true;
  useUnifiedTopology: true;
}
const connectOptions: IConnectOptions = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const MONGO_URI: string = `${config.envConfig.database.MONGODB_URI}${config.envConfig.database.MONGODB_DB_MAIN}`;

export const db: mongoose.Connection = mongoose.createConnection(MONGO_URI, connectOptions);

// handlers
db.on('connecting', () => {
  console.log('\x1b[32m', 'MongoDB :: connecting');
});

db.on('error', (error) => {
  console.log('\x1b[31m', `MongoDB :: connection ${error}`);
  mongoose.disconnect();
});

db.on('connected', () => {
  console.log('\x1b[32m', 'MongoDB :: connected');
});

db.once('open', () => {
  console.log('\x1b[32m', 'MongoDB :: connection opened');
});

db.on('reconnected', () => {
  console.log('\x1b[33m"', 'MongoDB :: reconnected');
});

db.on('reconnectFailed', () => {
  console.log('\x1b[31m', 'MongoDB :: reconnectFailed');
});

db.on('disconnected', () => {
  console.log('\x1b[31m', 'MongoDB :: disconnected');
});

db.on('fullsetup', () => {
  console.log('\x1b[33m"', 'MongoDB :: reconnecting... %d');
});
