块格式化上下文（Block Formatting Context，BFC）

是块盒子在布局过程中发生的区域, 是一个独立的渲染区域（只有块box参与）

它是块盒子在页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的交互和作用；

块格式化上下文：包含创建它的元素内部的所有内容

# 特征

浮动定位和清除浮动时只会应用于同一个BFC内的元素。

浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。

1. 外边距折叠（[Margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)）也只会发生在同一BFC内的元素之间，不同BFC不会发生折叠。
2. *BFC的区域不会与float box重叠*。
3. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
4. **计算BFC的高度时，浮动元素也参与计算**

# 注意

一个BFC的范围包含创建该上下文元素的所有子元素，但**不包括**创建了*新BFC*的子元素的内部元素。

这从另一方角度说明，一个元素不能同时存在于两个BFC中。

# 作用

1自适应两栏布局
2可以阻止元素被浮动元素覆盖
3可以包含浮动元素——清除内部浮动
4.分属于不同的BFC时可以阻止margin重叠



# 创建块格式化上下文

下列方式会创建**块格式化上下文**： 

- 根元素（`<html>）`
- 浮动元素（ [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 不是 `none`）
- 绝对定位元素（ [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 为 `absolute` 或 `fixed`）
- 行内块元素（ [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `inline-block`）
- [`overflow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow) 不为 `visible` 的块元素，为 `auto`、`scroll`、`hidden`
- 弹性元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `flex` 或 `inline-flex `元素的直接子元素）
- 网格元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `grid` 或 `inline-grid` 元素的直接子元素）



# float 文字环绕

float 属性定义元素在哪个方向浮动。

**以往这个属性总应用于图像，使文本围绕在图像周围，**(***浮动出现的意义其实只是用来让文字环绕图片而已，仅此而已。***)

不过在 CSS 中，任何元素都可以浮动。浮动元素会生成一个块级框，而不论它本身是何种元素。

浮动的本质为“包裹与破坏”！

#### 特征

包裹性； 

高度塌陷；

形成BFC；

没有任何margin合并；

#### 为什么？

既然浮动元素脱离了文档流，为什么文字会环绕在浮动元素的周边而不是跟浮动元素重合呢？



为了明白这个问题，必须先弄明白几个问题：

第一，浮动的目的。最初时，浮动只能用于图像，目的就是为了允许其他内容（如文本）“围绕”该图像。而后来的CSS允许浮动任何元素。

第二，绝对定位与浮动的区别。

绝对定位是将元素彻底从文档流删除，并相对于其包含块定位，元素原先在正常文档流中所占的空间会关闭，就好像该元素原来不存在一样，该元素再也不会影响其他元素的布局了。

而浮动，会以某种方式将浮动元素从文档的正常流中删除，并把浮动元素向左边和右边浮动，不过它还是会影响布局，这种影响源自于这样一个事实：一个元素浮动时，其他内容会“环绕”该元素。

而这种环绕的实质，个人认为是避免一个元素的内容被浮动的元素覆盖掉。而这个人认为，也就是浮动和绝对定位的本质区别。

#### 浮动布局

https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Floats

# demo

## 阻止相邻元素的margin合并

属于同一个BFC的、两个相邻、块级子元素的、上下、margin会发生重叠;

所以当两个相邻块级子元素，分属于不同的BFC时可以阻止margin重叠。

***

那么，怎样阻止margin重叠呢？？？

当两个相邻块级子元素**分属于不同的BFC**时可以**阻止margin重叠**

**操作方法：**给其中一个div外面包一个div，然后通过触发外面这个div的BFC，就可以阻止这两个div的margin重叠

~~~html
  <style>
    .show-body {
      border: 1px solid black;
      border-radius: 5px;
      background: pink;
      position: relative;
    }
  </style>

<div class="show-body">
  <div style="background-color: rgba(0,255,0,0.5);width: 260px;height:50px;margin-bottom:10px;">
    块级盒子一的下外边距为10px
  </div>
  
  <!-- 给其中一个div外面包一个div，然后通过触发外面这个div的BFC，就可以阻止这两个div的margin重叠 -->
  <div style="overflow: scroll;">
    <div style="background-color: rgba(255,0,0,0.5);width: 260px;height:50px;margin-top:10px;">
      块级盒子二的上外边距为10px
    </div>
  </div>
</div>
~~~



## 清除空格

　“清空格”这一特性的根本原因是由于float会导致节点脱离文档流结构。它都不属于文档流结构了，那么它身边的什么换行、空格就都和它没关系的，它就尽量的往一边去靠拢，能靠多近就靠多近，这就是清空格的本质。



## 计算BFC高度时浮动元素也参于计算 ?

当父元素`.outside`没有设置高度且子元素`.inside`都浮动时，父元素`.outside`会出现高度塌陷。

**原因：**
子元素`.inside`设置浮动后脱离文档流，而父元素`.outside`又没有设置高度，故父元素`.outside`会出现高度塌陷。

**解决方法：**给父元素`.outside`添加声明`overflow: hidden;`，父元素高度塌陷消失。

**原因：**
给父元素`.outside`添加声明`overflow: hidden;`，使得父元素`.outside`触发了BFC，

而BFC特性规定“计算BFC高度时浮动元素也参于计算”，此时子元素`.inside`虽然设置了浮动，但其高度仍计算至父元素内，从而解决了高度塌陷问题

~~~html
  <style>
    .outside{
      border: 10px solid blue;
      overflow: auto; /* 解决高度塌陷 */
    }
    .inside{
      width: 200px;
      height: 200px;
      background: yellowgreen;
      float: left;
    }
  </style>
  
</head>
<body>

  <div class="outside">
    <div class="inside"></div>
  </div>

</body>
~~~





# 清除浮动

1. 为父元素添加overflow:hidden　： 这样父元素就有高度了 ，父元素的高度便不会被破坏；

2. 浮动父元素

3. clear:both这个东西。在所有浮动元素下方添加一个clear:both的元素

4. clearfix: 

   ~~~html
   <style>
    	.clearfix:after {	
         content: '';
         display: table;
         clear: both;
   	}
   </style>
   
   <div class="clearfix">
     <img src="image/1.png" style="float: left;" >
     <img src="image/2.png" style="float: left;" >
   </div>
   
   ~~~

   上图中，我们定义一个.clearfix类，然后对float元素的父元素应用这一样式即可;

   **究其原理，其实就是通过伪元素选择器，在div后面增加了一个clear:both的元素，跟第三种方法是一个道理。**



# 文档流

在解释BFC之前，先说一下文档流。我们常说的文档流其实分为**定位流**、**浮动流**、**普通流**三种。

而普通流其实就是指BFC中的FC。FC(Formatting Context)，直译过来是格式化上下文，*它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。*常见的FC有BFC、IFC，还有GFC和FFC。

## 普通流的定位规则

- 在常规流中，盒一个接着一个排列;
- 在块级格式化上下文里面， 它们竖着排列；
- 在行内格式化上下文里面， 它们横着排列;
- 当position为static或relative，并且float为none时会触发常规流；
- 对于静态定位(static positioning)，position: static，盒的位置是常规流布局里的位置；
- 对于相对定位(relative positioning)，position: relative，盒偏移位置由top、bottom、left、right属性定义。即使有偏移，仍然保留原有的位置，其它常规流不能占用这个位置。

## 浮动流定位规则

- 左浮动元素尽量靠左、靠上，右浮动同理
- 这导致常规流环绕在它的周边，除非设置 clear 属性
- 浮动元素不会影响*块级元素*的布局
- **但浮动元素会影响行内元素的布局**，让其围绕在自己周围，撑大父级元素，从而间接影响块级元素布局
- 最高点不会超过当前行的最高点、它前面的浮动元素的最高点
- 不超过它的包含块，除非元素本身已经比包含块更宽
- 行内元素出现在左浮动元素的右边和右浮动元素的左边，左浮动元素的左边和右浮动元素的右边是不会摆放浮动元素的

## 绝对定位规则

- 绝对定位方案，盒从常规流中被移除，不影响常规流的布局；
- 它的定位相对于它的包含块，相关CSS属性：top、bottom、left、right；
- 如果元素的属性position为absolute或fixed，它是绝对定位元素；
- 对于position: absolute，元素定位将相对于上级元素中最近的一个relative、fixed、absolute，如果没有则相对于body；





