---
title: wsl2+Docker Desktop配置docker环境
date: 2022-04-14T15:03:45.000+08:00
tag: Linux
duration: 4min
---

### 检查 wsl 版本

前置教程为 [wsl2+Ubuntu20.04 环境配置](https://abinea.netlify.app/posts/wsl-start)，在完成该教程后再进行下面的 docker 配置。

第一步记得先检查你现在使用的 wsl 版本是不是 wsl2，在 powershell 里输入以下命令：

```powershell
wsl -l -v
```

如果当前版本为 2 即为 wsl2，否则查看前置教程升级 wsl。

### 安装 Docker Desktop

第二步是在 Windows 系统里安装 Docker Desktop，可以在 [Docker 官网](https://www.docker.com/products/docker-desktop/)下载安装 Docker Desktop，也可以用 Powershell 安装：

```powershell
winget install Docker.DockerDesktop
```

等待命令行下载和自动安装完成后，需要重启一下电脑。

重启完成后，在 Docker Desktop 里打开 Settings，到 Resources 下的 WSL Integration，切换 Ubuntu 的按钮为打开状态，右下角 Restart 一下就可以了。

启用后，在 wsl2 查看是否启动 Docker 服务：

```bash
# 检查dockerd进程启动
service docker status
# or
ps aux|grep docker
```

如果未启动可以使用：

```bash
sudo service docker start
```

注意 wsl2 自身不要安装上 docker，因为 win 的 Docker Desktop 和直接在 wsl2 安装 docker 是不一样的环境。如果你两者都安装了，可能会出现 wsl2 的 docker 覆盖 Docker Desktop 的情况，拉取的镜像和跑的容器都装在 wsl2 的 docker 了。

### 迁移 docker 数据

第三步是将 Docker Desktop 及其数据存储位置迁移至 D 盘。正常情况下，Docker 默认安装和镜像存储路径都是 C 盘，容易占用太多空间，我们可以把 Docker 存储的路径改在 D 盘，这是因为事实上 Docker Desktop 在 Windows 上是作为 WSL2 子系统管理的，你可以通过下面的命令查看到：

```powershell
wsl -l -v

# 此时输出多了 docker-desktop 和 docker-desktop-data
  NAME                   STATE           VERSION
  Ubuntu-20.04           Running         2
  docker-desktop         Running         2
  docker-desktop-data    Running         2
```

我们主要针对的是 docker-desktop-data，下面的示例中将把它迁移到 D 盘，你也可以迁移到其他盘：

```powershell
# 将原来的系统打包到D盘目录下，但是已经下载过的images不会一起打包过去
wsl --export docker-desktop-data D:\\Application\\docker-desktop\\docker-desktop-data.tar
# 注销原来的子系统
wsl --unregister docker-desktop-data
# 创建新的子系统到 D:\\Application\\docker-desktop\\data 目录下，会多出一个ext4.vhdx文件
wsl --import docker-desktop-data D:\\Application\\docker-desktop\\data D:\\Application\\docker-desktop\\docker-desktop-data.tar --version 2
```

注意将路径改为你自己的路径，完成之后可以把原来的 tar 包删除，它只是用来备份当时的数据放在压缩包中，而不是作为真正的子系统数据。

### Docker 的使用

最后一步是 Docker 的常见使用，我们可以在 vscode 中安装 Remote-Container 插件，可以帮你便捷地执行 Docker 操作，管理 Docker Image、Container、Volumes 等（貌似 Docker Desktop 也能替代一部分功能，不过装 Docker Desktop 最大的原因是容器要挂在后台运行的问题，而且 Docker Desktop 里跑的容器走的是宿主机的网络，也就不用再配代理，挂起的服务可以直接在宿主机局域网访问）。

后续是一些常用服务在 Docker 使用，教程到此就结束了。

### Docker 安装 MongoDB

MongoDB 官方镜像叫 mongo，我们默认拉取最新版：

```bash
docker pull mongo
#查看一下镜像列表
docker images
```

创建一个 MongoDB 容器：

```bash
docker run -itd --name mongo -p 27017:27017 mongo --auth
```

新建一个数据库用户：

```bash
# 用admin进入数据库，此时是没有密码的
docker exec -it mongo mongo admin
# MongoDB 6.0以上版本使用
docker exec -it mongo mongosh admin

# 给admin用户添加密码（在数据库的REPL中敲）
> db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},"readWriteAnyDatabase"]});

#试一下能否鉴权通过
> db.auth('admin', '123456')
# 返回1，成功
```

### Docker 安装 Mysql

```bash
# 拉取镜像
docker pull mysql

# 创建容器
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql

# 进入mysql 容器：
docker exec -it mysql bash
mysql -u root -p

# enter password 敲123456后回车
```

### Docker 安装 Redis

```bash
# 拉取镜像
docker pull redis

# 创建容器
docker run -itd --name redis -p 6379:6379 redis

# 连接服务
docker exec -it redis bash
```
