import { Router } from 'express';
import { generateAccessToken, genereateCsrfToken, getDataFromToken } from '../utils/jwt-utils';

const router = Router();

router.get('/', async (req, res) => {
  const { client } = req.context;
  try {
    const users = await client.query(`SELECT * FROM "public"."users";`);
    res.send(users.rows);
  } catch (error) {
    return res.status(400).send(`Error occured: '${error.message}'`);
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { client } = req.context;

  try {
    const user = await client.query(`SELECT * FROM "public"."users" WHERE NAME = $1;`, [username]);
    if (user.rows.length === 0) {
      return res.status(401).send({ error: 'User not found' });
    }
    if (user.rows[0].password !== password) {
      return res.status(401).send({ error: 'Password is incorrect' });
    }
    const { role, id: userId } = user.rows[0];
    const accessToken = generateAccessToken(username, userId, role);

    res.cookie('token', accessToken, {
      maxAge: 900000, 
      httpOnly: true, 
      secure: true, 
      sameSite: true,
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(`Error occured: '${error.message}'`);
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
  const { client } = req.context;
  const { token } = req.cookies;

  if (!token) {
    return res.sendStatus(401);
  }

  const user = await getDataFromToken(token);

  if (!user) {
    return res.status(401).send('User was not extracted from token');
  }

  const { userId } = user;
  const csrfToken = genereateCsrfToken(userId);

  await client.query(
    `UPDATE "public"."users" SET "csrf_token" = $1 WHERE "id" = $2;`, [csrfToken, userId]
  );  

  return res.send({ csrfToken });
});

export default router;
