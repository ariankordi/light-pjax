# light-pjax
This is an implementation of [jquery-pjax](https://github.com/defunkt/jquery-pjax), aiming to be as small and fast as possible (it also doesn't need jQuery, of course).

If you're not familiar with pjax, there are many implementations of it already, but the main feature is "smooth", single-page like page transitions. When you click on a link, it doesn't have to load _the entire page_, it only loads and replaces a portion of it. JS/CSS/whatever doesn't have to be downloaded, parsed or executed again, head elements that don't matter have to be downloaded or parsed either. It makes for a smoother and generally better site experience.

If you want more info, you should look at jquery-pjax's Github or anything else related to it: https://github.com/defunkt/jquery-pjax

# Tests? Benchmarks?
I didn't do many tests, or benchmarks. I haven't even checked browser compatibility. I also have not done benchmarks, as the minified size being smaller than jquery-pjax is enough for me. Use this at your own risk, I guess.

# Usage
First of all, getting this out of the way: browser compatibility is up to you to implement, and if you do something wrong, like having your container ID nonexistent, then no readable errors will be thrown.

This package exports `pjax`, which has a few methods. The main one you're supposed to call is `pjax.listen()`, after assigning `pjax.containerID` to your container, as required by pjax.

So, do something like this if your pjax container is `#main`.
```js
pjax.containerID = 'main';
pjax.listen();
```
**If the ID of it is already `container`, then you don't have to set the containerID.**

Look at the test-site directory for an example in PHP, it might help you. (the main stuff is in layout.php)
## Events
This emits events, too, in case you want a cool page loading animation or something like that.
* **`pjax:start`** is emitted when the XHR has started but not finished.
* **`pjax:done`** is emitted when the XHR is actually finished and the document has been loaded.
* **`pjax:error`** is emitted on an XHR error or a bad response code. It has the XHR itself as a parameter so that you can use it. Error handling is up to you, pjax will not do anything when there's an error, it'll just do nothing.
These are all fired in `document`. Check out the source if you're ever confused.

# Anything else?
This is pretty incomplete, missing a lot of things, especially forgetting error handling, so if you need some of these features I guess you could make a pull request and I'll try my best to satisfy.
