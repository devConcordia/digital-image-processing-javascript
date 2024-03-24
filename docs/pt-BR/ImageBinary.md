# ImageBinary

Na classe [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs),
cada pixel é representado por um bit, ou seja, preto e branco.

> [!WARNING]
> Essa classe é uma extenção de [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).


## Bitwise

Os métodos que temos para realizar essas operações são `inverse`, `or`, `and` e `xor`.

![](https://github.com/devConcordia/pixel/blob/main/docs/images/bitwise.png)

### inverse

Não requer parâmetros. O resultado desse método é um novo [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs)
com os bits invertidos, ou seja, `0b10101010 → 0b01010101`.

### or, and e xor

Reque que seja informado uma outra [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs)
para realizar a operação. O resultado é um novo [ImageBinary](https://github.com/devConcordia/pixel/blob/main/src/ImageBinary.mjs).


