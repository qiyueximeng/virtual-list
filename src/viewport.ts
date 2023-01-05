import { debounce } from './utils';

export interface IViewportInfo {
  top: number; // scroller's scrollTop
  height: number; // scroller height
}

export interface IViewportProps {
  scroller: HTMLDivElement;
  onScrollStart: (info: IViewportInfo) => void;
  onScrollEnd: (info: IViewportInfo) => void;
  updateViewport: (info: IViewportInfo) => void;
}

const SCROLL_END_DEBOUNCE_TIME = 300;

/**
 * TODO: 
 * 1. add scroller resize observe
 */
export class Viewport {
  private scrolling = false;
  private scroller: IViewportProps['scroller'];
  private onScrollStart: IViewportProps['onScrollStart'];
  private updateViewport: IViewportProps['updateViewport'];
  private onScrollEnd: IViewportProps['onScrollEnd'];
  private scrollTop = 0;
  private height = 0;

  get info() {
    return {
      top: this.scrollTop,
      height: this.height,
    }
  }

  constructor({
    scroller,
    onScrollStart,
    updateViewport,
    onScrollEnd
  }: IViewportProps) {
    this.scroller = scroller;
    this.onScrollStart = onScrollStart;
    this.updateViewport = updateViewport;
    this.onScrollEnd = onScrollEnd;

    this.height = this.scroller.offsetHeight;
    this.bindEvent('on');
    this.updateViewport(this.info);
  }

  bindEvent(action: 'on' | 'off') {
    if (action === 'on') {
      this.scroller.addEventListener('scroll', this.handleScroll.bind(this));
    } else {
      this.scroller.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  private handleScroll() {
    this.scrollTop = this.scroller.scrollTop;
    if (!this.scrolling) {
      this.scrollStart();
    }

    this.updateViewport(this.info);

    this.scrollEnd();
  }

  private scrollStart() {
    this.scrolling = true;
    this.onScrollStart(this.info);
  }

  private scrollEnd = debounce(() => {
    this.scrolling = false;
    this.onScrollEnd(this.info);
  }, SCROLL_END_DEBOUNCE_TIME);
}
