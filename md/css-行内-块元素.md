# 块，行内元素

### display: block;

block 元素独占一行，宽度沾满父元素宽度。可以设置 width, height, padding, margin 属性。

块级盒子(block)会沿垂直方向堆叠，盒子在垂直方向上的间距由他们的上、下外边距（margin）决定。

### display: inline

**inline 元素不换行，宽度由其内容决定。设置 width, height 无效。**如 span em strong 等。

行内盒子是沿文本流水平排列的，也会随文本换行而换行。

它们之间的**水平间距**可以通过水平方向的内边距(padding)、边框和外边距(margin)来调节。但是， 垂直方向的 padding，margin无效。

【但是行内盒子的高度不受其垂直方向上的内边距、边框和外边距的影响**，**且给行内盒子显示地设置宽高也不会起作用。】

修改行内盒子高度的唯一方式是修改行高`line-height`。

### display: inline-block;

inline-block 元素不换行，设置 width, height, padding, margin 属性有效。 

【让元素像行内元素一样水平的依次排列。但是，能够显示地设置宽度，高度，内外边距。】

由于 inline-block 元素会产生新的 BFC，因此可以包含浮动。