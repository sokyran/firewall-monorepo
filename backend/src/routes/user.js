import jwt from 'jsonwebtoken';
import { Router } from 'express';

const router = Router();

const SECRET = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611';

function generateAccessToken(username, password) {
  return jwt.sign({username, password}, SECRET, { expiresIn: '1800s' });
}

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
    const accessToken = generateAccessToken(username, password);
    return res.send({ accessToken });
  } catch (error) {
    return res.status(400).send(`Error occured: '${error.message}'`)
  }

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
