# syntax=docker/dockerfile:1

# This Dockerfile copies (mounts) the seed.sql script directly into the PostgreSQL 
# container's initialization directory. The /docker-entrypoint-initdb.d/ is a special
# directory in PostgreSQL Docker containers that is used for initializing the database
# when the container is first started

FROM postgres:latest
COPY ./seed.sql /docker-entrypoint-initdb.d/