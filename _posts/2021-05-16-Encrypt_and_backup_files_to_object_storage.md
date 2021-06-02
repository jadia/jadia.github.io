---
layout: post
title: Encrypt and backup personal files to an object storage
date: 2021-05-16 20:21 +0530
description: 
tags: ["Linux"]
image:
  path: "/assets/social-devops-python-preview.png"
  width: 1200
  height: 628
twitter:
  card: summary_large_image
---

I feel that cloud backups are expensive, look at Dropbox, Google Drive, OneDrive, etc. BlackBlaze B2, *seems* to be a good for long term backups where you upload and forget, download only when we are required.  
It's important to have your personal files encrypted when stored on the cloud, you never know about another [iCloud hack](https://en.wikipedia.org/wiki/ICloud_leaks_of_celebrity_photos).


#### Install GocryptFS and rClone

```bash
sudo apt install -y gocryptfs
curl https://rclone.org/install.sh | sudo bash
```

#### Set up object storage

Register at [https://www.backblaze.com/b2/cloud-storage.html](https://www.backblaze.com/b2/cloud-storage.html). Make sure to read the [pricing details](https://www.backblaze.com/b2/cloud-storage-pricing.html) and your [usage statistic](https://secure.backblaze.com/b2_caps_alerts.htm).

Use `rclone config` to configure B2 object storage. Follow this guide: [https://rclone.org/b2/](https://rclone.org/b2/).

![rclone config](/assets/posts/2021-05-16-Encrypt_and_backup_files_to_object_storage/2021-05-16-22-04-41.png)

Go to Blackblaze B2 website and click on **App keys** and generate a new set of keys for rclone.
![](/assets/posts/2021-05-16-Encrypt_and_backup_files_to_object_storage/2021-05-16-22-07-10.png)

Add a new Application Key and copy the key ID and set it up in rclone.

![](/assets/posts/2021-05-16-Encrypt_and_backup_files_to_object_storage/2021-05-16-22-07-48.png)
![](/assets/posts/2021-05-16-Encrypt_and_backup_files_to_object_storage/2021-05-16-22-34-18.png)

The name of the remote is `b2-backup`. I can use this name to connect with the Blackblaze server and perform operations like *sync*, *dir list*, etc.

Create a new bucket using the following command:

```bash
rclone mkdir b2-backup:photo-bucket
```

Make sure to use `-` instead of `_` for the bucket name.

#### Create a folder to store encrypted files

```bash
mkdir backup-crypt
gocryptfs -init -plaintextnames backup-crypt

# -plaintextnames : Do not encrypt the names of the files and folder
#                   this helps when we are trying to recover lost files
#                   Skip this option if you wish to hide the names of files
```

**Make sure to store the keys properly**

#### Mount the encrypted files

```bash
mkdir private
gocryptfs backup-crypt private
```

Copy and paste files in the `private` directory and the encrypted counter part will be reflected in the `backup-crypt` directory.

#### Sync encrypted files

```bash
rclone sync --progress backup-crypt/ b2-backup:photo-bucket
```

#### Unmount the `private` directory and stay safe 🔒

```bash
fusermount -u private
```


Just make sure that you keep eye on the free limits. You can try to do a small sync everyday to save money on the transfer cost.

![](/assets/posts/2021-05-16-Encrypt_and_backup_files_to_object_storage/2021-05-16-23-17-53.png)


## References

1. [Gocryptfs security audit](https://defuse.ca/downloads/audits/gocryptfs-cryptography-design-audit.pdf)