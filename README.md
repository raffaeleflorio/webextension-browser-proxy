# webextension-browser-proxy

webextension-browser-proxy allows extensions written with standardized (https://browserext.github.io/browserext/) Promise based WebExtension API to work without modification in Chrome/Chromium. The latter use a callback based API.

# How to use
You can download directly polyfill.js or you can clone this repo and check signauture's commit. Public Key from https://raffaeleflorio.github.io or https://pgp.mit.edu).

Then you have to include `polyfill.js` before any `browser` APIs are used.

For background scripts or content_scripts add `polyfill.js` entry in `manifest.json`:
```javascript
...
	"background": {
		      "scripts": [
		      		 "path/to/polyfill.js",
				 "background_script1.js",
				 "background_script2.js",
				 ...
		      ]
	},

	"content_scripts": [{
			   ...
			   "js": [
			   	 "path/to/polyfill.js",
				 "content_script1.js",
				 "content_script2.js",
				 ...
			   ]
	}]
```

For HTML files include it with `script` tag before any script that use `browser` API is used:
```html
<!DOCTYPE html>
	  ...
		<script src="path/to/polyfill.js"></script>
	  ...
</html>
```

Then you can use Promise based API.

# Where it has been tested

It has been tested on Chrome/Chromium browser.

* [qubes-url-redirector](https://github.com/raffaeleflorio/qubes-url-redirector)
* [Mozilla WebExtension examples](https://github.com/mdn/webextensions-examples) (some extensions aren't compatible because of some Firefox specific APIs)

# How it works

[polyfill.js](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/master/polyfill.js) is an IIFE. It defines `browser` as `Proxy` of `chrome` ([[0]](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L46)). Furthermore it adds a `isPolyfilled` property to the `browser` object.
The Proxy handles three cases when a `browser`'s property (or nested object's property) is accessed ([[1]](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L2)):
1) If the property is an object, it returns a Proxy with `handler` ([[1]](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L2)) as handler.
2) If the property is a function, it returns a function ([[2]](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L7)) (read below).
3) Otherwise it returns the target property.

## How returned function works

The returned function try to calls the target function in this way:
1) If the target function accepts a callback, it returns a Promise resolved by [[3]](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L14).
2) If the target function accepts (or not) some parameters, it returns the target function returned value.

[0] = [polyfill.js#L46](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L46)<br>
[1] = [polyfill.js#L2](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L2)<br>
[2] = [polyfill.js#L7](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L7)<br>
[3] = [polyfill.js#L14](https://github.com/raffaeleflorio/webextension-browser-proxy/blob/833e2f77ac51f820203969aa9c645859fb958ec2/polyfill.js#L14)<br>