import React, { Children, useRef } from "react";
import { useDrag, DragSourceMonitor, useDrop, XYCoord } from "react-dnd";
import TreeDragLayer from "./tree-drag-preview";

function isGreaterTreeDepth({
  draggedItemPath,
  targetItemPath,
}: {
  draggedItemPath: number[];
  targetItemPath: number[];
}): { isGreater: boolean; idx: number } {
  console.log(
    "draggedItemPath: ",
    draggedItemPath,
    "targetItemPath: ",
    targetItemPath
  );

  let i = 0;
  while (i < draggedItemPath.length && i < targetItemPath.length) {
    if (draggedItemPath[i] > targetItemPath[i]) {
      return { isGreater: true, idx: i };
    } else if (draggedItemPath[i] < targetItemPath[i]) {
      return { isGreater: false, idx: i };
    }
    i++;
  }
  if (draggedItemPath.length > targetItemPath.length) {
    return { isGreater: true, idx: draggedItemPath.length };
    console.log(".........true");
  }
  return { isGreater: false, idx: 0 };
}
function getDescendantCount({
  node,
  ignoreCollapsed,
}: {
  node: any;
  ignoreCollapsed: boolean;
}): number {
  if (!node.children || (ignoreCollapsed && node.expanded === false)) {
    return 0;
  }

  let count = 0;
  for (let i = 0; i < node.children.length; i++) {
    count +=
      1 + getDescendantCount({ node: node.children[i], ignoreCollapsed });
  }

  return count;
}

export type TreeNode = {
  children?: TreeNode[];
  id?: number;
  title: string;
  subtitle?: string;
  path: number[];
  expanded?: boolean;
  canHaveChildren?: boolean;
  className?: string;
  style?: React.CSSProperties;

  parent?: TreeNode;
  treeIndex: number;
  scaffoldBlockPxWidth?: number;
  maxDepth?: number;
  treeData: TreeNode[];
  onChange: (treeData: TreeNode[]) => void;

  [key: string]: any;
};

type changeNodeAtPathParams = {
  treeData: TreeNode[];
  path: number[];
  newNode: any | undefined;
  ignoreCollapsed?: boolean;
};
export const changeNodeAtPath = ({
  treeData,
  path,
  newNode,
  ignoreCollapsed = true,
}: changeNodeAtPathParams) => {
  console.log("path:", path, "treeData: ", treeData, "newNode: ", newNode);
  const RESULT_MISS = "RESULT_MISS";

  //@ts-ignore
  const traverse = ({
    isPseudoRoot = false,
    node,
    currentTreeIndex,
    pathIndex,
  }: {
    isPseudoRoot?: boolean;
    node: any;
    currentTreeIndex: number;
    pathIndex: number;
  }) => {
    if (!isPseudoRoot && currentTreeIndex !== path[pathIndex]) {
      return RESULT_MISS;
    }

    if (pathIndex >= path.length - 1) {
      // If this is the final location in the path, return its changed form
      return newNode;
    }
    if (!node.children) {
      // If this node is part of the path, but has no children, return the unchanged node
      throw new Error("Path referenced children of node with no children.");
    }

    let nextTreeIndex = currentTreeIndex + 1;

    for (let i = 0; i < node.children.length; i += 1) {
      //@ts-ignore
      const result = traverse({
        node: node.children[i],
        currentTreeIndex: nextTreeIndex,
        pathIndex: pathIndex + 1,
      });
      console.log("res: ", result);
      // If the result went down the correct path
      if (result !== RESULT_MISS) {
        if (result) {
          // If the result was truthy (in this case, an object),
          //  pass it to the next level of recursion up
          if (result.addAsChild && result.newNode) {
            delete result.addAsChild;
            delete result.newNode;

            return {
              ...node,
              children: [
                ...node.children.slice(0, i),
                {
                  ...node.children[i],
                  children: [
                    ...(node.children[i]?.children || []),
                    { ...result, newNode: false, addAsChild: false },
                  ],
                },
                ...node.children.slice(i + 1),
              ],
            };
          } else if (result.newNode) {
            delete result.newNode;
            return {
              ...node,
              children: [
                ...node.children.slice(0, i + 1),
                { ...result, newNode: false },
                ...node.children.slice(i + 1),
              ],
            };
          }

          return {
            ...node,
            children: [
              ...node.children.slice(0, i),
              result,
              ...node.children.slice(i + 1),
            ],
          };
        }
        // If the result was falsy (returned from the newNode function), then
        //  delete the node from the array.
        return {
          ...node,
          children: [
            ...node.children.slice(0, i),
            ...node.children.slice(i + 1),
          ],
        };
      }

      nextTreeIndex +=
        1 + getDescendantCount({ node: node.children[i], ignoreCollapsed });
    }
  }; //@ts-ignore
  const result = traverse({
    node: { children: treeData },
    currentTreeIndex: -1,
    pathIndex: -1,
    isPseudoRoot: true,
  });

  if (result === RESULT_MISS) {
    throw new Error("No node found at the given path.");
  }

  return result.children;
};

export const ItemType = {
  TREE_NODE: "tree-node",
};

const TreeNode: React.FC<TreeNode> = (props) => {
  const blockoffset: Array<JSX.Element> = [];
  for (let i = 0; i < props.treeIndex; i++) {
    blockoffset.push(
      <div
        key={`block_${i}`}
        style={{
          display: "inline-block",
          width: `${44}px`,
          minHeight: "50px",
        }}
      ></div>
    );
  }
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemType.TREE_NODE,
    item: { ...props },
    // item: { ...props.node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    start: (draggedItem: any, monitor: DragSourceMonitor) => {
      console.log("start", draggedItem, monitor);
    },
    end(draggedItem, monitor: DragSourceMonitor) {
      if (monitor.didDrop()) {
        const dropResult = monitor.getDropResult();
        if (dropResult) {
          // console.log(
          //   `You dropped ${draggedItem.title} into ${dropResult?.node.title}!`
          // );
        }
      }
    },
  }));

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TREE_NODE,
    drop: (draggeditem: TreeNode, monitor) => {
      console.log("draggedItem", draggeditem);
      // draggeditem = monitor.getItem();
      const offSetDifference = monitor.getDifferenceFromInitialOffset()?.x;
      const scaffoldBlockPxWidth = draggeditem?.scaffoldBlockPxWidth || 44;

      let newDepth = draggeditem?.treeIndex;
      if (offSetDifference && scaffoldBlockPxWidth) {
        newDepth = Math.round(offSetDifference / scaffoldBlockPxWidth);
      }
      console.log("newDepth: ", draggeditem.treeIndex + newDepth);
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
      console.log("resorg", res);

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
        const addedNodePrevIdx = draggeditem.path.map((x, i) =>
          i >= idx ? x + 1 + descendantCount : x
        );
        return addedNodePrevIdx;
      }
      const addedNodePrevIdx = getPrevIdx();
      console.log("addedNodePrevIdx: ", addedNodePrevIdx);
      res = changeNodeAtPath({
        treeData: res,
        path: addedNodePrevIdx,
        newNode: undefined,
      });

      props.onChange(res);
      console.log("res: ", res);
    },
    hover: (draggedItem, moniter) => {},
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  drop(ref);
  return (
    <>
      <div
        ref={ref}
        key={props.path.join(".")}
        style={{
          display: "flex",
          justifyItems: "flex-start",
          alignItems: "center",
        }}
      >
        {...blockoffset}
        {/* <DragPreviewImage connect={preview} src={""} /> */}

        <div
          ref={drag}
          key={props.path.join(".")}
          style={{
            display: "inline-block",
            minHeight: "50px",

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
          }}
        >
          {props.parent && <span> parent:''' {props.parent.title}'''</span>}
          tilte:[{props.title}] - id:[{props.id}] - path:[
          {props.path.join(",")}] - treeIndex-{props.treeIndex}
        </div>
        <TreeDragLayer />
      </div>
    </>
  );
};

export default TreeNode;
