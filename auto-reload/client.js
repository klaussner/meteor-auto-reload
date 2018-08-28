import { ssePath } from "./common.js";

const source = new EventSource(ssePath);

source.addEventListener("message", ({ data }) => {
  if (data !== __meteor_runtime_config__.clientHash) {
    // Should the `reload` package be used here?
    window.location.reload();
  }
});
