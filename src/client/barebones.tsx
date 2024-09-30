import React, { Children, useState } from "react";
import DndTree from "../react-dnd-tree";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const data = [
  {
    title: "tree idx 1",
    expanded: true,
    children: [
      {
        title: "tree idx 2",
        expanded: false,
        children: [{ title: "expanded false no move " }],
      },
      {
        title: "tree idx 2",
        expanded: true,
        children: [
          {
            title: "tree idx 3",
            expanded: true,
            children: [
              {
                title: "tree idx 4",
                expanded: true,
                children: [
                  {
                    title: "tree idx 5",
                    expanded: true,
                    children: [
                      {
                        title: "tree idx 6",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const Barebones: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div style={{ height: 300, width: 700 }}>
      <SortableTree treeData={treeData} onChange={setTreeData} />
    </div>
  );
};

export default Barebones;
