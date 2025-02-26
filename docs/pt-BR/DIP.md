
# DIP

Esse documento descreve os recursos de [DIP](https://github.com/devConcordia/pixel/blob/main/index.mjs).

- [ColorImageData](ColorImageData.md)
- [GrayImageData](GrayImageData.md)
- [BinaryImageData](BinaryImageData.md)

- [RLESegmentation](RLESegmentation.md)

- [Color](Color.md)
- [Matrix](Matrix.md)
- [Point](Point.md)
- [Rect](Rect.md)

## Métodos Estático

### DIP.Load
----

Este método é um auxílio para iniciar imagens em um [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| path      | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Caminho para a imagem. |
| handlerCallback | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | Função chamada quando a imagem carregar. |

O `handlerCallback` é chamado com dois argumentos: 
- `source` será uma instância de [ColorImageData](ColorImageData.md); e
- `context` será uma instância de [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

No exemplo a seguir, uma imagem é carragada e o canvas informado é adicionado ao body pad página.

```javascript

DIP.Load('path/to/image', function handlerCallback( source, context ) {
	
	document.body.appendChild( context.canvas );
	
});

```

### DIP.CreateContext
----

Este método é um auxílio para criar um [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) a partir de uma [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image), [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) ou [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| source    | [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image)<br>[HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)<br>[ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) | (Opcional) Imagem para iniciar o [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) ja carregado. |
| parentNode | [HTMLElement]() | *Opcional*. Caso informado, o canvas criado será adicionado ao `parentNode`. |

O retorno é um [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

```javascript

let img = new Image();
    img.onload = function() {
    	
		/// CanvasRenderingContext2D
		let context = DIP.CreateContext( img, document.body );
		
		/// TODO
		
    };
    
    img.src = "pat/to/image";

```
