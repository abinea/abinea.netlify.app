---
title: wsl2+Ubuntu20.04环境配置
date: 2022-04-14T13:48:45.000+08:00
tag: Linux
duration: 7min
---

### 安装 Ubuntu20.04 子系统

安装子系统之前一共需要三步，即启用”适用于 Linux 的 Windows 子系统“、启用”虚拟机平台“、以及升级 WSL2（可选，但前两步是必要的）。 我推荐升级 wsl2，除开解决老版本 wsl1 的一些问题，使用 Docker Desktop 需要搭配 wsl2 ，也许将方便你以后 Docker 的学习使用。

下面的命令请按 Win+X 选择“Windows 终端（管理员）”，并在 Powershell 里运行：

1. 启用 “Linux 的 Windows 子系统” 可选功能

    ```powershell
    Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
    # or
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    ```

2. 启用 “虚拟机平台(Virtual Machine Platform)” 可选组件

    ```powershell
    Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
    # or
    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
    ```

    完成上述两个步骤后需要重启电脑，等待系统开启相关功能。

3. 设置 WSL 默认安装版本为 WSL2

    如果你没有升级过 WSL2，需要安装官方提供的升级包，点[此](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)下载并安装吗，安装后运行：

    ```bash
    wsl --set-default-version 2
    ```

4. 打开 Microsoft Store 搜索安装自己喜欢的发行版（推荐 Ubuntu）

    安装的版本我选择的是 Ubuntu-20.04，如果你选择的是 18.04 版本，区别仅在换源的版本号需要更改。

    下载完成后请先不要打开，先在 Powershell 中验证当前 WSL 版本：

    ```powershell
    wsl -l -v
    ```

    如果看到输出 Ubuntu 及其对应的版本为 2 即升级成功，如果没升级成功可以尝试：

    ```bash
    wsl --update
    ```

5. 完成 WSL2 安装后，我们按 Win 键可以找到安装的 Ubuntu 打开，此时需要完成默认用户的配置，如果不小心关掉了首开窗口将会默认用 root 登录子系统。

    \*可以使用如下命令设置回来：

    ```bash
    # wsl中：
    # 请将username改成你的用户名
    adduser username
    # 此时会让你配置密码，之后是完善用户信息，用户信息建议全部回车，然后系统会帮你创建用户和用户目录

    # 添加新用户到sudo用户组，同样记得替换username
    adduser username sudo

    # 换成powershell，其他发行版修改名字
    ubuntu2004 config --default-user username
    ```

    配置默认用户，需要输入用户名和密码，注意用户名需要使用小写开头，密码输入时是不回显的（就是看不到你输的密码），后续使用 sudo 获取超级管理员权限同样如此。完成这一步就算完成安装了 WSL，恭喜。

### WSL 迁移到 D 盘

WSL 默认安装在 C 盘，随着开发时间的增长，使用到的数据和环境越来越多，占用可能高达几十 GB，显然这对系统盘不是一件好事。为了解决这个问题，需要迁移 WSL 到其他盘符，比如 D:\。

参考某木大的博客，这里修改为不要工具，直接用命令迁移（还是使用 Powershell 带管理员权限），现在先新建一个你的目标文件夹，如`D:\WSL`，然后来敲命令：

```powershell
# 查看此时装的子系统及版本
wsl -l -v
# 我们刚才进去了wsl，此时wsl是后台运行状态，迁移要先关掉wsl
wsl --shutdown
# 备份子系统数据
wsl --export Ubuntu D:\WSL\Ubuntu.tar
# 注销子系统
wsl --unregister Ubuntu
# 重新导入子系统
wsl --import Ubuntu-20.04 D:\WSL\Ubuntu D:\WSL\Ubuntu.tar --version 2
wsl -d Ubuntu-20.04 exit
# 设置Ubuntu默认用户，替换username为你的用户名
ubuntu2004 config --default-user username
```

### Ubuntu-20.04 换源

（1）打开 wsl，输入以下命令备份原来的源

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

（2）再输入以下命令打开 sources.list 配置文件更换源

```bash
sudo vim /etc/apt/sources.list
```

配置内容如下：

```txt
# 默认注释了源码仓库，如有需要可自行取消注释
deb https://mirrors.ustc.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal main restricted universe multiverse

deb https://mirrors.ustc.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-security main restricted universe multiverse

deb https://mirrors.ustc.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-updates main restricted universe multiverse

deb https://mirrors.ustc.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-backports main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.ustc.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```

我喜欢用中科大的源，你也可以选择阿里云、清华……的源。

（4）再输入命令更新源和版本包

```bash
sudo apt update && sudo apt upgrade
```

如果是其他版本，你可以另外百度 or 谷歌搜索对应版本换源，或者使用以下命令：

```bash
lsb_release -a
```

以 Ubuntu-20.04 为例，其中的 Codename 就是源文件中对应的版本号，你只需要将 20.04 换源的文本中的 “focal” 替换成其他版本的版本号。

```text
No LSB modules are available.
Distributor ID: Ubuntu
Description: Ubuntu 20.04.5 LTS
LTS Release: 20.04
Codename: focal
```

## 常用开发环境配置

### 安装 git

换源后的 WSL2 的 Ubuntu-20.04 是已经安装了 git 的，注意 WSL2 的 git 是需要再全局配置 git 用户名跟邮箱。如果你想使用 SSH 方式 clone 代码，同样需要配置公钥私钥，这里不再赘述。

```bash
git --version
# 输出
# git version 2.25.1
```

### 安装 gcc

有两种方式可以在 Ubuntu 安装 gcc 编译器：

```bash
# 直接下载 gcc
sudo apt install gcc
# 装 C/C++ 环境构建包
sudo apt install build-essential
```

我这里更推荐使用方式二，因为它可以顺便下载常用的 C/C++ 环境工具。

安装完后查看版本：

```bash
gcc -v
# 输出一堆，直接看最后：
# gcc version 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04)
```

### 安装 node

node 的版本管理跟包管理同样重要，因此我建议使用 nvm 来管理 node 版本，这将方便你以后大版本的切换。 Ubuntu 环境安装 nvm 需要使用安装脚本，可以使用 curl 或 wget，这里使用 curl 为例。你可以到 [giee 上的镜像仓库](https://gitee.com/mirrors/nvm/tags)查看最新版本，然后将下面的链接对应版本替换为最新版本号。

```bash
curl -o- https://gitee.com/mirrors/nvm/raw/v0.39.2/install.sh | bash
```

如果你 curl 几次会出现连接重置的话，可以尝试比较麻烦的方式，即直接手动拉取现成仓库。

```bash
# clone 国内的仓库，即 nvm 的完整代码
git clone https://gitee.com/Annlix/nvm-sh_nvm.git .nvm
cd .nvm
# 添加执行权限
chmod +x ./nvm.sh
# 测试一下运行脚本
./nvm.sh
```

确保你的脚本能正常运行，每次打开终端都会运行该脚本。下面我们来配置环境变量：

```bash
# 配置环境变量
sudo vim ~/.bashrc
# 在文件最后添加下面内容
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
```

配置完成后，需要重新加载环境变量：

```bash
source ~/.bashrc # 重新加载环境变量
nvm -v # 输出你安装的版本即成功
```

后面来下载 node：

```bash
# 查看可以获取的 node 版本列表
nvm ls-remote
# 直接运行 nvm ls-remote 输出的列表太长了，可以用 grep 做下筛选，比如只输出 v18.x 的版本
nvm ls-remote | grep v18
# 安装最新 LTS 版本
nvm install --lts
```

安装好后是会将默认的 node 跟 npm 直接添加在 PATH 里的，我们可以直接查看一下 node 跟 npm 是不是都安装好：

```bash
# 输出对应版本
node -v && npm -v
# 如果你想切换默认的node版本，可以使用nvm use [version]命令，比如：
nvm use 16.14.0
# 切换不同版本需要先下载对应版本
```

### Vscode 使用 WSL2 开发

Windows 上可以使用 Vscode 连接到我们安装的 WSL，需要安装 Remote - WSL 插件。Remote 三件套提供给 Vscode 强大的远程开发能力，除了 Remote-WSL 是用来连接本地 WSL，Remote-SSH 是用来连接远程服务器的，而 Remote-Container 则是连接管理 Docker 容器。

安装完成后，重新启动 Vscode，左下角会出现一个角标高亮图标，点击后等待插件在 WSL 中安装 server 就可以在 Vscode 打开一个使用 WSL 的窗口了！
