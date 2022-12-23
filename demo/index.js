import { VirtualList } from '../dist/index.js';

const scroller = document.querySelector('#scroller');

const config = mockConfig();

const virtualList = new VirtualList({
  scroller,
  config,
  itemGenerator,
  onScrollStart() {
    console.log('on scroll start');
  },
  onScrollEnd() {
    console.log('on scroll end');
  }
});

console.log('virtualList:', virtualList);

function mockItems($list) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 100; i++) {
    const $item = document.createElement('div');
    $item.style.height = '30px';
    $item.innerHTML = i;
    frag.appendChild($item);
  }
  $list.innerHTML = '';
  $list.appendChild(frag);
}

function mockConfig() {
  const layoutNodeConfigs = new Array(100).fill(0).map((_, idx) => ({
    id: idx,
    height: 30,
    marginTop: 0,
    marginBottom: 0,
  }));

  return {
    buffer: 250,
    layoutNodeConfigs,
  };
}

function itemGenerator({ id }) {
  const $item = document.createElement('div');
  $item.style.height = '30px';
  $item.innerHTML = id;
  return $item;
}