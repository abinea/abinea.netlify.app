---
title: Hexo+Github Pages配置个人博客网站
date: 2021-04-01T18:38:45.000+08:00
tag: Hexo
duration: 8min
---

这里是 2023 年重写博客的我，历时两年，前面的博客都是使用 hexo 生成静态站点，主题从 Butterfly 到 Shoka 再到 NextT 搬迁。在这个过程，我对博客的需求逐渐从华丽酷炫到简单大方，最后选择用 Vue 重写，是希望能够实现更灵活的配置，更专注于输出。部分文章也在重新构建后甄选抛弃，以后会尽量保持有质量的更新。

---

大家好，这里是 ABin 的第一篇博客，关于用 GitHub Pages + Hexo 建立个人博客网站的教程。如果你觉得还可以，就给我加个 Star 吧。因为 github.io 都被指向 127.0.0.1，在访问该博客时建议将 DNS 解析改为 8.8.8.8 或者 114.114.114.114。

<!--more-->

配置过程参考 [Hexo 官方文档](https://hexo.io/docs/) 。如果您在使用 Hexo 过程中遇到问题，请查看 [问题解答](https://hexo.io/zh-cn/docs/troubleshooting) 中的解答，或者访问 [Hexo 官方 GitHub](https://github.com/hexojs/hexo/issues) 查看 issues 或提问。在使用本教程过程如果有任何问题或建议请在下方评论区留言。

## 使用该指南前你应完成配置

Node.js：使用如下命令查看是否安装及版本。

```bash
node -v
npm -v
```

Git：使用如下命令查看是否安装及版本。

```bash
git version
```

## Hexo 配置

首先用 npm 全局安装 Hexo：

```bash
npm install hexo-cli -g
```

等待安装完成后，在本地初始化博客文件夹。在所选路径 git bash 以下命令：

```bash
hexo init <Your blog folder name>
```

等待 hexo 初始化可能会比较慢，甚至报错，原因是 hexo 需要从 github 拉取博客的模板。

这里提供直接的 hexo 初始化模板：[hexo-blog-template.zip](https://cdn.jsdelivr.net/gh/abinea/abincdn/rar/hexo-blog-template.zip)

完成初始化后，进入你的博客文件夹，经过初步配置后大致目录如下：（部分文件夹未在 hexo 初始化时生成）

```bash
.
|---node_modules	# npm install下载的环境依赖
|---scaffolds	# 模板文件夹
|---source	# 资源文件夹，除了_post之外都不会被编译打包到生成网站的public文件夹
	|---_posts	# 文章文件夹
	|---categories	# 分类文件夹
	|---tags	# 标签文件夹
	|---_draft	#草稿文件夹
|---themes	#主题文件夹
|---_config.yml	网站的配置文件，在这里配置大部分所用的参数
```

现在我们用 `hexo s` 命令（s 是 server 的缩写）试着运行一下。

```bash
hexo s
```

在浏览器输入 `https://localhost:4000` 回车，可以看到通过 Hexo 托管，你的本地网站情况。

## Github 配置

假如你还没有自己的 GitHub 账号请先注册，点击 SignUp，填写账号信息完成注册。

注册完成后点击 Start project 或者 new repository 建立一个新仓库，注意该仓库的命名必须为`username.github.io`，这是你成功使用 GIthub 提供的 Pages 服务的前提。

创建完成后，点击 Create new file 新建一个 index.html 中简单输入 Helloworld 并提交，此时打开 `https://username.github.io`就可以看到使用 Github Pages 得到的你的个人网站。

## SSH Key 配置

使用 ssh key 可以连接本地 hexo 博客和 github pages，如果你在部署时看到本地 github 弹窗要求输入账号密码，大概率是没有配置好此步骤。

在桌面 git bash ，输入 `cd ~/.ssh/id_rsa.pub` ，如果没有报错或者提示就是之前生成过了，直接使用 `cat ~/.ssh/id_rsa.pub` 命令查看 ssh key。

如果以前没有生成过也不要紧，先全局配置一下本地账户：

```bash
git config --global user.name username
git config --global user.email email
```

开始生成密钥：

```bash
ssh-keygen -t rsa -C email
```

此时提示输入 passphrase，回车三次即可，原因是避免加密。然后会生成一堆字符，再使用`cat ~/.ssh/id_rsa.pub` 命令就可以查看 ssh key，或者用记事本打开 id_rsa.pub 文件，并复制全部内容。

-   id_rsa 文件是私钥，要保存好，放在本地，私钥可以生产公钥，反之不行。
-   id_rsa.pub 文件是公钥，可以用于发送到其他服务器，或者 git 上。

进入 Github，账号设置中找到 SSHKeys，将复制的的内容放到 key 里即可，名称随便起（如 Github SSH）。

首次使用需要确认并添加主机到本地 SSH 可信列表。

```bash
ssh -T git@github.com
```

如果返回 **Hi xxx! You've successfully authenticated, but Github does not provide shell access.** 内容，则证明添加成功。

## 将博客部署到 GitHub

-   打开博客文件夹根目录下找到`\_config.yml`，用记事本打开在最后修改为以下内容：

```yaml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
    type: git
    repo: git@github.com:username/username.github.io
    branch: main
```

.yml 文件是由 YAML 语言写的。YAML（Yet Another Markup Language）是一种基于 Unicode 容易阅读，容易和脚本语言交互的，用来表达资料序列的编程语言。写 YAML 要比写 XML 快得多(无需关注标签或引号)，并且比 INI 文档功能更强。

. YAML 中用冒号和空格（空格是必须的）表示键值对 key: value 简单数据，可以不使用引号括起来，包括字符串数据。但 YAML 对缩进非常严格，且使用#来注释，类似 pyhon。

用单引号或者双引号括起来的被当作字符串数据，在单引号或双引号中使用 C 风格的转义字符。

-   安装一个部署插件 hexo-deployer-git：

```bash
npm install hexo-deployer-git --save
```

-   将博客部署到 GitHub 上：

```bash
hexo g -d
```

## 更换主题

Hexo 默认的主题不是很好看，你可以在 hexo 官方的[主题列表](https://hexo.io/themes/)找到一款你喜欢的主题，下载到 theme 目录后，在根目录的`\_config.yml` 找到 theme 进行修改。

这里以笔者使用的 Butterfly 为例：

在主题文件夹 git bash 一下，先初始化为一个 git 文件夹后`git clone https://github.com/jerryc127/hexo-theme-butterfly`下来。

（如果你嫌 git clone 的速度慢，可以访问 github 直接下载 zip 放进 theme 文件夹中，并将文件夹名改为 butterfly。

### 启用主题

打开 `Hexo` 配置文件 `_config.yml`, 设置主题为 butterfly

```yaml
theme: butterfly
```

### 安装主题需要的 NPM 依赖

`cd` 到主题 `themes/butterfly` 目录

```
cd themes/butterfly`
```

然后执行 `npm` 命令，安装主题需要的依赖包，butterfly 分别需要 "hexo-renderer-stylus"和"hexo-renderer-pug" 两个工具包。

```
npm install
```

此时在博客根目录打开 cmd，输入 `hexo clean` 删除本地的 public 文件夹，再输入 `hexo g -d` 生成新的 public 文件夹并把 public 推送到 github.io 仓库上。

```bash
hexo clean&hexo g -d
```

打开你的 github.io 网站，现在我们就得到了一个好康的主题。

主题换好后，接下来我们就可以逐一实现可获得的功能。

详情参考[Butterfly 安裝文檔(三) 主題配置-1 | Butterfly](https://butterfly.js.org/posts/4aa8abbe/)，也可以联系我或者在下方评论。

## 模板设置

在 blog 文件夹输入命令生成新文章：

```bash
$ hexo new "My New Post"
```

### 文章模板设置

（在新文章的 markdown 文件开头设置）

```markdown
title: My post
date: 2021-04-01 18:38:45
categories:

-   分类 1
-   分类 2 # 多级分类
    tags:
-   标签 1
-   标签 2 # 多个标签
    cover: http://demo.com/demo.jpg # 不设置默认根目录配置的文章封面
    author: 第三方作者名 # 不设置默认根目录配置的作者名及相关信息
    avatar: /example.jpg #头像
```

### 创建分类页

运行 Hexo 命令

```bash
hexo new page categories
```

categories 文件夹 index.md 里分类模版

```markdown
title: categories
date: 2021-04-14 12:39:04
type: 'categories'
```

> 主题会自动生成分类内容，模版里面留空不用改动就可以了。

### 创建标签页

运行 Hexo 命令

```bash
hexo new page tags
```

tags 文件夹 index.md 里标签模版

```markdown
title: tags
date: 2021-3-22 12:39:04
type: 'tags'
```

> 主题会自动生成标签内容，模版里面留空不用改动就可以了。

## 更新主题

> 更新前请先备份主题里的 `_config.yml` 文件

```bash
cd themes/butterfly
git pull
```
