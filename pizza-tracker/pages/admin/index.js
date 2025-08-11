import { useEffect, useState } from "react";
import PizzaComponent from "./Component";
import ToppingComponent from "./ToppingComponent";

export default function Home() {
  const [data, setData] = useState([]);
  const [availableToppings, setAvailableToppings] = useState([]);

  // Fetch Pizza-Daten alle 1 Sekunde
  useEffect(() => {
    const fetchPizzaData = async () => {
      try {
        const response = await fetch("https://pizzademo.ikap.biba.uni-bremen.de/api/getPizza");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        const dataArray = jsonData.message.filter(pizza => pizza.status !== "done");

        setData(dataArray);
      } catch (error) {
        console.error("Error fetching pizza data:", error);
      }
    };

    const intervalId = setInterval(fetchPizzaData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch Toppings einmalig
  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await fetch("https://pizzademo.ikap.biba.uni-bremen.de/api/getAvailablePizzasAndToppings");
        if (!response.ok) {
          throw new Error("Toppings fetch failed");
        }

        const json = await response.json();
        setAvailableToppings(json.message.allToppings || []);
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    fetchToppings();
  }, []);

  return (
    <>
      <h1>ADMIN PAGE</h1>

      {availableToppings.map((topping, index) => (
        <ToppingComponent key={index} data={topping} />
      ))}
      <hr/> 

      {data.map((item, index) => (
        <PizzaComponent key={index} pizza={item} />
      ))}
    </>
  );
}
