---
title: 分析 Cyandev 发起的 CTF2024 挑战解题思路
pubDate: 2023-12-30
description: "今天逛 404 网站的时候捕捉到一个来自 Cyandev.rs 大佬发起了一场跨年 CTF 挑战活动，因为刷到该帖子已经是 CTF 挑战活动开始 5 个小时之后了，所以就不求争取前两名，始终秉承学习至上的态度来看看这位大佬出的题目。"
lastModDate: ''
ogImage: true
toc: true
share: true
giscus: false
search: false
---

> 免责声明
>
> 本文章所提到的技术仅用于学习用途，禁止使用本文章的任何技术进行发起网络攻击、非法利用等网络犯罪行为，一切信息禁止用于任何非法用途。若读者利用文章所提到的技术实施违法犯罪行为，其责任一概由读者自行承担，与作者无关。

## 0x01 前言

今天逛 404 网站的时候捕捉到一个来自 Cyandev.rs 大佬发起了一场跨年 CTF 挑战活动，因为刷到该帖子已经是 CTF 挑战活动开始 5 个小时之后了，所以就不求争取前两名，始终秉承学习至上的态度来看看这位大佬出的题目。经过一小时的折磨，终于顺利把两道题目给 Crack 成功了，排名 15，还行凑合玩玩吧。本文内容主要是想分享我解题时的一些想法和思路，后面文章内容可能会很大程度的剧透`通关Flag`，非常建议大家先自行尝试 Crack 无果后再看文章思路分析。

![](https://files.timlau.me/blog/images/202404072033612.webp)

![](https://files.timlau.me/blog/images/202404072034442.webp)

## 0x02 开始之前

这个 CTF 挑战题目其实只有两道，第一题是作者预设的签到题，对我来说其实可以直接秒了，第二题才是真正开始把玩的题目。可以直接访问 [ctf.cyandev.app](https://ctf.cyandev.app) 直接参与本次 CTF 活动。`由于文章篇幅的问题，我将文章分成两篇进行发布，这篇主要是讲解第一题的解题思路。`

## 0x03 第一题挑战（签到题）

![](https://files.timlau.me/blog/images/202404072034359.webp)

### 0x0301 定位 Flag 校验位置

一上来什么都不管，直接随便乱输入一通，直接点击 `Submit` 按钮，看浏览器作出什么反应。正常来说在输入错误的 Flag 情况下点击提交，无非就是弹窗警告或者修改某些 Doc 的样式以告诉用户输入错了，而我的目的是为了能够快速定位到校验 Flag 是否正确的逻辑代码行。

![](https://files.timlau.me/blog/images/202404072034275.webp)

显然在代码全局直接搜 `The flag is wrong!` 就可以直接定位到 Flag 开始校验的位置，`198行` 处就是弹窗，而 `195行` 的 `onSubmit(value, username)` 就是按钮点击之后需要进入的 Flag 校验函数，我们可以直接在 `195行` 打上断点，步入深入查看。

![](https://files.timlau.me/blog/images/202404072034816.webp)

> PS: 当然，定位校验位置不只有这种方式，且这种方式不是任何时候都可奏效，以后有具体案例可以再介绍。

### 0x0302 步入 onSubmit()

步入至 `submitFlag1()` 内，可以看到 `34行` 还需要进入 `checkFlag1()`，但为了可以让我们读者更理解代码，我在这里可以逐条分析，但实际我在 Crack 的过程中，并不会产生过多的分析，因为有些代码一看便知是 `无关代码`，实际上是可以跳过的。
| 行号 | 代码 | 作用 |
| ---- | ---- | ---- |
| 37 行 | (0, \_backend_api\_\_xxxxxx)(1, username, flag) | 当 checkFlag1 通过后，发送对应 username 和 flag 给服务器做进一步校验（为了防止有人混水摸鱼） |

接下来，我们继续步入到 `checkFlag1()` 内一探究竟。

![](https://files.timlau.me/blog/images/202404072034008.webp)

### 0x0303 步入 checkFlag1()

好戏正式开始，直接印入眼帘的就是 `26行` 的正则表达式，熟悉正则的小伙伴或者甚至刚入门正则的小伙伴都能看懂，这是一个 8 位且只能接受大小写字母以及 0-9 和一个感叹号的正则表达式。

![](https://files.timlau.me/blog/images/202404072035649.webp)

### 0x0304 突破两层判断

显然这里要突破两层关卡，第一层就是通过 `26行` 的正则表达式，第二层就是通过 `31行` 的 `realFlag.length > 0 && flag === realFlag`。

### 0x0305 第一层：正则表达突破

这一层特别容易，只要你输入的内容`满足8位字符`，且`字符只允许大小写、数字以及感叹号`即可，第一层判断轻松拿下，光标步进到 `29行`。

![](https://files.timlau.me/blog/images/202404072035792.webp)

### 0x0306 第二层：realFlag 的突破

第二层判断不难看出，realFlag 是要与我们输入的 flag 进行比较的，如果我们在 `31行` 打个断点，然后直接去看 realFlag 的值不就可以轻松秒杀？然而...

![](https://files.timlau.me/blog/images/202404072035405.webp)

不难发现，realFlag 返回了 `""`空字符串，言外之意就是我们肯定漏了一个很关键的信息点。就是 `29行` 的 `protectionByte`。

显然这个变量作为参数传给了一个混淆过的函数名的函数，我们可以猜测 `protectionByte` 很大程度上决定了 `realFlag` 的正常输出，但我们怎么知道 `protectionByte` 应该是什么的时候才会输出正确的 `realFlag` 呢...

### 0x0307 穷举 protectionByte

遇事不决，穷举解决（当然不能乱用）。protectionByte 变量对应的就是你输入的字符串中的第一个字符的 ASCII 码，对于 ASCII 码来说，字符码最多也就不超过 `127`，况且还需要满足 `第一层的正则表达式规则`，所以完全可以穷举它，并直至 realFlag 返回一个不为空的字符串，那我们的目标就达到了。

![](https://files.timlau.me/blog/images/202404072035739.webp)

### 0x0308 代码实现穷举并找出 realFlag

这个代码就太简单了，一个 for 循环搞定一切。

```js
for(let _ascii = 0; _ascii < 127; _ascii++){
    const realFlag = (0,_rust_sdk__WEBPACK_IMPORTED_MODULE_1__/* .getFlag1 */ .S7)(_ascii);
    if (realFlag != ''){
        console.log(realFlag);
        break;
    }
}
```

直接把这代码在 Console 里面一粘贴，一执行，realFlag 自然就出来了。

![](https://files.timlau.me/blog/images/202404072035838.webp)

## 0x04 滴！签到成功

第一题顺利打卡成功。

![](https://files.timlau.me/blog/images/202404072035655.webp)
