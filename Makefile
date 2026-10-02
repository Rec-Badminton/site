SHELL := /usr/bin/env bash

RUBY_IMAGE ?= ruby:3.2
PORT ?= 4001
JEKYLL_CONFIG ?= _config.yml,_config.dev.yml
# Kept apart from _site so that `make build` cannot clobber a running server.
SERVE_DEST ?= _site_dev

# Jekyll runs in a container, so no local Ruby install is required.
DOCKER_RUN = docker run --rm -it \
	-u "$$(id -u):$$(id -g)" \
	-e HOME=/tmp \
	-e BUNDLE_PATH=/srv/jekyll/vendor/bundle \
	-v "$(CURDIR)":/srv/jekyll \
	-w /srv/jekyll

.PHONY: help install interclubs serve build clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Install the gems into ./vendor/bundle
	$(DOCKER_RUN) $(RUBY_IMAGE) bundle install

interclubs: ## Refresh _data/interclubs.yml from the FFBaD ICBad site
	node scripts/fetch-interclubs.mjs

serve: install ## Serve the site locally (http://localhost:4001, override with PORT=)
	$(DOCKER_RUN) -p $(PORT):$(PORT) $(RUBY_IMAGE) \
		bundle exec jekyll serve \
			--host 0.0.0.0 --port $(PORT) \
			--config $(JEKYLL_CONFIG) \
			--destination $(SERVE_DEST) \
			--force_polling

build: install ## Build the site into ./_site
	$(DOCKER_RUN) $(RUBY_IMAGE) bundle exec jekyll build

clean: ## Remove the generated site and the Jekyll caches
	rm -rf _site $(SERVE_DEST) .jekyll-cache .jekyll-metadata .sass-cache
