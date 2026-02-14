---
title: "迟来的 DROMARA 证书，回顾开源之旅"
pubDate: 2023-09-01
description: "当时在公司综合考虑下，确定业务需要引入 liteFlow 来解决我们的部分业务难题。而负责引入 liteFlow 这个新框架到公司系统的重任落到我头上，于是乎与 liteFlow 框架共进退的命运齿轮开始转动..."
lastModDate: ''
ogImage: true
toc: true
share: true
giscus: true
search: false
---

## 前言

说实话很荣幸能够加入到 [liteFlow](https://github.com/dromara/liteFlow) 开源项目的团队内，同时也认识到了这个框架的作者[铂赛东](https://github.com/bryan31)大佬，他真的非常健谈，对于开源社区的用户，基本也能做到有问必答。

当时在公司综合考虑下，确定业务需要引入 liteFlow 来解决我们的部分业务难题。而负责引入 liteFlow 这个新框架到公司系统的重任落到我头上，于是乎与 liteFlow 框架共进退的命运齿轮开始转动...

## 契机

也许是我性格的原因，促使了我很乐意参与开源项目当中[(参与过的项目)](https://cv.0xlau.dev)。

回顾小时候做过的各种事情，我始终怀疑自己是利他主义者，直至大学期间班级里发了一个叫做 [MBTI 16型人格测试](https://www.16personalities.com/)（半信半疑的做了），结果就是 `INFP-A`...
![](https://files.timlau.me/blog/images/202404072231813.webp)

在使用了 liteFlow 一段时间之后，发现 liteFlow 有个致命缺陷，就是在使用 IntelliJ IDEA 开发的时候，liteFlow 自家的逻辑表达式总是没办法进行智能提示、高亮显示，极大程度拖累了整个开发的流畅度。
于是下决心与 [铂赛东](https://github.com/bryan31) 道出了我的想法，做一款用于 liteFlow 框架的 IntelliJ IDEA 插件，并开源出来。

[铂赛东](https://github.com/bryan31) 也非常的健谈，三言两语就与我的想法一拍即合，于是我的开源之旅正式开始。

![](https://files.timlau.me/blog/images/202404072232793.webp)

## 过程

其实过程是痛苦并快乐着的，庆幸我平时经常阅读国外的技术文档，英文水平足以支撑我阅读整个 [IntellIj Plugin SDK](https://plugins.jetbrains.com/docs/intellij/welcome.html) 文档（滑稽的是我大学英语四级都没过，最高分415...），所以在开发过程中，阻碍最大的不是语言，是某些技术的实现。

比如，BNF的编写、liteFlow 组件的识别、GUI的设计等等。

## 发布

[LiteFlowX](https://github.com/0xlau/LiteFlowX) 的第一版最终在 2022-05-18 上架，[铂赛东](https://github.com/bryan31) 也如期为我的插件做了宣传。以下是推文二维码。

![](https://files.timlau.me/blog/images/202404072232889.webp)

## 现状

截止至 2024 年 1 月，插件下载总量已经超过 `15k`，且仍在持续增长。

<div id="liteflowx"></div>
<script src="https://plugins.jetbrains.com/assets/scripts/mp-widget.js"></script>
<script>
  // Please, replace #yourelement with a real element id on your webpage
  MarketplaceWidget.setupMarketplaceWidget('card', 19145, "#liteflowx");
</script>
