
import { Game } from '../game/Game.js';
import { api } from '../api/mockApi.js';

export class GameView {
    constructor(mode, onBack) {
        this.mode = mode;
        this.onBack = onBack;
        this.element = document.createElement('div');
        this.element.className = 'glass-panel large';
        this.canvas = null;
        this.ctx = null;
        this.game = null;
        this.intervalId = null;
        this.cellSize = 20;
    }

    render() {
        this.element.innerHTML = `
      <div class="nav-header">
        <span>Mode: <span class="user-info">${this.mode === 'walls' ? 'Walls' : 'Pass-through'}</span></span>
        <span>Score: <span id="score-display" class="user-info">0</span></span>
        <button id="back-btn" class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem; margin:0;">Quit</button>
      </div>
      <div style="position: relative;">
        <canvas id="game-canvas" width="600" height="400"></canvas>
        <div id="game-over-modal" class="glass-panel hidden" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 300px;">
          <h2>Game Over</h2>
          <p>Final Score: <span id="final-score" class="user-info">0</span></p>
          <button id="restart-btn" class="btn btn-primary">Play Again</button>
          <button id="exit-btn" class="btn btn-secondary">Exit</button>
        </div>
      </div>
      <p style="text-align: center; margin-top: 1rem; color: var(--text-muted);">Use Arrow Keys to Move</p>
    `;

        this.canvas = this.element.querySelector('#game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.element.querySelector('#back-btn').addEventListener('click', () => this.stopAndExit());
        this.element.querySelector('#restart-btn').addEventListener('click', () => this.startGame());
        this.element.querySelector('#exit-btn').addEventListener('click', () => this.stopAndExit());

        // Start game immediately
        setTimeout(() => this.startGame(), 100);

        return this.element;
    }

    startGame() {
        this.element.querySelector('#game-over-modal').classList.add('hidden');
        const cols = this.canvas.width / this.cellSize;
        const rows = this.canvas.height / this.cellSize;

        this.game = new Game(cols, rows, this.mode);
        this.game.onGameOver = (score) => this.handleGameOver(score);

        this.updateScore(0);

        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.game.tick();
            this.draw();
            this.updateScore(this.game.score);
        }, 100); // 10 FPS

        window.addEventListener('keydown', this.handleInput);
    }

    handleInput = (e) => {
        if (!this.game || this.game.status !== 'playing') return;

        switch (e.key) {
            case 'ArrowUp': this.game.setDirection({ x: 0, y: -1 }); break;
            case 'ArrowDown': this.game.setDirection({ x: 0, y: 1 }); break;
            case 'ArrowLeft': this.game.setDirection({ x: -1, y: 0 }); break;
            case 'ArrowRight': this.game.setDirection({ x: 1, y: 0 }); break;
        }
    }

    updateScore(score) {
        const el = this.element.querySelector('#score-display');
        if (el) el.textContent = score;
    }

    handleGameOver(score) {
        clearInterval(this.intervalId);
        api.saveScore(score);
        this.element.querySelector('#final-score').textContent = score;
        this.element.querySelector('#game-over-modal').classList.remove('hidden');
    }

    stopAndExit() {
        clearInterval(this.intervalId);
        window.removeEventListener('keydown', this.handleInput);
        this.onBack();
    }

    draw() {
        // Clear
        this.ctx.fillStyle = '#0f172a'; // Match bg
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Food
        this.ctx.fillStyle = '#a855f7'; // Neon Purple
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#a855f7';
        this.ctx.fillRect(
            this.game.food.x * this.cellSize,
            this.game.food.y * this.cellSize,
            this.cellSize - 2,
            this.cellSize - 2
        );
        this.ctx.shadowBlur = 0;

        // Draw Snake
        this.ctx.fillStyle = '#4ade80'; // Neon Green
        this.game.snake.body.forEach((segment, index) => {
            // Head is brighter or different?
            if (index === 0) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#4ade80';
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fillRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize - 2,
                this.cellSize - 2
            );
        });
        this.ctx.shadowBlur = 0;
    }
}
