"use client";
import * as React from "react";
import { ToastProps } from "@/components/ui/toast";

type ToastState = ToastProps & { id: string; title?: React.ReactNode; description?: React.ReactNode };

const toastState: { toasts: ToastState[]; listeners: Array<(toasts: ToastState[]) => void> } = {
  toasts: [],
  listeners: [],
};

function dispatch(toast: ToastState) {
  toastState.toasts = [toast, ...toastState.toasts].slice(0, 3);
  toastState.listeners.forEach((l) => l(toastState.toasts));
  setTimeout(() => {
    toastState.toasts = toastState.toasts.filter((t) => t.id !== toast.id);
    toastState.listeners.forEach((l) => l(toastState.toasts));
  }, 4000);
}

export function toast(props: Omit<ToastState, "id">) {
  dispatch({ ...props, id: Math.random().toString(36).slice(2) });
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>(toastState.toasts);
  React.useEffect(() => {
    toastState.listeners.push(setToasts);
    return () => { toastState.listeners = toastState.listeners.filter((l) => l !== setToasts); };
  }, []);
  return { toasts, toast };
}
