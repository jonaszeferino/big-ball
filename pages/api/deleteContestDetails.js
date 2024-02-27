import client from '../../mongoConnection';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    const { contestDetailsIds } = req.body; // Mudança para contestDetailsIds
    const contestDetailsCollection = client.db('big-ball').collection('contest-details');
    try {
        // Verifica se existem documentos para os IDs fornecidos
        const existingDocuments = await contestDetailsCollection.find({ contestDetailsId: { $in: contestDetailsIds } }).toArray();
        if (existingDocuments.length === 0) {
            res.status(404).json({ error: 'No contest details found for the provided contestDetailIds' });
            return;
        }
        // Deleta todos os documentos correspondentes aos IDs fornecidos
        await contestDetailsCollection.deleteMany({ contestDetailsId: { $in: contestDetailsIds } });

        res.status(200).json({ message: 'Contest details deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
