var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var dinoImage = new Image();
dinoImage.src = 'dino.png';

var dino = {
    // 공룡 등장 좌표
    x: 10, 
    y: 200,
    // 공룡 사이즈
    width: 50, 
    height: 50,
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(dinoImage, this.x, this.y);
    }
};

var cactusImage = new Image();
cactusImage.src = 'cactus.png';

class Cactus {
    constructor() {
        // 장애물 등장 위치, 사이즈
        this.x = 500;
        this.y = 200;
        this.width = 50;
        this.height = 50;
    }
    draw() {
        ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(cactusImage, this.x, this.y);
    }
};


var timer = 0;
var cactuses = [];
var jumpTimer = 0;
var animation; 

// 프레임마다 실행할 함수
function executeByFrame() {
    animation = requestAnimationFrame(executeByFrame);
    timer++;

    ctx.clearRect(0,0, canvas.width, canvas.height);

    // 장애물 생성 시간 설정
    // 60: 60Hz 모니터에서 1초에 한번씩 장애물 그려짐
    if (timer % 150 === 0) {
        var cactus = new Cactus();
        cactuses.push(cactus);
    }

    cactuses.forEach((cactus, i, o) => {
        // 필요없어진 장애물이 배열에 쌓이지 않도록 제거 (x좌표가 0미만이면 제거)
        if (cactus.x < 0) {
            o.splice(i, 1);
        }

        cactus.x-=3;
        isCrashed(dino, cactus);
        cactus.draw();
    })
    
    // 점프 상승
    if (isJumping) {
        console.log('jump');
        isJumped = true;
        dino.y -= 3;
        jumpTimer++;
    }

    // 점프 하강
    if (!isJumping) {
        if (dino.y < 200) {
            dino.y += 3;
        }
        if (dino.y == 200) {
            jumpCompleted = true;
        }
    }

    // 점프 완료 후 초기화
    if (jumpTimer > 40) {
        isJumping = false;
        jumpTimer = 0;
    }
    dino.draw();
}
executeByFrame();
var jumpCompleted = true;

// 충돌 확인
function isCrashed(dino, cactus) {
    var xDiff = cactus.x - (dino.x + dino.width);
    var yDiff = cactus.y - (dino.y + dino.height);
    if (xDiff < 0 && yDiff < 0) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);
    }
}

// 공룡 점프 기능
var isJumping = false;
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && jumpCompleted) {
        isJumping = true;
        jumpCompleted = false;
    }
});