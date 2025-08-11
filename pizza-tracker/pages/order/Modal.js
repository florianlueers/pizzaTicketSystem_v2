import Modal from 'react-modal';
import styles from './Modal.module.css';

import Swal from 'sweetalert2';
import QRCode from 'qrcode';

import { Stack, TextField, FormGroup, FormControlLabel, Checkbox, Button, avatarClasses } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MyModal({ modalOpen, setModalOpen }) {

  const [pizzaSettings, setPizzaSettings] = useState({ availablePizzas: [], allToppings: [] });

  const fetchData = async () => {
    try {
      const response = await fetch("https://pizzademo.ikap.biba.uni-bremen.de/api/getAvailablePizzasAndToppings");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setPizzaSettings(jsonData.message);
      console.log(jsonData.message)
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
    toppings: [],
    name: ""
  });

  // Funktion zum Schließen des Modals und Zurücksetzen der Bestellung
  const closeModal = () => {
    setModalOpen(false);
    setOrder({ step: 0, type: undefined, toppings: [], name: "" , extras: [] });
  };

  // Funktion zur Änderung des Bestell-Schritts
  const setStep = (step) => {
    setOrder((prevOrder) => ({ ...prevOrder, step }));
  };

  // Funktion zur Auswahl des Pizzatyps
  const setPizzaType = (pizza) => {
    if (pizza.name === "Custom") {
      // Hier können Sie die Logik für benutzerdefinierte Pizzen hinzufügen
      setOrder((prevOrder) => ({ ...prevOrder, type: "Custom", toppings:["tomato sauce"] }));
    } else {
      setOrder((prevOrder) => ({ ...prevOrder, type: pizza.name }));
    }

    setStep(1);
  };

  function getAvailablePizzas() {
    return pizzaSettings["availablePizzas"].filter(pizza => {
      // Prüfe required-Toppings
      const requiredAvailable = pizza.toppingList.required.every(toppingName =>
        pizzaSettings.allToppings.some(
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
          pizzaSettings.allToppings.some(
            topping => topping.name === toppingName && topping.available
          )
        ).length;
        optionalAvailable = availableOptionalCount >= pizza.toppingList.optional.requiredCount;
      }

      return requiredAvailable && optionalAvailable;
    });
  }

  // getAvailableOptionalToppings
  function getAvailableOptionalToppings(pizza) {
    if (
      !pizza.toppingList.optional ||
      !Array.isArray(pizza.toppingList.optional.toppings)
    ) {
      return [];
    }
    return pizza.toppingList.optional.toppings
      .filter(toppingName =>
        pizzaSettings.allToppings.some(
          topping => topping.name === toppingName && topping.available
        )
      )
      .slice(0, pizza.toppingList.optional.count);
  }
  
  // Funktion zum Ändern der Toppings
  const changeToppings = (input, label) => {
    setOrder((prevOrder) => {
      const updatedToppings = input
        ? [...prevOrder.toppings, label]
        : prevOrder.toppings.filter((topping) => topping !== label);
      return { ...prevOrder, toppings: updatedToppings };
    });
  };


  function getUpdatedOrder(order) {
    const { additionalToppings, ...rest } = order;
    return {
      ...rest,
      name: order.name.trim() === "" ? "Anonymous" : order.name,
      status: "open",
      dt0: Date.now(),
    };
  }

  // Funktion zum Senden der Bestellung
  const [eta, setEta] = useState(null);

  const sendOrder = async () => {
    const updatedOrder = getUpdatedOrder(order);

    try {
      const response = await fetch("https://pizzademo.ikap.biba.uni-bremen.de/api/postPizza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const eta_response = await fetch(`https://pizzademo.ikap.biba.uni-bremen.de/api/getPizzaETA?dt0=${updatedOrder.dt0}`);
      if (!eta_response.ok) {
        throw new Error(`HTTP Error: ${eta_response.status}`);
      }
      const eta_data = await eta_response.json();
      console.log(eta_data);
      setEta(eta_data.eta);

      const pizzaUrl = `https://pizzademo.ikap.biba.uni-bremen.de/${updatedOrder.dt0}`;
      
      QRCode.toDataURL(pizzaUrl, function (err, url) {
        Swal.fire({
          title: 'Your Order has been placed!',
          html: `<p>Scan this QR code to view your pizza progress:</p>
          <img src="${url}" alt="QR Code" />
          <p>Initial estimated pick-up-time at ${new Date(eta).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })}</p>`,
          icon: 'success',
          background: '#281312',
          color: '#F8F420',
          timer: 120000,
        });
      });


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
          width: "800px",
          height: "600px",
          transform: 'translate(-50%, -50%)',
        }
      }}
    >
      {order.step === 0 && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>Please select your pizza</h2>
          <div style={{ display: "flex", gap: "32px" }}>
            {/* Erste Spalte mit maximal 3 Pizzen */}
            <div>
              {getAvailablePizzas()
                .slice(0, 3)
                .map((pizza, index) => (
                  <div className={styles.ImageContainer} onClick={() => setPizzaType(pizza)} key={index}>
                    <div className={styles.ImageOuter}>
                      <Image height={150} width={150} className={styles.ImageContainerImage} src={pizza["image"]} alt={`Pizza ${pizza.name}`} />
                    </div>
                    <div className={styles.ImageText} key={index}>
                      Pizza<br />{pizza.name}
                      <div className={styles.toppingsList}>
                        {pizza.name === "Custom"
                          ? "Create your own pizza with your favorite toppings!"
                          : pizza.toppingList.optional.count === 0
                          ? pizza.toppingList.required.join(", ")
                          : pizza.toppingList.required.join(", ") + ", " + getAvailableOptionalToppings(pizza).join(", ")
                        }
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            {/* Zweite Spalte mit den restlichen Pizzen */}
            <div>
              {getAvailablePizzas()
                .slice(3)
                .map((pizza, index) => (
                  <div className={styles.ImageContainer} onClick={() => setPizzaType(pizza)} key={index + 3}>
                    <div className={styles.ImageOuter}>
                      <Image height={150} width={150} className={styles.ImageContainerImage} src={pizza["image"]} alt={`Pizza ${pizza.name}`} />
                    </div>
                    <div className={styles.ImageText} key={index + 3}>
                      Pizza<br />{pizza.name}
                      <div className={styles.toppingsList}>
                        {pizza.name === "Custom"
                          ? "Create your own pizza with your favorite toppings!"
                          : pizza.toppingList.optional.count === 0
                          ? pizza.toppingList.required.join(", ")
                          : pizza.toppingList.required.join(", ") + ", " + getAvailableOptionalToppings(pizza).join(", ")
                        }
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {order.step === 1 && order.type === "Custom" && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>Choose your Toppings:</h2>
          <Stack spacing={2}>
            <FormGroup>
              {pizzaSettings["allToppings"].map((topping, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={topping.name}
                  checked={order.toppings.includes(topping.name)}
                  disabled={topping.disabled || !topping.available}
                  onChange={(event) => changeToppings(event.target.checked, topping.name)}
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

      {order.step === 1 && order.type !== "Custom" && (
        <div className={styles.ModalArea}>
          <h2 className={styles.modalH2}>You selected:</h2>
          <Stack spacing={2}>
            <FormGroup>
              {pizzaSettings["availablePizzas"].map((pizza, index) => (
                pizza.name === order.type && (
                  <div className={styles.ImageContainer} key={index}>
                    <div className={styles.ImageOuter}>
                      <Image height={150} width={150} className={styles.ImageContainerImage} src={pizza["image"]} alt={`Pizza ${pizza.name}`} />
                    </div>
                    <div className={styles.ImageText} key={index}>
                      Pizza<br />{pizza.name}
                      <div className={styles.toppingsList}>
                        {pizza.name === "Custom"
                          ? "Create your own pizza with your favorite toppings!"
                          : pizza.toppingList.optional.count === 0
                          ? pizza.toppingList.required.join(", ")
                          : pizza.toppingList.required.join(", ") + ", " + getAvailableOptionalToppings(pizza).join(", ")
                        }
                      </div>
                    </div>
                  </div>
                )
              ))}
              <h2 className={styles.modalH2}>Any additional toppings?</h2>
              {pizzaSettings["availablePizzas"].map((pizza, index) => (
                pizza.name === order.type && (
                  pizza.extras.map((extra, idx) => {
                    const toppingObj = pizzaSettings["allToppings"].find(t => t.name === extra);
                    return (
                      <FormControlLabel
                        key={idx}
                        control={<Checkbox />}
                        label={extra}
                        checked={order.toppings.includes(extra)}
                        disabled={toppingObj?.disabled || !toppingObj?.available}
                        onChange={(event) => changeToppings(event.target.checked, extra)}
                      />
                    );
                  })
                )
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
    </Modal>
  );
}