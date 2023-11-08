import React from 'react';

import { HiMiniLightBulb } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function HintButton({ word }: { word: string }) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center p-2 border dark:border-white rounded" aria-label="hint button">
        <HiMiniLightBulb className="w-5 h-5" />
        </PopoverTrigger>
      <PopoverContent className="py-2 dark:border-customHighlight dark:bg-mainBg-dark">{word}</PopoverContent>
    </Popover>
  )
}