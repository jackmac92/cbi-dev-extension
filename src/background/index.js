// import express from 'express';
import notifier from './notifier';

// const app = express();

// app.get('/restartExt/', (req, res) => {
//   chrome.management.getSelf(ext =>
//     chrome.management.setEnabled(ext.id, false, () =>
//       chrome.management.setEnabled(ext.id, true)
//     )
//   );
// });

chrome.browserAction.onClicked.addListener(() => {
  console.log('reloading');
  chrome.runtime.reload();
});

const config = {
  host: 'localhost',
  port: '7442',
  path: '',
  beat: 1000 * 60
};

const echo = msg => console.log(msg);

class Respond {
  constructor(sock) {
    this.sock = sock;
  }

  send(msg) {
    const msgEncoded = encodeURIComponent(JSON.stringify(msg));
    if (!this.sock) {
      if (
        confirm(
          `Couldn't find websocket, make sure websocket server is running locally, and click ok to reconnect`
        )
      ) {
        chrome.runtime.reload();
      }
    }
    return this.sock.send(msgEncoded);
  }
}

const requestHandler = (responder, msg) => {
  console.log(arguments);
  return 0;
};

class WebsocketWrapper {
  constructor() {
    this.count = 0;
    let that = this;
    if (!('WebSocket' in window)) {
      return echo(`No websocket in window, I'm out`);
    }
    if (
      !(this.sock = new WebSocket(
        'ws://' + config.host + ':' + config.port + '/'
      ))
    ) {
      echo('Could not create WebSocket: exiting');
      return;
    }
    this.sock.onopen = () => {
      echo('connected');
      that.respond = new Respond(that.sock);
      that.respond.send(['connected']);
      chrome.runtime.onConnect.addListener(connected);
      return (that.interval = setInterval(() => {
        return that.respond.send(`heartbeat ${++that.count}`);
      }, config.beat));
    };
    this.sock.onmessage = event => {
      const msg = JSON.parse(decodeURIComponent(event.data));
      return requestHandler(that.respond, msg);
    };
    this.sock.onerror = () => {
      return that.sock.close();
    };
    this.sock.onclose = () => {
      return that.close();
    };
  }
  close() {
    var that = this;
    if (this.interval) {
      clearInterval(this.interval);
    }
    ['interval', 'respond', 'sock'].forEach(attribute => {
      delete that[attribute];
    });
    setTimeout(() => new WebsocketWrapper(), config.beat);
  }
}

const ws = new WebsocketWrapper();

const connected = comPort => {
  comPort.postMessage('Background server connected');

  let r = new Respond(ws.sock);

  comPort.onMessage.addListener(m => notifier(m, () => r.send(m)));
};
