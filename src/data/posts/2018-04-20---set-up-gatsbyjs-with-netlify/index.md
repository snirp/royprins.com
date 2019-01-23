---
title: Set up gatsby with netlify CMS
date: 2018-04-20
published: true
tags:
  - gatsby
  - netlify
  - git
---
In this post we will explore setting up a basic Gatsby site, a repository to hold our code and the integration with Netlify.

# Get started with Gatsby

The project will be named "royprins.com", but you can substitute any project name. Let's start with a very basic configuration:

```bash
npm install -g gatsby
gatsby new royprins.com https://github.com/gatsbyjs/gatsby-starter-hello-world
cd royprins.com
```

This includes the one-time command to install the Gatsby CLI globally. Gatsby projects are created by cloning existing repositories. In this case I opted for the most bare-bones "hello-world" starter.

```bash
gatsby develop
```

This command starts the development server. This supports NodeJS Hot Module Reloading (HMR), meaning that most of your changes will be reflected immediatedly without reloading. The exception to this are the Gatsby config files in the root. We would need to restart the server to see the effect of changes in `gatsby-config.js` and `gatsby-node.js`.

Explore the following links
+ [http://localhost:8000/](http://localhost:8000/)
+ [http://localhost:8000/___graphql](http://localhost:8000/___graphql)

# Understanding Netlify and Netlify CMS
Netlify is a platform that serves static pages and resources from their own Content Delivery Network. They also have a great workflow, where you point them to your Github / Gitlab / Bitbucket repository and give build instructions. Netlify monitors the repo and when anything in the master branch changes, it takes care of updating your live website. In their own words:

>Build, deploy, and manage modern web projects. Get an all-in-one workflow that combines global deployment, continuous integration, and HTTPS. And that’s just the beginning.

Yeah, they are big on buzzwords, but they earned it. There is even a bit more to it, including their own CMS. You can plug this in your Gatsby site (which we will do), so it can manage your static assets. Any change to the managed `json`, `yaml` or `markdown` files will be written to the Github backend. Changes to the repo will trigger a new build of your static site (because that is what Netlify does), and presto your changes are live.

Note that none of the tools: `Gatsby`, `Netlify`, `Netlify CMS`, or `Github` depend on each other. They can all be used in conjunction with other tools. This has obvious advantages, but it will require some configuration to get them working together. 

# Integrate Gatsby, Netlify, Netlify CMS and Github

## Add instructions for Netlify
We will be asking Netlify to create and deploy production builds for us. This requires Netlify to be aware that it has to build using Gatsby and which Node version to use.

We first insert the gatsby command line tools into the dependencies of our `package.json` file. This tells Netlify what tools it needs to build your site.

```bash
npm install gatsby-cli --save
```

Then we log the correct Node version in the project: [documentation here](https://www.netlify.com/docs/continuous-deployment/#set-node-ruby-or-python-version).

```bash
node -v > .nvmrc
```

## Configure Github repository for Gatsby
Create an *empty* repository on Github.com and do:

```bash
echo "# royprins.com" > README.md
git init
git add .
git commit -m "First commit"
git remote add origin https://github.com/snirp/royprins.com.git
git push -u origin master
```

This will overwrite the default README file, add any files, commit, and push to the `master` branch. Make sure you use the correct github link.

## Connect Netlify to Github

1. Sign up for Netlify
2. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Click [New site from Git]
2. Choose Github
2. Find and select your repository
2. Keep default settings and press [Deploy site]

You are now taken to your site dashboard, and after a minute or so your site will be published to an automatically generated subdomain of netlify.com. Click the link to see your "hello world" site live.

Under Settings > Domain management, you can change the name of the subdomain manually to something more memorizable.

## Install and configure Netlify CMS in Gatsby

Gatsby has a plugin-architecture and the Netlify CMS is available as one. Let's install the packages through NPM:

```commandline
npm install --save netlify-cms gatsby-plugin-netlify-cms
```

Among other things, Gatsby manages the plugins in a file named `gatsby-config.js` in the root of the project. Create it, if it's not there.

```javascript
// gatsby-config.js

module.exports = {
  plugins: [`gatsby-plugin-netlify-cms`],
};
```

The Netlify CMS has a configuration file of itself. Create it under 
`static/admin/config.yml`

```yaml
backend:
  name: test-repo

media_folder: static/assets

collections:
  - name: blog
    label: Blog
    folder: src/data/blogs
    create: true
    slug: "{{year}}{{month}}{{day}}_{{slug}}"
    fields:
      - { name: title, label: Title }
      - { name: subtitle, label: Subtitle, required: false }
      - { name: cover, label: Cover image, required: false, widget: image}
      - { name: date, label: Date, widget: date }
      - { name: published, label: Published, widget: boolean, default: true}
      - { name: body, label: Blog post, widget: markdown }
```
The `backend` is a temporary setting and everything that we do will only be saved in memory for now. The `media_folder` will hold any images etc. that we add to the Blog post. Check the [Netlify CMS documentation](https://www.netlifycms.org/docs/configuration-options/) for the other settings. It should be a fairly typical setup for a blog.

Some important things to note:
+ The `slug` only determines how the filename is generated (only when created, not when edited). It has nothing to do with the eventual URL of the blog post.
+ Netlify CMS relies on a `title` field to exist to generate the slug. I am sure this will be more customizable in the future.
+ Gatsby will treat the body field as the actual markdown payload, and other fields will be available as frontmatter.

Restart the server for the changes in `gatsby-config.js` to take effect. We can now play with the admin interface provided by Netlify CMS on: [http://localhost:8000/admin/](http://localhost:8000/admin/). You can make and preview blog posts. Again: note that nothing you do will actually be saved to a file at this point.


## Hook up the Netlify CMS to Github

The CMS proves to be a natural fit for the Git workflow. Check out how the two work together:

| Actions in Netlify UI | Perform these Git actions |
| --------------------- | ------------------------- |
| Save draft	| Commits to a new branch (named according to the pattern cms/collectionName-entrySlug), and opens a pull request |
| Edit draft	| Pushes another commit to the draft branch/pull request |
| Approve and publish draft	| Merges pull request and deletes branch |

Pretty nifty, if you ask me. This requires the Netlify CMS to have access to your repository. We will add our website as an OAuth API application to our Github account. Next, Netlify will provide us with a server to send signed OAuth requests to the Github API server. Here is a summary of the steps:

+ In Github, go to [Account settings > Developer Settings > Oauth Applications](https://github.com/settings/developers), and add a `New OAuth app`.
+ Make sure to enter `https://api.netlify.com/auth/done` as the callback URL.
+ Open the []Netlify dashboard](https://app.netlify.com/) in a new tab and open your project.
+ Navigate to Site settings > Access control > OAuth.
+ Under Authentication Providers, click Install Provider.
+ Select GitHub and copy the Client ID and Client Secret from Github and save.

More detailed instructions can be found here: [Netlify authentication providers](https://www.netlify.com/docs/authentication-providers/#using-an-authentication-provider).

We can now tell Netlify CMS to use the Github repository as a backend. Change `static/admin/config.yml` to read:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name
```

Wrap it up by saving and committing all changes to your repository.

```commandline
git add .
git commit -m "Configure Netlify CMS for initial use"
git push origin master
```
In your [Netlify dashboard](https://app.netlify.com), select your site and click `Deploys`. The pushed commit has automatically triggered a new deploy on Netlify. We can now experience the fully functional CMS on <your-subdomain>.netlify.com/admin/. You will be prompted for a Github login for authentication. The first time you should also authorize your app to have access to the repositories.

Play around and add some blog postings. When you add a blog post, two things happen:
+ The blogpost (and the media) get committed to the repository;
+ This triggers the Netlify deploy mechanism to build and put the site live.

Visit your Github repo and the Netlify dashboard to see a record of the steps.

The repository on your development machine is now out-of-date. You can pull in the files created by the CMS by running:

```commandline
git pull origin master
```

You could also use your development environment to add blog postings, or even directly add your markdown files to the `src/data/blogs` folder. The markdown files contain YAML frontmatter before the acual markdown payload. This is in keeping with other static blogging engines such as Jekyll. Here is an example:

```yaml
---
title: How to make a Gatsby blog
subtitle: And all the fine details of Netlify integration.
cover: /static/assets/20180217_163549.jpg
date: 2018-04-20
published: true
tags:
  - gatsby
  - netlify
---
This is the *markdown* section.
```
# What's next?

This takes care of a CMS, but have done nothing to display the blog postings. In another post, I will explore the inner workings of Gatsby by generating the pages needed for the blog.

# My thoughts
+ The current default Gatsby template adds quite some files and (opinionated) configuration. While it may be nice at times to use a prepared template, I do not see myself using it soon. I would suggest making the bare "hello-world" template the default.

+ Netlify CMS feels very early stage, with several shortcomings and bugs. I expect (and hope) much to change, with changes that may be backwards-incompatible.

+ Both the Gatsby project and the Netlify CMS have an active developer community and an ambitious roadmap. The quick responses and willingness to address issues inspires confidence.

+ Gatsby has quite some "magic" built into it (layouts, page folder, html headers). This can all be configured, but I would prefer a more vanilla framework where this behavior is handled through manual configuration. The plugin architecture and git templates could then serve to achieve the same ease of use.

+ Neither Gatsby nor Netlify CMS currently has support for markup languages other than Markdown. Support for reStructuredText and Asciidoc would be nice to have.

# References:
+ [Creating a static blog with Gatsby, by Dustin Schau](https://objectpartners.com/2017/07/19/creating-a-static-blog-with-gatsby/)
+ [How to build a React and Gatsby-powered blog in about 10 minutes, by Emmanuel Yusufu](https://medium.freecodecamp.org/how-to-build-a-react-and-gatsby-powered-blog-in-about-10-minutes-625c35c06481)
+ [A Step-by-Step Guide: Gatsby on Netlify, by Netlify](https://www.netlify.com/blog/2016/02/24/a-step-by-step-guide-gatsby-on-netlify/)
+ [Netlify CMS, by Gatsby](https://www.gatsbyjs.org/docs/netlify-cms/)
