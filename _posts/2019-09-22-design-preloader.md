---
layout: post
title: Learn how to code a well-designed pre-loader
categories: [design, learning, tech-tutorials]
---

Preloaders are essential for websites that contain many images, videos or any other data-consuming files. A loader lets your users know that something is happening behind the screen and they are not just looking at a dead website. This tutorial will teach you how to code an engaging pre-loader using css animations and how to make it work with your own site.

### What you will learn about
- CSS keyframes
- CSS transitions
- The javascript 'onload' event

<br>
### The end result

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="etherio" data-slug-hash="gOYZLyM" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="A more classic loader">
  <span>See the Pen <a href="https://codepen.io/etherio/pen/gOYZLyM">
  A more classic loader</a> by Etherio (<a href="https://codepen.io/etherio">@etherio</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script> <br>

We'll be seeing how this works in more detail later in the post, but basically we use css keyframes to shift the y-axis of the little circles and their background color so they slowly move and change color. When the page loads, we hide the preloader and display the page content.

First, let's code the html snippet that will contain the loader and your page content:<br>
<pre><code class="html">
&lt;!-- The loader --&gt;
&lt;div id="loader"&gt;
  &lt;div id="uno" class="circles">&lt;/div&gt;
  &lt;div id="dos" class="circles">&lt;/div&gt;
  &lt;div id="tres" class="circles">&lt;/div&gt;
&lt;/div&gt;
&lt;div id="content"&gt;
&lt;!-- Your webpage goes here --&gt;
&lt;/div&gt;
&lt;br&gt;
</code></pre>

As we can see, these are just simple html divs, nothing special. We need to style these to have the effect we want.
First we'll style the background and circles and we will position our loader div using css.
<pre><code>
html {
  text-align: center;
  background: #282a36;
}
body {
  margin-top: 50px;
}
#loader {
  /* centered flex container */
  display: flex;
  justify-content: center;
}
.circles {
  width: 20px;
  height: 20px;
  margin: 5px;
  /* The border-radius curves the div corners to make it a circle */
  border-radius: 20px;
  background:white;
}
</code></pre>
Now we'll get to the really cool stuff you can do using css animations. The way it works is you define an <code>@keyframes</code> animation that lets you gradually change the property of an element at different periods in the effect.
<pre><code>
.circles {
  animation: up 1s infinite;
  animation-direction: alternate
}
@keyframes up {
  100% {transform: translateY(-20px); background: #ff8080}
}
#dos {animation-delay: 1.7s}
#tres {animation-delay: 3.4s}
</code></pre>

For example, for this preloader, we tell it to gradually move the circles up and change their background. The <code>100%</code> makes it complete the change at the end. You can learn more about keyframes <a href="https://www.w3schools.com/css/css3_animations.asp" target="_blank">here</a>. Once our keyframe has been coded, we need to add it to our circles using the animation property that in this case takes 3 arguments, the name of the keyframe, its duration and how many times it should run. <br>
The animation direction property set to alternate tells it to do the animation in the reverse order every two times. <br>
We also need to add a variating animation-delay to the circles so the first circle will rise up first and only after that the second and the third will too.

At this point, you should have a working animation looking like this:
<pre><code>
<div id="loader">
  <div id="uno" class="circles"></div>
  <div id="dos" class="circles"></div>
  <div id="tres" class="circles"></div>
</div>
<div id="content">
</div>
</code></pre>

The final css touch is to style our webpage content to make it invisible but also add a <a href="https://www.w3schools.com/css/css3_transitions.asp" target="_blank">transition </a>to it so that when our javascript reveals it, it will slowly fade into view. Add this to your css file:
<pre><code>#content {
  opacity: 0;
  transition: opacity 1.5s
}
</code></pre>

Ok, now we have our animation, but what's wrong is the loader isn't replaced by the webpage when it's loaded. To do that, we need to add some javascript at the bottom of your html body.

The simple javascript code you can see below waits for the page to load (<code>window.onload</code>) and then runs a function that hides the loader and reveals the webpage.
<pre><code>
&lt;script>
window.onload = function() {
  document.getElementById("loader").style.display= "none"; 
  document.getElementById("content").style.opacity = 1; 
}
&lt;/script&gt;
</code></pre>

There we go! Now all you have to do is add your page content in the content div and you will have a functional preloader. Remember that you will only see the loading animation if your webpage takes time to load. If you encounter any problems or if you have any helpful feedback you can post a comment down below using your github account. <br>
I hope this article helped you out! 