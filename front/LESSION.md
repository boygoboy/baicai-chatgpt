# web全栈后台权限管理系统（VUE+ElementUi+nodeJs+koa2）

## 主要技术

### 前端

- vue 全家桶
- ElementUI

### 后端

- Node.js
- Koa2
- Mongoess

### 数据库

- mongodb

## 介绍

基于 VUE+Node.js 后台权限管理系统。采用简单的 rbac 模型（既权限与角色相关联，用户通过成为适当角色的成员而得到这些角色的权限）；主要对菜单与按钮进行权限控制。

## 页面

* 登录页

![登录](https://gitee.com/cat-ui/di-ui/raw/master/assets/login.jpg)

* 菜单管理

![菜单](https://gitee.com/cat-ui/di-ui/raw/master/assets/menu.jpg)

![菜单](https://gitee.com/cat-ui/di-ui/raw/master/assets/menu2.jpg)

* 用户管理

![首页](https://gitee.com/cat-ui/di-ui/raw/master/assets/user.jpg)

![首页](https://gitee.com/cat-ui/di-ui/raw/master/assets/user2.jpg)

* 角色管理

![首页](https://gitee.com/cat-ui/di-ui/raw/master/assets/role.jpg)

## 使用
### 后端
1. 安装mongodb
参考[安装mongodb](https://www.runoob.com/mongodb/mongodb-window-install.html)
2. 安装node
参考[安装mongodb](https://www.runoob.com/nodejs/nodejs-install-setup.html)
3. 代码clone

[点击进入git仓库地址](https://gitee.com/cat-ui/catui-server)

4. 数据库配置
找到主目录下 .env文件

```
# 数据库地址
DB_BASE_URL=mongodb://localhost:27017
DB_NAME=manage

# 环境
NODE_ENV=dev

# jwt密钥
JWT_SECRET=abcd1234
```

改为自己数据库地址与名字（默认应该是一样的）
5. 导入集合（可以选择不导入，mongodb会自动创建）
集合地址：主目录下dbjson
如果不导入,集合中只有一个菜单管理和一个用户（admin,123456),需要自己手动添加其它菜单

6. 项目启动  
npm install  
npm run dev

### 前端
1. 代码clone

[点击进入git仓库地址](https://gitee.com/cat-ui/di-ui)  

2. 后端地址配置

主目录下.env (默认无需配置)
```
# 项目信息
VUE_APP_NAME = MANAGE

# 环境信息
# optional value: development , production
VUE_APP_ENV=development

# server信息 （本地代理地址）
VUE_APP_SERVER=http://localhost
VUE_APP_SERVER_PORT=443

# api信息（后端请求地址）
VUE_APP_API=http://localhost:3000

# 页面访问信息
VUE_APP_HOST=http://localhost
VUE_APP_PORT=8800
VUE_APP_PATH=http://localhost:8800

# optional value: proxy, direct （如果设置proxy 需要启动代理服务，目录serve/proxy.js）
VUE_APP_API_MODE=direct
```
3. 启动  
    > npm Install  
npm run serve
访问地址:http://localhost:8800

# 操作说明
1. 登录

    > 初始用户密码:  
admin 123456

2. 菜单管理
    > 如果没有导入JSON的话，导航菜单只有一个菜单管理；添加菜单可以是多级菜单，菜单路由对应前端代码
src/view/content下的vue文件, 比如添加用户管理路由为：/sys/user。如果加自己页面的话只需要在此目录下创建xx/xx.vue，同时添加菜单路由：/xx/xx即可。  
如果选择按钮，可以加上标识控制按钮权限。例如/sys/role.vue中引入perButton组件传入perm来判断是否有此按钮权限（注意：添加按钮必须与菜单同级 否则菜单会被当成目录处理）

```
<template>
...
<per-button size="mini" perm="edit"  @click="handleEdit(scope.row)">编辑</per-button>
...
<template>

```

3. 角色管理
    >点击列表中的角色可以为角色赋予菜单与按钮权限

# 代码地址
[前端地址](https://gitee.com/cat-ui/di-ui)  
[后端地址](https://gitee.com/cat-ui/catui-server)