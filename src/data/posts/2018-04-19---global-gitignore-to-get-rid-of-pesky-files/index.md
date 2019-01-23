---
title: Global gitignore to get rid of pesky files
date: 2018-04-19
published: true
tags:
  - git
  - macos
---

There is a way to ignore files and folders system-wide from your git repositories. This can save you quite a bit of work if you find yourself repeatedly updating the `.gitignore` file in your projects. Note that this will not show up in the `.gitignore` file itself, so it is a bad idea to put anything related to specific types of projects in there.

My development system is a macbook and I frequently use PyCharm or Visual Studio Code. This may result in the following files and folders being created in the project folder: 
+ .DS_Store
+ .idea/
+ .vscode

As per [this question](https://stackoverflow.com/questions/18393498/gitignore-all-the-ds-store-files-in-every-folder-and-subfolder/)
I did the following:

```bash
echo .DS_Store >> ~/.gitignore_global
echo .idea/ >> ~/.gitignore_global
echo .vscode/ >> ~/.gitignore_global
# Make sure the file is added to the global git config
git config --global core.excludesfile ~/.gitignore_global
```
