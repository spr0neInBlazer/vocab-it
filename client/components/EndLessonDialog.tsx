import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/router';

export default function EndLessonDialog() {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-16 text-sm mobile:text-base mobile:w-28 flex items-center justify-center rounded-lg py-2 font-semibold text-white bg-secondaryBg-light hover:bg-hoverSecondaryBg transition-colors">
        End Lesson
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center justify-center">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to end this lesson?</AlertDialogTitle>
          <AlertDialogDescription>End the lesson. All current progress will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="font-semibold bg-secondaryBg-light dark:bg-secondaryBg-light hover:bg-hoverSecondaryBg dark:hover:bg-hoverSecondaryBg text-white hover:text-white dark:border-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-semibold bg-btnBg dark:bg-btnBg hover:bg-hoverBtnBg dark:hover:bg-hoverBtnBg text-white dark:text-white hover:text-white border dark:border-white"
            onClick={() => router.push('/profile')}
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}