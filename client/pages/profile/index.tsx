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
import RequireAuth from '@/components/RequireAuth';
import useAuth from '@/hooks/useAuth';
import { BASE_URL } from '@/lib/globals';
import useVocabStore from '@/lib/store';
import DangerZone from '@/components/DangerZone';
import { useAuthStore } from '@/lib/authStore';
import useCheckToken from '@/hooks/useCheckToken';

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
  const setVocabs = useVocabStore(state => state.setVocabs);
  const fetchWithAuth = useAuth();
  const { accessToken, setIsTokenChecked } = useAuthStore(state => state);
  const {checkToken} = useCheckToken();

  // only allow one field editing at a time
  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setIsTokenChecked(false);
    const controller = new AbortController();

    const getProfileData = async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/profile`, {
          signal: controller.signal
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await res.json();
        setVocabs(data.vocabularies);
      } catch (error) {
        console.error(error);
      }
    }

    checkToken(getProfileData);

    return () => {
      controller.abort();
    }
  }, [accessToken]);

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
    <RequireAuth allowedRoles={[1305]}>
      <Head>
        <title>Account</title>
      </Head>

      <section className="w-11/12 lg:w-3/5 mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <h1 className='text-2xl mobile:text-3xl md:text-4xl text-center font-semibold dark:text-customText-dark mb-4'>My profile</h1>
        <NoSSR checkSingleEdit={checkSingleEdit} />
        <ProfileAddVocabSection checkSingleEdit={checkSingleEdit} />
        <ProfileWordSection checkSingleEdit={checkSingleEdit} />
        <DangerZone />
      </section>
      <Toaster />
      <Footer />
    </RequireAuth>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Profile;