import React from "react";
export type TreeNode = {
  children?: TreeNode[];
  id?: string;
  title: string;
  subtitle?: string;
  path: number[];
  expanded?: boolean;
  canHaveChildren?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
  parentNode?: TreeNode;
  rowAbove?: TreeNode;
  treeIndex?: number;
  index?: number;
  scaffoldBlockPxWidth?: number;
  maxDepth?: number;
  minDepthWidth?: number;
};

export const ItemType = {
  TREE_NODE: "tree-node",
};
const TreeNode = () => {
  return <div></div>;
};

export default TreeNode;
