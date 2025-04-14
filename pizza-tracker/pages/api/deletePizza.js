// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo:27017"
const client = new MongoClient(url)


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Hier wird das JSON-Objekt aus dem Request geholt
    const data = req.body;

    // Hier kannst du mit dem JSON-Objekt arbeiten, z.B. speichern oder weiterverarbeiten
    console.log('Empfangene Daten:', data);

    // Hier wird die Verbindung zur Datenbank aufgebaut und das Objekt aktualisiert
    await client.connect()
    const db = client.db('pizza')
    const collection = db.collection('pizza')

    console.log(data.status)

    const filter = { name: data.name, toppings: data.toppings };
    const result = await collection.deleteOne(filter);
    
    console.log(result)
    

    // Hier kannst du eine Antwort senden
    res.status(200).json({ success: true, message: 'Daten erfolgreich empfangen' });
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  } finally {
    await client.close()
  }
}

