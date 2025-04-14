import { useEffect, useState } from "react";
import PizzaComponent from "./Component";


export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getPizza");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        let dataArray = []

        for (let i = 0; i < jsonData.message.length; i++) {
          if (jsonData.message[i].status != "done") {
            dataArray.push(jsonData.message[i])
          }
        }

        console.log(dataArray)

        setData(dataArray);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData(); // Rufe fetchData alle 5 Sekunden auf
    }, 1000); // 5 Sekunden in Millisekunden umgerechnet

    // Aufräumen: Stoppe das Intervall, wenn das Komponenten-Unmounted wird
    return () => clearInterval(intervalId);
  }, []); // Leeres Dependency Array, um den Effekt nur einmal bei der Montage auszuführen


  return (
    <>
      <h1>ADMIN PAGE</h1>

      {Array.isArray(data) && data.map((item, index) => (
        <PizzaComponent key={index} pizza={item} />
      ))}
    </>
  );
}
