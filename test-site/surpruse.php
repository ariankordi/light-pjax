<?php
include('layout.php');
writeHeader('et ce tra');
?><!-- i'm putting this inside of a container element and you should too -->
<div>
	<!-- omg an external script :O -->
	<script src="script-src-test.js"></script>
	<style>
	#cake {
		width: 100%;
	}
	</style>
	<ul>
	  <li><a href="index.php">home</a></li>
	  <li><a href="dinosaurs.php">dinosaurs</a></li>
	  <li><a href="aliens.php">aliens</a></li>
		<li>surprise</li>
	</ul>

	<p id="before">cliq for a surprise...</p>
	<p id="after" style="display: none;">cake!!!!!!!!!</p>
	<img id="cake" style="display: none;" src="cake.jpg" alt="cake taken from google images lol https://livforcake.com/black-forest-cake/" title="yum visit https://livforcake.com/black-forest-cake/ if you wanna make this">
	<button id="cake-button">zzzdxzdjhkjhskjafjfdsjdf</button>
	<p>the time is <?= strftime('%I:%M:%S %p') ?>, <button id="reload-button">go here to reload this page</button></p>
	<script>
		console.log('script on ' + location.pathname + ' is running!!');
		var cakeButton = document.getElementById('cake-button');
		const cakeButtonClickFunc = event => {
			event.preventDefault();
			// first UNHIDE THE CAKE!!!!
			document.getElementById('cake').style = null;
			// hide before
			document.getElementById('before').style = 'display: none;';
			// but unhide after
			document.getElementById('after').style = null;
			// finally hide the button rrrrrrrrrrrrr
			cakeButton.style = 'display: none;';
			// remove the event listener since we don't need it anymore lol
			//cakeButton.removeEventListener('click', buttonClickFunc);
		};
		cakeButton.addEventListener('click', cakeButtonClickFunc);
		// add another event listener to RELOAD the page
		var reloadButton = document.getElementById('reload-button');
		const reloadButtonClickFunc = event => {
			event.preventDefault();
			// go() to the current page we're on, so, basically reload
			pjax.go(location.href);
			//reloadButton.removeEventListener('click', reloadLinkClickFunc);
		};
		reloadButton.addEventListener('click', reloadButtonClickFunc);
		// remove the event listeners when we're done, since javascript will still be running when pjax is done
		/*document.addEventListener('pjax:done', => {
			cakeButton.removeEventListener('click', cakeButtonClickFunc);
			reloadButton.removeEventListener('click', reloadLinkClickFunc);
		})*/
		ereoiuroief';[;]
	</script>
</div>
<?php
writeFooter();
