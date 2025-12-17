'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { setMessage, clearMessage } from '@/providers/sample/reducer';
import { useAppDispatch } from '@/store/dispatch';
import { useAppSelector } from '@/store/useState';

import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.sample.message);
  const [value, setValue] = useState(message);

  // Keep the input in sync with the global state so reset always reflects Redux.
  useEffect(() => {
    setValue(message);
  }, [message]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-zinc-100 px-6 py-16 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="flex flex-col items-center gap-4 text-center sm:max-w-3xl sm:text-left">
        <Image
          src="/machina-logo-dark.svg"
          alt="Machina Sports logo"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="h-12 w-auto md:h-16"
        />
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-xs tracking-[0.2em] text-[#ff6d00] uppercase dark:text-zinc-400">
              Machina Boilerplate
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#ff6d00] sm:text-4xl">
              Next.js 16 + Redux Toolkit + Tailwind 4
            </h1>
          </div>
        </div>
        <p className="max-w-[620px] text-left text-lg text-zinc-600 dark:text-zinc-300">
          Use this page to validate the Redux store and provider chain before adding real domains,
          containers, and services.
        </p>
      </div>

      <section className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-200">
            Message in global state
          </label>
          <input
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 transition outline-none focus:border-zinc-400 sm:text-base dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-50"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-800 sm:flex-row sm:items-center sm:justify-between sm:gap-0 dark:bg-zinc-800 dark:text-zinc-100">
          <span className="text-xs sm:text-sm">Current state:</span>
          <span className="font-semibold break-words sm:truncate sm:text-sm">{message}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            type="button"
            onClick={() => dispatch(setMessage(value || 'Hello, Machina!'))}
          >
            Update message (Redux)
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              console.log('Resetting input to:', message);
              setValue(message);
            }}
          >
            Reset input
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              dispatch(clearMessage());
              // useEffect will sync the input value automatically
            }}
          >
            Clear state
          </Button>
        </div>
      </section>

      <div className="mt-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="size-4" /> Back to Home
        </Link>
      </div>
    </main>
  );
}
