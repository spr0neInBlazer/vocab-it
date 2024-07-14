import React, { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import Head from "next/head";
import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';

const ErrorPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Account</title>
      </Head>

      <section className="w-11/12 lg:w-3/5 flex flex-col gap-4 items-center justify-center mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <Image
          src="/images/404.svg"
          width={300}
          height={300}
          alt="404 error"
        />
        <h1 className="text-2xl text-center">This page could not be found :(</h1>
        <Link
          className="text-xl font-bold py-3 px-8 bg-customHighlight3 hover:bg-customHighlight3/80 rounded-xl" 
          href="/"
        >
          Home
        </Link>
      </section>
    </>
  )
}

ErrorPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default ErrorPage;