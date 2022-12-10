export interface LayoutNodeConfig {
  id: string;
  height: number;
  marginTop?: number;
  marginBottom?: number;
}

export class LayoutNode {
  id: string;
  height = 0;
  marginTop = 0;
  marginBottom = 0;

  prevNode: LayoutNode;
  nextNode: LayoutNode;

  constructor({ id, height, marginTop, marginBottom }: LayoutNodeConfig) {
    this.id = id;
    this.height = height;
    marginTop && (this.marginTop = marginTop);
    marginBottom && (this.marginBottom = marginBottom);
  }
}