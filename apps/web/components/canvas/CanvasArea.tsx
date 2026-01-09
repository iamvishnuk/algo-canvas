'use client';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Activity
} from 'react';
import { DrawArrow, DrawLine, DrawPoint, DrawRect } from '@workspace/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import BottomToolBar from './BottomToolBar';
import {
  addElements,
  addSelectedElementIndex,
  addSelectedElementsIndices,
  handleZoom,
  setCanvasSize,
  updateElementPosition,
  updateOffSet
} from '@/features/canvas/canvasSlice';
import { useCanvasKeyboardShortcuts } from '@/hooks/useCanvasKeyboardShortcuts';
import MainToolBar from './MainToolBar';

import { cn } from '@workspace/ui/lib/utils';
import CanvasBackground from './CanvasBackground';
import { screenToWorld } from '@/lib/canvas/coordinates';
import { isElementInSelectionArea } from '@/lib/canvas/geometry';
import { findElementAtPosition } from '@/lib/canvas/hitDetection';
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
  const {
    view,
    tool,
    elements,
    selectedElementIndex,
    selectedElementsIndices
  } = useAppSelector((state) => state.canvas);

  useCanvasKeyboardShortcuts();

  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawPoint[]>([]);
  const [cursorOnElement, setCursorOnElement] = useState<boolean>(false);

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

  // Dragging Elements
  const [isDraggingElements, setIsDraggingElements] = useState(false);
  const [dragElementOffset, setDragElementOffset] = useState<DrawPoint>({
    x: 0,
    y: 0
  });
  const [draggingElementIndex, setDraggingElementIndex] = useState<
    number | null
  >(null);

  // Used to trigger redraw after resize
  const [resizeKey, setResizeKey] = useState(0);

  const resizeCanvas = useCallback(() => {
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
    // Trigger redraw after resize
    setResizeKey((prev) => prev + 1);
  }, [dispatch]);

  // Handle window resize - stable event listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    drawGrid(bgCanvasRef, view);
  }, [view, resizeKey]);

  console.log({ isDrawing });

  useEffect(() => {
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
        selectedElementIndex,
        elements,
        view,
        selectedElementsIndices,
        isAreaSelecting,
        areaSelectionStart,
        areaSelectionEnd
      );
    }

    ctx.restore();
  }, [
    view,
    elements,
    currentPath,
    currentCircle,
    currentRect,
    currentLine,
    currentArrow,
    selectedElementIndex,
    selectedElementsIndices,
    isAreaSelecting,
    areaSelectionStart,
    areaSelectionEnd,
    tool,
    resizeKey
  ]);

  useEffect(() => {
    dispatch(addSelectedElementIndex(null));
    dispatch(addSelectedElementsIndices([]));
    setIsAreasSelecting(false);
    setAreaSelectionStart(null);
    setAreaSelectionEnd(null);
  }, [tool, dispatch]);

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
        x: worldPos.x,
        y: worldPos.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    } else if (tool === 'arrow') {
      setIsDrawing(true);
      setArrowStart(worldPos);
    } else if (tool === 'selection') {
      const HIT_TOLERANCE = 6 / view.scale;
      const elementIndex = findElementAtPosition(
        worldPos,
        elements,
        HIT_TOLERANCE
      );
      const clickedOnElement = elementIndex !== null;

      // If not clicking on an element, start area selection
      if (clickedOnElement) {
        const element = elements[elementIndex];
        setIsDraggingElements(true);
        setDraggingElementIndex(elementIndex);
        if (element) {
          setDragElementOffset({
            x: worldPos.x - element.x,
            y: worldPos.y - element.y
          });
        }
      } else {
        setIsAreasSelecting(true);
        setIsDraggingElements(false);
        setAreaSelectionStart(worldPos);
        setAreaSelectionEnd(worldPos);
        dispatch(addSelectedElementIndex(null));
        dispatch(addSelectedElementsIndices([]));
      }
    }
  };

  const handleSelectionHover = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);
    const HIT_TOLERANCE = 6 / view.scale;
    const elementIndex = findElementAtPosition(
      worldPos,
      elements,
      HIT_TOLERANCE
    );
    setCursorOnElement(elementIndex !== null);
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
        x: lineStart.x,
        y: lineStart.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    } else if (tool === 'arrow' && arrowStart) {
      setCurrentArrow({
        x: arrowStart.x,
        y: arrowStart.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    } else if (tool === 'selection' && isAreaSelecting && areaSelectionStart) {
      setAreaSelectionEnd(worldPos);
    } else if (tool === 'selection' && isDraggingElements) {
      if (draggingElementIndex !== null) {
        dispatch(
          updateElementPosition({
            index: draggingElementIndex,
            x: worldPos.x,
            y: worldPos.y,
            offset: dragElementOffset
          })
        );
      }
    } else if (tool === 'selection') {
      handleSelectionHover(e);
    }
  };

  console.log(elements);

  const handleMouseUp = () => {
    if (isDraggingElements) {
      setIsDragging(false);
      setIsDraggingElements(false);
      return;
    }
    if (isDrawing && tool === 'draw' && currentPath.length > 1) {
      const anchorX = currentPath[0]!.x;
      const anchorY = currentPath[0]!.y;

      const relativePoints = currentPath.map((p) => ({
        x: p.x - anchorX,
        y: p.y - anchorY
      }));

      dispatch(
        addElements({
          element: {
            type: 'draw',
            x: anchorX,
            y: anchorY,
            points: relativePoints,
            color: '#7A3EFF'
          }
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
            x: currentCircle.center.x,
            y: currentCircle.center.y,
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
            x: currentLine.x,
            y: currentLine.y,
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
            x: currentArrow.x,
            y: currentArrow.y,
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

      dispatch(addSelectedElementsIndices(selectedIndecies));
      setIsAreasSelecting(false);
      setAreaSelectionStart(null);
      setAreaSelectionEnd(null);
    }
    setIsDragging(false);
    setIsDrawing(false);
    setIsDraggingElements(false);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    if (tool !== 'selection') return;

    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);
    const HIT_TOLERANCE = 6 / view.scale;

    const elementIndex = findElementAtPosition(
      worldPos,
      elements,
      HIT_TOLERANCE
    );

    if (elementIndex !== null) {
      dispatch(addSelectedElementIndex(elementIndex));
      dispatch(addSelectedElementsIndices([]));
    } else {
      // If no element was clicked, deselect
      dispatch(addSelectedElementIndex(null));
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    dispatch(handleZoom({ delta }));
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
