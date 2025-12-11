import { ReactNode } from 'react';

interface TipCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function TipCard({ title, description, children, icon, className = '' }: TipCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="rounded-lg bg-zinc-100 p-2 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-xl leading-none font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
      </div>
      {children && (
        <div className="mt-2 w-full overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-950/50">
          {children}
        </div>
      )}
    </div>
  );
}
