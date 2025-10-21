import EventEmitter from "eventemitter3";

const emitter = new EventEmitter();
export function onBackendError(callback) {
  emitter.on("backendError", callback);
  return () => emitter.off("backendError", callback);
}

export function triggerBackendError(error) {
    emitter.emit("backendError", error);
}
