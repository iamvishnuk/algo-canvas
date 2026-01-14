'use client';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Activity
} from 'react';
import {
  DrawArrow,
  DrawCircle,
  DrawLine,
  DrawPath,
  DrawPoint,
  DrawRect
} from '@workspace/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import BottomToolBar from './BottomToolBar';
import {
  addElements,
  addSelectedElementIndex,
  addSelectedElementsIndices,
  handleZoom,
  setCanvasSize,
  updateElementPosition,
  updateElementRotation,
  updateElementSize,
  updateOffSet
} from '@/features/canvas/canvasSlice';
import { useCanvasKeyboardShortcuts } from '@/hooks/useCanvasKeyboardShortcuts';
import MainToolBar from './MainToolBar';

import { cn } from '@workspace/ui/lib/utils';
import CanvasBackground from './CanvasBackground';
import { screenToWorld } from '@/lib/canvas/coordinates';
import { isElementInSelectionArea } from '@/lib/canvas/geometry';
import {
  findElementAtPosition,
  getResizeHandle,
  ResizeHandle
} from '@/lib/canvas/hitDetection';
import { CURSOR_MAP } from '@/lib/canvas/constant';
import { drawGrid } from '@/lib/canvas/rendering/drawGrid';
import { drawElements } from '@/lib/canvas/rendering/drawElements';
import { drawElementsPreview } from '@/lib/canvas/rendering/drawElementsPreview';
import {
  drawSelectionBox,
  rotatePoint
} from '@/lib/canvas/rendering/drawSelectionBox';
import InsertPanel from './InsertPanel';
import ArrayDialog from './ArrayDialog';
import TreeDialog from './TreeDialog';
import LinkedListDialog from './LinkedListDialog';
import {
  getElementBounds,
  getCombinedBounds,
  isPointInBounds
} from '@/lib/canvas/utils';
import ElementPropertyPanel from './ElementPropertyPanel';
import { updateElementDefaultProperty } from '@/features/element/elementPropertySlice';
import ArrayEditor from './ArrayEditor';
import LinkedListEditor from './LinkedListEditor';

const CanvasArea = () => {
  const dispatch = useAppDispatch();
  const {
    view,
    tool,
    elements,
    selectedElementIndex,
    selectedElementsIndices
  } = useAppSelector((state) => state.canvas);
  const elementProperty = useAppSelector((state) => state.elementProperty);

  useCanvasKeyboardShortcuts();

  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Omit<DrawPath, 'type'> | null>(
    null
  );
  const [cursorOnElement, setCursorOnElement] = useState<boolean>(false);

  // Area Selecting states
  const [isAreaSelecting, setIsAreasSelecting] = useState<boolean>(false);
  const [areaSelectionStart, setAreaSelectionStart] =
    useState<DrawPoint | null>(null);
  const [areaSelectionEnd, setAreaSelectionEnd] = useState<DrawPoint | null>(
    null
  );

  const [circleStart, setCircleStart] = useState<DrawPoint | null>(null);
  const [currentCircle, setCurrentCircle] = useState<Omit<
    DrawCircle,
    'type'
  > | null>(null);

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
  const [isFirstDragMove, setIsFirstDragMove] = useState(false);
  // Multi-element drag state
  const [multiDragOffsets, setMultiDragOffsets] = useState<
    Map<number, DrawPoint>
  >(new Map());
  const [isDraggingMultiple, setIsDraggingMultiple] = useState(false);

  // Rotation State
  const [isRotating, setIsRotating] = useState(false);
  const [rotationState, setRotationState] = useState<{
    index: number;
    center: DrawPoint;
    startAngle: number;
    initialRotation: number;
  } | null>(null);
  const [isFirstRotateMove, setIsFirstRotateMove] = useState(false);

  // Resize State
  const [isResizing, setIsResizing] = useState(false);
  const [resizeState, setResizeState] = useState<{
    index: number;
    handle: ResizeHandle;
    initialBounds: { minX: number; minY: number; maxX: number; maxY: number };
    anchorPoint: DrawPoint;
  } | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<ResizeHandle>(null);
  const [isFirstResizeMove, setIsFirstResizeMove] = useState(false);

  // Used to trigger redraw after resize
  const [resizeKey, setResizeKey] = useState(0);

  const [isTextInputVisible, setIsTextInputVisible] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState<DrawPoint | null>(
    null
  );
  const [textInputValue, setTextInputValue] = useState('');
  const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);

  // Refs to track text input state for saving when tool changes
  const textInputValueRef = useRef(textInputValue);
  const textInputPositionRef = useRef(textInputPosition);
  const isTextInputVisibleRef = useRef(isTextInputVisible);
  const editingTextIndexRef = useRef(editingTextIndex);

  // Keep refs in sync with state
  useEffect(() => {
    textInputValueRef.current = textInputValue;
    textInputPositionRef.current = textInputPosition;
    isTextInputVisibleRef.current = isTextInputVisible;
    editingTextIndexRef.current = editingTextIndex;
  }, [textInputValue, textInputPosition, isTextInputVisible, editingTextIndex]);

  console.log(elements);

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

  // Focus the input handler
  useEffect(() => {
    if (isTextInputVisible) {
      // Small delay ensures DOM is ready
      requestAnimationFrame(() => {
        textInputRef.current?.focus();
      });
    }
  }, [isTextInputVisible]);

  useEffect(() => {
    drawGrid(bgCanvasRef, view);
  }, [view, resizeKey]);

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
    drawElements(ctx, elements, scale, editingTextIndex);

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
    resizeKey,
    editingTextIndex
  ]);

  useEffect(() => {
    // Save any existing text before clearing when tool changes
    if (
      isTextInputVisibleRef.current &&
      textInputPositionRef.current &&
      textInputValueRef.current.trim()
    ) {
      if (editingTextIndexRef.current !== null) {
        // Update existing text element
        dispatch(
          updateElementPosition({
            index: editingTextIndexRef.current,
            x: textInputPositionRef.current.x,
            y: textInputPositionRef.current.y,
            offset: { x: 0, y: 0 },
            isStart: true
          })
        );
      } else {
        dispatch(
          addElements({
            element: {
              type: 'text',
              x: textInputPositionRef.current.x,
              y: textInputPositionRef.current.y,
              text: textInputValueRef.current,
              ...elementProperty.text
            }
          })
        );
      }
    }

    dispatch(addSelectedElementIndex(null));
    dispatch(addSelectedElementsIndices([]));
    setIsAreasSelecting(false);
    setAreaSelectionStart(null);
    setAreaSelectionEnd(null);
    setIsTextInputVisible(false);
    setTextInputPosition(null);
    setTextInputValue('');
    setEditingTextIndex(null);
  }, [tool, dispatch, elementProperty.text]);

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
      setCurrentPath({
        x: 0,
        y: 0,
        points: [worldPos],
        ...elementProperty.draw
      });
    } else if (tool === 'circle') {
      setIsDrawing(true);
      setCircleStart(worldPos);

      setCurrentCircle({
        x: worldPos.x,
        y: worldPos.y,
        radiusX: 0,
        radiusY: 0,
        ...elementProperty.circle
      });
    } else if (tool === 'rectangle') {
      setIsDrawing(true);
      setRectStart(worldPos);
      setCurrentRect({
        x: worldPos.x,
        y: worldPos.y,
        width: 0,
        height: 0,
        ...elementProperty.rectangle
      });
    } else if (tool === 'line') {
      setIsDrawing(true);
      setLineStart(worldPos);
      setCurrentLine({
        x: worldPos.x,
        y: worldPos.y,
        endX: worldPos.x,
        endY: worldPos.y,
        ...elementProperty.line
      });
    } else if (tool === 'arrow') {
      setIsDrawing(true);
      setArrowStart(worldPos);
    } else if (tool === 'text') {
      // Save any existing text before starting a new one
      if (isTextInputVisible && textInputPosition && textInputValue.trim()) {
        dispatch(
          addElements({
            element: {
              type: 'text',
              x: textInputPosition.x,
              y: textInputPosition.y,
              text: textInputValue,
              ...elementProperty.text
            }
          })
        );
      }
      setTextInputPosition(worldPos);
      setIsTextInputVisible(true);
      setTextInputValue('');
      return;
    } else if (tool === 'selection') {
      const HIT_TOLERANCE = 6 / view.scale;
      const SELECTION_PADDING = 10 / view.scale;

      // Check if clicking inside area-selection box (works for 1 or more elements)
      if (selectedElementsIndices.length >= 1) {
        const combinedBounds = getCombinedBounds(
          elements,
          selectedElementsIndices,
          SELECTION_PADDING
        );
        if (combinedBounds && isPointInBounds(worldPos, combinedBounds)) {
          // Start dragging selected elements
          const offsets = new Map<number, DrawPoint>();
          selectedElementsIndices.forEach((idx) => {
            const el = elements[idx];
            if (el) {
              offsets.set(idx, {
                x: worldPos.x - el.x,
                y: worldPos.y - el.y
              });
            }
          });

          setMultiDragOffsets(offsets);
          setIsDraggingMultiple(selectedElementsIndices.length > 1);
          setIsDraggingElements(true);
          setIsFirstDragMove(true);

          // For single element in area selection, also set the dragging index
          if (selectedElementsIndices.length === 1) {
            setDraggingElementIndex(selectedElementsIndices[0]!);
            const el = elements[selectedElementsIndices[0]!];
            if (el) {
              setDragElementOffset({
                x: worldPos.x - el.x,
                y: worldPos.y - el.y
              });
            }
          }
          return;
        }
      }

      // Check if clicking inside single selected element's bounding box
      if (selectedElementIndex !== null) {
        const element = elements[selectedElementIndex]!;
        const bound = getElementBounds(element);
        if (bound) {
          // Check for resize handle first
          const resizeHandle = getResizeHandle(worldPos, element, view);
          if (resizeHandle) {
            const padding = 10 / view.scale;
            const { minX, minY, maxX, maxY } = bound;

            // Determine anchor point (opposite corner)
            let anchorX: number, anchorY: number;
            switch (resizeHandle) {
              case 'top-left':
                anchorX = maxX + padding;
                anchorY = maxY + padding;
                break;
              case 'top-right':
                anchorX = minX - padding;
                anchorY = maxY + padding;
                break;
              case 'bottom-left':
                anchorX = maxX + padding;
                anchorY = minY - padding;
                break;
              case 'bottom-right':
                anchorX = minX - padding;
                anchorY = minY - padding;
                break;
              default:
                anchorX = minX;
                anchorY = minY;
            }

            setIsResizing(true);
            setIsFirstResizeMove(true);
            setResizeState({
              index: selectedElementIndex,
              handle: resizeHandle,
              initialBounds: bound,
              anchorPoint: { x: anchorX, y: anchorY }
            });
            return;
          }

          const padding = 10 / view.scale;
          const rotateOffset = 20 / view.scale;
          const rotateRadius = 10 / view.scale;

          const isRotatable =
            element.type === 'rectangle' || element.type === 'text';

          // Both text and rectangle rotate around the center of bounds
          const rotationCenter = {
            x: (bound.minX + bound.maxX) / 2,
            y: (bound.minY + bound.maxY) / 2
          };

          // 🔹 raw (unrotated) rotation handle position
          const rawRotatePoint = {
            x: rotationCenter.x,
            y: bound.minY - padding - rotateOffset
          };

          // 🔹 rotate handle if element is rotated (supports rectangle and text)
          const finalRotatePoint =
            isRotatable && element.rotate
              ? rotatePoint(
                  rawRotatePoint.x,
                  rawRotatePoint.y,
                  rotationCenter.x,
                  rotationCenter.y,
                  element.rotate
                )
              : rawRotatePoint;

          // 🔹 hit test
          const dx = worldPos.x - finalRotatePoint.x;
          const dy = worldPos.y - finalRotatePoint.y;

          if (dx * dx + dy * dy <= rotateRadius * rotateRadius) {
            setIsRotating(true);
            setIsFirstRotateMove(true);
            setRotationState({
              index: selectedElementIndex,
              center: rotationCenter,
              startAngle: Math.atan2(
                worldPos.y - rotationCenter.y,
                worldPos.x - rotationCenter.x
              ),
              initialRotation: element.rotate ?? 0
            });
            return;
          }

          // Check if clicking inside the selection box (for dragging from anywhere inside)
          const selectionBounds = {
            minX: bound.minX - padding,
            minY: bound.minY - padding,
            maxX: bound.maxX + padding,
            maxY: bound.maxY + padding
          };
          if (isPointInBounds(worldPos, selectionBounds)) {
            setIsDraggingElements(true);
            setIsFirstDragMove(true);
            setDraggingElementIndex(selectedElementIndex);
            setIsDraggingMultiple(false);
            setDragElementOffset({
              x: worldPos.x - element.x,
              y: worldPos.y - element.y
            });
            return;
          }
        }
      }

      const elementIndex = findElementAtPosition(
        worldPos,
        elements,
        HIT_TOLERANCE
      );

      if (elementIndex !== null) {
        const element = elements[elementIndex]!;

        setIsDraggingElements(true);
        setIsFirstDragMove(true);
        setDraggingElementIndex(elementIndex);
        setIsDraggingMultiple(false);
        setDragElementOffset({
          x: worldPos.x - element.x,
          y: worldPos.y - element.y
        });

        dispatch(addSelectedElementIndex(elementIndex));
        dispatch(addSelectedElementsIndices([]));
        return;
      }

      setIsAreasSelecting(true);
      setAreaSelectionStart(worldPos);
      setAreaSelectionEnd(worldPos);
      dispatch(addSelectedElementIndex(null));
      dispatch(addSelectedElementsIndices([]));
    }
  };

  const handleSelectionHover = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);
    const HIT_TOLERANCE = 6 / view.scale;

    // Check for resize handle hover on selected element
    if (selectedElementIndex !== null) {
      const element = elements[selectedElementIndex];
      if (element) {
        const resizeHandle = getResizeHandle(worldPos, element, view);
        setHoveredHandle(resizeHandle);
        if (resizeHandle) {
          setCursorOnElement(false);
          return;
        }
      }
    } else {
      setHoveredHandle(null);
    }

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
      setCurrentPath((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          points: [...prev.points, worldPos]
        };
      });
    } else if (isDrawing && tool === 'circle' && circleStart) {
      const radiusX = Math.abs(worldPos.x - circleStart.x) / 2;
      const radiusY = Math.abs(worldPos.y - circleStart.y) / 2;

      const centerX = (circleStart.x + worldPos.x) / 2;
      const centerY = (circleStart.y + worldPos.y) / 2;
      setCurrentCircle({
        x: centerX,
        y: centerY,
        radiusX,
        radiusY,
        ...elementProperty.circle
      });
    } else if (isDrawing && tool === 'rectangle' && rectStart) {
      const width = worldPos.x - rectStart.x;
      const height = worldPos.y - rectStart.y;
      setCurrentRect({
        x: rectStart.x,
        y: rectStart.y,
        width,
        height,
        ...elementProperty.rectangle
      });
    } else if (isDrawing && tool === 'line' && lineStart) {
      setCurrentLine({
        x: lineStart.x,
        y: lineStart.y,
        endX: worldPos.x,
        endY: worldPos.y,
        ...elementProperty.line
      });
    } else if (tool === 'arrow' && arrowStart) {
      setCurrentArrow({
        x: arrowStart.x,
        y: arrowStart.y,
        endX: worldPos.x,
        endY: worldPos.y,
        ...elementProperty.arrow
      });
    } else if (tool === 'selection' && isAreaSelecting && areaSelectionStart) {
      setAreaSelectionEnd(worldPos);
    } else if (tool === 'selection' && isDraggingElements) {
      if (isDraggingMultiple && selectedElementsIndices.length > 1) {
        // Drag multiple elements
        selectedElementsIndices.forEach((idx) => {
          const offset = multiDragOffsets.get(idx);
          if (offset) {
            dispatch(
              updateElementPosition({
                index: idx,
                x: worldPos.x,
                y: worldPos.y,
                offset: offset,
                isStart: isFirstDragMove
              })
            );
          }
        });
        if (isFirstDragMove) {
          setIsFirstDragMove(false);
        }
      } else if (draggingElementIndex !== null) {
        dispatch(
          updateElementPosition({
            index: draggingElementIndex,
            x: worldPos.x,
            y: worldPos.y,
            offset: dragElementOffset,
            isStart: isFirstDragMove
          })
        );
        if (isFirstDragMove) {
          setIsFirstDragMove(false);
        }
      }
    } else if (tool === 'selection' && isResizing && resizeState) {
      const { index, handle, initialBounds } = resizeState;
      const MIN_SIZE = 10 / view.scale;

      // Calculate new bounds based on which handle is being dragged
      let newMinX = initialBounds.minX;
      let newMinY = initialBounds.minY;
      let newMaxX = initialBounds.maxX;
      let newMaxY = initialBounds.maxY;

      switch (handle) {
        case 'top-left':
          newMinX = Math.min(worldPos.x, newMaxX - MIN_SIZE);
          newMinY = Math.min(worldPos.y, newMaxY - MIN_SIZE);
          break;
        case 'top-right':
          newMaxX = Math.max(worldPos.x, newMinX + MIN_SIZE);
          newMinY = Math.min(worldPos.y, newMaxY - MIN_SIZE);
          break;
        case 'bottom-left':
          newMinX = Math.min(worldPos.x, newMaxX - MIN_SIZE);
          newMaxY = Math.max(worldPos.y, newMinY + MIN_SIZE);
          break;
        case 'bottom-right':
          newMaxX = Math.max(worldPos.x, newMinX + MIN_SIZE);
          newMaxY = Math.max(worldPos.y, newMinY + MIN_SIZE);
          break;
      }

      dispatch(
        updateElementSize({
          index,
          newBounds: {
            minX: newMinX,
            minY: newMinY,
            maxX: newMaxX,
            maxY: newMaxY
          },
          isStart: isFirstResizeMove
        })
      );
      if (isFirstResizeMove) {
        setIsFirstResizeMove(false);
      }
      return;
    } else if (tool === 'selection' && isRotating && rotationState) {
      const { index, center, startAngle, initialRotation } = rotationState;

      const angle = Math.atan2(worldPos.y - center.y, worldPos.x - center.x);

      const delta = angle - startAngle;

      dispatch(
        updateElementRotation({
          elementIndex: index,
          rotation: initialRotation + delta,
          isStart: isFirstRotateMove
        })
      );
      if (isFirstRotateMove) {
        setIsFirstRotateMove(false);
      }

      return;
    } else if (tool === 'selection') {
      handleSelectionHover(e);
    }
  };

  const handleMouseUp = () => {
    if (isDraggingElements) {
      setIsDragging(false);
      setIsDraggingElements(false);
      setIsDraggingMultiple(false);
      setMultiDragOffsets(new Map());
      setDraggingElementIndex(null);
      return;
    }
    if (isDrawing && tool === 'draw' && currentPath) {
      const anchorX = currentPath.points[0]!.x;
      const anchorY = currentPath.points[0]!.y;

      const relativePoints = currentPath.points.map((p) => ({
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
            ...elementProperty.draw
          }
        })
      );

      setCurrentPath(null);
    } else if (isDrawing && tool === 'circle' && currentCircle) {
      dispatch(
        addElements({
          element: {
            type: 'circle',
            x: currentCircle.x,
            y: currentCircle.y,
            radiusX: currentCircle.radiusX,
            radiusY: currentCircle.radiusY,
            ...elementProperty.circle
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
            height: currentRect.height,
            ...elementProperty.rectangle
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
            endY: currentLine.endY,
            ...elementProperty.line
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
            endY: currentArrow.endY,
            ...elementProperty.arrow
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

      const selectedIndices: number[] = [];

      elements.forEach((element, index) => {
        if (isElementInSelectionArea(element, selectionArea)) {
          selectedIndices.push(index);
        }
      });

      dispatch(addSelectedElementsIndices(selectedIndices));
      setIsAreasSelecting(false);
      setAreaSelectionStart(null);
      setAreaSelectionEnd(null);
    } else if (isRotating) {
      setIsRotating(false);
      setRotationState(null);
      return;
    } else if (isResizing) {
      setIsResizing(false);
      setResizeState(null);
      return;
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

  const handleDoubleClick = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY, drawCanvasRef, view);
    const HIT_TOLERANCE = 6 / view.scale;

    const elementIndex = findElementAtPosition(
      worldPos,
      elements,
      HIT_TOLERANCE
    );

    if (elementIndex !== null) {
      const element = elements[elementIndex];
      if (element && element.type === 'text') {
        // Start editing the text element
        dispatch(
          updateElementDefaultProperty({
            key: 'fontSize',
            value: element.fontSize,
            element: 'text'
          })
        );
        setEditingTextIndex(elementIndex);
        setTextInputPosition({ x: element.x, y: element.y });
        setTextInputValue(element.text);
        setIsTextInputVisible(true);
        dispatch(addSelectedElementIndex(null));
      }
    }
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleTextSubmit();
    }
    // Enter key now adds newlines (default textarea behavior)
  };

  const handleTextSubmit = () => {
    if (textInputPosition && textInputValue.trim()) {
      if (editingTextIndex !== null) {
        // Update existing text element
        const existingElement = elements[editingTextIndex];
        if (existingElement && existingElement.type === 'text') {
          dispatch(
            addElements({
              element: {
                ...existingElement,
                text: textInputValue
              },
              replaceIndex: editingTextIndex
            })
          );
        }
      } else {
        // Create new text element
        dispatch(
          addElements({
            element: {
              type: 'text',
              x: textInputPosition.x,
              y: textInputPosition.y,
              text: textInputValue,
              ...elementProperty.text
            }
          })
        );
      }
    } else if (editingTextIndex !== null && !textInputValue.trim()) {
      // If editing and text is empty, we could optionally delete the element
      // For now, just restore original (do nothing)
    }
    setIsTextInputVisible(false);
    setTextInputPosition(null);
    setTextInputValue('');
    setEditingTextIndex(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Get resize cursor based on hovered handle
  const getResizeCursor = (handle: ResizeHandle): string => {
    switch (handle) {
      case 'top-left':
      case 'bottom-right':
        return 'cursor-nwse-resize';
      case 'top-right':
      case 'bottom-left':
        return 'cursor-nesw-resize';
      default:
        return '';
    }
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
        onDoubleClick={handleDoubleClick}
        className={cn(
          '!dark:text-white absolute top-0 left-0',
          CURSOR_MAP[tool],
          hoveredHandle && getResizeCursor(hoveredHandle),
          !hoveredHandle && cursorOnElement && 'cursor-move'
        )}
      />

      {isTextInputVisible && textInputPosition && (
        <textarea
          value={textInputValue}
          ref={textInputRef}
          onChange={(e) => {
            setTextInputValue(e.target.value);
            // Auto-resize: reset height then set to scrollHeight
            e.target.style.height = 'auto';
            e.target.style.width = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
            e.target.style.width = `${e.target.scrollWidth + 4}px`;
          }}
          onKeyDown={handleTextKeyDown}
          onBlur={handleTextSubmit}
          className='absolute resize-none overflow-hidden border-none bg-transparent px-1 outline-none'
          rows={1}
          style={{
            left: textInputPosition.x * view.scale + view.offsetX,
            top: textInputPosition.y * view.scale + view.offsetY,
            fontSize: elementProperty.text.fontSize * view.scale,
            fontFamily: elementProperty.text.fontFamily,
            color: elementProperty.text.color,
            lineHeight: 1.2,
            minWidth: '50px',
            minHeight: `${elementProperty.text.fontSize * view.scale * 1.2}px`
          }}
        />
      )}

      <MainToolBar />
      <BottomToolBar />
      <Activity mode={tool === 'insert' ? 'visible' : 'hidden'}>
        <InsertPanel />
      </Activity>
      <ArrayDialog />
      <TreeDialog />
      <LinkedListDialog />
      <ElementPropertyPanel />
      <ArrayEditor />
      <LinkedListEditor />
    </div>
  );
};

export default CanvasArea;
