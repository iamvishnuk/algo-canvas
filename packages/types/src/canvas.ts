export type ViewState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type DrawPoint = {
  x: number;
  y: number;
};

export type DrawPath = {
  type: 'draw';
  points: DrawPoint[];
  color: string;
};

export type DrawCircle = {
  type: 'circle';
  centerX: number;
  centerY: number;
  radius: number;
  color: string;
};

export type DrawRect = {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DrawLine = {
  type: 'line';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type DrawArrow = {
  type: 'arrow';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type DrawElements =
  | DrawPath
  | DrawCircle
  | DrawRect
  | DrawLine
  | DrawArrow;

export type Tool =
  | 'move'
  | 'selection'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'draw'
  | 'line';

export type BackgroundType = 'solid' | 'grid' | 'dots';
