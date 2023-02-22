---
title: wsl2代理设置（使用宿主机v2ray）
description: 关于我终于在wsl2使用宿主机的v2ray客户端代理连接上了github这件事及配置教程，后续使用逐渐完备了设置
date: 2022-08-29T08:00:00.000+08:00
tag: Linux
duration: 7min
---

[[toc]]

## 前言

好久没更新博客了，暑假时期终于下决心升级攒了一年多的 win11 系统。不吹不黑，功能几乎和 win10 没区别，而且 win11 确实好看，就我感觉就是 win10 换上新 UI 并且支持 Android 子系统，此外并没有在 win10 基础上弄出太大的变化。

新系统我还是一样装上了 wsl2，体验来说没有不同，好消息是 win11 默认命令行工具已经切换为微软官方出品的**Windows Terminal**，能使用包括 cmd、powershell、wsl 等命令行，支持标签页多开和主题配置，告别了 win10 那种丑陋的界面（win10 也可以在 microsoft store 使用 window terminal）。由于先前在 win10 上面环境管理比较混乱，因此我这次升系统后之后不打算在宿主机配置编程环境，而是统一使用 wsl ，借助 vscode 的远程连接 wsl 来 code。

关于 wsl 大家都知道 wsl2 是基于 Hyper-V 的，因此 wsl2 子系统有自己的 IP 并且每次重启都会变 IP，网络使用是与宿主机组成一个局域网，把宿主机作为 dns 服务器（宿主机在局域网中的 IP 也会变），因此 wsl2 启动的服务往往需要在局域网里转发到宿主机，供与宿主机同处另一个局域网的设备访问。比如你在 wsl 里启功了一个移动端的项目，原先在宿主机启动是可以直接在手机浏览器通过在局域网访问宿主机 IP 加端口看到页面，但是 wsl2 跟宿主机的路由局域网是分隔的，得通过宿主机这个中间人转发（通过 netsh interface portproxy 设置端口转发可以解决）。

## wsl http 代理

而比上面这个例子更加高频的情况是，作为程序员我们往往需要访问 github 之类的外网，最常用的操作如 git clone、git pull、git push 等都需要访问 github 服务器。因为众所周知的原因，github 被墙了，大多数情况下我们直接访问 github 会挂掉，因此需要 vpn 来稳定连接。

一般情况下由于 wsl 默认的 nameserver 是宿主机的 IP，会通过宿主机再去连接真正的 nameserver，但是使用了 v2ray、clash 等代理软件，这个套路就不可用了，wsl2 无法将 vpn 当成 nameserver。

翻阅 n 多个解决方法，最后找到个靠谱的，原链接在[这](https://zhuanlan.zhihu.com/p/414627975)，我整理如下：

1、windows v2ray 客户端开启允许来自局域网的连接，确定之后底下状态栏会多出两个端口占用，标注着是局域网。

2、wsl 里关闭自动更新 dns nameserver，因为 wsl 每次重启，wsl 和宿主机的局域网 IP 都会变。我们找到`/etc/resolv.conf`（原作者写的是`/etc/wsl.conf`，可能是主系统或者子系统发布版不同，我用的是 win11 和 Ubuntu-20.04），取消原有的注释，并`generateResolvConf`改为`false`：

```toml
[network]
generateResolvConf = false
```

然后把下面的`nameserver`随意改为**223.5.5.5**或其他可用的 dns 服务器。

3、在`~/.bashrc`（或者你用的是 zsh 就配.zshrc）添加以下内容：

```bash
# network proxy
export winip=$(ip route | grep default | awk '{print $3}')
port=10811 # v2ray
export proxy_http="http://${winip}:${port}"
alias proxy='
    export HTTP_PROXY='${proxy_http}';
    export HTTPS_PROXY='${proxy_http}';
    export ALL_PROXY='${proxy_http}';
    git config --global http.proxy '${proxy_http}'
    git config --global https.proxy '${proxy_http}'
    echo -e "Acquire::http::Proxy \"${proxy_http}\";" | sudo tee -a /etc/apt/apt.conf.d/proxy.conf > /dev/null;
    echo -e "Acquire::https::Proxy \"${proxy_http}}\";" | sudo tee -a /etc/apt/apt.conf.d/proxy.conf > /dev/null;
'
alias unproxy='
    unset HTTP_PROXY;
    unset HTTPS_PROXY;
    unset ALL_PROXY;
    git config --global --unset http.proxy
    git config --global --unset https.proxy
    sudo sed -i -e '/Acquire::http::Proxy/d' /etc/apt/apt.conf.d/proxy.conf;
    sudo sed -i -e '/Acquire::https::Proxy/d' /etc/apt/apt.conf.d/proxy.conf;
'
```

其中`hostip`取到了宿主机 windows 在 wsl2 中映射的 IP，端口是 v2ray 客户端的局域网 http 端口，然后分别是运行代理的命令 proxy 和取消命令 unproxy。定义的三个以 `_proxy` 结尾的变量供 curl 之类的网络抓取命令使用，git 想用代理需要配置全局代理 http.proxy 和 https.proxy，apt 的网络代理需要配置 proxy.conf。

4、启用新环境，输入 proxy 导出代理环境变量

```bash
source ~/.bashrc # 同理zsh换.zshrc
proxy
```

5、通过 curl 命令验证是否代理（curl 命令会自动读取环境变量 HTTP_PROXY 和 HTTPS_PROXY 的值）

```bash
curl https://google.com.hk
```

如果能较快响应，并且 v2ray 客户端可以看到一个 172 开头的 ip 访问另一个 ip 就成功了（在一堆 127.0.0.1 的日志里还是挺显眼的）

6、如果验证不可用，排查如下内容：

-   `ping google.com.hk`测试是否解析出 IP（解析出 IP 之后最后全部丢包没关系，只要解析出域名对应的 IP），否则需要验证步骤 2 配置正确性
-   v2ray VPN 自身可用性，在 poweshell 里运行`curl https://google.com.hk` 进行验证
-   通过`echo $HTTP_PROXY`等命令查看是否环境变量已经正确导出
-   确认 v2ray 客户端的局部网端口是否是 10811，否则修改步骤 3 中的`port`

## wsl ssh 代理

没出状况的话，恭喜你，你已经可以在 wsl 里翻墙了，不过，配完后对于 ssh 连接还是不可用，又参考了[另一篇文章](https://juejin.cn/post/6935713248918372365)，需要另外再配置如下：

1、在`~/.ssh/config`中配置：（如果没有`config`文件就新建一个）

```text
Host github.com
  User git
  ProxyCommand nc -X 5 -x $hostip:10810 %h %p
```

10810 是局域网代理 socks 协议的端口，如果你知道如何让 git ssh 走 http 代理的端口欢迎留言补充。

2、测试是否成功代理，通过命令 `ssh -T git@github.com` 来测试能否较快响应。如果出现**Hi,xx! You're successfully authenticated, but GIthub does not provide shell access.** 或者首次连接需要密钥认证，就说明代理成功了。

希望这篇教程可以帮助到你，如果有遇到什么问题或者想指正交流的，欢迎留下评论！
