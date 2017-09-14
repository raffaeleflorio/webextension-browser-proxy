# webextension-browser-proxy

webextension-browser-proxy allows extensions written with standardized (https://browserext.github.io/browserext/) Promise based WebExtension API to work without modification in Chrome/Chromium. The latter use a callback based API.

# How to use
You can download directly polyfill.js or you can clone this repo and check signauture's commit. Public Key from https://raffaeleflorio.github.io or https://pgp.mit.edu).

Then you have to include `polyfill.js` before any `browser` APIs are used.

For background scripts or content_scripts add `polyfill.js` entry in `manifest.json`:
```
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
```
<!DOCTYPE html>
	  ...
		<script src="path/to/polyfill.js"></script>
	  ...
</html>
```

Then you can use Promise based API.