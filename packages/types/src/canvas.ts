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
  x: number;
  y: number;
  points: DrawPoint[];
  color: string;
  rotate: number;
};

export type DrawCircle = {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  color: string;
  rotate: number;
};

export type DrawRect = {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

export type DrawLine = {
  type: 'line';
  x: number;
  y: number;
  endX: number;
  endY: number;
  rotate: number;
};

export type DrawArrow = {
  type: 'arrow';
  x: number;
  y: number;
  endX: number;
  endY: number;
  rotate: number;
};

export type DrawArray = {
  type: 'array';
  x: number;
  y: number;
  value: string[];
  rotate: number;
};

export type TreeNode = {
  value: string;
  left?: TreeNode;
  right?: TreeNode;
  rotate: number;
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

export type DrawElements =
  | DrawPath
  | DrawCircle
  | DrawRect
  | DrawLine
  | DrawArrow
  | DrawArray
  | DrawBinaryTree
  | DrawLinkedList;

export type Tool =
  | 'move'
  | 'selection'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'draw'
  | 'line'
  | 'insert'
  | 'settings';

export type BackgroundType = 'solid' | 'grid' | 'dots';
