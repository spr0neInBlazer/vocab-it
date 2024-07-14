import React from 'react';
import { Answer, Word } from '@/lib/types';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ResultProps = {
  allAnswers: Answer[],
  words: Word[],
}

export default function LessonResult({allAnswers, words}: ResultProps) {
  const wrongAnswers: Answer[] = allAnswers.filter(a => !a.isCorrect);
  const answeredCorrectly: number = allAnswers.length - wrongAnswers.length;

  const successPercentage: number = Math.round((answeredCorrectly / words.length) * 100);

  return (
    <section className="w-full p-4 sm:p-8 rounded-xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight text-center shadow-2xl">
      <h1 className="text-3xl mobile:text-3xl">Lesson Complete</h1>
      <h2 className="text-xl mobile:text-2xl text-center my-3">You&#39;ve correctly translated</h2>
      <p className="text-2xl">
        <span 
          className={`${successPercentage > 33 ? successPercentage > 67 ? 'text-green-600' : 'text-orange-500' : 'text-red-500'} font-semibold`}
        >
          {answeredCorrectly}/{words.length}
        </span> words
      </p>
      {wrongAnswers.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">View mistakes</AccordionTrigger>
            <AccordionContent>
              <Table className="text-lg">
                <TableHeader>
                  <TableRow className="text-sm mobile:text-base">
                    <TableHead className="w-[100px] px-2 mobile:px-4">Word</TableHead>
                    <TableHead className="px-2 mobile:px-4">Your Translation</TableHead>
                    <TableHead className=" px-2 mobile:px-4">Correct Translation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="italic">
                {wrongAnswers.map(a => {
                  return (
                    <TableRow key={a.word} className="text-sm mobile:text-base text-left">
                      <TableCell className="font-medium px-2 mobile:px-4">{a.word}</TableCell>
                      <TableCell className="text-red-500 dark:text-red-300 px-2 mobile:px-4">{a.userAnswer}</TableCell>
                      <TableCell className="text-green-600 dark:text-green-300 px-2 mobile:px-4">{a.correctAnswer}</TableCell>
                    </TableRow>
                  )
                })}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>      
      )} 
    </section>
  )
}