
# RLESegmentation

O [RLESegmentation](docs/pt-BR/RLE.md) (Run-Length-Encoding Segmentation) é um metodo de [segmentação de imagem](https://en.wikipedia.org/wiki/Image_segmentation).
O método consite em agrupar os [RLETrace](RLETrace.md) (sequencia horizontal de pixel de mesma cor) que estejam ligados verticalmente.

O projeto original, utilizado como referência, pode ser encontrado em [https://sourceforge.net/projects/fastimageex/](https://sourceforge.net/projects/fastimageex/).

## Uso básico

No exemplo a seguir, repare que o `source` é um [ColorImageData](ColorImageData.md) binarizado.

```javascript

/// DIP.Load() load a image as ColorImageData
DIP.Load('../src/img/nuts-and-bolts.jpg', function( source, context2d ) {
	
    let graySource = DIP.GrayImageData.From( source );
        graySource.conv( DIP.Matrix.Sobel(5) );
        graySource.threshold(90);
	
    let objects = new DIP.RLESegmentation( graySource );
	
	const BLACK_COLOR = DIP.Color.Hex(0x000000).getBytes();
	
	/// clear source
	source.fill( BLACK_COLOR );
	
	/// plot objects of RLE on source
	objects.debug( source );
	
	context2d.putImageData( source, 0, 0 );
	
	document.body.appendChild( context2d.canvas );
	
});

```

## Métodos de instância

### close

Realiza uma operação em que preenche os espaços vazios para cada um dos objetos.

#### Exemplo

```javascript
let objects = new DIP.RLESegmentation( graySource );

objects.close();

```

----

### debug

Imprime os objetos em um [ImageData]().

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| imagedata | [ColorImageData]() | Segunda Imagem para a mesclagem |

#### Exemplo

```javascript
let objects = new DIP.RLESegmentation( graySource );

objects.debug( imagedata );

/// update
context2d.putImageData( imagedata, 0, 0 );
```

----

### merge

Uni os objetos que estão dentro de outros.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| delta     | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Distância maxima entre os objetos. |

#### Exemplo

```javascript
let objects = new DIP.RLESegmentation( graySource );

objects.merge( 200 );

```

----

### filter

Remove os objetos que não atendem a verificação.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| statement | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | Declaração de filtragem. A função recebe o objeto como argumento. Se o retorno for `true` o objeto será removido. |

#### Exemplo

No exemplo a seguir, todos os objetos com area menor que 200 pixeis são removidos.

```javascript

let objects = new DIP.RLESegmentation( graySource );

objects.filter(function(object) {
    return object.pixels < 200
});

```
