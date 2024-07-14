import React, { ReactElement, useEffect } from 'react';
import { NextPageWithLayout } from '../_app';
import dynamic from 'next/dynamic';

import Head from "next/head";
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import useProfileStore from '@/lib/profileStore';
import ProfileAddVocabSection from '@/components/ProfileAddVocabSection';
import ProfileWordSection from '@/components/ProfileWordSection';
import { Toaster } from '@/components/ui/toaster';
import { Skeleton } from '@/components/ui/skeleton';

// const SCHEDULE_OPTIONS = ['every day', 'every 2 days', 'every 3 days', 'once a week'];

// needs client render because server and client (storage) username values differ
const NoSSR = dynamic(() => import('@/components/ProfileUsernameSection'), { 
  ssr: false,
  loading: () => (
    <div>
      <h2 className='text-xl mobile:text-2xl md:text-3xl font-bold dark:text-customText-dark mb-4'>Username</h2>
      <Skeleton className="my-3 w-32 h-[38px] sm:w-2/12" />
      <div className="h-px w-full dark:bg-mainBg-dark mt-3 mb-5" />
    </div>
  )
});

const Profile: NextPageWithLayout = () => {
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isEditVocabTitle,
    toggleIsEditUsername,
    toggleIsEditWordAmount,
    toggleIsAddVocab,
    toggleIsEditVocabTitle
  } = useProfileStore(state => state);

  // only allow one field editing at a time
  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    // reset all active edit modes 
    switch (true) {
      case isEditUsername:
        toggleIsEditUsername();
      case isEditWordAmount:
        toggleIsEditWordAmount();
      case isAddVocab:
        toggleIsAddVocab();
      case isEditVocabTitle:
        toggleIsEditVocabTitle();
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>Account</title>
      </Head>

      <section className="w-11/12 lg:w-3/5 mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <h1 className='text-2xl mobile:text-3xl md:text-4xl text-center font-semibold dark:text-customText-dark mb-4'>My profile</h1>
        <NoSSR checkSingleEdit={checkSingleEdit} />
        <ProfileAddVocabSection checkSingleEdit={checkSingleEdit} />
        <ProfileWordSection checkSingleEdit={checkSingleEdit} />
      </section>
      <Toaster />
      <Footer />
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Profile;