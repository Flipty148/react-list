import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import usersRouter from './features/users/usersRouter';
import errorHandler from './helpers/errorHandler';


//---------- Сервер ----------
export const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/users', usersRouter);
app.use(errorHandler);