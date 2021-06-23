## css单位🍎

+ px：绝对单位，
+ em：相对单位，相对于最近父级元素的font-size (如果⾃身定义了font-size，按⾃身来计算)
+ rem：相对单位，相对于根元素html的font-size，css3新增
+ vw、vh、vmin、vmax：相对单位，相对于视窗宽/高，css3新增

## rem: （font size of the root element）

比如我定义：

> ```css
> html{ font-size:14px}
> ```

那么如引用div设为2rem的话就相当于 2*14px。也就是

~~~css
.test-box {
        font-size:2rem;
       /*font-size:28px;*/ /*2*14px/
}
~~~

**我们可以理解为，一旦根节点html 定义的 font-size 变化，那么整个网页中运用到 rem的也会变化。**

## em:

```text
p { margin: 1em 0 }
```

表示段落上下留1em空白，则具体的p元素的字体大小如果是12px，留白也是12px，如果字体为16px，留白也是16px。

em在于它是相对于父元素的，要想整个页面实现响应式，可以只给body设置具体的字体大小，其他所有元素不设置具体px。

只通过改变body的字体大小一个值就修改了整个页面的各种宽度大小。





