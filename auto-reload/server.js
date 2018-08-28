import { WebApp, WebAppInternals } from "meteor/webapp";
import { Random } from "meteor/random";
import { ssePath } from "./common.js";

const responses = new Map;
let clientHash;

function sendClientHash(res) {
  res.write(`data: ${clientHash}\n\n`);
  res.flush();
}

function updateClientHash() {
  clientHash
    = __meteor_runtime_config__.clientHash
    = WebApp.clientHash();
}

Meteor.startup(() => {
  updateClientHash();
});

WebApp.connectHandlers.use(ssePath, (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });

  const clientId = Random.id();

  responses.set(clientId, res);
  sendClientHash(res);

  // Send a heartbeat message (zero-length comment) every ten seconds
  // to keep the connection alive.
  setInterval(() => {
    res.write(":\n\n");
    res.flush();
  }, 10000);

  req.on("end", () => {
    responses.delete(clientId);
  });

  req.on("close", () => {
    responses.delete(clientId);
  });
});

process.on("message", Meteor.bindEnvironment(function (message) {
  if (!(message && message.refresh === "client")) {
    return;
  }

  updateClientHash();

  // Load the new client bundle.
  WebAppInternals.reloadClientPrograms();
  WebAppInternals.generateBoilerplate();

  responses.forEach((res) => {
    sendClientHash(res);
  });
}));

// If the Meteor tool terminates the server (e.g., after a server code
// change), signal to all clients that no more data will be sent.
process.on("SIGTERM", function () {
  responses.forEach((res) => {
    res.end();
  });
});
