
const STORAGE_KEY_USERS = 'snake_users';
const STORAGE_KEY_SCORES = 'snake_scores';

class MockApi {
    constructor() {
        if (!localStorage.getItem(STORAGE_KEY_USERS)) {
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEY_SCORES)) {
            localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify([
                { username: 'SnakeMaster', score: 1500 },
                { username: 'Pythonista', score: 1200 },
                { username: 'Viper', score: 900 },
            ]));
        }
        this.currentUser = null;
    }

    async login(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS));
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    this.currentUser = user;
                    resolve({ username: user.username });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    }

    async signup(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS));
                if (users.find(u => u.username === username)) {
                    reject(new Error('Username already taken'));
                } else {
                    const newUser = { username, password };
                    users.push(newUser);
                    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
                    this.currentUser = newUser;
                    resolve({ username: newUser.username });
                }
            }, 500);
        });
    }

    logout() {
        this.currentUser = null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async getLeaderboard() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const scores = JSON.parse(localStorage.getItem(STORAGE_KEY_SCORES));
                resolve(scores.sort((a, b) => b.score - a.score));
            }, 300);
        });
    }

    async saveScore(score) {
        if (!this.currentUser) return;
        const scores = JSON.parse(localStorage.getItem(STORAGE_KEY_SCORES));
        scores.push({ username: this.currentUser.username, score });
        localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
    }

    async getStreams() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', username: 'ProPlayer1', score: 450 },
                    { id: '2', username: 'NoobSnake', score: 10 },
                    { id: '3', username: 'AI_Bot', score: 9999 },
                ]);
            }, 300);
        });
    }
}

export const api = new MockApi();
