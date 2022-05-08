import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Client } from 'pg'

import routes from './routes';

const app = express();

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// Custom Middleware

const client = new Client()
client.connect()

app.use((req, res, next) => {
  req.context = {
    client,
  };
  next();
});

// * Routes * //

app.use('/users', routes.user);
app.use('/messages', routes.message);
app.use('/posts', routes.posts);

// * Start * //

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
