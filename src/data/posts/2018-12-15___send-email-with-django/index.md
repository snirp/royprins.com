---
title: Sending emails with Django
date: 2018-12-15
published: true
tags:
  - django
  - python
---
Some of the functionalities, such as email verification and password resets, rely on your app being able to send out emails. For this, you have to configure a SMTP backend to your app.

In my case, I use my Google gmail/gsuite account as the SMTP server. You can add the following to your `settings.py` — but **do not actually add your password or account name** to any file that you commit to version control. Keep confidential information in environment settings.

```python
...
EMAIL_USE_TLS = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_PASSWORD='myPassword!123'
EMAIL_HOST_USER='myaccount@gsuite.com'
EMAIL_PORT = 587
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
```

If you do not have two-factor authentication activated, you may have to allow less-secure apps to log into your Gmail settings.

[https://myaccount.google.com/u/0/security?#connectedapps](https://myaccount.google.com/u/0/security?#connectedapps)

Now give it a try in the shell:

```python
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Subject here', 'Here is the message.', 'from@example.com',['to@example.com'], fail_silently=False)
1
```

Verify that the mail was sent. If you receive a `SMTPAuthenticationError`, it is likely that you did not allow access for less secure apps.

### Integration with Allauth

Allauth is configured to make use of the `EMAIL_BACKEND` specified in `settings.py`. Until you explicitly set one, the emails will be printed to the console. Now, with the `EMAIL_BACKEND` configured, register a new user and observe that a confirmation mail is sent with an optional verification link.

Simply clicking the verification link will not be sufficient: you need to confirm with a form button on the [/accounts/confirm-email/](http://127.0.0.1:8000/accounts/confirm-email/) page. This is done so because GET requests are not supposed to alter the server state. For your own application, consider sending a POST request through Javascript to take care of this without violating this principle of HTTP.

## References

* [Django docs - Sending email](https://docs.djangoproject.com/en/2.1/topics/email/)

