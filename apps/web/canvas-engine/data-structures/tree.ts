import { generateUUID } from '@/utils';
import { TreeNode } from '@algocanvas/types/canvas';

export const TREE_CONSTANTS = {
  nodeRadius: 25,
  levelHeight: 80,
  baseSpacing: 50
};

export const buildTreeFromArray = (values: string[]): TreeNode | null => {
  if (!values.length || values[0] === 'null' || values[0] === '') {
    return null;
  }

  const root: TreeNode = {
    id: generateUUID(),
    value: values[0]!,
    left: null,
    right: null
  };

  const queue: TreeNode[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;

    // Left child
    const leftVal = values[i];
    if (leftVal !== undefined && leftVal !== 'null' && leftVal !== '') {
      const leftNode: TreeNode = {
        id: generateUUID(),
        value: leftVal,
        left: null,
        right: null
      };
      node.left = leftNode;
      queue.push(leftNode);
    }
    i++;

    // Right child
    const rightVal = values[i];
    if (rightVal !== undefined && rightVal !== 'null' && rightVal !== '') {
      const rightNode: TreeNode = {
        id: generateUUID(),
        value: rightVal,
        left: null,
        right: null
      };
      node.right = rightNode;
      queue.push(rightNode);
    }
    i++;
  }

  return root;
};

// Function for calculating the depth of the tree
export const getDepth = (node: TreeNode | null): number => {
  if (!node) return 0;
  return 1 + Math.max(getDepth(node.left), getDepth(node.right));
};

export const getAllNodes = (node: TreeNode | null, arr: TreeNode[] = []) => {
  if (!node) return arr;
  arr.push(node);
  getAllNodes(node.left ?? null, arr);
  getAllNodes(node.right ?? null, arr);
  return arr;
};

export const updateNodeValue = (
  node: TreeNode | null,
  target: TreeNode,
  value: string
): TreeNode | null => {
  if (!node) return null;
  if (node === target) {
    return { ...node, value };
  }
  return {
    ...node,
    left: updateNodeValue(node.left ? node.left : null, target, value),
    right: updateNodeValue(node.right ?? null, target, value)
  };
};

export const addChild = (
  node: TreeNode | null,
  target: TreeNode,
  side: 'left' | 'right',
  value: string
): TreeNode | null => {
  if (!node) return null;

  if (node === target) {
    if (node[side]) return node;
    return {
      ...node,
      [side]: {
        id: generateUUID(),
        value: value,
        left: null,
        right: null
      }
    };
  }

  return {
    ...node,
    left: addChild(node.left, target, side, value),
    right: addChild(node.right, target, side, value)
  };
};

export const removeAndPromote = (
  node: TreeNode | null,
  target: TreeNode
): TreeNode | null => {
  if (!node) return null;

  if (node === target) {
    return node.left ?? node.right;
  }

  return {
    ...node,
    left: removeAndPromote(node.left, target),
    right: removeAndPromote(node.right, target)
  };
};

export const removeSubtree = (
  node: TreeNode | null,
  target: TreeNode
): TreeNode | null => {
  if (!node) return null;

  // delete this node and everything below it
  if (node === target) {
    return null;
  }

  return {
    ...node,
    left: removeSubtree(node.left, target),
    right: removeSubtree(node.right, target)
  };
};
