import React from 'react';
import { CanvasEngine } from '@/canvas-engine';
import { useAppSelector } from '@/store/hooks';
import { measureTextWidth } from '@/canvas-engine/utils/text';

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
  const { scale, offsetX, offsetY } = engine.getView();

  if (!textDraft) return null;

  const fontSize = elementDefaults.text.fontSize * scale;
  const lineHeight = fontSize * 1.2;

  // 🔹 Width = longest line only
  const longestLine =
    textDraft.content
      .split('\n')
      .reduce((a, b) => (a.length > b.length ? a : b)) || ' ';

  const width =
    measureTextWidth(
      longestLine,
      elementDefaults.text.fontSize,
      elementDefaults.text.fontFamily
    ) *
      scale +
    4;

  // 🔹 Height = number of lines
  const lineCount = textDraft.content.split('\n').length;
  const height = Math.max(lineHeight, lineCount * lineHeight);

  return (
    <textarea
      autoFocus
      wrap='off'
      value={textDraft.content}
      onChange={(e) => engine.updateTextDraft(e.target.value)}
      onBlur={() => engine.commitTextDraft(elementDefaults)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') engine.cancelTextDraft();
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          engine.commitTextDraft(elementDefaults);
        }
      }}
      className='absolute resize-none bg-transparent outline-none'
      style={{
        left: textDraft.x * scale + offsetX,
        top: textDraft.y * scale + offsetY,
        width,
        height,
        fontSize,
        fontFamily: elementDefaults.text.fontFamily,
        color: elementDefaults.text.color,
        lineHeight: 1.2,
        whiteSpace: 'pre',
        overflow: 'hidden'
      }}
    />
  );
};

export default CanvasTextArea;
