#!/bin/sh

# 替换环境变量
replace_env_var() {
  find /usr/share/nginx/html -type f -name '*.js' -exec sed -i 's,VITE_GLOB_API_URL:"",VITE_GLOB_API_URL:"'"$VITE_GLOB_API_URL"'",g' {} \;
  find /usr/share/nginx/html -type f -name '*.js' -exec sed -i 's,"VITE_GLOB_API_URL":"","VITE_GLOB_API_URL":"'"$VITE_GLOB_API_URL"'",g' {} \;
}

# 在容器启动时执行替换操作
replace_env_var

# 启动 nginx
nginx -g "daemon off;"
