import React, {useState} from 'react';
import Layout from "@/components/Layout";
import Head from "next/head";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HiPencilSquare, HiTrash, HiPlus } from "react-icons/hi2";

const SCHEDULE_OPTIONS = ['every day', 'every 2 days', 'every 3 days', 'once a week'];

export default function Profile() {
  const [userName, setUserName] = useState<string>('testname');
  const [isEditUserName, setIsEditUserName] = useState<boolean>(false);
  const [wordsPerLesson, setWordsPerLesson] = useState<number>(10);
  const [isEditWords, setIsEditWords] = useState<boolean>(false);

  function updateUsername(e: React.SyntheticEvent) {
    e.preventDefault();
    if (userName.length > 0) {
      setIsEditUserName(false);
    }
  }

  function updateWordsAmount(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isNaN(wordsPerLesson) && wordsPerLesson % 1 === 0) {
      setIsEditWords(false);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Account</title>
      </Head>
      <section className="w-11/12 lg:w-4/5 mx-auto mt-32 mb-6 py-5 px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight">
        <h1 className='text-4xl text-center font-semibold dark:text-customText-dark mb-4'>Your profile</h1>
        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Username</h2>
          {isEditUserName ? (
            <form className="flex gap-3 my-3 w-2/12 justify-between items-center" onSubmit={updateUsername}>
              <input className="text-lg px-2 border rounded" value={userName} onChange={(e) => setUserName(e.target.value)} size={10} autoFocus />
              <input className="bg-secondaryBg-light dark:bg-customText-dark text-white dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Save" />
            </form>
          ) : (
            <div className="flex my-3 w-2/12 justify-between items-center">
              <p className="text-lg dark:text-customText-dark">{userName}</p>
              <button className="dark:text-customText-dark py-1"
                onClick={() => setIsEditUserName(true)}
              >
                <HiPencilSquare />
              </button>
            </div>
            )}
          <div className="h-px w-full dark:bg-mainBg-dark mt-3 mb-5" />
        </article>

        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Vocabularies</h2>
          <table className="w-full my-3">
            <thead>
              <tr>
                <th className="w-3/5 text-left pl-2">Name</th>
                <th className="text-left">Words</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
                <td className="py-3 pl-2">English</td>
                <td className="py-3">69</td>
                <td><button className="text-white rounded py-1 px-3 bg-btnBg hover:bg-hoverBtnBg transition-colors">Start Lesson</button></td>
                <td className="py-3"><button><HiPencilSquare /></button></td>
                <td className="py-3"><button><HiTrash /></button></td>
              </tr>
              <tr className="border-b rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
                <td className="py-3 pl-2">French</td>
                <td className="py-3">420</td>
                <td><button className="text-white rounded py-1 px-3 bg-btnBg hover:bg-hoverBtnBg transition-colors">Start Lesson</button></td>
                <td className="py-3"><button><HiPencilSquare /></button></td>
                <td className="py-3"><button><HiTrash /></button></td>
              </tr>
            </tbody>
          </table>
          <button className="flex gap-1 items-center rounded-lg py-1 px-3 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"><HiPlus /> Add Vocabulary</button>
          <div className="h-px w-full dark:bg-mainBg-dark mt-3 mb-5" />
        </article>

        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Lessons</h2>
          <h3 className="text-xl font-bold dark:text-customText-dark mb-4">Your current schedule:</h3>
          <Select>
            <SelectTrigger className="w-[180px] dark:bg-mainBg-dark">
              <SelectValue placeholder="frequency" />
            </SelectTrigger>
            <SelectContent className="dark:border-customHighlight dark:bg-mainBg-dark">
              {SCHEDULE_OPTIONS.map(option => {
                return <SelectItem className="capitalize hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight dark:focus:bg-customHighlight" key={option} value={option}>{option}</SelectItem>
              })}
            </SelectContent>
          </Select>
          <h3 className="text-xl font-bold dark:text-customText-dark my-4">Words per lesson:</h3>
          {isEditWords ? (
            <form className="flex gap-3 my-3 w-2/12 justify-between items-center" onSubmit={updateWordsAmount}>
              <input className="text-lg px-2 rounded" value={wordsPerLesson} onChange={(e) => setWordsPerLesson(Number(e.target.value))} size={5} autoFocus />
              <input className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Update" />
            </form>
          ) : (
            <div className="flex my-3 w-2/12 justify-between items-center">
              <p className="text-lg font-semibold dark:text-customText-dark border dark:bg-mainBg-dark px-2 py-1 w-20 rounded">{wordsPerLesson}</p>
              <button className="dark:text-customText-dark py-1"
                onClick={() => setIsEditWords(true)}
              >
                <HiPencilSquare />
              </button>
            </div>
            )}
        </article>
      </section>
    </Layout>
  )
}