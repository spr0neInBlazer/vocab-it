import React, { useEffect } from 'react';
import { Vocab } from '@/lib/types';
import useVocabStore from '@/lib/store';
import dynamic from 'next/dynamic';

import VocabListRow from './VocabListRow';
import { Skeleton } from './ui/skeleton';
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

const WordsTooltip = dynamic(() => import('./WordsTooltip'), {
  loading: () => <HiMiniQuestionMarkCircle />
});

export default function VocabList() {
  const vocabs = useVocabStore(state => state.vocabs);
  const initialFetch = useVocabStore(state => state.initialFetch);

  // after SSR replace default value with local storage data
  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  if (!vocabs) {
    return (
      <div className="flex justify-between w-full my-3">
        <div className="w-1/2">
          <Skeleton className="h-3.5 w-2/5" />
        </div>
        <div className="flex w-1/2 justify-between">
          <Skeleton className="h-3.5 w-7" />
          <Skeleton className="h-3.5 w-11" />
          <Skeleton className="h-3.5 w-11" />
        </div>
      </div>
    );
  }

  if (vocabs.length > 0) {
    return (
      <table className="w-full my-3 text-sm mobile:text-base">
        <thead>
          <tr>
            <th className="w-2/5 sm:w-3/5 text-left pl-2">Name</th>
            <th className="flex items-center gap-1 justify-start">
              Words
              <WordsTooltip />
            </th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {vocabs.map((vocab: Vocab) => {
            return <VocabListRow key={vocab._id} vocab={vocab} />
          })}
        </tbody>
      </table>
    )
  }

  return <p className="text-center text-base sm:text-xl font-bold my-5">No vocabularies</p>
}