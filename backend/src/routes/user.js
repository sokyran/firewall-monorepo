import { Router } from 'express';
import { generateAccessToken, genereateCsrfToken, getDataFromToken } from '../utils/jwt-utils';

const router = Router();


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { client } = req.context;

  try {
    const user = await client.query(`SELECT * FROM "public"."users" WHERE NAME = '${username}'`);
    if (user.rows.length === 0) {
      return res.status(401).send({ error: 'User not found' });
    }
    if (user.rows[0].password !== password) {
      return res.status(401).send({ error: 'Password is incorrect' });
    }
    const { role, id: userId } = user.rows[0];
    const accessToken = generateAccessToken(username, userId, role);

    return res.send({ accessToken });
  } catch (error) {
    return res.status(400).send(`Error occured: '${error.message}'`)
  }
});

router.post('/check-token', async (req,res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.sendStatus(401);
  }

  const user = await getDataFromToken(token);

  if (!user) {
    return res.status(401).send('User was not extracted from token');
  }
  
  return res.send(user);
});

router.post('/csrf-token', async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.sendStatus(401);
  }

  const user = await getDataFromToken(token);

  if (!user) {
    return res.status(401).send('User was not extracted from token');
  }

  const { id: userId } = user;
  const csrfToken = genereateCsrfToken(userId);

  return res.send({ csrfToken });
});

router.post('/signup', async (req, res) => {
  const { client } = req.context;
  const { name, password, role } = req.body;
  try {
    const user = await client.query(`SELECT * FROM "public"."users" where "name" = '${name}';`);
    if (user.rows.length > 0) {
      return res.status(400).send({ error: 'User already exists' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }

  const newUser = {
    name,
    password,
    role: 'user',
  };
  try {
    const text = `INSERT INTO "public"."users" ("name", "password", "role") VALUES 
        ('${name}', '${password}', '${role}');`
    await client.query(text);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
  return res.send(newUser);
});

export default router;
