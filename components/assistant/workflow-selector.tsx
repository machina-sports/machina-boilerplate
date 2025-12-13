'use client';

import { useAppSelector } from '@/store/useState';
import { useAppDispatch } from '@/store/dispatch';
import { setSelectedWorkflow } from '@/providers/assistant/reducer';

export function WorkflowSelector() {
  const dispatch = useAppDispatch();
  const { workflows, selectedWorkflow, status } = useAppSelector((state) => state.assistant);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedWorkflow(e.target.value));
  };

  if (status === 'loading') {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Loading workflows...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="workflow-select"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Select a Workflow
      </label>
      <select
        id="workflow-select"
        value={selectedWorkflow || ''}
        onChange={handleChange}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      >
        <option value="">Choose a workflow...</option>
        {workflows.map((workflow) => (
          <option key={workflow.id} value={workflow.id}>
            {workflow.name}
          </option>
        ))}
      </select>
      {selectedWorkflow && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {workflows.find((w) => w.id === selectedWorkflow)?.description}
        </p>
      )}
    </div>
  );
}

