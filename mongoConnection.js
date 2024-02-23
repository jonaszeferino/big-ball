import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://jonaszeferino:${process.env.DB_PASSWORD}@cluster0.mues8vo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  connectTimeoutMS: 30000, 
  socketTimeoutMS: 45000, 
});

client.connect();

export default client;
