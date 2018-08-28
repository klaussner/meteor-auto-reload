Package.describe({
  name: "auto-reload",
  summary: "Auto-reloading without Minimongo and DDP (proof of concept).",
  version: "0.1.0",
  debugOnly: true
});

Package.onUse(function (api) {
  api.use([
    "ecmascript",
    "random",
    "webapp"
  ]);

  api.mainModule("client.js", "client");
  api.mainModule("server.js", "server");
});
