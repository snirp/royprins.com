---
title: Publish Python libraries on PyPI
date: 2018-03-16
published: true
tags:
  - python
---

PyPI is a [collection of python packages](https://pypi.org/) that you absolutely must submit your package to for it to be easily one-line installable. This guide covers the basics and makes the following assumptions:

+ The module/library/package that you're submitting is called `mypackage`.
+ `mypackage` is hosted on github.

On PyPI Live and also on PyPI Test you must create an account in order to be able to upload your code. I recommend using the same email/password for both accounts, just to make your life easier when it comes time to push. Your settings can be save in a `pypirc` file:

`~/.pypirc`
```
[distutils]
index-servers =
  pypi
  pypitest

[pypi]
username=your_username
password=your_password

[pypitest]
repository=https://test.pypi.org/legacy/
username=your_username
password=your_password
```

Because this file holds your username and password, you may want to change its permissions so that only you can read and write it. From the terminal, run:

```bash
chmod 600 ~/.pypirc
```

Every package on PyPI needs to have a file called `setup.py` at the root of the directory. If your'e using a markdown-formatted readme file, you'll also need a `setup.cfg` file. Also, you'll want a `LICENSE.txt` file describing what can be done with your code. So if I've been working on a library called mypackage, my directory structure would look like this:

 ```
root-dir/   # arbitrary working directory name
  setup.py
  setup.cfg
  LICENSE.txt
  README.md
  mypackage/
    __init__.py
    foo.py
    bar.py
    baz.py
```

## Upload your package to PyPI Test

Run:
```bash
python setup.py sdist upload -r pypitest
```

You should get no errors, and should also now be able to see your library in the test PyPI repository.

## Upload to PyPI Live

Once you've successfully uploaded to PyPI Test, perform the same step but point to the live PyPI server instead. To register, run:

```commandline
python setup.py sdist upload -r pypi
```

and you're done! Congratulations on successfully publishing your first package!


### References:

+ [How to submit a package to PyPI, by Peter Downs](http://peterdowns.com/posts/first-time-with-pypi.html)
+ [Openstack-pbr documentation](https://docs.openstack.org/pbr/latest/)