DB_VOLUME = feature_service_db_volume
DB_CONTAINER = feature_service_db_container

.PHONY: all clean migrate fixture install build start-prod-app start-dev-app start start-dev start

all: start

start: | clean build migrate fixture start-prod-app

start-dev: | clean install migrate fixture start-dev-app

start-prod-app:
	NODE_ENV=production docker-compose -f tools/docker/docker-compose.yml --project-directory ./ up app-start

start-dev-app:
	NODE_ENV=development docker-compose -f tools/docker/docker-compose.yml --project-directory ./ up app-dev

install:
	NODE_ENV=development docker-compose -f tools/docker/docker-compose.yml --project-directory ./ run --rm app-install

build:
	NODE_ENV=production docker-compose -f tools/docker/docker-compose.yml --project-directory ./ run --rm app-build

migrate:
	docker-compose -f tools/docker/docker-compose.yml --project-directory ./ run --rm app-migrate

fixture:
	docker-compose -f tools/docker/docker-compose.yml --project-directory ./ run --rm app-fixture

clean:
	docker container rm -f -v $(DB_CONTAINER) 2> /dev/null || true
	docker volume rm -f $(DB_VOLUME)
