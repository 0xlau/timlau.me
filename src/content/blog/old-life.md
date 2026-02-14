---
title: 我的程序人生
description: 现在是 2018年12月17日 22:13，此时此刻的我记录第一次写的博客
pubDate: 2018-12-17
lastModDate: ''
ogImage: true
toc: true
share: true
giscus: true
search: false
---

## 前言

现在是 2018年12月17日 22\:13，此时此刻的我记录第一次写的博客。目前在校读本科。

从小学五年级开始，天真懵懂的我就开始励志成为一位程序员。直至现在，误打误撞，一学就是十几年，从开始小学的 Visual Basic、易语言，到初中的 Pascal、Lua，最后到现在的.net，掉发的路从没有放弃，知识也越学越多，头发越掉越少。每到一个阶段再回想自己的过去，总是这么的天真可笑。同时我也说不出我对java有什么怨恨，就感觉我对java并不大敏感。在此文，想简单的分享一下我的编程人生经历：

## 启蒙老师

小学五年级到初一期间，易语言在当时还算是风靡半个球，多半辅助、外挂当时还是从他那边开发出来的。我用着我老爸的台式电脑，开始做第一个易语言程序，拖拽组件、编写代码、编译、完成！到现在的，都能感受到当年我写易语言那种愉悦、随意的天真味道，这也就是我为什么当年取名为 小易 并一直使用到现在的原因，虽然我姓名中不含有 `易` 字。随着对易语言的熟悉，我也尝试着去开发一些小工具、小外挂、小玩意儿，但是工具类软件偏多。就这样直至上到初二，我得知我们初中的学校有编程队的存在，但是我不知道怎样才能进入，我便找到我的电脑老师，徐老师。徐老师是学校编程团队的带队老师，经常带领学生在NOIP等比赛中取得非常好的成绩。当年我把我曾经写过的易语言的软件给他浏览了一遍，他遍认为“这孩子有前途...”，我便进入了学校的编程队。

当年我们是学Pascal，学算法，懵懂的我并不知道，算法是一个什么概念。随着时间推移，老师教我们回溯、递归、分治、贪心很多算法，但我当时对此毫无灵感，似乎思维跟不上，参加竞赛时，老师也经常把我们报名到高中组里比赛，说初中组的比较简单，没必要。但是我每次竞赛出来的成绩，并不理想，跟其他学徒相比，落后太大，我对此感到疑惑：难道我不是做程序员的料？信心几乎被打落到谷底，犹如一条咸鱼，学了又学了，似乎找不到编程的乐趣了。

![](https://files.timlau.me/blog/images/202404072255935.webp)

直至那天，徐老师把我介绍给了另一位老师，邓老师。邓老师的出现彷佛就是我编程道路上的一个转折点，换句话是他真正启蒙了我。他非常看好我，经常带我去参加各种比赛，各种机器人大赛，创新大赛等，在这些大赛中，也获得了非常不错的奖项。邓老师在我印象里，他就是软硬件方面都懂大神，设计出自己的飓风机器人主板，他在学校设立了自己的机器人基地、机器人培训班，专门培训学生的动手能力和思维能力，似乎学校荣获机器人培训特色的名誉，也是因他而来的，同时，省级比赛的项目也有他的存在。直到现在，我也有跟邓老师保持联系，非常感谢邓老师与徐老师。

## 重燃编程兴趣

这要从 2013 年说起，还在的我，无意间发现一款名为 触动精灵① 的IOS越狱软件。当年的腾讯手游刚兴起的时候，一款名为 天天爱消除 的游戏特别火，大家都在攀比分数。随后我拿着我手中早已越狱的iPhone 4下载起了触动精灵，第一次使用了别人写的脚本，运行！屏幕就犹如附着灵魂般的在操作着游戏，并且能在短时间内消除很多方块以至于得分非常的高。当年的我惊呆了，这一波让手机灵魂附体的操作深深吸引了我，激起了对编程更大的兴趣。直至现在，我的部分外快收入，都是来源于触动精灵这个平台，我非常感谢它。

通过一段时间努力，为触动精灵做出了一些贡献（用易语言给触动写了一个名为易触动的IDE）后，成功混入了触动精灵的内部群。我才发现，大神还是那些大神，我才发现，易语言并不能一直赖着他，总得学习新的东西。从那起，我就下定决心，开始学习新的编程语言。回想起我启蒙老师说过的话：编程语言其实都是大同小异，只要你会了一种，其他都很快上手。于是我不在触动内部群混了，出来做实实在在的触动的脚本开发者，尝试一下。

> ① 触动精灵（Touch Sprite）就是一款用 Lua 语言为基础开发的一款模拟手机/平板电脑的模拟操作的脚本开发软件。

## 赚到的第一笔最平凡不过的外快

那是2015年的秋天，通过自学Lua和触动精灵一些基础函数和框架后，成功混入了触动精灵的交易群开始尝试接单。当年的我赚钱模式就是：私人定制，有偿维护。第一个客户来了！要求开发一款AA司机端自动抢单子的脚本。由于客户三年都没有联系，脚本也停更了，以下是源码：

```lua
init("0",0)
luaExitIfCall(true)
Devtype=0
width, height = getScreenSize()

-------------------------------------------------

-------------------------------------------------
if width == 640 and height == 1136 then
Devtype=1--iPhone 5, 5S,5C, iPod touch 5
elseif width == 640 and height == 960 then
Devtype=2--iPhone 4,4S, iPod touch 4
elseif width == 320 and height == 480 then
Devtype=3--iPhone 非?高分屏
elseif width == 768 and height == 1024 then
Devtype=4--iPad 1,2, mini 1
elseif width == 1536 and height == 2048 then
Devtype=5--iPad 3,4,5
end
if (Devtype~=1) then
	lua_exit();
	dialog("不支持此设备类型",0)
end
------------------------------------------------
function iscolor(pos,p)
	r = math.floor(pos[3]/0x10000)
	g = math.floor((pos[3]%0x10000)/0x100)
	b = math.floor(pos[3]%0x100)
	rr,gg,bb=getColorRGB(pos[1],pos[2]);
	if (rr>=r-p)and(rr<=r+p)and(gg>=g-p)and(gg<=g+p)and(bb>=b-p)and(bb<=b+p) then
		return true;
		else
		return false;
	end
end
function but(pos)
	touchDown(1,pos[1],pos[2])
	mSleep(5)
	touchUp(1,pos[1],pos[2])
end
function untild(pos,p)
	while iscolor(pos,p)==false do
	end
	but(pos)
	but(pos)
end
function typexie(x)
	if iscolor(XY[Devtype][x][1],4) and iscolor(XY[Devtype][x][2],4) and iscolor(XY[Devtype][x][3],4) and iscolor(XY[Devtype][x][4],4) then
		if x==6 then
			if iscolor(XY[Devtype][61][1],4) and iscolor(XY[Devtype][61][2],4) and iscolor(XY[Devtype][61][3],4) and iscolor(XY[Devtype][61][4],4) then
				return true
				else
				return false;
			end
		end
		return true;
		else
		return false;
	end
end
function Split(szFullString, szSeparator)
local nFindStartIndex = 1
local nSplitIndex = 1
local nSplitArray = {}
while true do
   local nFindLastIndex = string.find(szFullString, szSeparator, nFindStartIndex)
   if not nFindLastIndex then
    nSplitArray[nSplitIndex] = string.sub(szFullString, nFindStartIndex, string.len(szFullString))
    break
   end
   nSplitArray[nSplitIndex] = string.sub(szFullString, nFindStartIndex, nFindLastIndex - 1)
   nFindStartIndex = nFindLastIndex + string.len(szSeparator)
   nSplitIndex = nSplitIndex + 1
end
return nSplitArray
end
--------------------------------------------------
UI = [[
{
  "style": "default",
  "width": ]]..width..[[,
  "height": ]]..height..[[,
  "config": "AA_Driver.dat",
  "timer": 60,
  "cancelname": "取消",
  "okname": "开始接单",
  "views": [
    {
      "type": "Label",
      "text": "AA司机端自动抢单",
      "size": 25,
      "align": "center",
      "color": "0,0,255"
    },
    {
      "type": "Label",
      "text": "接单类型",
      "size": 15,
      "align": "left",
      "color": "0,0,0"
    },
    {
      "type": "CheckBoxGroup",
      "list": "豪华型,舒适型,经济型",
      "select": "0@1@2"
    },
	{
      "type": "Label",
      "text": "订单类型",
      "size": 15,
      "align": "left",
      "color": "0,0,0"
    },
    {
      "type": "CheckBoxGroup",
      "list": "携程北京接机,携程北京送机,北京接机服务,北京送机服务,北京半日租,北京日租,分级订单",
      "select": "0@1@2@3"
    },
	{
      "type": "Label",
      "text": "其他设置",
      "size": 15,
      "align": "left",
      "color": "0,0,0"
    },
    {
      "type": "CheckBoxGroup",
      "list": "自动拒绝不符合订单",
      "select": "0"
    },
	{
      "type": "Label",
      "text": "目前订单类型只有以上五种选择,没选中的订单或其他类型订单,均不接单",
      "size": 15,
      "align": "left",
      "color": "255,0,0"
    },
	{
      "type": "Label",
      "text": "注意：运行脚本过程中,不可打开其他应用！",
      "size": 15,
      "align": "center",
      "color": "0,255,0"
    }
  ]
}
]]
ret,choicetype,choicexie,choicequxiao= showUI(UI);
if ret==0 then
	lua_exit()
end
--------------------------------------------------
XY={}
XY[1]={}
XY[1]['type']={}
XY[1]['type'][2]={
	{  496,  196, 0x8bc21c},
	{  523,  202, 0x8fc324},
	{  532,  219, 0xc1de85},
}
XY[1]['type'][1]={
	{  496,  196, 0xebf4d8},
	{  523,  202, 0xffffff},
	{  532,  219, 0xa2ce4a},
}
XY[1]['type'][0]={
	{  496,  196, 0xa8d155},
	{  523,  202, 0x9bc93c},
	{  532,  219, 0xffffff},
}
XY[1]['抢']={  373, 1025, 0x7eba03 }
XY[1]['放弃订单']={  127, 1087, 0x192638 }
XY[1]['确认放弃']={  454,  655, 0xffffff }
XY[1]['标识']={       553,  195, 0xcbe49a   }
XY[1]['特殊返回']={     86,   77, 0x7eba03  }
XY[1]['返回']={      44,   81, 0xfefefe  }
XY[1]['新订单']={    241, 1054, 0x7eba03   }




XY[1][0]={      --携程北京接机
	{  129,  192, 0x9a9a9a},
	{  205,  194, 0xe2e2e2},
	{  296,  193, 0xd5d5d5},
	{  326,  184, 0xbebebe},
}
XY[1][1]={      --携程北京送机
	{  129,  192, 0x9a9a9a},
	{  205,  194, 0xe2e2e2},
	{  296,  184, 0xc8c8c8},
	{  326,  184, 0xbebebe},
}
XY[1][2]={    --北京接机服务
	{  129,  194, 0xe2e2e2},
	{  177,  208, 0xd2d2d2},
	{  212,  199, 0xd8d8d8},
	{  235,  218, 0xbfbfbf},
}
XY[1][3]={     --北京送机服务
	{  129,  194, 0xe2e2e2},
	{  177,  208, 0xd2d2d2},
	{  218,  202, 0xdcdcdc},
	{  230,  214, 0xbdbdbd},
}
XY[1][4]={    --北京半日租
	{  129,  194, 0xe2e2e2},
	{  211,  193, 0xc5c5c5},
	{  232,  205, 0xeaeaea},
	{  281,  191, 0xd7d7d7},
}
XY[1][5]={    --北京日租
	{  129,  194, 0xe2e2e2},
	{  209,  189, 0x888888},
	{  253,  201, 0x999999},
	{  175,  199, 0xadadad},
}
XY[1][6]={    --分级订单
	{  139,  185, 0x686868},
	{  185,  200, 0xa1a1a1},
	{  229,  187, 0xdadada},
	{  266,  188, 0xafafaf},
}
XY[1][61]={    --分级订单
	{  139,  185, 0x686868},
	{  185,  200, 0xa1a1a1},
	{  229,  187, 0xdadada},
	{  266,  188, 0xafafaf},
}
XY[1][61]={    --分级订单验证
	{  132,  371, 0xe3e3e3},
	{  252,  369, 0xc3c3c3},
	{  356,  373, 0xbbbbbb},
	{  459,  390, 0xbebebe},
}
-------------------------------------------------
function checktype()
	local p
	xtype = Split(choicetype,"@")
	for x=1,#xtype do
		p=true
		for i=1,3 do
			if iscolor(XY[Devtype]['type'][tonumber(xtype[x])][i],3)==false then
				p=false
				break
			end
		end
		if p then
			return true;
		end
	end
	return false;
end
function checkxie()
	local p
	xxie = Split(choicexie,"@")
	for x=1,#xxie do
		if typexie(tonumber(xxie[x])) then
			return true;
		end
	end
	return false;
end

while (true) do
	if iscolor(XY[Devtype]['标识'],5) and iscolor(XY[Devtype]['新订单'],5) then
		ptype = checktype()
		pxie = checkxie()
		but(XY[Devtype]['标识'])
		while iscolor(XY[Devtype]['抢'],3)==false do
			but(XY[Devtype]['标识'])
		end
		if ptype and pxie then
			but(XY[Devtype]['抢'])
			while iscolor(XY[Devtype]['抢'],3) do
				but(XY[Devtype]['抢'])
			end
			else
			if choicequxiao == "0" then
				but(XY[Devtype]['放弃订单'])
				mSleep(10)
				but(XY[Devtype]['确认放弃'])
				mSleep(500)
				while iscolor(XY[Devtype]['抢'],3) do
					but(XY[Devtype]['返回'])
				end
			end
		end
	end
	if iscolor(XY[Devtype]['特殊返回'],5) then
		but(XY[Devtype]['特殊返回'])
	end
end
```

这个脚本，让我有了第一笔收入，成就感也爆棚，也许我还小，当年的我开心的跟花儿一样….

![](https://files.timlau.me/blog/images/202404072255369.webp)

## 逐步尝试去了解新事物 —— .NET

因为中考发挥一般，进了一个我们市里比较中上的高中，但是这所高中特色他主打的并不是软件编程方面的，而是做与飞行器有关，比如做飞机模型等。这并不是我喜欢的类型，所以我并没有加入到那边的培训中。在寒暑假时间，我便继续利用触动精灵去找我一些外快，在高中学习期间，几乎都这么过了，除了学习还是学习。

高一期间，我又一次偶然的机会，了解到了C#，它的编程方式和编程语法深深吸引了我，很优雅。因为在此之前，我是使用过 java 开发 Android Application 一段时间（时间问题，不在这里详细描述了），相比与 Java，C#的确大大的提高了编程的效率。我第一次了解到了WinForms，因为当年还没认识到互联网的强大（很懵懂），所以没有去搞 web 开发。在那期间，我跟桌面应用相依为命，高中就这样了。

直至到了大学，发现了大学里有一个比较严重的问题，学校素拓分数管理的那方面非常的不人性化，人工填写、人工打表、人工审核、人工盖章，这一些操作让我觉得不是那么的与现代接轨，现在都是主打无纸化、简洁化、便捷化，我就产生了做一个素拓管理的一套系统，但是整套系统的客户端是基于 WinForms，历经几个月，最最最雏形的东西做出来给大学的老师看了一眼，马上得知，这套系统用 WinForms 开发其实弊端很多，首先不能兼容每个用户的使用最为致命，比如需要安装 .net framework，比如不能跨操作系统使用等问题。

## 现在

现在…。毕竟我大学里选的是非计算机专业，学计算机知识完全靠自学。我只是怀着这一份热爱编程在坚持，它能带给我成就感甚至快乐。所以我想在这里做一些交流，或者分享我的一些知识与技巧也好，经此而已。但是编程的路肯定会走到尽头，不会放弃。

其实还有挺多东西要写的关于我的经历，也许我的经历对你没有任何帮助，但是不要紧，我只是想在这里，第一篇博客，记录我曾经的回忆。
