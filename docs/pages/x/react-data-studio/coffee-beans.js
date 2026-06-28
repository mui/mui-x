import * as React from 'react';
import Head from 'next/head';
import CoffeeBeansSales from 'docs/data/data-studio/overview/CoffeeBeansSales';

export default function Page() {
  return (
    <React.Fragment>
      <Head>
        <title>Coffee Beans - Data Studio demo - MUI X</title>
        <meta
          name="description"
          content="A full-screen Data Studio demo with related Coffee Beans Sales datasets."
        />
      </Head>
      <CoffeeBeansSales />
    </React.Fragment>
  );
}
