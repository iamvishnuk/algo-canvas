import { Tool } from '@workspace/types/canvas';
import {
  Circle,
  Hand,
  MousePointer2,
  Pencil,
  Slash,
  Square,
  Triangle,
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
    name: 'Triangle',
    icon: Triangle,
    keyboardShortCut: 'a',
    toolType: 'triangle',
    toolTipContent: 'Triangle A',
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
  triangle: 'cursor-triangle'
};
