The webpack setup is a little weird.

For local dev, configs for injectScripts and mainApp must be served separately as the mainApp is served through the httppolyglot server, but the injectScripts can't be srced from a dev server.

For prod, the configs are served together as an array

I don't really get what the stuff in the replace folder is doing, but everything breaks without it.
