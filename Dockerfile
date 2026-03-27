# Build tool image:
# docker build --build-arg UID=$(id -u) --build-arg GID=$(id -g) -t jadia-dev-test .
# Serve site locally:
# docker run --rm -ti -v $(pwd):/work -w /work -p 4000:4000 jadia-dev-test bundle exec jekyll serve --host=0.0.0.0 --livereload
FROM ruby:3.1-bookworm

ARG UID=1000
ARG GID=1000

RUN apt-get update && apt-get install -y webp

RUN groupadd -g ${GID} jekyll_group && \
    useradd -u ${UID} -g ${GID} -s /bin/bash -m jekyll_user

RUN gem install bundler
COPY Gemfile Gemfile.lock /tmp/install/
WORKDIR /tmp/install

RUN bundle install && \
    chown -R jekyll_user:jekyll_group /usr/local/bundle

USER jekyll_user
WORKDIR /work
CMD ["bundle", "exec", "jekyll", "serve", "--host=0.0.0.0"]
