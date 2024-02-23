import client from '../../mongoConnection';

export default async function handler(req, res) {
  console.log('Chamou!');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const collection = client.db('big-ball').collection('contest');
  try {
    const result = await collection.find().toArray();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
