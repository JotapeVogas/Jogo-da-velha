const celulas = document.querySelectorAll('.celula');
const mensagem = document.getElementById('mensagem');
const botaoReiniciar = document.getElementById('reiniciar');
const botaoJogarIA = document.getElementById('jogarIA');

let tabuleiro = ['', '', '', '', '', '', '', '', ''];
let jogadorAtual = 'X';
let jogoAtivo = true;
let contraIA = false;

// Combinações vencedoras
const COMBINACOES_VENCEDORAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
    [0, 4, 8], [2, 4, 6]             // diagonais
];

celulas.forEach(celula => celula.addEventListener('click', jogar));
botaoReiniciar.addEventListener('click', reiniciarJogo);
botaoJogarIA.addEventListener('click', alternarModoIA);

// Função principal do jogo
function jogar(evento) {
    const celulaClicada = evento.target;
    const indice = celulaClicada.getAttribute('data-indice');

    // Verifica se a jogada é válida
    if (tabuleiro[indice] !== '' || !jogoAtivo) return;

    // Faz a jogada do humano
    tabuleiro[indice] = jogadorAtual;
    celulaClicada.textContent = jogadorAtual;
    
    // Verifica se houve vencedor
    verificarVencedor();
    
    // Se estiver jogando contra IA e o jogo não terminou
    if (jogoAtivo && contraIA) {
        jogadorAtual = 'O'; // Passa a vez para a IA
        setTimeout(jogadaIA, 500); // Delay para parecer mais natural
    } else if (jogoAtivo) {
        // Alterna jogador no modo multiplayer
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
        mensagem.textContent = `Vez do Jogador ${jogadorAtual}`;
    }
}

// Jogada da IA (simplificada)
function jogadaIA() {
    // Encontra uma jogada vazia aleatória
    const jogadasVazias = [];
    for (let i = 0; i < tabuleiro.length; i++) {
        if (tabuleiro[i] === '') jogadasVazias.push(i);
    }
    
    if (jogadasVazias.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * jogadasVazias.length);
        const melhorJogada = jogadasVazias[indiceAleatorio];
        
        // Faz a jogada da IA
        tabuleiro[melhorJogada] = 'O';
        celulas[melhorJogada].textContent = 'O';
        
        // Verifica se houve vencedor
        verificarVencedor();
        
        if (jogoAtivo) {
            jogadorAtual = 'X'; // Volta a vez para o jogador humano
            mensagem.textContent = 'Sua vez (X)';
        }
    }
}

// Verifica se há vencedor
function verificarVencedor() {
    // Verifica combinações vencedoras
    for (let combinacao of COMBINACOES_VENCEDORAS) {
        const [a, b, c] = combinacao;
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            mensagem.textContent = `Jogador ${tabuleiro[a]} Venceu!`;
            jogoAtivo = false;
            return;
        }
    }
    
    // Verifica empate
    if (!tabuleiro.includes('')) {
        mensagem.textContent = 'Empate!';
        jogoAtivo = false;
    }
}

// Reinicia o jogo
function reiniciarJogo() {
    tabuleiro = ['', '', '', '', '', '', '', '', ''];
    jogadorAtual = 'X';
    jogoAtivo = true;
    mensagem.textContent = contraIA ? 'Sua vez (X)' : `Vez do Jogador ${jogadorAtual}`;
    celulas.forEach(celula => celula.textContent = '');
}

// Alterna entre jogar contra IA ou humano
function alternarModoIA() {
    contraIA = !contraIA;
    botaoJogarIA.textContent = contraIA ? 'Jogar Contra Humano' : 'Jogar Contra IA';
    reiniciarJogo();
}

// Inicia o jogo
reiniciarJogo();