# React Dnd Tree

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Your sortable react dnd tree with close to no dependancies using react-dnd. 
Easy to integrate tree structre inside your next project

## Getting Started

### Installation

You can install the package using npm or yarn:

```bash
# NPM
npm install react-dnd-tree --save

# YARN
yarn add react-dnd-tree
```

```jsx
// You can import the default tree with dnd context
import DndTree from "../index.ts";
// Or you can import the tree without the dnd context as a named export. 
import { DndTreeWithoutDndContext } from "../index.ts";
// you can provide your own custom sytles
const customStyle = {} // optional
const treeData: TreeNode = [] // * req


```

```jsx
 type TreeNode = {
  children: TreeNode[];
  title: string;
  subtitle?: string;
  expanded?: boolean;
};
```

### Usage

```jsx
import React, { useState } from "react";
import DndTree from "../index.ts";

const data = [
  {
    title: " 1",
    expanded: true,
    children: [
      {
        title: " 1.1",
        expanded: true,
      },
    ],
  },
  {
    title: " 2",
    expanded: true,
  },
];

const Barebones: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div
      style={{
        overflow: "scroll",
        border: "1px solid #888",
        width: "700px",
        height: "600px",
      }}
    >
      <DndTree treeData={treeData} onChange={setTreeData} style={{}} />
    </div>
  );
};

export default Barebones;

```
## Project Overview

![Project Screenshot](https://github.com/alihamza1221/react-dnd-tree/blob/main/public/image.png)

