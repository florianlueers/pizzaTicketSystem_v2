import { useState } from "react";
import { Button } from "@mui/material";

export default function ToppingComponent({ data }) {
    const { name } = data;
    const [available, setAvailable] = useState(data.available);

    const handleClick = async () => {
        setAvailable(false);

        try {
            await fetch("/api/setToppingUnavailable", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });
        } catch (err) {
            console.error("Fehler beim Aktualisieren des Toppings:", err);
        }
    };

    return (
        <Button
            onClick={handleClick}
            sx={{
                backgroundColor: available ? 'green' : 'red',
                color: 'white',
                '&:hover': {
                    backgroundColor: available ? 'darkgreen' : 'darkred'
                },
                padding: '6px 12px',
                fontSize: '1rem',
                marginBottom: '16px',
                marginRight: '4px',
                borderRadius: '4px',
            }}
        >
            {name}
        </Button>
    );
}
