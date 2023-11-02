import React, { useEffect } from 'react';
import { Vocab2 } from '@/lib/types';
import useVocabStore from '@/lib/store';

import VocabListRow from './VocabListRow';
import { Skeleton } from './ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

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
      <table className="w-full my-3">
        <thead>
          <tr>
            <th className="w-3/5 text-left pl-2">Name</th>
            <th className="flex items-center gap-1 justify-start">
              Words
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-default">
                    <HiMiniQuestionMarkCircle />
                  </TooltipTrigger>
                  <TooltipContent className="dark:border-customHighlight dark:bg-mainBg-dark">
                    <p className="font-thin text-sm italic"> <span className="not-italic">Recommended:</span> <span className="font-semibold">50</span> words max per 1 vocabulary</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </th>
          </tr>
        </thead>
        <tbody>
          {vocabs.map((vocab: Vocab2) => {
            return <VocabListRow key={vocab._id} vocab={vocab} />
          })}
        </tbody>
      </table>
    )
  }

  return <p className="text-center text-xl font-bold my-5">No vocabularies</p>
}