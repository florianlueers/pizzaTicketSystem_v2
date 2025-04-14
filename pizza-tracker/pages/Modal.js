import Modal from 'react-modal';
import styles from './Modal.module.css';

import { Stack, TextField, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MyModal({ modalOpen, setModalOpen }) {

  const [pizzaSettings, setPizzaSettings] = useState({availablePizzas: [], toppings: []});
  
  const fetchData = async () => {
      try {
          const response = await fetch("http://localhost:3000/api/getAvailablePizzasAndToppings");
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          const jsonData = await response.json();
          setPizzaSettings(jsonData.message);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };

  useEffect(() => {
      const intervalId = setInterval(() => {
          fetchData();
      }, 1000); // Fetch data every seconds

      return () => clearInterval(intervalId);
  }, []);


  // State für das Bestellformular
  const [order, setOrder] = useState({
    step: 0,
    type: undefined,
    toppings: ["tomato sauce"],
    name: "",
  });

  // Funktion zum Schließen des Modals und Zurücksetzen der Bestellung
  const closeModal = () => {
    setModalOpen(false);
    setOrder({ step: 0, type: undefined, toppings: [], name: "" });
  };

  // Funktion zur Änderung des Bestell-Schritts
  const setStep = (step) => {
    setOrder((prevOrder) => ({ ...prevOrder, step }));
    if (step === 0) {
      setOrder((prevOrder) => ({ ...prevOrder, toppings: [] }));
    }
  };

  // Funktion zur Auswahl des Pizzatyps
  const setPizzaType = (type) => {
    setOrder((prevOrder) => ({ ...prevOrder, type }));
    setStep(1);
  };

  // Funktion zum Ändern der Toppings
  const changeIngredients = (input, label) => {
    setOrder((prevOrder) => {
      const updatedToppings = input
        ? [...prevOrder.toppings, label]
        : prevOrder.toppings.filter((topping) => topping !== label);
      return { ...prevOrder, toppings: updatedToppings };
    });
  };

  // Funktion zum Senden der Bestellung
  const sendOrder = async () => {
    const updatedOrder = {
      ...order,
      name: order.name.trim() === "" ? "Anonymous" : order.name,
      status: "offen",
      dt0: Date.now(),
    };
    try {
      const response = await fetch("http://localhost:3000/api/postPizza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      alert("Thank you, your order was placed.");
    } catch (error) {
      console.error("Fehler beim Senden der Daten", error);
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      contentLabel="Ordering Modal"
      style={{
        content: {
          top: "50%",
          left: '50%',
          width: "400px",
          height: "600px",
          transform: 'translate(-50%, -50%)',
        }
      }}
    >
      {order.step === 0 && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>Please select your pizza</h2>
          {pizzaSettings["availablePizzas"].map((pizza, index) => (
            <div className={styles.ImageContainer} onClick={() => setPizzaType(pizza.name)} key={index}>
              <div className={styles.ImageOuter}>
                <Image height={150} width={150} className={styles.ImageContainerImage} src={pizza["image"]} alt={`Pizza ${pizza.name}`} />
              </div>
              <div className={styles.ImageText} key={index}>
                Pizza<br />{pizza.name}
                <div className={styles.toppingsList}>{pizza.toppingList.join(", ")}</div>
              </div>
            </div>
          ))}
          <div className={styles.bottomArea}>
            <Button className={styles.OrderButton} variant="contained" onClick={() => setPizzaType("custom")}>CUSTOM ORDER</Button>
          </div>
        </div>
      )}

      {order.step === 1 && order.type === "custom" && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>Choose your Toppings:</h2>
          <Stack spacing={2}>
            <FormGroup>
              {pizzaSettings["allToppings"].map((topping) => (
                <FormControlLabel
                  key={topping}
                  control={<Checkbox />}
                  label={topping["name"]}
                  checked={order.toppings.includes(topping["name"])}
                  disabled={topping["disabled"]}
                  onChange={(event) => changeIngredients(event.target.checked, topping["name"])}
                />
              ))}
            </FormGroup>
          </Stack>
          <div className={styles.bottomArea}>
            <Button onClick={() => setStep(0)}>Back</Button>
            <TextField className={styles.textField} label="Your Name" value={order.name} onChange={(event) => setOrder((prevOrder) => ({ ...prevOrder, name: event.target.value }))} />
            <Button onClick={() => sendOrder()} variant="contained">Finish</Button>
          </div>
        </div>
      )}

      {order.step === 1 && order.type !== "custom" && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>Any additional toppings?</h2>
          <Stack spacing={2}>
            <FormGroup>
              { pizzaSettings["availablePizzas"].map((pizza, index) => (
                pizza.name === order.type && (
                  pizza.toppings.map((topping, index) => (
                    <p>{topping.name}</p>
                  ))
                )
              ))}
            </FormGroup>
          </Stack>
          <div className={styles.bottomArea}>
            <Button onClick={() => setStep(0)}>Back</Button>
            <TextField label="Your Name" value={order.name} onChange={(event) => setOrder((prevOrder) => ({ ...prevOrder, name: event.target.value }))} />
            <Button onClick={() => sendOrder()} variant="contained">Place order</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}