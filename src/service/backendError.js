import EventEmitter from "eventemitter3";

const emitter = new EventEmitter();
export function onBackendError(callback) {
  emitter.on("backendError", callback);
  return () => emitter.off("backendError", callback);
}

export function triggerBackendError(error) {
    emitter.emit("backendError", error);
}

export function onTokenError(callback) {
  emitter.on("tokenError", callback);
  return () => emitter.off("tokenError", callback);
}

export function triggerTokenError(error) {
  emitter.emit("tokenError", error);
}
