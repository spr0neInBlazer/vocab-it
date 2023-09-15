import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useVocabStore from '@/lib/store';

import Layout from '@/components/Layout';
import Head from 'next/head';
import { HiPencilSquare, HiTrash } from "react-icons/hi2";

export default function Vocabulary() {
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const router = useRouter();
  const vocabs = useVocabStore(state => state.vocabs);



  return (
    <Layout>
      <Head>
        <title>Vocabulary Details</title>
      </Head>
      <section className="w-11/12 lg:w-4/5 mx-auto mt-32 mb-6 py-5 px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight">
        <div>
          <h1 className='text-4xl font-semibold dark:text-customText-dark mb-4'>{title}</h1>
          <button onClick={() => setIsEditTitle(true)}><HiPencilSquare /></button>
        </div>
      </section>
    </Layout>
  )
}