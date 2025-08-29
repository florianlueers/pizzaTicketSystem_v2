// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo1:27017"
const client = new MongoClient(url)

/**
 * @swagger
 * /api/getAvailablePizzasAndToppings:
 *   get:
 *     summary: Ruft die verfügbaren Toppings ab
 *     description: >
 *       Diese Route liest die `settings`-Collection aus der MongoDB
 *       und gibt alle aktuell verfügbaren Toppings zurück.
 *     responses:
 *       200:
 *         description: Liste der verfügbaren Toppings erfolgreich abgerufen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: array
 *                   description: Liste der verfügbaren Topping-Namen
 *                   items:
 *                     type: string
 *                   example: ["Tomate", "Oliven", "Champignons"]
 *       500:
 *         description: Interner Serverfehler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Interner Serverfehler"
 */

export default async function handler(req, res) {

try {
    await client.connect()
    const db = client.db('pizza')
    const collection = db.collection('settings')
    const result = await collection.findOne()
    let toppings = result.allToppings.filter(t => t.available).map(t => t.name)

    res.status(200).json({ success: true, message: toppings });

} catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

