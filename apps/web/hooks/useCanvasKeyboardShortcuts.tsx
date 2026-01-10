/* eslint-disable react-hooks/exhaustive-deps */
import {
  changeTool,
  handleZoom,
  removeElements,
  resetView,
  undo,
  redo
} from '@/features/canvas/canvasSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
  action: () => void;
  description: string;
}

export const useCanvasKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: '=',
      modifiers: { ctrl: true },
      action: () => dispatch(handleZoom({ delta: -0.1 })),
      description: 'Zoom in'
    },
    {
      key: '+',
      modifiers: { ctrl: true },
      action: () => dispatch(handleZoom({ delta: -0.1 })),
      description: 'Zoom in'
    },
    {
      key: '-',
      modifiers: { ctrl: true },
      action: () => dispatch(handleZoom({ delta: 0.1 })),
      description: 'Zoom out'
    },
    {
      key: '0',
      modifiers: { ctrl: true },
      action: () => dispatch(resetView()),
      description: 'Reset view'
    },
    {
      key: 'm',
      action: () => dispatch(changeTool({ tool: 'move' })),
      description: 'Move'
    },
    {
      key: 'v',
      action: () => dispatch(changeTool({ tool: 'selection' })),
      description: 'Selection'
    },
    {
      key: 'Escape',
      action: () => dispatch(changeTool({ tool: 'selection' })),
      description: 'Selection'
    },

    {
      key: 'r',
      action: () => dispatch(changeTool({ tool: 'rectangle' })),
      description: 'Rectangle'
    },
    {
      key: 'o',
      action: () => dispatch(changeTool({ tool: 'circle' })),
      description: 'Circle/Ellipse'
    },
    {
      key: 'a',
      action: () => dispatch(changeTool({ tool: 'arrow' })),
      description: 'Arrow'
    },
    {
      key: 'd',
      action: () => dispatch(changeTool({ tool: 'draw' })),
      description: 'Draw'
    },
    {
      key: 'l',
      action: () => dispatch(changeTool({ tool: 'line' })),
      description: 'Line'
    },
    {
      key: 'i',
      action: () => dispatch(changeTool({ tool: 'insert' })),
      description: 'Insert'
    },
    {
      key: 's',
      action: () => dispatch(changeTool({ tool: 'settings' })),
      description: 'Insert'
    },
    {
      key: 'z',
      modifiers: { ctrl: true },
      action: () => dispatch(undo()),
      description: 'Undo'
    },
    {
      key: 'z',
      modifiers: { ctrl: true, shift: true },
      action: () => dispatch(redo()),
      description: 'Redo'
    },
    {
      key: 'Delete',
      action: () => dispatch(removeElements()),
      description: 'Remove element'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable) &&
        e.key !== 'Escape'
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        // Check if all required modifiers match
        const ctrlMatch = !shortcut.modifiers?.ctrl || e.ctrlKey || e.metaKey;
        const shiftMatch = !shortcut.modifiers?.shift || e.shiftKey;
        const altMatch = !shortcut.modifiers?.alt || e.altKey;

        // Check if no extra modifiers are pressed when not required
        const noExtraCtrl =
          shortcut.modifiers?.ctrl || !(e.ctrlKey || e.metaKey);
        const noExtraShift = shortcut.modifiers?.shift || !e.shiftKey;
        const noExtraAlt = shortcut.modifiers?.alt || !e.altKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch &&
          noExtraCtrl &&
          noExtraShift &&
          noExtraAlt
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return { shortcuts };
};
