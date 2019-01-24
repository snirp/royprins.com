---
title: Snippets for configuring Apache and Opencart
date: 2018-05-07
published: true
tags:
  - apache
  - macos
  - mysql
  - opencart
  - sysadmin
---
This is a collection of snippets that I used to get a development and production enviroment set up for an Opencart application. 
+ The development environment is MacOS;
+ The production enviroment is an Ubuntu 16.04 virtual server on DigitalOcean;

# Development environment

For the various software installations, we will use the [homebrew](https://brew.sh) package mananger. Follow the instructions on the website to install.

## Apache installation

```bash
brew install apache2
# DocumentRoot is /usr/local/var/www
# The default ports have been set in /usr/local/etc/httpd/httpd.conf to 8080 and in
# /usr/local/etc/httpd/extra/httpd-ssl.conf to 8443 so that httpd can run without sudo.
apachectl start
```

you can now visit [http://localhost:8080/](http://localhost:8080/) to see the message that Apache works.

## MySQL installation

```bash
brew install mysql
mysql.server start
mysql_secure_installation
```

I had trouble gaining root access at first. The error was: `Error: Access denied for user 'root'@'localhost' (using password: YES)`. [This article](https://stackoverflow.com/questions/18339513/access-denied-for-user-root-mysql-on-mac-os) had some good pointers to resolve the issue. Here is what I ended up doing.

```bash
sudo /usr/local/bin/mysql.server stop
sudo chown _mysql /usr/local/var/mysql/*
sudo /usr/local/bin/mysqld_safe --skip-grant-tables
mysql> USE mysql
mysql> update user set authentication_string=password('root') where user='root';
mysql> FLUSH PRIVILEGES;
mysql> \q

```

Running Mysql through `mysql.server start` resulted in a permission (PID) issue, but `brew services restart mysql` works just fine.

```bash
mysql -u root -p

mysql> CREATE DATABASE my_db;
mysql> USE my_db;
mysql> CREATE USER 'finley'@'localhost' IDENTIFIED BY 'password';
mysql> GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
mysql> SHOW GRANTS
```

## PHP installation and configuration

```bash
brew install php
php --version
# PHP 7.2.5 (cli)
locate httpd.conf
sudo nano /usr/local/etc/httpd/httpd.conf
```

Add the following lines to the bottom of the Apache httpd.conf file.
```
LoadModule php7_module /usr/local/opt/php/lib/httpd/modules/libphp7.so

<FilesMatch \.php$>
  SetHandler application/x-httpd-php
</FilesMatch>
```

Place a file named `info.php` in the http root (in our case: `/usr/local/var/www`)

```
<?php phpinfo(); ?>
```

Now restart the services and visit [http://localhost:8080/info.php](http://localhost:8080/info.php). You should see an info page with your PHP configuration.

```
brew services start php
brew services restart apache2
```

## Multiple Apache projects

Here is my setup to manage multiple Apache projects. I use environment variables to set the following:

+ DEVELOPMENT / STAGING / PRODUCTION = true
+ APACHE_PROJECT_ROOT: path/to/apache/projects
+ APACHE_ACTIVE_PROJECT: projectfolder

The apache project root contains all my Apache projects, each in their own projectfolder. In addition, I will create a symlink to the main Apache config file inside the Apache project root. Simply to easily access the settings when needed.

```bash
cd ~/projects/apache
ln -s /usr/local/etc/httpd/httpd.conf
```

Every project folder contains their own virtualhost settings. This file will be loaded dynamically into the main settings, based on the setting for ervironment and 

Add the following lines to your `~/.bash_profile` file, and restart the terminal:

```bash
export APACHE_PROJECT_ROOT=$HOME/projects/apache
export APACHE_ACTIVE_PROJECT=/myproject
```

# Production environment

DigitalOcean does a very good job with providing practical how-to guides to get you started. In some cases these require some background and in this post I will attempt to present a more wide-ranging and opinionated guide to getting you setup just right. Whereever possible I will refer to DigitalOcean's official and community docs.

I was asked by a small company to assist in several issues they were having with their website: an OpenCart webshop. It was once built by a one-man shop who lacked the time to further support them. The site was running on one of his own virtual servers and shared that with several other projects. After migrating the domain and emails, it was time to set up the hosting correctly. DigitalOcean was selected for the following reasons:
+ Great security features;
+ Able to start at a low cost;
+ Possible to scale up (for instance by moving datbase to a separate sever);
+ Big player with presence in The Netherlands.

# Configuration

Follow along the [LAMP stack install](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04) tutorial.

+ No additional PHP packages installed at step 3 of the LAMP setup.
+ No userdir or virtualhost, but straightup /var/www to serve apache files.
+ Copy all site files from backup to /var/www
+ Setup opencartuser user for MySQL
+ Give the ownership of our opencart files to the apache user 


# Useful commands

These are some usefull commands for managing the virtual sever.

```bash
# Change order of the files for Apache to serve
sudo nano /etc/apache2/mods-enabled/dir.conf

# Manage Apache server
sudo systemctl restart apache2
sudo systemctl status apache2

# Apache error log
sudo cat /var/log/apache2/error.log

# Add user to apache www-data group
sudo chown www-data:www-data * -R

sudo usermod -a -G www-data username

# Restore database
mysql -u root -p
mysql> use <dbname>
mysql> \. /path/to/backup.sql

# new files get the same group as the parent folder
sudo chmod g+s ./
```



# References

+ [An Introduction to Securing your Linux VPS, Justin Ellingwood (DigitalOcean)](https://www.digitalocean.com/community/tutorials/an-introduction-to-securing-your-linux-vps)
+ [LAMP stack install](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04)
+ [Initial Server Setup with Ubuntu 16.04, Mitchell Anicas (DigitalOcean)](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04)

https://www.digitalocean.com/community/tutorials/how-to-set-up-mod_rewrite

permissies op de parent map (/var/www/)
https://stackoverflow.com/questions/31365981/server-unable-to-read-htaccess-file-denying-access-to-be-safe
