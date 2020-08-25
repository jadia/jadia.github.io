---
layout: post
title: Using GitLab CI/CD to build and store container images
date: 2020-08-25 17:06 +0530
description: 
tags: [CI/CD]
image:
  path: "/assets/social-devops-python-preview.png"
  width: 1200
  height: 628
twitter:
  card: summary_large_image
---

Often building container images consume a lot of bandwidth and back at home I don't have a good internet connection to build images again and again.

Also, there are times when I have
to, again and again, push the container images to Docker hub in a short period. I felt that they tend to slow down the upload speeds when I do this.
(I'm not sure how accurate is this observation.)

Instead of Docker Hub to host the repository and building images on my local machine, I thought of using GitLab's CI/CD to do the job.

### Setting up repository to build and store container images

1. Create a new *Project* in GitLab.   
    ![Create Project in GitLab](/assets/posts/gitlab_ci_cd/create_project.png)

2. Create a new file `Docker.gitlab-ci.yml` in the `master` branch as a template
    to use when we will use CI/CD pipeline to build the docker images.

```yaml
#Docker.gitlab-ci.yml

build:image:
  image: docker:stable
  services:
    - docker:dind

  variables:
    DOCKER_HOST: tcp://docker:2375
    DOCKER_DRIVER: overlay2
    IMAGE_NAME: hello                           # CHANGE IMAGE NAME
    TAG: latest                                 # EDIT TAG

  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

  script:
    - docker build --pull -t $CI_REGISTRY_IMAGE/$IMAGE_NAME:$TAG .
    - docker push $CI_REGISTRY_IMAGE/$IMAGE_NAME:$TAG
```

### Building a container Image

1. Create a new branch from `master`.
    ```bash
    git checkout -b flask-app
    ```   

2. Add required files and `Dockerfile` to the branch. 

3. Use the `Docker.gitlab-ci.yml` template to create a new
`.gitlab-ci.yml` file which will build the image.   
  **Remember:** Change the variable `IMAGE_NAME` in the yaml file with the name
  of the image.

4. Push the changes and naviage to **CI/CD** and **Container Registry** section
    of the project to see the image build and stored images.



I use [this GitLab repository](https://gitlab.com/nitishjadia/build) to do the job.
You can clone it and get started without doing the above steps.