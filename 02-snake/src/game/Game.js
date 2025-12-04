
import { Snake } from './Snake.js';

export class Game {
    constructor(width = 20, height = 20, mode = 'walls') {
        this.width = width;
        this.height = height;
        this.mode = mode; // 'walls' or 'wrap'
        this.snake = new Snake(Math.floor(width / 2), Math.floor(height / 2));
        this.food = this.spawnFood();
        this.score = 0;
        this.status = 'playing'; // 'playing', 'gameover'
        this.onGameOver = null;
    }

    spawnFood() {
        let food;
        while (true) {
            food = {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height),
            };
            // Ensure food doesn't spawn on snake
            const onSnake = this.snake.body.some(
                (segment) => segment.x === food.x && segment.y === food.y
            );
            if (!onSnake) break;
        }
        return food;
    }

    tick() {
        if (this.status !== 'playing') return;

        this.snake.move({ width: this.width, height: this.height }, this.mode);

        // Check collisions
        if (this.mode === 'walls' && this.snake.checkWallCollision({ width: this.width, height: this.height })) {
            this.gameOver();
            return;
        }

        if (this.snake.checkSelfCollision()) {
            this.gameOver();
            return;
        }

        // Check food
        const head = this.snake.body[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.snake.grow();
            this.score += 10;
            this.food = this.spawnFood();
        }
    }

    gameOver() {
        this.status = 'gameover';
        if (this.onGameOver) this.onGameOver(this.score);
    }

    setDirection(dir) {
        this.snake.setDirection(dir);
    }
}
