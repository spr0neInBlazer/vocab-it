import React, { useEffect, useState } from 'react';
import { Vocab } from '@/lib/types';
import useVocabStore from '@/lib/store';
import dynamic from 'next/dynamic';

import VocabListRow from './VocabListRow';
import { Skeleton } from './ui/skeleton';
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { ScrollArea } from './ui/scroll-area';
import { useAuthStore } from '@/lib/authStore';

const WordsTooltip = dynamic(() => import('./WordsTooltip'), {
  loading: () => <HiMiniQuestionMarkCircle />
});

export default function VocabList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const vocabs = useVocabStore(state => state.vocabs);
  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="w-full my-4">
        <div className="flex gap-1 px-4 my-2">
          <p className="w-2/5 font-bold text-left pl-2">Title</p>
          <p className="font-bold flex items-center gap-1 justify-start">
            Words
            <WordsTooltip />
          </p>
        </div>
        <div className="h-[210px] rounded-md border px-2 sm:px-4 py-3">
          <div className="flex w-full justify-between py-3 px-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-5 w-3/5" />
          </div>
          <div className="flex w-full justify-between py-3 px-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-5 w-3/5" />
          </div>
          <div className="flex w-full justify-between py-3 px-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-5 w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  if (vocabs && vocabs.length > 0) {
    return (
      <section className="w-full my-4">
        <div className="flex gap-1 px-4 my-2">
          <p className="w-2/5 font-bold text-left pl-2">Title</p>
          <p className="font-bold flex items-center gap-1 justify-start">
            Words
            <WordsTooltip />
          </p>
        </div>
        <ScrollArea className="h-[210px] rounded-md border px-2 sm:px-4 py-3">
          {vocabs.map((vocab: Vocab) => {
            return <VocabListRow key={vocab._id} vocab={vocab} />
          })}
        </ScrollArea>
      </section>
    )
  }

  return (
    <section className="my-4">
      <div className="flex gap-1 px-4 my-2">
        <p className="w-2/5 font-bold text-left pl-2">Title</p>
        <p className="font-bold flex items-center gap-1 justify-start">
          Words
        </p>
      </div>
      <div className="h-[210px] rounded-md border sm:px-4 py-3 flex justify-center items-center">
        <p className="text-base sm:text-xl font-bold">No vocabularies</p>
      </div>
    </section>
  )
}