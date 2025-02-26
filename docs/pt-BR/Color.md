
# Color

A classe [Color](../../source/common/Color.mjs) é um auxilio para operações com as cores.

Os dispositivos podem possuir estruturas diferentes de armazenar os bytes na memoria, isso é conhecido como [Endianness](https://en.wikipedia.org/wiki/Endianness).
Para simplificar esse gerenciamento, a class [Color]() é responsável por gerar os bytes da cor na ordem do dispositivo (BE, LE, ME). 

> [!WARNING]
> Essa classe é uma extenção de [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

## Constructor

[Color]() pode ser instanciado informando valor (entre `0` e `255`) em cada um dos canais (RGBA).

```javascript

new Color( r, g, b, a );

```

## Métodos estáticos

### FromByte

Inicia uma instância de [Color]() a partir de um Uint32 respeitando o [Endianness](https://en.wikipedia.org/wiki/Endianness) do dispositivo.

```javascript

const color = DIP.Color.FromByte( 0xff0000ff );

```

#### Retorno

Retorna uma instância de [Color]().

### Hex

Inicia uma instância de [Color]() a partir de um hexadecimal.

```javascript

const RED = DIP.Color.Hex( 0xff0000 );

```

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| input       | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Bytes representando os 3 canais (RGB). Valor entre `0x000000` e `0xffffff`.  |

#### Retorno

Retorna uma instância de [Color]().

----

### Random

Gera uma cor aleatória.

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| min         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Menor valor para a geração do numero alearorio para cada um dos canais. Padrão é `35`. |
| max         | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Maior valor para a geração do numero alearorio para cada um dos canais. Padrão é `220`. |

#### Retorno

Retorna uma instância de [Color]().

## Métodos de instância

### getBytes

Obtém o [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) (Uint32) respeintando o [Endianness](https://en.wikipedia.org/wiki/Endianness) do dispositivo.

#### Retorno

Retorna a instância [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) (Uint32).

----

### getCMYK

Obtem os valores no formato CMYK.

```javascript

let [ c, m, y, k ] = color.getCMYK();

```

#### Retorno

Retorna um [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

----

### getHSL

Obtem os valores no formato HSL.

#### Retorno

Retorna um [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

```javascript

let [ h, s, l ] = color.getHSL();

```

Sendo que `h` será um valor entre `0.0` e `360.0`.
Sendo que `s` será um valor entre `0.0` e `1.0`.
Sendo que `l` será um valor entre `0.0` e `1.0`.

----

### getHSV

Obtem os valores no formato HSV.

#### Retorno

Retorna um [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

```javascript

let [ h, s, v ] = color.getHSV();

```

Sendo que `h` será um valor entre `0.0` e `360.0`.
Sendo que `s` será um valor entre `0.0` e `1.0`.
Sendo que `v` será um valor entre `0.0` e `1.0`.

----

### gray

Converte os valores de cada um dos canais para tons de cinza.

#### Retorno

Retorna uma instância de [Color]().

----

### negative

Inverte os valores de cada um dos canais.

#### Retorno

Retorna uma instância de [Color]().

----

### setCMYK

Define os valores da instância convertendo uma cor CMYK.

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| c           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |
| m           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |
| y           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |
| k           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |

#### Retorno

Retorna a instância [Color]().

----

### setHSL

Define os valores da instância convertendo uma cor HSL.

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| h           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `360.0`. |
| s           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |
| l           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |

#### Retorno

Retorna a instância [Color]().

----

### setHSV

Define os valores da instância convertendo uma cor HSV.

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| h           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `360.0`. |
| s           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |
| v           | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Valor entre `0.0` e `1.0`. |

#### Retorno

Retorna a instância [Color]().
