import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useVocabStore from '@/lib/store';
import { Word } from '@/lib/types';

import Head from 'next/head';
import Link from 'next/link';
import { HiArrowLongLeft, HiPencilSquare, HiPlus, HiTrash } from "react-icons/hi2";
import { ScrollArea } from '@/components/ui/scroll-area';
import SingleWord from '@/components/SingleWord';
import { NextPageWithLayout } from '../_app';
import Layout from '@/components/Layout';

// FCP: 1.9s -> 1.5s
// TTFB: 1s -> .167s

// add skeletons if the words exist

const Vocabulary: NextPageWithLayout = () => {
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);
  const [isAddWord, setIsAddWord] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>(''); 
  const [translation, setTranslation] = useState<string>('');
  const router = useRouter();
  const vocabs = useVocabStore(state => state.vocabs);
  const initialFetch = useVocabStore(state => state.initialFetch);
  const editVocabTitle = useVocabStore(state => state.editVocabTitle);
  const addWordToStore = useVocabStore(state => state.addWord);
  const deleteWord = useVocabStore(state => state.deleteWord);
  const editWord = useVocabStore(state => state.editWord);
  const [words, setWords] = useState<Word[]>([]);

  function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title) return;
    const currVocab = vocabs?.find(v => v.title === router.query.id);
    // if the title is empty or only consists of spaces
    if (title.length === 0 || !/\S/.test(title)) {
      alert('Enter valid title');
    } else {
      if (currVocab) {
        // if there's an existing vocab with new title
        if (title === currVocab.title && title !== router.query.id) {
          alert('A vocabulary with this title already exists');
        } else {
          editVocabTitle(currVocab.title, title);
          setIsEditTitle(false);
        }
      }
    }
  }

  function addWord(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (newWord.length === 0 || !/\S/.test(newWord)) {
      alert('Input valid word');
    } else if (translation.length === 0 || !/\S/.test(translation)) {
      alert('Input valid translation');
    } else {
      setIsAddWord(false);
      if (typeof router.query.id === "string") {
        addWordToStore(router.query.id, newWord, translation);
      }
    }
    setNewWord('');
    setTranslation('');
  }

  function cancelAddWord() {
    setIsAddWord(false);
    setNewWord('');
  }

  useEffect(() => {
    if (!vocabs) {
      initialFetch();
    }
  }, []);

  useEffect(() => {
    if (vocabs && router.query.id) {
      const vocab = vocabs?.find(v => v.title === router.query.id);
      if (vocab) {
        setTitle(vocab.title);
        setWords(vocab.words);
      }
    }
  }, [vocabs, router.query.id])

  return (
    <>
      <Head>
        <title>Vocabulary Details</title>
      </Head>
      <section className="w-11/12 lg:w-4/5 mx-auto mt-32 mb-6 py-5 px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight flex flex-col">
        {(isEditTitle && title) ? (
          <form className="flex relative justify-center gap-2 items-center" onSubmit={updateTitle}>
            <Link className="absolute left-0 flex gap-1 items-center rounded-full py-1 px-3 hover:bg-slate-100 dark:hover:bg-customHighlight2"
              href="/profile/profile">
              <HiArrowLongLeft /> Profile
            </Link>
            <div className="flex justify-between items-center w-1/2">
              <input className="text-2xl pl-2 rounded" type="text" size={15} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
              <input className="bg-secondaryBg-light dark:bg-customText-dark text-white dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Save" />
            </div>
          </form>
        ) : (
          <div className="flex relative justify-center gap-2 items-center">
            <Link className="absolute left-0 flex gap-1 items-center rounded-full py-1 px-3 hover:bg-slate-100 dark:hover:bg-customHighlight2"
              href="/profile/profile">
              <HiArrowLongLeft /> Profile
            </Link>
            <h1 className="text-4xl font-semibold dark:text-customText-dark mb-4">{title ? title : "Loading..."}</h1>
            <button onClick={() => setIsEditTitle(true)}><HiPencilSquare /></button>
          </div>
        )}
        <p className="text-lg text-center">{words.length === 1 ? '1 word' : `${words.length} words`}</p>
        <div className="my-5">
          <button className="flex gap-1 items-center rounded-lg py-1 px-3 font-semibold text-white bg-secondaryBg-light transition-colors" 
            onClick={() => setIsAddWord(true)}>
            <HiTrash /> Delete Vocabulary
          </button>
        </div>
        {words.length > 0 ? (
          <section className="w-3/4 mx-auto">
            <div className="flex px-6 my-2">
              <p className="font-bold w-3/5">Word</p>
              <p className="font-bold">Translation</p>
            </div>
            <ScrollArea className="h-[210px] rounded-md border px-4 py-3">
              {words.map((w, index) => {
                return (
                  <SingleWord key={w.word} word={w} index={index} vocabTitle={router.query.id as string} length={words.length} />
                  // <>
                  //   <div key={w.word} className="flex justify-between my-1 p-2 rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
                  //     <p className="w-1/2">{w.word}</p>
                  //     <p className="w-1/4">{w.translation}</p>
                  //     <div className="flex gap-1">
                  //       <button><HiPencilSquare /></button>
                  //       <button onClick={() => deleteWord(router.query.id as string, w.word)}><HiTrash /></button>
                  //     </div>
                  //   </div>
                  //   {index !== words.length - 1 ? <div className="h-px w-full dark:bg-mainBg-dark" /> : ''}
                  // </>
                )
              })}
            </ScrollArea>
          </section>
        ) : (
          <p className="text-center text-xl font-bold my-5">No words</p>
        )}
        {isAddWord ? (
          <form className="flex gap-3 my-3 justify-between items-center" onSubmit={addWord}>
            <input className="w-3/12 text-lg px-2 rounded" value={newWord} onChange={(e) => setNewWord(e.target.value)} size={20} autoFocus />
            <input className="w-3/12 text-lg px-2 rounded" value={translation} onChange={(e) => setTranslation(e.target.value)} size={20} />
            <input className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Create" />
            <button className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" onClick={cancelAddWord}>Cancel</button>
          </form>
        ) : (
          <div>
            <button className="flex gap-1 items-center rounded-lg mt-5 py-1 px-3 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors" 
              onClick={() => setIsAddWord(true)}>
              <HiPlus /> Add Word
            </button>
          </div>
        )}
      </section>
    </>
  )
}

Vocabulary.getLayout = function getLayout(page: ReactElement) {
  return (<Layout>{page}</Layout>)
}

export default Vocabulary;