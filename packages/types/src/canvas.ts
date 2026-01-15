/* =========================
   Core Shared Types
========================= */

export interface Identifiable {
  id: string;
}

export type ViewState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type StrokePattern = 'solid' | 'dashed' | 'dotted';

export type Point = {
  x: number;
  y: number;
};

/* =========================
   Base Element Properties
========================= */

export interface BaseElementProps {
  rotate: number;
}

export interface StrokeableProps extends BaseElementProps {
  strokeStyle: string;
  lineWidth: number;
  strokePattern: StrokePattern;
}

export interface FillableProps {
  fillStyle: string;
}

export type PathProps = StrokeableProps & {
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
};

export interface TextProps {
  fontSize: number;
  fontFamily: string;
  color: string;
  rotate: number;
}

/* =========================
   Canvas Elements
========================= */

export interface PathElement extends PathProps, Identifiable {
  type: 'draw';
  x: number;
  y: number;
  points: Point[];
}

export interface CircleElement
  extends StrokeableProps, FillableProps, Identifiable {
  type: 'circle';
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

export interface RectElement
  extends StrokeableProps, FillableProps, Identifiable {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LineElement extends StrokeableProps, Identifiable {
  type: 'line';
  x: number;
  y: number;
  endX: number;
  endY: number;
}

export interface ArrowElement
  extends StrokeableProps, FillableProps, Identifiable {
  type: 'arrow';
  x: number;
  y: number;
  endX: number;
  endY: number;
}

export interface ArrayElement extends Identifiable {
  type: 'array';
  x: number;
  y: number;
  value: string[];
  rotate: number;
}

/* =========================
   Tree / List Structures
========================= */

export type TreeNode = {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;
};

export interface BinaryTreeElement extends Identifiable {
  type: 'binary-tree';
  x: number;
  y: number;
  root: TreeNode;
  rotate: number;
}

export interface LinkedListElement extends Identifiable {
  type: 'linked-list';
  x: number;
  y: number;
  values: string[];
  rotate: number;
}

export interface TextElement extends TextProps, Identifiable {
  type: 'text';
  x: number;
  y: number;
  text: string;
}

/* =========================
   Union Type (IMPORTANT)
========================= */

export type CanvasElement =
  | PathElement
  | CircleElement
  | RectElement
  | LineElement
  | ArrowElement
  | ArrayElement
  | BinaryTreeElement
  | LinkedListElement
  | TextElement;

/* =========================
   Editor / UI Types
========================= */

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
