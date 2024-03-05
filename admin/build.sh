#!/bin/sh

# 安装NPM依赖
pnpm install

# 构建项目
pnpm build

# 编译 Docker
docker build --platform=linux/amd64 -t nightwhite634/hysli-admin-template .
