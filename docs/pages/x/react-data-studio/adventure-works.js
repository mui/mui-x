import * as React from 'react';
import Head from 'next/head';
import AdventureWorksSales from 'docs/data/data-studio/overview/AdventureWorksSales';

export default function Page() {
  return (
    <React.Fragment>
      <Head>
        <title>Adventure Works - Data Studio demo - MUI X</title>
        <meta
          name="description"
          content="A full-screen Data Studio demo with the Adventure Works sample data."
        />
      </Head>
      <AdventureWorksSales />
    </React.Fragment>
  );
}
