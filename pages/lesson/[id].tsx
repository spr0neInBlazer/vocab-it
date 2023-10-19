import React, { useEffect, useState } from 'react';
import { prefix } from '@/lib/store';
import { useRouter } from 'next/router';
import { Word, Answer } from '@/lib/types';
import { usePreferencesStore } from '@/lib/preferencesStore';

import Head from 'next/head';
import { Skeleton } from '@/components/ui/skeleton';
import LessonResult from '@/components/LessonResult';
import HintButton from '@/components/HintButton';

// display wrong answers in the end
// add "try again" and "back to profile" buttons to lesson end page
// end lesson button

const initialWordIdx: number = 1;

export default function Lesson() {
  const preferenceStore = usePreferencesStore(state => state);

  const [lessonVolume, setLessonVolume] = useState<number>(0);
  const [words, setWords] = useState<Word[]>([]);
  const [currWord, setCurrWord] = useState<number>(initialWordIdx);
  const [answer, setAnswer] = useState<string>('');
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  function randomizeWords(array: Word[], volume: number): Word[] {
    let randomizedWords: Word[] = [];
    let sourceArray: Word[] = array;
    for (let i = 0; i < volume; i++) {
      let randomIdx: number = Math.floor(Math.random() * sourceArray.length);
      randomizedWords.push(sourceArray[randomIdx]);
      sourceArray = sourceArray.filter((_, i) => i !== randomIdx);
    }
    return randomizedWords;
  }

  function submitAnswer(e: React.SyntheticEvent) {
    e.preventDefault();
    registerAnswer();
  }

  function registerAnswer() {
    const i = currWord - 1;
    // if the answer is wrong
    if (answer.toLocaleLowerCase() !== words[i].word.toLowerCase()) {
      const userAnswer: Answer = {
        userAnswer: answer,
        isCorrect: false,
        word: words[i].translation,
        correctAnswer: words[i].word
      };
      setAllAnswers((prevAnswers) => [...prevAnswers, userAnswer]);
    } else {
    // if the answer is correct 
      const userAnswer: Answer = {
        userAnswer: answer,
        isCorrect: true,
      };
      setAllAnswers((prevAnswers) => [...prevAnswers, userAnswer]);
    }
    setCurrWord(currWord + 1);
    setAnswer('');
  }
  
  // fetch lessonStore
  // update lessonVolume from lessonStore
  useEffect(() => {
    if (preferenceStore) {
      setLessonVolume(preferenceStore.lessonVolume);
    }
  }, [preferenceStore]);

  // fetch words from local storage and randomize them 
  useEffect(() => {
    if (localStorage && router.query.id) {
      const vocab = localStorage.getItem((prefix + router.query.id));
      if (vocab) {
        const fetchedWords = JSON.parse(vocab).words;
        setWords(fetchedWords);
      }
    }
  }, [router.query.id]);

  useEffect(() => {
    if (words.length > 0 && lessonVolume > 0) {
      if (lessonVolume > words.length) {
        setLessonVolume(words.length);
        setWords(randomizeWords(words, words.length));
      } else {
        setWords(randomizeWords(words, lessonVolume));
      }
    }
  }, [lessonVolume, words.length]);

  useEffect(() => {
    if (router.query.id && words.length > 0 && preferenceStore) {
      setIsLoading(false);
    } else {
      setIsLoading(true)
    }
  }, [router.query.id, preferenceStore, isLoading, words]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Lesson</title>
        </Head>
        <Skeleton className="w-11/12 lg:w-3/5 h-[300px] mx-auto mt-32 mb-6 border border-white" />
      </>
    )
  }

  // end of lesson
  if (currWord > lessonVolume) {
    return (
      <>
        <Head>
          <title>Lesson</title>
        </Head>
        <LessonResult allAnswers={allAnswers} words={words} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Lesson</title>
      </Head>
      <div className="w-11/12 lg:w-3/5 mx-auto mt-32 mb-6">
        <p className="mx-3">{currWord}/{lessonVolume}</p>
        {words.length > 0 && (
          <section className="w-full p-8 rounded-xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight">
            <div>
              <h2 className="text-2xl">Word:</h2>
              <p className="text-3xl text-center my-3">{words[currWord-1].translation}</p>
            </div>
            <div className="h-px my-5 w-full dark:bg-mainBg-dark" />
            <div>
              <div className="flex justify-between">
                <h2 className="text-2xl">Enter translation:</h2>
                <HintButton word={words[currWord-1].word} />
              </div>
              <form className="my-3 flex justify-center" onSubmit={submitAnswer}>
                <input className="text-2xl leading-10 text-center rounded" type="text" value={answer} 
                  onChange={(e) => setAnswer(e.target.value)} 
                  placeholder="Your answer" 
                  autoFocus 
                />
              </form>
            </div>
          </section>
        )}
        <div className="flex justify-between mt-5 px-3">
          <button className="flex gap-1 items-center rounded-lg py-2 px-4 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"
            onClick={registerAnswer}
          >
            Skip
          </button>
          <button className="flex gap-1 items-center rounded-lg py-2 px-4 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"
            onClick={registerAnswer}  
          >
            OK
          </button>
        </div>
      </div>
    </>
  )
}