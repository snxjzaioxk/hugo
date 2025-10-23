---
title: "obsidian建立知识库"
date: 2025-10-23
tags: ["知识库", "远程仓库"]
weight: 50
categories: ["教程"]
---

*前言*

前面好几次想要把本地的文档push到github上面，无奈不能直接push，~~可能是连接不稳定~~，最近看了一些软件，notion，思源，飞书，obsidian这些，都体验了一下，感觉Obsidian很对口味，不订阅的话，是本地的md编辑器，可以自己安装插件，很方便，这个界面的颜色我也是很喜欢的，就有了这篇，学习了一下ssh连接github，把本地的这些文push到远程仓库，建立自己的知识库，标题我不知道起什么好，~~既然都看到这里了，那就将就看吧~~

## 安装obsidian
官方地址
>https://obsidian.md/

直接下载安装即可
*不需要登录也可以使用，登录不购买，即使同一个账号，也不同步*
## ssh配置
*ssh是什么？*
一种加密的身份认证与通信方式，可以让你的电脑和github建立安全的连接

### 生成配对密钥
用管理员模式下的powershell输入以下命令

```
ssh-keygen -t ed25519 -C "你的GitHub邮箱"
```

执行完成，你的**C:\Users\<用户名>\.ssh\**文件夹下会有两个文件
私钥是../id_ed25519，公钥是../ed25519.pub，公钥在github上面配置

### 启动ssh-agent并加载私钥
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service -Name ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519
ssh-add -l   # 检查是否加载成功

*加载成功会输出信息*
### 将公钥添加到github上面
```
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
```

公钥在本地（刚才生成的），需要复制粘贴到github上面

github上的路径：
GitHub ---右上角头像 ---**Settings** --- **SSH and GPG keys** --- **New SSH key**

### 验证连接
ssh -T -p 443 git@ssh.github.com
如果连接正常，则输出以下信息
>Hi <你的GitHub用户名>! You've successfully authenticated...

## 配置远程仓库
在你想要push的文件夹下面执行，也就是你的obsidian储存的文件夹

```
git remote set-url origin ssh://git@ssh.github.com:443/用户名/仓库名.git
git remote -v   
```



### 检测
执行完毕，有类似以下输出，则配置成功
>origin  ssh://git@ssh.github.com:443/snxjzaioxk/knowledge.git (fetch)
>origin  ssh://git@ssh.github.com:443/snxjzaioxk/knowledge.git (push)

### 删除
现在这个就配置完成了，如果想要仓库简洁一些，只保留md文档，就继续看
远程仓库删除obsidian配置

```
notepad 你的obsidian目录
```

把下面这段内容粘贴进去
```
# 系统临时文件
.DS_Store
Thumbs.db
# Obsidian 本地配置（不随仓库同步）
.obsidian/workspace.json
.obsidian/plugins/`
.obsidian/appearance.json
.obsidian/
```

文件命名为.gitignore，下面就可以提交远程到仓库
提交完成你会发现，远程仓库还是有obsidian这个文件夹
接下来进行删除远程仓库的obsidian这个文件夹的操作,但是本地文件夹保留
执行下面命令
```
git rm --cached -r .obsidian
echo .obsidian/>> .gitignore
git add .gitignore
git commit -m "chore: ignore entire .obsidian"
git push
```

刷新github，就可以看见obsidian这个文件夹消失了，仓库非常干净整洁
## 关于报错警告
之后提交文章可能会出现关于CRLF的报错警告，你可以不用管，因为只是一些警告
是关于换行符（LF/CRLF）的提示，git发现有些文件是LF，windows中当前的设置的会把它们在工作区域转化成CRLF，所以给出了wainning的警告
>在这里统一改成LF，跨平台更省心，CRLF是windows的风格

**设置git（全局）**
```
git config --global core.autocrlf input
git config --global core.eol lf

```

**强制LF结尾**
```
echo * text=auto eol=lf > .gitattributes

```
**push远程仓库**
```
git add --renormalize .
git commit -m "Normalize line endings to LF"
git push

```

*结语*
写到最后才会使用代码块，~~前面的更改比较麻烦，就这样吧，下次一定好好使用，已经改了~~
到这里就结束了，你可以在本地愉快的写笔记，通过git来进行同步操作