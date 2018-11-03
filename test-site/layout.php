<?php
// This file contains functions to write the header and footer of the site.
// The header and footer are adapted from: https://raw.githubusercontent.com/defunkt/jquery-pjax/heroku/app/views/layout.erb
// Here's the header. Ignore the title, lol.
function writeHeader(string $title = null) {
	// HERE'S SOME MAGIC! Some of this header won't be output when the X-PJAX header is sent.
	// Make a variable for that header. It'll be true if the header is there.
	// PHP requires you to put "HTTP_" before each header name, keep that in mind.
	$has_pjax = isset($_SERVER['HTTP_X_PJAX']);
	// Now, print some of this header if there's no PJAX.
	if(!$has_pjax) {
	?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<!-- This is a hack to prevent the /favicon.ico request, to make your Requests panel probably cleaner. So, ignore this. -->
	<link href="data:;base64,iVBORw0KGgo=" rel="icon">
	<style>
    pre {
      float: left;
    }
		ul {
			padding-left: 15px;
		}
    #container {
      font-family: sans-serif;
      float: left;
      margin-left: -120px;
      padding-top: 80px;
      width: 30%;
    }
  </style>
	<?php
	}
	// IMPORTANT! Output the page title, even if PJAX is there.
	?><title><?php
	if($title) {
		echo htmlspecialchars($title); ?> - pjax<?php
	} else {
		?>pjax<?php
	}?></title>
<?php
	// Go back to excluding the page from PJAX.
	if(!$has_pjax) {
	?></head>
<body>
	<pre>

               ／￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
               |　<strong>It's <?= strftime('%I:%M:%S %p') ?></strong>
               ＼＿　 ＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
        <!-- FUNNY EPIC LOL --><span title="i eat the whole ass">.--.     (  )
       /    \   ( )
      ## a  a  .
      (   '._)
       |'-- |</span>
     _.\___/_   <!--___<label><input type="checkbox" name="pjax">pjax</label>___-->
   ."\> \Y/|<'.  '._.-'
  /  \ \_\/ /  '-' /
  | --'\_/|/ |   _/
  |___.-' |  |`'`
    |     |  |
    |    / './
   /__./` | |
      \   | |
       \  | |
       ;  | |
       /  | |
 jgs  |___\_.\_
      `-"--'---'

<a href="https://github.com/defunkt/jquery-pjax">github.com/defunkt/jquery-pjax</a>
	</pre>
	<div id="container">
		<?php
		// IMPORTANT! The container is #main, but the INSIDE of that container will be returned.
		}
		// But, now output the body, if there's PJAX or not.
}
// Now for the footer. The body should be printed between the header and footer.
function writeFooter() {
	$has_pjax = isset($_SERVER['HTTP_X_PJAX']);
	if(!$has_pjax) {
	// Now, print the footer if there's no PJAX.
	?>
	</div>
	<!-- Put the magic script here, and a little more JS to make it actually work. -->
	<!-- Make sure this is OUTSIDE OF THE CONTAINER!!!!!!!!!! Otherwise, listen() will be called multiple times and you will get undefined behavior from that. -->
	<script src="light-pjax.js"></script>
	<script>
		// containerID must be the ID of the container, without #!!!
		// it will actually be 'container' by default, so it'll work
		// IF IT WAS 'main' THOUGH, you would do:
		//pjax.containerID = 'main';
		// and then after that, just call listen with no args and it'll work
		pjax.listen();
	</script>
</body>
</html><?php
	}
}
