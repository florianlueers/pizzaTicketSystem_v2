import { useState, useEffect } from "react";
import styles from "./Tracker.module.css";
import Link from "next/link";
import Image from "next/image";


// Das Pizza "Icon", besteht aus dem Icon an sich (div PizzaIcon) und den Infos (Name und Type)
function Pizza({ item }) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className={styles.Pizza}>
            { /**<Link href={"variant2/" + item.dt0}> */}
                <Image
                    width="30"
                    height="30"
                    className={styles.PizzaIcon}
                    src={"/pizzaIcon.png"}
                    alt='PizzaIcon' />
            { /**</Link>*/}
            <div className={styles.PizzaInfo}>{item.name}: {capitalizeFirstLetter(item.type)}</div>
        </div>
    )
}


// Der PizzaTracker zeigt den Fortschritt einer Pizza
function PizzaTracker({ item }) {

    if (item.status !== "done") {
        // var audio = new Audio('bell.wav');
        // if (item.status === "available") {audio.play();}

        return (
            <div className={styles.PizzaTracker}>
                <div className={styles.OrderReceivedArea}>
                    {item.status == "open" && (
                        <Pizza item={item} />
                    )}
                </div>
                <div className={styles.InPreparationArea}>
                    {item.status == "being prepared" && (
                        <Pizza item={item} />
                    )}
                </div>
                <div className={styles.InTheOvenArea}>
                    {item.status == "cooking" && (
                        <Pizza item={item} />
                    )}
                </div>
                <div className={styles.ReadyForPickUpArea}>
                    {item.status == "available" && (
                        <Pizza item={item} />
                    )}
                </div>
            </div>
        )
    } else {
        return null;
    }
    
}


// Der Tracker stellt für alle Pizzen einen PizzaTracker dar.
export default function Tracker() {

    // Get all pizzas in DB
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/getPizza");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const jsonData = await response.json();
            setData(jsonData.message);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 1000); // Fetch data every second

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className={styles.TrackerTitle}>
                <h3> Order Received</h3>
                <h3> In Preparation</h3>
                <h3> In the Oven</h3>
                <h3> Ready for Pick-Up</h3>
            </div>
            {data.map((item, index) => (
                <PizzaTracker key={index} item={item} />
            ))}
        </>
    )
};
