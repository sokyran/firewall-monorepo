import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.users));
});

router.get('/:userId', (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const user = req.context.models.users[email];
  if (user) {
    return res.status(400).send('User already exists');
  }
  const newUser = {
    id: email,
    email,
    password,
    role: 'user',
  };
  req.context.models.users[email] = newUser;
  return res.send(newUser);
});

export default router;
