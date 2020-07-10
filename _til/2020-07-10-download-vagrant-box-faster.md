---
layout: til
title: Download Vagrant Box faster
description: 
tags: ["Vagrant"]
image:
  path: "assets/til/vagrant-faster-cover.png"
  width: 1120
  height: 630
twitter:
  card: summary_large_image
date: 2020-07-10 15:30 +0000
---
The only was to download the vagrant box faster is to do it manually.
Before doing `vagrant up`, just do the following steps.

# Add box manually

The box download is often slow. Download the box from the URL the official download is using for example:

```sh
wget "https://vagrantcloud.com/ubuntu/boxes/bionic64/versions/20200701.0.0/providers/virtualbox.box"
```

Use the following command to add the box:

```sh
vagrant box add ubuntu/bionic64 bionic-server-cloudimg-amd64-vagrant.box
```

Change the name `ubuntu/bionic64` and the file name according to the box.
