import { Tool } from '@workspace/types/canvas';
import {
  Brackets,
  CaseSensitive,
  Circle,
  Hand,
  MousePointer2,
  MoveUpRight,
  Network,
  Pencil,
  Slash,
  Square,
  Workflow,
  type LucideIcon
} from 'lucide-react';

export interface ITool {
  name: string;
  icon: LucideIcon;
  keyboardShortCut: string;
  toolTipContent: string;
  toolTipDelayDuration: number;
  toolType: Tool;
  toolTipSide: 'left' | 'right' | 'bottom' | 'top';
}

export type DSAElement = 'array' | 'linked-list' | 'binary-tree';

export interface IDSAElements {
  name: string;
  value: DSAElement;
  icon: LucideIcon;
}

export const MAIN_TOOLS: ITool[] = [
  {
    name: 'Move',
    icon: Hand,
    keyboardShortCut: 'm',
    toolType: 'move',
    toolTipContent: 'Move M',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  },
  {
    name: 'Selection',
    icon: MousePointer2,
    keyboardShortCut: 'v',
    toolType: 'selection',
    toolTipContent: 'Selection V',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  },
  {
    name: 'Rectangle',
    icon: Square,
    keyboardShortCut: 'r',
    toolType: 'rectangle',
    toolTipContent: 'Rectangle R',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  },
  {
    name: 'Circle/Ellipse',
    icon: Circle,
    keyboardShortCut: 'o',
    toolType: 'circle',
    toolTipContent: 'Circle/Ellipse O',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  },
  {
    name: 'Arrow',
    icon: MoveUpRight,
    keyboardShortCut: 'a',
    toolType: 'arrow',
    toolTipContent: 'Arrow A',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  },
  {
    name: 'Draw',
    icon: Pencil,
    keyboardShortCut: 'd',
    toolType: 'draw',
    toolTipContent: 'Draw D',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  },
  {
    name: 'Text',
    icon: CaseSensitive,
    keyboardShortCut: 't',
    toolType: 'text',
    toolTipContent: 'Text T',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  },
  {
    name: 'Line',
    icon: Slash,
    keyboardShortCut: 'l',
    toolType: 'line',
    toolTipContent: 'Line L',
    toolTipDelayDuration: 1000,
    toolTipSide: 'left'
  }
];

export const CURSOR_MAP: Record<Tool, string> = {
  move: 'cursor-grab',
  draw: 'cursor-pencil',
  circle: 'cursor-circle',
  line: 'cursor-line',
  rectangle: 'cursor-rectangle',
  selection: '',
  arrow: '',
  insert: '',
  settings: '',
  text: ''
};

export const DSA_ELEMENTS: IDSAElements[] = [
  {
    name: 'Array',
    value: 'array',
    icon: Brackets
  },
  {
    name: 'Linked List',
    value: 'linked-list',
    icon: Workflow
  },
  {
    name: 'Tree',
    value: 'binary-tree',
    icon: Network
  }
];
