'use client';
import React, { useRef, useEffect, useState } from 'react';
import { DrawLine, DrawPoint, DrawRect } from '@workspace/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import BottomToolBar from './BottomToolBar';
import {
  addElements,
  handleZoom,
  updateOffSet
} from '@/features/canvas/canvasSlice';
import { useCanvasKeyboardShortcuts } from '@/hooks/useCanvasKeyboardShortcuts';
import MainToolBar from './MainToolBar';
import { CURSOR_MAP } from '@/utils/canvas';
import { cn } from '@workspace/ui/lib/utils';

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

  const drawGrid = () => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { scale, offsetX, offsetY } = view;
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const gridSize = 40;
    const startX = Math.floor(-offsetX / scale / gridSize) * gridSize;
    const startY = Math.floor(-offsetY / scale / gridSize) * gridSize;
    const endX = Math.ceil((width - offsetX) / scale / gridSize) * gridSize;
    const endY = Math.ceil((height - offsetY) / scale / gridSize) * gridSize;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1 / scale;

    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }

    ctx.restore();
  };

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
    elements.forEach((element) => {
      if (element.type === 'draw') {
        if (element.points.length < 2) return;

        ctx.strokeStyle = element.color;
        ctx.lineWidth = 2 / scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);

        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        ctx.stroke();
      } else if (element.type === 'circle') {
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 2 / scale;

        ctx.beginPath();
        ctx.arc(
          element.centerX,
          element.centerY,
          element.radius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      } else if (element.type === 'rectangle') {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2 / scale;

        ctx.beginPath();
        ctx.rect(element.x, element.y, element.width, element.height);
        ctx.stroke();
      } else if (element.type === 'line') {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2 / scale;

        ctx.beginPath();
        ctx.moveTo(element.startX, element.startY);
        ctx.lineTo(element.endX, element.endY);

        ctx.stroke();
      }
    });

    // Draw current path being drawn
    if (currentPath.length > 0) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);

      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }

    // Draw current circle being drawn
    if (currentCircle) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / scale;

      ctx.beginPath();
      ctx.arc(
        currentCircle.center.x,
        currentCircle.center.y,
        currentCircle.radius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    if (currentRect) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / scale;

      ctx.beginPath();
      ctx.rect(
        currentRect.x,
        currentRect.y,
        currentRect.width,
        currentRect.height
      );
      ctx.stroke();
    }

    if (currentLine) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / scale;

      ctx.beginPath();
      ctx.moveTo(currentLine.startX, currentLine.startY);
      ctx.lineTo(currentLine.endX, currentLine.endY);

      ctx.stroke();
    }

    ctx.restore();
  };

  const resizeCanvas = () => {
    const bgCanvas = bgCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!bgCanvas || !drawCanvas) return;

    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    drawCanvas.width = window.innerWidth;
    drawCanvas.height = window.innerHeight;
    drawGrid();
    redrawCanvas();
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    drawGrid();
  }, [view]);

  useEffect(() => {
    redrawCanvas();
  }, [view, elements, currentPath, currentCircle, currentRect, currentLine]);

  // Convert mouse (screen) coordinates to canvas world coordinates
  // so drawing works correctly with pan (offset) and zoom (scale)
  const screenToWorld = (screenX: number, screenY: number) => {
    const canvas = drawCanvasRef.current;

    // If canvas is not available, return a safe default
    if (!canvas) return { x: 0, y: 0 };

    // Canvas position relative to the viewport
    const rect = canvas.getBoundingClientRect();

    // Apply inverse pan and zoom to get world-space coordinates
    const x = (screenX - rect.left - view.offsetX) / view.scale;
    const y = (screenY - rect.top - view.offsetY) / view.scale;

    return { x, y };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    dispatch(handleZoom({ delta }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
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
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      dispatch(
        updateOffSet({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
      );
    } else if (isDrawing && tool === 'draw') {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      setCurrentPath((prev) => [...prev, worldPos]);
    } else if (isDrawing && tool === 'circle' && circleStart) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      const dx = worldPos.x - circleStart.x;
      const dy = worldPos.y - circleStart.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setCurrentCircle({ center: circleStart, radius });
    } else if (isDrawing && tool === 'rectangle' && rectStart) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      const width = worldPos.x - rectStart.x;
      const height = worldPos.y - rectStart.y;
      setCurrentRect({ x: rectStart.x, y: rectStart.y, width, height });
    } else if (isDrawing && tool === 'line' && lineStart) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      setCurrentLine({
        startX: lineStart.x,
        startY: lineStart.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && tool === 'draw' && currentPath.length > 0) {
      dispatch(
        addElements({
          element: { type: 'draw', points: currentPath, color: '#3b82f6' }
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
            color: '#3b82f6'
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
    }
    setIsDragging(false);
    setIsDrawing(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className='relative h-full w-full overflow-hidden bg-gray-900'>
      {/* Background grid canvas */}
      <canvas
        ref={bgCanvasRef}
        className='absolute top-0 left-0'
        style={{ pointerEvents: 'none' }}
      />

      {/* Drawing canvas */}
      <canvas
        ref={drawCanvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        className={cn(
          '!dark:text-white absolute top-0 left-0',
          CURSOR_MAP[tool]
        )}
      />

      <MainToolBar />
      <BottomToolBar />
    </div>
  );
};

export default CanvasArea;
