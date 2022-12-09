import { Viewport, IViewportProps, IViewportInfo } from "./viewport";

interface IVirtualListProps extends IViewportProps {
}

export class VirtualList {
  private viewport: Viewport;
  constructor({ scroller, onScrollStart, onScrollEnd }: IVirtualListProps) {
    this.viewport = new Viewport({
      scroller,
      onScrollStart,
      onScroll: this.onScroll.bind(this),
      onScrollEnd
    });
  }

  onScroll(info: IViewportInfo) {
    console.log('onScroll: ', info);
  }
}