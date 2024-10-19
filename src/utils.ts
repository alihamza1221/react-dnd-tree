import { changeNodeAtPathParams, TreeNode, UserTreeNode } from "./types";

export function getDescendantCount({
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

export const changeNodeAtPath = ({
  treeData,
  path,
  newNode,
  ignoreCollapsed = true,
}: changeNodeAtPathParams) => {
  //incase dont find path or specified nodes
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

      // If the result went down the correct path
      if (result !== RESULT_MISS) {
        // If the result was truthy (in this case, an object),
        //  pass it to the next level of recursion up
        if (result) {
          let newNodeToAdd: UserTreeNode = {
            title: result.title,
            children: result.children,
            expanded: result.expanded,
            subtitle: result.subtitle,
          };

          //if want to add as child i.e increase depth
          if (result.addAsChild && result.newNode) {
            return {
              ...node,
              children: [
                ...node.children.slice(0, i),
                {
                  ...node.children[i],
                  children: [
                    ...(node.children[i]?.children || []),
                    { ...newNodeToAdd },
                  ],
                },
                ...node.children.slice(i + 1),
              ],
            };
          } else if (result.newNode) {
            // in case found the node where to add
            return {
              ...node,
              children: [
                ...node.children.slice(0, i + 1),
                { ...newNodeToAdd },
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

      // update treeindex to continue search for path
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

export function isGreaterTreeDepth({
  draggedItemPath,
  targetItemPath,
}: {
  draggedItemPath: number[];
  targetItemPath: number[];
}): { isGreater: boolean; idx: number } {
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
  }
  return { isGreater: false, idx: 0 };
}

export const getMaxDepth = (treeData: TreeNode[]) => {
  let maxDepth = 0;
  const traverse = (node: TreeNode, depth: number) => {
    if (node.children) {
      node.children.forEach((child) => {
        traverse(child, depth + 1);
      });
    }
    maxDepth = Math.max(maxDepth, depth);
  };
  treeData.forEach((node) => {
    traverse(node, 1);
  });
  return maxDepth;
};
