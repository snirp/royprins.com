---
title: Django custom user model - email authentication
date: 2018-12-17
published: true
tags:
  - python
  - django
  - git
---
Django offers a built-in User model with utilities for authentication, password hashing, etc. As your app develops, it is fully to be expected that the default `User` model will not exactly fit your needs. Replacing it in a later phase is a hassle, so it is recommended to roll your custom user model from the start. Actually it is the [official recommendation](https://docs.djangoproject.com/en/2.1/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project).

In a lot of cases, there is no use for the `username` field: using only the user’s email for registration will make the user experience a bit better. Another quirk of Django’s user are the `first_name` and `last_name` fields. Coming from a country where ‘interjections’ are a thing, this will not suffice. A simple optional `name` field would be much better.

## The brief

This post will detail how to create a custom user with email authentication and how to integrate this in your admin interface, and your project as a whole. We will then replace the custom views with django-allauth and add Oauth (3rd party / social login).

1. Basic Django setup
1. About custom user models
1. Create the model and manager
1. Use the custom user
1. Custom views for account management
1. Using Allauth for account management

## 1. Basic Django setup

Here is a brief rundown to get started. We will name the project “customuser”. In a project directory, do:

```
pipenv install
pipenv shell
pipenv install django
django-admin.py startproject customuser .  # mind the dot
python manage.py runserver
```

This should give you a test server on: [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

Note that we did not yet apply any migrations. It is best to first make migrations for your custom user. Not having the custom user model when you start your project will likely lead to conflicts!

An example project can be found on github: [https://github.com/snirp/django-email-authentication](https://github.com/snirp/django-email-authentication)

*There are better basic setups, that deal with confidential settings and environments. Take a look [at my post here](royprins.com/blog/basic-django-settings/).*

## 2. About custom user models

Django documents [three ways](https://docs.djangoproject.com/en/2.1/topics/auth/customizing/) to extend or replace the default User:

* Extend with a one-to-one field to User
* Substitute by subclassing from AbstractUser: this preserves the fields and authentication methods
* Substitute by subclassing from AbstractBaseUser: this will **not** preserve the default fields, also impacting existing methods.

The third option is most involved, but it is the one we will choose, because it offers the freedom to customize registration with `email` rather than `username`.

First order of business: a new app named users to hold our custom user model. Name it however you please.

```bash
python manage.py startapp users
```

And add the following to `settings.py` (or `base.py` if you went for the customized settings). This indicates that we want to use a yet-to-be-created model `users.User` for authentication, replacing the default `django.contrib.auth.models.User`.

```python
INSTALLED_APPS = [
    ...
    'users',
]

AUTH_USER_MODEL = 'users.User'
```

When you need to refer to the custom user from other parts of your code, you can do that in any of the following ways:

* `from users import User`
* `from customuser.settings import AUTH_USER_MODEL`
* use `the get_user_model()` method from `django.contrib.auth`

The third method is preferred — certain for code that you intend to re-use — as it deals with both the default and custom user models.

## 3. Create the model and manager

The following model in `users/models.py` takes care of the custom `User` model.

```python
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):

  def _create_user(self, email, password, is_staff, is_superuser, **extra_fields):
    if not email:
        raise ValueError('Users must have an email address')
    now = timezone.now()
    email = self.normalize_email(email)
    user = self.model(
        email=email,
        is_staff=is_staff, 
        is_active=True,
        is_superuser=is_superuser, 
        last_login=now,
        date_joined=now, 
        **extra_fields
    )
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_user(self, email, password, **extra_fields):
    return self._create_user(email, password, False, False, **extra_fields)

  def create_superuser(self, email, password, **extra_fields):
    user=self._create_user(email, password, True, True, **extra_fields)
    user.save(using=self._db)
    return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=254, unique=True)
    name = models.CharField(max_length=254, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_absolute_url(self):
        return "/users/%i/" % (self.pk)

```

Our `User` subclasses `AbstractBaseUser`, giving it the methods, but none of the default fields. We define our own fields, with the following being special cases:

* `USERNAME_FIELD:` The name of the field that will serve as unique identifier (which will be the `email` field for us).

* `EMAIL_FIELD`: The name of the field that will be returned when get_email_field_name() is called on a User instance.

* `REQUIRED_FIELDS`: Required fields besides the `password` and `USERNAME_FIELD` when signing up.

* `is_staff`: required by the admin.

* `is_superuser`: used by the PermissionsMixin to grant all permissions.

* `is_active`: indicates whether the user is considered “active”.

The `UserManager` subclasses the `BaseUserManager` and overrides the methods `create_user` and `create_superuser`. These custom methods are needed because the default methods expect a `username` to be provided. The admin app and `manage.py` will call these methods.

## 4. Use the custom user

Apply the migrations and create a superuser. You should be prompted for an `Email:` (and not a username) and no errors should occur.

```
python manage.py makemigrations users
python manage.py migrate
python manage.py createsuperuser
    Email: 
python manage.py runserver
```

The admin interface isn’t aware of the custom User model yet, so let’s take care of that in `users/admin.py`:

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password', 'name', 'last_login')}),
        ('Permissions', {'fields': (
            'is_active', 
            'is_staff', 
            'is_superuser',
            'groups', 
            'user_permissions',
        )}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'password1', 'password2')
            }
        ),
    )

    list_display = ('email', 'name', 'is_staff', 'last_login')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)


admin.site.register(User, UserAdmin)
```

After running the server, try to log into [127.0.0.1:8000/admin](http://127.0.0.1:8000/admin) with the newly created superuser account. Try adding, editing and removing a few more user accounts for good measure.

You can also play around with the User model in the shell:

```python
python manage.py shell
>>> from users.models import User
>>> u = User.objects.all()[0]
>>> u.set_password("newPassword")
>>> u.save()
>>> u.get_absolute_url()
# '/users/1/'
```

It is worth taking the following from the Django docs into consideration concerning custom user models:

> Think carefully before handling information not directly related to authentication in your custom user model.

> It may be better to store app-specific user information in a model that has a relation with the user model. That allows each app to specify its own user data requirements without risking conflicts with other apps. On the other hand, queries to retrieve this related information will involve a database join, which may have an effect on performance.

## 5. Custom views for account management

We will next look at custom account-related operations, such as: logging in, signing up and viewing the account information. This section shows you how to do it with custom views. In most cases it would be better to use a library for these common operations, so feel free to skip ahead to the next section, where we will cover the same using the `Allauth` library.

The users should be able to log in, log out, sign up and view their profile. This is what that would look like in `customuser/urls.py` and `users/urls.py`.


```python
# customuser/urls.py

urlpatterns = [
    ...
    path('accounts/', include('users.urls')),
]
```

```python
# users/urls.py

from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required

from .views import UserView, signup

app_name = 'users'

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/accounts/login'), name='logout'),
    path('profile/',  login_required(UserView.as_view()), name='profile'),
    path('signup/', signup, name='signup')
]
```

The urls should be self-explanatory. Notice that we use the built-in views for log in and log out and that we redirect to the `/accounts/login` on logging out.

The other two views — for profile and signup — are custom. Let’s take a look at those:


```python
# users/forms.py

from django.contrib.auth.forms import UserCreationForm
from .models import User
 
class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email',)

```

```python
# users/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.views.generic.detail import DetailView

from .forms import SignUpForm


class UserView(DetailView):
    template_name = 'users/profile.html'

    def get_object(self):
        return self.request.user


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(request, email=user.email, password=raw_password)
            if user is not None:
                login(request, user)
            else:
                print("user is not authenticated")
            return redirect('users:profile')
    else:
        form = SignUpForm()
    return render(request, 'users/signup.html', {'form': form})
```


The `SignUpForm` is derived from the built-in `UserCreationForm`, making use of the custom User model and replacing the `username` field with the `email` field.

Notice that the signup view also authenticates the user with their email:

```python
user = authenticate(request, email=user.email, password=raw_password)
```

The UserView is a “class based view” in which we override the `get_object` method. It would normally expect a primary key in the request to get the correct instance, but here we can get the user instance directly from the request. We can be sure that the request has a user, because we added the `login_required` decorator to this view in `urls.py`.

These are the templates used for the account management:

`users/templates/users/signup.html`
```html
<h1>Sign up</h1>
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Sign up</button>
</form>
```

`users/templates/users/login.html`
```html
<h1>Login</h1>
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Login</button>
</form>
```

`users/templates/users/profile.html`
```html
<h1>My profile</h1>
<p>
  {{ object }}
</p>
<a href="{% url 'users:logout' %}">Logout</a>
```

No rocket science here. Start the server to test the url’s and authentication views.

Checkout the custom branch of [the repository](https://github.com/snirp/django-email-authentication) to view the code at this point.

## 6. Using Allauth for account management

In the previous step we wrote the views for basic account management. As the requirements grow, this will result in more custom work. Fortunately there are a few libraries that are designed to handle this exact scenario. We will use the well-designed library “django-allauth”, as it works well with our custom User model.

It also handles additional requirements such as:

* email address verification
* enter a single password on sign up
* add social authentication (Oauth)
* reset passwords

```
pipenv install django-allauth
```

### Configuration

Assuming you start with a default `settings.py`, these are the changes required by Allauth:

```python
# settings.py

AUTHENTICATION_BACKENDS = (
    ...
    'allauth.account.auth_backends.AuthenticationBackend',
)

INSTALLED_APPS = [
    ...
    'django.contrib.sites',  # make sure sites is included
    'allauth',
    'allauth.account',
    'allauth.socialaccount',

# the social providers
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.twitter',
    ...
]

SITE_ID = 1

ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
```

Edit `urls.py`:

```python
urlpatterns = [
    ...
    path('accounts/', include('allauth.urls')),
    ...
]
```

And finally:

```bash
python manage.py migrate
python manage.py runserver
```

You will now have the basic functionality of our “custom” solution above and then some. The Allauth views and forms gracefully handle our User model with email authentication, after we provided this information in the settings.

### Add Oauth providers

A further feature is the support of the OAuth authentication standard. This allows third party servers to perform the authentication. Users can also authorize your app to access profile data, such as the email address.

After starting your server, visit the admin pages ([localhost:8000/admin/](http://localhost:8000/admin/)) and follow these steps:

1. In the admin add a `Site` for your domain, matching `settings.SITE_ID`. Set the Domain name to [http://127.0.0.1:8000](http://127.0.0.1:8000) for development.
1. For each OAuth based provider, add a Social Application.
1. Go to the provider (Google, etc) to add your client app, and add a redirect URL in the form of: [http://127.0.0.1:8000/accounts/google/login/callback/](http://127.0.0.1:8000/accounts/google/login/callback/)
1. The provider will give you a Client ID and a Client Secret. Fill these in with the Social Application in the admin.

The official documentation has [detailed instructions](https://django-allauth.readthedocs.io/en/latest/installation.html), and a [list of social authentication providers](https://django-allauth.readthedocs.io/en/latest/providers.html).

### Try it out

Allauth gives a range of account functionalities. Try them out:

* [http://127.0.0.1:8000/accounts/signup](http://127.0.0.1:8000/accounts/signup)/
* [http://127.0.0.1:8000/accounts/logout/](http://127.0.0.1:8000/accounts/logout/)
* [http://127.0.0.1:8000/accounts/login/](http://127.0.0.1:8000/accounts/login/)
*login with email or social account*
* [http://127.0.0.1:8000/accounts/email/](http://127.0.0.1:8000/accounts/email/)
*manage email addresses*
* [http://127.0.0.1:8000/accounts/password/change/](http://127.0.0.1:8000/accounts/password/change/)
* [http://127.0.0.1:8000/accounts/social/connections/](http://127.0.0.1:8000/accounts/social/connections/)
*add social accounts to your user account*
 
Clone [the repository](https://github.com/snirp/django-email-authentication) to view the code at this point.

## Conclusion

Implementing a custom user model is a non-trivial exercise, but made much easier by libraries such as Allauth. As it is recommended to start your project with a custom user model, I would advise to start Django projects from a pre-configured repository. Skip `django-admin startproject` and start with a template that has at least a custom user model.

I created a collection of [Django starter templates](https://github.com/snirp/django-starter) to help you on the way. It offers a choice of the following authentication methods:

* Username
* Email address
* Mixed mode

## References

* [Allauth docs - Django Allauth, Advanced usage](https://django-allauth.readthedocs.io/en/latest/advanced.html)
* [William S. Vincent - Django Rest Framework User Authentication Tutorial ](https://wsvincent.com/django-rest-framework-user-authentication-tutorial/)
* [Django docs - Using a custom user model when starting a project](https://docs.djangoproject.com/en/2.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project)
* [Django docs - Specifying a custom user model](https://docs.djangoproject.com/en/2.1/topics/auth/customizing/#specifying-a-custom-user-model)
* [Tobias McNulty - Migrating to a custom user model in Django](https://www.caktusgroup.com/blog/2013/08/07/migrating-custom-user-model-django/)
