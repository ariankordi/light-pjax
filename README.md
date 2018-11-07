# light-pjax
This is an implementation of [jquery-pjax](https://github.com/defunkt/jquery-pjax), aiming to be as small and fast as possible (it also doesn't need jQuery, of course).

If you're not familiar with pjax, there are many implementations of it already, but the main feature is "smooth", single-page like page transitions. When you click on a link, it doesn't have to load _the entire page_, it only loads and replaces a portion of it. JS/CSS/whatever doesn't have to be downloaded, parsed or executed again, head elements that don't matter have to be downloaded or parsed either. It makes for a smoother and generally better site experience.

If you want more info, you should look at jquery-pjax's Github or anything else related to it: https://github.com/defunkt/jquery-pjax

# Usage
To actually implement this, you will have to do some things on your backend.

## Backend
PJAX works by having a container and then just recieving _only that container_ on future page loads and replacing that container.

So, first you'll need a container that will be replaced with. Got a container? Cool. Assign it an ID.

When this thing makes a request, it will send an `X-PJAX` header, with the value `1`. The value doesn't matter, you just need to **check if this header exists.** If this header exists, then you need to exclude all content from the page, except for the container that you chose and title.

So, without pjax, your site would look like, as an oversimplified example:
```html
<!doctype html>
<html lang="en">
<head>
	<meta name="is-epic" content="yes">
	<title>My epic site!!!</title>
</head>
<body>
	tyetyweutwe
	<div id="container">
		THIS IS CONTAINER
	</div>
	sfdhfjdhjkfh
</body>
</html>
```

Now, **with the `X-PJAX` request header existing, your response should look like this.**
```html
<title>My epic site!!!</title>
	THIS IS CONTAINER
```

Yeah. Now, you would use this container ID in the next subheading. I think. I don't know if the above example was actually correct. I think it was though. I don't know check out the test site pleaz

Look at the [test site](https://github.com/ariankordi/light-pjax/tree/master/test-site) if you like examples. I probably didn't make this clear enough anyway so you could use that as a working reference.

## Frontend
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
* **`pjax:popstate_done`** is emitted when the user does a popState, like going back or forward on a page, and then pjax reloads it from the history.state.
* **`pjax:error`** is emitted on an XHR error or a bad response code. Error handling is up to you, pjax will not do anything when there's an error, it'll just do nothing.
* **`pjax:abort`** is emitted when an XHR is aborted.

These are all fired in `document`. Check out the source if you're ever confused.

If you need the XHR itself for error handling or something, it's in `pjax.currentXHR`.
## HOW DO I EVEN USE THIS AND EMBED THIS IN MY PAGE BRO!!!!!!!!!!!
Do the thing below, I guess. Either append this to your current JS, or put it in a new file on your site, or use it with Webpack or Gulp, or something, I don't know...

# BUT WHAT ABOUT BUILDING!!!!!!!!!!!!!!
[jsdelivr should give you a usable version of this](https://www.jsdelivr.com/package/npm/light-pjax), but if it doesn't...
* Run `npm install` after cloning the repo (if this doesn't work then report it!!!!!!!!! like, now!!!! then that means that i ACTUALLY did something wrong)
* After that, run `npm run prepare` to generate a (not very well) minified, ES5 version of the script, and `npm run build` will generate an un-minified ES6 version of the script. It's outputted to `dist/light-pjax.js`.
* Don't try using the raw `src/light-pjax.js`, that's the source, typed with Flow.

# FAQ?
## What the heck it doesn't work!!!!!!!!!!!!
Did you implement the PJAX stuff on your backend????????? This won't work with static sites... There are other projects that will implement this on static sites... Which are probably better written than this...
## Help me my site is weird and for some reason events multiply and stuff please help me.
I put this here because I ran into this very problem - Every script in your container is executed on each page, so **make sure you aren't calling `listen()` from a script element *in your container***.
## uhhh sorry i couldn't come up with any other problems
do your own debugging if you have any problems lol

# Anything else?
This is pretty incomplete, missing a lot of things, especially forgetting error handling, so if you need some of these features I guess you could make a pull request and I'll try my best to satisfy.

# djfshajkflsdhfdj
sorry i wrote this in like 25 seconds not considering that any actual living humans would use this or know how to use it and didn't write this intending for people who aren't already familiar with jquery-pjax and everything to use this
