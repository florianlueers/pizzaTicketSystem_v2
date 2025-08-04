import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function PizzaPage() {
  const router = useRouter()
  const { id } = router.query

  const [pizzaData, setPizzaData] = useState({})

  useEffect(() => {
    if (!id) return
    fetch(`http://srv18.ikap.biba.uni-bremen.de:3000/api/getPizzaByDt0?dt0=${id}`)
      .then(res => res.json())
      .then(data => setPizzaData(data.message))
      .catch(err => console.error(err))
  }, [id])
  

  return (
    <>
      <h1>Pizza Bestellung</h1>
      <p>ID: {pizzaData._id}</p>
      <p>Typ: {pizzaData.type}</p>
      <p>Toppings: {Array.isArray(pizzaData.toppings) ? pizzaData.toppings.join(', ') : ''}</p>
      <p>Name: {pizzaData.name}</p>
      <p>Status: {pizzaData.status}</p>
      <p>dt0: {pizzaData.dt0}</p>
    </>
  )
}