import React, { useRef } from "react";
import { useDrag, DragSourceMonitor, useDrop, XYCoord } from "react-dnd";

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
    console.log(
      "pathId: ",
      path[pathIndex],
      "curTreeidx:",
      currentTreeIndex,
      console.log(node)
    );

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
      if (node.children[i]?.isAdded === true) {
        console.log("conitnue....", node.children[i]);
        node.children[i].isAdded = false;
        continue;
      }
      //@ts-ignore
      const result = traverse({
        node: node.children[i],
        currentTreeIndex: nextTreeIndex,
        pathIndex: pathIndex + 1,
      });

      // If the result went down the correct path
      if (result !== RESULT_MISS) {
        if (result) {
          // If the result was truthy (in this case, an object),
          //  pass it to the next level of recursion up
          console.log(
            "i: ",
            i,
            "...node",
            node,
            "node.children.slice[0, i]: ",
            node.children.slice(0, i),
            "result: ",
            result,
            "node.children.slice[i + 1]: ",
            node.children.slice(i + 1)
          );
          const temp = {res:{
            ...node,
            children: [
              ...node.children.slice(0, i +1),
              result,
              ...node.children.slice(i + 1),
            ],
          }, status: "Updated"};
          console.log("temp: ", temp, "i: ", i);
          return {res:{
            ...node,
            children: [
              ...node.children.slice(0, i +1),
              result,
              ...node.children.slice(i + 1),
            ],
          }, status: "Updated"};
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

      const temp = nextTreeIndex;
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

  console.log("res org: ", result.children);
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
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TREE_NODE,
    item: { ...props },
    // item: { ...props.node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TREE_NODE,
    drop: (draggeditem: TreeNode, monitor) => {
      draggeditem = monitor.getItem();
      const offSetDifference = monitor.getDifferenceFromInitialOffset()?.x;
      const scaffoldBlockPxWidth = draggeditem?.scaffoldBlockPxWidth || 44;

      let newDepth = draggeditem?.treeIndex;
      if (offSetDifference && scaffoldBlockPxWidth) {
        newDepth = Math.round(offSetDifference / scaffoldBlockPxWidth);
      }
      if (!props.treeData) return;

      const draggedItem = { ...draggeditem, isAdded: true };
      let res = changeNodeAtPath({
        treeData: props.treeData,
        path: props.path,
        newNode: draggedItem,
      });

      res = changeNodeAtPath({
        treeData: res,
        path: draggeditem.path,
        newNode: undefined,
      });

      console.log("onchange:", props.onChange);

      props.onChange(res);
      console.log("res: ", res);
    },
    // hover: (draggedItem, moniter) => {
    //   if (!ref.current) return;
    //   const hoverBoundingRect = ref.current?.getBoundingClientRect();

    //   // Get vertical middle
    //   const hoverMiddleY =
    //     (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    //   const clientOffset = moniter.getClientOffset() as XYCoord;

    //   const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    //   const hoverId = props.node.id;
    //   if (!hoverId || !draggedItem.id) return;
    //   if (hoverId < draggedItem.id && hoverClientY < hoverMiddleY) return;
    //   if (hoverId > draggedItem.id && hoverClientY > hoverMiddleY) return;

    //   console.log("hovering...");
    //   // get cur difference b/w initial and current position in x-axis

    //   let clientDepthoffset =
    //     moniter.getDifferenceFromInitialOffset() as XYCoord;

    //   const initialClientOffset = moniter.getInitialClientOffset() as XYCoord;

    //   if (clientOffset.x > initialClientOffset.x) {
    //     if (draggedItem?.minDepthWidth)
    //       clientDepthoffset.x += draggedItem?.minDepthWidth;
    //   }

    //   let scaffoldBlockPxWidth = draggedItem?.scaffoldBlockPxWidth || 44;
    //   const curMinDepth =
    //     (clientDepthoffset as XYCoord).x / scaffoldBlockPxWidth;

    //   if (curMinDepth < 0) return;
    //   //get max depth
    // },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  drop(ref);
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyItems: "flex-start",
        alignItems: "center",
      }}
    >
      {...blockoffset}
      <div
        ref={drag}
        style={{
          display: "inline-block",
          minHeight: "50px",
          backgroundColor: "gray",
          border: "1px solid black",
          borderRadius: 5,
          padding: 10,
          margin: 2,
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {props.parent && <span> parent: {props.parent.title}</span>}
        tilte:{props.title} - id:{props.id} - path:[{props.path.join(",")}] -
        treeIndex: {props.treeIndex}
      </div>
    </div>
  );
};

export default TreeNode;
