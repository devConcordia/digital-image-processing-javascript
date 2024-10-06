/* @version 0.1.1 */
const __VERSION__ = "0.1.1";

/**	Frame
 *	
 */
class Frame {
		
	constructor( x, y, w, h ) {
		
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		
	}
	
}

/** Bounds
 *	
 */
class Bounds extends Float32Array {
	
	constructor() {
	
		super( arguments );
	
	}
	
	get minx() { return this[0] }
	get miny() { return this[1] }
	get maxx() { return this[2] }
	get maxy() { return this[3] }
	
	get top() { return this[3] }
	get left() { return this[0] }
	get right() { return this[2] }
	get bottom() { return this[1] }
	
	get width() { return this[2] - this[0] }
	get height() { return this[3] - this[1] }
	
}

const PI2$1 = Math.PI * 2;

/** renderer_define
 *	
 *	@param {FrameRenderer2D} { context }
 *	@param {Object} param
 */
function renderer_define({ context }, param ) {
	
	for( var key in param ) {
		
		switch( typeof context[ key ] ) {
			
			case 'function':
					context[ key ]( param[ key ] );
				//	context[ key ]( ...param[ key ] );
				break;
			
			case 'undefined':
				
				break;
			
			default:
					context[ key ] = param[ key ];
				break;
			
		}
		
	}
	
}


function rederer_geometry({ context, x, y, width, height }, geometry, scaleX, scaleY ) {
	
//	for( var i = 0; i < geometry.length; i += 2 )
//		context.fillRect( x + geometry[ i ], y + geometry[ i+1 ], 4, 4 );
	
	
	context.beginPath();
	context.moveTo( x + geometry[ 0 ] * scaleX, y + geometry[ 1 ] * scaleY );
	
	for( var i = 2; i < geometry.length; i += 2 )
		context.lineTo( x + geometry[ i ] * scaleX, y + geometry[ i+1 ] * scaleY );
	
	context.closePath();
	
}


function rederer_geometry_dots({ context, x, y, width, height }, geometry, size = 4, scaleX, scaleY ) {
	
	for( var i = 0; i < geometry.length; i += 2 ) {
		/// context.fillRect( x + geometry[ i ] - h, y + geometry[ i+1 ] - h, size, size );
		context.beginPath();
		context.arc( x + geometry[ i ] * scaleX, y + geometry[ i+1 ] * scaleY, size, 0, PI2$1 );
		context.closePath();
		context.fill();
		context.stroke();
	}
	
}

/** FrameRenderer2D
 *
 */
class FrameRenderer2D extends Frame {

	constructor( context, x, y, w, h ) {

		super( x, y, w, h );

		this.context = context;

		this.viewport = new Bounds( 0, 0, w, h );
		
		this.scaleX =  1;
		this.scaleY = -1;
		
	}
	
	/** setViewport
	 *	
	 *	@param {Number} minx, miny, maxx, maxy
	 */
	setViewport( minx, miny, maxx, maxy ) {
		
		this.viewport = new Bounds( minx, miny, maxx, maxy );
		
		this.scaleX = this.width/(maxx + Math.abs(minx));
		this.scaleY = -this.height / (maxy + Math.abs(miny));
		
	//	this.scaleX = this.width/(maxx + Math.abs(minx));
	//	this.scaleY = -((maxy + Math.abs(miny)) / this.height);
		
	}
	
	/** style
	 *	
	 *	@param {String} strokeStyle
	 *	@param {String} fillStyle
	 *	@param {String} lineWidth
	 *	@param {Array} setLineDash
	 */
	style( strokeStyle, fillStyle, lineWidth, setLineDash ) {
		
		console.warn( this.constructor.name +'.style() is deprecate' );
		
		var param = new Object;
			
		if( strokeStyle ) param.strokeStyle = strokeStyle;
		if( fillStyle ) param.fillStyle = fillStyle;
		if( lineWidth ) param.lineWidth = lineWidth;
		if( setLineDash ) param.setLineDash = [ setLineDash ];
		
		renderer_define( this, param );
		
		return this;

	}
	
	
	save( param ) {
		
		this.context.save();
		
		if( param ) renderer_define( this, param );
		
		return this;

	}
	
	restore() {
		
		this.context.restore();
		
		return this;

	}
	
	
	/** clear
	 *
	 *	@param {String} color
	 */
	clear( color ) {

		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		x *= scaleX;
		y *= -scaleY;
		width *= scaleX;
		height *= -scaleY;
		
		y = y - height;
		
		//console.log( x, y, width, height )
		
		if( color ) {
		
			context.fillStyle = color;
			context.fillRect( x, y, width, height );
		
		} else {
			
			context.clearRect( x, y, width, height );
			
		}

		return this;

	}
	
	text( string, tx, ty ) {

		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		context.fillText( string, x + tx * scaleX, y + ty * scaleY, width * scaleX );

		return this;

	}

	line( x0, y0, x1, y1 ) {
		
		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		context.beginPath();
		context.moveTo( x + x0 * scaleX, y + y0 * scaleY );
		context.lineTo( x + x1 * scaleX, y + y1 * scaleY );
		context.stroke();

		return this;

		
	}
	
	rect( rx, ry, rw, rh ) {

		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		rx *= scaleX;
		ry *= scaleY;
		rw *= scaleX;
		rh *= scaleY;
		
		context.strokeRect( x + rx, y + ry, rw, rh );

		return this;

	}
	
	stroke( geometry ) {
		
		rederer_geometry( this, geometry, this.scaleX, this.scaleY );

		this.context.stroke();
		
		return this;

	}
	
	fill( geometry ) {
		
		rederer_geometry( this, geometry, this.scaleX, this.scaleY );

		this.context.fill();

		return this;

	}
	
	dots( geometry, size ) {
		
		rederer_geometry_dots( this, geometry, size, this.scaleX, this.scaleY );

		return this;

	}
	
//	grid( stepx, stepy ) {
	grid( nw, nh ) {
		
		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		context.beginPath();
		
	//	var nw = Math.floor(width / (stepx * scaleX)),
	//		nh = Math.abs( Math.floor(height / (stepy * scaleY)) );
		
		/// ajuste
	//	scaleX = width/(nw-1);
	//	scaleY = height/(nh-1);
		
	//	let stepx = (width/(nw-1));
		let stepx = (width/nw);
		let stepy = -(height/nh) ;
		
		
		for( var i = 0; i <= nw; i++ ) {
			context.moveTo( x + i* stepx, y );
			context.lineTo( x + i* stepx, y - height );
		}
		
		for( var i = 0; i <= nh; i++ ) {
			context.moveTo( x,         y + i * stepy );
			context.lineTo( x + width, y + i * stepy );
		}
		
		
	//	context.stroke();
	//	
	//	context.beginPath();
	//	
	//	context.strokeStyle = "#00f";
		/// last
	//	context.moveTo( x,         (y - height) );
	//	context.lineTo( x + width, (y - height) );
		
		context.stroke();

		return this;

	}

	image( source, ...args ) {
		
		if( source instanceof ImageData ) {
		
			this.context.putImageData( source, ...args );
			
		} else {
			
			this.context.drawImage( source, ...args );
			
		}
		
		return this;

	}
	
}

/** PlotRenderer2D
 *
 */
class PlotRenderer2D extends FrameRenderer2D {
	
	signal( data ) {

		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		var length = data.length;
		
		var h_half = height / 2;
		
		var step = width / Math.max(1, length - 1);
		
		y -= h_half;
		
		context.beginPath();
		context.moveTo( x, y + data[0] * scaleY );
		
		for( var i = 1; i < length; i++ )
			context.lineTo( x + step * i, y + data[i] * scaleY );
		
		context.stroke();
		
		return this;

	}

	spectrum( data ) {

		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		var length = data.length;
	
		var max = Math.max( ...data ),
			step = width / length;
		
		for( var i = 0; i < length; i++) {
			
			var d = data[ i ] / max;
			var f = Math.floor( d * 255 );
			
			var r = 64 + f,
				g = f,
				b = 255 - f;
			
			var h = d * height;
			
			context.fillStyle = 'rgb('+ r +','+ g +','+ b +')';
			context.fillRect( x + step * i * scaleX, y, step * scaleX, h * scaleY );
		
		}
		
		return this;
		
	}

	lissajous( a, b ) {

		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		var wh = width/2,
			hh = height/2;
		
		var dx = wh + x,
			dy = hh + y - height;
		
		var r = Math.min( wh, hh );
			
		var ma = Math.max.apply( null, a ), 
			mb = Math.max.apply( null, b );
		
		context.beginPath();
		context.moveTo( dx - r * Math.sin( a[0]/ma ) * scaleX, dy + r * Math.sin( b[0]/mb ) * scaleY );
		
		for( var i = 1; i < a.length; i++ )
			context.lineTo( dx - r * Math.sin( a[i]/ma ) * scaleX, dy + r * Math.sin( b[i]/mb ) * scaleY );
	
		
		context.stroke();
		
		return this;
		
	}
	
}

const PI2 = Math.PI*2;

/** ChartRenderer2D
 *
 */
class ChartRenderer2D extends FrameRenderer2D {
	
	labelsX( step, label ) {
		
		let { context, x, y, width, height, scaleX, scaleY } = this;
		
		let fontSize = parseInt( context.font.split(' ').shift().replace('px', '') ) || 12;
		
		let stepx = width / (label.length-1);
		
		for( let i = 1; i < label.length; i++ ) {
			
			if( i%step != 0 ) continue;
			
			let tx = x + i * stepx;
		//	let tx = x + i * stepx * scaleX;
			
			let m = context.measureText( label[i] );
			
			context.save();
			context.translate( (tx + stepx/2 - m.width/2), y + 2*fontSize );
			context.rotate( -Math.PI/4 );
			context.fillText( label[i], 0, 0 );
			context.restore();
		
		}
		
	}
	
	labelsY( step, label ) {
		
		let { context, x, y, width, height, viewport, scaleX, scaleY } = this;
		
		let fontSize = parseInt( context.font.split(' ').shift().replace('px', '') );
		
		
	//	let sy = scaleY/2;
		
	//	let stepy = height / (label.length-1);
		height / label.length;
		
		for( let i = 0; i < label.length; i++ ) {
			
			if( i%step != 0 ) continue;
			
			//let ty = y + i * stepy * scaleY;
			let ty = y + i * scaleY;
		//	let ty = y + i * stepy * -1;
			
			let m = context.measureText( label[i] );
			
			context.fillText( label[i], x - m.width - 10, ty - fontSize/10 );
			
		}
	
		
	}
	
	
	
	lines2( data, target, s0, s1 ) {
		
		let { context, x, y, width, height, scaleX, scaleY } = this;
		
		
		/// 
		let length = data.length;
		
		/// ajusta a escala do eixo x
	//	scaleX = width/((width / scaleX)-1);
		scaleX = width/(length-1);
		
	//	let s = height/(s1-s0);
	//	let m = s0 * s;
	//	
	//	console.log( ( data[0][ target ] * s - m ) )
		
		context.beginPath();
	//	context.moveTo( x, y + scaleY * ( (data[0][ target ] * s) - m) );
		context.moveTo( x, y + scaleY * data[0][ target ] );
		
		for( let i = 1; i < length; i++ ) {
			
			let _x = x + scaleX * i,
				_y = y + scaleY * data[i][ target ];
			//	_y = y + scaleY * ( (data[i][ target ] * s) - m);
			
			context.lineTo( _x, _y );
		//	context.lineTo( x + scaleX * i, y + scaleY * (height * data[i][ target ] / s1) );
			
			context.fillText( data[i][ target ], _x, _y );
			
		}
		
		context.stroke();
		
		
		return this;

	}
	
	
	
	
	
	
	
	/** 
	 *	
	 *	@param {Array} labelx
	 *	@param {Array} labely
	 */
	legends( labelx, labely ) {
		
		let { context, x, y, width, height, viewport, scaleX, scaleY } = this;
		
		let fontSize = parseInt( context.font.split(' ').shift().replace('px', '') );
		
		if( labelx.length > 0 ) {
			
			let stepx = width / labelx.length;
			
			for( let i = 0; i < labelx.length; i++ ) {
				
				let tx = x + i * stepx * scaleX;
				
				let m = context.measureText( labelx[i] );
				
				context.fillText( labelx[i], (tx + stepx/2 - m.width/2), y + fontSize + 2 );
			
			}
		
		}
		
		if( labely.length > 0 ) {
			
			let stepy = height / (labely.length-1);
			
			for( let i = 0; i < labely.length; i++ ) {
				
				let ty = y + i * stepy * scaleY;
				
				context.measureText( labely[i] );
				
			//	context.fillText( labely[i], (x - m.width) - 15, ty + fontSize/2 );
				context.fillText( labely[i], x, ty + fontSize/2 );
				
			//	context.fillText( labely[i], (tx + stepx/2 - m.width/2), y + fontSize + 2 );
			
			}
		
		}
		
	}
	
	
	
	lines( data, radius = 3 ) {
		
		let { context, x, y, width, height, scaleX, scaleY } = this;
		
		/// 
		let length = data.length;
		
		/// ajusta a escala do eixo x
	//	scaleX = width/((width / scaleX)-1);
		scaleX = width/(length-1);
		
		
		
		context.beginPath();
		context.moveTo( x, y + scaleY * data[0] );
		
		for( let i = 1; i < length; i++ )
			context.lineTo( x + scaleX * i, y + scaleY * data[i] );
	
		context.stroke();
		
		
		/// 
	//	for( let i = 0; i < length; i++ ) {
	//		context.beginPath();
	//		context.arc( x + scaleX * i, y + scaleY * data[i], radius, 0, PI2 );
	//		context.fill();
	//		context.stroke();
	//	}
		
		return this;

	}
	
	
	
	
	
	/** bars
	 *	
	 *	@param {Array} data					Number[] | Number[][]
	 *	@param {Array} colors				String[]
	 *	@return {Object2D}
	 */
	bars( data, colors ) {
		
		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		/// 
		let size = Array.isArray(colors)? colors.length : 1;
		
		
		let maxValueX, maxValueY;
		
		if( size > 1 ) {
			
			maxValueX = data[0].length * size;
			maxValueY = Math.max( ...data.map(e=>Math.max(...e)) );
			
		} else {
			
			maxValueX = data.length;
			maxValueY = Math.max( ...data );
			
		}
		
		let sx = width/(maxValueX);
		let sy = -height/(maxValueY);
		
		
		context.save();
		context.translate( x, y );
		context.beginPath();
		
		let pw = (sx * .05);
		
		parseInt( context.font.split(' ').shift().replace('px', '') );
		
		if( size > 1 ) {
			
			let w = 1;
			
			for( let i = 0; i < data.length; i++ ) {
				
				let block = data[i];
				
				for( let j = 0; j < block.length; j++ ) {
					
					let tx = ((i + .05) * w + j * w * size)* sx;
					
					let ty = (block[j] || 0.1) * sy;
					
					context.save();
					context.beginPath();
					context.fillStyle = colors[i];
					context.fillRect( tx, 0, w * sx, ty );
					context.closePath();
					context.restore();
					
				}
				
			}
			
		} else {
			
			context.fillStyle = colors;
			
			let w = (sx * .9);
		
			for( let i = 0; i < data.length; i++ ) {
				
				let _x = sx * i + pw,
					_y = (data[i] || 0.1) * sy;
				
				context.fillRect( _x, 0, w, _y );
				
			}
			
		}
		
		context.closePath();
		context.restore();
		
		return this;

	}
	
	/** bars
	 *	
	 *	@param {Array} data					Number[] | Number[][]
	 *	@param {Array} colors				String[]
	 *	@return {Object2D}
	 */
	barsWithLegends( data, colors ) {
		
		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		/// 
		let size = Array.isArray(colors)? colors.length : 1;
		
		
		let maxValueX, maxValueY;
		
		if( size > 1 ) {
			
			maxValueX = data[0].length * size;
			maxValueY = Math.max( ...data.map(e=>Math.max(...e)) );
			
		} else {
			
			maxValueX = data.length;
			maxValueY = Math.max( ...data );
			
		}
		
		let sx = width/(maxValueX);
		let sy = -height/(maxValueY);
		
		
		context.save();
		context.translate( x, y );
		context.beginPath();
		
		let pw = (sx * .05);
		
		let fontSize = parseInt( context.font.split(' ').shift().replace('px', '') );
		
		if( size > 1 ) {
			
			let w = 1;
			
			for( let i = 0; i < data.length; i++ ) {
				
				let block = data[i];
				
				for( let j = 0; j < block.length; j++ ) {
					
					let tx = ((i + .05) * w + j * w * size)* sx;
					
					let ty = (block[j] || 0.1) * sy;
					
					context.save();
					context.beginPath();
					context.fillStyle = colors[i];
					context.fillRect( tx, 0, w * sx, ty );
					context.closePath();
					context.restore();
					
					
					
					context.save();
					context.beginPath();
					
					let m = context.measureText( data[i] );
					
					context.translate( (tx + w/2) - pw, Math.min( ty+fontSize, -m.width-fontSize ) );
					context.rotate( Math.PI/2 );
					context.fillStyle = "#000";
					context.fillText( data[i].toLocaleString("pt-BR"), 0, 0 );
					
					context.closePath();
					context.restore();
					
				}
				
			}
			
		} else {
			
			context.fillStyle = colors;
			
			let w = (sx * .9);
		
			for( let i = 0; i < data.length; i++ ) {
				
				let _x = sx * i + pw,
					_y = (data[i] || 0.1) * sy;
				
				context.fillRect( _x, 0, w, _y );
				
				
				context.save();
				context.beginPath();
				
			//	context.globalCompositeOperation = 'difference';
				
				let m = context.measureText( data[i] );
					
			//	context.translate( Math.PI/2 );
			//	context.translate( (_x + w/2 - m.width/2), Math.min( _y + fontSize, -fontSize )  );
				context.translate( (_x + w/2) - pw, Math.min( _y+fontSize, -m.width-fontSize ) );
				context.rotate( Math.PI/2 );
				context.fillStyle = "#000";
				context.fillText( data[i].toLocaleString("pt-BR"), 0, 0 );
				
			//	context.globalCompositeOperation = 'source-over';
				
				context.closePath();
				context.restore();
				
			}
			
		}
		
		context.closePath();
		context.restore();
		
		return this;

	}
	
	
	
	/** scatter
	 *	
	 *	@param {Array[][]} data		[ Vector, Vector, ... ]
	 */
	scatter( data, radius = 3 ) {
		
		var { context, x, y, width, height, scaleX, scaleY } = this;
		
		///
		data.length;
	
		data.map(function(e) { return e[0] });
		data.map(function(e) { return e[1] });
		
	//	y += ( this.viewport.miny < 0 )? height/2 : height;
		
		for( var point of data ) {
			context.beginPath();
			context.arc( x + point[0] * scaleX, y + scaleY * point[1], radius, 0, PI2 );
			context.closePath();
			context.fill();
			context.stroke();
		}
		
		return this;

	}
	
	pizza() {
		
	}
	
	doughnut() {
		
	}
	
	funnel() {
		
	}
	
}

/** Renderer2D
 *	
 */
class Renderer2D extends FrameRenderer2D {
	
	constructor( width, height ) {
		
		var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
		
		var context = canvas.getContext('2d');
		
		super( context, 0, height, width, height );
		
		this.canvas = canvas;
		
	}
	
	/** createFrame
	 *	
	 */
	createFrame( x = 0, y = 0, w = this.width, h = this.height ) {
		
		return new FrameRenderer2D( this.context, x, this.height - y, w, h );
		
	}
	
	/** createPlot
	 *	
	 */
	createPlot( x = 0, y = 0, w = this.width, h = this.height ) {
		
		return new PlotRenderer2D( this.context, x, this.height - y, w, h );
		
	}
	
	/** createChart
	 *	
	 */
	createChart( x = 0, y = 0, w = this.width, h = this.height ) {
		
		return new ChartRenderer2D( this.context, x, this.height - y, w, h );
	//	return new ChartRenderer2D( this.context, x, y+h, w, h );
		
	}
	
}

export { Renderer2D as default };
