import notifier from './notifier';
import { formatMsg, createEventListeners } from './utils';
import WebSocket from 'reconnecting-websocket';

const host = 'localhost';
const port = 7443;
const snitchPort = 7444;
const config = {
  host,
  port,
  path: '',
};
let ws;
let wsSnitch;
let listeners;

const genericListener = (targetType, target) => (...info) =>
  snitch({ type: 'event', target, targetType, info }).catch(err => {
    console.error(`Generic listner event failed ${targetType}, ${target}`);
    console.info(err);
  });

const manageEventListeners = (listeners, listenersOn = true) => {
  const listenAction = listenersOn ? 'addListener' : 'removeListener';
  listeners.map(([event, listener]) => event[listenAction](listener));
};

const handleRequest = ({ requestTarget, args }) =>
  new Promise((resolve, reject) => {
    switch (requestTarget) {
      case 'establish_listeners':
        try {
          wsSnitch = new WebSocket(`ws://${host}:${snitchPort}`);
          listeners = createEventListeners(args, genericListener);
          manageEventListeners(listeners);
          resolve();
        } catch (e) {
          reject(e);
        }
        break;
      default:
        reject('Unknown request target');
    }
  });

const handleCommand = ({ path, args = {} }) =>
  new Promise((resolve, reject) => {
    const opts = Object.keys(args).filter(k => args[k] !== null).reduce((acc, k) => ({...acc, [k]: args[k]}), {});
    let target = window;
    path.split('.').forEach(piece => {
      try {
        target = target[piece];
      } catch (e) {
        reject(e);
      }
    });
    try {
      target(opts, resolve);
    } catch (e) {
      reject(e);
    }
  });

const requestHandler = data => {
  switch (data.type) {
    case 'ping':
      return Promise.resolve('pong');
    case 'request':
      return handleRequest(data);
    case 'command':
      return handleCommand(data);
    default:
      throw Error('Unknown type [command | request]');
  }
};

const runtimeConnectedHandler = respnder => comPort => {
  comPort.postMessage('Background server connected');
  comPort.onMessage.addListener(m => notifier(m, respnder));
};

ws = new WebSocket(`ws://${host}:${port}`);

const snitch = (msg = null, error = false) =>
  new Promise((resolve, reject) => {
    try {
      wsSnitch.send(formatMsg({ msg, error }));
      resolve();
    } catch (e) {
      reject(e);
    }
  });

const holla = (msg, triesCount = 0) => {
  new Promise((resolve, reject) => {
    if (ws.readyState !== 1) {
      reject(Error('Socket not ready'));
    }
    try {
      ws.send(formatMsg(msg));
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

ws.onopen = () => chrome.runtime.onConnect.addListener(runtimeConnectedHandler(holla));

const responder = (msg = null, error = false) => holla({ error, msg });

const respondSuccess = msg => {
  console.debug('RESPONDING (SUCCESS)\n', msg);
  responder(msg)
};
const respondError = msg => {
  console.error('RESPONDING (FAILURE)\n', msg);
  responder(msg, true)
};

ws.onmessage = event => {
  const { data } = event;
  const msg = JSON.parse(decodeURIComponent(data));
  console.debug('WS Received msg\n', msg);
  return requestHandler(msg)
    .then(respondSuccess, respondError)
    .catch(respondError);
};

ws.onerror = console.error;
