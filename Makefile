.PHONY: all clean install build start-prod-app start-dev-app start start-dev start

all: start

start: | clean build start-prod-app

start-dev: | clean install start-dev-app

start-prod-app:
	NODE_ENV=production docker-compose -f tools/docker/docker-compose.yml --project-directory ./ up app-start

start-dev-app:
	NODE_ENV=development docker-compose -f tools/docker/docker-compose.yml --project-directory ./ up app-dev

install:
	NODE_ENV=development docker-compose -f tools/docker/docker-compose.yml --project-directory ./ run --rm app-install

build:
	NODE_ENV=production docker-compose -f tools/docker/docker-compose.yml --project-directory ./ run --rm app-build

clean:
	rm -rf dist
