// pages/api/setToppingUnavailable.js

const { MongoClient } = require("mongodb");

const url = "mongodb://root:root@mongo:27017";
const client = new MongoClient(url);

/**
 * @swagger
 * /api/setToppingUnavailable:
 *   post:
 *     summary: Deaktiviert ein Topping
 *     description: Setzt das Feld `available` für ein bestimmtes Topping in den `settings` der MongoDB auf `false`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Der Name des Toppings, das deaktiviert werden soll
 *                 example: "garlic oil"
 *     responses:
 *       200:
 *         description: Topping erfolgreich deaktiviert
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
 *                   example: Topping wurde deaktiviert
 *       400:
 *         description: Topping-Name fehlt
 *       404:
 *         description: Topping nicht gefunden oder bereits deaktiviert
 *       405:
 *         description: Methode nicht erlaubt
 *       500:
 *         description: Interner Serverfehler
 */
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Topping-Name fehlt" });
    }

    try {
        await client.connect();
        const db = client.db("pizza");
        const collection = db.collection("settings");

        const filter = {}; // Nur ein Dokument vorhanden – leerer Filter reicht
        const update = {
            $set: {
                "allToppings.$[elem].available": false,
            },
        };
        const options = {
            arrayFilters: [{ "elem.name": name }],
        };

        const result = await collection.updateOne(filter, update, options);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Topping nicht gefunden oder bereits deaktiviert" });
        }

        res.status(200).json({ success: true, message: "Topping wurde deaktiviert" });
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Toppings:", error);
        res.status(500).json({ success: false, message: "Interner Serverfehler" });
    } finally {
        await client.close();
    }
}
