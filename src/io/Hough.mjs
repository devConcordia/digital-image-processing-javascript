
const DEG_TO_RAD = Math.PI / 180;

/**	Hough
 *	
 */
export defaul class Hough {
	
	static Circles({ data, width, height }, points = 36, precison = .85, rMin, rMax ) {
		
		if( !rMin ) rMin = Math.floor( Math.min( width, height )/6 );
		if( !rMax ) rMax = Math.floor( Math.min( width, height )/2 );
		
		var delta = 360 / points;
		
		var w1 = width - 1,
			h1 = height - 1;
		
		/// acc[y][x][r]
		var acc = new Object;
		
		var maxPoints = 0;
		
		/// core
		for( var r = rMin; r < rMax; r++ ) {
            for( var y = 0; y < height; y++ ) {
				
				var offset = y * width;
				
				for( var x = 0; x < width; x++ ) {
					
                    if( data[ (offset + x) * 4 ] == 255 ) {
						
                        for( var t = 0; t <= 360; t += delta ) {
							
							var d = t * DEG_TO_RAD;
							
                            var a = Math.round( x - r * Math.cos(d) ),
								b = Math.round( y - r * Math.sin(d) );
							
							if( (a > 0 && a < w1) && (b > 0 && b < h1) ) {
								
								if( !(b in acc) ) acc[b] = new Object;
								if( !(a in acc[b]) ) acc[b][a] = new Object;
								if( !(r in acc[b][a]) ) acc[b][a][r] = 0;
								
								var m = acc[b][a][r] += 1;
								
								if( m > maxPoints ) maxPoints = m;
								
                            }
							
                        }
						
                    }
					
                }
            }
			
        }
		
		var thresholdPoints = maxPoints * precison;
		
		var output = new Array();
		
		for( var y in acc ) {
			for( var x in acc[y] ) {
				for( var r in acc[y][x] ) {
					
					var p = acc[y][x][r];
					
					if( p > thresholdPoints ) {
						
						x = Number(x);
						y = Number(y);
						r = Number(r);
						
						output.push({ x, y, radius: r, points: p });
						
                    }
					
				}
			}
		}
		
		/// sort by points
		output.sort((a, b) => b.points - a.points);
		
		/// remove doubles
		for( var i = 0; i < output.length; i++ ) {
			
			var a = output[i];
			
			var arx = a.x + a.radius,
				ary = a.y + a.radius;
			
			for( var j = i + 1; j < output.length; j++ ) {
				
				var b = output[j];
				
				var brx = b.x + b.radius,
					bry = b.y + b.radius;
			
				if( Math.abs( brx - arx ) < 5 || Math.abs( bry - ary ) < 5 ) {
					output.splice( j--, 1 );
				}
				
			}
		} /* */
		
		return output;
		
	}
	
}

