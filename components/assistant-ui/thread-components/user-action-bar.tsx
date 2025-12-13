'use client';

import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';
import { ActionBarPrimitive } from '@assistant-ui/react';
import { PencilIcon } from 'lucide-react';
import { memo } from 'react';
import type { FC } from 'react';

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

export default memo(UserActionBar);
