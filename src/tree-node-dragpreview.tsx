import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { TreeNode } from "./types";

const styles: CSSProperties = {
  display: "inline-block",
  minHeight: "50px",
  minWidth: "300px",
  background: "#f5ebe0",
  border: "1px solid #d3c4f5",
  borderRadius: 2,
  padding: 6,

  opacity: 1,
};

export interface TreeNodeDragPreviewState {
  style?: CSSProperties;
}

const TreeNodeDragPreview: FC<TreeNode> = memo(function TreeNodeDragPreview(
  props
) {
  return (
    <div style={{ ...styles, ...props.style }}>
      <TreeNodePreview {...props} preview />
    </div>
  );
});

export default TreeNodeDragPreview;

const Previewstyles: CSSProperties = {
  cursor: "move",
};
const combinedStyles = { ...Previewstyles };

const TreeNodePreview: FC<TreeNode & { preview: any }> = memo(function Box(
  props
) {
  return (
    <div
      style={{ ...combinedStyles }}
      role={props.preview ? "TreeNodePreview" : "TreeNode"}
    >
      Title: {props.title}
      <br />
      {props.subtitle && `Subtitle: ${props.subtitle}`}
    </div>
  );
});
