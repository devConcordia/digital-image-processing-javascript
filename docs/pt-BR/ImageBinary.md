# ImageBinary

Na classe [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs),
cada pixel é representado por um bit, ou seja, preto e branco.

> [!WARNING]
> Essa classe é uma extenção de [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).


É muito provavel que as imagens que forem carregadas será coloridas. Então precisamos converte-lá para tons de cinza. 
Se precisar realizmos uma operação para ajustar o que deverá ser branco ou preto, no exemplo realizamos uma detecção de bordas.
E então definimos um limiar para o que será considerado preto e branco.

```javascript

pixel.load("path/to/image", function(context, imagedata) {
	
    /// inicia um ImageGray
    let image_g = pixel.ImageGray.FromImageData( imagedata );
    
    /// detecta as bordas
    image_g = image_g.conv( pixel.Matrix.Sobel() );
    
	/// Inicia o ImageBinary, com um limiar de 127, ou seja, pixel 
	/// com intencidade maior que 127, será brando, do contrário preto
    let image_b = pixel.ImageBinary.FromImageGray( image_g, 127 );
    
	/// exibe resultado
    pixel.createContext( image_b.getImageData(), document.body );
	
});

```

## Bitwise

Os métodos que temos para realizar essas operações são `inverse`, `or`, `and` e `xor`.

![](https://github.com/devConcordia/pixel/blob/main/docs/images/bitwise.png)

### inverse

Não requer parâmetros. O resultado desse método é um novo [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs)
com os bits invertidos, ou seja, `0b10101010 → 0b01010101`.

### or, and e xor

Reque que seja informado uma outra [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs)
para realizar a operação. O resultado é um novo [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs).

## hitOrMiss

Esse método pode ser utilizado para remover ruidos de uma imagem.

| Antes  | Depois |
|:-:|:-:|
| <img src="https://github.com/devConcordia/pixel/blob/main/docs/examples/src/figure-11.png" width="300" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/binary-hitormiss.png" width="300" /> |

```javascript

let out = image_b.hitOrMiss( pixel.Matrix.Ones(3,3) );

```

## holeFill

Esse método pode ser utilizado para preencher "buracos" em uma imagem.

| Antes  | Depois |
|:-:|:-:|
| <img src="https://github.com/devConcordia/pixel/blob/main/docs/examples/src/figure-63.jpg" width="300" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/binary-holefilling.png" width="300" /> |

```javascript

let out = image_b.holeFill();

```

## boundary 

Esse método pode ser utilizado para delimitar as bordas.

| Antes  | Depois |
|:-:|:-:|
| <img src="https://github.com/devConcordia/pixel/blob/main/docs/examples/src/figure-16.png" width="300" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/binary-boundary.png" width="300" /> |

```javascript

let out = image_b.boundary( pixel.Matrix.Ones(3,3) );

```

## thinning 

Esse método pode ser utilizado no processamento de imagens para reduzir a largura dos objetos presentes na imagem, mantendo a forma e a topologia desses objetos.
Pode ser usado em reconhecimento de padrões, análise de imagens e visão computacional para simplificar a representação de objetos

| Antes  | Depois |
|:-:|:-:|
| <img src="https://github.com/devConcordia/pixel/blob/main/docs/examples/src/horse.png" width="300" /> | <img src="https://github.com/devConcordia/pixel/blob/main/docs/images/binary-thinning.png" width="300" /> |

```javascript

let out = image_b.thinning( pixel.Matrix.Radial(3) );

```

