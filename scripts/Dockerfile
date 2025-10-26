# syntax=docker/dockerfile:1

# This Dockerfile copies the seed.sql script directly into the PostgreSQL 
# container's initialization directory Also known as bind-mounting.

FROM postgres:latest
COPY seed.sql /docker-entrypoint-initdb.d/