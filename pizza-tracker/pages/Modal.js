import Modal from 'react-modal';
import styles from './Modal.module.css';

import { Stack, TextField, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import React, { useState } from 'react';
import Image from 'next/image';

export default function MyModal({ modalOpen, setModalOpen }) {
  // State für das Bestellformular
  const [order, setOrder] = useState({
    step: 0,
    type: undefined,
    toppings: [],
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

  // Pizza-Daten für die Auswahl
  const pizzas = [
    { type: "Margherita", image: "/margherita-pizza.png", toppings: ["tomato sauce", "mozzarella", "basil"] },
    { type: "salami", image: "/salami-pizza.png", toppings: ["tomato sauce", "mozzarella", "salami milano"] },
    { type: "anti-pasti", image: "/antipasti-pizza.png", toppings: ["tomato sauce", "mozzarella", "onions", "artichokes", "sun-dried tomatoes", "mushrooms"] },
  ];

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
          {pizzas.map((pizza) => (
            <div className={styles.ImageContainer} onClick={() => setPizzaType(pizza.type)} key={pizza.type}>
              <div className={styles.ImageOuter}>
                <Image height={150} width={150} className={styles.ImageContainerImage} src={pizza.image} alt={`Pizza ${pizza.type}`} />
              </div>
              <div className={styles.ImageText}>
                Pizza<br />{pizza.type}
                <div className={styles.toppingsList}>{pizza.toppings.join(", ")}</div>
              </div>
            </div>
          ))}
          <div className={styles.bottomArea}>
            <Button className={styles.CustomOrderButton} variant="contained" onClick={() => setPizzaType("custom")}>CUSTOM ORDER</Button>
          </div>
        </div>
      )}

      {order.step === 1 && order.type === "custom" && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>Choose your Toppings:</h2>
          <Stack spacing={2}>
            <FormGroup>
              {["tomato sauce", "mozzarella", "salami milano", "salami finocchino", "chili oil", "garlic oil", "onions", "artichokes", "sun-dried tomatoes", "mushrooms", "basil"].map((topping) => (
                <FormControlLabel
                  key={topping}
                  control={<Checkbox />}
                  label={topping}
                  onChange={(event) => changeIngredients(event.target.checked, topping)}
                />
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

      {order.step === 1 && order.type !== "custom" && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>Any additional toppings?</h2>
          <Stack spacing={2}>
            <FormGroup>
              {order.type === "Margherita" && (
                <>
                  <FormControlLabel control={<Checkbox disabled checked />} label="tomato sauce" />
                  <FormControlLabel control={<Checkbox disabled checked />} label="mozzarella" />
                  <FormControlLabel control={<Checkbox disabled checked />} label="basil" />
                </>
              )}
              {order.type === "salami" && (
                <>
                  <FormControlLabel control={<Checkbox disabled checked />} label="tomato sauce" />
                  <FormControlLabel control={<Checkbox disabled checked />} label="mozzarella" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="salami milano" onChange={(event) => changeIngredients(event.target.checked, "salami milano")} />
                </>
              )}
              {order.type === "anti-pasti" && (
                <>
                  <FormControlLabel control={<Checkbox disabled checked />} label="tomato sauce" />
                  <FormControlLabel control={<Checkbox disabled checked />} label="mozzarella" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="onions" onChange={(event) => changeIngredients(event.target.checked, "onions")} />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="artichokes" onChange={(event) => changeIngredients(event.target.checked, "artichokes")} />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="sun-dried tomatoes" onChange={(event) => changeIngredients(event.target.checked, "sun-dried tomatoes")} />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="mushrooms" onChange={(event) => changeIngredients(event.target.checked, "mushrooms")} />
                </>
              )}
              {/* Additional toppings */}
              <FormControlLabel control={<Checkbox />} label="chili oil" onChange={(event) => changeIngredients(event.target.checked, "chili oil")} />
              <FormControlLabel control={<Checkbox />} label="garlic oil" onChange={(event) => changeIngredients(event.target.checked, "garlic oil")} />
              <FormControlLabel control={<Checkbox />} label="basil" onChange={(event) => changeIngredients(event.target.checked, "basil")} />
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
