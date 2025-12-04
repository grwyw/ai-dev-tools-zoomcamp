
import { Game } from '../game/Game.js';
import { api } from '../api/mockApi.js';

export class WatchView {
    constructor(onBack) {
        this.onBack = onBack;
        this.element = document.createElement('div');
        this.element.className = 'glass-panel large';
        this.canvas = null;
        this.ctx = null;
        this.game = null;
        this.intervalId = null;
        this.cellSize = 20;
        this.streamerName = 'Unknown';
    }

    async render() {
        this.element.innerHTML = `
      <div class="nav-header">
        <span>Watching: <span id="streamer-name" class="user-info">Loading...</span></span>
        <button id="back-btn" class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem; margin:0;">Leave</button>
      </div>
      <canvas id="game-canvas" width="600" height="400"></canvas>
      <div id="stream-list" class="flex gap-4" style="margin-top: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
        <!-- Stream thumbnails/buttons -->
      </div>
    `;

        this.canvas = this.element.querySelector('#game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.element.querySelector('#back-btn').addEventListener('click', () => this.stopAndExit());

        const streams = await api.getStreams();
        this.renderStreamList(streams);

        if (streams.length > 0) {
            this.watchStream(streams[0]);
        }

        return this.element;
    }

    renderStreamList(streams) {
        const list = this.element.querySelector('#stream-list');
        list.innerHTML = streams.map(s => `
      <button class="btn btn-secondary stream-select" data-id="${s.id}" style="min-width: 120px;">
        ${s.username}<br>
        <span style="font-size: 0.8em; color: var(--primary)">${s.score} pts</span>
      </button>
    `).join('');

        list.querySelectorAll('.stream-select').forEach(btn => {
            btn.addEventListener('click', () => {
                const stream = streams.find(s => s.id === btn.dataset.id);
                this.watchStream(stream);
            });
        });
    }

    watchStream(stream) {
        this.streamerName = stream.username;
        this.element.querySelector('#streamer-name').textContent = stream.username;

        // Reset game
        if (this.intervalId) clearInterval(this.intervalId);

        const cols = this.canvas.width / this.cellSize;
        const rows = this.canvas.height / this.cellSize;
        this.game = new Game(cols, rows, 'walls'); // Assume walls for streams

        // Simulate some progress
        this.game.score = stream.score;
        // Grow snake to match score roughly
        for (let i = 0; i < Math.floor(stream.score / 10); i++) {
            this.game.snake.body.push({ x: -1, y: -1 }); // Dummy growth
        }

        this.intervalId = setInterval(() => {
            this.botMove();
            this.game.tick();
            if (this.game.status === 'gameover') {
                // Restart stream simulation
                this.game = new Game(cols, rows, 'walls');
            }
            this.draw();
        }, 100);
    }

    botMove() {
        // Simple bot: try to move towards food, avoid immediate collision
        const head = this.game.snake.body[0];
        const food = this.game.food;
        const dx = food.x - head.x;
        const dy = food.y - head.y;

        let moves = [
            { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
        ];

        // Filter out moves that kill immediately
        moves = moves.filter(m => {
            const nextX = head.x + m.x;
            const nextY = head.y + m.y;
            // Check walls
            if (nextX < 0 || nextX >= this.game.width || nextY < 0 || nextY >= this.game.height) return false;
            // Check self (simple check against body)
            // We need to access snake body.
            // This is a rough check.
            return !this.game.snake.body.some(s => s.x === nextX && s.y === nextY);
        });

        if (moves.length === 0) return; // Die

        // Sort moves by distance to food
        moves.sort((a, b) => {
            const distA = Math.abs((head.x + a.x) - food.x) + Math.abs((head.y + a.y) - food.y);
            const distB = Math.abs((head.x + b.x) - food.x) + Math.abs((head.y + b.y) - food.y);
            return distA - distB;
        });

        // Pick best move
        this.game.setDirection(moves[0]);
    }

    stopAndExit() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.onBack();
    }

    draw() {
        // Reuse draw logic or import renderer. For speed, copy-paste simple draw.
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Food
        this.ctx.fillStyle = '#a855f7';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#a855f7';
        this.ctx.fillRect(
            this.game.food.x * this.cellSize,
            this.game.food.y * this.cellSize,
            this.cellSize - 2,
            this.cellSize - 2
        );
        this.ctx.shadowBlur = 0;

        // Snake
        this.ctx.fillStyle = '#3b82f6'; // Blue for other players
        this.game.snake.body.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#3b82f6';
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
