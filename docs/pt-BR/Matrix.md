# Matrix

A classe [Matrix](https://github.com/devConcordia/pixel/blob/main/src/core/Matrix.mjs) é um auxílio para criar matrizes utilizada nas diversas operações desse projeto.

> [!WARNING]
> Essa classe é uma extenção de [Float32Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array).

## contructor

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| w         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Número de colunas da matriz. |
| h         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Número de linhas da matriz. |
| data      | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | Seu tamanho deverá ser igual a `largura x altura`. |


## Matrix.Zeros

Similar ao `Matrix.Zeros`, esse método gera uma [Matrix](https://github.com/devConcordia/pixel/blob/main/src/core/Matrix.mjs) 
nas dimensões definidas em que todos os valores são 0.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| w         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Número de colunas da matriz. |
| h         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Número de linhas da matriz. |

O retorno é uma [Matrix](https://github.com/devConcordia/pixel/blob/main/src/core/Matrix.mjs).

```javascript

let m33 = pixel.Matrix.Ones(3,3);

console.log( m33.toString() )

// 0.00 0.00 0.00
// 0.00 0.00 0.00
// 0.00 0.00 0.00

```

## Matrix.Ones

Similar ao `Matrix.Zeros`, esse método gera uma [Matrix](https://github.com/devConcordia/pixel/blob/main/src/core/Matrix.mjs) 
nas dimensões definidas em que todos os valores são 1.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| w         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Número de colunas da matriz. |
| h         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Número de linhas da matriz. |

O retorno é uma [Matrix](https://github.com/devConcordia/pixel/blob/main/src/core/Matrix.mjs).

```javascript

let m53 = pixel.Matrix.Ones(5,3);

console.log( m53.toString() )

// 1.00 1.00 1.00 1.00 1.00
// 1.00 1.00 1.00 1.00 1.00
// 1.00 1.00 1.00 1.00 1.00

```

## Matrix.Radial

Esse método gera uma [Matrix](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/Matrix.md) quadrada, 
no tamanho definido, de modo que os elementos que formem uma circunferência inscrito no quadrado seja igual a 1.

| Argumento | Tipo | Descrição |
|-----------|------|-----------|
| size      | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Número de colunas e linhas da matriz. |

O retorno é uma [Matrix](https://github.com/devConcordia/pixel/blob/main/src/core/Matrix.mjs).

```javascript

let mr3 = pixel.Matrix.Radial(3);

console.log( mr3.toString() )

// 0.00 1.00 0.00 
// 1.00 1.00 1.00 
// 0.00 1.00 0.00

let mr5 = pixel.Matrix.Radial(5);

console.log( mr5.toString() )

// 0.00 0.00 1.00 0.00 0.00 
// 0.00 1.00 1.00 1.00 0.00 
// 1.00 1.00 1.00 1.00 1.00 
// 0.00 1.00 1.00 1.00 0.00 
// 0.00 0.00 1.00 0.00 0.00
 
let mr7 = pixel.Matrix.Radial(7);

console.log( mr7.toString() )

// 0.00 0.00 0.00 1.00 0.00 0.00 0.00
// 0.00 1.00 1.00 1.00 1.00 1.00 0.00
// 0.00 1.00 1.00 1.00 1.00 1.00 0.00
// 1.00 1.00 1.00 1.00 1.00 1.00 1.00
// 0.00 1.00 1.00 1.00 1.00 1.00 0.00
// 0.00 1.00 1.00 1.00 1.00 1.00 0.00
// 0.00 0.00 0.00 1.00 0.00 0.00 0.00
 
```

## Matrix.Dot

## Matrix.Sharpen

## Matrix.Emboss

## Matrix.Prewitt

## Matrix.Sobel

## Matrix.Feldman

## Matrix.Scharr

## Matrix.Laplace

## Matrix.GaussianBlur






