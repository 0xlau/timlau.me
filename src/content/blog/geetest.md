--- 
title: "对极验 geetest 滑块验证码图片还原算法的研究"
description: "本文仅对极验geetest平台下的滑块验证码的图片还原进行分析与研究，试图找到打乱图片到正常图片之间的还原函数以及解析它还原算法的原理。"
pubDate: 2022-01-14
lastModDate: ''
ogImage: true
toc: true
share: true
giscus: false
search: false
---

## 前言

滑块验证码是我们在互联网上经常遇见的校验是否人类操作行为的一种检测方式，大概流程就是生成一张图片，然后随机挖去一块，在页面展示被挖去部分的图片，再通过js获取用户滑动距离，以及坐标等信息到后台进行校验。只要用户移动的距离符合，以及移动的轨迹行为检测通过即可视为验证通过。

而大部分开发者做爬虫时经常需要绕过该此类验证码进行下一步的爬虫，本文仅对[极验geetest平台](https://www.geetest.com/ "极验geetest平台")下的滑块验证码的图片还原进行分析与研究，试图找到打乱图片到正常图片之间的还原函数以及解析它还原算法的原理。

## 截获验证码原图

访问[极验geetest滑动模块demo页面](https://www.geetest.com/demo/slide-float.html "极验geetest滑动模块demo页面")后请求验证码图片，并使用浏览器`F12开发者工具`截获从极验geetest服务器响应回来的图片。

![](https://files.timlau.me/blog/images/202404072243858.webp)

![](https://files.timlau.me/blog/images/202404072243161.webp)

响应回来的一张是原图，另一张是带有拼图缺口的图，但它们均是乱序的，介绍来我们得逐步分析js的源代码是如何将乱序图片恢复至正常图片的。

![](https://files.timlau.me/blog/images/202404072243584.webp)

## 找突破口

### 寻找思路

思路是需要找到还原验证码图片的方法，首先我们得找到验证码被绘制时的方法调用，打开`Elements（元素）`选项卡，查看页面上验证码图片框内的元素。

![](https://files.timlau.me/blog/images/202404072243670.webp)

显然易见，该图片是使用canvas画出来的，这时候我们第一想到的就是使用事件监听断点，将canvas要被创建时的动作断下来。打开`Sources（源代码）`选项卡，将右侧`Event Listener Breakpoints（事件监听断点）`内的`Canvas`->`Create canvas context`,勾选上，意为在canvas创建context之时将断点停在该方法上。重新点击刷新验证码图片后，即可捕获到该事件。

![](https://files.timlau.me/blog/images/202404072243292.webp)

### 捕获CanvasContext创建事件

捕获到canvas创建context事件，由下图不难看出，第280行代码`var o = i[$_CJDQ(76)]($_CJDQ(28));`以及第282代码`var s = e[$_CJET(76)]($_CJET(28));`均是创建了一个[CanvasRenderingContext2D对象](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D "CanvasRenderingContext2D对象")，并分别赋值给了`变量o`与`变量s`。

![](https://files.timlau.me/blog/images/202404072243333.webp)

接下来直接断点至第291行，并放行至该行代码，忽略for循环的运算逻辑以及他的意义，我们需要先梳理被混淆后的js源代码的实际含义是什么。

![](https://files.timlau.me/blog/images/202404072243496.webp)

### 恢复源代码被混淆前的含义

经过断点后，可以将光标放置在被混淆的掩码上，会自动提示该掩码的真正含义。以下是作者整理出来的含义以及恢复后的源代码。

| 掩码        | 实际含义       |
| ----------- | -------------- |
| $\_CJDQ(76) | "getContext"   |
| $\_CJDQ(28) | "2d"           |
| $\_CJET(12) | "drawImage"    |
| $\_CJET(72) | "height"       |
| $\_CJDQ(39) | "width"        |
| $\_CJET(69) | "getImageData" |
| $\_CJET(66) | "putImageData" |

```javascript
// slide.7.8.6.js的第280行至第290行代码
var o = i[$_CJDQ(76)]($_CJDQ(28));
o[$_CJET(12)](t, 0, 0);
var s = e[$_CJET(76)]($_CJET(28));
(e[$_CJET(72)] = r), (e[$_CJDQ(39)] = 260);
for (var a = r / 2, _ = 0; _ < 52; _ += 1) {
  var c = (Ut[_] % 26) * 12 + 1,
    u = 25 < Ut[_] ? a : 0,
    l = o[$_CJET(69)](c, u, 10, a);
  s[$_CJET(66)](l, (_ % 26) * 10, 25 < _ ? a : 0);
}
```

经过对掩码的替换，执行含义也非常的清晰。

```javascript
// 被还原后的代码含义（变量名也经过了修改）
var CRC2D_1 = i.getContext("2d"); //创建一个CanvasRenderingContext2D对象
CRC2D_1.drawImage(t, 0, 0); //将t变量画到CRC2D_1中，该t为验证码乱码原图
var CRC2D_2 = e.getContext("2d"); //创建另一个CanvasRenderingContext2D对象
(CRC2D_2.height = r), //设置高度
  (CRC2D_2.width = 260); //设置宽度
// 该循环必定是还原乱码原图的算法
for (var a = r / 2, _ = 0; _ < 52; _ += 1) {
  var c = (Ut[_] % 26) * 12 + 1,
    u = 25 < Ut[_] ? a : 0,
    l = CRC2D_1.getImageData(c, u, 10, a); // 将某个小区块的乱码原图赋值给变量l
  CRC2D_2.putImageData(l, (_ % 26) * 10, 25 < _ ? a : 0); // 将在乱码原图扣下来的小部分按顺序拼接到CRC2D_2中
}
```

显然for循环体内的数组`Ut[]`必定就是该乱码图片还原的关键序列，通过调试可以得出数组`Ut[]`并不会随着运行次数的改变而改变，它是固定的一个还原序列，通过`Console（控制台）`选项卡可直接打印数组`Ut[]`进行还原顺序的查看。

![](https://files.timlau.me/blog/images/202404072244002.webp)

## 还原算法的原理

首先需要知道的是乱码图片其实是被分成了上下各26块小图块，并且接收的图片一定被分为上下两大块，原因是还原算法的for循环中，定义了`var a = r / 2`，意思是a为图片坐标的一半，并且是固定的一半。

![](https://files.timlau.me/blog/images/202404072244053.webp)

`var c = Ut[_] % 26 * 12 + 1`和`u = 25 < Ut[_] ? a: 0`，这两条for循环体中的语句对应的`变量c`与`变量u`的含义分别是`第Ut[_]个`乱图中小方块的左上角`x`与`y`的像素位置。

经过`l = CRC2D_1.getImageData(c, u, 10, a)`方法执行，将小图块从`(c, u)`坐标开始，宽度为`10`，高度为`a（指的就是小图块的高度）`扣下来，保存到`变量l`中。

然后执行`CRC2D_2.putImageData(l, _ % 26 * 10, 25 < _ ? a: 0);`，将`变量l`保存的小图块，把它按从左往后，从上往下的顺序，依次写入到`对象CRC2D_2`中。

由此分析，可得到以下图片的还原顺序。

![](https://files.timlau.me/blog/images/202404072244187.webp)
