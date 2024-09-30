import { DndProvider, DndContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


const ReactDndTree = (props) => {};
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

export type ReactDndTreeProps {
    dragDropManager?: {
        getMonitor: () => unknown
      }
    
      // Tree data in the following format:
      // [{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]
      // `title` is the primary label for the node
      // `subtitle` is a secondary label for the node
      // `expanded` shows children of the node if true, or hides them if false. Defaults to false.
      // `children` is an array of child nodes belonging to the node.
      treeData: any[]
    
      // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
      style?: any
    
      // Class name for the container wrapping the tree
      className?: string
    
      // Ref for virtua component
      // Use virtuaRef when you want to use virtua handler
      // (ex. scrollTo scrollToIndex)
      virtuaRef?: React.Ref<VListHandle>
    
      // Style applied to the inner, scrollable container (for padding, etc.)
      innerStyle?: any
    
      // Size in px of the region near the edges that initiates scrolling on dragover
      slideRegionSize?: number
    
      // The width of the blocks containing the lines representing the structure of the tree.
      scaffoldBlockPxWidth?: number
    
      // Maximum depth nodes can be inserted at. Defaults to infinite.
      maxDepth?: number
    
      // The method used to search nodes.
      // Defaults to a function that uses the `searchQuery` string to search for nodes with
      // matching `title` or `subtitle` values.
      // NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.
      searchMethod?: (params: SearchParams) => boolean
    
      // Used by the `searchMethod` to highlight and scroll to matched nodes.
      // Should be a string for the default `searchMethod`, but can be anything when using a custom search.
      searchQuery?: string
    
      // Outline the <`searchFocusOffset`>th node and scroll to it.
      searchFocusOffset?: number
    
      // Get the nodes that match the search criteria. Used for counting total matches, etc.
      searchFinishCallback?: (params: SearchFinishCallbackParams) => void
    
      // Generate an object with additional props to be passed to the node renderer.
      // Use this for adding buttons via the `buttons` key,
      // or additional `style` / `className` settings.
      generateNodeProps?: (params: GenerateNodePropsParams) => any
    
      treeNodeRenderer?: any
    
      // Override the default component for rendering nodes (but keep the scaffolding generator)
      // This is an advanced option for complete customization of the appearance.
      // It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
      nodeContentRenderer?: any
    
      // Override the default component for rendering an empty tree
      // This is an advanced option for complete customization of the appearance.
      // It is best to copy the component in `placeholder-renderer-default.js` to use as a base,
      // and customize as needed.
      placeholderRenderer?: any
    
      theme?: {
        style: any
        innerStyle: any
        scaffoldBlockPxWidth: number
        slideRegionSize: number
        treeNodeRenderer: any
        nodeContentRenderer: any
        placeholderRenderer: any
      }
    
      // Sets the height of a given tree row item in pixels. Can either be a number
      // or a function to calculate dynamically
      rowHeight?: number | ((treeIndex: number, node: any, path: any[]) => number)
    
      // Determine the unique key used to identify each node and
      // generate the `path` array passed in callbacks.
      // By default, returns the index in the tree (omitting hidden nodes).
      getNodeKey?: (node) => string
    
      // Called whenever tree data changed.
      // Just like with React input elements, you have to update your
      // own component's data to see the changes reflected.
      onChange: (treeData) => void
    
      // Called after node move operation.
      onMoveNode?: (params: OnMoveNodeParams) => void
    
    
      // Determine whether a node can be dragged. Set to false to disable dragging on all nodes.
      canDrag?: (params: GenerateNodePropsParams) => boolean
    
      // Determine whether a node can be dropped based on its path and parents'.
      canDrop?: (params: CanDropParams) => boolean
    
      // Determine whether a node can have children
      canNodeHaveChildren?: (node) => boolean
    
    
      // Called after children nodes collapsed or expanded.
      onVisibilityToggle?: (params: OnVisibilityToggleParams) => void
    
      // Specify that nodes that do not match search will be collapsed
      onlyExpandSearchedNodes?: boolean
    
      // rtl support
      rowDirection?: string
}
