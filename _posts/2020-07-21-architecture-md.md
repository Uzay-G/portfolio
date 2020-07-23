---
title: ARCHITECTURE.md
category: tech
tags: [opensource]
---

Open Source Software and especially large projects have a few defined standards that are used to promote welcoming new contributors and ensure a healthy collaborative environment like for example `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and [issue/pull request templates](https://github.blog/2016-02-17-issue-and-pull-request-templates/). 

Despite this, even in popular projects, there is a disconcerting lack of guidance on the actual structure of the software and its inner workings

For example, as a part of the [open source Google Code-in event](https://codein.withgoogle.com/archive/), last winter I started contributing and still contribute to [Public Lab](https://github.com/publiclab/), an environmental community that develops environmental software.

This forum's code base is relatively large, especially for an open source beginner. It has about ~25 controllers, ~30 models and a very complete testing suite with functional, unit and system testing all automated with Travis.

But I took some time and read through the code to understand how the different bits and pieces of the app interacted, and grew to a confident level with some parts and at least an abstraction of understanding with the others. I luckily also had the help of my mentors who answered my questions during this process.

Obviously, this mentorship is often unavailable and new contributors have to scrutinize the code base on their own, and try to come up with a vague understanding of the components that will prevent them from creating a breaking change in another part of the app.

For example, in other industries, usually physical blueprints serve as this stepping stone to provide an overview of how the product works as a whole and yet it's often missing in software engineering.

Let's take an example. I've been getting into the [Crystal](https://github.com/crystal-lang/crystal/) programming language as a faster, type-checked alternative to Ruby. I really enjoyed the language and wanted to contribute and understand the code. I checked out their [`CONTRIBUTING.md`](https://github.com/crystal-lang/crystal/blob/master/CONTRIBUTING.md) and it provided me with mostly a social / collaborative overview of where I can discuss issues or ideas, where I can ask questions, etc... What it did **not** provide was a **technical** overview of how the code is structured, the way it all comes together and its tech stack.

Putting this information would be helpful to not put off curious contributors that want to learn and develop a higher-level understanding of how the project works.

These frustrations are pushing me to propose a new "standard" for welcoming open source contribution, an `ARCHITECTURE.md` file, that would work on top of `CONTRIBUTING.md` to inform on:

- The tech stack, the backend / frontend / db / middleware technologies used
- The structure of the code and its logical links (diagrams :)), for example, crystal's code is organised with `/src/modulename/submodule.cr` structure (ie [`/src/csv/parser.cr`](https://github.com/crystal-lang/crystal/blob/master/src/csv/parser.cr), i.e. how does it all come together and what is the flow of the software. The [C4 model for software architecture](https://www.infoq.com/articles/C4-architecture-model/) provide an instruction set for how engineers can use diagrams to easily explain their architecture.
- Specifications for testing and general guidelines on testing constraints for said project paired with details on the CI process

It's easy for the creators of a project to represent in their minds the way all the pieces of the project come together, but transcribing these pieces together into a document would be extremely beneficial, not only to teach others but also to clarify and renew one's own understanding of their own code base.

If you have any other ideas for additional information it could contain, please comment! I think this could be incredibly useful in general to make access to open source projects easier and lower the learning curve.