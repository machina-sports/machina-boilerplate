'use client';

import { useAppSelector } from '@/store/useState';
import { useAppDispatch } from '@/store/dispatch';
import { setWorkflowParameter } from '@/providers/assistant/reducer';
import type { WorkflowParameter } from '@/providers/assistant/types';

interface ParameterInputProps {
  parameter: WorkflowParameter;
}

export function ParameterInput({ parameter }: ParameterInputProps) {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.assistant.workflowParameters[parameter.name] || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setWorkflowParameter({
        key: parameter.name,
        value: e.target.value,
      })
    );
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={`param-${parameter.name}`}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {parameter.name}
        {parameter.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={`param-${parameter.name}`}
        type={parameter.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={handleChange}
        placeholder={`Enter ${parameter.name}...`}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
      />
      {parameter.description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {parameter.description}
        </p>
      )}
    </div>
  );
}

