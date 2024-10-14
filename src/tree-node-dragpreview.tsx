import type { CSSProperties, FC } from "react";
import { memo, useEffect, useState } from "react";
import { TreeNode } from "./tree-node-render";

const styles: CSSProperties = {
  display: "inline-block",
  minHeight: "50px",

  background: "#f5ebe0",
  border: "1px solid #d3c4f5",
  borderRadius: 2,
  padding: 6,

  opacity: 1,
  outline: "4px solid rgba(72, 163, 99, 0.1)",

  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

export interface TreeNodeDragPreviewState {
  tickTock: any;
}

const TreeNodeDragPreview: FC<TreeNode> = memo(function TreeNodeDragPreview(
  props
) {
  return (
    <div style={styles}>
      <TreeNodePreview {...props} preview />
    </div>
  );
});

export default TreeNodeDragPreview;

const Previewstyles: CSSProperties = {
  cursor: "move",
};

const TreeNodePreview: FC<TreeNode & { preview: any }> = memo(function Box(
  props
) {
  return (
    <div
      style={{ ...Previewstyles }}
      role={props.preview ? "TreeNodePreview" : "TreeNode"}
    >
      {props.parent && <span> parent:''' {props.parent.title}'''</span>}
      tilte:[{props.title}] - id:[{props.id}] - path:[
      {props.path.join(",")}] - treeIndex-{props.treeIndex}
    </div>
  );
});
