---
title: Download Vagrant Box faster
summary: Download the Vagrant box file manually first, then add it locally before running `vagrant up`.
tags: ["Vagrant"]
image:
  path: /assets/til/vagrant-faster-cover.png
  width: 1120
  height: 630
twitter:
  card: summary_large_image
date: 2020-07-10 15:30 +0000
redirect_from:
  - /til/2020/07/10/download-vagrant-box-faster/
  - /til/2020/07/10/download-vagrant-box-faster
---
The easiest way to download a Vagrant box faster is to fetch it manually first and then add it to Vagrant yourself.

Before doing `vagrant up`, follow these steps.

## Add the box manually

The official download is often slow. Download the box directly from the URL Vagrant Cloud is already using. For example:

```sh
wget "https://vagrantcloud.com/ubuntu/boxes/bionic64/versions/20200701.0.0/providers/virtualbox.box"
```

Use this command to add the downloaded box:

```sh
vagrant box add ubuntu/bionic64 bionic-server-cloudimg-amd64-vagrant.box
```

Change the name `ubuntu/bionic64` and the file name according to the box you downloaded.
