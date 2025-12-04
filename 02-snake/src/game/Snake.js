
export class Snake {
    constructor(startX = 10, startY = 10) {
        this.body = [{ x: startX, y: startY }];
        this.direction = { x: 1, y: 0 }; // Moving right initially
        this.growPending = 0;
    }

    setDirection(newDir) {
        // Prevent 180 degree turns
        if (this.direction.x + newDir.x === 0 && this.direction.y + newDir.y === 0) {
            return;
        }
        this.direction = newDir;
    }

    move(bounds, mode) {
        const head = { ...this.body[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Handle bounds based on mode
        if (mode === 'wrap') {
            if (head.x < 0) head.x = bounds.width - 1;
            if (head.x >= bounds.width) head.x = 0;
            if (head.y < 0) head.y = bounds.height - 1;
            if (head.y >= bounds.height) head.y = 0;
        } else {
            // Walls mode: collision handled by Game class or checkCollision
            // But we still update position here.
        }

        this.body.unshift(head);

        if (this.growPending > 0) {
            this.growPending--;
        } else {
            this.body.pop();
        }
    }

    grow() {
        this.growPending++;
    }

    checkSelfCollision() {
        const head = this.body[0];
        // Start from index 1 to avoid checking head against itself
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    checkWallCollision(bounds) {
        const head = this.body[0];
        return (
            head.x < 0 ||
            head.x >= bounds.width ||
            head.y < 0 ||
            head.y >= bounds.height
        );
    }
}
