

Object-fit and object-position 类似于 background-size and background-position

替换元素，替换内容：不同，<img>指的是替换元素，src指的是替换内容。

# object-fit

## 定义

object-fit 属性指定元素的内容，应该如何去适应容器的高度与宽度。

object-fit 一般用于 img 和 video 标签，一般可以对这些元素内容进行**保留原始比例的剪切、缩放**或者直接进行拉伸等。

## 语法

```
object-fit: fill|contain|cover|scale-down|none|initial|inherit;
```

## 值

| 值         | 描述                                                         |
| :--------- | :----------------------------------------------------------- |
| fill       | 默认，不保证保持原有的比例，内容拉伸填充整个内容容器。       |
| contain    | 保持原有尺寸比例。保证替换内容一定可以在容器里面放得下；内容可能被缩放，容器可能会有留白。 |
| cover      | 保持原有尺寸比例， 覆盖整个容器。但超出的部分可能被剪切。    |
| none       | 保留原有元素内容的长度和宽度，也就是说内容不会被改变。       |
| scale-down | 保持原有尺寸比例。内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。 |
| initial    | 设置为默认值，[关于 *initial*](https://www.runoob.com/cssref/css-initial.html) |
| inherit    | 从该元素的父元素继承属性。 [关于 *inherit*](https://www.runoob.com/cssref/css-inherit.html) |



## demo: 左右切换图片🍓🍓🍓

https://css-tricks.com/on-object-fit-and-object-position/

~~~html
<div class="svg left">
  <img class="svg__image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/14179/box.svg" alt="squares"/>
</div>
~~~

~~~scss
.svg {
  margin: 0 auto;
  height: 400px;
  width: 400px;
}

.svg__image {
  display: inline-block;
  transition: all .3s ease;
  width: 400px;
  height: 400px;
  
  object-fit: none;
  cursor: pointer;
  
  .left & {
    object-position: 0;
  }
  
  .middle & {
    object-position: 50%;
  }
  
  .right & {
    object-position: 100%;
  }
}
~~~

~~~js

~~~



## demo :对图片进行剪切

对图片进行剪切 , 保留原始比例：

~~~css
img.a {
  width: 200px;
  height: 400px;
  object-fit: cover;
}
~~~

# object-position

**含义： 控制替换内容位置的；**

默认值是`50% 50%`，也就是居中效果。

**注意：**
1、object-position属性与background-position很相似，其取值和background-position属性取值一样，但是它的默认值是50% 50%， background-position的默认值是0% 0%

2、如果仅指定了一个值，其他值将是50％

**总结**

这两个属性，主要是解决在布局时遇到的 尺寸 和 宽高比问题，说简单点就是处理图片会变形的问题，

而object-position默认值是 50% 50% ，就是居中的意思，也可以用这两个属性来做 *替换元素的内容*的**水平垂直居中**。









