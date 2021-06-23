# 盒模型

页面中所有的元素都被看作一个矩形盒子，这个盒子包含元素的**内容、内边距、边框和外边距**。

盒模型是 CSS 的核心概念，描述了元素如何显示以及(在一定程度上)如何相互作用、相互影响。

*内容区*是元素内包含的内容所在区域。

*外边框*(margin)在边框的外侧，是围绕在盒子可见部分之外的透明区域，用于控制元素之间的距离。

*轮廓线*(outline)，这个属性会在边框盒子外围画出一条线，但这个线**不会影响盒子的布局，即不会影响盒子的宽高**，也不影响盒子大小



https://mp.weixin.qq.com/s?__biz=MzI4OTI0NDc2NQ==&mid=2247483722&idx=1&sn=88d8d76ed9e9279d39c57311a62f9137&chksm=ec335278db44db6e6b2e83b7be1d16989b02f412481af159e2b2584a88b7dc98ed81c21ebdca&token=666946662&lang=zh_CN#rd

# box-sizing

:定义了 [user agent](https://developer.mozilla.org/zh-CN/docs/Glossary/User_agent) 应该如何计算一个盒子的大小；

我们可以通过`box-sizing`属性来覆盖默认的盒子大小计算行为。

```css
box-sizing: content-box // 标准盒模型
box-sizing: border-box // 怪异盒模型
```

默认情况下，元素盒子的`width`和`height`指的是**内容区**的宽高。这时候添加边框和内边距并不会影响内容区域的大小，而是会导致**整个盒子**变大。

+ `box-sizing`的默认值时`content-box`，对应着盒模型大小的默认计算行为，会把宽度值应用给内容区。

  content-box表示width/heght不包括padding和border;

+ `box-sizing`还有另一个值`border-box`，`width`和`height`的计算会包括内边距（padding）和边框(border)。

>- ⚠️：
>- 不论是border-box还是content-box都不包括margin
>- 外边距（margin）一直不会算到宽高内，只会影响盒子在页面中占据的整体空间。

***

计算公式：

>1, box-sizing: border-box;
>
>width = 实际内容宽度 + padding + border
>
>*`height` = border + padding + 内容的高度*
>
>此时，计算width时，是将padding和border也计算进去的。
>
>2, box-sizing: content-box;
>
>默认值；
>
>width = 实际内容宽度；







































