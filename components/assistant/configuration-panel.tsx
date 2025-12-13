'use client';

import { useAppSelector } from '@/store/useState';
import { WorkflowSelector } from './workflow-selector';
import { ParameterInput } from './parameter-input';
import { Settings } from 'lucide-react';

export function ConfigurationPanel() {
  const { selectedWorkflow, workflows } = useAppSelector((state) => state.assistant);

  const selectedWorkflowData = workflows.find((w) => w.id === selectedWorkflow);

  return (
    <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center gap-2">
        <Settings size={20} className="text-zinc-700 dark:text-zinc-300" />
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Configuration
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Configure and execute workflows
          </h3>
          <WorkflowSelector />
        </div>

        {selectedWorkflowData && selectedWorkflowData.parameters.length > 0 && (
          <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Configure Parameters
            </h3>
            {selectedWorkflowData.parameters.map((param) => (
              <ParameterInput key={param.name} parameter={param} />
            ))}
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              These parameters will be available in your conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

