/*https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/events/Event*/
const isEvent = e => {
    const methods = [
	"addListener",
	"removeListener",
	"hasListener",
	"hasListeners",
	"addRules",
	"getRules",
	"removeRules"
    ];

    return methods.every(m => {
	return typeof e[m] === "function";
    });
}

const handler = {
    get: (target, prop, receiver) => {
	if (typeof target[prop] === "object" && !isEvent(target[prop])) {
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

		args.push(callBack);
		
		try {
		    ret_prop = target[prop].apply(target, args);
		} catch (e) {
		    /* if target[prop] accepts no args, return target[prop]() */
		    return target[prop]();
		}

		/* if target[prop].apply(target, args) returned something, return that value */
		if (typeof ret_prop != "undefined")
		    return ret_prop;
		/* else return a promise resolved externally by callBack */
		else
		    return ret_promise;
	    }
	} else {
	    return target[prop];
	}
    }
}

if (typeof browser === "undefined" && typeof chrome !== "undefined")
    browser = new Proxy(chrome, handler);
