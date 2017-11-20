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
  port: '7443',
  path: '',
  beat: 1000 * 60,
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
        confirm(`Couldn't find websocket, make sure websocket server is running locally, and click ok to reconnect`)
      ) {
        chrome.runtime.reload();
      }
    }
    return this.sock.send(msgEncoded);
  }
}

const requestHandler = (responder, msg) => {
  let target = window;
  msg.path.split('.').forEach(piece => {
    try {
      target = target[piece];
    } catch (e) {
      responder.send(e);
      throw e;
    }
  });
  if (typeof target === 'function') {
    target(...request.args, responder.send);
  } else {
    responder.send('idk');
  }
};

class WebsocketWrapper {
  constructor() {
    let that = this;
    this.sock = new WebSocket('ws://' + config.host + ':' + config.port + '/');
    this.sock.onopen = () => {
      echo('connected');
      that.respond = new Respond(that.sock);
      that.respond.send(['crx connected']);
      chrome.runtime.onConnect.addListener(connected);
      return (that.interval = setInterval(() => that.respond.send('ping'), config.beat));
    };
    this.sock.onmessage = event => {
      const msg = JSON.parse(decodeURIComponent(event.data));
      return requestHandler(that.respond, msg);
    };
    this.sock.onerror = () => that.sock.close();

    this.sock.onclose = () => that.close();
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
