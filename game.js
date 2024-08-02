const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuste o canvas para ocupar toda a tela do navegador
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Carregar imagens
const bee = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bee.src = 'images/bee.gif';
bg.src = 'images/bg.png';
fg.src = 'images/fg.png';
pipeNorth.src = 'images/pipeNorth.png';
pipeSouth.src = 'images/pipeSouth.png';

// Definir dimensões das imagens
const beeWidth = 91; // Tamanho do personagem
const beeHeight = 80;
const pipeWidth = 70;
const pipeHeight = 320;
const fgHeight = 112;

const gap = beeHeight * 2.2; // Tamanho do buraco baseado na altura do personagem
const minPipeHeight = 50; // Altura mínima para os canos
const maxPipeHeight = canvas.height - fgHeight - gap - minPipeHeight;

let bX = 50; // Posição inicial do personagem
let bY = 150;

const gravity = 2.5; // Gravidade
const jump = -42; // Altura de pulo

const fly = new Audio();
const scoreSound = new Audio();

fly.src = 'sounds/fly.mp3';
scoreSound.src = 'sounds/score.mp3';

document.addEventListener('keydown', moveUp);
document.addEventListener('touchstart', moveUp); // Suporte para dispositivos móveis

function moveUp(event) {
    if (event.keyCode === 32 || event.type === 'touchstart') { // Verifica se a tecla é espaço ou se é um toque na tela
        bY += jump; // Movimenta o personagem para cima
        fly.currentTime = 0; // Reinicia o som para remover qualquer delay
        fly.play();
    }
}

const pipes = [];

function addPipe() {
    let pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    pipes.push({
        x: canvas.width,
        y: pipeHeight,
        gap: gap
    });
}

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

function draw() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];

        ctx.drawImage(pipeNorth, p.x, p.y - pipeHeight, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, p.x, p.y + p.gap, pipeWidth, pipeHeight);

        p.x -= 2; // Ajuste a velocidade dos canos

        // Remover canos fora da tela
        if (p.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
        }

        // Verificar colisão
        if (bX + beeWidth >= p.x && bX <= p.x + pipeWidth &&
            (bY <= p.y || bY + beeHeight >= p.y + p.gap) || bY + beeHeight >= canvas.height - fgHeight) {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
            location.reload(); // recarrega a página
        }

        // Incrementar a pontuação
        if (p.x + pipeWidth == bX) { 
            score++;
            scoreSound.play();
        }
    }

    // Adicionar novos canos
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - canvas.width * 0.4) { // 0.4 vezes a largura da tela
        addPipe();
    }

    ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);

    // Limitar a posição do personagem ao teto
    if (bY < 0) {
        bY = 0;
    }

    // Desenhar a imagem do personagem
    ctx.drawImage(bee, bX, bY, beeWidth, beeHeight);

    bY += gravity; // Aplicar gravidade para queda

    // Melhorar o design do texto "Score" e "Recorde"
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, 10, 10);
    ctx.fillText('Recorde: ' + highScore, 10, 50);

    requestAnimationFrame(draw);
}

draw();
