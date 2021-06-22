# position--定位

- position:relative | absolute | fixed | static | inherit; （5个）
- position: static;  默认值
- position: inherit;  从父元素继承定位属性的值

# static

默认值，元素将按照正常文档流规则排列。

如果省略`position`属性，浏览器就认为该元素是`static`定位。

# relative

相对定位；相对于默认位置（即`static`时的位置）进行偏移；

因为**原来占据的空间不变**，所以平移后会遮挡其他元素。

***

元素仍然处于正常文档流当中，

+ 不影响元素本身的特性；

- 不使元素脱离文档流；
- 如果没有设置偏移量，对元素本身没有任何影响；

位置控制：

   + top/right/bottom/left  ：  定位元素偏移量。

*注意：*

	+ 元素原来位置将保留，不被其他元素所占据;
	+ 当使用left，top改变元素位置时，元素将以【原来位置】的border外边框的*左上角*作为参考点 ;
	+ 当使用right、top时改变元素位置时，元素将以原来位置的border外边框的右上角作为参考点 ;
	+ 当使用left、bottom时改变元素位置时，元素将以原来位置的border外边框的左下角作为参考点 ;
	+ 当使用right、bottom时改变元素位置时，元素将以原来位置的border外边框的右下角作为参考点 ;
	+ 当使用left时，会向右偏移，参考点：左部

# absolute 绝对定位

**相对于设置了position:relative/fixed/absolute的祖先元素，来定位。**

绝对定位元素的包含块是距离他最近的定位祖先，也就是`position`值为`static`之外任意祖先元素。

如果找不到这样一个定位祖先，那么它就是相对于**文档的根元素**进行定位的。

***

- 使元素完全脱离文档流；原始位置不存在了。
- 块属性标签内容撑开宽度；？？？
- 如果有定位父级，相对于定位父级发生偏移（top, left, bottom ,right ），如果没有定位父级相对于整个文档发生偏移；
- 相对定位一般都是配合绝对定位使用的；
- margins 仍会影响定位的元素。 然而margin collapsing不会。

***

*注意：*

​	当使用left，top改变元素位置时，元素将以X的左上角或作为参考点 ; （X=定位父级）

​	z-index:number; 定位层级

- 定位层级越大，元素显示越靠前；
- 定位元素， 默认层级后者比前者高

# position:fixed  固定定位

与绝对定位的特性基本一致，*差别*是始终相对于**屏幕视⼝（viewport）**的位置来指定元素位置。

元素脱离正常文档流，可通过left、top、right和bottom的CSS规则来改变元素的位置

 注意点：

 + 1, 元素将不再占据原有位置;
 + 2, 以浏览器的*可视区域*的四角作为参考点。
 + 3, IE5.5~6不支持该属性值。

# sticky 粘性

一个sticky元素会“固定”在离它最近的一个拥有“滚动机制”的祖先元素上

```html
<div class="container">
    <div class="sticky-box">内容1</div>
    <div class="sticky-box">内容2</div>
    <div class="sticky-box">内容3</div>
    <div class="sticky-box">内容4</div>
</div>
```

```css
.container {
    background: #eee;
    width: 600px;
    height: 1000px;
    margin: 0 auto;
}

.sticky-box {
    position: -webkit-sticky;
    position: sticky;
    height: 60px;
    margin-bottom: 30px;
    background: #ff7300;
    top: 0px;
}

div {
    font-size: 30px;
    text-align: center;
    color: #fff;
    line-height: 60px;
}
```

简单描述下生效过程，因为设定的阈值是 `top:0` ，这个值表示当元素距离页面视口（Viewport，也就是fixed定位的参照）顶部距离大于 0px 时，元素以 relative 定位表现，而当元素距离页面视口小于 0px 时，元素表现为 fixed 定位，也就会固定在顶部。

https://www.cnblogs.com/coco1s/p/6402723.html

## 生效规则

`position:sticky` 的生效是有一定的限制的，总结如下：

1. 须指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。

   并且 `top` 和 `bottom` 同时设置时，`top` 生效的优先级高，`left` 和 `right` 同时设置时，`left` 的优先级高。

2. 设定为 `position:sticky` 元素的任意父节点的 overflow 属性必须是 visible，否则 `position:sticky` 不会生效。这里需要解释一下：

   - 如果 `position:sticky` 元素的任意父节点定位设置为 `overflow:hidden`，则父容器无法进行滚动，所以 `position:sticky` 元素也不会有滚动然后固定的情况。
   - 如果 `position:sticky` 元素的任意父节点定位设置为 `position:relative | absolute | fixed`，则元素相对父元素进行定位，而不会相对 viewprot 定位。

3. 达到设定的阀值。这个还算好理解，也就是设定了 `position:sticky` 的元素表现为 `relative` 还是 `fixed` 是根据元素是否达到设定了的阈值决定的。

## 常用场景：

1， 运用 `position:sticky` 实现导航栏固定；











