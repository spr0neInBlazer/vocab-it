import React, {useState} from 'react';
import Layout from "@/components/Layout";
import Head from "next/head";
import { HiPencilSquare, HiTrash } from "react-icons/hi2";

export default function Profile() {
  const [userName, setUserName] = useState<string>('testname');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  function updateUsername(e: React.SyntheticEvent) {
    e.preventDefault();
    if (userName.length > 0) {
      setIsEdit(false);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Account</title>
      </Head>
      <main className="w-11/12 lg:w-4/5 mx-auto py-5 px-8 rounded-3xl dark:bg-customHighlight">
        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Username</h2>
          {isEdit ? (
            <form className="flex my-3 w-2/12 justify-between items-center" onSubmit={updateUsername}>
              <input className="text-lg px-2 rounded" value={userName} onChange={(e) => setUserName(e.target.value)} size={10} autoFocus />
              <input className="dark:bg-customText-dark dark:text-black cursor-pointer ml-3 px-3 py-1 rounded" type="submit" value="Save" />
            </form>
          ) : (
            <div className="flex my-3 w-2/12 justify-between items-center">
              <p className="text-lg dark:text-customText-dark">{userName}</p>
              <button className="dark:text-customText-dark py-1"
                onClick={() => setIsEdit(true)}
              >
                <HiPencilSquare />
              </button>
            </div>
            )}
          <div className="h-px w-full dark:bg-mainBg-dark mt-2 mb-4" />
        </article>
        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Vocabularies</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-2/3 text-left">Name</th>
                <th className="text-left">Words</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-mainBg-dark">
                <td className="py-3">English</td>
                <td className="py-3">69</td>
                <td className="py-3"><button>Start Lesson</button></td>
                <td className="py-3"><button><HiPencilSquare /></button></td>
                <td className="py-3"><button><HiTrash /></button></td>
              </tr>
              <tr className="border-b dark:border-mainBg-dark">
                <td className="py-3">French</td>
                <td className="py-3">420</td>
                <td className="py-3"><button>Start Lesson</button></td>
                <td className="py-3"><button><HiPencilSquare /></button></td>
                <td className="py-3"><button><HiTrash /></button></td>
              </tr>
            </tbody>
          </table>
        </article>
      </main>
    </Layout>
  )
}
