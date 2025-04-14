// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo:27017"
const client = new MongoClient(url)


export default async function handler(req, res) {

  try {
    await client.connect()
    const db = client.db('pizza')
    const collection = db.collection('pizza')
    const result = await collection.find().toArray()

    res.status(200).json({ success: true, message: result });

} catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

