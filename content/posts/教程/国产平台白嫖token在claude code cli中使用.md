---
title: "国产ai在cli环境下使用"
date: 2025-10-07
tags: ["cc", "ai"]
weight: 50
categories: ["教程"]
---



# 国产平台白嫖token在claude code cli中使用

**前言**

claude code是目前第一梯队的模型，由于技术封锁，对国内开发者限制很大，然而国内目前也有平替，比如最新发布的智谱GLM4.6大模型，接下来教如何在各大平台获取免费key在claude code cli中使用

**准备工作**

安装*claude code*

打开命令提示符（cmd）运行

```
npm install -g @anthropic-ai/claude-code
```

验证安装

```
claude --version
```

下载cc-switch，便于模型之间的切换

下载地址：https://github.com/farion1231/cc-switch/releases/tag/v3.4.0

准备工作已经完成，接下来需要获取key，进行配置

## 智谱

官网

> https://bigmodel.cn/usercenter/proj-mgmt/apikeys

获取key，打开cc-switch，添加供应商，配置如下

```
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-key",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic"
  }
}
```

## 魔搭

官网

> https://www.modelscope.cn/my/myaccesstoken

获取token，在cc-switch配置，如下

```
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-key",
    "ANTHROPIC_BASE_URL": "https://api-inference.modelscope.cn",
    "ANTHROPIC_MODEL": "ZhipuAI/GLM-4.5"
  }
}
```

key需要**去掉ms-**粘贴，模型可以自选

## 阿里云百炼

官网

> https://bailian.console.aliyun.com/?tab=model#/api-key

获取key，在cc-switch配置，如下

```
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-key",
    "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_MODEL": "qwen3-coder-plus",
    "ANTHROPIC_SMALL_FAST_MODEL": "qwen-flash"
  },
  "model": "qwen3-coder-plus"
}
```

## 硅基流动

官网

> https://cloud.siliconflow.cn/me/account/ak

获取api，在cc-switch配置，如下

```
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-hdexvjnhpjazqerqdfkdguojqlcfhbcfehnmseemjkiudfii",
    "ANTHROPIC_BASE_URL": "https://api.siliconflow.cn/",
    "ANTHROPIC_MODEL": "zai-org/GLM-4.6"
  }
}


```

至此，已经把四大厂商的apikey已经全部配置，可以打开终端（cmd），输入claude进行使用

如果出现错误，输入/model进行模型切换

接下来就可以在cli环境下愉快的coding了！