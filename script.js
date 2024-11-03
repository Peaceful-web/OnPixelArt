const canvas = document.querySelector(".canvas")
const inputSize = document.querySelector(".input-size")
const inputColor = document.querySelector(".input-color")
const usedColors = document.querySelector(".used-colors")
const buttonSave = document.querySelector(".button-save")
const colResize = document.querySelector(".reslize")
const main = document.querySelector("main")

const MIN_CANVAS_SIZE = 4

let isPainting = false
let isResizing = false 

const createElement = (tag, className = "") => { // função de criar elemento html (tag, nome da classe)
    const element = document.createElement(tag) // cria um elemento html (tag) e arazena no element
    element.className = className // o className desse element vai receber o parâmetro className da function
    return element
}

const setPixelColor = (pixel) => { //função que atribui cor ao pixel
    pixel.style.backgroundColor = inputColor.value //vai acessar o backgroundColor do pixel no arquivo CSS e atribuir o valor do inputColor(a cor selecionada pelo usuário)
}

const createPixel = () => {
    const pixel = createElement("div", "pixel") // pixel vai receber um createElement(), vai criar uma div e lhe dar uma class chamada pixel

    pixel.addEventListener("mousedown", () => setPixelColor(pixel)) //adiciona um evento ao clicar e segurar no botão esquerdo do mouse em cada pixel, no caso, vai chamar a função setPixelColor(Pintar a área do pixel clicado) ao clicar na área do pixel

    pixel.addEventListener("mouseover", () => { // mouseover é o evento de arrastar o mouse sobre o pixel
        if (isPainting) setPixelColor(pixel) // se isPainting for true ao clicar e segura na área do canvas, chama a função setPixelColor() que muda a cor do backgroundColor do pixel
        
    })
    return pixel 
}

const loadCanvas = () => { // função de carregar o canvas
    const length = inputSize.value // length vai receber o valor numérico do inputSize
    canvas.innerHTML = "" // canvas vai começar zerado

    for (let i = 0; i < length; i+=1) {
        const row = createElement("div", "row") // enquanto o laço for rodando, createElement vai criar uma div com a class row a cada iteração

        for(let j = 0; j < length; j+=1) {
            row.append(createPixel()) // chama a função de criar pixels em cada linha gerada
        }

        canvas.append(row) // o elemento canvas vai receber a div de class row contendo os pixels gerados a cada iteração
    }
}

const updateCanvasSize = () => {

    if (inputSize.value >= MIN_CANVAS_SIZE) { // se o valor do inputSize for maior ou igual ao MIN_CANVAS_SIZE
        loadCanvas(); // chama a função loadCanvas, só será chamada nessa condição
    }
        
}

const changeColor = () => { //função que será chamada ao trocar a cor do input-color
    const button = createElement("button", "button-color") // cria um elemento button no html
    const currentColor = inputColor.value  // currentColor recebe a cor (valor) atual do inputColor
    button.style.backgroundColor = currentColor // acessa o CSS do button criado e muda a cor de fundo para a currentColor
    button.setAttribute("data-color", currentColor) //cada button vai ter um atributo data-color com o valor do currentColor

    button.addEventListener("click", () => inputColor.value = currentColor) //button vai receber um evento de click com uma arrow function que faz o valor(cor atual) do inputColor receber o valor do currentColor


    const savedColors = Array.from(usedColors.children) //usedColors.children é uma HTMLCollection, Array.from converte essa HTMLCollection em array. as cores escolhidas pelo usuário ficam armazenadas na usedColors.children que por sua vez são transformadas em array e guardadas na const savedColors
    
    const check = (btn) => btn.getAttribute("data-color") != currentColor // função que verifica se o atributo data-color de cada butão é diferente do currentColor(cor atual)

    if (savedColors.every(check)) { // every é uma condição que precisa ser atendida por todos os elementos do array, se todos os buttons do savedColor tiverem um valor(cor) diferente da cor atual selecionada:

        usedColors.append(button) //adiciona o button à section usedColors

    } //

    
}

const resizeCanvas = (cursorPositionX) => {
    if (!isResizing) return 


    const canvasOffSet = canvas.getBoundingClientRect().left
    const width = `${cursorPositionX - canvasOffSet - 20}px` // pega 

    canvas.style.maxWidth = width;
    colResize.style.height = width
}

const saveCanvas = () => {
    html2canvas(canvas, {
        onrendered: (image) => {
            const img = image.toDataURL("image/png");
            const link = createElement("a");

            link.href = img;
            link.download = "pixelart.png";

            link.click();
        },
    });
};

canvas.addEventListener("mousedown", () => isPainting = true) // ao clicar no canvas segurando o mouse
canvas.addEventListener("mouseup", () => isPainting = false) // ao soltar o clique do mouse

colResize.addEventListener("mousedown", () => isResizing = true)

main.addEventListener("mouseup", () => isResizing = false) // ao clicar arrastar e soltar o clique do mouse em qualquer área da main, o isResizing volta a ser false
main.addEventListener("mousemove", ({ clientX }) => resizeCanvas(clientX)) //clientX é a posição no eixo x do mouse

inputSize.addEventListener("change", updateCanvasSize) //change define que a cada vez que o valor do inputSize mudar vai executar uma função, a cada mudança no valor do inputSize o updateCanvas vai chamar de novo o loadCanvas
inputColor.addEventListener("change", changeColor) // evento acionado ao trocar a cor do inputColor

buttonSave.addEventListener("click", saveCanvas)

loadCanvas()