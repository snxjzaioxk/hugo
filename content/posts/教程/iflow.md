---
title: "iflow模型在claude code cli中调用"
date: 2025-12-17
tags: ["cc", "ai", "iflow"]
weight: 50
categories: ["教程"]
---

# iflow模型在claude code cli环境下调用的几种方法分享（小白折腾之路）

## 前言

iflow里面有很多模型可以免费使用，个人开发者免费，包括*glm4.6，deepseekv3，kimi2*等等，iflow也有cli，可能是我用cc cli习惯了，就想在cc中用，但是iflow官方不支持anthropic格式，无法在cc里面调用，于是就有了这篇，一些踩坑，走了一些弯路

## 思路历程

### 前情提要

前几天买了个玩具小鸡，想折腾一点东西

### 和ai沟通

#### 方案一

描述了这个想法，本来是想用cloudflare worker或者vercel这些无服务平台来一键部署或者托管来实现，了解到iflow的key会过期，这样部署需要手动刷新key，比较麻烦

最终效果

```
claude code cli ---  worker --- iflow api （需要手动更新key）
```

#### 方案二

有了vps之后，可以登录iflow，用oauth登录，利用cliproxyapi这个项目进行格式转化，可以实现iflow一直登录，不需要担心key过期，token自动续期，不需要cloudflare worker这一层

最终效果

```
claude code cli --- vps cliproxyapi ---iflow（自动token续期）
```

#### 方案三

也可以本地下cliproxyapi进行部署，但是每次开机都要重新启动，太麻烦了就不做考虑了

## 踩的一些坑

方案一是我用ai实现的，也就是搭建cloudflare worker 格式转化器来进行转发格式，进而在cc cli里面调用，实际上已经有了很多类似这种网关的项目，这个项目做保留吧，后面吸取教训（bushi）

> https://github.com/aliom-v/anthropic-bridge/blob/main/VPS-QUICK-START.md

这个是用vps部署的详细教程，ai写的，就不搬运了

## 最后

感谢伟大的开源社区，致敬伟大的开源精神
