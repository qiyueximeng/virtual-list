import { Viewport, IViewportProps, IViewportInfo } from "./viewport";
import { ILayoutTreeProps, LayoutNode, LayoutTree } from './render';


interface IVirtualListConfig extends Pick<ILayoutTreeProps, 'layoutNodeConfigs'> {
  buffer?: number;
}

interface IVirtualListProps extends IViewportProps {
  config: IVirtualListConfig;
  itemGenerator: (item: Pick<LayoutNode, 'id'>) => HTMLElement;
}

export class VirtualList {
  private viewport: Viewport;
  private layoutTree: LayoutTree;
  private buffer: number;
  private itemGenerator: (item: Pick<LayoutNode, 'id'>) => HTMLElement;
  private caches: Map<LayoutNode['id'], HTMLElement> = new Map();
  private $list: HTMLDivElement;
  private $placeholders: HTMLDivElement[] = []

  constructor({
    scroller,
    onScrollStart,
    onScrollEnd,
    config: { buffer, layoutNodeConfigs },
    itemGenerator
  }: IVirtualListProps) {
    this.initListElm();

    scroller.appendChild(this.$list);
    this.buffer = buffer ?? (document.body.offsetHeight / 2);
    this.layoutTree = new LayoutTree({ layoutNodeConfigs });
    this.itemGenerator = itemGenerator;
    this.viewport = new Viewport({
      scroller,
      onScrollStart,
      updateViewport: this.updateViewport.bind(this),
      onScrollEnd
    });
  }

  private initListElm() {
    this.$list = document.createElement('div');
    this.$list.style.position = 'relative';
    return this.$list;
  }

  updateViewport(info: IViewportInfo) {
    const renderRange = this.layoutTree.getNodesByRange(Math.max(0, info.top - this.buffer), info.top + info.height + this.buffer);
    this.paint(renderRange);
  }

  paint(renderRange: ReturnType<LayoutTree['getNodesByRange']>) {
    const activeElements = this.render(renderRange);
    this.mount(activeElements);
  }

  render({ aboveHeight, belowHeight, activeNodes }: ReturnType<LayoutTree['getNodesByRange']>) {
    const elms: HTMLElement[] = [];
    let [aboveElm, belowElm] = this.$placeholders;
    if (!aboveElm) {
      aboveElm = document.createElement('div');
      this.$placeholders[0] = aboveElm;
    }
    aboveElm.style.height = `${aboveHeight}px`;
    elms.push(aboveElm);
    activeNodes.forEach(({ id }) => {
      let item = this.caches.get(id);
      if (!item) {
        item = this.itemGenerator({ id });
        this.caches.set(id, item);
      }
      elms.push(item);
    });
    if (!belowElm) {
      belowElm = document.createElement('div');
      this.$placeholders[1] = belowElm;
    }
    belowElm.style.height = `${belowHeight}px`;
    elms.push(belowElm);

    return elms;
  }

  mount(elms: HTMLElement[]) {
    const frag = document.createDocumentFragment();
    elms.forEach(elm => {
      frag.appendChild(elm);
    });
    this.$list.innerHTML = '';
    this.$list.appendChild(frag);
  }
}