
# ImageRGB

A classe [ImageRGB](https://github.com/devConcordia/pixel/blob/main/src/ImageRGB.mjs) realiza operações com os três canais de cores (Red, Green, Blue).

> [!WARNING]
> Essa classe é uma extenção de [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).


## constructor

Pode ser inciada com `new ImageRGB( w, h, data )`.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| w         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Largura da imagem. |
| h         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Altura da imagem. |
| data      | [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) ou [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | Um *array* com valores entre 0 e 255. Seu tamanho deverá ser igual a `largura x altura x 3`. Pois para cada pixel, haverá 3 valores (RGB). |

No exemplo a seguir criamos uma ImageRGB 3x3 e definimos as cores de cada pixel.

```javascript

let image = new pixel.ImageRGB(3, 3, [
	255,0,0,      255,255,255,  0,0,0,
	255,255,255,  0,255,0,      255,255,255,
	0,0,0,        255,255,255,  0,0,255
]);

```

## ImageRGB.FromImageData

Inicia [ImageRGB](https://github.com/devConcordia/pixel/blob/main/src/ImageRGB.mjs) a partir de um [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| input     | [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) | Imagem original |
| options   | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | Opções para iniciar o [ImageRGB](https://github.com/devConcordia/pixel/blob/main/src/ImageRGB.mjs) |

> [!NOTE]
> Em `options` podem ser especificado um recorte (*crop*) e/ou um redimensionamento (*scale*) da imagem original.<br>
> *crop* deverá ser um [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) de 4 inteiros, os dois primeiros indicam a posição do recorte e os dois ultimos indicam as dimensões.<br>
> *scale* deverá ser um [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) de 2 flutuantes, indicando a distorção nos eixos x e y.

No exemplo a seguir, o [ImageRGB](https://github.com/devConcordia/pixel/blob/main/src/ImageRGB.mjs) é iniciado
recortando (*crop*) um quadrado 100x100 pixels (deslocado 50 pixels da esquerda e do topo) é ampliado (*scale*) em 200%.

```javascript

pixel.Load('path/to/image', function( context, imagedata ) {
	
	let options = {
		crop: [ 50, 50, 100, 100 ],
		scale: [ 2, 2 ]
	};
	
	let rgbImage = pixel.ImageRGB.FromImageData( imagedata, options );
	
	pixel.createContext( rgbImage.toImageData(), document.body );
	
});

```


## conv

A convolução (em processamento de imagem) é comumente usada para aplicar filtros a uma imagem, 
como por exemplo a detecção de bordas, suavização e embaçamento.

```javascript
let image = pixel.ImageRGB.FromImageData( imagedata );

let kernel = pixel.Matrix.Sobel();

let sobelImageData = image.conv( kernel ).toImageData();

canvasContext2d.putImageData( sobelImageData, 0, 0 );
```

| <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-conv-prewitt.png" width="200" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-conv-sobel.png" width="200" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-conv-laplace.png" width="200" /> |
|:-:|:-:|:-:|
| Prewitt  | Sobel    | Laplace  |

| <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-conv-emboss.png" width="200" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-conv-sharpen.png" width="200" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-conv-gaussian-blur.png" width="200" /> |
|:-:|:-:|:-:|
| Emboss   | Sharpen  | GaussianBlur |



## clahe

CLAHE (Contrast Limited Adaptive Histogram Equalization) é uma técnica de processamento de imagem usada para melhorar o contraste local em uma imagem.
Ela é uma extensão do método de equalização de histograma, que redistribui os valores de intensidade dos pixels em uma imagem para melhorar o contraste global. 

```javascript

let image = pixel.ImageRGB.FromImageData( imagedata );

let claheImageData = image.clahe();

canvasContext2d.putImageData( claheImageData, 0, 0 );

```

| Antes  | Depois    |
|:-:|:-:|
| <img src="https://github.com/devConcordia/pixel/blob/main/docs/examples/src/rock.jpg" width="300" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe.png" width="300" /> |
| <img src="https://github.com/devConcordia/pixel/blob/main/docs/examples/src/rgb-clahe-histogram-original.png" width="300" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe-histogram-final.png" width="300" /> |

