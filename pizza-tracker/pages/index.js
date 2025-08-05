
import React, { useState } from 'react'

import Tracker from './Tracker';

import styles from "./index.module.css"


export default function Home() {

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <div className={styles.mainBody}>
          <div className={styles.lol}>
            <h1>Pizza Tracker</h1>
            <Tracker />
          </div>
        </div>
      </div>
    </div>
  )
}