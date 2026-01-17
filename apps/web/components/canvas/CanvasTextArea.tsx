import React from 'react';
import { CanvasEngine } from '@/canvas-engine';
import { useAppSelector } from '@/store/hooks';

type CanvasTextAreaProps = {
  engine: CanvasEngine;
  textDraft: {
    id: string;
    x: number;
    y: number;
    content: string;
  };
};

const CanvasTextArea = ({ engine, textDraft }: CanvasTextAreaProps) => {
  const elementDefaults = useAppSelector((state) => state.elementProperty);

  if (!textDraft) return null;

  return (
    <textarea
      autoFocus
      value={textDraft.content}
      onChange={(e) => engine.updateTextDraft(e.target.value)}
      onBlur={() => engine.commitTextDraft(elementDefaults)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          engine.cancelTextDraft();
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          engine.commitTextDraft(elementDefaults);
        }
      }}
      className='absolute resize-none bg-transparent outline-none'
      style={{
        left: textDraft.x * engine.getView().scale + engine.getView().offsetX,
        top: textDraft.y * engine.getView().scale + engine.getView().offsetY,
        fontSize: elementDefaults.text.fontSize * engine.getView().scale,
        fontFamily: elementDefaults.text.fontFamily,
        color: elementDefaults.text.color
      }}
    />
  );
};

export default CanvasTextArea;
