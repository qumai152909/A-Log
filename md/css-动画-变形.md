# transition 、 animation ：动画

都属于css3的动画；

都可以通过改变元素的属性，来实现动画效果；

transition: 支持从一个属性值平滑过渡到另一个属性值；

Animation: 支持通过设置关键帧，来产生复杂的动画效果。

# transition:

适用于所有元素，包括伪元素:before, :after;

也支持多组动画；

~~~css
语法：
transition: property duration timing-function delay

例如：
.img {
	position: relative;
	top: -400px;
}
.img {
	transition: top ease 1s;
}
.img.show {
	top: 20px
}
~~~

1，**属性名：property**：应用过渡效果的css属性名称。当这个属性发生改变时，会触发过渡效果，过渡动画开始执行，使元素从旧的属性值过渡到新的属性值。 若=all，则表示设置所有的css属性。

# animation

通过定义动画中的关键帧，来实现复杂的动画效果。

*属性*

 [`animation-name`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-name): @keyframes定义的名称（关键帧集合名词）

[`animation-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-duration)： 3s

 [`animation-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)： ease，linear;  cubic-bezier(0.1, 0.7, 1.0, 0.1); 

[`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)： 3s

[`animation-iteration-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-iteration-count)： number,  1， 2， infinite（无限循环）； 2, 0, infinite（多个值）;

[`animation-direction`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction): normal; reverse; alternate; alternate-reverse

[`animation-fill-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) ： both; forwards; backwards; none;

***

*属性解释：*

+ `animation-iteration-count` ：  定义动画运行的次数 ，可以是1次、无限循环

+ `animation-direction` CSS 属性指示动画是否反向播放

  >1， normal:
  >每个动画结束，动画重置到起点，重新开始   (默认)
  >
  >2， alternate:
  >
  >动画交替正反向运行,  交替更改动画的执行方向 （正向--反向--正向--反向--......）
  >
  >反向运行时，动画按步后退（正向：0% 100% ---- 反向：100% 0%）
  >
  >同时，带时间功能的函数也反向，比如，ease-in 在反向时成为ease-out
  >
  >3， reverse: 
  >
  >反向运行动画，和normal完全相反；每次都是反向执行
  >
  >4， alternate-reverse
  >
  >反向交替， 反向开始交替 (反向--正向--反向--正向......)
  >
  >动画第一次运行时是反向的，然后下一次是正向，后面依次循环

+ animation-fill-mode： 设置CSS动画，在执行之前和之后，如何将样式应用于其目标。

  >1, none:
  >
  >当动画未执行时，不会将任何动画样式应用于目标元素；
  >
  >而是使用，已经赋予给该元素的 CSS 规则来显示该元素。这是默认值。
  >
  >2， forwards:
  >
  >动画执行期间，遇到的最后一帧动画css，将会被保留在目标元素上
  >
  >3， backwards:
  >
  >动画集合里面，第一个关键帧中定义的css样式，会立即应用到目标元素上，并在[`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)期间保留此值。
  >
  >4， both:
  >
  >动画将遵循`forwards`和`backwards`的规则，从而在两个方向上扩展动画属性。

~~~css
@keyframes 关键帧集合名 { 创建关键帧的代码 }
// 开始帧0% 结束帧100%
~~~

# 反弹loading动画

*html:*

```html
<div class="bouncing-loader">
  <div></div>
  <div></div>
  <div></div>
</div>
```

*css:*

~~~css
@keyframes bouncing-loader {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0.1;
    transform: translateY(-1rem);
  }
}

.bouncing-loader {
  display: flex;
  justify-content: center;
}
.bouncing-loader > div {
  width: 1rem;
  height: 1rem;
  margin: 3rem 0.2rem;
  background: #8385aa;
  border-radius: 50%;
  animation: bouncing-loader 0.6s infinite alternate;
}
.bouncing-loader > div:nth-child(2) {
  animation-delay: 0.2s;
}
.bouncing-loader > div:nth-child(3) {
  animation-delay: 0.4s;
}
~~~

*链接：*

http://caibaojian.com/30-seconds-of-css/



# transform: 变形

**总结：**

scale,  translate,  rotate 是transform的部分属性；

**transform基本概念:**

transform字面上就是变形，改变，转换的意思。

语法：

~~~
   transform: rotate | scale | skew | translate |matrix;
~~~

[css3](http://caibaojian.com/t/css3) [transform](http://caibaojian.com/t/transform)里面有一个属性**transform-origin**(http://caibaojian.com/t/transform)，该属性可以改变元素的原点位置，

默认，*变形的原点在元素的中心点*。

###translate:

translate: 移动，他的作用很简单，就是平移，参考自己的位置来平移。

通过矢量[tx, ty]指定一个2D translation(2D 位移)。

跟relative的属性有点像。

~~~css
用法: 	transform: translate(50px, 100px);
~~~

参数表示移动距离，单位px，

- 一个参数时：表示水平方向的移动距离；
- 两个参数时：第一个参数表示**水平方向**的移动距离，第二个参数表示**垂直方向**的移动距离。
- translateX[水平移动体验 ](http://www.w3school.com.cn/tiy/c.asp?f=css_transform_translatex)  translateY[竖直移动体验](http://www.w3school.com.cn/tiy/c.asp?f=css_transform_translatey)  ， translateZ()， translate3d()
- 其基点默认为*元素中心点*，

>注意：为什么有时候⼈们⽤translate来改变位置⽽不是定位？
>
>translate()是transform的⼀个值。改变transform或opacity不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。
>
>⽽改变绝对定位会触发重新布局，进⽽触发重绘和复合。
>
>transform使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使⽤到 CPU。 因此translate()更⾼效，可以缩短平滑动画的绘制时间。
>
>⽽translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发⽣这种情况。

***

###旋转 -- rotate:

通过指定的角度参数对元素进行顺时针或逆时针的旋转。（2D 旋转）。

~~~
transform: rotate(45deg);
~~~

一个参数“角度”，单位deg为度的意思，正数为顺时针旋转，负数为逆时针旋转，上述代码作用是顺时针旋转45度。

*rotate()默认旋转中心为图片的中点*（旋转的基点）

###缩放 scale

定义元素的缩放转换；将元素按照指定的比例进行放大和缩小。

~~~css
用法：transform: scale(0.5)  或者  transform: scale(0.5, 2);
~~~

参数表示缩放倍数；

- 一个参数时：表示水平和垂直同时缩放该倍率
- 两个参数时：第一个参数指定水平方向的缩放倍率，第二个参数指定垂直方向的缩放倍率。
- 以盒模型中心为参考点，进行缩放











