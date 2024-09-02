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
import { BASE_URL, errorSound, INITIAL_NUMBER, SOUND_VOLUME, successSound } from '@/lib/globals';
import { useToast } from './ui/use-toast';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import useSound from 'use-sound';
import { useAuthStore } from '@/lib/authStore';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import useVocabStore from '@/lib/store';
import useLessonStore from '@/lib/lessonStore';

export default function DangerZone() {
  const {toast} = useToast();
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });
  const fetchWithAuth = useAuth();
  const {setAccessToken} = useAuthStore(state => state);
  const {setVocabs} = useVocabStore();
  const {updateVolume} = useLessonStore();
  const {setStoredUsername, updateLessonVolume} = usePreferencesStore();
  const router = useRouter();

  async function handleAccountDelete() {
    const controller = new AbortController();
    const privateDelete = async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/profile/deleteAccount`, {
          method: 'DELETE',
          signal: controller.signal,
          credentials: 'include'
        });

        if (!res.ok) {
          toast({
            variant: 'destructive',
            description: "Could not delete account",
          });
          if (soundOn) playError();
          throw new Error('Failed to delete account');
        }

        // set to default settings
        setAccessToken('');
        setVocabs([]);
        updateVolume(INITIAL_NUMBER);
        updateLessonVolume(INITIAL_NUMBER);
        setStoredUsername('');
        
        toast({
          variant: 'default',
          description: "Your account has been deleted",
        });
        if (soundOn) playSuccess();
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    }

    privateDelete();

    return () => {
      controller.abort();
    }
  }

  return (
    <section>
      <h2 className='text-xl mobile:text-2xl md:text-3xl font-bold dark:text-customText-dark mb-4'>Danger Account</h2>

      <AlertDialog>
        <AlertDialogTrigger className="rounded-full bg-white mobile:bg-secondaryBg-light mobile:hover:bg-secondaryBg-light/80 mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded" aria-label="delete account">
          <p className="hidden mobile:inline">Delete your account</p>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccountDelete}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
