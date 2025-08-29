// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require("mongodb")


const url = "mongodb://root:root@mongo1:27017"
const client = new MongoClient(url)

/**
 * @swagger
 * /api/getAvailablePizzasAndToppings:
 *   get:
 *     summary: Ruft die verfügbaren Pizzen basierend auf den aktuellen Toppings ab
 *     description: >
 *       Diese Route prüft die in der `settings`-Collection gespeicherten
 *       `availablePizzas` gegen die Liste aller Toppings (`allToppings`) und gibt
 *       die aktuell bestellbaren Pizzas zurück.
 *     responses:
 *       200:
 *         description: Liste der verfügbaren Pizzen erfolgreich abgerufen
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
 *                   description: Liste der Namen der verfügbaren Pizzen
 *                   items:
 *                     type: string
 *                   example: ["Margherita", "Funghi", "Veggie Special"]
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
    let pizzas = result.availablePizzas.filter(pizza => {
      // Prüfe required-Toppings
      const requiredAvailable = pizza.toppingList.required.every(toppingName =>
        result.allToppings.some(
          topping => topping.name === toppingName && topping.available
        )
      );

      // Prüfe optional-Toppings (falls vorhanden)
      let optionalAvailable = true;
      if (
        pizza.toppingList.optional &&
        typeof pizza.toppingList.optional === "object" &&
        pizza.toppingList.optional.count
      ) {
        const availableOptionalCount = pizza.toppingList.optional.toppings.filter(toppingName =>
          result.allToppings.some(
            topping => topping.name === toppingName && topping.available
          )
        ).length;
        optionalAvailable = availableOptionalCount >= pizza.toppingList.optional.requiredCount;
      }

      return requiredAvailable && optionalAvailable;
    });
    let pizzaNames = pizzas.map(p => p.name);

    res.status(200).json({ success: true, message: pizzaNames });

} catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

