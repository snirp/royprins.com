---
title: Basic django configuration
published: true
date: 2018-12-05
tags:
  - django
  - python
---
The default installation of Django has no provisions for different environments, confidential settings and 
uses the default SQLite database. It makes no assumptions about source control or virtual environments either.
 
 It is very likely that you want to change all this first thing, certainly when you plan to run your project in production. This post discusses a strategy that caters for these needs.

## Installing Django

Create a repository on Github and initiate it with `LICENSE`, `readme.md` and a python flavored `.gitignore` file. We can name it `django-project` for the sake of this guide. Next do:

```bash
git clone https://github.com/USERNAME/django-project.git
cd django-project
pipenv install django
    # Creating a Pipfile for this project…
    # Installing django…
pipenv shell
(django-project)$ django-admin startproject project . # mind the dot!
(django-project)$ python manage.py migrate
(django-project)$ python manage.py runserver
    # Starting development server at http://127.0.0.1:8000/
```

This should serve you with a welcome page on [http://127.0.0.1:8000/](http://127.0.0.1:8000/). 

For the virtual environment I decided to go with `pipenv`, as it solved some of my gripes with virtualenv. It notably automatically keeps track of packages you install (not unlike NPM), and works without any setup. You could use `virtualenv`, but I don't see any reason any more.

Note that I simply named my django project: `project`. That way your configuration files will be in a predictable place for all projects you ever create - namely in the `project` folder. Seems fitting.

## Environment variables

I prefer to combine the settings with an `.env` file for confidential and system-specific settings. This makes it explicit that it contains environment variables, which should never be included in version control. Your `.gitignore` file should already contain a `.env` entry (otherwise add it). This has the added benefit that the python settings files can safely be tracked with git.

Create a file called `.env` in the root folder (the one that contains the pipfile). It will contain key-value pairs that `pipenv` will automatically pick up. Here is a template that I use for my `.env` file:

```python
# This loads the correct settings
ENVIRONMENT=development
DJANGO_SETTINGS_MODULE=project.settings.${ENVIRONMENT}

# Generate your secret keys for each environment
# >>> import random
# >>> ''.join(random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50))
SECRET_KEY="replace_with_generated_key"
```

## Settings

Out-of-the-box Django manages the settings in a single file, which also holds confidential information as well as settings that are specific to environments. A general recommendation is to split up the settings into several files: one for every environment: `development.py`, `production.py`, etc. Potentially splitting out common entries into a `base.py` settings file.

This should give you the following settings files:

```
project/
  base.py
  development.py
  production.py
```

The `.env` file sets the `DJANGO_SETTINGS_MODULE` environment variable, making sure that the correct settings file will be loaded. The `base.py` should resemble:

```python
import os
SECRET_KEY = os.environ['SECRET_KEY']

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
]

SITE_ID = 1

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'

DATABASES = {
    # We will set this in the next paragraph
}


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
```

Notice that we can access the string values of the environment settings that were defined in `.env`, such as `os.environ['SECRET_KEY']`.

The `development.py` and `production.py` files can simply be:

```python
# development.py
from .base import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG
```

```python
# production.py
from .base import *

DEBUG = False
TEMPLATE_DEBUG = DEBUG
```

## Database

The default database engine is sqlite, but this will likely become Postgres in production. It’s best to mirror that in our development environment as well:

```sql
sudo -u postgres psql
# create database django-project;
# create user django with encrypted password 'django';
# grant all privileges on database django-project to django;
```

This sets up a database `django-project` with user `django`. Next install the database bindings:

```
pipenv install psycopg2
```

And provide the correct values for the variables inside the `.env` file.

```python
# .env

# ...

DATABASES_DEFAULT_NAME='django-project'
DATABASES_DEFAULT_USER='django'
DATABASES_DEFAULT_PASSWORD='django'
```

And update `base.py` to read:

```python
# project/base.py

# ...

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DATABASES_DEFAULT_NAME"),
        'USER': os.getenv("DATABASES_DEFAULT_USER"),
        'PASSWORD': os.getenv("DATABASES_DEFAULT_PASSWORD"),
        'HOST': 'localhost',
        'PORT': '',
    }
}
```


Some of the `django.contrib` apps have migrations waiting, so now that the database is set up we can apply them:

```bash
python manage.py migrate
```

## Authentication and admin

Before you are able to start using the admin, you need to initiate the user model. The naive way to do this is to use the default user model that ships with Django. However, it is advised [including in the official docs](https://docs.djangoproject.com/en/2.1/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project), not to do this:

>If you’re starting a new project, it’s highly recommended to set up a custom user model, even if the default User model is sufficient for you. This model behaves identically to the default user model, but you’ll be able to customize it in the future if the need arises

So you probably do **not** want to do the following (the typo is intentional):

```
python mange.py createsuperuser  # Do not do this. Read first
```

If you happen to have created users before rolling your custom user, you are likely to run into an error when migrating your custom model. This is how I solved that:

+ drop all tables from the database
+ delete existing migrations of your custom model
+ run manage.py migrate again to create the tables
+ now create and execute the migrations for your custom model.

I will explain creating a custom User model in another post.

## Conclusion and starter template

Following these steps should have solved:

+ Catering for different environments
+ Managing confidential settings
+ Set up Postgres database
+ Initiate a repository
+ Setting up a virtual environment

There is a [collection of Django starters](https://github.com/snirp/django-starter) you can use, that mirror these steps and additionaly provides a custom user model wih a choice of authentication methods.
