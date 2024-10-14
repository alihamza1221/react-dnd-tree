import React, { useState } from "react";
import DndTree from "../index.ts";
// In your own app, you would need to use import styles once in the app
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

const Barebones: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div
      style={{
        width: "600px",
        height: "700px",
        overflow: "scroll",
        margin: "auto",
        border: "1px solid #888",
        padding: "10px",
      }}
    >
      <DndTree treeData={treeData} onChange={setTreeData} />
    </div>
  );
};

export default Barebones;
