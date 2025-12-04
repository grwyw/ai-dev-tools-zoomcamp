
import { describe, it, expect } from 'vitest';
import { Game } from '../src/game/Game';
import { Snake } from '../src/game/Snake';

describe('Snake Game Logic', () => {
    it('should initialize correctly', () => {
        const game = new Game(20, 20, 'walls');
        expect(game.score).toBe(0);
        expect(game.status).toBe('playing');
        expect(game.snake.body.length).toBe(1);
    });

    it('should move the snake', () => {
        const game = new Game(20, 20, 'walls');
        const startHead = { ...game.snake.body[0] };
        game.tick();
        const newHead = game.snake.body[0];
        expect(newHead.x).toBe(startHead.x + 1); // Default dir is right (1, 0)
        expect(newHead.y).toBe(startHead.y);
    });

    it('should die on wall collision in walls mode', () => {
        const game = new Game(10, 10, 'walls');
        game.snake.body[0] = { x: 9, y: 5 }; // At right edge
        game.setDirection({ x: 1, y: 0 }); // Move right into wall
        game.tick();
        expect(game.status).toBe('gameover');
    });

    it('should wrap around in wrap mode', () => {
        const game = new Game(10, 10, 'wrap');
        game.snake.body[0] = { x: 9, y: 5 }; // At right edge
        game.setDirection({ x: 1, y: 0 }); // Move right
        game.tick();
        expect(game.status).toBe('playing');
        expect(game.snake.body[0].x).toBe(0); // Wrapped to left
    });

    it('should eat food and grow', () => {
        const game = new Game(20, 20, 'walls');
        const head = game.snake.body[0];
        // Place food right in front of snake
        game.food = { x: head.x + 1, y: head.y };

        game.tick();

        expect(game.score).toBe(10);
        // Growth happens on next move because move() happened before eating
        expect(game.snake.body.length).toBe(1);
        expect(game.snake.growPending).toBe(1);

        game.tick();
        expect(game.snake.body.length).toBe(2);
    });

    it('should die on self collision', () => {
        const game = new Game(20, 20, 'walls');
        // Setup a snake that hits its middle body
        // Head (5,5). Moving Right (1,0) -> (6,5).
        // Body needs to block (6,5).
        // Shape:
        // (5,5) -> Head
        // (5,4)
        // (6,4)
        // (6,5) -> Target
        // (6,6) -> Tail

        game.snake.body = [
            { x: 5, y: 5 },
            { x: 5, y: 4 },
            { x: 6, y: 4 },
            { x: 6, y: 5 },
            { x: 6, y: 6 }
        ];

        game.setDirection({ x: 1, y: 0 }); // Right
        game.tick();

        expect(game.status).toBe('gameover');
    });
});
