import { LayoutNode, LayoutNodeConfig } from "./layout-node";

export interface ILayoutTreeProps {
  layoutNodeConfigs: LayoutNodeConfig[];
}

export class LayoutTree {
  layoutNodes: LayoutNode[] = [];

  constructor({ layoutNodeConfigs }: ILayoutTreeProps) {
    this.generateLayoutNodes(layoutNodeConfigs);
  }

  generateLayoutNodes(layoutNodeConfigs: LayoutNodeConfig[]) {
    layoutNodeConfigs.forEach(config => {
      this.layoutNodes.push(new LayoutNode(config));
    });
  }

  getNodesByRange(top: number, bottom: number) {
    let currTop = 0;
    let preNode: LayoutNode | null = null;
    const activeNodes: LayoutNode[] = [];
    let aboveHeight = 0;
    let belowHeight = 0;

    for (const node of this.layoutNodes) {
      const currMarginTop = preNode ? Math.max(preNode.marginBottom, node.marginTop) : 0;
      const currHeight = currMarginTop + node.height;
      const currBottom = currTop + currHeight;

      if (currTop > bottom) {
        belowHeight += currHeight;
      } else if (currTop <= bottom && currBottom >= top) {
        activeNodes.push(node);
      } else {
        aboveHeight = currTop;
      }

      preNode = node;
      currTop = currBottom;
    }

    return {
      activeNodes,
      aboveHeight,
      belowHeight,
    };
  }
}