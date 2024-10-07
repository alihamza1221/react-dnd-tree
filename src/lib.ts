var counter = 0;
export function getDescendantCount({
  node,
  ignoreCollapsed = true,
}: {
  node: any;
  ignoreCollapsed: boolean;
}): number {
  console.log("count", counter++, "node:", node);
  if (!node.children || (ignoreCollapsed && node.expanded === false)) {
    return 0;
  }

  let count = 0;
  for (let i = 0; i < node.children.length; i++) {
    count +=
      1 + getDescendantCount({ node: node.children[i], ignoreCollapsed });
  }

  return count;
}
