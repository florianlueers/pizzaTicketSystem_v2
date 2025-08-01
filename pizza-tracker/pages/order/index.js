import { Button } from '@mui/material'
import React, { useState } from 'react'

import MyModal from './Modal';
import styles from "./index.module.css"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  function openModal() {
    setModalOpen(true)
  }

  return (
    <div className={styles.mainBody} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Button variant='contained' onClick={openModal} sx={{ fontSize: '1.5rem', padding: '16px 32px' }}>
        Order your pizza
      </Button>
      <MyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  )
}