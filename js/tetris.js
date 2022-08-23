const playground = document.querySelector(".playground > ul")

const game_rows = 20;
const game_columns = 10;

init()

function init(){
    for (let i = 0; i<game_rows; i++){
        tetrisFrame()
    }
}

function tetrisFrame(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j = 0; j<game_columns; j++){
        const matrix = document.createElement("li"); // 테트리스 한 칸
        // prepend() : inserts a set of Node objects or string objects before the first child of the Element
        ul.prepend(matrix)
    }
    li.prepend(ul)
    playground.prepend(li)
}