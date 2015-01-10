var CanvasTest = (function ($) {
	var my = {
		shapes: document.getElementById('shapes'),
		// width: 300px, height: 150px
		shapesCtx: shapes.getContext('2d'),

		size: {w:100, h:85},
		R1: {x:5, y:5},
		R2: {x:55, y:55},

		state: 0 // 0:none, 1:R1, 2:R2, 3:both
	};
	my.init = function () {
		var self = this;
		$(function () {

			self.shapesCtx.fillStyle = "#d14";
			fillR1();
			fillR2();
			self.shapesCtx.save();

			var $shapes = $(self.shapes);
			$shapes.mousemove(function (e) {
				var mousePos = getMousePos(self.shapes, e);
				checkLocation(mousePos.x, mousePos.y);
			});

			function fillR1 () {
				self.shapesCtx.fillRect(self.R1.x, self.R1.y, self.size.w, self.size.h);
			}
			function fillR2 () {
				self.shapesCtx.fillRect(self.R2.x, self.R2.y, self.size.w, self.size.h);
			}

			function getMousePos(canvas, evt) {
				var rect = canvas.getBoundingClientRect();
				return {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
				};
			}

			function checkLocation (x, y) {
				var R1x_limit = self.R1.x+self.size.w;
				var R1y_limit = self.R1.y+self.size.h;
				var R2x_limit = self.R2.x+self.size.w;
				var R2y_limit = self.R2.y+self.size.h;
				var inR1 = self.R1.x<x && self.R1.y<y && x<R1x_limit && y<R1y_limit;
				var inR2 = self.R2.x<x && self.R2.y<y && x<R2x_limit && y<R2y_limit;

				setState(inR1, inR2);
			}

			// parameters are booleans
			function setState (r1,r2) {
				var state = self.state;
				if (r1 && r2) {
					self.state = 3;
				}
				else if (r1) {
					self.state = 1;
				}
				else if (r2) {
					self.state = 2;
				}
				else {
					self.state = 0;
				}
				if (state !== self.state) {
					handleStateChange();
				}
			}

			function handleStateChange () {
				self.shapesCtx.fillStyle = "#d14";
				fillR1();
				fillR2();

				if (self.state === 1) {
					self.shapesCtx.fillStyle = "green";
					fillR1();
				}
				else if (self.state === 2) {
					self.shapesCtx.fillStyle = "blue";
					fillR2();
				}
				else if (self.state === 3) {
					self.shapesCtx.fillStyle = "orange";
					var x = self.R2.x - self.R1.x;
					var y = self.size.h - self.R2.y + self.R1.y;
					self.shapesCtx.fillRect(self.R2.x, self.R2.y, x, y);
				}
			}
		});
	};

	return my;

}(jQuery));

CanvasTest.init();
