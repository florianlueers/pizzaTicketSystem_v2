
import React, { useState } from 'react'

import Tracker from './Tracker';

import styles from "./index.module.css"


export default function Home() {

  const [modalOpen, setModalOpen] = useState(false)

  function openModal() {
    setModalOpen(true)
  }

  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <h1>Pizza Tracker</h1>
      </div>

      <div className={styles.lol}>
        <Tracker />
      </div>

    </div>
  )
}