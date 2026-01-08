'use client';
import React, { useRef, useEffect, useState, Activity } from 'react';
import { DrawArrow, DrawLine, DrawPoint, DrawRect } from '@workspace/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import BottomToolBar from './BottomToolBar';
import {
  addElements,
  handleZoom,
  setCanvasSize,
  updateOffSet
} from '@/features/canvas/canvasSlice';
import { useCanvasKeyboardShortcuts } from '@/hooks/useCanvasKeyboardShortcuts';
import MainToolBar from './MainToolBar';

import { cn } from '@workspace/ui/lib/utils';
import CanvasBackground from './CanvasBackground';
import { screenToWorld } from '@/lib/canvas/coordinates';
import {
  distanceFromPointToLineSegment,
  isCursorOnArray,
  isCursorOnLinkedList,
  isCursorOnTree,
  isElementInSelectionArea,
  isPointNearPath,
  isPointNearRectangle
} from '@/lib/canvas/geometry';
import { CURSOR_MAP } from '@/lib/canvas/constant';
import { drawGrid } from '@/lib/canvas/rendering/drawGrid';
import { drawElements } from '@/lib/canvas/rendering/drawElements';
import { drawElementsPreview } from '@/lib/canvas/rendering/drawElementsPreview';
import { drawSelectionBox } from '@/lib/canvas/rendering/drawSelectionBox';
import InsertPanel from './InsertPanel';
import ArrayDialog from './ArrayDialog';
import TreeDialog from './TreeDialog';
import LinkedListDialog from './LinkedListDialog';

const CanvasArea = () => {
  const dispatch = useAppDispatch();
  const { view, tool, elements } = useAppSelector((state) => state.canvas);

  useCanvasKeyboardShortcuts();

  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawPoint[]>([]);
  const [cursorOnElement, setCursorOnElement] = useState<boolean>(false);
  const [selecteElementIndex, setSelectedElementIndex] = useState<
    number | null
  >(null);
  const [selectedElementsIndices, setSelectedElementsIndices] = useState<
    number[]
  >([]);

  // Area Selecting states
  const [isAreaSelecting, setIsAreasSelecting] = useState<boolean>(false);
  const [areaSelectionStart, setAreaSelectionStart] =
    useState<DrawPoint | null>(null);
  const [areaSelectionEnd, setAreaSelectionEnd] = useState<DrawPoint | null>(
    null
  );

  const [circleStart, setCircleStart] = useState<DrawPoint | null>(null);
  const [currentCircle, setCurrentCircle] = useState<{
    center: DrawPoint;
    radius: number;
  } | null>(null);

  const [rectStart, setRectStart] = useState<DrawPoint | null>(null);
  const [currentRect, setCurrentRect] = useState<Omit<DrawRect, 'type'> | null>(
    null
  );

  const [lineStart, setLineStart] = useState<DrawPoint | null>(null);
  const [currentLine, setCurrentLine] = useState<Omit<DrawLine, 'type'> | null>(
    null
  );

  // Drawing Arrows
  const [arrowStart, setArrowStart] = useState<DrawPoint | null>(null);
  const [currentArrow, setCurrentArrow] = useState<Omit<
    DrawArrow,
    'type'
  > | null>(null);

  const redrawCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { scale, offsetX, offsetY } = view;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw all saved objects
    drawElements(ctx, elements, scale);

    // Draw preview
    drawElementsPreview(
      ctx,
      scale,
      currentPath,
      currentCircle,
      currentRect,
      currentLine,
      currentArrow
    );

    // Draw Selection Box
    if (tool === 'selection') {
      drawSelectionBox(
        ctx,
        selecteElementIndex,
        elements,
        view,
        selectedElementsIndices,
        isAreaSelecting,
        areaSelectionStart,
        areaSelectionEnd
      );
    }

    ctx.restore();
  };

  const resizeCanvas = () => {
    const bgCanvas = bgCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!bgCanvas || !drawCanvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    bgCanvas.width = width;
    bgCanvas.height = height;
    drawCanvas.width = width;
    drawCanvas.height = height;

    dispatch(setCanvasSize({ width, height }));

    drawGrid(bgCanvasRef, view);
    redrawCanvas();
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [
    elements,
    view,
    tool,
    currentPath,
    currentCircle,
    currentRect,
    currentLine,
    currentArrow,
    selecteElementIndex,
    selectedElementsIndices,
    isAreaSelecting,
    areaSelectionStart,
    areaSelectionEnd
  ]);

  useEffect(() => {
    drawGrid(bgCanvasRef, view);
  }, [view]);

  useEffect(() => {
    redrawCanvas();
  }, [
    view,
    elements,
    currentPath,
    currentCircle,
    currentRect,
    currentLine,
    selecteElementIndex,
    selectedElementsIndices,
    isAreaSelecting,
    areaSelectionStart,
    areaSelectionEnd,
    currentArrow
  ]);

  useEffect(() => {
    setSelectedElementIndex(null);
    setSelectedElementsIndices([]);
    setIsAreasSelecting(false);
    setAreaSelectionStart(null);
    setAreaSelectionEnd(null);
  }, [tool]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    dispatch(handleZoom({ delta }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);
    if (tool === 'move') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - view.offsetX,
        y: e.clientY - view.offsetY
      });
    } else if (tool === 'draw') {
      setIsDrawing(true);
      setCurrentPath([worldPos]);
    } else if (tool === 'circle') {
      setIsDrawing(true);
      setCircleStart(worldPos);
      setCurrentCircle({ center: worldPos, radius: 0 });
    } else if (tool === 'rectangle') {
      setIsDrawing(true);
      setRectStart(worldPos);
      setCurrentRect({ x: worldPos.x, y: worldPos.y, width: 0, height: 0 });
    } else if (tool === 'line') {
      setIsDrawing(true);
      setLineStart(worldPos);
      setCurrentLine({
        startX: worldPos.x,
        startY: worldPos.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    } else if (tool === 'arrow') {
      setIsDrawing(true);
      setArrowStart(worldPos);
    } else if (tool === 'selection') {
      const HIT_TOLERANCE = 6 / view.scale;
      let clickedOnElement = false;

      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        let isHit = false;

        if (element) {
          if (element.type === 'draw') {
            isHit = isPointNearPath(worldPos, element.points, HIT_TOLERANCE);
          } else if (element.type === 'rectangle') {
            isHit = isPointNearRectangle(worldPos, element, HIT_TOLERANCE);
          } else if (element.type === 'circle') {
            const distanceFromCenter = Math.hypot(
              worldPos.x - element.centerX,
              worldPos.y - element.centerY
            );
            isHit =
              Math.abs(distanceFromCenter - element.radius) <= HIT_TOLERANCE;
          } else if (element.type === 'line') {
            const distance = distanceFromPointToLineSegment(
              worldPos,
              { x: element.startX, y: element.startY },
              { x: element.endX, y: element.endY }
            );
            isHit = distance <= HIT_TOLERANCE;
          }

          if (isHit) {
            clickedOnElement = true;
            break;
          }
        }
      }

      // If not clicking on an element, start area selection
      if (!clickedOnElement) {
        setIsAreasSelecting(true);
        setAreaSelectionStart(worldPos);
        setAreaSelectionEnd(worldPos);
        setSelectedElementIndex(null);
        setSelectedElementsIndices([]);
      }
    }
  };

  const handleSelectionHover = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);
    const HIT_TOLERANCE = 6 / view.scale;

    let isCursorOnElement = false;

    for (const element of elements) {
      if (element.type === 'draw') {
        if (isPointNearPath(worldPos, element.points, HIT_TOLERANCE)) {
          isCursorOnElement = true;
          break;
        }
      }
      if (element.type === 'rectangle') {
        if (isPointNearRectangle(worldPos, element, HIT_TOLERANCE)) {
          isCursorOnElement = true;
          break;
        }
      }
      if (element.type === 'circle') {
        const distanceFromCenter = Math.hypot(
          worldPos.x - element.centerX,
          worldPos.y - element.centerY
        );

        if (Math.abs(distanceFromCenter - element.radius) <= HIT_TOLERANCE) {
          isCursorOnElement = true;
          break;
        }
      }
      if (element.type === 'line') {
        const distance = distanceFromPointToLineSegment(
          worldPos,
          { x: element.startX, y: element.startY },
          { x: element.endX, y: element.endY }
        );

        if (distance <= HIT_TOLERANCE) {
          isCursorOnElement = true;
          break;
        }
      }
      if (element.type === 'arrow') {
        const distance = distanceFromPointToLineSegment(
          worldPos,
          { x: element.startX, y: element.startY },
          { x: element.endX, y: element.endY }
        );

        if (distance <= HIT_TOLERANCE) {
          isCursorOnElement = true;
          break;
        }
      }
    }
    setCursorOnElement(isCursorOnElement);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);
    if (isDragging) {
      dispatch(
        updateOffSet({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
      );
    } else if (isDrawing && tool === 'draw') {
      setCurrentPath((prev) => [...prev, worldPos]);
    } else if (isDrawing && tool === 'circle' && circleStart) {
      const dx = worldPos.x - circleStart.x;
      const dy = worldPos.y - circleStart.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setCurrentCircle({ center: circleStart, radius });
    } else if (isDrawing && tool === 'rectangle' && rectStart) {
      const width = worldPos.x - rectStart.x;
      const height = worldPos.y - rectStart.y;
      setCurrentRect({ x: rectStart.x, y: rectStart.y, width, height });
    } else if (isDrawing && tool === 'line' && lineStart) {
      setCurrentLine({
        startX: lineStart.x,
        startY: lineStart.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    } else if (tool === 'arrow' && arrowStart) {
      setCurrentArrow({
        startX: arrowStart.x,
        startY: arrowStart.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    } else if (tool === 'selection' && isAreaSelecting && areaSelectionStart) {
      setAreaSelectionEnd(worldPos);
    } else if (tool === 'selection') {
      handleSelectionHover(e);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && tool === 'draw' && currentPath.length > 0) {
      dispatch(
        addElements({
          element: { type: 'draw', points: currentPath, color: '#7A3EFF' }
        })
      );
      setCurrentPath([]);
    } else if (
      isDrawing &&
      tool === 'circle' &&
      currentCircle &&
      currentCircle.radius > 0
    ) {
      dispatch(
        addElements({
          element: {
            type: 'circle',
            centerX: currentCircle.center.x,
            centerY: currentCircle.center.y,
            radius: currentCircle.radius,
            color: '#7A3EFF'
          }
        })
      );
      setCurrentCircle(null);
      setCircleStart(null);
    } else if (isDrawing && tool === 'rectangle' && currentRect) {
      dispatch(
        addElements({
          element: {
            type: 'rectangle',
            x: currentRect.x,
            y: currentRect.y,
            width: currentRect.width,
            height: currentRect.height
          }
        })
      );
      setCurrentRect(null);
      setRectStart(null);
    } else if (isDrawing && tool === 'line' && currentLine) {
      dispatch(
        addElements({
          element: {
            type: 'line',
            startX: currentLine.startX,
            startY: currentLine.startY,
            endX: currentLine.endX,
            endY: currentLine.endY
          }
        })
      );
      setCurrentLine(null);
      setLineStart(null);
    } else if (isDrawing && tool === 'arrow' && currentArrow) {
      dispatch(
        addElements({
          element: {
            type: 'arrow',
            startX: currentArrow.startX,
            startY: currentArrow.startY,
            endX: currentArrow.endX,
            endY: currentArrow.endY
          }
        })
      );

      setArrowStart(null);
      setCurrentArrow(null);
    } else if (isAreaSelecting && areaSelectionEnd && areaSelectionStart) {
      const minX = Math.min(areaSelectionStart.x, areaSelectionEnd.x);
      const minY = Math.min(areaSelectionStart.y, areaSelectionEnd.y);
      const maxX = Math.max(areaSelectionStart.x, areaSelectionEnd.x);
      const maxY = Math.max(areaSelectionStart.y, areaSelectionEnd.y);

      const selectionArea = { minX, minY, maxX, maxY };

      const selectedIndecies: number[] = [];

      elements.forEach((element, index) => {
        if (isElementInSelectionArea(element, selectionArea)) {
          selectedIndecies.push(index);
        }
      });

      setSelectedElementsIndices(selectedIndecies);
      setIsAreasSelecting(false);
      setAreaSelectionStart(null);
      setAreaSelectionEnd(null);
    }
    setIsDragging(false);
    setIsDrawing(false);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    if (tool !== 'selection') return;

    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);

    const HIT_TOLERANCE = 6 / view.scale;

    // Check elements in reverse order (top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      let isHit = false;

      if (element) {
        if (element.type === 'draw') {
          isHit = isPointNearPath(worldPos, element.points, HIT_TOLERANCE);
        } else if (element.type === 'rectangle') {
          isHit = isPointNearRectangle(worldPos, element, HIT_TOLERANCE);
        } else if (element.type === 'circle') {
          const distanceFromCenter = Math.hypot(
            worldPos.x - element.centerX,
            worldPos.y - element.centerY
          );
          isHit =
            Math.abs(distanceFromCenter - element.radius) <= HIT_TOLERANCE;
        } else if (element.type === 'line') {
          const distance = distanceFromPointToLineSegment(
            worldPos,
            { x: element.startX, y: element.startY },
            { x: element.endX, y: element.endY }
          );
          isHit = distance <= HIT_TOLERANCE;
        } else if (element.type === 'arrow') {
          const distance = distanceFromPointToLineSegment(
            worldPos,
            { x: element.startX, y: element.startY },
            { x: element.endX, y: element.endY }
          );
          isHit = distance <= HIT_TOLERANCE;
        } else if (element.type === 'array') {
          isHit = isCursorOnArray(
            worldPos,
            element.x,
            element.y,
            element.value.length,
            HIT_TOLERANCE
          );
        } else if (element.type === 'linked-list') {
          isHit = isCursorOnLinkedList(
            worldPos,
            element.x,
            element.y,
            element.values.length,
            HIT_TOLERANCE
          );
        } else if (element.type === 'binary-tree') {
          isHit = isCursorOnTree(
            worldPos,
            element.x,
            element.y,
            element.root,
            HIT_TOLERANCE
          );
        }
      }

      console.log({ isHit });

      if (isHit) {
        setSelectedElementIndex(i);
        setSelectedElementsIndices([]);
        return;
      }
    }

    // If no element was clicked, deselect
    setSelectedElementIndex(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className='relative h-full w-full overflow-hidden bg-gray-900'>
      {/* Background grid canvas */}
      <CanvasBackground canvasRef={bgCanvasRef} />

      {/* Drawing canvas */}
      <canvas
        ref={drawCanvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        onClick={handleOnClick}
        className={cn(
          '!dark:text-white absolute top-0 left-0',
          CURSOR_MAP[tool],
          cursorOnElement && 'cursor-move'
        )}
      />

      <MainToolBar />
      <BottomToolBar />
      <Activity mode={tool === 'insert' ? 'visible' : 'hidden'}>
        <InsertPanel />
      </Activity>
      <ArrayDialog />
      <TreeDialog />
      <LinkedListDialog />
    </div>
  );
};

export default CanvasArea;
