# RGB

Compilado de exemplos utilizando a class [ImageRGB](https://github.com/devConcordia/pixel/blob/main/ImageRGB.mjs).
Para mais exemplo, veja o diretório [docs/examples](https://github.com/devConcordia/pixel/blob/main/examples/).

## Clahe

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


## Convolução

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


