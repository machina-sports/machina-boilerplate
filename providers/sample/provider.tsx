"use client";

import { useEffect, type ReactNode } from "react";
import { useAppDispatch } from "@/store/dispatch";
import { useAppSelector } from "@/store/useState";
import { loadWelcome } from "@/providers/sample/actions";

export function SampleProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { status, loaded } = useAppSelector((state) => state.sample);

  useEffect(() => {
    if (!loaded && status === "idle") {
      dispatch(loadWelcome());
    }
  }, [dispatch, loaded, status]);

  return children;
}

