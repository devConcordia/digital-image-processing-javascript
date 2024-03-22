
# pixel

Este projeto é um compilado de alguns estudos que fiz ao longo dos ultimos anos.
Não me preocupei com questões de desempenho, *então para aplicações de produção recomendo utilizar recuros mais apropriados como o [OpenCV](https://opencv.org/)*.

Para mais exemplos veja o diretório [docs/examples](https://github.com/devConcordia/pixel/blob/main/examples/).


## Instruções basicas



### pixel.Load

Este método é um auxílio para iniciar imagens já em um (Canvas)[https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API].

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| path      | (String)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String] | caminho para a imagem |
| handlerCallback | (Function)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function] | função chamada quando a imagem carregar |

O `handlerCallback` é chamado com dois argumentos: (CanvasRenderingContext2D)[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D] e (Image)[https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image].

No exemplo a seguir, uma imagem é carragada e o canvas informado é adicionado ao body pad página.

```javascript

pixel.Load('path/to/image', function( context, imagedata ) {
	
	document.body.appendChild( context.canvas );
	
});

```

## ImageRGB

A classe [ImageRGB](https://github.com/devConcordia/pixel/blob/main/ImageRGB.mjs) realiza operações com os três canais de cores (Red, Green, Blue).

Pode ser inciado tendo como referencia um [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
com o método `pixel.ImageRGB.FromImageData`.


| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| input     | (ImageData)[https://developer.mozilla.org/en-US/docs/Web/API/ImageData] | Imagem original |
| options   | (Object)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object] | Opções para iniciar o [ImageRGB](https://github.com/devConcordia/pixel/blob/main/ImageRGB.mjs) |

**options**

Deverá ser um 

| Opção | Tipo | Descrição |
|-------|------|-----------|
| crop  | (Array)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array] | *cropX* ponto incial para o recorte no eixo X\n*cropY* ponto incial para o recorte no eixo Y\n*cropWidth* e *cropHeight* dimensões do recorte. |
| scale | (Array)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array] | *scaleX* altera a escala no eixo X\n *scaleY* altera a escala no eixo Y. |

´´´json
{
	"crop": [ cropX, cropY, cropWidth, cropHeight ],
	"scale": [ scaleX, scaleY ]
}
´´´

No exemplo a seguir, o [ImageRGB](https://github.com/devConcordia/pixel/blob/main/ImageRGB.mjs) é iniciado
recortando (`crop`) um quadrado 100x100 pixels (deslocado 50 pixels da esquerda e do topo) é ampliado (`scale`) em 200%.

```javascript

pixel.Load('path/to/image', function( context, imagedata ) {
	
	let rgbImage = pixel.ImageRGB.FromImageData( imagedata, { 
		crop: [ 50, 50, 100, 100 ],
		scale: [ 2, 2 ]
	});
	
	let outImagedata = rgbImage.toImageData();
	
	let outContext = pixel.CreateContext2D( outImagedata );
	
	document.body.appendChild( outContext.canvas );
	
});

```


### Convolução

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



### Clahe

CLAHE (Contrast Limited Adaptive Histogram Equalization) é uma técnica de processamento de imagem usada para melhorar o contraste local em uma imagem.
Ela é uma extensão do método de equalização de histograma, que redistribui os valores de intensidade dos pixels em uma imagem para melhorar o contraste global. 

```javascript

let image = pixel.ImageRGB.FromImageData( imagedata );

let claheImageData = image.clahe();

canvasContext2d.putImageData( claheImageData, 0, 0 );

```


| <img src="https://github.com/devConcordia/pixel/blob/main/docs/examples/src/hill.jpg" width="300" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe.png" width="300" /> |
|:-:|:-:|
| Antes  | Depois    |


Histograma antes

![](https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe-histogram-original.png)


Histograma depois

![](https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe-histogram-final.png)


