import React from 'react'
import { usePreferencesStore } from '@/lib/preferencesStore';
import useSound from 'use-sound';
import { muteSound, unmuteSound } from '@/lib/globals';

import { MenubarMenu } from "@/components/ui/menubar";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { useStore } from 'zustand';

export default function SoundToggle() {
  const {soundOn, toggleSoundOn} = useStore(usePreferencesStore, (state) => state);
  const [playMute] = useSound(muteSound, { volume: 0.25 });
  const [playUnmute] = useSound(unmuteSound, { volume: 0.25 });

  function toggleSound() {
    soundOn ? playMute() : playUnmute();
    toggleSoundOn();
  }

  return (
    <MenubarMenu>
      <button
        className="p-1 rounded-md active:bg-transparent focus:bg-transparent dark:active:bg-transparent hover:cursor-pointer border-solid border-2 border-transparent hover:border-white transition-colors"
        aria-label="sound"
        onClick={toggleSound}>
        {soundOn ? (
          <HiSpeakerWave className="w-8 h-8 active:animate-wiggle text-white" />
        ) : (
          <HiSpeakerXMark className="w-8 h-8 active:animate-wiggle text-white" />
        )}
      </button>
    </MenubarMenu>
  )
}