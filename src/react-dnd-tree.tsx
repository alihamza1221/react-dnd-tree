import { DndProvider, DndContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TreeNode from "./tree-node-render";
import { TreeNode as typeTreeNode } from "./types";
import DndWrapper from "./wrapper";

import { getMaxDepth } from "./utils";
export const defaultGetNodeKey = ({ treeIndex }: any) => treeIndex;

const ReactDndTree: React.FC<ReactDndTreeProps> = (
  {
    treeData,
    onChange,
    canDrag = true,
    canDrop = undefined,
    canNodeHaveChildren = () => true,
    className = "",
    getNodeKey = ({ node }: { node: any }) => node.id,
    maxDepth = undefined,
    onVisibilityToggle = () => {},
    rowDirection = "ltr",
    style = {},
  },
  ...props
) => {
  let idCount = -1;
  const renderTreeNode = (
    node: typeTreeNode,
    treeIndex: number,
    treeMaxDepth: number,
    parent: typeTreeNode | undefined = undefined,
    prevPath: number[] = [],

    nodes: ReturnType<typeof TreeNode>[] = []
  ) => {
    idCount += 1;
    const path = [...prevPath, idCount];
    nodes.push(
      <TreeNode
        key={path.join(".")}
        {...node}
        children={node.children || []}
        treeIndex={treeIndex}
        id={idCount}
        style={style}
        path={path}
        parent={parent}
        maxDepth={treeMaxDepth}
        scaffoldBlockPxWidth={44}
        canDrag={true}
        treeData={treeData}
        onChange={onChange}
        className={className}
      />
    );
    if (node.children) {
      node.children.forEach((child) => {
        nodes.push(
          ...renderTreeNode(child, treeIndex + 1, treeMaxDepth, node, [...path])
        );
      });
      return nodes;
    }
    return nodes;
  };
  const treeMaxDepth = getMaxDepth(treeData);
  // const [treeDataState, setTreeDataState] = useState(null);
  return (
    <>
      <DndWrapper>
        {treeData.map((node) => renderTreeNode(node, 0, treeMaxDepth))}
      </DndWrapper>
    </>
  );
};
export const DndTreeWithoutDndContext = (props: ReactDndTreeProps) => {
  return (
    <DndContext.Consumer>
      {({ dragDropManager }) =>
        dragDropManager === undefined ? undefined : (
          <ReactDndTree {...props} dragDropManager={dragDropManager} />
        )
      }
    </DndContext.Consumer>
  );
};
export const DndTree = (props: ReactDndTreeProps) => {
  return (
    //@ts-ignore
    <DndProvider debugMode={props.debugMode} backend={HTML5Backend}>
      <DndTreeWithoutDndContext {...props} />
    </DndProvider>
  );
};

type OnMoveNodeParams = {
  treeData: any[];
  node: any;
  nextParentNode: any;
  prevPath: number[];
  prevTreeIndex: number;
  nextPath: number[];
  nextTreeIndex: number;
};

type CanDropParams = {
  node: any;
  prevPath: number[];
  prevParent: any;
  prevTreeIndex: number;
  nextPath: number[];
  nextParent: any;
  nextTreeIndex: number;
};

type OnVisibilityToggleParams = {
  treeData: any[];
  node: any;
  expanded: boolean;
  path: number[];
};

export type ReactDndTreeProps = {
  dragDropManager?: {
    getMonitor: () => unknown;
  };

  // Tree data in the following format:
  // [{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]
  // `title` is the primary label for the node
  // `subtitle` is a secondary label for the node
  // `expanded` shows children of the node if true, or hides them if false. Defaults to false.
  // `children` is an array of child nodes belonging to the node.
  treeData: any[];

  // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
  style?: any;

  // Class name for the container wrapping the tree
  className?: string;

  // Style applied to the inner, scrollable container (for padding, etc.)
  innerStyle?: any;

  // The width of the blocks containing the lines representing the structure of the tree.
  scaffoldBlockPxWidth?: number;

  // Maximum depth nodes can be inserted at. Defaults to infinite.
  maxDepth?: number;

  // Sets the height of a given tree row item in pixels. Can either be a number
  // or a function to calculate dynamically
  rowHeight?: number | ((treeIndex: number, node: any, path: any[]) => number);

  // Determine the unique key used to identify each node and
  // generate the `path` array passed in callbacks.
  // By default, returns the index in the tree (omitting hidden nodes).
  //@ts-ignore
  getNodeKey?: (node) => string;

  // Called whenever tree data changed.
  // Just like with React input elements, you have to update your
  // own component's data to see the changes reflected.
  //@ts-ignore
  onChange: (treeData) => void;

  // Called after node move operation.
  onMoveNode?: (params: OnMoveNodeParams) => void;

  // Determine whether a node can be dragged. Set to false to disable dragging on all nodes.
  canDrag?: boolean;

  // Determine whether a node can be dropped based on its path and parents'.
  canDrop?: (params: CanDropParams) => boolean;

  // Determine whether a node can have children
  //@ts-ignore
  canNodeHaveChildren?: (node) => boolean;

  // Called after children nodes collapsed or expanded.
  onVisibilityToggle?: (params: OnVisibilityToggleParams) => void;

  // rtl support
  rowDirection?: string;
};
