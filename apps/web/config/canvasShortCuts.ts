export const CANVAS_SHORTCUTS = {
  ZOOM_IN: { key: ['+', '='], ctrl: true },
  ZOOM_OUT: { key: '-', ctrl: true },
  RESET_VIEW: { key: '0', ctrl: true },
  DELETE: { key: 'Delete' },
  ESCAPE: { key: 'Escape' },
  UNDO: { key: 'z', ctrl: true },
  REDO: { key: 'z', ctrl: true, shift: true },
  SELECT_ALL: { key: 'a', ctrl: true },
  COPY: { key: 'c', ctrl: true },
  PASTE: { key: 'v', ctrl: true }
} as const;
