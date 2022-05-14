import express, { Router } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import https from 'https';

const key = fs.readFileSync('../key.pem');
const cert = fs.readFileSync('../cert.pem');

const app = express();

const router = Router();

app.use(cors());

router.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './hacker.html'));
});

app.use('/', router);

const server = https.createServer({key: key, cert: cert }, app);

server.listen(8081, () =>
  console.log(`Example app listening on port 8081!`),
);
