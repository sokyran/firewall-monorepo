import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const { client } = req.context;
  const cities = await client.query('SELECT * FROM CITY')
  return res.send(cities.rows)
});

router.get('/:cityName', async (req, res) => {
  const { client } = req.context;
  console.log(req.params.cityName)
  try {
    // Kyiv' or 'a' = 'a
    const cities = await client.query(`SELECT * FROM CITY WHERE NAME = '${req.params.cityName}'`)
    return res.send(cities.rows)
  } catch (error) {
    return res.status(400).send(`Error occured: '${error.message}'`)
  }
});

router.post('/', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id,
  };

  return res.send(message);
});

export default router;
