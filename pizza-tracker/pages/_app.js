import React from 'react'
import Head from 'next/head'
 
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>&#x1F355; PizzaTracker</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
 
export default MyApp
