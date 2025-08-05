import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function PizzaPage() {
  const router = useRouter()
  const { id } = router.query

  const [pizzaData, setPizzaData] = useState({})
  const [eta, setEta] = useState(null)
  let pizzaStatus = { 
    "open": "has been received",
    "being prepared": "is being prepared",
    "cooking": "is in the oven",
    "available": "is ready for pick-up",
    "done": "has been completed"
  }


  // useEffect(() => {
  //   if (!id) return
  //   fetch(`http://srv18.ikap.biba.uni-bremen.de:3000/api/getPizzaByDt0?dt0=${id}`)
  //     .then(res => res.json())
  //     .then(data => setPizzaData(data.message))
  //     .catch(err => console.error(err))
  // }, [id])

  useEffect(() => {
    if (!id) return;

    // Funktion zum Holen der Daten
    const fetchPizza = () => {
      fetch(`http://srv18.ikap.biba.uni-bremen.de:3000/api/getPizzaETA?dt0=${id}`)
        .then(res => res.json())
        .then(data => {
          setPizzaData(data.pizza);
          setEta(data.eta);
        })
        .catch(err => console.error(err));
    };

    // Direkt beim ersten Rendern holen
    fetchPizza();

    // Dann alle 5 Sekunden wiederholen
    const intervalId = setInterval(fetchPizza, 5000);

    // Aufräumen, wenn Komponente entladen oder id geändert wird
    return () => clearInterval(intervalId);

  }, [id]);
  

  return (
    (!pizzaData._id) ? (
      <p>Loading...</p>
    ) : (
      <>
        <h1>Ciao {pizzaData.name}! <br/>🍕🧑‍🍳😙🤌</h1>
        {/** Hier kommt irgendwann Edit hin */}
        <p>Your {pizzaData.type} pizza order {pizzaStatus[pizzaData.status]}.</p>
        <hr/>
        {pizzaData.dt0 ? (<p>Order Received at {new Date(pizzaData.dt0).toLocaleTimeString("de-DE")}</p>) : null}
        {pizzaData.dt1 ? (<p>In Preparation at {new Date(pizzaData.dt1).toLocaleTimeString("de-DE")}</p>) : null}
        {pizzaData.dt2 ? (<p>In the Oven at {new Date(pizzaData.dt2).toLocaleTimeString("de-DE")}</p>) : null}
        {pizzaData.dt3 ? (<p>Ready for Pick-Up at {new Date(pizzaData.dt3).toLocaleTimeString("de-DE")}</p>) : null}
        {pizzaData.dt4 ? (<p>Order Completed at {new Date(pizzaData.dt4).toLocaleTimeString("de-DE")}</p>) : null}
        {eta ? (<p>Estimated completion: {new Date(eta).toLocaleTimeString("de-DE")}</p>) : null}

      </>
    )
  )
}