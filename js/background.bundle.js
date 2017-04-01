/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "7fa48c23bcf5ddc99bab"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _notifier = __webpack_require__(2);\n\nvar _notifier2 = _interopRequireDefault(_notifier);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nchrome.browserAction.onClicked.addListener(function () {\n  console.log('reloading');\n  chrome.runtime.reload();\n});\n\nvar config = {\n  host: 'localhost',\n  port: '7442',\n  path: '',\n  beat: 1000 * 60\n};\n\nvar echo = function echo(msg) {\n  return console.log(msg);\n};\n\nvar Respond = function () {\n  function Respond(sock) {\n    _classCallCheck(this, Respond);\n\n    this.sock = sock;\n  }\n\n  _createClass(Respond, [{\n    key: 'send',\n    value: function send(msg) {\n      var msgEncoded = encodeURIComponent(JSON.stringify(msg));\n      if (!this.sock) {\n        if (confirm('Couldn\\'t find websocket, make sure websocket server is running locally, and click ok to reconnect')) {\n          chrome.runtime.reload();\n        }\n      }\n      return this.sock.send(msgEncoded);\n    }\n  }]);\n\n  return Respond;\n}();\n\nvar requestHandler = function requestHandler(responder, msg) {\n  self = func = window;\n  return 0;\n};\n\nvar WebsocketWrapper = function () {\n  function WebsocketWrapper() {\n    _classCallCheck(this, WebsocketWrapper);\n\n    this.count = 0;\n    var that = this;\n    if (!('WebSocket' in window)) {\n      return echo('No websocket in window, I\\'m out');\n    }\n    if (!(this.sock = new WebSocket('ws://' + config.host + ':' + config.port + '/'))) {\n      echo('Could not create WebSocket: exiting');\n      return;\n    }\n    this.sock.onopen = function () {\n      echo('connected');\n      that.respond = new Respond(that.sock);\n      that.respond.send(['connected']);\n      chrome.runtime.onConnect.addListener(connected);\n      return that.interval = setInterval(function () {\n        return that.respond.send('heartbeat ' + ++that.count);\n      }, config.beat);\n    };\n    this.sock.onmessage = function (event) {\n      var msg = JSON.parse(decodeURIComponent(event.data));\n      return requestHandler(that.respond, msg);\n    };\n    this.sock.onerror = function () {\n      return that.sock.close();\n    };\n    this.sock.onclose = function () {\n      return that.close();\n    };\n  }\n\n  _createClass(WebsocketWrapper, [{\n    key: 'close',\n    value: function close() {\n      var that = this;\n      if (this.interval) {\n        clearInterval(this.interval);\n      }\n      ['interval', 'respond', 'sock'].forEach(function (attribute) {\n        delete that[attribute];\n      });\n      setTimeout(function () {\n        return new WebsocketWrapper();\n      }, config.beat);\n    }\n  }]);\n\n  return WebsocketWrapper;\n}();\n\nvar ws = new WebsocketWrapper();\n\nvar connected = function connected(comPort) {\n  comPort.postMessage('Background server connected');\n\n  var r = new Respond(ws.sock);\n\n  comPort.onMessage.addListener(function (m) {\n    (0, _notifier2.default)(m, function () {\n      r.send(m);\n    });\n  });\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvYmcvc2VydmVyLmpzPzNiMDEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5vdGlmaWVyIGZyb20gJy4vbm90aWZpZXInO1xuXG5jaHJvbWUuYnJvd3NlckFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICBjb25zb2xlLmxvZygncmVsb2FkaW5nJylcbiAgY2hyb21lLnJ1bnRpbWUucmVsb2FkKClcbn0pXG5cbmNvbnN0IGNvbmZpZyA9IHtcbiAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gIHBvcnQ6ICc3NDQyJyxcbiAgcGF0aDogJycsXG4gIGJlYXQ6IDEwMDAgKiA2MFxufTtcblxuY29uc3QgZWNobyA9IChtc2cpID0+IGNvbnNvbGUubG9nKG1zZyk7XG5cbmNsYXNzIFJlc3BvbmQge1xuICBjb25zdHJ1Y3Rvcihzb2NrKSB7XG4gICAgdGhpcy5zb2NrID0gc29jaztcbiAgfVxuXG4gIHNlbmQobXNnKSB7XG4gICAgY29uc3QgbXNnRW5jb2RlZCA9IGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShtc2cpKVxuICAgIGlmICghKHRoaXMuc29jaykpIHtcbiAgICAgIGlmIChjb25maXJtKGBDb3VsZG4ndCBmaW5kIHdlYnNvY2tldCwgbWFrZSBzdXJlIHdlYnNvY2tldCBzZXJ2ZXIgaXMgcnVubmluZyBsb2NhbGx5LCBhbmQgY2xpY2sgb2sgdG8gcmVjb25uZWN0YCkpIHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUucmVsb2FkKClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc29jay5zZW5kKG1zZ0VuY29kZWQpXG4gIH1cbn1cblxuY29uc3QgcmVxdWVzdEhhbmRsZXIgPSAocmVzcG9uZGVyLCBtc2cpID0+IHtcbiAgc2VsZiA9IGZ1bmMgPSB3aW5kb3c7XG4gIHJldHVybiAwXG59O1xuXG5cbmNsYXNzIFdlYnNvY2tldFdyYXBwZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvdW50ID0gMFxuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICBpZiAoISgnV2ViU29ja2V0JyBpbiB3aW5kb3cpKSB7XG4gICAgICByZXR1cm4gZWNobyhgTm8gd2Vic29ja2V0IGluIHdpbmRvdywgSSdtIG91dGApXG4gICAgfVxuICAgIGlmICghKHRoaXMuc29jayA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vJyArIGNvbmZpZy5ob3N0ICsgJzonICsgY29uZmlnLnBvcnQgKyAnLycpKSkge1xuICAgICAgZWNobygnQ291bGQgbm90IGNyZWF0ZSBXZWJTb2NrZXQ6IGV4aXRpbmcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zb2NrLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGVjaG8oJ2Nvbm5lY3RlZCcpO1xuICAgICAgdGhhdC5yZXNwb25kID0gbmV3IFJlc3BvbmQodGhhdC5zb2NrKTtcbiAgICAgIHRoYXQucmVzcG9uZC5zZW5kKFsnY29ubmVjdGVkJ10pO1xuICAgICAgY2hyb21lLnJ1bnRpbWUub25Db25uZWN0LmFkZExpc3RlbmVyKGNvbm5lY3RlZClcbiAgICAgIHJldHVybiB0aGF0LmludGVydmFsID0gc2V0SW50ZXJ2YWwoICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoYXQucmVzcG9uZC5zZW5kKGBoZWFydGJlYXQgJHsrK3RoYXQuY291bnR9YCk7XG4gICAgICB9LCBjb25maWcuYmVhdCk7XG4gICAgfTtcbiAgICB0aGlzLnNvY2sub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChldmVudC5kYXRhKSk7XG4gICAgICByZXR1cm4gcmVxdWVzdEhhbmRsZXIodGhhdC5yZXNwb25kLCBtc2cpO1xuICAgIH07XG4gICAgdGhpcy5zb2NrLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhhdC5zb2NrLmNsb3NlKCk7XG4gICAgfTtcbiAgICB0aGlzLnNvY2sub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGF0LmNsb3NlKCk7XG4gICAgfTtcbiAgfVxuICBjbG9zZSgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuICAgIFsnaW50ZXJ2YWwnLCAncmVzcG9uZCcsICdzb2NrJ10uZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICBkZWxldGUgdGhhdFthdHRyaWJ1dGVdO1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbmV3IFdlYnNvY2tldFdyYXBwZXIoKSwgY29uZmlnLmJlYXQpO1xuICB9XG5cbn1cblxuY29uc3Qgd3MgPSBuZXcgV2Vic29ja2V0V3JhcHBlcigpO1xuXG5jb25zdCBjb25uZWN0ZWQgPSAoY29tUG9ydCkgPT4ge1xuICBjb21Qb3J0LnBvc3RNZXNzYWdlKCgnQmFja2dyb3VuZCBzZXJ2ZXIgY29ubmVjdGVkJykpXG5cbiAgbGV0IHIgPSBuZXcgUmVzcG9uZCh3cy5zb2NrKVxuXG4gIGNvbVBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKChtKSA9PiB7XG4gICAgbm90aWZpZXIobSwgKCkgPT4ge1xuICAgICAgci5zZW5kKG0pXG4gICAgfSlcbiAgfSlcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2JnL3NlcnZlci5qcyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7Ozs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBOzs7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar notifier = function notifier(m) {\n  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};\n\n  var title = void 0;\n  var subTitle = void 0;\n  switch (m.action) {\n    case 'jenkinsScreenshot':\n      title = 'Found Screenshots';\n      subTitle = 'Click to download';\n      break;\n    case 'reviewInfo':\n      title = 'Found Review Info';\n      subTitle = 'Click to setup review branches locally';\n      break;\n    case 'testScreenshot':\n      title = 'Found Screenshot for test';\n      subTitle = 'Click to download';\n      break;\n    default:\n      title = 'Found something';\n      subTitle = 'Click to do stuff';\n  };\n  var notificationOpts = {\n    type: 'basic',\n    title: title,\n    message: subTitle,\n    iconUrl: 'http://www.cbinsights.com/favicon.ico'\n  };\n  chrome.notifications.create(notificationOpts, function (createId) {\n    var handler = function handler(id) {\n      if (id === createId) {\n        action();\n        chrome.notifications.clear(id);\n        chrome.notifications.onClicked.removeListener(handler);\n      }\n    };\n    chrome.notifications.onClicked.addListener(handler);\n  });\n};\n\nexports.default = notifier;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvYmcvbm90aWZpZXIuanM/YmMxZSJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBub3RpZmllciA9IChtLCBhY3Rpb24gPSAoKSA9PiB7fSkgPT4ge1xuICBsZXQgdGl0bGU7XG4gIGxldCBzdWJUaXRsZTtcbiAgc3dpdGNoIChtLmFjdGlvbikge1xuICAgIGNhc2UgJ2plbmtpbnNTY3JlZW5zaG90JzpcbiAgICAgIHRpdGxlID0gJ0ZvdW5kIFNjcmVlbnNob3RzJ1xuICAgICAgc3ViVGl0bGUgPSAnQ2xpY2sgdG8gZG93bmxvYWQnXG4gICAgICBicmVhaztcbiAgICBjYXNlICdyZXZpZXdJbmZvJzpcbiAgICAgIHRpdGxlID0gJ0ZvdW5kIFJldmlldyBJbmZvJ1xuICAgICAgc3ViVGl0bGUgPSAnQ2xpY2sgdG8gc2V0dXAgcmV2aWV3IGJyYW5jaGVzIGxvY2FsbHknXG4gICAgICBicmVhaztcbiAgICBjYXNlICd0ZXN0U2NyZWVuc2hvdCc6XG4gICAgICB0aXRsZSA9ICdGb3VuZCBTY3JlZW5zaG90IGZvciB0ZXN0J1xuICAgICAgc3ViVGl0bGUgPSAnQ2xpY2sgdG8gZG93bmxvYWQnXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGl0bGUgPSAnRm91bmQgc29tZXRoaW5nJ1xuICAgICAgc3ViVGl0bGUgPSAnQ2xpY2sgdG8gZG8gc3R1ZmYnXG4gIH07XG4gIGNvbnN0IG5vdGlmaWNhdGlvbk9wdHMgPSB7XG4gICAgICB0eXBlOiAnYmFzaWMnLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgbWVzc2FnZTogc3ViVGl0bGUsXG4gICAgICBpY29uVXJsOiAnaHR0cDovL3d3dy5jYmluc2lnaHRzLmNvbS9mYXZpY29uLmljbydcbiAgfVxuICBjaHJvbWUubm90aWZpY2F0aW9ucy5jcmVhdGUobm90aWZpY2F0aW9uT3B0cywgKGNyZWF0ZUlkKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlciA9IGlkID0+IHtcbiAgICAgIGlmIChpZCA9PT0gY3JlYXRlSWQpIHtcbiAgICAgICAgYWN0aW9uKClcbiAgICAgICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY2xlYXIoaWQpXG4gICAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLm9uQ2xpY2tlZC5yZW1vdmVMaXN0ZW5lcihoYW5kbGVyKVxuICAgICAgfVxuICAgIH07XG4gICAgY2hyb21lLm5vdGlmaWNhdGlvbnMub25DbGlja2VkLmFkZExpc3RlbmVyKGhhbmRsZXIpXG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbm90aWZpZXJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYmcvbm90aWZpZXIuanMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZkE7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);