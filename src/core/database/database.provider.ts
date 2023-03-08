import * as Mongoose from 'mongoose';
import * as DotEnv from 'dotenv';

DotEnv.config();

export const databaseProviders = [
  {
    provide: 'DB_CONN',
    useFactory: (): Promise<typeof Mongoose> => {
      Mongoose.set('strictQuery', true);
      return Mongoose.connect(process.env.DB_URI);
    },
  },
];
