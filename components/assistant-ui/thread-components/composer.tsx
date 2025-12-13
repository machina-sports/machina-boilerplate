'use client';

import { ComposerAttachments } from '@/components/assistant-ui/attachment';
import { ComposerPrimitive } from '@assistant-ui/react';
import { memo } from 'react';
import type { FC } from 'react';
import ComposerAction from './composer-action';

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
      <ComposerPrimitive.AttachmentDropzone className="aui-composer-attachment-dropzone border-input has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-ring/20 data-[dragging=true]:border-ring data-[dragging=true]:bg-accent/50 flex w-full flex-col rounded-2xl border bg-gray-50 px-1 pt-2 transition-shadow outline-none has-[textarea:focus-visible]:ring-2 data-[dragging=true]:border-dashed">
        <ComposerAttachments />
        <ComposerPrimitive.Input
          placeholder="Send a message..."
          className="aui-composer-input placeholder:text-muted-foreground mb-1 max-h-32 min-h-14 w-full resize-none bg-transparent px-4 pt-2 pb-3 text-sm outline-none focus-visible:ring-0"
          rows={1}
          autoFocus
          aria-label="Message input"
        />
        <ComposerAction />
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
};

export default memo(Composer);
