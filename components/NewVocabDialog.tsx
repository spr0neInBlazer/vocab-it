import React from 'react';
import useVocabStore from '@/lib/store';
import useSound from 'use-sound';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { SOUND_VOLUME, errorSound, successSound } from '@/lib/globals';

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

type DialogProps = {
  vocabTitle: string,
  setVocabTitle: (title: string) => void,
  invalidInputMsg: string,
  setInvalidInputMsg: (msg: string) => void,
}

export default function NewVocabDialog({ vocabTitle, setVocabTitle, invalidInputMsg, setInvalidInputMsg }: DialogProps) {
  const vocabs = useVocabStore(state => state.vocabs);
  const addVocab = useVocabStore(state => state.addVocab);
  const { toast } = useToast();
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });

  function createVocab(e: React.SyntheticEvent) {
    e.preventDefault();
    setInvalidInputMsg('');
    setVocabTitle('');

    // if the title is empty or only consists of spaces
    if (vocabTitle.length === 0 || !/\S/.test(vocabTitle)) {
      setInvalidInputMsg('Title is required');
      if (soundOn) playError();
    } 
    // if there's an existing vocab with the entered title
    else if (vocabs?.find(v => v.title === vocabTitle)) {
      setInvalidInputMsg('A vocabulary with this title already exists');
      if (soundOn) playError();
    } else {
      addVocab(vocabTitle);
      toast({
        variant: 'default',
        description: "Vocabulary has been successfully created",
      });
      if (soundOn) playSuccess();
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>What do you want to call your new vocabulary?</DialogTitle>
      </DialogHeader>
      <div>
        <Label htmlFor="title">
          Title
        </Label>
        <form onSubmit={createVocab}>
          <Input id="title"
            className="my-2 dark:text-customText-dark border dark:bg-mainBg-dark"
            value={vocabTitle} 
            placeholder="Vocab title"
            onChange={(e) => setVocabTitle(e.target.value)}
          />
        </form>
        <p className="text-xs font-bold text-red-800">{invalidInputMsg}</p>
      </div>
      <DialogFooter>
        <Button type="button" onClick={createVocab}>Create</Button>
      </DialogFooter>
    </DialogContent>
  )
}