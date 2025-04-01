
import Matrix from "../../../source/common/Matrix.mjs";

let image = new Image();
	image.src = "../../examples/src/img/valve.png";

///
window.addEventListener('load', function(e) {
	
	/** addStep
	 *	
	 *	@param {String} title
	 *	@param {ImageData} source
	 */
	function addStep( title, source ) {
		
		///
		let div = document.createElement('div');
		
		let p = document.createElement('p');
			p.innerHTML = title;
		
		div.appendChild( p );
		
		if( source ) {
			
			///
			let canvas = document.createElement("canvas"),
				context = canvas.getContext("2d");
		
				canvas.width = source.width;
				canvas.height = source.height;
				
			if( source instanceof Image || source instanceof HTMLCanvasElement) {
				
				context.drawImage( source, 0, 0, source.width, source.height );
			
			} else if( source instanceof ImageData ) {
				
				context.putImageData( source, 0, 0 );
			
			}
			
			div.appendChild( canvas );
			
		}
		
		document.body.appendChild( div );
		
	}
	
	
	const { width, height } = image;
	
	const canvas = document.createElement('canvas');
	
	canvas.width = width;
	canvas.height = height;
	
	const context = canvas.getContext('2d');
	
	///
	context.drawImage( image, 0, 0, width, height );
	
	const imagedata = context.getImageData( 0, 0, width, height );
	
	const sobel = Matrix.Sobel();
	
	let T;
	
	
	/// 
	/// ImageData conv2d
	/// 
	
	let output_a = new ImageData( imagedata.data.slice(), imagedata.width );
	
	T = Date.now();
	convImageData( output_a, sobel );
	addStep( '['+ (Date.now() - T) +' ms] convImageData', output_a );
	
	
	/// 
	/// Channels conv2d
	/// 
	
	T = Date.now();
	let channels_b = getChannels( imagedata );
	addStep( '['+ (Date.now() - T) +' ms] getChannels' );
	
	T = Date.now();
	convChannels( width, height, channels_b, sobel );
	addStep( '['+ (Date.now() - T) +' ms] convChannels' );
	
	T = Date.now();
	let output_b = toImageData(width, height, channels_b);
	addStep( '['+ (Date.now() - T) +' ms] toImageData', output_b );
	
	
	
	
	
}, false);


function convImageData( imagedata, matrix ) {

	const { width, height, data } = imagedata;
	
	const source = data.slice();
	
	///
	const mw = matrix.width,
		mh = matrix.height;
	
	const mwh = Math.floor( mw / 2 ),
		mhh = Math.floor( mh / 2 );
	
	///
	const w = width - 1, 
		h = height - 1;
	
	///
	for( let y = 0; y < height; y++ ) {
		
		const offset = y * width;
		
		for( let x = 0; x < width; x++ ) {

			let rx = 0, ry = 0,
				gx = 0, gy = 0,
				bx = 0, by = 0;
			
			for( let i = 0; i < mh; i++ ) {
				
                const yi = Math.min(Math.max(y + i - mhh, 0), h);
				const om = yi * width;
				
				for( let j = 0; j < mw; j++ ) {
					
					const mx = matrix[ j*mw + i ],
						my = matrix[ i*mw + j ];
					
					const io = i - mhh,
						jo = j - mwh;
					
					const xj = Math.min(Math.max(x + j - mwh, 0), w);
					
					///
					const n = 4 * (om + xj);
					
					const r = source[ n ],
						g = source[ n+1 ],
						b = source[ n+2 ];

					rx += r * mx;
					ry += r * my;
					
					gx += g * mx;
					gy += g * my;
					
					bx += b * mx;
					by += b * my;

				}
			}
			
			///
			const k = 4 * (offset + x);
			
			data[ k   ] = Math.min(Math.max( Math.abs(rx) + Math.abs(ry), 0), 255);
			data[ k+1 ] = Math.min(Math.max( Math.abs(gx) + Math.abs(gy), 0), 255);
			data[ k+2 ] = Math.min(Math.max( Math.abs(bx) + Math.abs(by), 0), 255);
			
		}
	}
	
}

function getChannels( imagedata ) {
	
	const { width, height, data } = imagedata;
	
	const pixelLength = width * height;
	
	const channelR = new Uint8Array( pixelLength );
	const channelG = new Uint8Array( pixelLength );
	const channelB = new Uint8Array( pixelLength );
	
	for( let i = 0; i < pixelLength; i++ ) {
		
		let k = 4*i;
		
		channelR[i] = data[k++];
		channelG[i] = data[k++]; 
		channelB[i] = data[k++];
		
	}
	
	return [ channelR, channelG, channelB ];
	
}

function toImageData(width, height, channels) {
	
    const output = new ImageData(width, height);
    const data = output.data;
    
    const length = width * height;
    
	const dataR = channels[0];
	const dataG = channels[1];
	const dataB = channels[2];
	

    for( let i = 0, k = 0; i < length; i++, k += 4 ) {
		
		data[k   ] = dataR[i];
		data[k+1 ] = dataG[i];
		data[k+2 ] = dataB[i];
		
        data[k + 3] = 255;
		
    }

    return output;
	
}

function convChannels( width, height, channels, matrix ) {
	
    const w = width - 1, 
        h = height - 1;

    const mw = matrix.width;
    const mh = matrix.height;
	
    const mwh = Math.floor(mw / 2);
    const mhh = Math.floor(mh / 2);
	
	
	const dataR = channels[0];
	const dataG = channels[1];
	const dataB = channels[2];
	
	const cacheR = channels[0].slice();
	const cacheG = channels[1].slice();
	const cacheB = channels[2].slice();
	
	for( let y = 0; y < height; y++ ) {
		
		const offset = y * width;
		
		for( let x = 0; x < width; x++ ) {
			
			let vxr = 0, 
				vyr = 0,
				vxg = 0, 
				vyg = 0,
				vxb = 0, 
				vyb = 0;

			for( let i = 0; i < mh; i++ ) {
				
				let yi = Math.min(Math.max(y + i - mhh, 0), h);
				let om = yi * width;
				
				for( let j = 0; j < mw; j++ ) {
					
					let xj = Math.min(Math.max(x + j - mwh, 0), w);
					
					let k = om + xj;
					
					const vR = cacheR[k];
					const vG = cacheG[k];
					const vB = cacheB[k];
					
					const mx = matrix[i * mw + j];
					const my = matrix[j * mw + i];
					
					vxr += vR * mx;
					vyr += vR * my;
					
					vxg += vG * mx;
					vyg += vG * my;
					
					vxb += vB * mx;
					vyb += vB * my;
					
				}
			}
			
			const k = offset + x;
			
			dataR[ k ] = Math.min(Math.max(Math.abs(vxr) + Math.abs(vyr), 0), 255);
			dataG[ k ] = Math.min(Math.max(Math.abs(vxg) + Math.abs(vyg), 0), 255);
			dataB[ k ] = Math.min(Math.max(Math.abs(vxb) + Math.abs(vyb), 0), 255);
			
		}
	}
	

}




function toImageData_Slow( width, height, channels ) {
	
	const output = new ImageData( width, height );
	const data = output.data;
	
	const length = width * height;
	
	for( let i = 0; i < length; i++ ) {
		
		let k = 4*i;
		
		for( let channel of channels )
			data[ k++ ] = channel[i];
		
		data[k] = 255;
		
	}
	
	return output;
	
}

function convChannels_Slow1( width, height, channels, matrix ) {
	
    let w = width - 1, 
        h = height - 1;

    let mw = matrix.width;
    let mh = matrix.height;
	
    let mwh = Math.floor(mw / 2);
    let mhh = Math.floor(mh / 2);

    for( let data of channels ) {
		
        let source = data.slice();

        for( let y = 0; y < height; y++ ) {
            for( let x = 0; x < width; x++ ) {
				
                let vx = 0, 
					vy = 0;

                for( let i = 0; i < mh; i++ ) {
					
                    let yi = Math.min(Math.max(y + i - mhh, 0), h);
					
                    for( let j = 0; j < mw; j++ ) {
						
                        let xj = Math.min(Math.max(x + j - mwh, 0), w);
                        //let xj = clamp(x + j - mhw, 0, w);
						
                        let v = source[yi * width + xj];

                        vx += v * matrix[i * mw + j];
                        vy += v * matrix[j * mw + i];
                    }
                }

                // Melhorando eficiência: evitar `Math.hypot`
                //data[y * width + x] = Math.min(Math.max((Math.abs(vx) + Math.abs(vy)) / gamma, 0), 255);
                data[y * width + x] = Math.min(Math.max(Math.abs(vx) + Math.abs(vy), 0), 255);
                
            }
        }
    }

}

function convChannels_Slow2( width, height, channels, matrix ) {
	
    let w = width - 1, 
        h = height - 1;

    let mw = matrix.width;
    let mh = matrix.height;
	
    let mwh = Math.floor(mw / 2);
    let mhh = Math.floor(mh / 2);
	
	let T = Date.now();
	let caches = channels.map(e=>e.slice());
	console.log( 'Clone Channel', Date.now()-T );
	
    //for( let data of channels ) {
    for( let z = 0; z < channels.length; z++ ) {
		
		let T = Date.now();
		
        let data = channels[z];
        let source = caches[z];

        for( let y = 0; y < height; y++ ) {
            for( let x = 0; x < width; x++ ) {
				
                let vx = 0, 
					vy = 0;

                for( let i = 0; i < mh; i++ ) {
					
                    let yi = Math.min(Math.max(y + i - mhh, 0), h);
					
                    for( let j = 0; j < mw; j++ ) {
						
                        let xj = Math.min(Math.max(x + j - mwh, 0), w);
                        
                        let v = source[yi * width + xj];

                        vx += v * matrix[i * mw + j];
                        vy += v * matrix[j * mw + i];
                    }
                }
				
				data[y * width + x] = Math.min(Math.max(Math.abs(vx) + Math.abs(vy), 0), 255);
                
            }
        }
		
		console.log( 'Channel', z, Date.now()-T );
    }

}
