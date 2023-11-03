import React, { ReactElement, useEffect } from 'react';
import { NextPageWithLayout } from '../_app';
import dynamic from 'next/dynamic';

import Head from "next/head";
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import useProfileStore from '@/lib/profileStore';
import ProfileAddVocabSection from '@/components/ProfileAddVocabSection';
import ProfileWordSection from '@/components/ProfileWordSection';

// FCP: 1.915s -> 1.363s
// TTFB: .362s -> .213s

// const SCHEDULE_OPTIONS = ['every day', 'every 2 days', 'every 3 days', 'once a week'];

// needs client render because server and client (storage) username values differ
const NoSSR = dynamic(() => import('@/components/ProfileUsernameSection'), { ssr: false });

const Profile: NextPageWithLayout = () => {
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isAddWord,
    isEditWord,
    toggleIsEditUsername,
    toggleIsEditWordAmount,
    toggleIsAddVocab,
    toggleIsAddWord,
    toggleIsEditWord,
  } = useProfileStore(state => state);

  // only allow one field editing at a time
  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab || isAddWord || isEditWord) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    // reset all active edit modes 
    switch (true) {
      case isEditUsername:
        toggleIsEditUsername();
        break;
      case isEditWordAmount:
        toggleIsEditWordAmount();
        break;
      case isAddVocab:
        toggleIsAddVocab();
        break;
      case isAddWord:
        toggleIsAddWord();
        break;
      case isEditWord:
        toggleIsEditWord()
        break;
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>Account</title>
      </Head>

      <section className="w-11/12 lg:w-3/5 mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight border border-zinc-400 dark:border-zinc-300">
        <h1 className='text-xl mobile:text-3xl md:text-4xl text-center font-semibold dark:text-customText-dark mb-4'>My profile</h1>
        <NoSSR checkSingleEdit={checkSingleEdit} />
        <ProfileAddVocabSection checkSingleEdit={checkSingleEdit} />
        <ProfileWordSection checkSingleEdit={checkSingleEdit} />
      </section>
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