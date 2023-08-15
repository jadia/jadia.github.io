# docker run --rm -ti -v $(pwd):/work -p 4000:4000 bundler
FROM ruby:2.7.1-buster
RUN gem install bundler
COPY . /tmp/install
WORKDIR /tmp/install
RUN bundle install
WORKDIR /work
CMD ["bundle", "exec", "jekyll", "serve", "--host=0.0.0.0"]
