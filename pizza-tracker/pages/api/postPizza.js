// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo:27017"
const client = new MongoClient(url)


/**
 * @swagger
 * /api/postPizza:
 *   post:
 *     summary: Fügt eine neue Pizza zur Datenbank hinzu
 *     description: Diese Route speichert eine neue Pizza mit Namen, Typ, Status, Schritt und optionalen Belägen in der MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - status
 *               - step
 *               - dt0
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nils
 *               type:
 *                 type: string
 *                 example: salami
 *               status:
 *                 type: string
 *                 example: offen
 *               step:
 *                 type: integer
 *                 example: 1
 *               toppings:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               dt0:
 *                 type: integer
 *                 format: int64
 *                 description: Zeitstempel der Erstellung
 *                 example: 1751455342912
 *     responses:
 *       200:
 *         description: Pizza erfolgreich gespeichert
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Daten erfolgreich empfangen
 *       405:
 *         description: Methode nicht erlaubt
 *       500:
 *         description: Interner Serverfehler
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Hier wird das JSON-Objekt aus dem Request geholt
    const data = req.body;
    
    // Hier kannst du mit dem JSON-Objekt arbeiten, z.B. speichern oder weiterverarbeiten
    console.log('Empfangene Daten:', data);

    // Hier wird die Verbindung zur Datenbank aufgebaut und das Objekt eingefügt
    await client.connect()
    const db = client.db('pizza')
    const collection = db.collection('pizza')
    await collection.insertOne(data)

    // Hier kannst du eine Antwort senden
    res.status(200).json({ success: true, message: 'Daten erfolgreich empfangen' });
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

