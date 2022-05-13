import { Router } from 'express';
import { getDataFromToken } from '../utils/jwt-utils';

const router = Router();

router.get('/', async (req, res) => {
  const { client } = req.context;
  const queryText = `
    SELECT "text", "name" from "public"."blog"
      INNER JOIN "public"."users"
      ON "public"."users"."id" = "public"."blog"."userId"
      ORDER BY "public"."blog"."id" ASC;`

  const posts = await client.query(queryText);
  return res.send(posts.rows);
});

router.post('/', async (req, res) => {
  const csrfToken = req.headers['x-csrf-token'];
  const { client } = req.context;
  const { cookies: { token } } = req;
  const { text } = req.body;

  const user = await getDataFromToken(token);
  const userFromToken = await getDataFromToken(csrfToken);

  if (!userFromToken || user.id !== userFromToken.id) {
    return res.status(401).send('Data from token is not valid');
  }

  if (!user) {
    return res.sendStatus(403);
  }

  if (!text) {
    return res.status(500).send({ error: 'Text is required' });
  }

  const { userId, username } = user;

  const message = {
    text,
    userId,
    username,
  };

  const queryText = `INSERT INTO "public"."blog" ("text", "userId") VALUES 
        ('${text}', '${userId}');`
  try {
    await client.query(queryText);
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }

  return res.send(message);
});

router.post('/search', async (req, res) => {
  const { client } = req.context;
  const { query } = req.query;

  const foundPosts = await client.query(`SELECT * FROM "public"."blog" where "text" ILIKE '%${query}%'`);
  return res.send(foundPosts.rows);
});

export default router;
