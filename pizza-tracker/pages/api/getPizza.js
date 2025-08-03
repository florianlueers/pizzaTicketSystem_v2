// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo:27017"
const client = new MongoClient(url)




/**
 * @swagger
 * /api/getPizza:
 *   get:
 *     summary: Gibt alle Pizzen aus der Datenbank zurück
 *     responses:
 *       200:
 *         description: Erfolgreich
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68651476487a3f2f606bd65e
 *                       step:
 *                         type: integer
 *                         example: 1
 *                       type:
 *                         type: string
 *                         example: Margherita
 *                       toppings:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["garlic oil"]
 *                       name:
 *                         type: string
 *                         example: Ole
 *                       status:
 *                         type: string
 *                         example: cooking
 *                       dt0:
 *                         type: integer
 *                         format: int64
 *                         example: 1751454838012
 *                       dt1:
 *                         type: integer
 *                         format: int64
 *                         example: 1751454942150
 *                       dt2:
 *                         type: integer
 *                         format: int64
 *                         example: 1751454943596
 *                       dt3:
 *                         type: integer
 *                         format: int64
 *                       dt4:
 *                         type: integer
 *                         format: int64
 *       500:
 *         description: Interner Serverfehler
 */


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

