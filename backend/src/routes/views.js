import path from 'path';
import { Router } from 'express';

const router = Router();

const asset = (file) => path.join(__dirname, file);

router.get('/', (req, res) => {
  res.sendFile(asset('../../dist/index.html'));
});

router.get('/login',(req, res) => {
  res.sendFile(asset('../../dist/login/index.html'));
})

export default router;
