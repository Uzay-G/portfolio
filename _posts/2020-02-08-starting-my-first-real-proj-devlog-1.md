---
title: "Starting my first real project - Devlog #1"
tags: [goals, devlog, learning]
category: tech
---

I started at the end of 2019 my work on Devolio, a social community for programmers! I found other online tech communities sometimes too clickbait or dull (Case in point of a post I just found:_Top 13 useful JavaScript array tips and tricks you should know_) or they were not focused on actual discussion (talking to people about tech is super interesting!).

So I want to build this platform for programmers to share and engage with other fellow coders.
I am building this with a Rails backend and the only JS framework I am using is Jquery (outdated stack but it works). All this will be hosted on Heroku for now but I will switch to more scalable alternatives later.

I am really excited about the different features I am working on to make my project fun for me to build and for other hackers to use:

- Design customization (think MySpace) secured with this [great lib](https://github.com/rgrove/sanitize) ([CSS can be dangerous!](https://stackoverflow.com/questions/41925390/what-are-the-risks-associated-with-using-inline-styles))
- public and open API with documentation (opens up avenues for data analysis and tons of interesting projects)
- open source collaboration possibilities (creating a friendly environment to build a hopefully awesome project)
- markdown everywhere with the [Redcarpet parser](https://github.com/vmg/redcarpet)

## Progress & Pics

School takes up a decent chunk of time but I am still happy with my progress and the overall design and structure of the project.

- Post layout and design:

![Post design](/assets/images/post.png)

- Profile page structure

![Profile](/assets/images/profile.png)

- Login and Oauth with Github handled through [Sorcery](https://github.com/Sorcery/sorcery).


![login](/assets/images/github-login.png)


- Avatars (see below). I spent quite a bit of time trying to get the perfect user avatar setup. A banal user without a github username or a custom pic, is assigned an identicon from [this beautiful software](https://jdenticon.com/) (this is what you see at the start of the gif). If they give their github username, the github avatar will be displayed instead, and of course they can also add their own pics.

![avatars!](/assets/images/avatar.gif)

## Future Goals

Here are the features and important parts of the project logic I need to work on:

- A well-designed comment model
- enhancing the project design (users can share and design pages for projects they are working on)
- Adding AJAX for follows and likes
- setting up AWS S3 for image uploads in posts

It is really exciting to be working and deploying the first project I am really serious about! I can't wait. Of course, all this shiny functionality won't matter if people don't find the project useful (paradoxical considering community-based projects are only useful if they have users). I want to see if there is real interest in building this tool and would love to get the help of other devs for this product!


You can sign up for updates on Devolio at my [landing page](http://bit.ly/devolio-landing) and you can chat about the project with me on [it's discussion page](https://www.devol.io/discuss).

If you have any questions, please comment down below and I'd **really appreciate to hear your thoughts!**

Big thanks to the amazing [Github Student Pack](https://education.github.com/) for allowing me to create this!
