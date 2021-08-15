---
layout: post
title: GocryptFS and B2-BackBlaze backup solution
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

Back in 2019, my laptop's internal HDD crashed taking down 2TB worth of data with it. Most of the older data was recovered
from my backup HDDs, but I lost the recent data which was not present in the backup HDDs. The data loss included a part of my master's thesis, photos taken in 2019 and a lot of code which I did not publish on Github. This happened because I was too lazy to copy the data to my external backup hard disk and sort it.   

This incident made me buy multiple hard disks for better redundancy but from past 2 years I've been manually coping data to and from the backup drives. These drives also contain a lot of sensitive data hence I had to keep them physically safe from others.   

Inspired by this article, [Don't use fancy tools](https://www.unixsheikh.com/articles/how-i-store-my-files-and-why-you-should-not-rely-on-fancy-tools-for-backup.html), I've decided to come up with a backup solution for myself which I will cover in some other post. This post aims to be a guide on backing up the most critical and sensitive data to the cloud.   

Solutions like Google Drive, OneDrive or Dropbox are great but they are too expensive for my use case. I want a Cloud storage
where I can simply upload and forget, only access it in case something happens to my backup hard disks.   
Object storage, specifically **BlackBlaze B2**, *seems* to be a good for long term backup.  

Back in 2010, I use to create a `.zip` files of the data I wanted to protect, but now given the size of data and possibility of a large single file getting corrupted I've decided to go with **GoCryptFS** as the encryption program.   
It is crucial to have your personal files encrypted when stored on the cloud, you never know about another [iCloud hack.](https://en.wikipedia.org/wiki/ICloud_leaks_of_celebrity_photos).



### What is Backblaze B2 Cloud Storage?

[According to IBM](https://www.ibm.com/cloud/learn/object-storage), object storage is a data storage architecture
for handling large amounts of **unstructured data** such as video, photos, audio files, documents, sensor data, etc.
In the object storage the data is stored in a structurally flat data environment and the hierarchical filesystem model
is not followed.   

On the inside, each object include data and it's metadata information such as unique ID number instead of file names
or path.   
The best part of object storage is the pay-as-you-go structure, where we have to pay only the amount of storage 
used. It also offers virtually unlimited storage.


AWS S3 and Backblaze B2, both are object storage. Upon price comparison you'll find that Backblaze B2 is significantly
cheaper than AWS S3. That is why we are selecting B2 as our storage option.   


![Storage options](/assets/posts/2021-05-16-GocryptFS_and_B2-BackBlaze_backup_solution/2021-08-15-03-25-53.png)


### What is Rclone?

Rclone is a powerful and actively managed open-source command line program written in GoLang.
It is generally used to manage files on cloud storage. It covers various types of storage options such as Dropbox,
Google drive, AWS S3, etc.   
> Users call rclone *"The Swiss army knife of cloud storage"*   

It has various features such as file harsh verification to maintain data integrity, sync files between local
and the cloud storage, check the hashes for missing/extra files, [a beautiful web based GUI](https://github.com/rclone/rclone-webui-react), etc.   

In our use-case, we need something which might keep my cloud storage in sync with the local changes.
That is why we'll mostly use the **sync** option.


### What is GoCryptFS?

When you wish to store something sensitive either on the cloud or in a external disk,
it's advised to encrypt the content before it hits the cloud servers/HDD.

[According to the project's webpage](https://nuetzlich.net/gocryptfs/), GoCryptFS uses file-based encryption that is implemented as a mountable FUSE filesystem. [Filesystem in USErspace (FUSE)](https://en.wikipedia.org/wiki/Filesystem_in_Userspace) is a software interface for Unix and Unix-like computer operating systems that lets non-privileged users create their own file systems without editing kernel code. For GoCryptFS this means that on disk the files 
will be stored in encrypted format, but when mounted and a correct password is provided, these files are 
accessible in unencrypted form.   

The encrypted files can be stored in any folder on your hard disk, a USB stick or even inside the Dropbox folder. One advantage of file-based encryption as opposed to disk encryption is that encrypted files can be synchronised efficiently using standard tools like Dropbox or rsync.


The only fear I have of using GoCryptFS is being locked out of my files due to some issues like the program might not be actively maintained in the future or a file might get corrupt while getting encrypted.

Despite all this as of now, GoCryptFS is the best file level encryption tool.


### Install GoCryptFS and Rclone

The post will assume that you have Ubuntu 20.04.2 LTS installed on your system.  
As of writing this post, I have following version of GoCryptFS:
`gocryptfs 1.7.1; go-fuse 0.0~git20190214.58dcd77; 2019-12-26 go1.13.5 linux/amd64`   


```bash
sudo apt install -y gocryptfs
curl https://rclone.org/install.sh | sudo bash
```

### Configure the Object Storage with Rclone

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
#                   Skip this option if you wish to hide the filenames.
```

This would create a new `gocryptfs.config` file inside the backup-crypt directory. 
Avoid losing this file because the `gocryptfs.config` is required to decrypt the files.

**Please make sure to copy and securely save the *master-key*. This key will be used to recover files incase you forget the password.**   


![](/assets/posts/2021-05-16-GocryptFS_and_B2-BackBlaze_backup_solution/2021-08-15-16-08-35.png)


**Make sure to store the key properly and safe.**

### Mount the encrypted files

```bash
mkdir private
gocryptfs backup-crypt private
```

Copy and paste files in the `private` directory and the encrypted counter part will be reflected in the `backup-crypt` directory.


### Unmount the `private` directory and stay safe 🔒

Once all the files are copied over, we can unmount the filesystem.

```bash
fusermount -u private
```

Just make sure that you keep eye on the free limits in B2. Anyway, there is no limit or cost in uploading the files to B2.

![b2 api limits](/assets/posts/2021-05-16-Encrypt_and_backup_files_to_object_storage/2021-05-16-23-17-53.png)


### Sync encrypted files

Now we can sync these encrypted files with the B2 storage.

```bash
rclone sync --progress --transfers 20 backup-crypt/ b2-backup:photo-bucket
```
`--transfers 20` will do 20 simultaneous transfers, the default is 4. See [B2 Transfer section for more info](https://rclone.org/b2/#transfers)



### What if I forget the password?

The worst thing that can happen in this system is that you've put an all-out effort to backup your files but
in case of a disaster you are unable to recover the files.   
This is why it's utmost important to test your recovery options and document the process before you upload
the files to the cloud.


#### Using Master Key to recover password

The master key is printed just once when we initialize a new gocryptfs directory.   

```bash
gocryptfs -masterkey 1dee4196-f007908c-f176e385-e1f5d100-6101f948-a7dbe6e1-5444f8b6-dda356e9 recover.crypt recover
# recover.crypt is the directory with encrypted files
# recover is an empty directory when the unecrypted files will be mounted.
```

When recovering the files using master-key, please make sure that you have the `gocryptfs.conf` file present in the directory.   
If the config file is missing, please generate a new config file using `gocryptfs -init` and copy it to the `recover.crypt` directory.


### Encrypt files only on Cloud but not on HDD?

A lot of my data is not sensitive enough to store in encrypted form on the hard disk, but I'd like it to be encrypted 
when stored on a Cloud storage. GoCryptFS has an amazing **reverse-mode** feature which stores the files in unencrypted 
format but when it's mounted, the files on the mount are in encrypted format. This way we can upload the files from the encrypted mount and we don't actually have to encrypt the files on disk.

#### Make use of reverse mode

```bash
# Create .gocryptfs config file in the directory
gocryptfs -init -reverse secret_dir

# Show encrypted version of the secret_dir files
mkdir secret_dir.crypt
gocryptfs -reverse secret_dir secret_dir.crypt
```

The files present in the `secret_dir` are unencrypted and stored on your disk, whereas the mounted filesystem on
`secret_dir.crypt` will have encrypted files which can be uploaded to Cloud storage.

I have not tried to recover the files using `master-key` in the reverse-mode. I'll update the post when I'm done with the test.


## Further reading

- [Should we upload gocryptfs.conf in cloud?](https://github.com/rfjakob/gocryptfs/issues/50)
- [recover from missing or corrupt gocryptfs.diriv](https://github.com/rfjakob/gocryptfs/issues/456)
- [Regenerate the config](https://github.com/rfjakob/gocryptfs/issues/446)
- [Wiki: Recreate config file using master's key](https://github.com/rfjakob/gocryptfs/wiki/Recreate-gocryptfs.conf-using-masterkey)
- [Best Practices](https://github.com/rfjakob/gocryptfs/wiki/Best-Practices)


## References

1. [Gocryptfs security audit](https://defuse.ca/downloads/audits/gocryptfs-cryptography-design-audit.pdf)
