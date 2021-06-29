不太重要的css

## CSS3有哪些新特性

1. RGBA和透明度
2. word-wrap（对长的不可分割单词换行）word-wrap：break-word
3. 文字阴影;   text-shadow： 5px 5px 5px #FF0000;（水平阴影，垂直阴影，模糊距离，阴影颜色）
4. 圆角（边框半径）：border-radius 
5. 盒阴影：box-shadow: 10px 10px 5px #888888
6. 媒体查询：定义两套css，当浏览器的尺寸变化时会采用不同的属性



## 响应式设计🍓

响应式网站设计(Responsive Web design) ： 是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。

**基本原理**： 是通过媒体查询，检测不同的设备屏幕尺寸做相应处理。

页面头部必须有meta声明的viewport：

```html
<meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
```

>这段代码的意思是，让viewport的宽度等于物理设备上的真实分辨率，不允许用户缩放。
>
>一都主流的web app都是这么设置的，它的作用其实是故意舍弃viewport，不缩放页面，这样dpi肯定和设备上的真实分辨率是一样的，不做任何缩放，网页会因此显得更高细腻。

viewport: 适口

width=device-width： width控制 viewport 的大小,  device-width 为设备的宽度

initial-scale：初始缩放比例，也即是当页面第一次 load 的时候缩放比例。

maximum-scale：允许用户缩放到的最大比例。

minimum-scale：允许用户缩放到的最小比例。

user-scalable：用户是否可以手动缩放

### position:fixed;在android下无效怎么处理？

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
```





## 移动端用过媒体查询吗

通过媒体查询可以为不同大小和尺寸的媒体定义不同的css，适应相应的设备的显示。

~~~
1, <head>里边
<link rel="stylesheet" type="text/css" href="xxx.css" media="only screen and (max-device-width:480px)">

2, CSS : @media only screen and (max-device-width:480px) {/css样式/}
~~~



## box-shadow

Box-shadow: 垂直偏移 水平偏移  投影的宽度（模糊程度） 颜色

~~~ css
img {
	box-shadow: 3px 3px 6px #666;
}
// 偏移3像素，宽度设置为6像素，颜色为灰色
~~~

## 伪类

+ :link : 没有被访问过的链接
+ :visited 被访问过的链接
+ :hover 鼠标悬停时的链接（一般同时设置同样的focus和hover : a:hover, a:focus{ color: red }）
+ :active 被激活的元素（对于链接：点击的时候激活）
+ :disabled  表单控件的禁用状态 (css3)
+ :checked 单选框或复选框被选中。  (css3)
+ p:nth-child(2)  选择属于其父元素的第二个子元素  (css3)
+ p:only-child 选择属于其父元素的唯一子元素   (css3)
+ p:first-of-type 选择属于其父元素的首个元素
+ p:last-of-type 选择属于其父元素的最后元素

## css精灵🧚‍♀️🧚‍♂️

*定义*

雪碧图也叫CSS精灵， 是⼀CSS图像合成技术，开发⼈员往往**将⼩图标合并在⼀起之后的图⽚称作雪碧图**。

css精灵：就是许多不同的图标、按钮、图形合成的单个图像。

结合background-position使用，达到效果；

*完整定义：*

将多个图片合并到一个大图中去，然后利用background-position 属性进行背景定位。

*好处*

请求过多，会对站点的性能产生显著的影响；而把多个图像请求，转变为一个，从而减少请求数量 （**减少网页的http请求**）。

## 隐藏元素

opacity:0 ：本质上是将元素的透明度将为0，就看起来隐藏了，但是依然占据空间且可以交互

visibility:hidden : 与上⼀个⽅法类似的效果，占据空间，但是不可以交互了

overflow:hidden : 这个只隐藏元素溢出的部分，但是占据空间且不可交互

display:none : 这个是彻底隐藏了元素，元素从⽂档流中消失，既不占据空间也不交互，也不影响布局

z-index:-9999 : 原理是将层级放到底部，这样就被覆盖了，看起来隐藏了

transform: scale(0,0) : 平⾯变换，将元素缩放为0，但是依然占据空间，但不可交互

## 层叠上下文

层叠上下⽂是HTML元素的三维概念，这些HTML元素在⼀条假想的相对于⾯向（电脑屏幕的）视窗或者⽹⻚的⽤户的z轴上延伸，

**如何产⽣？**

触发以下任何一条条件则会产⽣层叠上下⽂：

- 根元素 (HTML),
- z-index 值不为 "auto"的 绝对/相对定位，
- ⼀个 z-index 值不为 "auto"的 flex 项⽬ (flex item)，即：⽗元素 display: flex|inline-flex，
- opacity 属性值⼩于 1 的元素（参考 the specification for opacity），
- transform 属性值不为 "none"的元素，
- filter值不为“none”的元素，
- perspective值不为“none”的元素，
- isolation 属性被设置为 "isolate"的元素，
- position: fixed
- -webkit-overflow-scrolling 属性被设置 "touch"的元素

## 媒体查询

*是什么*

媒体查询由⼀个可选的媒体类型和零个或多个使⽤媒体功能的限制了样式表范围的表达式组成，

添加⾃CSS3，允许内容的呈现针对⼀个特定范围的输出设备⽽进⾏设置，⽽不必改变内容本身,⾮常适合web⽹⻚应对不同型号的设备⽽做出对应的响应适配。

*如何使⽤？*

媒体查询包含⼀个可选的媒体类型和，满⾜CSS3规范的条件下，**包含零个或多个表达式**，这些表达式描述了媒体特征，最终会被解析为true或false。如果媒体查询中指定的媒体类型匹配展示⽂档所使⽤的**设备类型**，并且所有的表达式的值都是true，那么该媒体查询的结果为true.那么媒体查询内的样式将会⽣效。

```html
	<!-- link元素中的CSS媒体查询 -->
	<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />
	
	<!-- 样式表中的CSS媒体查询 -->
  <style>
    @media (max-width: 600px) {
      .facet_sidebar {
        display: none;
      }
    }
	</style>
```

## table

+ border-collapse:单元格的边框设置：collapse:共享边框。separate: 不共享边框；
+ ？？？

## CSS选择器有哪些

id选择器  (#myid)、

类选择器	(.myclassname)、

标签选择器	(div, h1, p)、

相邻选择器	(h1 + p)、

子选择器（ul > li）、

后代选择器（li a）、

通配符选择器（*）、

属性选择器（a[rel="external"]）、

**伪类选择器（a:hover, li:nth-child）**

### 哪些属性可以继承？

可继承的属性：font-size, font-family, color

不可继承的样式：border,  padding,  margin,  width,  height

## 元素竖向的百分比

**元素竖向的百分比设定是相对于容器的高度吗？**

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，

但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的*宽度*，而不是高度。

## 怎样解析CSS选择器?

**浏览器是怎样解析CSS选择器的？**

CSS选择器的解析是*从右向左*解析的。

若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。

若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。

两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。

































