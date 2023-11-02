import React from 'react';
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

export default function EndLessonDialog({ setEndLesson }: { setEndLesson: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-28 flex items-center justify-center rounded-lg py-2 font-semibold text-white bg-secondaryBg-light hover:bg-hoverSecondaryBg transition-colors">
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
  )
}