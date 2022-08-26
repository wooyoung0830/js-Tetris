import blocks from "./blocks.js"

document.querySelector(".gameOver").addEventListener('click', () => {
    clearInterval(downInterval)
    alert("게임이 끝났습니다.")})

document.querySelector(".re-start").addEventListener('click', () => {
    location.reload()})
    

const playground = document.querySelector(".playground > ul")
const game_rows = 20;
const game_columns = 10;


let score = 0;


let downDuration = 500; // 블럭이 떨어지는 시간
let downInterval; // 다음 블럭이 떨어지는 간격
let tempMovingItem;
const movingItem = {
    type : "",
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
    generateNewBlock()
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
    // some() 배열 안 요소가 주어진 함수를 통과하면 true, 배열이 비어있으면 false
    blocks[type][direction].some((block) => {
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
            return true;
        }
    });
    movingItem.left = left,
    movingItem.top = top, 
    movingItem.direction = direction
}

function generateNewBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1); // 자동으로 🔽
    },downDuration)
    const blockArray = Object.entries(blocks);
    const randomIndex = parseInt(Math.random() * blockArray.length);
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 2;
    tempMovingItem = {...movingItem};
    renderBlocks()
}

function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving") 
    movingBlocks.forEach((block)=> {
        block.classList.remove("moving");
        block.classList.add("seized");
    })
    checkMatch()
}

function checkMatch(){ // 한 줄이 다 차면 삭제
    const childNodes = playground.childNodes;
    childNodes.forEach((child) => {
        let match = true;
        child.childNodes.forEach((div) => {
            if(!div.classList.contains("seized")){
                match = false;
            }
        })
        if(match){
            child.remove();
            score = score+1;
            document.querySelector(".score").innerHTML = score;
            tetrisFrame();
        }
    })
    generateNewBlock()
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

function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    },10)
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
        // spaceBar
        case 32:
            dropBlock();
            break;
        default:
            break
    }
})