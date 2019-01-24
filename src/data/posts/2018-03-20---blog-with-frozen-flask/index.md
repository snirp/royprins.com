---
title: Tutorial for a static website with frozen-flask
published: true
date: 2018-04-19
tags:
  - python
  - flask
  - git
---

This tutorial teaches you how to create a basic website with Flask, built from markdown pages. Compared to solutions like Wordpress, it will cost less (free even), scale well and be easy to fully configure. You will build the site on the [Flask web framework](http://flask.pocoo.org/), with [Flask-Flatpages](https://pythonhosted.org/Flask-FlatPages/) and [Frozen-Flask](https://pythonhosted.org/Frozen-Flask/). Other static site generators exist (such as Jekyll), but none make use of a full web framework. This gives you the freedom to switch to a dynamic website - if the need ever arises - and to use all the modules from the Flask ecosystem.

Basic knowledge of Python, virtualenv and git is required for this tutorial. It should work on all operating systems, but only tested on MacOS for now.

Both the source code and the hosting will be done on Github. Hosting specifically on [Github Pages](https://pages.github.com/), which is a free and performant option that integrates nicely with the source code.

# Requirements of a blog

A weblog is a well-understood project with a lever of complexity that allows you to cover a lot of important bases in this tutorial. Let's define what constitutes the essentials of your weblog:

+ Write your blog postings as Markdown files;
+ Set basic post properties, such as title, date, author and summary;
+ Publishing workflow: choose published or draft (unpublished);
+ Fully controlled and simple URLs;
+ A homepage with general info and the most recent posts;
+ A blog page, listing all published blog postings;
+ A draft page, listing all unpublished postings;
+ An Atom feed of most recent posts; 
+ A sitemap for the search engines;
+ Ensure a dead-easy workflow (working with Frozen-Flask):
    1. Write a post.
    2. Freeze.
    3. Push to publish.

# Initial setup

+ Create a Github repository for your blog [here](https://github.com/new);
+ Initiate with a `readme`, suitable `.gitignore` file, and a `LICENSE`;

Using your terminal or command prompt, go to the location where you want to create your project root.
```
git clone https://github.com/<user>/<project>.git
cd <project>
virtualenv venv
source venv/bin/activate
pip install frozen-flask flask-flatpages
pip freeze > requirements.txt
```

This code clones the repository into a project directory. We install a virtual python environment and source this. All the required libraries as installed and saved to a `requirements.txt` file.  For the rest of the tutorial, you will be working from the virtual environment you just created. Now populate the project directory with some files and folders.

```
app.py
freeze.py
📂 pages
    📂 blog
📂 gh-pages
📂 static
    📂 css
    📂 img
    📂 js
📂 templates
.gitignore  # already present
LICENSE     # already present
README.md   # already present
requirements.txt # already present
```

# Hello flask

The `app.py` file serves as the root of the Flask app. Let's create a functional "Hello world" app.

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello world'

# Alternative to `flask run` command, but not recommended for development
# See here: http://flask.pocoo.org/docs/1.0/server/#server
if __name__ == "__main__":
    app.run()
```

The simplest way to run your flask app, is by running: `python app.py`. You should now get a message that your development server is running on http://127.0.0.1:5000/. Visit there to see the "Hello world".

The recommended way is through running `flask run`, but that requires some additional settings. You need to provide  an environment variable to point to the flask app (`echo FLASK_APP=app.py`) and one to activate debugging mode (`echo FLASK_DEBUG=1`). In my case I still got errors relating to unicode handling. I needed to provide two additional variables to sort that out. To avoid having to set this every time I run my virtual environment, I decided to add the settings to the `venv/bin/activate` file. It's a bit hacky, but does the job for me. Quit the development server with ctrl+C, and:

```
deactivate
cat <<EOT >> venv/bin/activate
> FLASK_APP=app.py
> FLASK_ENV=development
> LC_ALL=nl_NL.UTF-8
> LANG=nl_NL.UTF-8
> EOT
source venv/bin/activate
echo $FLASK_APP
# app.py
flask run
# Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

This may be a good time to commit your initial Flask app to Github. There is also a reference repository, so you can follow this tutorial along step-by-step. Visit [https://github.com/snirp/flask-blog-tutorial](https://github.com/snirp/flask-blog-tutorial) and switch to branch **step01**. Alternatively, you can clone the repository into another folder and checkout the branch.

# Set up the static pages branch

You should be using two branches within your repository. The **master** branch keeps track of the application code *except*  the static pages. The **gh-pages** branch tracks *only* the frozen static pages for publishing on Github Pages.

Organize the code in a project folder and a subfolder (`gh-pages`) that holds the static files. Our Flask app lives in the project folder and it will 'freeze' static files to the subfolder. This works nicely with Github Pages: it requires the frozen files to be in a separate branch named **gh-pages**. Make sure that you have the `gh-pages` folder inside your project directory. The idea is:

```
<project>/            <-> master branch
<project>/gh-pages/   <-> gh-pages branch
```

As recommended in the [documentation](https://help.github.com/articles/creating-project-pages-manually) we create the **gh-pages** branch as an orphaned branch. The following is true about orphan branches:

> The first commit made on this new branch will have no parents and it will be the root of a new history totally disconnected from all the other branches and commits.

```bash
echo "gh-pages/" >> .gitignore
# Do not track the gh-pages dir in the master branch (not strictly necessary)

cd gh-pages
git clone https://github.com/<name>/<repository>.git . 
# Clone into the same directory (mind the dot here)

git checkout --orphan gh-pages
# Switched to a new branch 'gh-pages'

git rm -rf .
# rm '.gitignore'
# rm 'README.md'
# etc
```

This again clones the repository, but now into the `gh-pages` folder, and create the **gh-pages** branch there. Any files that remain in the working tree are deleted and the `gh-pages` folder should now be empty apart from the `.git` folder.

# Your first static page

You can test if the github pages works correctly by creating a small website. While still in the `gh-pages` folder, do the following:

```bash
echo "I am a static website" > index.html
git add index.html
git commit -m "First commit on gh-pages"
git push --set-upstream origin gh-pages
To https://github.com/<user>/<repo>.git
  * [new branch]      gh-pages -> gh-pages
```

This creates the upstream branch **gh-pages** and pushes the static website. Behind the scenes Github works its magic. If a branch named "gh-pages" is present, the contents are made available on `http://<user>.github.io/<repo>/`. Visit this page with your browser to make sure you see the "I am a static website" message. It might take a minute for this to come online.

# Clean up

Two branches now exist within the repository in the `gh-pages` folder. Let's delete the **master** branch, since it is of not much use. Finally we check that only the **gh-pages** branch remains. Make absolutely certain that you run this code in the `gh-pages` folder:

```bash
git branch
  * gh-pages
    master
git branch -d master
  warning: deleting ...
git branch
  * gh-pages
cd ..
git branch
  # master
```

# Create a static site generator

There is now a dynamic website on the **master** branch and a static one in the `gh-pages` branch (and folder). Those two are not yet connected. To achieve just that, you can turn your flask app into a static site generator, using [Frozen-flask](http://pythonhosted.org/Frozen-Flask/). Frozen-flask freezes a dynamic Flask application into a set of static files in a different folder.

Update `freeze.py` to resemble:

```python
from flask_frozen import Freezer
from app import app

freezer = Freezer(app)

app.config['FREEZER_DESTINATION'] = 'gh-pages'
app.config['FREEZER_DESTINATION_IGNORE'] = ['.git*', 'CNAME', '.gitignore', 'readme.md']

if __name__ == '__main__':
    freezer.freeze()
```

Frozen-flask attempts to follow the URLs in your app and places the HTML files and static resources in the directory specified with the `FREEZER_DESTINATION`, overwriting or removing all files except those listed under `FREEZER_DESTINATION_IGNORE`. The following URLs can be found automatically:

+ Static files handled by Flask for your application or any of its blueprints.
+ Views with no variable parts in the URL, if they accept the GET method.
+ Results of calls to `flask.url_for()` made by your application in the request for another URL. In other words, if you use `url_for()` to create links in your application, these links will be “followed”.

Ok, that should do. The following commands freeze the app to the `gh-pages` folder and push the result to the repository.

```
python freeze.py
cd gh-pages
git add .
git commit -m "First frozen page"
git push
``` 

Visit your static website and it should now resemble the initial "Hello world" example from the dynamic website. Not much of a looker, but you actually built your own static site generator.

In the reference repository, we are now at the [step02](https://github.com/snirp/flask-blog-tutorial/tree/step02) branch.

# Custom domain and encryption (optional)

Github pages automatically serves your static website on `<user>.github.io/<repo>`. It has been possible to point your own domain to Github Pages for a while, but since May 2018 Github supports HTTPS connections for custom domains and a CDN for your content.

In your `gh-pages` folder create a file to indicate your domain: `echo mydomain.com > CNAME` and push this to the **gh-pages** branch. Follow the [Github documentation](https://help.github.com/articles/setting-up-an-apex-domain/) to point your DNS records to Github. Remember that we included the `CNAME` file under `FREEZER_DESTINATION_IGNORE`. This ensures it does not get removed when you run `python freeze.py`.

Note: there is no formal verification of ownership. You just point the DNS records to Github Pages and the first **gh-pages** branch to have the proper CNAME in it, gets it. In the words of Github support:

> Pages will only allow one repository to use a single CNAME. The first Pages repository to use a domain in its CNAME file gets it. If another repository tries to use the same domain, that Page build will fail.

After updating your DNS records, it may take a few hours for the changes to propagate and your website to become available. In the settings of your Github repository, you can also force the traffic to be encrypted (https).

# Templating in Flask

The point of using a web framework over coding all your websites by hand, is that you get a lot of power, ease and consistency from that. Update the `app.py` file to make use of a template:

```python
from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
```

Visit [127.0.0.1:5000](http://127.0.0.1:5000) to be greated by an error message. It should be along the lines of:

> jinja2.exceptions.TemplateNotFound

If you get a server error instead, you are not running Flask in debug mode. The error and stacktrace should still be visible on your console. Flask uses Jinja2 templates and we instructed the app to render a template. This template did not exist yet, so let's create it. First a base template that will be inherited by the other templates.

`templates/base.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
{% block head %}
    <meta charset="utf-8">
    <title>
        {% block title %} | My blog{% endblock %}
    </title>
    <meta 
        name="description" 
        content="{% block description %} A blog with frozen flask{% endblock %}"
        >
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/10up-sanitize.css/5.0.0/sanitize.min.css" integrity="sha256-qNrgGqSO9Xu/fUg5vIi1xwbnOleSZRAidBaJ8U4qEy8=" crossorigin="anonymous">
    <link rel='stylesheet' href="{{ url_for('static', filename='css/main.css') }}">
{% endblock %}
</head>
<body 
    class="{% block body_class %}{% endblock %}" 
    id="{% block body_id %}{% endblock %}"
    >
    {% block body %}
    <header>
        <div>MY BLOG</div>
        <nav>
            <a href="{{ url_for('index') }}">home</a>
            <a href="{{ url_for('blog_index') }}">blog</a>
        </nav>
    </header>
    <main>
        {% block main %}
        <h1>Main content goes here</h1>
        {% endblock %}
    </main>
    <footer>
        {% block footer %}
        <nav>
            <a href="{{ url_for('sitemap') }}">sitemap</a>
        </nav>
        {% endblock %}
    </footer>
    {% endblock %}
</body>
</html>
```

This looks like your standard HTML boilerplate, with a few interesting differences:
+ Blocks defined with `{% block %}...{% endblock %} that can be empty or hold default content;
+ The use of `{{ url_for('controller', ...arguments) }}` to link to your apps resources;

All templates that inherit from the base template, can extend or replace the content in the blocks. Create `templates/index.html` and extend the base template:

```html
{% extends 'base.html' %}

{% block title %}index {{super()}} {% endblock %}

{% block body %}
  <h1>Templating example</h1>
  <p>This is some content on the index page.</p>
{% endblock %}
```

The base template references a css-file in the static directory. Let's create `static/css/main.css`

```css
body {
    color: olive;
    font-size: 1.25rem;
}
```

Reload your website (`flask run`) and see the changes take effect. Some of the powerful constructs to notice:

+ The content in the `body` block of the base template is overwritten by the child template;
+ The content in the `title` block is appended with the `{{ super() }}` command;
+ Static files can be referenced with the `{{ url_for('static', ... ) }}` command.


In the reference repository, we are now at the [step03](https://github.com/snirp/flask-blog-tutorial/tree/step03) branch.

# Blogging in markdown

It's a joy to work with Markdown for simple blogging. This is where [Flask-flatpages](http://pythonhosted.org/Flask-FlatPages/) comes in: it takes Markdown files, parses the first YAML lines of the file ("frontmatter") into useable metadata, and renders the remainder to HTML.

```yaml
title: This is my first blog post
subtitle: Just a subtitle
excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
author: Roy Prins
published: true
date: '2018-05-30'
lastmod: '2018-06-01'

Lorem *ipsum dolor sit amet*, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

This is just a simple example. Save it as `pages/blog/lorem-one.md` and make a few copies with slight variations to populate your "blog". Add the following code to your `app.py` to enable the flatpages:

```python
from flask_flatpages import FlatPages

...

app.config['FLATPAGES_BLOG_ROOT'] = 'pages/blog'
app.config['FLATPAGES_BLOG_EXTENSION'] = '.md'

blogs = FlatPages(app, "BLOG")

# helper functions
def page_list(pages, publish_filter=None, limit=None, meta_sort='', reverse=False):
    """Basic sorting and limiting for flatpage objects"""
    if publish_filter is True:
        # Only published
        pages = [p for p in pages if p.meta['published']]
    elif publish_filter is False:
        # Only unpublished
        pages = [p for p in pages if not p.meta['published']]
    else:
        # All pages
        pages = [p for p in pages]
    if meta_sort:
        pages = sorted(pages, reverse=reverse, key=lambda p: p.meta[meta_sort])
    return pages[:limit]

...
```

Note: the flatpage instance has been extended explicitly with the name "BLOG". While not necessary, it's convenient this way to expand to multiple flatpage instances in the future beyond blog posts, like: "people", "projects", etc. The `page_list` is a custom helper function to allow some basic filtering, sorting and slicing. 

Start a python console and interact with the blogs:

```python
python
>>> from app import blogs, page_list
>>> dir(blogs)
>>> most_recent = page_list(blogs, 'published', 3, 'date', True)
>>> most_recent[0].meta['title']
```

We now have a way to bring markdown files and their frontmatter into Flask and a way to freeze our html files into a static website. There's obviously a part missing in between: generating urls and content from our posts.

In the reference repository, we are now at the [step04](https://github.com/snirp/flask-blog-tutorial/tree/step04) branch.

# Routing and templating

The fully functional blog will need to have at least the following pages:
+ `/` - A homepage with the latest 3 blog postings;
+ `/404.hml` - A 404 error page;
+ `/blog/` - A complete listing of published blog posts, sorted by date;
+ `/draft/` - The same, but for unpublished drafts. Not linked or indexed, but still findable.
+ `/blog/<my-blog-post-filename>/` - An individual blog posting (published or draft);
+ `/blog/atom.xml` - An atom feed with the 10 most recent blog posts;
+ `/sitemap.xml` - The sitemap;

Refactor `app.py` to create the routes:

```python
from flask import Flask, render_template, url_for
from flask_flatpages import FlatPages
from werkzeug.contrib.atom import AtomFeed

DOMAIN = "<name>.github.io/<repo>"

app = Flask(__name__)
blogs = FlatPages(app, "BLOG")

app.config['FLATPAGES_BLOG_ROOT'] = 'pages/blog'
app.config['FLATPAGES_BLOG_EXTENSION'] = '.md'


# helper functions
def page_list(pages, publish_filter=None, limit=None, meta_sort='', reverse=False):
    """Basic sorting and limiting for flatpage objects"""
    if publish_filter is True:
        # Only published
        pages = [p for p in pages if p.meta['published']]
    elif publish_filter is False:
        # Only unpublished
        pages = [p for p in pages if not p.meta['published']]
    else:
        # All pages
        pages = [p for p in pages]
    if meta_sort:
        pages = sorted(pages, reverse=reverse, key=lambda p: p.meta[meta_sort])
    return pages[:limit]

# controllers
@app.route("/")
def index():
    blog_list = page_list(blogs, True, 3, 'date', True)
    return render_template('index.html', blog_list=blog_list)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/404.html')
def static_404():
    return render_template('404.html')

@app.route('/blog/')
def blog_index():
    blog_list = page_list(blogs, True, None, 'date', True)
    return render_template('blog-index.html', blog_list=blog_list)

@app.route('/blog/<path:path>/')
def blog_detail(path):
    blog = blogs.get_or_404(path)
    return render_template('blog-detail.html', blog=blog)

@app.route('/draft/')
def draft_index():
    blog_list = page_list(blogs, False, None, 'date', True)
    return render_template('blog-index.html', blog_list=blog_list)

@app.route('/blog/atom.xml')
def blog_feed():
    feed = AtomFeed('My recent blog postings',
                    feed_url=DOMAIN+url_for('blog_feed'),
                    url=DOMAIN)
    blog_list = page_list(blogs, 'published', 10, 'date', True)
    for b in blog_list:
        feed.add(b.meta['title'],
                 content_type='html',
                 url=DOMAIN + url_for('blog_detail', path=b.path),
                 author=b.meta['author'],
                 updated=b.meta['lastmod'],
                 published=b.meta['date'],
                 summary=b.meta['excerpt'])
    return feed.get_response()

@app.route('/sitemap.xml')
def sitemap():
    routes = [
        (url_for('index'),      '2018-05-30'),
        (url_for('blog_index'), '2018-05-30'),
        (url_for('blog_feed'),  '2018-05-30'),
    ]
    urls = [ {"loc": DOMAIN + r[0], "lastmod": r[1]} for r in routes ] + \
            [ {"loc": DOMAIN + url_for('blog_detail', path=b.path), "lastmod": b.meta['lastmod']} for b in blogs]
    return render_template('sitemap.xml', urls=urls)

if __name__ == "__main__":
    app.run(debug=True)

```

Note the following:
+ `DOMAIN` sets the root domain for the absolute URLs (needed in sitemap and atom feed). This can be your personal github pages domain, or a custom domain you pointed there.;
+ Some duplicate effort on the `404` page. Flask has a handy error handler, but Github pages expects a 404.html page to redirect traffic to.
+ We put the `page_list` function to good use to filter and sort drafts and published posts.
+ The `render_teplate` functions define the template and provide it with data in the context.
+ This is all the code you need to get both a sitemap and an atom feed (although you still need a minimal template for the sitemap). New blog posts are automatically "discovered" and added to both.
+ All the URLs are human-readable, without id's or query parameters. Just the way people (and search engines) like.

Earlier we defined a base template, and most of the other templates will use that. They are pretty straightforward (also because of the lack of actual styling).

`templates/404.html`
```html
{% extends "base.html" %}

{% block main %}
    <h1>404 - page not found</h1>
    <a href="{{ url_for('index') }}">Go back to the front page.</a>
{% endblock %}
```

`templates/blog-detail.html`
```html
{% extends 'base.html' %}

{% block title %}
    {{ blog.title }} 
    {{super()}}
{% endblock %}
{% block description %}
    {{ blog.subtitle }}
    {{super()}}
{% endblock %}

{% block main %}
<article>
   <header>
        <h1>{{ blog.title }}</h1>
        <h2>{{ blog.subtitle }}</h2>
        <time datetime="{{ blog.date }}">{{ blog.date }}<time>
   </header> 
   {{ blog }}
</article>
    
{% endblock %}
```

`templates/index.html`
```html
{% extends 'base.html' %}

{% block title %}Home {{super()}} {% endblock %}

{% block main %}
  <h1>My personal website</h1>
  <p>This page was created with frozen flask.</p>

  <h2>Latest blog postings</h2>
  {% include "include/blog-list.html" %}

{% endblock %}
```

`templates/blog-index.html`
```html
{% extends "base.html" %}

{% block main %}
<h1>All blog postings</h1>

{% include "include/blog-list.html" %}
{% endblock %}
```

`templates/blog-detail.html`
```html
{% extends 'base.html' %}

{% block title %}
    {{ blog.title }} 
    {{super()}}
{% endblock %}
{% block description %}
    {{ blog.subtitle }}
    {{super()}}
{% endblock %}

{% block main %}
<article>
   <header>
        <h1>{{ blog.title }}</h1>
        <h2>{{ blog.subtitle }}</h2>
        <time datetime="{{ blog.date }}">{{ blog.date }}<time>
   </header> 
   {{ blog }}
</article>
    
{% endblock %}
```

`templates/sitemap.html`
```html
<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {% for url in urls %}
   <url>
      <loc>{{ url.loc }}</loc>
      <lastmod>{{ url.lastmod }}</lastmod>
   </url>
    {% endfor %}
</urlset> 
```

To clarify: both the `draft_index` and the `blog_index` routes point to the same `blog-index.html` template. The data in the context is different, causing the template to render a different list of postings. Both the `blog-index.html` and `index.html` templates render a list of blog postings. To avoid code re-use, the section that renders the list of postings is separated into an "include". This makes use of the context of the parent template.

`templates/include/blog-list.html`
```
{% for b in blog_list %}
<section>
  <a href={{ url_for('blog_detail', path=b.path) }}>
    <h2>{{ b.title }}</h2>
    <h3>{{ b.subtitle }}</h3>
  </a>
</section>
{% endfor %}
```

View the result by running `flask run`. In the reference repository, we are now at the [step05](https://github.com/snirp/flask-blog-tutorial/tree/step05) branch.


# Publish the blog

You have the basics of a blog, so it's time to tie it all together. The publishing workflow is as follows:
1. Freeze the app;
1. Commit and push the source code (optional, recommended);
1. Commit and push the gh-pages branch

This should do the trick (you could review the dynamic app before freezing and the frozen app before committing the changes):

```bash
python freeze
git add .
git commit -m "Create functional blog"
git push
cd gh-pages
git add .
git commit -m "Freeze"
git push
```

This should put your website online within minutes or seconds. Follow the same steps after adding or editing content. Github pages is smart enough to attach the correct headers to your `404.html` and `sitemap.xml` pages:

```python
>>>import requests
>>>r = requests.get('http://<name>.github.io/<repo>/sitemap.xml')
>>>r.headers
{ ... 'content-type': 'text/xml'}
>>>r = requests.get('http://<name>.github.io/<repo>/invalidurl.html')
>>>r.status_code
404
```

# Reflection

Some points to be aware of:
+ A static app has its limitations, due to having no database available.
+ Yet, lots of dynamic behavior could be added by making use of third party API's and javascript.
+ The publishing workflow could be simplified, by automating with [fabric](http://www.fabfile.org/) or perhaps using Github hooks to generate the static files.
+ Lot of basic blog functionalities are still missing. A platform like Jekyll may be easier to get started with when making a blog.
+ The default markdown parser does not work well for me (code blocks have no `<pre>`, no syntax highlighting)
+ That having been said: there is a use case for a lot of personal sites, event pages and business websites:
   + low barrier of entry (no wordpress);
   + it scales really really well;
   + basically free;
   + potential to grow into a full dynamic app with little effort.
+ The helper function is a bit ad-hoc and could warrent its own library (or perhaps better make use of existing functionalities)

# Further improvements

Here is a (non-exhaustive) list of things that would improve the functionality or experience:
+ Styling and theming.
+ Add images to the blog.
+ Search functionality
+ Link between static pages, so you can present related content.
+ Another flatpage instance to display your projects.
+ A comments section.
+ Make a multi-lingual blog.
+ Customize markdown parsing (dynamic content, header shift)
+ Tagging and other refinements.
+ Transform into a configurable library for easy re-use.

Each item on this list would justify a separate blog post. I hope to find time to add that in the near future.
