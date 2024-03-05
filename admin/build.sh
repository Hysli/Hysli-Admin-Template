#!/bin/sh

# 安装NPM依赖
pnpm install

# 构建项目
pnpm build

# 编译 Docker
docker build -t hysli-admin-template .
