# docker build -t jadia-dev .
# docker run --rm -ti -v $(pwd):/work -p 4000:4000 jadia-dev
FROM ruby:3.1-bookworm
RUN gem install bundler
COPY Gemfile Gemfile.lock /tmp/install/
WORKDIR /tmp/install
RUN bundle install
WORKDIR /work
CMD ["bundle", "exec", "jekyll", "serve", "--host=0.0.0.0"]
