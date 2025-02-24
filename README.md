
# pixel

Este projeto é um compilado de alguns estudos que fiz ao longo dos ultimos anos, principalmente com base no livro Digital Image Processing 4e (Rafael C. Gonzalez, Richard E. Woods).
Não me preocupei com questões de desempenho, ou seja, *para aplicações de produção recomendo utilizar recuros mais apropriados como o [OpenCV](https://opencv.org/)*.

Esse projeto contempla metodos como [Clahe](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization), [Detecção de bordas](https://en.wikipedia.org/wiki/Edge_detection), , entre outros.
Para mais informações, veja a documentação em [docs/pt-BR/pixel.md](docs/pt-BR/pixel.md).

<!--
![](docs/images/folder.png)
-->

## Exemplos

### Segmentação

O [RLESegmentation](docs/pt-BR/RLE.md) (Run-Length-Encoding Segmentation) é um metodo de [segmentação de imagem](https://en.wikipedia.org/wiki/Image_segmentation) basedo no projeto [FastImageEx](https://sourceforge.net/projects/fastimageex/).

Veja o exemplo em [/docs/examples/rle-segmentation/](docs/examples/rle-segmentation/).

![](docs/images/rle-sample.png)

> [!NOTE]
> A imagem é uma ilustração abreviada das etapas necessarias para realizar a segmentação, veja o exemplo para mais informações.

### Clahe 

O [Clahe](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization) está disponivel nas classes [RGBAImageData](docs/pt-BR/RGBAImageData.md) e [GrayImageData](docs/pt-BR/GrayImageData.md).

Veja o exemplo em [/docs/examples/clahe/](docs/examples/clahe/).

#### RGB Image

| Input | Output |
|-------|--------|
| ![](docs/examples/src/img/rock.jpg) | ![](docs/images/rgb-clahe.png) |
| ![](docs/images/rgb-clahe-histogram-input.png) | ![](docs/images/rgb-clahe-histogram-output.png) |

#### Gray Image

| Input | Output |
|-------|--------|
| ![](docs/examples/src/img/x-ray.jpg) | ![](docs/images/gray-clahe.png) |
| ![](docs/images/gray-clahe-histogram-input.png) | ![](docs/images/gray-clahe-histogram-output.png) |

### Binary 

As operações com [Imagens binárias](https://en.wikipedia.org/wiki/Binary_image) estão disponiveis com a classe [BinaryImageData](docs/pt-BR/BinaryImageData.md).

Veja o exemplo em [/docs/examples/binary/](docs/examples/binary/).

| **Operation**    | Input | Output |
|------------------|-------|--------|
| Remove noise     | ![](docs/examples/src/img/figure-11.png) | ![](docs/images/binary-hitormiss.png) |
| Extract Boundary | ![](docs/examples/src/img/figure-16.png) | ![](docs/images/binary-boundary.png) |
| Fill Holes       | ![](docs/examples/src/img/figure-63.jpg) | ![](docs/images/binary-holefilling.png) |
| Thinning         | ![](docs/examples/src/img/horse.png)     | ![](docs/images/binary-thinning.png) |

### Open Circle

Embora não seja um metodo implementado, realizei um teste de "abrir um circulo" no exeplo [/docs/examples/open-circle/](docs/examples/open-circle/).

| ![](docs/examples/src/img/circles.jpg) |
|:-:|
| ![](docs/images/circle-open-a.png) |
| ![](docs/images/circle-open-b.png) |
| ![](docs/images/circle-open-c.png) |
| ![](docs/images/circle-open-d.png) |
| ![](docs/images/circle-open-e.png) |
| ![](docs/images/circle-open-f.png) |

| ![](docs/examples/src/img/iris.png) |
|:-:|
| ![](docs/images/open-circle.png) |



## Instruções

Você pode fazer o download ZIP ou clonar o repositório utilizando o git.
E para visualizar os exemplos de [docs/examples](docs/examples/), 
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


