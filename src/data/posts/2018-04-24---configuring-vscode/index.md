---
title: Configuring Visual Studio Code
date: 2018-04-24
published: true
tags:
  - productivity
---
This is a log of my first steps in VS Code. I decided to give Microsoft's VS Code a try after never really been happy about the IDE's I was working with. With a few years of (non-professional) coding experience under my belt, I feel like I have a pretty good idea what I am looking for now:

+ Good performance, so no noticable slowdown on large projects and longer use.
+ Fully configurable with plugins and control over the display settings.
+ Support for Javascript, Python, Go and more through plugins.
+ Markdown preview panel.
+ Unobtrusive user interface.
+ A "minimal" configuration that maintains functionality, for use in split-screen html editing.

And some nice-to-haves:
+ A panel with a terminal (for running a webserver and getting feedback).
+ Sensible defaults to get started without too much configuration. Espcially indentation and closing tags and braces.
+ Integration with Git would be cool.

# Previous experience: Jetbrains (PyCharm & WebStorm)

Jetbrains builds its full featured IDE's on a common Java engine. These are the products I spent most time with. It's a really powerful piece of software, and has served me well. Yet there were some disadvantages:

+ Memory leaks: if you keep it running for more than a day, it turns slows and that is only remedied by a restart.
+ The wealth of features also brings a huge amount of configuration and settings. While the preferences are searchable, it feels like it is trying to do too much: manage databases, virtualenvs, etc.
+ Separate poducts for different programming languages is a bit schyzofrenic. Certainly if you mix it up in a project.
+ Some minor gripes with the user interface (active file not highlighted in the explorer, some wasted space)
+ It's not a free solution, which is fine if it fulfills your needs exactly, but that was not the case for me.

# Previous experience: Atom

Atom is Github's open source offering, made with javascript and html. It is somewhat bare bones, but the idea is that the pluggable architecture will cover most use cases. I have only limited experience:

+ It's noticably slower than anything else I tried. The recent upgrades made is quicker, but still not up to par.
+ I had some instability issues in the past, where Atom would crash on opening a certain file.
+ The plugins are not consistent in quality and it's hard to figure out what to install to get a basic user experience going.
+ I gave up after serveral failed attempts at configuration (autocomplete, terminal window)

# First impression of VS Code

VS Code a free open source IDE by Microsoft, [hosted on Github](https://github.com/Microsoft/vscode). It's been quite a while since I touched any software from Microsoft, but this looks great on first glance. Some nice things to notice:

+ The splash screen gives some good suggestions, including language support plugins to install. Process goes real smooth.
+ There is a "Zen mode" that lets you focus only on the editor panel. Looks useful, also when editing side-by-side with a browser.
+ The interface looks somewhat familiar, with a side panel to the left and an editor panel to the right. Possiblity of splitting the editor;
+ Git integration looks really well thought out. Changes are displayed in the split editor screen.
+ Default settings comprise a dark theme, indentation support and closing brackets and tags. Suggestions look to be working fine too.
+ The user settings are a simple JSON file. Looks great for configuability and sharing/saving.

There are certain things that are not to my liking. I work on a small screen (13' macbook), so they mostly have to do with real estate.

+ The minimap looks fancy, but I am not sure what it adds, and you lose a portion of the right side.
+ The tabs add little value, certainly when the active file is also highlighted in the explorer panel.
+ A bottom panel (simply called "panel") does debugging, linting and terminal sessions. It'd be great if:
  + its menu could be positioned on the right, to clear out some vertical space
  + multiple terminal windows were presented as tabs instead of a combo box
+ The activity bar (on the left) is a monstrosity. It eats up a decent chunk of the screen, only to hold five oversized icons. You can hide it, but I would still like access to the icons.
+ The status bar is an over-saturated blue and has very small text.

# Preferred use and initial configuration

Time to get dirty with the configuration. `Code > Preferences > Settings` or `⌘,`opens the settings. The default settings are on the left, and on the right you can override the defaults. This should take care of the minimap and the tabs:

```json
{
    "editor.minimap.enabled": false,
    "workbench.editor.showTabs": false,
    "workbench.editor.enablePreview": false,
    "explorer.openEditors.visible": 0,
}
```
The tabs are easily replaced by bringing up and switching between recent files through `crtl⇥`, or by selecting files from the explorer.

Getting rid of the activity bar is bit more involved. First install [a package named "Commands"](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-commands) to trigger commands from the statusbar. The commands you add to the configuration file will be available to the status bar. We open up the config file through the "command pallete". Bring it up with `⌘⇧P` and type:

`Commands: Edit Configuration`

To show a toggle and the various sidebar options, enter this configuration:

```json
{
  "commands": [
    {
      "text": "  $(three-bars)  ",
      "command": "workbench.action.toggleSidebarVisibility",
      "tooltip": "Toggle"
    },
    {
      "text": "$(file-directory) Project",
      "command": "workbench.view.explorer",
      "tooltip": "Explorer"
    },
    {
      "text": "$(search) Search",
      "command": "workbench.view.search",
      "tooltip": "Search"
    },
    {
      "text": "$(repo-forked) Git",
      "command": "workbench.view.scm",
      "tooltip": "Source Control"
    },
    {
      "text": "$(bug) Debug",
      "command": "workbench.view.debug",
      "tooltip": "Debug"
    }
  ]
}
```

There is a list of icon names [here](https://gist.github.com/alan-null/106609976afbfade4705c9ebff66def0). Save the file, and refresh the Commands to see the result: `⌘⇧P` and `Commands: Refresh`. It's not perfect, because there is no indication which panel is currently being displayed.

The status bar is still ugly blue with small text. From [this issue](https://github.com/Microsoft/vscode/issues/1884), it is possible to change the color. Add the following field to your user settings.

```json
"workbench.colorCustomizations": 
{
  "statusBar.background" : "#303030",
  "statusBar.noFolderBackground" : "#222225",
  "statusBar.debuggingBackground": "#511f1f"
}
``` 

There is currently no good way to the change the font size of the statusbar.

# Further improvements

Some further thoughts of improvements:

+ breadcrumb navigation: VS Code displays the path next to the filename on the top. In PyCharm a similar path is made available, but in form of breadcrumbs. You can click the folders to see the content.
+ more?