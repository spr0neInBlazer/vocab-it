import React, { ReactElement, useEffect, useState } from 'react';
import { prefix } from '@/lib/store';
import { useRouter } from 'next/router';
import { Word, Answer } from '@/lib/types';
import { usePreferencesStore } from '@/lib/preferencesStore';

import Head from 'next/head';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import LessonResult from '@/components/LessonResult';
import HintButton from '@/components/HintButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NextPageWithLayout } from '../_app';
import Layout from '@/components/Layout';

const initialWordIdx: number = 1;

const Lesson: NextPageWithLayout = () => {
  const preferenceStore = usePreferencesStore(state => state);

  const [lessonVolume, setLessonVolume] = useState<number>(0);
  const [words, setWords] = useState<Word[]>([]);
  const [currWord, setCurrWord] = useState<number>(initialWordIdx);
  const [answer, setAnswer] = useState<string>('');
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [endLesson, setEndLesson] = useState<boolean>(false);
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

  function restartLesson() {
    setCurrWord(1);
    setAllAnswers([]);
    const vocab = localStorage.getItem((prefix + router.query.id));
    if (vocab) {
      const fetchedWords = JSON.parse(vocab).words;
      setWords(randomizeWords(fetchedWords, lessonVolume));
    }
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

  // when user ends the lesson, redirect to profile page
  useEffect(() => {
    if (endLesson) {
      router.push('/profile/profile');
    }
  }, [endLesson, router]);

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
        <div className="w-11/12 lg:w-3/5 mx-auto mt-32 mb-6">
          <LessonResult allAnswers={allAnswers} words={words} />
          <div className="flex justify-between mt-5 px-3">
            <button className="flex gap-1 items-center rounded-lg py-2 px-4 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"
              onClick={restartLesson}  
            >
              Start Again
            </button>
            <button className="flex gap-1 items-center rounded-lg py-2 px-4 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"
            >
              <Link href="/profile/profile">
                Back to Profile
              </Link>
            </button>
          </div>
        </div>
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
          <AlertDialog>
            <AlertDialogTrigger 
              className="flex gap-1 items-center rounded-lg py-2 px-4 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"
            >
              End Lesson
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col items-center justify-center">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to end this lesson?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel 
                  className="font-semibold bg-secondaryBg-light dark:bg-secondaryBg-light hover:bg-hoverSecondaryBg dark:hover:bg-hoverSecondaryBg text-white hover:text-white dark:border-white"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="font-semibold bg-btnBg dark:bg-btnBg hover:bg-hoverBtnBg dark:hover:bg-hoverBtnBg text-white dark:text-white hover:text-white border dark:border-white"
                  onClick={() => setEndLesson(true)}
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

Lesson.getLayout = function getLayout(page: ReactElement) {
  return (<Layout>{page}</Layout>)
}

export default Lesson;