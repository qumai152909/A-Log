https://css-tricks.com/almanac/properties/b/background-attachment/

## background

~~~
background: background-color background-image background-repeat background-position background-attachment
~~~

+ background-img: url(xxx) 、 none;
+ background-color
+ Background-repeat： repeat-x [|](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Value_definition_syntax#single_bar) repeat-y [|][repeat ] [repeat | no-repeat | space | round]
+ Background-position: left center; 	//背景图像的位置;  像素单位和百分数单位含义不一样。
+ background-attachment :   scroll [|](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Value_definition_syntax#single_bar) fixed [|](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Value_definition_syntax#single_bar) local
+ background-size： cover 、 contain、 auto或者百分数（二选一）
+ background-origin
+ background-clip

### 规则

+ 1，bg-size只能紧跟在bg-position后面，用‘/’分割，bg-position/bg-size,   例如： “center / 80%”
+ 2,  

### bg-position

通过bg-position可以移动背景图片的位置；

值有三种格式：

~~~
Length values (例如 100px 5px) // 第一个值是水平位移位置；第二个是垂直方向的；
Percentages (例如 100% 5%)
Keywords (例如 top right)
~~~

Length values: 如果只有一个值，这一个值代表水平方向的位移；垂直方向默认center；

background-position: right 45px bottom 20px; 四个值：`45px` from the right and `20px` from the bottom。

***

⚠️： 位移时的参照物：

top： 将背景图片的上边界与背景位置层的上边界对齐.

center = 50%： 将背景图片的中线与背景区域的中线对齐.

bottom = y-100%： 将背景图片的下边界与背景位置层的下边界对齐.

### bg-size

~~~css
html {
  background: url(greatimage.jpg);
  background-size: 300px 100px;
}
~~~

**cover:  **使图片永远填充满背景区域；可能无法看清楚图片全貌；

**contain**: 是图片显示完全；有的背景区域会没有背景图片。

**一个值：**： background-size: 400px; width是400px， height是auto；



### bg-origin

定义了背景图片的绘制区域是什么；是仅在元素内容区域，还是包括padding区域、border区域？

4个值： border-box, content-box, padding-box, inherit;

content-box: 背景进填充内容区域，padding、border区域无背景；

border-box： border区域，也会被背景填充。

~~~css
div {
  background-image: url('logo.jpg'), url('mainback.png');
  background-position: top right, 0px 0px;
  background-origin: content-box, padding-box;
}
~~~

注意：当使用 [`background-attachment`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment) 为fixed时，该属性将被忽略，不起作用。

bg-origin和bg-clip类似，区别是origin为缩放图片的尺寸，clip是剪裁图片。

https://css-tricks.com/almanac/properties/b/background-origin/

### bg-attachment

相对于viewport，如何移动背景图片；值： fixed， scroll（默认值）， local；

scroll： 随着view滚动而滚动，但是**在所属元素区域内，位置固定不变， 而不是随着它的内容滚动**。

local： 如果一个元素拥有滚动机制，背景将会随着元素的内容滚动。

fixed： 图片位置相对于视口，一直是固定的。



***

示例：

~~~css
.pic{
  width: 300px;
  height: 400px;
  border: 20px dashed aqua;
  padding: 30px;
  /* 
  background-color: #f90;
  background-image: url(https://timgsa.baidu.com/timgimage&F8i%2Fzu%2FQJ6411171137.jpg);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-attachment: fixed; 
  */

  background: #f90 url(xxx) no-repeat 50% 50% fixed;
  
  background-size: 100px 100px;
  background-origin: border-box;
  background-clip: content-box;
}

//
p {
  background: content-box radial-gradient(crimson, skyblue);
}
p {
  background: left 5% / 15% 60% repeat-x url("../../media/examples/star.png");
}
// 指定多个背景层时，使用逗号分隔每个背景层
p {
  background: center / contain no-repeat url("../firefox-logo.svg"),
            #eee 35% url("../lizard.png");
} 
~~~

