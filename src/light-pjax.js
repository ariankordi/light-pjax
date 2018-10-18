'use strict';
// @flow
// Let's use Flow so that it's """""""fast""""""" LOL

// pjax is the main export of this, it'll contain the main functions and settings.
var pjax: {
	// containerID is the ID of the container to be replaced. This isn't selected with a query selector!!
	// This is manually set, but is 'container' by default if you like default things.
	containerID: string,
	// listen will call bindLinks and also listen to popstate and navigate back and forward as needed.
	// This is the main function that would be called in a script for enabling pjax.
	listen: () => void,
	// go will manually navigate to a page. You can use this to reload, or manually go to a page via your JS.
	// This is the function creating the actual XHR, it's used internally in linkClickFunc.
	go: (urlToVisit: string, dontDoPushState?: bool) => void,
	// alright then here's some lame internal stuff
	currentXHR: XMLHttpRequest,
	// loadedJSFiles is an array used to track the external JS files loaded in the container.
	// With pjax, external JS is only loaded once, so be sure to handle that.
	loadedJSFiles: Array<string>,
	// bindLinks will bind all anchor links (only, sorry) with a href attribute, to invoke pjax. This won't bind again once you enter another page.
	// This is called at the end of go, after a successful response is recieved.
	bindLinks: () => void,
	// execScriptsFunc will execute all scripts with a src ONLY ONCE, check if it's in loadedJSFiles or push it to it, and then
	// it will always execute raw script elements. It's called in go and listen.
	execScriptsFunc: (targetContainer: Document) => void,
	// linkClickFunc is the handler called when clicking an anchor link after it's binded to.
	// It mainly makes a call to go, and it's bound to elements by bind.
	linkClickFunc: EventHandler
} = {
	// container is the default container thing, but you can set this if you have a different one.
	// This is a "raw" ID, not a query selector!! Don't put something like '#main', instead use 'main'.
	containerID: 'container',
	// loadedJSFiles is a list of scripts that have already been loaded, and won't be loaded again.
	loadedJSFiles: [],
	listen() {
		/*const initialLoadFunc = () => {
			const currentDocumentCopy = document.cloneNode(true);
			history.replaceState([location.href,
				window.pageXOffset,
				window.pageYOffset,
				currentDocumentCopy.title,
				currentDocumentCopy.getElementById(this.containerID).innerHTML
			], document.title, location.href);
			window.removeEventListener('DOMContentLoaded', initialLoadFunc);
		}*/
		const initialLoadFunc = () => {
			// Put the current history stuff in the state, so it's available in history.state.
			history.replaceState([location.href,
				window.pageXOffset,
				window.pageYOffset,
				document.title,
				// $FlowFixMe
				document.getElementById(this.containerID).innerHTML
			], '', location.href);
			window.removeEventListener('DOMContentLoaded', initialLoadFunc);
		};
		// Add some event listener to only run once, when the document is loaded, and run once only.
		window.addEventListener('DOMContentLoaded', initialLoadFunc);
		// Here's popstate, it'll run when the state changes, aka when back/forward buttons are hit.
		// It doesn't actually tell you when back/forward is hit though, it's only the state.
		window.addEventListener('popstate', event => {
			//event.preventDefault();
			//console.log('yay popstate')
			//console.log(location)
			//console.log(history.state)
			/*this.currentStatePos--
			const currentState = this.stateList[this.currentStatePos]
			console.log(currentState)
			document.title = currentState[2]
			var currentContainer = document.getElementById(this.containerID);
			console.log(currentState[3])
			currentContainer.innerHTML = currentState[3]
			console.log('replaced....')
			window.scrollTo(currentState[0], currentState[1])*/
			//this.go(location.href, true)

			/*// Save the current state, first.
			var currentContainer = document.getElementById(this.containerID);
			history.replaceState([location.href,
				window.pageXOffset,
				window.pageYOffset,
				document.title,
				currentContainer.innerHTML
			], '', location.href);*/
			// Replace the document from the history state.
			document.title = history.state[3];
			var currentContainer = document.getElementById(this.containerID);
			// $FlowFixMe
			currentContainer.innerHTML = history.state[4];
			// Run execScriptsFunc on the container.
			this.execScriptsFunc.bind(this)(currentContainer);
			// Bind links, too.
			this.bindLinks();
			// Scroll to the state's scroll position.
			window.scrollTo(history.state[1], history.state[2]);
			history.replaceState(history.state, '', history.state[0]);
		});
		this.bindLinks();
	},
	go(urlToVisit: string, dontDoPushState?: bool) {
		// Let's make our XHR!
		// Maybe todo: Make the XHR global so that it doesn't have to be created every time???? I don't know
		//var xhr: XMLHttpRequest = new XMLHttpRequest();
		if(this.currentXHR !== undefined) {
			this.currentXHR.abort();
		}
		this.currentXHR = new XMLHttpRequest();
		// Let's declare some events here too, for dispatching later.
		// startEvent will be dispatched just before the XHR starts, after it's all set up.
		//const startEvent: Event = new Event('pjax:start');
		// There's another event, errorEvent, that will be dispatched when there's an XHR error, or if there's a code other than 200 returned.
		// That itself won't do anything when there's an error, it's up to you to handle this completely yourself.
		// It's created in either onXHRLoad if there's a bad HTTP status, or in onXHRError.
		// doneEvent will be dispatched once the XHR is done and right after the document is replaced.
		//const doneEvent: Event = new Event('pjax:done');
		// This is the handler called when the XHR loads.
		// All of the "magic" is done here, including dispatching the events, calling JS, and calling bindLinks again.
		//const onXHRLoad: () => void = () => {
			//xhr.removeEventListener('load', onXHRLoad);
		//}
		// I almost forgot, we had to make an error handler, too. This handler will not navigate to the next page.
		// The purpose of an error is just to call the error event, and let the application itself handle it.
		// I considered making this just do a "raw" reload when there's an error, but you could do that yourself if you wanted to.
		const onXHRError: () => void = () => {
			// Make this error and dispatch it, with the XHR itself as the data
			//const errorEvent: CustomEvent = new CustomEvent('pjax:error', {detail: xhr});
			document.dispatchEvent(
				new CustomEvent('pjax:error', {detail: this.currentXHR})
			);
		}
		// The XHR will now be set up, as normal.
		// We're appending a new _pjax param to urlToVisit before we send it, but check if there's already some query params in it first
		// The _pjax parameter contains a timestamp, we're adding this because uhhhhhhhhh cache
		// If the URL doesn't contain any question marks, then use a question mark, otherwise use an and sign
		this.currentXHR.open('GET', urlToVisit + ((urlToVisit.indexOf('?') < 0) ? '?' : '&') + '_pjax=' + new Date().getTime());
		// This X-PJAX header is sent because it's supposed to.
		this.currentXHR.setRequestHeader('X-PJAX', '1');
		// Set the responseType to document, so that the HTML returned will actually be parsed and returned.
		// This is needed, or else, only the HTML recieved from the server will be recieved.
		this.currentXHR.responseType = 'document';
		// Now add an event listener for load to our handler function, just before the XHR is sent.
		this.currentXHR.addEventListener('load', () => {
			//console.log(xhr)
			// Hold on, first check the status code. See if it's over 399, so basically 400 and above.
			if(this.currentXHR.status > 399) {
				// Whoops, there's an error! Return so that nothing happens, but make an error event and dispatch it.
				onXHRError();
				return;
			}
			//var documentParser: DOMParser = new DOMParser();
			//var newDocument: HTMLDocument = documentParser.parseFromString(xhr.response, 'text/html');
			/*var newDocument: HTMLHtmlElement = document.createElement('html');
			newDocument.innerHTML = xhr.response;
			newDocument.title = newDocument.getElementsByTagName('title')[0].innerHTML;
			newDocument.body = newDocument.getElementsByTagName('body')[0];*/
			// The XHR is loaded now (without errors), and hopefully the HTML is loaded correctly.
			// First, change the title so that the user notices it first. This is easy.
			document.title = this.currentXHR.response.title;
			// Do a pushState, which will actually tell the browser that we're on a new page.
			// We'll update the title, and the URL with what we've recieved. I don't know what the first arg is for.
			//if(dontDoPushState !== true) {
				//console.log('pushstate ...')
				history.pushState([urlToVisit,
					window.pageXOffset,
					window.pageYOffset,
					this.currentXHR.response.title,
					this.currentXHR.response.body.innerHTML
				], '', urlToVisit);
			//}
			// we don't need to do this lol
			// This was going to de-bind all links from the previous page before replacing the HTML, to save memory, but this isn't necessary.
			/*console.log('printing prev page elements to debind...')
			for(i = 0; i < aLinksLength; i++) {
				console.log(aLinks[i])
				if(aLinks[i].hasAttribute('href')) {
					aLinks[i].removeEventListener('load', aLinkClickFunc);
				}
			}*/
			// Here's the magic! First, let's get the container from the document we're on right now.
			// We're going to replace this. It's an any, because it's sometimes null, I think.
			var targetContainer: any = document.getElementById(this.containerID);
			// Now, set the container to the INSIDE OF THE RESPONSE, since we're assuming that it's being done right.
			// xhr.response.body.innerHTML is supposed to be the inside of the container that's being replaced.
			targetContainer.innerHTML = this.currentXHR.response.body.innerHTML;
			// The HTML is loaded, but now we need to load the JS on the page, so let's go through this.
			this.execScriptsFunc.bind(this)(targetContainer);
			// Finally, bind PJAX links here. We're done!
			this.bindLinks();
			// oh and also scroll to the top
			window.scrollTo(0, 0);
			// Since we're completely done, let's dispatch the done event, since we're done. I wanted to do this before, but then we wouldn't truly be done.
			// We are truly done now.
			document.dispatchEvent(
				new Event('pjax:done')
			);
		});
		// Add another event listener, this time for the error handling stuff.
		this.currentXHR.addEventListener('error', onXHRError);
		this.currentXHR.addEventListener('abort', () => {
			document.dispatchEvent(
				new CustomEvent('pjax:abort')
			);
		});
		// Dispatch the start event, pjax:start...
		document.dispatchEvent(
			new Event('pjax:start')
		);
		// Finally, send the XHR!
		this.currentXHR.send();
	},
	bindLinks() {
		// First, make a wrapper of linkClickFunc that has this properly set.
		// Otherwise, inside of linkClickFunc, this would be set to the event, instead of the actual pjax object.
		const linkClickFuncThis: (event: Event) => void = this.linkClickFunc.bind(this);

		// Here's the list of anchor elements that we're about to bind to.
		var aLinks: HTMLCollection<HTMLAnchorElement> = document.getElementsByTagName('a');

		// Iterate through aLinks...
		const aLinksLength: number = aLinks.length;
		for(let i = 0; i < aLinksLength; i++) {
			// Check if the actual link has a href attribute, then...
			if(aLinks[i].hasAttribute('href')) {
				// add an event listener to it, to our (wrapped) click handler function.
				aLinks[i].addEventListener('click', linkClickFuncThis);
			}
		}
	},
	execScriptsFunc(targetContainer: Document) {
		// First, find script elements in the current container that we need to handle.
		var scriptsToRun: HTMLCollection<HTMLScriptElement> = targetContainer.getElementsByTagName('script');
		// Iterate through them. Don't actually assign a const to the length of the above HTMLCollection, because that would break this, I think.
		for(let i = 0; i < scriptsToRun.length; i++) {
			//console.log(scriptsToRun[i])
			// Check if the script element we're looking at even has a src. If it does, then we'll load it, ONCE.
			if(scriptsToRun[i].hasAttribute('src') !== false) {
				// Here's the scriptSrc we're about to use. It may be null, but that's alright.
				const scriptSrc: any = scriptsToRun[i].getAttribute('src');
				// Check if it's in this.loadedJSFiles, which should contain an array of JS files that are already loaded.
				if(this.loadedJSFiles.indexOf(scriptSrc) < 0) {
					// It isn't already loaded, so let's load it and put it into the already loaded list!
					//console.log('pushing the script thing i dont kno')
					// Let's make a new script element, you have to do this to load a brand new script.
					var newScriptLoad: HTMLScriptElement = document.createElement('script');
					// Now set its src property. I'm not sure if this is the fastest, but I've heard it may be, so I'll use this.
					newScriptLoad.src = scriptSrc;
					// Finally, load the JS by appending it to the top, and add it to the loaded JS list. Phew!
					// $FlowFixMe jk don't fix this when the heck is the head not there
					document.head.appendChild(newScriptLoad);
					this.loadedJSFiles.push(scriptSrc);
				}
			} else {
				// If we're here, then the script has no src element, and we have to eval what's inside.
				//console.log('evalling the thingyo')
				// This will actually be evalled regardless if it has been evalled before.
				eval(scriptsToRun[i].innerHTML);
			}
		}
	},
	linkClickFunc(event: Event) {
		// First, check if the link is absolute, and if it is, then just return and don't prevent default.
		// This will make it so that absolute links, including external links, will just go to the external page.
		// We'll do this by comparing event.target.host, the anchor link's host, with location.host. So...
		// (doing a negative comparison to prevent using an else)
		// $FlowFixMe just kidding this event listener will only be called to anchor elements
		if(event.target.host !== location.host) {
			return;
		}
		// Nice, at this point, we should be visiting a link with the same host as the one we're on now.
		event.preventDefault();

		// Here's our raw href that we'll be using.
		// Tip: getAttribute is faster and more accurate than just using the .href property. https://www.measurethat.net/Benchmarks/Show/4009/0/using-getattribute-vs-property-to-access-an-elements-hr
		// $FlowFixMe
		//const urlToVisit: string = event.target.getAttribute('href');
		this.go(event.target.getAttribute('href'));
	}
}
