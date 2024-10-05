import React, { useState } from "react";
import { DndTree } from "../react-dnd-tree";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const data = [
  {
    title: "Parent 1",
    expanded: true,
    children: [
      {
        title: "Parent 1.1",
        expanded: true,
        children: [
          {
            title: "Parent 1.1.1",
          },
          {
            title: "Parent 1.1.2",
          },
        ],
      },
    ],
  },
  {
    title: "Parent 2",
    expanded: true,
    children: [
      {
        title: "Parent 2.1",
        expanded: true,
        children: [
          {
            title: "Parent 2.1.1",
          },
          {
            title: "Parent 2.1.2",
          },
        ],
      },
    ],
  },
  {
    title: "Parent 3",
    expanded: true,
    children: [
      {
        title: "Parent 3.1",
        expanded: true,
        children: [
          {
            title: "Parent 3.1.1",
          },
          {
            title: "Parent 3.1.2",
          },
        ],
      },
    ],
  },
];

const Barebones: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div>
      <DndTree treeData={treeData} onChange={setTreeData} />
    </div>
  );
};

export default Barebones;
