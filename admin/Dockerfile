# 使用 nginx 镜像作为基础镜像
FROM nginx:1.21-alpine

# 复制构建的前端文件到 nginx 容器中
COPY dist/ /usr/share/nginx/html

# 复制启动脚本到容器中
COPY start.sh /start.sh

# 设置启动脚本为可执行
RUN chmod +x /start.sh

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["/start.sh"]
