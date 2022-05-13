import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { Client } from 'pg'

import routes from './routes';
import firewallMiddleware from './utils/firewall';

const key = fs.readFileSync('../key.pem');
const cert = fs.readFileSync('../cert.pem');


const app = express();

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/assets', express.static('dist/assets'));

// Views middleware

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Custom Middleware

const client = new Client()
client.connect()

app.use((req, _, next) => {
  req.context = {
    client,
  };
  next();
});

app.use(firewallMiddleware);

// * Routes * //
app.use('/', routes.views);
app.use('/api/users', routes.user);
app.use('/api/posts', routes.posts);

// * Start * //

const server = https.createServer({key: key, cert: cert }, app);

server.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
