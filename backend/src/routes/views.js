import path from 'path';
import { Router } from 'express';

const router = Router();

const asset = (file) => path.join(__dirname, file);

router.get('/', (_, res) => {
  res.sendFile(asset('../../dist/index.html'));
});

router.get('/login',(_, res) => {
  res.sendFile(asset('../../dist/login/index.html'));
});

router.get('/posts',(_, res) => {
  res.sendFile(asset('../../dist/posts/index.html'));
});

export default router;
