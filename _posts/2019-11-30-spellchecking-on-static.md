---
title: Implement automatic spellchecking on your static blog
tags: [static, learning, webdev]
---
Have you ever made a huge spelling error on your blog and never noticed? It's a common mistake I've done because errors are hard to check for in markdown files. This post will teach you how to use <a href="https://www.thoughtworks.com/continuous-integration" target="_blank" rel="noopener">Continuous Integration</a> to find spelling mistakes in your posts and even get tips on how to improve your writing.

Continous Integration is software that verifies your code based on certain criteria every time you push to your repository. In this case, every time you push to your blog repo you will receive a warning with all the mistakes in your posts.

So, of course, you need to be using repositories and <a href="https://www.atlassian.com/git/tutorials/what-is-version-control" target="_blank" rel="noopener">version control</a> to host your code otherwise this will not work. We will be using the Travis CI continuous integration software. 

If you're blog repository is public or if you're a <a href="https://education.github.com/pack" target="_blank" rel="noopener">student</a>, all you have to do is go their <a href="https://travis-ci.org/getting_started" target="_blank" rel="noopener">getting started docs</a> to set it up for free. If you host your code on a private repo, you can use their platform only for the first 100 builds and then you need to pay a monthly fee. Sign in with Github and add your repo <a href="https://travis-ci.com/" target="_blank" rel="noopener">here</a> if your repo is private.

All right, now we need to configure our <code>.travis.yml</code> file. This file tells our Continuous Integration platform to execute certain commands on our code. If any errors are detected, you should receive a warning and you can get more details by looking at the <code>build log</code> on the travis site.

We will be using the two libraries below to check the quality of our posts. write-good is an efficient tool that gives you useful tips on how you can make your writing better. On top of that, we will be using the yaspeller library for spellchecking.
<div id="git-container">
<a href="https://github.com/btford/write-good" target="_blank" rel="noopener"><img src="https://gh-card.dev/repos/btford/write-good.svg" ></a>
<a href="https://github.com/hcodes/yaspeller" target="_blank" rel="noopener"><img src="https://gh-card.dev/repos/hcodes/yaspeller.svg"></a>
</div>
<br>
## Configuration
Our <code>.travis.yml</code> will change a little bit depending on which static site generator you use.
These two lines of code will be the same no matter what:
<pre><code class="yml">before_install:
  - npm install yaspeller -g
script: yaspeller "{ path to posts }/*.md" && npx write-good { path to posts }/*.md
</code></pre>
The <code>before_install</code> block simply tells travis to install the yaspeller library. Then, the <code>script</code> part tells yaspeller to analyse every(*) .md file in your post directory and then we call write-good in the same way. We don't need to install write-good because npm can use it directly with an internet connection.

At this stage, the CI won't work because we didn't specify a language for our build. This section will differ for each static site. I'll detail what you need to add for the most popular ones.

### Jekyll or Middleman
With Jekyll and Middleman we need to specify our ruby version:
<pre><code>language: ruby
rvm:
  - { ruby version }</code></pre>

### Gatsby or Hexo
These static site generators use <code>nodejs</code>:
<pre><code>language: node_js
node_js:
  - "stable"
</code></pre>

### Pelican
<pre><code>language: python
python:
  - { your python version }</code></pre>

Now all you need to do is <code>git commit</code> and <code>push</code> your repo which should already be connected to the Travis CI platform. On your Travis dashboard, you should see the build running. It will start by installing the scripts and then you'll start seeing the outputs of our spellchecking commands. It should look like this:

### Yaspeller output
![yaspeller output](https://raw.githubusercontent.com/hcodes/yaspeller/master/images/cli.en.png)
### Write-good output
<pre><code>In _posts/2019-09-10-useful-github-tools-and-libraries.md
=============
-------------
There are many ways to find the solution to this problem, in one of them you cou
          ^^^^
"many" is a weasel word and can weaken meaning on line 27 at column 10
-------------
st term to the answer if it is even else add 0
                         ^^^^^
"it is" is wordy or unneeded on line 37 at column 42
-------------
d term2 to the answer if it is even else add 0
                         ^^^^^
"it is" is wordy or unneeded on line 39 at column 33
-------------
</code></pre>

Pretty cool right! This has been so useful for me to see what my mistakes or possible improvements. I hope you got it work and you can always comment down below if there was a problem. 

You can also subscribe to my <a href="https://tinyletter.com/uzpg">newsletter</a> if you want to get tips about how you can code your static site and make it work even better.