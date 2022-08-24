const playground = document.querySelector(".playground > ul")

const game_rows = 20;
const game_columns = 10;

let score = 0;
let downDuration = 500; // 블럭이 떨어지는 시간
let downInterval; // 다음 블럭이 떨어지는 간격
let tempMovingItem;

const blocks = {
    tree : [ // ㅗ 모양
        [[2,1],[0,1],[1,0],[1,1]], // 기본
        [], // 왼쪽 90도
        [],
        [],
    ]
}

const movingItem = {
    type : "tree",
    direction : 0,
    top : 0,
    left : 0,
};

init()

function init(){
    tempMovingItem = {...movingItem}; // {...array} : spread operator , 배열 복사
    for (let i = 0; i<game_rows; i++){
        tetrisFrame()
    }
    renderBlocks()
}

function tetrisFrame(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j = 0; j<game_columns; j++){
        const matrix = document.createElement("div"); // 테트리스 한 칸
        // prepend() : inserts a set of Node objects or string objects before the first child of the Element
        li.prepend(matrix)
    }
    playground.prepend(li)
}

function renderBlocks(){
    const {type, direction, top, left} = tempMovingItem;
    blocks[type][direction].forEach(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y].childNodes[x];
        target.classList.add(type)
    });
}