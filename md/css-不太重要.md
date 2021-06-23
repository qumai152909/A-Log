不太重要的css

## box-shadow

Box-shadow: 垂直偏移 水平偏移  投影的宽度（模糊程度） 颜色

~~~ css
img {
	box-shadow: 3px 3px 6px #666;
} // 偏移3像素，宽度设置为6像素，颜色为灰色
~~~

## 超链接

*伪类：*

+ :link : 没有被访问过的链接
+ :visited 被访问过的链接
+ :hover 鼠标悬停时的链接（一般同时设置同样的focus和hover : a:hover, a:focus{ color: red }）
+ :active 被激活的元素（对于链接：点击的时候激活）
+ ：target

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



































