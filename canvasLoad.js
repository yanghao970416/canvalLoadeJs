function water_moire(ids,info){
		var canvas =ids;
		var ctx  = canvas.getContext("2d");
		var Sin = Math.sin;
		var Cos = Math.cos;
		var Sqrt = Math.sqrt;
		var Pow = Math.pow;
		var PI = Math.PI;
		var Round = Math.round;
		if(info&&info.width){
			var oW = canvas.width = info.width;
		}else{
			var oW = canvas.width = 100;
		}

		var oH = canvas.height = oW;
	    // 线宽
		var lineWidth = 1;
		// 大半径
		var r = (oW / 2); //大半径
		var cR =r -lineWidth*oW*0.1;//小半径
		var sR = r-cR;
		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		// 水波动画初始参数
		var axisLength = 2*r - sR*lineWidth;  // Sin 图形长度
		var unit = axisLength / 9; // 波浪宽
		var range = .4 // 浪幅
		var nowrange = range;
		var xoffset = 0.5*sR*lineWidth; // x 轴偏移量
		this.data = 0;   // 数据量
		var sp = 0; // 周期偏移量
		var nowdata = 0;
		var waveupsp = 0.006; // 水波上涨速度
		var arcStack = [];  // 圆栈
		var bR = r-0.5*sR*lineWidth;
		var soffset = -(PI/2); // 圆动画起始位置
		var circleLock = true; // 起始动画锁
		var img = new Image();   // 创建一个<img>元素
	img.src = 'jj.png';
	var pause = false;
		  // 获取圆动画轨迹点集
		  for(var i =  soffset; i<  soffset + 2*PI; i+=1/(8*PI)) {
		    arcStack.push([
		      r + bR * Cos(i),
		      r + bR * Sin(i)
		    ])
		  }
		  // 圆起始点
		  var cStartPoint = arcStack.shift();
		  ctx.strokeStyle = "#1c86d1";
			  ctx.moveTo(cStartPoint[0],cStartPoint[1]);
			  
	 //更改值
	this.oRange=function(uu){
		this.data =  ~~(uu) / 100;
		if(this.data>1){
			this.data = 1;
		}
		pause = false;
		this.render();
	}
	//实时渲染
	this.render=function(){
		ctx.clearRect(0,0,oW,oH);
		//最外面淡黄色圈
		drawCircle();
		//灰色圆圈
		grayCircle();
		//橘黄色进度圈
		orangeCircle();
		//裁剪中间水圈
		clipCircle();
		if (this.data >= 0.85) {
		  if (nowrange > range/4) {
		    var t = range * 0.01;
		    nowrange -= t;
		  }
		} else if (this.data <= 0.1) {
		  if (nowrange < range*1.5) {
		    var t = range * 0.01;
		    nowrange += t;
		  }
		} else {
		  if (nowrange <= range) {
		    var t = range * 0.01;
		    nowrange += t;
		  }
		  if (nowrange >= range) {
		    var t = range * 0.01;
		    nowrange -= t;
		  }
		}
		//	    if((this.data - nowdata) > 0) {
		//	      nowdata += waveupsp;
		//	    }
		//	    if((this.data - nowdata) < 0){
		//	      nowdata -= waveupsp
		//	    }
		nowdata=this.data;
		sp += 0.07;
		// 开始水波动画
		drawSine();
		// 写字
    	drawText();
  	}
	
	drawCircle=function(){ //最外面淡黄色圈
		var lineWidth  = oW*0.1*0.6
		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = '#fff89d';
    	ctx.arc(r, r, cR+(lineWidth), 0, 2 * Math.PI);
    	ctx.stroke();
    	ctx.restore();
  }
  grayCircle = function(){ //灰色圆圈
	var lineWidth  = oW*0.1*0.6
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#eaeaea';
	    ctx.arc(r, r,  cR, 0, 2 * Math.PI);
	    ctx.stroke();
	    ctx.restore();
	    ctx.beginPath();
  }
  orangeCircle = function(){//橘黄色进度圈
ctx.beginPath();
ctx.strokeStyle = '#fbdb32';
//使用这个使圆环两端是圆弧形状
ctx.lineCap = 'round';
    ctx.arc(r, r, cR,0 * (Math.PI / 180.0) - (Math.PI / 2),(nowdata * 360) * (Math.PI / 180.0) - (Math.PI / 2));
    ctx.stroke();
    ctx.save();
  }
  clipCircle = function(){//裁剪中间水圈
  		var lineWidth  = oW*0.1*0.2
  	
    ctx.beginPath();
    ctx.arc(r, r, cR-lineWidth, 0, 2 * Math.PI,false);
    ctx.clip();
  }
  
  drawSine = function() { // 开始水波动画
    ctx.beginPath();
    ctx.save();
    var Stack = []; // 记录起始点和终点坐标
    for (var i = xoffset; i<=xoffset + axisLength; i+=20/axisLength) {
      var x = sp + (xoffset + i) / unit;
      var y = Sin(x) * nowrange;
      var dx = i;
      var dy = 2*cR*(1-nowdata) + (r - cR) - (unit * y);
      ctx.lineTo(dx, dy);
      Stack.push([dx,dy])
    }
    // 获取初始点和结束点
    var startP = Stack[0]
    var endP = Stack[Stack.length - 1]
    ctx.lineTo(xoffset + axisLength,oW);
    ctx.lineTo(xoffset,oW);
    ctx.lineTo(startP[0], startP[1])
    ctx.fillStyle = "#fbec99";
    ctx.fill();
    ctx.restore();
}
//更改文字
drawText = function() {
    var size = 0.4*cR;
		if(pause == true){
				ctx.drawImage(img,r-size/2, r-size/2,size,size);
		}else{
			 	ctx.globalCompositeOperation = 'source-over';
		    ctx.font = 'bold ' + size + 'px Microsoft Yahei';
		    txt = (nowdata.toFixed(2)*100).toFixed(0) + '%';
		    var fonty = r + size/2;
		    var fontx = r - size * 0.8;
		    ctx.fillStyle = "#f6b71e";
		    ctx.textAlign = 'center';
	    	ctx.fillText(txt, r, r+sR/2);
		}

//		   
}
this.Imsg=function(){
	var size = 0.4*cR;
 	ctx.globalCompositeOperation = 'source-over';
    ctx.font = 'bold ' + size + 'px Microsoft Yahei';
    txt = (nowdata.toFixed(2)*100).toFixed(0) + '%';
    var fonty = r + size/2;
    var fontx = r - size * 0.8;
    ctx.fillStyle = "#f6b71e";
    ctx.textAlign = 'center';
	    ctx.drawImage(img,r-size/2, r-size/2,size,size);
	}
	this.clear=function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	this.onPause = function(){
		pause =  true;
		console.log(this.pause)
	}
	this.oRange(0);
}
