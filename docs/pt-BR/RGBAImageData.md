
# RGBAImageData

A classe [RGBAImageData](source/RGBAImageData.mjs) realiza operações com os três canais de cores (Red, Green, Blue).

> [!WARNING]
> Essa classe é uma extenção de [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).

## Extends

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

## blend

Realiza a mesclagem de dois [RGBAImageData]().

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| input     | [RGBAImageData]() | Segunda Imagem para a mesclagem |
| as        | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Brilho da primeira imagem (instancia referenciada). Valor entre `0.0 < x 1.0`. |
| bs        | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Brilho da segunda imagem (parametro `input`). Valor entre `0.0 < x 1.0`. |

### Retorno

Uma nova [RGBAImageData]() com a menor dimensão entre as duas imagens informadas.

### Exemplo

Seja, `imageA` e `imageB` instancias de [RGBAImageData](). É gerado uma nova imagem (`imageC`) da mesclagem entre `imageA` e `imageB`.

```javascript

let imageC = imageA.blend( imageB, .5, .5 );

pixel.createContext( imageC, document.body );

```

## blendMin

Realiza a mesclagem dos menores valores entre dois [RGBAImageData]().

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| input     | [RGBAImageData]() | Segunda Imagem para a mesclagem |

### Retorno

Uma nova [RGBAImageData]() com a menor dimensão entre as duas imagens informadas.

## blendMax

Realiza a mesclagem dos maiores valores entre dois [RGBAImageData]().

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| input     | [RGBAImageData]() | Segunda Imagem para a mesclagem |

### Retorno

Uma nova [RGBAImageData]() com a menor dimensão entre as duas imagens informadas.



## clahe

CLAHE (Contrast Limited Adaptive Histogram Equalization) é uma técnica de processamento de imagem usada para melhorar o contraste local em uma imagem.
Ela é uma extensão do método de equalização de histograma, que redistribui os valores de intensidade dos pixels em uma imagem para melhorar o contraste global. 

```javascript

pixel.load( "path/to/image", function( imagedata ) {
	
	imagedata.clahe();
	
	pixel.createContext( imagedata, document.body );
	
});

```

| Antes  | Depois    |
|:-:|:-:|
| <img src="../examples/src/img/rock.jpg" width="300" /> | <img src="../images/rgb-clahe.png" width="300" /> |
| <img src="../images/rgb-clahe-histogram-input.png" width="300" /> | <img src="../images/rgb-clahe-histogram-output.png" width="300" /> |


## clone

Cria uma nova instacia com os mesmos valores.

### Exemplo

```javascript

pixel.load( "path/to/image", function( imagedata ) {
	
	let original = imagedata.clone();
	
});

```

## contrast

Realiza o contraste da [RGBAImageData]().

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| value     | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor que ajusta o contraste da imagem |

### Retorno

Retorna a referencia [RGBAImageData]() original. 
Observe que essa operação não gera uma nova instancia, ou seja, altera os valores da [RGBAImageData]() referenciado.

## conv

O metodo `conv` realiza a [convolução](https://en.wikipedia.org/wiki/Kernel_\(image_processing\)) em uma imagem.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| matrix    | Matrix | A matriz de convolução (tambem chamadas de Kernel ou Mask). Dependendo de seus valores poderá resultados com diferentes efeitos. |

### Retorno

Retorna a referencia [RGBAImageData]() original.
Observe que essa operação não gera uma nova instancia, ou seja, altera os valores da RGBAImageData referenciado.

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


## crop

Realiza o recorte da [RGBAImageData]().

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| rx        | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Posição `X` do inicio do recorte |
| ry        | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Posição `Y` do inicio do recorte |
| rw        | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Largura do recorte |
| rh        | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Altura do recorte |

### Retorno

Uma nova [RGBAImageData]() com a dimensão `rw`x`rh`.

### Exemplo

Seja `imageA` uma instancia de [RGBAImageData]().

```javascript

let imageB = imageA.blend( 0, 0, 50, 50 );

pixel.createContext( imageB, document.body );

```


