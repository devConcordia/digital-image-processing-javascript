
# pixel

Este projeto é um compilado de alguns estudos que fiz ao longo dos ultimos anos.
Não me preocupei com questões de desempenho, *então para aplicações de produção recomendo utilizar recuros mais apropriados como o [OpenCV](https://opencv.org/)*.

Esse projeto contempla metodos como [Clahe](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization), [Detecção de bordas](https://en.wikipedia.org/wiki/Edge_detection), operações com [Imagens binárias](https://en.wikipedia.org/wiki/Binary_image), entre outros.
Para mais informações, veja a documentação em [docs/pt-BR/pixel.md](https://github.com/devConcordia/pixel/blob/main/docs/pt-BR/pixel.md).

![](https://github.com/devConcordia/pixel/blob/main/docs/images/folder.png)

> [!IMPORTANT]
> Em atualizações

## Instruções

Você pode fazer o download ZIP ou clonar o repositório utilizando o git.
E para visualizar os exemplos de [docs/examples](https://github.com/devConcordia/pixel/blob/main/docs/examples/), 
será preciso iniciar um servidor local, no exmplo a seguir utilizamos o python para iniciar um servidor simples.

```
git clone https://github.com/devConcordia/pixel.git

cd pixel

python -m http.server
```

Em seguida, abra o localhost em um browser.

> [!NOTE]
> Observe que nos exemplos, definimos o `style` dos canvas com `image-rendering: pixelated`.
> Isso altera a visualização da imagem de modo que ela fique mais "quadriculada".


## Building

Você pode utilizar o `npx rollup` para "compilar" o projeto.

```

# para instalar o rollup
npm install --global rollup

# para compilar web/node
npx rollup index.mjs --file "dist/pixel.js" --format umd --name "pixel"

# para compilar ESM
npx rollup -i index.mjs -o "dist/pixel.mjs"

```
