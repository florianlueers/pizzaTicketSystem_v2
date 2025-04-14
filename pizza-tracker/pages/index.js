import { Button } from '@mui/material'
import React, { useState } from 'react'

import Tracker from './Tracker';
import MyModal from './Modal';

import styles from "./index.module.css"


export default function Home() {

  const [modalOpen, setModalOpen] = useState(false)

  function openModal() {
    setModalOpen(true)
  }

  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <h1>😋🍕chen</h1>
        <Button variant='contained' onClick={openModal}>New Pizza</Button>
      </div>

      <MyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <hr style={{ opacity: 0.3 }} />

      <div className={styles.lol}>
        <Tracker />
      </div>

    </div>
  )
}