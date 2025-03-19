
# RLESegmentation

O [RLESegmentation](docs/pt-BR/RLE.md) (Run-Length-Encoding Segmentation) é um metodo de [segmentação de imagem](https://en.wikipedia.org/wiki/Image_segmentation).
O método consite em agrupar os [RLETrace](RLETrace.md) (sequencia horizontal de pixel de mesma cor) que estejam ligados verticalmente.

O projeto original, utilizado como referência, pode ser encontrado em [https://sourceforge.net/projects/fastimageex/](https://sourceforge.net/projects/fastimageex/).

## Uso básico

No exemplo a seguir, repare que o `source` é um [ColorImageData](ColorImageData.md) binarizado.

```javascript

/// DIP.Load() load a image as ColorImageData
DIP.Load('../src/img/nuts-and-bolts.jpg', function( source, context2d ) {

    source.grayScale();
    source.conv( DIP.Matrix.Sobel(5) );
    source.threshold(90);
	
    let objects = DIP.RLESegmentation.Create( source );
	
	const COLOR_BLACK = DIP.Color.Hex(0x000000).getBytes();
	
	/// clear source
	source.fill( COLOR_BLACK );
	
	/// plot objects of RLE on source
	objects.stamp( source );
	
	context2d.putImageData( source, 0, 0 );
	
	document.body.appendChild( context2d.canvas );
	
});

```



