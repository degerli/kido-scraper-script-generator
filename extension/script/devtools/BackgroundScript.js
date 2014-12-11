var prefix = 'Success payload=';
var auth_key_in_storage = 'token';

/**
 * ContentScript that can be called from anywhere within the extension
 */
var BackgroundScript = {

	getAuthToken: function () {
		var deferredResponse = $.Deferred();

		chrome.storage.sync.get(auth_key_in_storage, function(token) {
			if (token && token[auth_key_in_storage]) {
				deferredResponse.resolve(token);
				return;
			} else {
				chrome.tabs.create(
					{url: "https://auth-qa.kidozen.com/v1/armonia/sign-in?wtrealm=_marketplace&wreply=urn-ietf-wg-oauth-2.0-oob&wa=wsignin1.0"},
					function (t) {
						var authTokenGrabber = function(tabId, changeInfo, tab) {
							if (tabId === t.id) {
								if ((tab && tab.title || '').indexOf(prefix) === 0) {
									var token = tab.title.substr(prefix.length);
									deferredResponse.resolve(token);
									var saveObject = {};
									saveObject[auth_key_in_storage] = token;
									chrome.storage.sync.set(saveObject, function () {
										if (chrome.runtime.lasterror) {
											console.error(chrome.runtime.lasterror.message);
										}
									});
									chrome.tabs.onUpdated.removeListener(authTokenGrabber);
									chrome.tabs.remove(tab.id);
									return;
								}
							}
						};
						chrome.tabs.onUpdated.addListener(authTokenGrabber);
					}
				);
			}
		});
		return deferredResponse.promise();
	},

	/**
	 * Returns the id of the tab that is visible to user
	 * @returns $.Deferred() integer
	 */
	getActiveTabId: function() {

		var deferredResponse = $.Deferred();

		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function (tabs) {

			if (tabs.length < 1) {
				// @TODO must be running within popup. maybe find another active window?
				deferredResponse.reject("couldn't find the active tab");
			}
			else {
				var tabId = tabs[0].id;
				deferredResponse.resolve(tabId);
			}
		});
		return deferredResponse.promise();
	},

	/**
	 * Execute a function within the active tab within content script
	 * @param request.fn	function to call
	 * @param request.request	request that will be passed to the function
	 */
	executeContentScript: function(request) {
		console.log("Executing request on the active tab: " + JSON.stringify(request, null, 2));

		var reqToContentScript = {
			contentScriptCall: true,
			fn: request.fn,
			request: request.request
		};
		var deferredResponse = $.Deferred();
		var deferredActiveTabId = this.getActiveTabId();
		deferredActiveTabId.done(function(tabId) {
			chrome.tabs.sendMessage(tabId, reqToContentScript, function(response) {
				deferredResponse.resolve(response);
			});
		});

		return deferredResponse;
	}
};

/**
 * @param location	configure from where the content script is being accessed (ContentScript, BackgroundPage, DevTools)
 * @returns BackgroundScript
 */
var getBackgroundScript = function(location) {

	// Handle calls from different places
	if(location === "BackgroundScript") {
		return BackgroundScript;
	}
	else if(location === "DevTools" || location === "ContentScript") {

		// if called within background script proxy calls to content script
		var backgroundScript = {};

		Object.keys(BackgroundScript).forEach(function(attr) {
			if(typeof BackgroundScript[attr] === 'function') {
				backgroundScript[attr] = function(request) {

					var reqToBackgroundScript = {
						backgroundScriptCall: true,
						fn: attr,
						request: request
					};

					var deferredResponse = $.Deferred();

					console.log("request to background script: " + JSON.stringify(reqToBackgroundScript, null, 2));
					chrome.runtime.sendMessage(reqToBackgroundScript, function(response) {
						deferredResponse.resolve(response);
					});

					return deferredResponse;
				};
			}
			else {
				backgroundScript[attr] = BackgroundScript[attr];
			}
		});

		return backgroundScript;
	}
	else {
		throw "Invalid BackgroundScript initialization - " + location;
	}
};