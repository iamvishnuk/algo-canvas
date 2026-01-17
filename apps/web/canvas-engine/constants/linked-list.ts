import { TreeNode } from '@algocanvas/types/canvas';

export const LINKED_LIST_CONSTANTS = {
  nodeWidth: 60,
  nodeHeight: 40,
  nodeSpacing: 10,
  arrowLength: 30
};

// Function for calculating the depth of the tree
export const getDepth = (node: TreeNode | null): number => {
  if (!node) return 0;
  return 1 + Math.max(getDepth(node.left), getDepth(node.right));
};
