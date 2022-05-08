import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const { client } = req.context;

  const posts = await client.query('SELECT * FROM "public"."blog"');
  return res.send(posts.rows);
});

router.post('/', async (req, res) => {
  const { client } = req.context;
  const { text, userId } = req.body;

  if (!text || !userId) {
    return res.status(500).send({ error: 'Text and userId are required' });
  }

  const message = {
    text,
    userId
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
