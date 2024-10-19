import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { TreeNode, ItemType } from "./types";
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
      let blocksOffset = Math.round(
        //@ts-ignore
        monitor.getDifferenceFromInitialOffset()?.x / 44
      );
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
        overflow: "hidden",
        backgroundColor: isOver ? "red" : "white",
      }}
    >
      {props.children}
    </div>
  );
};

export default DndWrapper;
