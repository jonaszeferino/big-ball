import client from '../../mongoConnection';

export default async function handler(req, res) {
  console.log('Call PostTip API!');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { contestId } = req.body;
  const contestDetailsCollection = client.db('big-ball').collection('contest-details');

  try {
    const document = {
      contestId,
    };

    await contestDetailsCollection.insertOne(document);

    const contestCollection = client.db('big-ball').collection('contest');

    const result = await contestCollection.aggregate([
      {
        $match: { contestId }
      },
      {
        $lookup: {
          from: 'contest-details',
          localField: 'contestId',
          foreignField: 'contestId',
          as: 'contestDetails'
        }
      },
      {
        $unwind: '$contestDetails'
      },
      {
        $match: {
          'contestDetails.contestDetailsId': { $exists: true },
          'contestDetails.contestDetailName': { $exists: true },
          'contestDetails.competitors': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$contestId',
          contestName: { $first: '$contestName' },
          contestType: { $first: '$contestType' },
          contestYear: { $first: '$contestYear' },
          contestDetails: { $push: '$contestDetails' }
        }
      }
    ]).toArray();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
