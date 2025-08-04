// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo:27017"
const client = new MongoClient(url)

/**
 * @swagger
 * /api/getAvailablePizzasAndToppings:
 *   get:
 *     summary: Ruft die aktuellen Pizzaback-Settings ab
 *     description: Diese Route gibt die aktuellen Einstellungen aus der `settings`-Collection der MongoDB zurück.
 *     responses:
 *       200:
 *         description: Einstellungen erfolgreich abgerufen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Interner Serverfehler
 */
export default async function handler(req, res) {

  try {
    await client.connect()
    const db = client.db('pizza')
    const collection = db.collection('settings')
    const result = await collection.findOne()

    res.status(200).json({ success: true, message: result });

} catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

