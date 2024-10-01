import React from "react";
import { ItemType, TreeNode } from "./tree-node-render";
import { useDrag, DragSourceMonitor, useDrop } from "react-dnd";
export type TreeNodeWrapProps = {
  node: TreeNode;
  children: React.ReactNode;

  canDrag: boolean;
  canDrop: boolean;
};
export type TreeNodeDropResult = {
  node: TreeNode;
  prevPath: number[];
  prevParent: TreeNode;
  prevTreeIndex: number;
  nextPath: number[];
  nextParent: TreeNode;
  nextTreeIndex: number;
};
const NodeWrapper: React.FC<TreeNodeWrapProps> = (props) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TREE_NODE,
    item: { ...props.node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end(draggedItem, monitor: DragSourceMonitor) {
      if (monitor.didDrop()) {
        const dropResult = monitor.getDropResult<TreeNodeDropResult>();
        if (dropResult) {
          console.log(
            `You dropped ${draggedItem.title} into ${dropResult?.node.title}!`
          );
        }
      }
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TREE_NODE,
    drop: (item: TreeNode, monitor) => {
      const initClientOffSet = monitor.getInitialClientOffset();
      const clientOffSet = monitor.getClientOffset();
      if (initClientOffSet && clientOffSet)
        console.log(
          "initClientOffSet",
          initClientOffSet?.x,
          "clientOffSet",
          clientOffSet?.x,
          "\n diff : ",
          initClientOffSet.x - clientOffSet.x
        );
      return {
        node: item,
        prevPath: item.path,
        prevParent: item.parentNode,
        prevTreeIndex: item.treeIndex,
        nextPath: props.node.path,
        nextParent: props.node,
        nextTreeIndex: props.node.treeIndex,
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return <div></div>;
};

export default NodeWrapper;
