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
        [[1,2],[0,1],[1,0],[1,1]], // 왼쪽 90도
        [[1,2],[0,1],[2,1],[1,1]],
        [[1,2],[2,1],[1,0],[1,1]],
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

function renderBlocks(moveType=""){
    const {type, direction, top, left} = tempMovingItem;
    // 이동 전 block 지우기
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach((block)=> {
        block.classList.remove(type, "moving")
    })
    // 이동 후 block 새로 그리기
    blocks[type][direction].forEach((block) => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[x] : null;
        const isAvailable = checkTarget(target)
        if(isAvailable){
            target.classList.add(type, "moving")
        }else{
            tempMovingItem = {...movingItem} // 원상복구
            setTimeout(() => { // block이 frame을 벗어나면 다시 renderBlocks()
                renderBlocks();
                if(moveType === "top"){
                    seizeBlock(); // 더이상 아래로 내려가지 못하면 움직이지 못하고 형태만 남음
                }
            },0)
        }
    });
    movingItem.left = left,
    movingItem.top = top, 
    movingItem.direction = direction
}

function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach((block)=> {
        block.classList.remove("moving");
        block.classList.add("seized");
    })
}

function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}

function checkTarget(target){
    if(target != null && !target.classList.contains("seized")){ // target이 있으면
        return true
    }else{ // target이 업으면
        return false
    }
}

function rotateDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction+=1
    renderBlocks();
}

// event handling
document.addEventListener("keydown", (event) => {
    switch(event.keyCode){
        // moving
        case 39: // ◀
            moveBlock("left", 1);
            break;
        case 37: // ▶
            moveBlock("left", -1);
            break;
        case 40: // 🔽
            moveBlock("top", 1);
            break;
        // rotate
        case 38: // 🔼
            rotateDirection();
            break;
        default:
            break
    }
})