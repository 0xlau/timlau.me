---
title: "对飞猪 H5 端接口 sign 签名加密算法逆向研究"
pubDate: 2022-01-12
description: "研究飞猪旅行HTML5端sign签名过程，以复刻sign签名过程为手段，以查询酒店价格为目标，以学习技术要点、思路以及如何防范为宗旨，展开对飞猪H5端API接口sign签名的研究。"
lastModDate: ''
ogImage: true
toc: true
share: true
giscus: false
search: false
---

## 前言

研究飞猪旅行HTML5端sign签名过程，以复刻sign签名过程为手段，以查询酒店价格为目标，以学习技术要点、思路以及如何防范为宗旨，展开对飞猪H5端API接口sign签名的研究。

## 寻突破口

### 捕获目标API请求数据包

使用浏览器`F12开发者工具`开启设备模拟器模式，访问[酒店搜索页面](https://market.m.taobao.com/app/trip/rx-search-all/pages/home "酒店搜索页面")，随便搜索一家酒店并进入酒店的详情页面，详情页面请求将全部被捕获于开发者工具的`NetWork（网络）`选项卡中。

![](https://files.timlau.me/blog/images/202404072251743.webp)

使用`Ctrl+F`查找页面中对应价格的数字，定位到请求数据包位置。

![](https://files.timlau.me/blog/images/202404072251842.webp)

### 分析数据包Payload

除了sign签名的一串看似md5密文但实际上又不是md5密文的字段以外，其他字段都很好理解。但如果除了sign签名字段以外的其他字段修改后，sign签名也必须跟着改动，并且是以一个`固定的加密规则`进行运算后得出来的sign签名字符串，故当务之急需要找到sign签名的位置并把它运算的函数复刻下来，验证加密函数的可用性。

| 字段       | 值                              | 盲猜意义                                                                                                                  |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| type       | originaljson                    | 应该是指请求源类型是json                                                                                                  |
| api        | mtop.trip.hotel.hotelDetail     | 告诉服务器需要调用的api服务                                                                                               |
| v          | 1.0                             | API协议版本                                                                                                               |
| params     | [object Object]                 | 不懂，估计是传值的时候把整个对象传给params了                                                                              |
| ttid       | 201300@travel_h5_3.1.0          | 应该也是api所属版本号                                                                                                     |
| appKey     | 12574478                        | 顾名思义，具体用处可以查看[淘宝的API开放文档](https://open.taobao.com/doc.htm?docId=101617&docType=1 "淘宝的API开放文档") |
| t          | 1641821310356                   | 时间戳                                                                                                                    |
| sign       | bb6db2ea281d6422409d820d8223147 | 经过一系列加密后的`sign签名`                                                                                              |
| data(BODY) | 一大串JSON文本                  | 这就是真正要传的请求数据文本                                                                                              |

![](https://files.timlau.me/blog/images/202404072251477.webp)

### 定位sign签名位置

需要找到sign签名的运算函数，首先得找到sign签名字符串在哪里赋的值。定位某个请求参数赋值的方法有很多种，有做hook的、有Ctrl+Shift+F的、有用XHR断点的，等等非常多的方法，而且有一些复杂的网站往往需要将这些方法组合使用才能找到某个参数的赋值位置，而在本项目，直接使用`Ctrl+Shift+F大法`即可。

> 尝试使用`Ctrl+Shift+F大法`解决问题是一件性价比很高的事情，前提是你需要猜测网站js源代码参数组合逻辑背后的过程。
> 本项目例子：URL的sign签名参数，可猜测网站js源代码拼接该参数时使用了`"&sign="`、`"sign="`、`"sign"`。
> **!!此方法不一定适用于任何网站，若js源码混淆严重，失去了字符串原本的意义，则无法使用该方法查找（往后若有项目可演示其他搜索方法）**

现在，尝试使用全局搜索`"sign="`字符串，马上能定位到可疑的sign签名赋值的代码语句。

![](https://files.timlau.me/blog/images/202404072251271.webp)

可以看到有三条疑似给sign签名赋值的三个js文件，这时候需要根据逆向经验去猜测源码应该会使用哪个去进行sign签名的赋值和加密。但如果没有逆向经验的判断，也可以对搜索出来的三个js文件可疑的代码段进行同时断点，逐个查看分析。

其实可以在`Network（网络）`选项卡的请求项中查看`Initiator`里的`Request call stack`，往往最后出现最多次的js文件，即是请求加密所执行的js文件。在这里，出现最多次的是`seed-min.js`文件，我们锁定它，然后进行代码段的断点。

![](https://files.timlau.me/blog/images/202404072251818.webp)

在*8548行*做一个断点，重新刷新页面，让前端重新请求一个数据包并把它断点截获。

![](https://files.timlau.me/blog/images/202404072252394.webp)

## 顺藤摸瓜寻加密入口

断点被捕获后，在`Sources(源)`选项卡中，查看被断点后时的`Scope（本地变量）`和`CallStack（调用栈）`，通过这两个信息顺藤摸瓜到加密函数的入口处。

![](https://files.timlau.me/blog/images/202404072252829.webp)

显然，这里的变量`e`就是我们要找的sign签名字符串，于是我们从这里开始顺藤摸瓜，找到加密入口的地方。

### 分析方法`y(i.data, m, S.a, v)`

以下代码段很显然，变量`e`是由方法`y(i.data, m, S.a, v)`运算以后得来的，所以我们得进入y的函数内部。

```javascript
y(i.data, m, S.a, v).then(function (e) {
  d.push("sign=" + e),
    n({
      originPath: f,
      search: d,
    });
});
```

![](https://files.timlau.me/blog/images/202404072252783.webp)

> 把光标放在方法名上，会显示方法所在位置，点击可以进入到对应的方法的定义位置。

方法`y(e, t, n, r)`内仍然几个值得断点查看的方法`_(n)`、方法`d([n, t, r, e].join("&"))`以及变量`n`

![](https://files.timlau.me/blog/images/202404072252020.webp)

### 分析方法`_(n)`

显然该方法是用来获取cookies内的`_m_h5_tk`的值，并且执行方法`v(n)`，将`_m_h5_tk`的值用下划线`"_"`分割，取左边部分。

![](https://files.timlau.me/blog/images/202404072252584.webp)

### 分析方法`d([n, t, r, e].join("&"))`

通过对方法`d([n, t, r, e].join("&"))`处的断点，查看以下4个变量的值。

| 参数名 | 值                                                                 | 解释                   |
| ------ | ------------------------------------------------------------------ | ---------------------- |
| n      | af5ea7aa071afc99d96745743d3634d0                                   | `_m_h5_tk`值的左边     |
| t      | 1641959319288                                                      | 时间戳                 |
| r      | 12574478                                                           | appKey                 |
| e      | `{"_fli_newpage":"1","hid":"0","adultNum":2,"shid":1002342 ......` | 真正要传的请求数据文本 |

使用`.join("&")`将四个变量的值用`"&"`连接在一起，传送给方法`d()`

![](https://files.timlau.me/blog/images/202404072252696.webp)

使用单步执行进入方法`d()`内部，发现其传参变量为`e`，其内容为：

> "af5ea7aa071afc99d96745743d3634d0&1641959319288&12574478&{"\_fli_newpage":"1","hid":"0","adultNum":2,"shid":1002342 ....
> 由于篇幅问题，不将变量`e`的值全部展开查看，但可以发现，确实是由以上表格的四个值用`"&"`拼接起来的。

```javascript
// 方法d()的内部
d =
  ((r = function (e, t) {
    return (e << t) | (e >>> (32 - t));
  }),
  (i = function (e, t) {
    var n, r, i, o, a;
    return (
      (i = 2147483648 & e),
      (o = 2147483648 & t),
      (a = (1073741823 & e) + (1073741823 & t)),
      (n = 1073741824 & e) & (r = 1073741824 & t)
        ? 2147483648 ^ a ^ i ^ o
        : n | r
          ? 1073741824 & a
            ? 3221225472 ^ a ^ i ^ o
            : 1073741824 ^ a ^ i ^ o
          : a ^ i ^ o
    );
  }),
  (o = function (e, t, n, o, a, s, c) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, n) {
              return (e & t) | (~e & n);
            })(t, n, o),
            a,
          ),
          c,
        ),
      )),
      i(r(e, s), t)
    );
  }),
  (a = function (e, t, n, o, a, s, c) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, n) {
              return (e & n) | (t & ~n);
            })(t, n, o),
            a,
          ),
          c,
        ),
      )),
      i(r(e, s), t)
    );
  }),
  (s = function (e, t, n, o, a, s, c) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, n) {
              return e ^ t ^ n;
            })(t, n, o),
            a,
          ),
          c,
        ),
      )),
      i(r(e, s), t)
    );
  }),
  (c = function (e, t, n, o, a, s, c) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, n) {
              return t ^ (e | ~n);
            })(t, n, o),
            a,
          ),
          c,
        ),
      )),
      i(r(e, s), t)
    );
  }),
  (u = function (e) {
    var t,
      n = "",
      r = "";
    for (t = 0; t <= 3; t++)
      n += (r = "0" + ((e >>> (8 * t)) & 255).toString(16)).substr(
        r.length - 2,
        2,
      );
    return n;
  }),
  function (e) {
    var t, n, r, l, p, f, d, h, g, m;
    for (
      e = (function (e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", n = 0; n < e.length; n++) {
          var r = e.charCodeAt(n);
          r < 128
            ? (t += String.fromCharCode(r))
            : r > 127 && r < 2048
              ? ((t += String.fromCharCode((r >> 6) | 192)),
                (t += String.fromCharCode((63 & r) | 128)))
              : ((t += String.fromCharCode((r >> 12) | 224)),
                (t += String.fromCharCode(((r >> 6) & 63) | 128)),
                (t += String.fromCharCode((63 & r) | 128)));
        }
        return t;
      })(e),
        t = (function (e) {
          for (
            var t,
              n = e.length,
              r = n + 8,
              i = 16 * ((r - (r % 64)) / 64 + 1),
              o = new Array(i - 1),
              a = 0,
              s = 0;
            s < n;

          )
            (a = (s % 4) * 8),
              (o[(t = (s - (s % 4)) / 4)] = o[t] | (e.charCodeAt(s) << a)),
              s++;
          return (
            (a = (s % 4) * 8),
            (o[(t = (s - (s % 4)) / 4)] = o[t] | (128 << a)),
            (o[i - 2] = n << 3),
            (o[i - 1] = n >>> 29),
            o
          );
        })(e),
        d = 1732584193,
        h = 4023233417,
        g = 2562383102,
        m = 271733878,
        n = 0;
      n < t.length;
      n += 16
    )
      (r = d),
        (l = h),
        (p = g),
        (f = m),
        (d = o(d, h, g, m, t[n + 0], 7, 3614090360)),
        (m = o(m, d, h, g, t[n + 1], 12, 3905402710)),
        (g = o(g, m, d, h, t[n + 2], 17, 606105819)),
        (h = o(h, g, m, d, t[n + 3], 22, 3250441966)),
        (d = o(d, h, g, m, t[n + 4], 7, 4118548399)),
        (m = o(m, d, h, g, t[n + 5], 12, 1200080426)),
        (g = o(g, m, d, h, t[n + 6], 17, 2821735955)),
        (h = o(h, g, m, d, t[n + 7], 22, 4249261313)),
        (d = o(d, h, g, m, t[n + 8], 7, 1770035416)),
        (m = o(m, d, h, g, t[n + 9], 12, 2336552879)),
        (g = o(g, m, d, h, t[n + 10], 17, 4294925233)),
        (h = o(h, g, m, d, t[n + 11], 22, 2304563134)),
        (d = o(d, h, g, m, t[n + 12], 7, 1804603682)),
        (m = o(m, d, h, g, t[n + 13], 12, 4254626195)),
        (g = o(g, m, d, h, t[n + 14], 17, 2792965006)),
        (h = o(h, g, m, d, t[n + 15], 22, 1236535329)),
        (d = a(d, h, g, m, t[n + 1], 5, 4129170786)),
        (m = a(m, d, h, g, t[n + 6], 9, 3225465664)),
        (g = a(g, m, d, h, t[n + 11], 14, 643717713)),
        (h = a(h, g, m, d, t[n + 0], 20, 3921069994)),
        (d = a(d, h, g, m, t[n + 5], 5, 3593408605)),
        (m = a(m, d, h, g, t[n + 10], 9, 38016083)),
        (g = a(g, m, d, h, t[n + 15], 14, 3634488961)),
        (h = a(h, g, m, d, t[n + 4], 20, 3889429448)),
        (d = a(d, h, g, m, t[n + 9], 5, 568446438)),
        (m = a(m, d, h, g, t[n + 14], 9, 3275163606)),
        (g = a(g, m, d, h, t[n + 3], 14, 4107603335)),
        (h = a(h, g, m, d, t[n + 8], 20, 1163531501)),
        (d = a(d, h, g, m, t[n + 13], 5, 2850285829)),
        (m = a(m, d, h, g, t[n + 2], 9, 4243563512)),
        (g = a(g, m, d, h, t[n + 7], 14, 1735328473)),
        (h = a(h, g, m, d, t[n + 12], 20, 2368359562)),
        (d = s(d, h, g, m, t[n + 5], 4, 4294588738)),
        (m = s(m, d, h, g, t[n + 8], 11, 2272392833)),
        (g = s(g, m, d, h, t[n + 11], 16, 1839030562)),
        (h = s(h, g, m, d, t[n + 14], 23, 4259657740)),
        (d = s(d, h, g, m, t[n + 1], 4, 2763975236)),
        (m = s(m, d, h, g, t[n + 4], 11, 1272893353)),
        (g = s(g, m, d, h, t[n + 7], 16, 4139469664)),
        (h = s(h, g, m, d, t[n + 10], 23, 3200236656)),
        (d = s(d, h, g, m, t[n + 13], 4, 681279174)),
        (m = s(m, d, h, g, t[n + 0], 11, 3936430074)),
        (g = s(g, m, d, h, t[n + 3], 16, 3572445317)),
        (h = s(h, g, m, d, t[n + 6], 23, 76029189)),
        (d = s(d, h, g, m, t[n + 9], 4, 3654602809)),
        (m = s(m, d, h, g, t[n + 12], 11, 3873151461)),
        (g = s(g, m, d, h, t[n + 15], 16, 530742520)),
        (h = s(h, g, m, d, t[n + 2], 23, 3299628645)),
        (d = c(d, h, g, m, t[n + 0], 6, 4096336452)),
        (m = c(m, d, h, g, t[n + 7], 10, 1126891415)),
        (g = c(g, m, d, h, t[n + 14], 15, 2878612391)),
        (h = c(h, g, m, d, t[n + 5], 21, 4237533241)),
        (d = c(d, h, g, m, t[n + 12], 6, 1700485571)),
        (m = c(m, d, h, g, t[n + 3], 10, 2399980690)),
        (g = c(g, m, d, h, t[n + 10], 15, 4293915773)),
        (h = c(h, g, m, d, t[n + 1], 21, 2240044497)),
        (d = c(d, h, g, m, t[n + 8], 6, 1873313359)),
        (m = c(m, d, h, g, t[n + 15], 10, 4264355552)),
        (g = c(g, m, d, h, t[n + 6], 15, 2734768916)),
        (h = c(h, g, m, d, t[n + 13], 21, 1309151649)),
        (d = c(d, h, g, m, t[n + 4], 6, 4149444226)),
        (m = c(m, d, h, g, t[n + 11], 10, 3174756917)),
        (g = c(g, m, d, h, t[n + 2], 15, 718787259)),
        (h = c(h, g, m, d, t[n + 9], 21, 3951481745)),
        (d = i(d, r)),
        (h = i(h, l)),
        (g = i(g, p)),
        (m = i(m, f));
    return (u(d) + u(h) + u(g) + u(m)).toLowerCase();
  });
```

至此，加密入口已暴露出来了，即方法`d`。

## 验证加密方法可用性

sign签名方法已经拿到手，接下来当然是要验证它是否可用。

在`Sources（源代码）`选项卡左侧的`Snippets（代码片段）`Tab页中新增一个代码片段，将sign签名方法复制到里面将其保存，并且复制将4个关键参数传入到方法中，然后点击`运行（Ctrl+Enter）`。

![](https://files.timlau.me/blog/images/202404072252903.webp)

重新发送一个请求，然后将H5端真实发送的四个参数的值分别复制到自定义参数中，查看H5端生成的sign值是否与自己新建的代码片段运行的值是一致的，若是一致的则表示该sign签名函数可被使用。

![](https://files.timlau.me/blog/images/202404072253157.webp)

![](https://files.timlau.me/blog/images/202404072253346.webp)

![](https://files.timlau.me/blog/images/202404072253154.webp)

![](https://files.timlau.me/blog/images/202404072253025.webp)

可以看见飞猪H5端产生的sign值与自定义产生的sign值是一致的，都是`fd232f8836d8713c277215d71f43820c`，说明我们找到的sign签名加密函数是正确的。
