
# pixel

Este projeto é um compilado de alguns estudos que fiz ao longo dos ultimos anos, principalmente com base no livro Digital Image Processing 4e (Rafael C. Gonzalez, Richard E. Woods).
Não me preocupei com questões de desempenho, ou seja, *para aplicações de produção recomendo utilizar recuros mais apropriados como o [OpenCV](https://opencv.org/)*.

Esse projeto contempla metodos como [Clahe](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization), [Detecção de bordas](https://en.wikipedia.org/wiki/Edge_detection), operações com [Imagens binárias](https://en.wikipedia.org/wiki/Binary_image), entre outros.
Para mais informações, veja a documentação em [docs/pt-BR/pixel.md](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/pixel.md).

<!--
![](https://github.com/devConcordia/pixel/blob/main/docs/images/folder.png)
-->

## Exemplos

Alguns dos exemplos desse projeto.

### Segmentação

O [RLESegmentation](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/RLE.md) (Run-Length-Encoding Segmentation) é um metodo de [segmentação de imagem](https://en.wikipedia.org/wiki/Image_segmentation) basedo no projeto [FastImageEx](https://sourceforge.net/projects/fastimageex/).
Veja o exemplo em [/docs/examples/rle-segmentation/](https://github.com/devConcordia/pixel/blob/main/docs/examples/rle-segmentation/).

![](https://github.com/devConcordia/pixel/blob/main/docs/images/rle-sample.png)

> Obs. A imagem a cima é uma ilustração abreviada das etapas necessarias para realizar a segmentação, veja o exemplo para mais informações.

### Clahe 

O [Clahe](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization) está disponivel nas classes [RGBAImageData]() e [GrayImageData]().
Veja o exemplo em [/docs/examples/clahe/](https://github.com/devConcordia/pixel/blob/main/docs/examples/clahe/).

| **RGBA**  | Input | Output |
|-----------|-------|--------|
| Source    | ![](https://github.com/devConcordia/pixel/blob/main/docs/examples/src/img/rock.jpg) | ![](https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe.png) |
| Histogram | ![](https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe-histogram-input.png) | ![](https://github.com/devConcordia/pixel/blob/main/docs/images/rgb-clahe-histogram-output.png) |


| **Gray**  | Input | Output |
|-----------|-------|--------|
| Source    | ![](https://github.com/devConcordia/pixel/blob/main/docs/examples/src/img/x-ray.jpg) | ![](https://github.com/devConcordia/pixel/blob/main/docs/images/gray-clahe.png) |
| Histogram | ![](https://github.com/devConcordia/pixel/blob/main/docs/images/gray-clahe-histogram-input.png) | ![](https://github.com/devConcordia/pixel/blob/main/docs/images/gray-clahe-histogram-output.png) |


## Instruções

Você pode fazer o download ZIP ou clonar o repositório utilizando o git.
E para visualizar os exemplos de [docs/examples](https://github.com/devConcordia/pixel/blob/main/docs/examples/), 
será preciso iniciar um servidor local, no exmplo a seguir utilizamos o python para iniciar um servidor simples.
Em seguida, abra o localhost em um browser.

```
git clone https://github.com/devConcordia/pixel.git

cd pixel

python -m http.server
```

> [!NOTE]
> Observe que nos exemplos, definimos o `style` dos canvas com `image-rendering: pixelated`.
> Isso altera a visualização da imagem de modo que ela fique mais "quadriculada".


