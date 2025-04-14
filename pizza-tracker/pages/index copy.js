import { Stack, TextField, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material'
import React, { useState } from 'react'
import Modal from 'react-modal';
import Image from 'next/image'
import Tracker from './Tracker';

import styles from './index.module.css'



export default function Home() {

  // Stuff für Modal
  const [modalOpen, setModalOpen] = useState(false)

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setOrder({ step: 0, type: undefined, toppings: [], name: "" })
  }

  // Stuff für Order
  const [order, setOrder] = useState({ step: 0, type: undefined, toppings: [], name: "" })

  let setStep = (step) => {
    setOrder(prevOrder => ({ ...prevOrder, step: step }));
    if (step === 0) {
      setOrder(prevOrder => ({ ...prevOrder, toppings: [] }));
    }
  }

  let setPizzaType = (type) => {
    setOrder(prevOrder => ({ ...prevOrder, type: type }));
    setStep(1)
  }

  let setName = (name) => {
    setOrder(prevOrder => ({ ...prevOrder, name: name }))
  }

  async function sendOrder() {
    if (order.name.trim() === "") {
      order.name = "Anonymous"
    }
    order.step = undefined
    order.status = "offen"
    order.dt0 = Date.now()
    const data = JSON.stringify(order)

    try {
      const response = await fetch("http://localhost:3000/api/postPizza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      })
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      } else {
        alert("Thank you, your order was placed.")
      }

    } catch (error) {
      console.error("Fehler beim Senden der Daten", error)
    }
    closeModal()
  }
  const changeIngredients = (input, label) => {
    if (input === true) {
      order.toppings.push(label)
    } else {
      const index = order.toppings.indexOf(label)
      order.toppings.splice(index, 1)
    }
  }

  return (
    <>
      <div className='header'>
        <h1>Pizza Order and Tracking System</h1>
      </div>

      <div className='left-side'>
        <Button variant='contained' onClick={openModal}>Place Order here</Button>

        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          contentLabel="Ordering Modal"
          style={{
            content: {
              padding: '0px'
            }
          }}

        >
          {order.step === 0 && (
            <>
              <div className={styles.StepOneHeader}>
                <h2 className={styles.StepOneH2}>Please select your base pizza</h2>
                <Button className={styles.CustomOrderButton} variant='contained'
                  onClick={() => setPizzaType("custom")}>CUSTOM ORDER</Button>
              </div>
              <div className={styles.StepOneMain}>
                <div className={styles.ImageContainer}>
                  <Image height={750} width={750}
                    className={styles.PizzaImage}
                    src={"/margherita-pizza.png"}
                    onClick={() => setPizzaType("margarita")}
                    alt='Pizza Margherita'>
                  </Image>
                  <div className={styles.ImageText}>Pizza Margherita</div>
                </div>

                <div className={styles.ImageContainer}>
                  <Image height={750} width={750}
                    src={"/salami-pizza.png"}
                    className={styles.PizzaImage}
                    onClick={() => {
                      setPizzaType("salami");
                      order.toppings.push("salami milano")
                    }}
                    alt='Pizza Salami' />
                  <div className={styles.ImageText}>Pizza Salami</div>
                </div>

                <div className={styles.ImageContainer}>
                  <Image height={750} width={750}
                    src={"/antipasti-pizza.png"}
                    className={styles.PizzaImage}
                    onClick={() => {
                      setPizzaType("anti-pasti")
                      order.toppings.push("artichokes", "sun-dried tomatoes", "mushrooms", "onions")
                    }}
                    alt='Pizza Antipasti' />
                  <div className={styles.ImageText}>Pizza Anti-Pasti</div>
                </div>
              </div>
            </>
          )}

          {order.step === 1 && order.type === "custom" && (
            <>
              <h2 style={{ marginLeft: "20px" }}>Choose your Toppings:</h2>

              <Stack spacing={2}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="tomato sauce" onChange={(event) => { changeIngredients(event.target.checked, "tomato sauce") }} />
                  <FormControlLabel control={<Checkbox />} label="mozzarella" onChange={(event) => { changeIngredients(event.target.checked, "mozzarella") }} />
                  <FormControlLabel control={<Checkbox />} label="salami milano" onChange={(event) => { changeIngredients(event.target.checked, "salami milano") }} />
                  <FormControlLabel control={<Checkbox />} label="salami finocchino" onChange={(event) => { changeIngredients(event.target.checked, "salami finocchino") }} />
                  {/*<FormControlLabel control={<Checkbox defaultChecked />} label="cheese" onChange={(event) => { changeIngredients(event.target.checked, "cheese") }} />*/}
                  <FormControlLabel control={<Checkbox />} label="chili oil" onChange={(event) => { changeIngredients(event.target.checked, "chili oil") }} />
                  <FormControlLabel control={<Checkbox />} label="garlic oil" onChange={(event) => { changeIngredients(event.target.checked, "garlic oil") }} />
                  <FormControlLabel control={<Checkbox />} label="onions" onChange={(event) => { changeIngredients(event.target.checked, "onions") }} />
                  <FormControlLabel control={<Checkbox />} label="artichokes" onChange={(event) => { changeIngredients(event.target.checked, "artichokes") }} />
                  <FormControlLabel control={<Checkbox />} label="sun-dried tomatoes" onChange={(event) => { changeIngredients(event.target.checked, "sun-dried tomatoes") }} />
                  <FormControlLabel control={<Checkbox />} label="mushrooms" onChange={(event) => { changeIngredients(event.target.checked, "mushrooms") }} />
                  <FormControlLabel control={<Checkbox />} label="basil" onChange={(event) => { changeIngredients(event.target.checked, "basil") }} />
                </FormGroup>
              </Stack>

              <Stack direction="row">
                <Button onClick={() => setStep(0)}>Back</Button>
                <h3>Please enter your name</h3>
                <TextField value={order.name} onChange={(event) => { setName(event.target.value) }} ></TextField>
                <Button onClick={() => sendOrder()} variant='contained'>Place order</Button>
              </Stack>

            </>
          )}

          {order.step === 1 && order.type === "margarita" && (
            <>
              <h2 style={{ marginLeft: "20px" }}>Any additional toppings?</h2>

              <Stack spacing={2}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox disabled checked />} label="tomato sauce" />
                  <FormControlLabel control={<Checkbox disabled checked />} label="mozzarella" />
                  <FormControlLabel control={<Checkbox disabled checked/>} label="basil" />
                  <FormControlLabel control={<Checkbox />} label="chili oil" onChange={(event) => { changeIngredients(event.target.checked, "chili oil") }} />
                  <FormControlLabel control={<Checkbox />} label="garlic oil" onChange={(event) => { changeIngredients(event.target.checked, "garlic oil") }} />
                </FormGroup>
              </Stack>

              <Stack direction="row">
                <Button onClick={() => setStep(0)}>Back</Button>
                <h3>Please enter your name</h3>
                <TextField value={order.name} onChange={(event) => { setName(event.target.value) }} ></TextField>
                <Button onClick={() => sendOrder()} variant='contained'>Place order</Button>
              </Stack>

            </>
          )}

          {order.step === 1 && order.type === "salami" && (
            <>
              <h2 style={{ marginLeft: "20px" }}>Any additional toppings?</h2>
              
              <Stack spacing={2}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox disabled checked />} label="tomato sauce" />
                  <FormControlLabel control={<Checkbox disabled checked />} label="mozzarella" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="salami milano" onChange={(event) => { changeIngredients(event.target.checked, "salami milano") }} />
                  <FormControlLabel control={<Checkbox />} label="salami finocchino" onChange={(event) => { changeIngredients(event.target.checked, "salami finocchino") }} />
                  {/*<FormControlLabel control={<Checkbox defaultChecked />} label="cheese" onChange={(event) => { changeIngredients(event.target.checked, "cheese") }} />*/}
                  <FormControlLabel control={<Checkbox />} label="chili oil" onChange={(event) => { changeIngredients(event.target.checked, "chili oil") }} />
                  <FormControlLabel control={<Checkbox />} label="garlic oil" onChange={(event) => { changeIngredients(event.target.checked, "garlic oil") }} />
                  <FormControlLabel control={<Checkbox />} label="onions" onChange={(event) => { changeIngredients(event.target.checked, "onions") }} />
                  <FormControlLabel control={<Checkbox />} label="artichokes" onChange={(event) => { changeIngredients(event.target.checked, "artichokes") }} />
                  <FormControlLabel control={<Checkbox />} label="sun-dried tomatoes" onChange={(event) => { changeIngredients(event.target.checked, "sun-dried tomatoes") }} />
                  <FormControlLabel control={<Checkbox />} label="mushrooms" onChange={(event) => { changeIngredients(event.target.checked, "mushrooms") }} />
                  <FormControlLabel control={<Checkbox />} label="basil" onChange={(event) => { changeIngredients(event.target.checked, "basil") }} />
                </FormGroup>
              </Stack>



              <Stack direction="row">
                <Button onClick={() => setStep(0)}>Back</Button>
                <h3>Please enter your name</h3>
                <TextField value={order.name} onChange={(event) => { setName(event.target.value) }} ></TextField>
                <Button onClick={() => sendOrder()} variant='contained'>Place order</Button>
              </Stack>

            </>
          )}

          {order.step === 1 && order.type === "anti-pasti" && (
            <>
              <h2 style={{ marginLeft: "20px" }}>Any additional toppings?</h2>

              <Stack spacing={2}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox disabled checked />} label="tomato sauce" />
                  <FormControlLabel control={<Checkbox disabled checked />} label="mozzarella" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="onions" onChange={(event) => { changeIngredients(event.target.checked, "onions") }} />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="artichokes" onChange={(event) => { changeIngredients(event.target.checked, "artichokes") }} />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="sun-dried tomatoes" onChange={(event) => { changeIngredients(event.target.checked, "sun-dried tomatoes") }} />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="mushrooms" onChange={(event) => { changeIngredients(event.target.checked, "mushrooms") }} />
                  <FormControlLabel control={<Checkbox />} label="chili oil" onChange={(event) => { changeIngredients(event.target.checked, "chili oil") }} />
                  <FormControlLabel control={<Checkbox />} label="garlic oil" onChange={(event) => { changeIngredients(event.target.checked, "garlic oil") }} />
                  <FormControlLabel control={<Checkbox />} label="basil" onChange={(event) => { changeIngredients(event.target.checked, "basil") }} />
                </FormGroup>
              </Stack>

              <Stack direction="row">
                <Button onClick={() => setStep(0)}>Back</Button>
                <h3>Please enter your name</h3>
                <TextField value={order.name} onChange={(event) => { setName(event.target.value) }} ></TextField>
                <Button onClick={() => sendOrder()} variant='contained'>Place order</Button>
              </Stack>

            </>
          )}
        </Modal>

        <Tracker />
      </div>

    </>
  )
}