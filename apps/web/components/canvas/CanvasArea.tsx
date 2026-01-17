'use client';
import React, { Activity, useEffect, useRef, useState } from 'react';
import { cn } from '@algocanvas/ui/lib/utils';
import { CanvasEngine } from '@/canvas-engine';
import { useAppSelector } from '@/store/hooks';
import { resizeCanvas } from '@/lib/canvas/resizeCanvas';
import { CURSOR_MAP } from '@/lib/canvas/constant';
import { useCanvasKeyboardShortcuts } from '@/hooks/useCanvasKeyboardShortcuts';

import TreeDialog from './TreeDialog';
import InsertPanel from './InsertPanel';
import MainToolBar from './MainToolBar';
import ArrayDialog from './ArrayDialog';
import BottomToolBar from './BottomToolBar';
import CanvasTextArea from './CanvasTextArea';
import LinkedListDialog from './LinkedListDialog';

const CanvasArea = () => {
  const { tool } = useAppSelector((state) => state.canvas);
  const elementDefaults = useAppSelector((state) => state.elementProperty);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CanvasEngine | null>(null);

  const [zoom, setZoom] = useState(100);
  const [textDraft, setTextDraft] = useState<{
    id: string;
    x: number;
    y: number;
    content: string;
  } | null>(null);

  useCanvasKeyboardShortcuts({
    zoomIn: () => engineRef.current?.zoomBy(-1),
    zoomOut: () => engineRef.current?.zoomBy(1),
    resetZoom: () => engineRef.current?.resetZoom()
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    engineRef.current = new CanvasEngine(canvas);

    const handleResize = () => {
      resizeCanvas(canvas);
      engineRef.current?.render();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    setZoom(Math.round(engine.getView().scale * 100));

    const unsubscribe = engine.onViewChange((view) => {
      setZoom(Math.round(view.scale * 100));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    // Subscribe to engine store updates
    return engine.store.subscribe(() => {
      setTextDraft(engine.store.textDraft);
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    engineRef.current?.handleMouseDown(
      { x: e.clientX, y: e.clientY },
      tool,
      elementDefaults
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    engineRef.current?.handleMouseMove({ x: e.clientX, y: e.clientY }, tool);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    engineRef.current?.handleMouseUp({ x: e.clientX, y: e.clientY }, tool);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    engineRef.current?.handleOnWheel(
      { x: e.clientX, y: e.clientY },
      e.deltaY > 0 ? 1 : -1
    );
  };

  const handleOnClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    engineRef.current?.handleOnClick(
      { x: e.clientX, y: e.clientY },
      tool,
      elementDefaults
    );
  };

  return (
    <div className='relative h-full w-full overflow-hidden bg-gray-900'>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleOnClick}
        className={cn(
          'bg-brand-bg absolute top-0 left-0 h-full w-full',
          CURSOR_MAP[tool]
        )}
      />

      {textDraft && engineRef.current && (
        <CanvasTextArea
          engine={engineRef.current}
          textDraft={textDraft}
        />
      )}

      <MainToolBar />
      <BottomToolBar
        zoom={zoom}
        resetZoom={() => engineRef.current?.resetZoom()}
        zoomIn={() => engineRef.current?.zoomBy(-1)}
        zoomOut={() => engineRef.current?.zoomBy(1)}
        clearCanvas={() => engineRef.current?.clear()}
      />
      <Activity mode={tool === 'insert' ? 'visible' : 'hidden'}>
        <InsertPanel />
      </Activity>
      <ArrayDialog addArray={(values) => engineRef.current?.addArray(values)} />
      <TreeDialog addTree={(root) => engineRef.current?.addBinaryTree(root)} />
      <LinkedListDialog
        addLinkedList={(values) => engineRef.current?.addLinkedList(values)}
      />
    </div>
  );
};

export default CanvasArea;
