import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import usersRouter from './features/users/usersRouter';
import errorHandler from './helpers/errorHandler';
import cors from 'cors';



//---------- Сервер ----------
export const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/users', usersRouter);
app.use(errorHandler);

