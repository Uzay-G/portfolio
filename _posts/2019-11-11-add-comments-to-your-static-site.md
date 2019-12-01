---
layout: post
title: How to add a comments section to your static blog
tags: [learning, static]
---

Usually, blogs store comment data inside their server database. You can't do that with static websites but there are many tools that can help you solve this problem and create discussion around your posts. This article will guide you through some ways you can add these comments for free.


## For Developers - Utterances
# 🔮
<a href="https://utteranc.es/" target="_blank" rel="noopener">Utterances</a> is a great comment plugin built on Github issues. It creates an issue on github for your posts and then adds your website's comments to the issues. All your commenters need to do is sign in on Github.
Obviously, you should only do this if your blog is about software development or a related subject otherwise none of your readers will have Github accounts.

I love this solution because it's an opensource and lightweight tool that doesn't harm the user experience. It's a simple option and it has a beautiful user interface which you can see down below.
![utterance ui](/assets/images/utterance.png)

How to get it setup:
1. Create a public "myblog-comments" repository on Github
2. Add the app to your repo on the <a href="https://github.com/apps/utterances" target="_blank" rel="noopener">github utterance page</a>
3. Paste the following snippet at the bottom of all of your posts:
<pre><code>&#60;script src="https://utteranc.es/client.js"
        repo="[username/myblog-comments]"
        issue-term="pathname"
        theme="github-light"
        crossorigin="anonymous"
        async>
&#60;/script>
</code></pre>
and replace the repo value with the name of your repository. You can customize this snippet more at the bottom of the <a href='https://utteranc.es/' target="_blank" rel="noopener">utterances</a> website.

## Disqus
Disqus is a technically free way to add to comments to your website. It's a useful tool but I don't use it because it injects ads into your website if you use the free plan and it raises privacy concerns for its users. 

Steps:
1. Register an account at <a href="https://disqus.com/profile/signup/" rel="noopener" target="_blank">Disqus</a>
2. Confirm that you want to install Disqus on your site
3. Choose your plan
4. On the choose your platform window, select the "Universal Code" option
5. Embed the following code at the bottom of your posts:
<pre><code>&#60;div id="disqus_thread">&#60;/div>
  &#60;script>
    var disqus_config = function () {
      this.page.url = 'The absolute url of the page';
      this.page.identifier = 'An identifier of your choice that should be unique to every post
      like for example the post title.';
    };
    (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://websitename.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  &#60;/script>
  &#60;noscript>Please enable JavaScript to view the &#60;a href="https://disqus.com/?ref_noscript" rel="nofollow">
  comments powered by Disqus.&#60;/a>&#60;/noscript>
  </code></pre>
**Remember** to replace the page url and identifier parameters with those of your posts. Also replace the s.src "websitename" part with the website name you registered with Disqus. If your site is "example.com", it would be "example.disqus.com/embed.js"

Your comments should now work, but please keep in mind the intangible price of Disqus outlined in this <a href="https://replyable.com/2017/03/disqus-is-your-data-worth-trading-for-convenience/" target="_blank" rel="noopener">article.</a>

## Remarkbox
<img width="200" src="https://my.remarkbox.com/static/img/remarkbox-logo.png" alt="remarkbox logo">

<a href="https://remarkbox.com" target="_blank" rel="noopener">Remarkbox</a> is a simple third-party comment system similar to Disqus which is very easy to implement.
Here's how you can set it up:

1. Enter your email in the <a href="https://my.remarkbox.com/join-or-log-in?return-to=https://my.remarkbox.com" target="_blank" rel="noopener">Remarkbox signup form</a>
2. Click the link from the email you should have received from Remarkbox (it might be in spam)
3. Follow the instructions on the <code>setup</code> page and embed your comment snippet.

Your Remarkbox comments should now be working. This system does not contain ads and respects user privacy more than Disqus but the free plan does not allow moderation and it is a rudimentary solution.

Some other cool options that I won't delve into are <a href="https://github.com/gitalk/gitalk" target="_blank" rel="noopener">Gitalk</a>, <a href="https://github.com/adtac/commento" target="_blank" rel="noopener">Commento</a> and <a href="https://just-comments.com/" target="_blank" rel="noopener">JustComments</a> (if you are willing to pay a small fee.)

I hope you enjoyed this tutorial and if you encountered any problems with setting things up, please comment down below.