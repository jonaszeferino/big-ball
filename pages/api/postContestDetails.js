import client from '../../mongoConnection';

export default async function handler(req, res) {
  console.log('Call PostTip API!');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { contestDetailsId, contestId, contestDetailName, competitors } = req.body;
  const collection = client.db('big-ball').collection('contest-details');

  try {
    const document = {
      contestDetailsId,
      contestId,
      contestDetailName,
      competitors,
    };

    const result = await collection.insertOne(document);

    if (result.acknowledged) {
      res.status(200).json({ message: 'Insert successful', result });
    } else {
      res.status(500).json({ message: 'Insert failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
