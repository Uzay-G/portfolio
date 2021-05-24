---
title: Brainstorming a Decentralized Network for Content Discovery
category: tech
tags: [projects]
---

This post is a description of a new tentative idea for a decentralized network of content discovery.

I've called it Espial ("espial" means discovery).

Many well-known services use content recommendation systems to allow their users to discover new content or products related to previously expressed interests.

They generally use two methods for this:

- **content-based recommendations** - analyzing the content and its metadata and then linking it to other items that share similarities. This suffers from limitations related to having to devise a custom algorithm to find similarities between the specific type of content you're looking at (which could be audio, text, images), and also the fact that often these algorithms will mostly focus on recommending strictly similar content, and not content that lies a bit further off from what the user has been looking at, but nonetheless intersects.
- **collaborative filtering** - these services can also use their database of users to filter recommendations: if two users A and B have common items they've "liked", then we can recommend items A likes (that B has not seen) to B, and vice versa. These are much easier to implement because of the possible difficulties of content-based recommendation. They can also draw more nuanced recommendations because this approach does not focus on the mere similarity of documents but through a more powerful development of "similar users profiles". **However, they rely on having enough data and an active userbase.**

## A sketch
This sketch is a surface level description of how the network would work, and will be gradually refined.

Note: this specific example is for the topic of books, but Espial plans to be a general solution for this type of content recommendation, so it could also be applied to other domains like web articles, movies, music, etc...
![](https://f.sed.lol/files/igeNd.png)


## The Problems
Espial plans to solve several problems in the way content recommendation is traditionally used.

Currently, most people use centralized services or platforms like Goodreads, Spotify, etc... to find new content. This works fine, but it also creates barriers: what do I do if I want to interact or get recommendations without being a user of these services, and don't plan on becoming one? For example, If I just store the books I've liked in a text file, I should also be able to get recommendations on my own terms using a network like Espial. Additionally, the diversity and accessibility that comes with a more open network would allow individuals to connect to a wider range of users and tastes, and this beyond the scope of a single application or community, as opposed to the approach apps like Goodreads do. In my previous example, I'd get recommendations and discover new content from all the members of the network interested in books, who also share my tastes!

Members would also be able to directly script their behavior on the network, and **dictate the data and recommendations they send, and those they receive.** This freedom in the content discovery does not exist with current solutions, that merely run closed algorithms and give the user the output (like for example Spotify tailored mixes).
 
On the other side, what if I want to start a community, and I'd like to also be able to recommend certain types of content to my users based on the data they input, and don't have enough data for good recommendations yet? The network would then also be useful not just for individual users (as mentioned earlier), but also apps. Indeed, apps could plug in their data into the network and get useful recommendations, while contributing back. Thus, the value and access to recommendations would be delocalized from the walled garden of a specific application to an open and mutually-enhancing network.

**Usecases for individuals**:

- control and flexibility over the way users send data and interact
- access to a broader pool of content and recommendations

**Usecases for developers**:

- Ability to create applications that provide quality recommendations, without having a large user base or access to diverse data.
- Independence from having to implement common recommendation networks, simply plug your app into the Espial network.

This notion of **flexibility** and independence in the way members access the network is crucial. It would allow us to widen the framework in which we view content recommendation, and would enable new ideas and features to emerge. One of these could be the idea of implementing recommendations not just on one topic ("books"), but transversally: if two members have similar book tastes, and are also both interested in movies, why not let them suggest movies to each other (all of this in an automated manner).

**Espial aims to solve these problems and introduce a new way of viewing recommendation and content discovery that enables user freedom and encourages developers to build their own applications on a convenient decentralized recommendation network, with privacy and accessibility.**

I am currently brainstorming the:

- design of the network (related to P2P, privacy and network design)
- usecases / viability
- how to approach the grouping and aggregation of topics to recommend like books, movies, etc...
- once it's implemented, can the Espial project reach the critical mass of network participants for it to provide useful recommendations?

Email me or message me on [Twitter](https://twitter.com/uzpg_) if you have any feedback or ideas related to this nascent project.
