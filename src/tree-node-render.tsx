import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import TreeDragLayer from "./tree-drag-preview";
import { ItemType, TreeNode as TreeNodeProps } from "./types";
import {
  changeNodeAtPath,
  getDescendantCount,
  isGreaterTreeDepth,
} from "./utils";

export function getBlockOffSet(treeindex: number) {
  const blockoffset: Array<JSX.Element> = [];
  for (let i = 0; i < treeindex; i++) {
    blockoffset.push(
      <div
        key={`block_${i}`}
        style={{
          display: "inline-block",
          minWidth: `${44}px`,
          minHeight: "60px",
        }}
      ></div>
    );
  }
  return blockoffset;
}

const TreeNode: React.FC<TreeNodeProps> = React.memo((props) => {
  const blockoffset: Array<JSX.Element> = getBlockOffSet(props.treeIndex);

  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemType.TREE_NODE,

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),

      item: () => {
        // This item will be available to drop targets
        return {
          path: props.path,
          id: props.id,
          children: props.children,
          title: props.title,
          subtitle: props.subtitle,
          treeIndex: props.treeIndex,
        };
      },
    }),
    [props] // dependency to update item-state in monitor
  );

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TREE_NODE,
    drop: (draggeditem: TreeNodeProps, monitor) => {
      const offSetDifference = monitor.getDifferenceFromInitialOffset()?.x;
      const scaffoldBlockPxWidth = draggeditem?.scaffoldBlockPxWidth || 44;

      let newDepth = draggeditem?.treeIndex;
      if (offSetDifference && scaffoldBlockPxWidth) {
        newDepth = Math.round(offSetDifference / scaffoldBlockPxWidth);
      }

      if (!props.treeData) return;

      const isDroppedAsChild = newDepth > props.treeIndex;

      const newNode = {
        title: draggeditem.title,
        subtitle: draggeditem.subtitle,
        children: draggeditem.children,

        newNode: true,
        addAsChild: isDroppedAsChild,
        expanded: draggeditem.expanded,
      };

      let res = changeNodeAtPath({
        treeData: props.treeData,
        path: props.path,
        newNode: newNode,
      });

      function getPrevIdx() {
        const { isGreater, idx } = isGreaterTreeDepth({
          draggedItemPath: draggeditem.path,
          targetItemPath: props.path,
        });
        if (!isGreater) {
          return draggeditem.path;
        }
        const descendantCount = getDescendantCount({
          node: draggeditem,
          ignoreCollapsed: true,
        });
        const addedNodePrevIdx = draggeditem.path.map((x: number, i: number) =>
          i >= idx ? x + 1 + descendantCount : x
        );
        return addedNodePrevIdx;
      }
      const addedNodePrevIdx = getPrevIdx();

      res = changeNodeAtPath({
        treeData: res,
        path: addedNodePrevIdx,
        newNode: undefined,
      });

      props.onChange(res);
    },
    hover: (draggedItem, moniter) => {
      // TODO+S
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const __dnd_TreeNode_default: React.CSSProperties = {
    display: "inline-block",
    minHeight: "50px",
    minWidth: "300px",
    background: "#f5ebe0",
    border: "1px solid #d3c4f5",
    borderRadius: 2,
    padding: 6,
    cursor: "move",
    margin: 4,
    opacity: isDragging ? 0.5 : 1,
    outline: isOver
      ? "4px dashed #48a363"
      : isDragging
      ? "4px solid #ba8f95"
      : "none",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const mergedStyle = { ...__dnd_TreeNode_default, ...props.style };
  drop(ref);
  return (
    <>
      <div
        ref={ref}
        style={{
          display: "flex",
          justifyItems: "flex-start",
          alignItems: "center",
        }}
      >
        {...blockoffset}

        <div ref={drag} style={mergedStyle} className={props.className}>
          Title: {props.title}
          <br />
          {props.subtitle && `Subtitle: ${props.subtitle}`}
        </div>

        <TreeDragLayer style={props.style} />
      </div>
    </>
  );
});

export default TreeNode;
