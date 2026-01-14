export type ViewState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type StrokePattern = 'solid' | 'dashed' | 'dotted';

export type DrawPoint = {
  x: number;
  y: number;
};

// Base interface for all element properties
export interface BaseElementProperty {
  rotate: number;
}

// Interface for elements that can be stroked
export interface StrokeableProperty extends BaseElementProperty {
  strokeStyle: string;
  lineWidth: number;
  strokePattern: StrokePattern;
}

// Interface for elements that can be filled
export interface FillableProperty {
  fillStyle: string;
}

export type PathProperty = StrokeableProperty & {
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
};

export interface DrawPath extends PathProperty {
  type: 'draw';
  x: number;
  y: number;
  points: DrawPoint[];
}

export type CircleProperty = StrokeableProperty & FillableProperty;

export interface DrawCircle extends CircleProperty {
  type: 'circle';
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

export type RectProperty = StrokeableProperty & FillableProperty;

export interface DrawRect extends RectProperty {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export type LineProperty = StrokeableProperty;

export interface DrawLine extends LineProperty {
  type: 'line';
  x: number;
  y: number;
  endX: number;
  endY: number;
}

export type ArrowProperty = StrokeableProperty & FillableProperty;

export interface DrawArrow extends ArrowProperty {
  type: 'arrow';
  x: number;
  y: number;
  endX: number;
  endY: number;
}

export type DrawArray = {
  type: 'array';
  x: number;
  y: number;
  value: string[];
  rotate: number;
};

export type TreeNode = {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;
};

export type DrawBinaryTree = {
  type: 'binary-tree';
  x: number;
  y: number;
  root: TreeNode;
  rotate: number;
};

export type DrawLinkedList = {
  type: 'linked-list';
  x: number;
  y: number;
  values: string[];
  rotate: number;
};

export type TextProperty = {
  fontSize: number;
  fontFamily: string;
  color: string;
  rotate: number;
};

export interface DrawText extends TextProperty {
  type: 'text';
  x: number;
  y: number;
  text: string;
}
export type PropertyKey =
  | 'strokeStyle'
  | 'fillStyle'
  | 'lineWidth'
  | 'strokePattern'
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'rotate'
  | 'lineCap'
  | 'lineJoin';

export type DrawElements =
  | DrawPath
  | DrawCircle
  | DrawRect
  | DrawLine
  | DrawArrow
  | DrawArray
  | DrawBinaryTree
  | DrawLinkedList
  | DrawText;

export type Tool =
  | 'move'
  | 'selection'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'draw'
  | 'line'
  | 'insert'
  | 'settings'
  | 'text';

export type BackgroundType = 'solid' | 'grid' | 'dots';
