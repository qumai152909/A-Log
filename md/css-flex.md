https://css-tricks.com/snippets/css/a-guide-to-flexbox/

# 基本语法

~~~css
.container {
  display: flex; /* or inline-flex */
}

/* 主轴的方向 */
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}


.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}

.container {
  flex-flow: column wrap;
}

.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left;
}

.container {
  align-items: stretch | flex-start | flex-end | center | baseline | first baseline | last baseline | start | end | self-start;
}

~~~













