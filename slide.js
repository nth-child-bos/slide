// 插件核心： 只要你设置最外层盒子的宽度，内部自适应。write less do more,能省则省略

(function (window) {
	// 轮播图插件对象
	function Slide () {
		 this.ele = {} // dom元素
		 this.params = {} // 所有控制参数
	}
	Slide.prototype.init = function (obj) {
		// 接收参数
		this.getParams(obj)
		// 获取元素
		this.getElements()
		// 设置焦点索引属性
		this.setPonitIndex()
		// 给焦点自定义索引属性
		this.setPointActive()
		// 设置图片宽高
		this.setImgWH()
		// 图片水平排列
		this.arrangeImg()
		// 添加首位图片
		this.copyImgLi()
		// 注册切换下一张和上一张事件
		this.toggleOnePicEvent()
		// 注册切焦点事件
		this.pointToggleEvent()
		// 开启自动播放
		this.params.autoPlay && this.autoPlaySlide()
		// 开启暂停播放效果
		this.params.mouseOverStop && this.mouseOverStop()
	}
	// 接收参数
	Slide.prototype.getParams = function (params) {
		this.params = JSON.parse(JSON.stringify(params))
	}

	// 获取元素
	Slide.prototype.getElements = function () {
		this.ele.boxEle = document.querySelector(this.params.box) // 父盒子
		this.ele.slideImgEle = this.ele.boxEle.querySelector('.slideImg') // 轮播图片盒子 
		this.ele.ImgUlEle = this.ele.slideImgEle.querySelector('ul') // 图片ul
		this.ele.ImgLiEles = this.ele.ImgUlEle.querySelectorAll('li') // 图片li
		this.ele.ImgEles = this.ele.ImgUlEle.querySelectorAll('img') // 图片img
		this.ele.prevEle = this.ele.boxEle.querySelector('.prev') // 上一张按钮
		this.ele.nextEle = this.ele.boxEle.querySelector('.next') // 下一张按钮
		this.ele.pointBox = this.ele.boxEle.querySelector('.slidePoint') // 焦点盒子
		this.ele.pointUlEle = this.ele.pointBox.querySelector('ul') // 焦点ul
		this.ele.pointLiEles = this.ele.pointUlEle.querySelectorAll('li') // 焦点li
		this.params.amount = this.ele.ImgEles.length // 显示的图片张数 (可用于自定义张数)
		this.params.index = 1 // 当前索引，第n张图片
	}
	// 给焦点自定义索引属性
	Slide.prototype.setPonitIndex = function () {
		this.ele.pointLiEles.forEach(function (item, i) {
			item.setAttribute('data-index', i)
		})
	}
	// 根据索引给point设置样式
	Slide.prototype.setPointActive = 	function () {
		var that = this
		this.ele.pointLiEles.forEach(function (item, i) {
			item.className = item.className.replace(/(active| active)/, '')
			if (i==(that.params.index-1)) {
				item.className += ' active'
			}
		})
		if (this.params.index == this.params.amount +1 ) {
			this.ele.pointLiEles[0].className += ' active'
		}
	}
	// 根据盒子宽度设置图片宽度 // 根据盒子高度设置图片高度（有高则高，无高则auto）注意：盒子没高度也会被撑开，传参吧
	Slide.prototype.setImgWH = function () {
		var boxEle = this.ele.boxEle
		this.params.imgW = boxEle.currentStyle? boxEle.currentStyle.width: getComputedStyle(boxEle,null).width
		this.params.imgH = boxEle.currentStyle? boxEle.currentStyle.height: getComputedStyle(boxEle,null).height
		this.params.width = this.params.imgW.replace('px', '')
		this.params.height = this.params.imgH.replace('px', '')
		this.ele.ImgEles.forEach( (item, index) =>{
			if (this.params.WHAuto) {
				item.style.width = '100%'
				item.style.height = 'auto'
			} else {
				item.style.width = this.params.imgW
				item.style.height = this.params.imgH
			}
			item.style.display = 'block'
		});
	}
	// 图片水平排列-设置ul宽度,li浮动
	Slide.prototype.arrangeImg = function () {
		if (this.params.WHAuto) {
			this.ele.ImgUlEle.style.width = (this.params.amount + 2)*100 + '%'
			this.ele.ImgLiEles.forEach((item, index)=>{
				item.style.width = 100/(this.params.amount + 2) + '%'
				item.style.float = 'left'
			});
			this.ele.ImgUlEle.style.marginLeft = '0%';
		} else {
			this.ele.ImgUlEle.style.width = (this.params.amount + 2)*this.params.width + 'px'
			// 设置所有li浮动
			this.ele.ImgLiEles.forEach((item, index)=>{
				item.style.float = 'left'
			});
			this.ele.ImgUlEle.style.marginLeft = '0px';
		}
	}
	// 图片组首尾补充节点
	Slide.prototype.copyImgLi = function (){
		this.ele.ImgUlEle.appendChild(this.ele.ImgLiEles[0].cloneNode(true))
		this.ele.ImgUlEle.insertBefore(this.ele.ImgLiEles[this.params.amount-1].cloneNode(true), this.ele.ImgLiEles[0])

		// 同时调整ul位置
		if (this.params.WHAuto) {
			this.ele.ImgUlEle.style.transform =' translateX(-'+100/(this.ele.amount+2)+'%)';
		} else {
			this.ele.ImgUlEle.style.transform =' translateX(-'+this.params.imgW+')';
		}
		
	}
	// 注册切换上一张和下一张事件
	Slide.prototype.toggleOnePicEvent = function () {
		if (this.params.trigger =='mouseover') {
			this.ele.nextEle.onmouseover = this.handleNextTiggle.bind(this)
			this.ele.prevEle.onmouseover = this.handlePrevToggle.bind(this)
		} else {
			this.ele.nextEle.onclick = this.handleNextTiggle.bind(this)
			this.ele.prevEle.onclick = this.handlePrevToggle.bind(this)
		}
	}
	// 注册焦点切换事件
	Slide.prototype.pointToggleEvent = function () {
		this.ele.pointLiEles.forEach( (item, i)=>{
			item.setAttribute('data-index', i)
			if (this.params.trigger == 'mouseover') {
				// console.log(this.params.trigger)
				item.onmouseover = this.handlePointToggle.bind(this, item.dataset.index)
			} else {
				item.onclick = this.handlePointToggle.bind(this, item.dataset.index)				
			}
		})
	}
	// 焦点切换事件函数
	Slide.prototype.handlePointToggle = function (i) {
		this.params.index = parseInt(i) + 1
		if (this.params.WHAuto) {
			this.params.positionX = this.ele.ImgUlEle.style.marginLeft.replace('%', '')
	 		this.animation2(this.ele.ImgUlEle, -100*(this.params.index-1))
	 	} else {
			this.params.positionX = this.ele.ImgUlEle.style.marginLeft.replace('px', '')
	 		this.animation(this.ele.ImgUlEle, -this.params.width*(this.params.index-1))
	 	}
	 	this.pointActive()	
	}
	// 上一张点击事件
	Slide.prototype.handlePrevToggle = function () {
		if (this.params.index > 1) {
				this.params.index--
				if (this.params.WHAuto) {
					// 标记当前位置
					this.params.positionX = this.ele.ImgUlEle.style.marginLeft.replace('%', '')
					this.animation2(this.ele.ImgUlEle, -100*(this.params.index-1))
				} else {
					// 标记当前位置
					this.params.positionX = this.ele.ImgUlEle.style.marginLeft.replace('px', '')
					this.animation(this.ele.ImgUlEle, -(this.params.index-1)*this.params.width)
				}
				this.pointActive()	
			} else {
				if (this.params.WHAuto) {
					this.ele.ImgUlEle.style.marginLeft = -this.params.amount*100 + '%'
				} else {
					this.ele.ImgUlEle.style.marginLeft = -this.params.amount*this.params.width + 'px'
				}
				this.params.index = this.params.amount + 1
				this.handlePrevToggle()
			}
	}
	// 下一张点击事件
	Slide.prototype.handleNextTiggle = function () {
		
		if (this.params.index <= this.params.amount) {
			if (this.params.WHAuto) {
				this.params.positionX = this.ele.ImgUlEle.style.marginLeft.replace('%', '')
				// var widthPercent = this.ele.ImgLiEles[0].style.width.replace('%', '')
				this.animation2(this.ele.ImgUlEle, -100*this.params.index)
			}else {
				this.params.positionX = this.ele.ImgUlEle.style.marginLeft.replace('px', '')
				this.animation(this.ele.ImgUlEle, -this.params.width*this.params.index)
			}
			this.params.index++
			this.pointActive()
		} else {
			if (this.params.WHAuto) {
				this.ele.ImgUlEle.style.marginLeft = '0%'
			} else {
				this.ele.ImgUlEle.style.marginLeft = '0px'
			}
			this.params.index = 1
			this.handleNextTiggle()
		}
	}
	
	// 设置活跃焦点样式
	Slide.prototype.pointActive =  function () {
		this.ele.pointLiEles.forEach((item, i)=>{
			item.className = item.className.replace(/(active| active)/, '')
			if (i==(this.params.index-1)) {
				item.className += ' active'
			}
		})
		if (this.params.index == this.params.amount +1 ) {
			this.ele.pointLiEles[0].className += ' active'
		}
	}
	// 自动轮播
	Slide.prototype.autoPlaySlide = function () {
		this.params.innerTime = this.params.innerTime?this.params.innerTime:2500
		this.ele.boxEle.autoTimeId = setInterval(()=>{
			this.handleNextTiggle()
		}, this.params.innerTime)
	}
	// 暂停播放效果
	Slide.prototype.mouseOverStop = function () {
		this.ele.boxEle.onmouseover = this.stopSlide.bind(this)
		this.ele.boxEle.onmouseleave = this.autoPlaySlide.bind(this)
	}
	Slide.prototype.stopSlide = function () {
		clearInterval(this.ele.boxEle.autoTimeId)
	}
	// 动画函数 //指定任意元素移动到任意位置margin-left
  Slide.prototype.animation =  function (element, target) {
  	  // 计算间隔时间
  	  var step = 10 //设置每次移动步数
  		var distant = Math.abs(this.params.positionX - target) // 总路程
  		var cishu = distant / step // 总次数
  		var intervalTime = this.params.delayTime / cishu // 间隔时间

      //定时器有则删除，无则创建(因为每次点击都是新的内存区域，因此正常拿不到局部变量)
      clearInterval(element.timeId);
      element.timeId = setInterval(()=>{
          //获取元素当前位置
          var currentX = element.style.marginLeft.replace('px', '');
          step = 10
          step = Math.abs(currentX) < Math.abs(target) ? step : -step;
          //移动元素
          currentX -= step;
          if (Math.abs(currentX - target) > Math.abs(step)) {
              element.style.marginLeft = currentX + "px";
          } else {
              element.style.marginLeft = target + "px";
              clearInterval(element.timeId)
          }
      }, intervalTime)
  }
  // 自适应时的动画函数
  Slide.prototype.animation2 =  function (element, target) {
  	  // 注意全用百分比计算
  	  // 计算间隔时间
  	  var step = 2 //设置每次移动步数
  		var distant = Math.abs(this.params.positionX - target) // 总路程
  		// console.log('distant--',distant)

  		var cishu = distant / step // 总次数
  		// console.log('cishu--',cishu)

  		var intervalTime = this.params.delayTime / cishu // 间隔时间
  		// console.log('intervalTime--',intervalTime)

      //定时器有则删除，无则创建(因为每次点击都是新的内存区域，因此正常拿不到局部变量)
      clearInterval(element.timeId);
      element.timeId = setInterval(()=>{
          //获取元素当前位置
          var currentX = element.style.marginLeft.replace('%', '');
          // console.log('currentX---', currentX)
          step = 2
          step = Math.abs(currentX) < Math.abs(target) ? step : -step;
          //移动元素
          currentX -= step;
          // console.log('target---', target)
          // console.log('step---', step)
          
          if (Math.abs(currentX - target) > Math.abs(step)) {
              element.style.marginLeft = currentX + "%";
          } else {
              element.style.marginLeft = target + "%";
              clearInterval(element.timeId)
          }
      }, intervalTime)
  }

	// 暴露插件对象
	window.Slide = Slide
})(window)		

