import { TreeNode } from '@workspace/types/canvas';

export const TREE_CONSTANTS = {
  nodeRadius: 25,
  levelHeight: 80,
  baseSpacing: 50
};

export const buildTreeFromArray = (values: string[]): TreeNode | undefined => {
  if (!values.length || values[0] === 'null' || values[0] === '') {
    return undefined;
  }

  const root: TreeNode = { value: values[0]! };
  const queue: TreeNode[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;

    // Left child
    const leftVal = values[i];
    if (leftVal !== undefined && leftVal !== 'null' && leftVal !== '') {
      const leftNode: TreeNode = { value: leftVal };
      node.left = leftNode;
      queue.push(leftNode);
    }
    i++;

    // Right child
    const rightVal = values[i];
    if (rightVal !== undefined && rightVal !== 'null' && rightVal !== '') {
      const rightNode: TreeNode = { value: rightVal };
      node.right = rightNode;
      queue.push(rightNode);
    }
    i++;
  }

  return root;
};

// Function for calculating the depth of the tree
export const getDepth = (node: TreeNode | undefined): number => {
  if (!node) return 0;
  return 1 + Math.max(getDepth(node.left), getDepth(node.right));
};
