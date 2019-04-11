(() => {
    const handler = {
	get: (target, prop, receiver) => {
	    if (typeof target[prop] === "object") {
		return new Proxy(target[prop], handler);
	    } else if (typeof target[prop] === "function") {
		return (...args) => {
		    let promise = {};
		    const ret_promise = new Promise((resolve, reject) => {
			promise.resolve = resolve;
			promise.reject = reject;
		    });

		    const callBack = (...argsCallBack) => {
			if (chrome.runtime.lastError)
			    promise.reject(chrome.runtime.lastError);
			else if (argsCallBack.length === 1)
			    promise.resolve(argsCallBack[0]);
			else
			    promise.resolve(argsCallBack);
		    }

		    try {
			let ret_prop = target[prop].apply(target, [...args, callBack]);
			if (typeof ret_prop !== "undefined")
			    return ret_prop;
			else
			    return ret_promise;
		    } catch (e) {
			try {
			    /* if target[prop] doesn't accept callback, return target[prop](args) */
			    return target[prop].apply(target, args);
			} catch (e) {
			    /* if target[prop] doesn't accept parameter, return target[prop]() */
			    return target[prop]();
			}
		    }
		}
	    } else {
		return target[prop];
	    }
	}
    }

    if (typeof browser === "undefined" && typeof chrome !== "undefined") {
	browser = new Proxy(chrome, handler);
	browser.isPolyfilled = true;
    } else {
	browser.isPolyfilled = false;
    }
})();
