import React, { useState } from "react";
import DndTree from "../index.ts";
// import 'react-sortable-tree/styles.css';

const data = [
  {
    title: " 1",
    expanded: true,
    children: [
      {
        title: " 1.1",
        expanded: true,
        children: [
          {
            title: " 1.1.1",
          },
          {
            title: " 1.1.2",
          },
        ],
      },
    ],
  },
  {
    title: " 2",
    expanded: true,
    children: [
      {
        title: " 2.1",
        expanded: true,
        children: [
          {
            title: " 2.1.1",
          },
          {
            title: " 2.1.2",
          },
        ],
      },
    ],
  },
  {
    title: " 3",
    expanded: true,
    children: [
      {
        title: " 3.1",
        expanded: true,
        children: [
          {
            title: " 3.1.1",
          },
          {
            title: " 3.1.2",
          },
        ],
      },
    ],
  },
];

const customStyle: React.CSSProperties = {
  width: "400px",
  font: "Arial",
  fontSize: "20px",
  backgroundColor: "lightyellow",
  border: "1px solid black",
  borderRadius: "2px",
  padding: "3px",
  margin: "5px",
  display: "flex",
  justifyContent: "start",
};
const Barebones: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div
      style={{
        overflow: "scroll",
        margin: "auto",
        border: "1px solid #888",
        padding: "10px",
        width: "700px",
        height: "600px",
      }}
    >
      <DndTree treeData={treeData} onChange={setTreeData} style={customStyle} />
    </div>
  );
};

export default Barebones;
