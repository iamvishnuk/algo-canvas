import { CanvasElement, TreeNode } from '@algocanvas/types/canvas';
import { Separator } from '@algocanvas/ui/components/separator';
import { Button } from '@algocanvas/ui/components/button';
import { Copy, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  addChild,
  getAllNodes,
  removeSubtree,
  updateNodeValue
} from '@/lib/data-structures/tree';
import { setTimeout } from 'node:timers';
import { CanvasEngine } from '@/canvas-engine';

function traverse(node: TreeNode | null, type: string, result: string[] = []) {
  if (!node) return;
  if (type === 'preorder') result.push(node.value);
  traverse(node.left ?? null, type, result);
  if (type === 'inorder') result.push(node.value);
  traverse(node.right ?? null, type, result);
  if (type === 'postorder') result.push(node.value);
}

type TreeEditorEditorProps = {
  selectedElement: CanvasElement | null;
  engine: CanvasEngine | null;
};

const TreeEditor = ({ selectedElement, engine }: TreeEditorEditorProps) => {
  const elementType = selectedElement?.type;

  const [root, setRoot] = useState<TreeNode | null>(
    selectedElement?.type === 'binary-tree' ? selectedElement.root : null
  );
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [editValue, setEditValue] = useState('');
  const [traversalType, setTraversalType] = useState<
    'inorder' | 'preorder' | 'postorder' | 'levelorder'
  >('inorder');
  const [traversalResult, setTraversalResult] = useState<string[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedElement?.type === 'binary-tree') {
      setRoot(selectedElement.root);
      setSelectedNode(null);
      setEditValue('');
      setTraversalResult([]);
    } else {
      setRoot(null);
      setSelectedNode(null);
      setEditValue('');
      setTraversalResult([]);
    }
  }, [selectedElement]);

  useEffect(() => {
    if (!deleteError) return;
    const timer = setTimeout(() => setDeleteError(null), 2000);

    return () => clearTimeout(timer);
  }, [deleteError]);

  const updateTree = (newRoot: TreeNode | null) => {
    setRoot(newRoot);
    if (newRoot) {
      engine?.updateDataStructuresValues(newRoot);
    }
  };

  const handleEditValue = () => {
    if (!selectedNode || editValue.trim() === '') return;
    const newRoot = updateNodeValue(root, selectedNode, editValue);
    updateTree(newRoot);
  };

  const handleAddChild = (side: 'left' | 'right') => {
    if (!selectedNode || !root) return;
    const newRoot = addChild(root, selectedNode, side, editValue);
    updateTree(newRoot);
  };

  const handleRemoveNode = () => {
    if (!selectedNode || !root) return;

    if (selectedNode === root) {
      setDeleteError("Can't delete root node");
      return;
    }

    const newRoot = removeSubtree(root, selectedNode);
    updateTree(newRoot);
    setSelectedNode(null);
  };

  const handleTraversal = (
    type: 'inorder' | 'preorder' | 'postorder' | 'levelorder'
  ) => {
    if (!root) return setTraversalResult([]);
    if (type === 'levelorder') {
      // BFS
      const queue: (TreeNode | null)[] = [root];
      const res: string[] = [];
      while (queue.length) {
        const node = queue.shift();
        if (node) {
          res.push(node.value);
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
      }
      setTraversalResult(res);
    } else {
      const res: string[] = [];
      traverse(root, type, res);
      setTraversalResult(res);
    }
    setTraversalType(type);
  };

  const handleCopyJSON = () => {
    if (!root) return;
    navigator.clipboard.writeText(JSON.stringify(root, null, 2));
  };

  if (elementType !== 'binary-tree') return null;

  return (
    <div className='bg-brand-bg absolute top-4 right-4 flex max-h-[calc(100vh-50px)] max-w-[350px] min-w-[300px] flex-col space-y-5 rounded-md border p-4 shadow-md'>
      <div>
        <h3 className='text-brand-primary text-xl font-semibold'>Tree</h3>
        <Separator className='my-2' />
        <div>
          <p className='mb-1 text-sm text-neutral-400'>Tree Nodes</p>
          <select
            className='h-9 w-full rounded border px-2 py-1 text-sm'
            value={selectedNode?.id ?? ''}
            onChange={(e) => {
              const node = getAllNodes(root).find(
                (n) => n.id === e.target.value
              );
              if (node) {
                setSelectedNode(node);
                setEditValue(node.value);
              }
            }}
          >
            <option
              value=''
              disabled
            >
              Select a node
            </option>
            {getAllNodes(root).map((node) => (
              <option
                key={node.id}
                value={node.id}
              >
                {node.value}
              </option>
            ))}
          </select>
        </div>
        <Separator className='my-2' />
        <div>
          <p className='mb-1 text-sm text-neutral-400'>Selected Node</p>
          {selectedNode ? (
            <div className='flex flex-col gap-2'>
              <input
                className='rounded border px-2 py-1'
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />

              <div className='grid grid-cols-4 gap-2'>
                <Button
                  className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
                  onClick={handleEditValue}
                  size='sm'
                >
                  Save
                </Button>
                <Button
                  className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
                  onClick={() => handleAddChild('left')}
                  size='sm'
                  disabled={!!selectedNode.left}
                >
                  Add Left
                </Button>
                <Button
                  className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
                  onClick={() => handleAddChild('right')}
                  size='sm'
                  disabled={!!selectedNode.right}
                >
                  Add Right
                </Button>
                <Button
                  className='text-xs hover:cursor-pointer'
                  variant='destructive'
                  onClick={handleRemoveNode}
                  size='sm'
                >
                  Remove
                </Button>
              </div>

              {deleteError && (
                <p className='text-xs text-red-500'>{deleteError}</p>
              )}
            </div>
          ) : (
            <span className='text-xs text-red-800'>Select a node to edit</span>
          )}
        </div>
        <Separator className='my-2' />
        <div>
          <p className='mb-1 text-sm text-neutral-400'>Traversals</p>
          <div className='grid grid-cols-4 gap-2'>
            <Button
              className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
              size='sm'
              onClick={() => handleTraversal('inorder')}
            >
              Inorder
            </Button>
            <Button
              className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
              size='sm'
              onClick={() => handleTraversal('preorder')}
            >
              Preorder
            </Button>
            <Button
              className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
              size='sm'
              onClick={() => handleTraversal('postorder')}
            >
              Postorder
            </Button>
            <Button
              className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
              size='sm'
              onClick={() => handleTraversal('levelorder')}
            >
              Levelorder
            </Button>
          </div>
          <div className='mt-1 text-xs text-neutral-400'>
            {traversalResult.length > 0 && (
              <span className='capitalize'>
                {traversalType}: {traversalResult.join(', ')}
              </span>
            )}
          </div>
        </div>
        <Separator className='my-2' />
        <div>
          <p className='mb-1 text-sm text-neutral-400'>Actions</p>
          <div className='flex gap-2'>
            <Button
              size='icon'
              variant='outline'
              className='hover:cursor-pointer'
              onClick={() => engine?.removeElement()}
            >
              <Trash />
            </Button>
            <Button
              size='icon'
              variant='outline'
              className='hover:cursor-pointer'
              onClick={() => engine?.duplicateElement()}
            >
              <Copy />
            </Button>
            <Button
              variant='outline'
              className='bg-brand-primary text-xs text-white hover:cursor-pointer'
              onClick={handleCopyJSON}
            >
              Copy as JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeEditor;
