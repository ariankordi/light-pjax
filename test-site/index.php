<?php
// Include the layout file, with functions to write the header and footer.
include('layout.php');
// Write the header. The layout.php file includes the PJAX magic, go look at that.
writeHeader();
?><ul>
  <li>home</li>
  <li><a href="dinosaurs.php">dinosaurs</a></li>
  <li><a href="aliens.php">aliens</a></li>
	<li><a href="surpruse.php">surprise</a></li>
</ul>

<a>yeet here's an anchor without a href LOL</a>

<p>
  pjax loads html from your server into the current page
  without a full page load. It's ajax with real permalinks,
  page titles, and a working back button that fully degrades.
</p>

<p>
  Check the box to toggle pjax.
</p>

<p>
  Whenever the time changes, a full page load has happened.
  If the time doesn't change,  no full page load has occurred.
</p>

<p>
  The idea is you can't tell the difference between pjax
  page loads and normal page loads. On complicated sites,
  browsing just "feels faster."
</p>

<p>
  <a href="https://github.com/defunkt/jquery-pjax/tree/heroku">
    view this example's source code
  </a>
</p>
<?php
// End the page with the footer.
writeFooter();
