window.onload = function(){
	var game = new Game('drawCanvas', 'demoCanvas', 'run');
	game.init();
	game.start();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
          	window.setTimeout(callback, 1000 / 60);
          };
})();

var Game = function(drawID, demoID, demoButton, main){
	var self = this;
	this.draw = {
		'canvas': document.getElementById(drawID),
		'context': document.getElementById(drawID).getContext('2d'),
	};

	this.demo = {
		'canvas': document.getElementById(demoID),
		'context': document.getElementById(demoID).getContext('2d')
	};

	document.getElementById(demoButton).onclick = function(){
		self.drawDemo();
	};

	this.body = [];
	this.demoBody = [];
	this.click = false;
}

Game.prototype.init = function(){
	var self = this;

	sizeCanvas(self);

	window.addEventListener('resize', function(){
		sizeCanvas(self);
	});

	this.draw.canvas.addEventListener('mousedown', function(e){
		self.click = true;
		self.body.push([e.pageX, e.pageY]);
	});

	this.draw.canvas.addEventListener('mouseup', function(e){
		self.click = false;
	});

	this.draw.canvas.addEventListener('mousemove', function(e){
		if (self.click){
			var elem = self.body[self.body.length - 1];
			elem[2] = -(elem[0] - e.pageX) - 13;
			elem[3] = -(elem[1] - e.pageY) - 13;
		}
	});

}


Game.prototype.drawBox = function(){
	var c = [this.draw, this.demo],
		b = [this.body, this.demoBody];

	for (var x = 0; x < c.length; x++){
		var body = b[x],
			ctx = c[x].context;
		for (var i = 0; i < body.length; i++){
			var elem = body[i];
			if (elem.length == 4){
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(0,0,0,1)';
				ctx.rect(elem[0], elem[1], elem[2], elem[3]);
				ctx.stroke();
				ctx.closePath();
			}
	}


	}
}

Game.prototype.start = function(){
	var self = this;

	function animate(){
		window.requestAnimFrame(animate);
		self.clear();
		self.drawBox();
	}

	animate();
}

Game.prototype.clear = function(){
	var c = [this.draw, this.demo];
	for (var i = 0; i < c.length; i++){
		c[i].context.clearRect(0,0,c[i].canvas.width, c[i].canvas.height);
	}
}

Game.prototype.drawDemo = function(){
	this.demoBody = [];
	
	for (var i = 0; i < this.body.length; i++){
		this.demoBody.push(this.body[i]);
	}

	this.body = [];
}

function sizeCanvas(self){
	console.log(self.draw, self.demo);
	self.draw.canvas.width = window.innerWidth * .4915;
	self.draw.canvas.height = window.innerHeight * .95;
	self.demo.canvas.width = window.innerWidth * .485;
	self.demo.canvas.height = window.innerHeight * .95;
}