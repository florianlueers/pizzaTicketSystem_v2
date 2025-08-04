import React, { useState } from "react";
import { Stack, Button, keyframes } from "@mui/material";


const PizzaComponent = (pizza) => {

    async function sendData(data) {
        try {
            const response = await fetch("http://srv18.ikap.biba.uni-bremen.de:3000/api/updatePizza", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data
            })
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`)
            }

            const jsonResponse = await response.json()
            console.log(jsonResponse)
        } catch (error) {
            console.error("Fehler beim Senden der Daten", error)
        }
    }


    async function increaseStatus()  {
        console.log(object)
        let newData = {dt0: dt0}  
        if (status === "open") {
            newData.status = "being prepared"
            newData.dt1 = Date.now()
        }
        
        if (status === "being prepared") {
            newData.status = "cooking"
            newData.dt2 = Date.now()
        }

        if (status === "cooking") {
            newData.status = "available"
            newData.dt3 = Date.now()
        }

        if (status === "available") {
            newData.status = "done"
            newData.dt4 = Date.now()
            // Notify user that pizza is ready
        }
        sendData(JSON.stringify(newData))
    }

    const object = pizza.pizza
    const dt0 = object.dt0
    var status = object.status
    const name = object.name
    const type = object.type
    const toppings = object.toppings


    const timerField = () => {
        // {min}:{sec}
        var timer = Date.now() - dt0;
        var min = Math.floor(Math.floor((Date.now() - dt0) / 1000) / 60)
        var sec = Math.floor((Date.now() - dt0) / 1000) % 60

        if (min >= 10) {
            return (
                <div style={{marginRight: "30px", fontWeight: "bold", fontSize: "20px", color: "red"}}>{min}:{(sec < 10) ? "0"+sec : sec}</div>
            )
        } else {
            return (
                <div style={{marginRight: "30px", fontWeight: "bold", fontSize: "20px"}}>{"0" + min}:{(sec < 10) ? "0"+sec : sec}</div>
            )
        }
    }
    

    return (
        <>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => increaseStatus()}>next</Button>
                {timerField()}
                <div style={{marginRight: "30px", fontWeight: "bold",fontSize: "20px"}}>{status}</div>
                <div style={{marginRight: "30px", fontWeight: "bold",fontSize: "20px"}}>{name}</div>
                <div style={{marginRight: "30px", fontWeight: "bold",fontSize: "20px"}}>{type}</div>
                <p style={{fontSize: "20px"}}>{toppings.join(", ")}</p>
            </Stack>
            <hr />
        </>
    )
}

export default PizzaComponent