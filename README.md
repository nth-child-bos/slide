# silde轮播图插件

​    slide.js由原生js编写的无缝滚动轮播图脚本插件，支持固定宽高和自适应宽高两种形式，提供了部分常用控制参数。

------

#### 1. html结构

```
<div class="slideBox">
		<div class="slideImg">
			<ul>
				<li><a href="javascript:;"><img src="http://www.superslide2.com/demo/images/pic2.jpg" alt=""></a></li>
				<li><a href="javascript:;"><img src="http://www.superslide2.com/demo/images/pic2.jpg" alt=""></a></li>
				<li><a href="javascript:;"><img src="http://www.superslide2.com/demo/images/pic2.jpg" alt=""></a></li>
				<li><a href="javascript:;"><img src="http://www.superslide2.com/demo/images/pic2.jpg" alt=""></a></li>
				<li><a href="javascript:;"><img src="http://www.superslide2.com/demo/images/pic2.jpg" alt=""></a></li>
			</ul>
		</div>
		<div class="slidePoint">
			<ul>
				<li>1</li>
				<li>2</li>
				<li>3</li>
				<li>4</li>
				<li>5</li>
			</ul>
		</div>
		<a href="javascript:void(0);" class="prev"><</a>
		<a href="javascript:void(0);" class="next">></a>
	</div>
```

#### 2. 样式

固定宽高:

```
.slideBox {
    width: 30%;
    height: 240px;
    margin: 100px auto;
    border: 1px solid red;
    position: relative;
    overflow: hidden;
}
```

自适应：

```
.slideBox {
    width: 30%;
    margin: 100px auto;
    border: 1px solid red;
    position: relative;
    overflow: hidden;
}
```

插件控制了.slideImg内的所有样式，因此不必写图片和图片容器的样式，只需根据个人需求，调整焦点和切换按钮的样式。

#### 3.  启用脚本

```
<script src="slide.js"></script>
<script>
    var slide = new Slide()
    slide.init({
    box:　'.slideBox' 
    ,WHAuto: true // 是否宽高自适应
    ,delayTime: 500 // 动画完成耗费时间
    ,autoPlay: true // 自动轮播
    ,trigger: 'mouseover' // 触发事件
    ,mouseOverStop: true // 鼠标悬停时暂停播放
    ,innerTime: 2500 // 间隔时间
    })
</script>
```

