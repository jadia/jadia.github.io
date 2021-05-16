# [jadia.dev](https://jadia.dev) 

The blog theme is a fork of [diamantidis.github.io](https://diamantidis.github.io). 
I am thankful to [Ioannis Diamantidis](https://twitter.com/diamantidis_io) for making the blog code open source. All the credit for initial repository setup goes to him.


[![Jekyll](https://img.shields.io/badge/powered%20by-jekyll-blue)](https://jekyllrb.com/) 
[![Build Status](https://travis-ci.org/jadia/jadia.github.io.svg?branch=source)](https://travis-ci.org/jadia/jadia.github.io) 
![CI](https://github.com/jadia/jadia.github.io/workflows/CI/badge.svg) 
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/jadia/jadia.github.io/blob/source/LICENSE)  
<!-- [![Twitter: @diamantidis_io](https://img.shields.io/badge/twitter-@diamantidis_io-blue.svg?style=flat)](https://twitter.com/diamantidis_io) -->

This is the repository for my [personal blog]. 

The whole site is open source, meaning that all the code that runs on the live site is here. 


## Under the hood

This blog is built with [Jekyll], an open source static site generator. The content is written in [Markdown] files, which Jekyll turns into HTML. The site is hosted on [GitHub Pages], a free web hosting service provided by [GitHub]. 

The repository has two main branches: [`source`] and [`master`]. The `source` branch contains the Jekyll project while the `master` branch contains the final version of the site, as it is served on [`jadia.dev`].

On every PR against the `source` branch, a `Travis CI` job runs using [Danger] and [Danger-prose] to perform a check for typos and lint prose. When the PR is approved and merged to `source`, a  `GitHub Actions` workflow builds the Jekyll project and push the generated site onto the `master` branch. 

## How to setup locally

### The Jekyll project

#### Requirements
* [Git]
* [Ruby]
* [Bundler]

#### Steps
* Run the following commands:
```
git clone -b source https://github.com/jadia/jadia.github.io.git jadia.dev
cd jadia.dev
docker build -t bundle .
docker run --rm -ti -v $(pwd):/work -p 4000:4000 bundle
```
* Open [`http://127.0.0.1:4000`] in your favorite browser

The content also supports emojis. Refer to this cheatsheet: [https://www.webfx.com/tools/emoji-cheat-sheet/](https://www.webfx.com/tools/emoji-cheat-sheet/)

## Contributing

#### Fix Content
If you see an error, a typo or something wrong in the content, just fork the repository, make the change and submit a pull request against the [`source`] branch. Alternatively, you can file an [issue] or message me on [Twitter].

#### Ideas, suggestions and improvements
If you have any suggestion for a potential post, an improvement on the blog or some other idea, please share it with me. You can either file an [issue] or send me a message on [Twitter].

## License

This project is licensed under the terms of the MIT license. See the [LICENSE] file.


## Contact me

* [Twitter]
* [LinkedIn]
* [Email]


[personal blog]: https://jadia.github.io
[Jekyll]: https://jekyllrb.com/
[Markdown]: https://daringfireball.net/projects/markdown/
[GitHub Pages]: https://pages.github.com/
[GitHub]: https://github.com/
[`source`]: https://github.com/jadia/jadia.github.io/tree/source
[`master`]: https://github.com/jadia/jadia.github.io/tree/master
[`jadia.dev`]: https://jadia.dev
[Danger]: https://github.com/danger/danger
[Danger-prose]: https://github.com/dbgrandi/danger-prose
[Git]: http://git-scm.com/
[Ruby]: https://www.ruby-lang.org/en/
[Bundler]: https://bundler.io/
[`http://127.0.0.1:4000`]: http://127.0.0.1:4000
[issue]: https://github.com/jadia/jadia.github.io/issues/new
[LICENSE]: LICENSE
[Twitter]: https://twitter.com/nitishjadia
[LinkedIn]: http://linkedin.com/in/jadianitish
[Email]: mailto:nitish@jadia.dev