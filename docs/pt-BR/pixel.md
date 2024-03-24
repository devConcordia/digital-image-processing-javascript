
# pixel

Esse documento descreve os recursos de [pixel](https://github.com/devConcordia/pixel/blob/main/index.mjs).

- [ImageRGB](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/ImageRGB.md)
- [ImageGray](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/ImageGray.md)
- [ImageBinary](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/ImageBinary.md)
- [Matrix](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/Matrix.md)

## pixel.load

Este método é um auxílio para iniciar imagens já em um [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| path      | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Caminho para a imagem. |
| handlerCallback | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | Função chamada quando a imagem carregar. |

O `handlerCallback` é chamado com dois argumentos: [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) e [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image).

No exemplo a seguir, uma imagem é carragada e o canvas informado é adicionado ao body pad página.

```javascript

pixel.load('path/to/image', function handlerCallback( context, imagedata ) {
	
	document.body.appendChild( context.canvas );
	
});

```

## pixel.createContext

Este método é um auxílio para criar um [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) a partir de uma [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image), [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) ou [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| source    | [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image)<br>[HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)<br>[ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) | (Opcional) Imagem para iniciar o [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) ja carregado. |
| parentNode | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) | (Opcional) O [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) criado será adicionado ao elemento informado. |

O retorno é um [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

```javascript

let img = new Image();
    img.onload = function() {
    	
       /// CanvasRenderingContext2D
       let context = pixel.createContext( img, document.body );
    	
    };
    
    img.src = "pat/to/image";

```
