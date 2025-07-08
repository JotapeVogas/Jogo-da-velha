// Elementos do DOM
const celulas = document.querySelectorAll('.celula');
const mensagem = document.getElementById('mensagem');
const botaoReiniciar = document.getElementById('reiniciar');
const botaoJogarIA = document.getElementById('jogarIA');

// Estado do jogo
let tabuleiro = ['', '', '', '', '', '', '', '', ''];
let jogadorAtual = 'X';
let jogoAtivo = true;
let contraIA = false;

// Combinações vencedoras
const COMBINACOES_VENCEDORAS = [
    [0, 1, 2], // linha superior
    [3, 4, 5], // linha do meio
    [6, 7, 8], // linha inferior
    [0, 3, 6], // coluna esquerda
    [1, 4, 7], // coluna do meio
    [2, 5, 8], // coluna direita
    [0, 4, 8], // diagonal principal
    [2, 4, 6]  // diagonal secundária
];

// Event Listeners
celulas.forEach(celula => celula.addEventListener('click', manipularCliqueCelula));
botaoReiniciar.addEventListener('click', reiniciarJogo);
botaoJogarIA.addEventListener('click', alternarModoIA);

function manipularCliqueCelula(evento) {
    const celulaClicada = evento.target;
    const indiceCelula = parseInt(celulaClicada.getAttribute('data-indice'));

    // Ignora se a célula já está preenchida ou o jogo está inativo
    if (tabuleiro[indiceCelula] !== '' || !jogoAtivo) {
        return;
    }

    // Atualiza o tabuleiro e a interface
    tabuleiro[indiceCelula] = jogadorAtual;
    celulaClicada.textContent = jogadorAtual;

    verificarResultadoJogo();
    
    // Se estiver jogando contra IA e for a vez dela
    if (jogoAtivo && contraIA && jogadorAtual === 'O') {
        fazerJogadaIA();
    }
}

/**
 * Verifica o resultado do jogo após cada jogada
 */
function verificarResultadoJogo() {
    // Verifica se há vencedor
    if (verificarVitoria()) {
        mensagem.textContent = `Jogador ${jogadorAtual} Venceu!`;
        jogoAtivo = false;
        return;
    }

    // Verifica empate
    if (!tabuleiro.includes('')) {
        mensagem.textContent = 'Jogo Empatado!';
        jogoAtivo = false;
        return;
    }

    // Alterna jogador se o jogo continuar
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
}

function verificarVitoria() {
    return COMBINACOES_VENCEDORAS.some(combinacao => {
        return combinacao.every(indice => {
            return tabuleiro[indice] === jogadorAtual;
        });
    });
}

function fazerJogadaIA() {
    const melhorJogada = encontrarMelhorJogada();
    if (melhorJogada !== null) {
        // Simula clique na melhor jogada
        tabuleiro[melhorJogada] = jogadorAtual;
        celulas[melhorJogada].textContent = jogadorAtual;
        verificarResultadoJogo();
    }
}

function encontrarMelhorJogada() {
    let melhorPontuacao = -Infinity;
    let melhorJogada = null;

    // Avalia todas as jogadas possíveis
    for (let i = 0; i < tabuleiro.length; i++) {
        if (tabuleiro[i] === '') {
            // Testa a jogada
            tabuleiro[i] = 'O';
            const pontuacao = minimax(tabuleiro, 0, false);
            tabuleiro[i] = '';
            
            // Atualiza a melhor jogada se esta pontuação for melhor
            if (pontuacao > melhorPontuacao) {
                melhorPontuacao = pontuacao;
                melhorJogada = i;
            }
        }
    }
    return melhorJogada;
}

function minimax(tabuleiroAtual, profundidade, maximizando) {
    // Sistema de pontuação
    const PONTUACOES = {
        'X': -1,    // Jogador humano vence
        'O': 1,     // IA vence
        'empate': 0 // Empate
    };

    // Verifica se o jogo terminou
    const resultado = verificarResultadoTabuleiro(tabuleiroAtual);
    if (resultado !== null) {
        return PONTUACOES[resultado];
    }

    if (maximizando) {
        // Vez da IA - maximiza a pontuação
        let melhorPontuacao = -Infinity;
        for (let i = 0; i < tabuleiroAtual.length; i++) {
            if (tabuleiroAtual[i] === '') {
                tabuleiroAtual[i] = 'O';
                const pontuacao = minimax(tabuleiroAtual, profundidade + 1, false);
                tabuleiroAtual[i] = '';
                melhorPontuacao = Math.max(pontuacao, melhorPontuacao);
            }
        }
        return melhorPontuacao;
    } else {
        // Vez do jogador - minimiza a pontuação
        let melhorPontuacao = Infinity;
        for (let i = 0; i < tabuleiroAtual.length; i++) {
            if (tabuleiroAtual[i] === '') {
                tabuleiroAtual[i] = 'X';
                const pontuacao = minimax(tabuleiroAtual, profundidade + 1, true);
                tabuleiroAtual[i] = '';
                melhorPontuacao = Math.min(pontuacao, melhorPontuacao);
            }
        }
        return melhorPontuacao;
    }
}


function verificarResultadoTabuleiro(tabuleiroAtual) {
    for (let i = 0; i < COMBINACOES_VENCEDORAS.length; i++) {
        const [a, b, c] = COMBINACOES_VENCEDORAS[i];
        if (tabuleiroAtual[a] && tabuleiroAtual[a] === tabuleiroAtual[b] && tabuleiroAtual[a] === tabuleiroAtual[c]) {
            return tabuleiroAtual[a];
        }
    }

    if (!tabuleiroAtual.includes('')) {
        return 'empate';
    }

    return null;
}

/**
 * Reinicia o jogo
 */
function reiniciarJogo() {
    tabuleiro = ['', '', '', '', '', '', '', '', ''];
    jogoAtivo = true;
    jogadorAtual = 'X';
    mensagem.textContent = '';
    celulas.forEach(celula => celula.textContent = '');
}

/**
 * Alterna entre jogar contra IA ou contra humano
 */
function alternarModoIA() {
    contraIA = !contraIA;
    botaoJogarIA.textContent = contraIA ? 'Jogar Contra Humano' : 'Jogar Contra IA';
    reiniciarJogo();
}