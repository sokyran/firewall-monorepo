import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { Client } from 'pg'

import models from './models';
import routes from './routes';

const app = express();

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware

const client = new Client()
client.connect()

app.use((req, res, next) => {
  req.context = {
    models,
    client,
  };
  next();
});

// * Routes * //

app.use('/users', routes.user);
app.use('/messages', routes.message);

// * Start * //

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
