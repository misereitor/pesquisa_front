import EventEmitter from 'eventemitter3';

interface MyEvents {
  // eslint-disable-next-line no-unused-vars
  someEvent: (data: unknown) => void;
}
const emitter = new EventEmitter<MyEvents>();

export default emitter;
