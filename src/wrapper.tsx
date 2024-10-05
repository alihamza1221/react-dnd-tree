import React, { useRef } from "react";
import { ItemType, TreeNode } from "./tree-node-render";
import { useDrag, DragSourceMonitor, useDrop, XYCoord } from "react-dnd";
export type TreeNodeWrapProps = {
  children: React.ReactNode;

  canDrag?: boolean;
  canDrop?: boolean;
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
const DndWrapper: React.FC<TreeNodeWrapProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TREE_NODE,
    drop: (item: TreeNode, monitor) => {
      console.log("drop", item);

      let blocksOffset = Math.round(
        //@ts-ignore
        monitor.getDifferenceFromInitialOffset()?.x / 44
      );
      console.log("blocksOffset", blocksOffset);
      return {
        node: item,
      };
    },

    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      isOverShallow: monitor.isOver({ shallow: true }),
    }),
  });
  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        backgroundColor: isOver ? "green" : "white",
      }}
    >
      wrapper
      {props.children}
    </div>
  );
};

export default DndWrapper;
