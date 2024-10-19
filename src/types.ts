export type UserTreeNode = {
  title: string;
  subtitle: string | undefined;
  expanded: string | undefined;
  children: Array<UserTreeNode> | [];
};
export const ItemType = {
  TREE_NODE: "tree-node",
};
export type TreeNode = {
  children: TreeNode[];
  id: number;
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

export type changeNodeAtPathParams = {
  treeData: TreeNode[];
  path: number[];
  newNode: any | undefined;
  ignoreCollapsed?: boolean;
};
