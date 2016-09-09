(() => {

  const config = {
    host: "localhost",
    port: "7442",
    path: "",
    beat: 5000
  };

  const echo = (msg) => {
    return console.log(msg);
  }

  class Respond {
    constructor(sock) {
      this.sock = sock;
    }

    send(msg) {
      const msgEncoded = encodeURIComponent(JSON.stringify(msg))
      if (!(this.sock)) {
        alert("Couldn't find websocket")
      }
      return this.sock.send(msgEncoded)
    }
  }

  const requestHandler = (responder, msg) => {
    self = func = window;
    console.log(msg)
    console.log("handled")
    responder.send("Got your message")
    return 0
  };

  let serverCount = 0;

  class WebsocketWrapper {
    constructor() {
      let that = this;
      this.count = 0
      echo(`Starting ${++serverCount}`)
      if (!("WebSocket" in window)) {
        return echo("No websocket in window, I'm out")
      }
      if (!(this.sock = new WebSocket("ws://" + config.host + ":" + config.port + "/"))) {
        echo("Could not create WebSocket: exiting");
        return;
      }
      this.sock.onopen = function() {
        echo("connected");
        that.respond = new Respond(that.sock);
        that.respond.send(["connected"]);
        chrome.runtime.onConnect.addListener(connected)
        return that.interval = setInterval( () => {
          return that.respond.send(`heartbeat ${++that.count}`);
        }, config.beat);
      };
      this.sock.onmessage = function(event) {
        const msg = JSON.parse(decodeURIComponent(event.data));
        return requestHandler(that.respond, msg);
      };
      this.sock.onerror = function() {
        return that.sock.close();
      };
      this.sock.onclose = function() {
        return that.close();
      };
    }
    close() {
      var that = this;
      if (this.interval) {
        clearInterval(this.interval);
      }
      ["interval", "respond", "sock"].forEach((attribute) => {
        delete that[attribute];
      });
      return setTimeout((function() {
        var ws;
        return ws = new WebsocketWrapper();
      }), config.beat);
    }

  }

  const ws = new WebsocketWrapper();

  const notifier = (m, action) => {
    switch (m.action) {
      case "jenkinsScreenshot":
        title = "Found Screenshots"
        subTitle = "Click to download"
        break;
      case "reviewInfo":
        title = "Found Review Info"
        subTitle = "Click to setup review branches locally"
        break;
      case "testScreenshot":
        title = "Found Screenshot for test"
        subTitle = "Click to download"
        break;
      default:
        title = "Found something"
        subTitle = "Click to do stuff"
    }
    notificationOpts = {
        type: "basic",
        title: title,
        message: subTitle,
        iconUrl: "http://www.cbinsights.com/favicon.ico"
    }
    // notificationId = `${m.action}-${new Date() / 1000}`
    chrome.notifications.create(notificationOpts, (createId) => {
      var handler = (id) => {
        if (id === createId) {
          action()
          chrome.notifications.clear(id)
          chrome.notifications.onClicked.removeListener(handler)
        }
      }
      chrome.notifications.onClicked.addListener(handler)
    })
  }


  const connected = (comPort) => {
    comPort.postMessage(("Background server connected"))

    let r = new Respond(ws.sock)

    comPort.onMessage.addListener((m) => {
      notifier(m, () => {
        r.send(m)
      })
    })
  }

}).call(this)
