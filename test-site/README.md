# A test/example site for this, in PHP
![an image of what it looks like](https://res.cloudinary.com/dg5105vqn/image/upload/v1539557314/mwslnhpjnwfshfdhol7w.png "here's what it looks like")

This is the example site, **directly taken from [jquery-pjax's](https://pjax.herokuapp.com/)**. That's why you'll see references to it there and the text and all. I've also modified it for testing, so yeah.

This is mainly meant as an **example so that you could know how to implement it**. I guess it's just like other pjax implementations, it looks for the `X-PJAX` header, and if it's there, it only sends the container. Simple as that. For PHP, that header would be `$_SERVER['HTTP_X_PJAX']`, but there are probably some modules that already do that for you if you use a common web framework like Django. Look at [the original implementation's README](https://github.com/defunkt/jquery-pjax#server-side-configuration) for more info about that.

# Running this
If you want to run this, it's pretty simple. Since this is PHP, **you can use the PHP standalone development server** thing, like this, from the test-site directory:

`php -S 127.0.0.1:8080`

Then, you could visit `http://127.0.0.1:8080/` and it'll work. (127.0.0.1 is the same as localhost)

If you see something like `bash: php: command not found`, well, [install PHP](https://secure.php.net/manual/en/install.php). Or don't, if you're not going to use it. Enjoy, there's no option to disable PJAX like the original site, so sorry. You should maybe read the original README again after this.
