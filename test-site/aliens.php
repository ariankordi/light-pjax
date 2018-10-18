<?php
include('layout.php');
writeHeader('aliens gros..............');
?><ul>
  <li><a href="index.php">home</a></li>
  <li><a href="dinosaurs.php">dinosaurs</a></li>
  <li>aliens</li>
	<li><a href="surpruse.php">surprise</a></li>
</ul>

<p>loading image of aliens ...</p>
<img src="https://raw.githubusercontent.com/defunkt/jquery-pjax/heroku/img/aliens.jpg" title="it's aliens">
<script>
	var loadingText = document.getElementsByTagName('p')[0];
	if(loadingText !== null) {
		document.getElementsByTagName('img')[0].addEventListener('load', () => {
			loadingText.remove();
		});
	}
</script>
<?php
writeFooter();
