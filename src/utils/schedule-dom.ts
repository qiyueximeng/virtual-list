type ITaskId = number;
type ITaskFn = () => void;
type ITask = [ITaskId, ITaskFn];
type ICatchFn = (e: Error | unknown) => void;

export class ScheduleDom {
  private nextId: ITaskId = 1;
  private reads: ITask[] = [];
  private writes: ITask[] = [];
  private afterReads: ITask[] = [];
  private caches: ICatchFn[] = [];
  private needRun = false;

  constructor() {
    console.log('>>> ScheduleDom init');
  }

  private get id() {
    return this.nextId++;
  }

  private flush() {
    if (!this.needRun) {
      this.needRun = true;
      requestAnimationFrame(this.run.bind(this));
    }
  }

  read(fn: ITaskFn, ctx?: any) {
    ctx && (fn = fn.bind(ctx));
    const id = this.id;
    this.reads.push([id, fn]);
    this.flush();
    return id;
  }

  write(fn: ITaskFn, ctx?: any) {
    ctx && (fn = fn.bind(ctx));
    const id = this.id;
    this.writes.push([id, fn]);
    this.flush();
    return id;
  }

  afterRead(fn: ITaskFn, ctx?: any) {
    ctx && (fn = fn.bind(ctx));
    const id = this.id;
    this.afterReads.push([id, fn]);
    this.flush();
    return id;
  }

  catch(fn: ICatchFn, ctx: any) {
    ctx && (fn = fn.bind(ctx));
    this.caches.push(fn);
  }

  runTask(tasks: ITask[]) {
    while (tasks.length) {
      const [, taskFn] = tasks.shift()!;
      taskFn();
    }
  }

  run() {
    try {
      // first read
      this.runTask(this.reads);
      // then write
      this.runTask(this.writes);
      // finally read after browser paint
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = () => {
        this.runTask(this.afterReads);
      };
      messageChannel.port2.postMessage(undefined);
    } catch (e) {
      this.caches.forEach(fn => {
        fn(e);
      });
    } finally {
      this.needRun = false;
      if (this.reads.length || this.writes.length) {
        this.flush();
      }
    }
  }
}

export const scheduleDom = new ScheduleDom();
