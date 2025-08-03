// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo:27017"
const client = new MongoClient(url)


/**
 * @swagger
 * /api/updatePizza:
 *   post:
 *     summary: Aktualisiert den Status und ein Zeitfeld (dt1–dt4) einer Pizza
 *     description: Diese Route aktualisiert den Status und eines der Zeitfelder (`dt1`, `dt2`, `dt3` oder `dt4`) eines vorhandenen Pizza-Dokuments in der MongoDB basierend auf `dt0`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dt0
 *               - status
 *             properties:
 *               dt0:
 *                 type: integer
 *                 format: int64
 *                 description: Zeitstempel zur Identifikation der Pizza (meist bei Erstellung vergeben)
 *                 example: 1751454849396
 *               status:
 *                 type: string
 *                 description: Neuer Status der Pizza
 *                 example: cooking
 *               dt2:
 *                 type: integer
 *                 format: int64
 *                 description: Zeitstempel für Schritt 2 (optional)
 *                 example: 1751455157256 
 *     responses:
 *       200:
 *         description: Pizza erfolgreich aktualisiert
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
    console.log(data.neuerStatus)

    // Hier wird die Verbindung zur Datenbank aufgebaut und das Objekt aktualisiert
    await client.connect()
    const db = client.db('pizza')
    const collection = db.collection('pizza')

    

    const filter = { dt0: data.dt0 };
    // update the value of the 'quantity' field to 5

    let updateDocument = {};

    if (data.dt1) {
      updateDocument = {
        $set: {
            status: data.status,
            dt1: data.dt1
        },
      };
    }

    if (data.dt2) {
      updateDocument = {
        $set: {
            status: data.status,
            dt2: data.dt2
        },
      };
    }

    if (data.dt3) {
      updateDocument = {
        $set: {
            status: data.status,
            dt3: data.dt3
        },
      };
    }

    if (data.dt4) {
      updateDocument = {
        $set: {
            status: data.status,
            dt4: data.dt4
        },
      };
    }
    
    const result = await collection.updateOne(filter, updateDocument);
    
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

