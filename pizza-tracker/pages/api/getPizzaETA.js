// pages/api/getPizzaETA.js
const { MongoClient } = require("mongodb");

const url = "mongodb://root:root@mongo:27017";
const client = new MongoClient(url);


/**
 * @swagger
 * /api/getPizzaByDt0:
 *   get:
 *     summary: Gibt eine bestimmte Pizza anhand ihres dt0-Timestamps zurück
 *     description: Diese Route sucht in der MongoDB nach einer Pizza mit dem angegebenen `dt0`-Wert.
 *     parameters:
 *       - in: query
 *         name: dt0
 *         required: true
 *         schema:
 *           type: number
 *         description: Eindeutiger dt0-Timestamp der gesuchten Pizza.
 *         example: 1751455342912
 *     responses:
 *       200:
 *         description: Pizza erfolgreich gefunden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68651481487a3f2f606bd65f"
 *                     step:
 *                       type: number
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "salami"
 *                     toppings:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["garlic oil"]
 *                     name:
 *                       type: string
 *                       example: "Nils"
 *                     status:
 *                       type: string
 *                       example: "offen"
 *                     dt0:
 *                       type: number
 *                       example: 1751455342912
 *       400:
 *         description: Parameter dt0 fehlt
 *       404:
 *         description: Keine Pizza mit diesem dt0 gefunden
 *       405:
 *         description: Methode nicht erlaubt
 *       500:
 *         description: Interner Serverfehler
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { dt0 } = req.query;

  if (!dt0) {
    return res.status(400).json({ success: false, message: "Parameter 'dt0' fehlt" });
  }

  try {
    await client.connect();
    const db = client.db("pizza");
    const collection = db.collection("pizza"); // Passe an deine Collection an

    // dt0 in Zahl umwandeln, falls gespeichert als Number
    const searchValue = isNaN(dt0) ? dt0 : Number(dt0);

    const pizza = await collection.findOne({ dt0: searchValue });

    if (!pizza) {
      return res.status(404).json({ success: false, message: "Keine Pizza mit diesem dt0 gefunden" });
    }
    // ETA berechnen
    const openOrders = (await collection.find({ status: "open" }).toArray());
    const orders = openOrders.filter(o => o.dt0 < pizza.dt0).length; // Aktuelle Pizza nicht mitzählen
    const eta = await calculateEta(pizza, orders);

    res.status(200).json({ pizza, eta });

  } catch (error) {
    console.error("Fehler beim Abrufen der Pizza:", error);
    res.status(500).json({ success: false, message: "Interner Serverfehler" });
  } finally {
    await client.close();
  }
}

// Dummy-ETA Berechnung: 10min pro Status
async function calculateEta(pizza, orders) {
  const now = Date.now();
  if (pizza.status === "done" || pizza.status === "available") {
    return pizza.dt3; // Wenn die Pizza fertig ist, ist die ETA jetzt
  } else if (pizza.status === "cooking") {
    return pizza.dt2 + 6 * 60 * 1000; // 6 Minuten nach dem Backen
  } else if (pizza.status === "being prepared") {
    return pizza.dt1 + 9 * 60 * 1000; // 9 Minuten nach der Vorbereitung
  } else if (pizza.status === "open") {
    return pizza.dt0 + (140.5 * (orders - 1) + 97.73) * 1000 + 9 * 60 * 1000; // 140.5 Sekunden pro offener Bestellung, 97.73 Sekunden für die erste Bestellung, 9 Minuten Vorbereitungszeit
  }
  return now;
}
