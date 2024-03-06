开发工具：VsCode

## 项目目录说明：
- **admin**

前端UI（基于Naive Ui Admin）
1. 安装依赖：
```bash
pnpm i
```
2. 运行：
```bash
pnpm dev
```
3. 打包：
```bash
pnpm build
```

- **laf-cloud**

后台服务（laf云函数）
1. 初始化：目录右键，点击“laf:初始化环境”，打开.vscode下的laf.json文件，分配配置apiurl、pat和appid
2. 登录：目录右键，点击“laf:登录”，目的是连接上laf远程开发环境
3. 初始化：目录右键，点击“laf:初始化环境”，目的是将laf开发配置参数缓存到本地
4. 发布云函数：目录右键，点击“laf:发布全部云函数”，目的是将本地所有云函数代码都发布到laf云端
5. 同步依赖：目录右键，点击“laf:同步线上依赖”，目的是将laf线上的依赖包缓存到本地
完成以上操作后，便可进行开发了。
