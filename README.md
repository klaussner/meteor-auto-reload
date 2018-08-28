# Meteor `auto-reload`

Auto-reloading without Minimongo and DDP (proof of concept).

# Meteor Tool

The Meteor tool always restarts the server on code changes if the `autoupdate` package is not included in the project, even if the changes only affect clients.
With a small change in [`tools/runners/run-app.js`](https://github.com/meteor/meteor/blob/a52a2c28f148c6136ce5ddccade9d141fd1baf0e/tools/runners/run-app.js#L654-L655), this package can intercept `{ refresh: "client" }` messages sent to the server and trigger client reloads:

```diff
var canRefreshClient = self.projectContext.packageMap &&
-  self.projectContext.packageMap.getInfo('autoupdate');
+  self.projectContext.packageMap.getInfo('auto-reload');
```

# Limitations

- For development only (doesn't support hot code push for Cordova apps).
- Reloads the page on CSS changes (`autoupdate` inserts a `<link>` tag with new CSS instead).
