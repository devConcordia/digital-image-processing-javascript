
# RGBAImageData

A classe [RGBAImageData](source/RGBAImageData.mjs) realiza operações com os três canais de cores (Red, Green, Blue).

> [!WARNING]
> Essa classe é uma extenção de [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).

## RGBAImageData.Extends

Altera o [prototype](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) de um [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) como [RGBAImageData](source/RGBAImageData.mjs).

> [!Note]
> Por padrão, ao utilizar o método `pixel.load()`, o [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) resultante já terá sido realizado o `RGBAImageData.Extends()`.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| target    | [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) | ImageData original |

### Exemplo

```javascript

pixel.RGBAImageData.Extends( imagedata );

```

## conv

O metodo `conv` realiza a [convolução](https://en.wikipedia.org/wiki/Kernel_\(image_processing\)) em uma imagem.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| matrix    | Matrix | A matriz de convolução (tambem chamadas de Kernel ou Mask). Dependendo de seus valores poderá resultados com diferentes efeitos. |

### Exemplos

| <img src="../images/rgb-conv-prewitt.png" width="200" /> | <img src="../images/rgb-conv-sobel.png" width="200" /> | <img src="../images/rgb-conv-laplace.png" width="200" /> |
|:-:|:-:|:-:|
| Prewitt | Sobel | Laplace |

| <img src="../images/rgb-conv-emboss.png" width="200" /> | <img src="../images/rgb-conv-sharpen.png" width="200" /> | <img src="../images/rgb-conv-gaussian-blur.png" width="200" /> |
|:-:|:-:|:-:|
| Emboss | Sharpen | GaussianBlur |

```javascript

pixel.load( "path/to/image", function( imagedata ) {
	
	imagedata.conv( pixel.Matrix.Sobel() );
	
	pixel.createContext( imagedata, document.body );
	
});

```



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
| <img src="../examples/src/img/rock.jpg" width="300" /> | <img src="../images/rgb-clahe.png" width="300" /> |
| <img src="../images/rgb-clahe-histogram-input.png" width="300" /> | <img src="../images/rgb-clahe-histogram-output.png" width="300" /> |

