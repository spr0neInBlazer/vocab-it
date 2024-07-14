import React, { useEffect, useState } from 'react';
import { MAX_WORDS } from '@/lib/globals';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

export default function WordsTooltip() {
  const [isTouchScreen, setIsTouchScreen]= useState<boolean>(false);

  useEffect(() => {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (hasTouchScreen) {
      setIsTouchScreen(true);
    } else {
      setIsTouchScreen(false);
    }
  }, [])

  if (isTouchScreen) {
    return (
      <Popover>
        <PopoverTrigger aria-label="tooltip for touch screens">
          <HiMiniQuestionMarkCircle />
        </PopoverTrigger>
        <PopoverContent className="dark:border-customHighlight dark:bg-mainBg-dark">
          <p className="font-thin text-sm italic"> <span className="not-italic">Recommended:</span> <span className="font-semibold">{MAX_WORDS}</span> words max per 1 vocabulary</p>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-default" aria-label="tooltip">
          <HiMiniQuestionMarkCircle />
        </TooltipTrigger>
        <TooltipContent className="dark:border-customHighlight dark:bg-mainBg-dark">
          <p className="font-thin text-sm italic"> <span className="not-italic">Recommended:</span> <span className="font-semibold">{MAX_WORDS}</span> words max per 1 vocabulary</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}