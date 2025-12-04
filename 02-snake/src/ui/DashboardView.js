
import { api } from '../api/mockApi.js';

export class DashboardView {
    constructor(callbacks) {
        this.callbacks = callbacks; // { onPlayWalls, onPlayWrap, onLeaderboard, onWatch, onLogout }
        this.element = document.createElement('div');
        this.element.className = 'glass-panel';
    }

    render() {
        const user = api.getCurrentUser();
        this.element.innerHTML = `
      <div class="nav-header">
        <span>Welcome, <span class="user-info">${user ? user.username : 'Guest'}</span></span>
        <button id="logout-btn" class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem; margin:0;">Logout</button>
      </div>
      <h1>Dashboard</h1>
      
      <div class="flex flex-col gap-4">
        <button id="play-walls" class="btn btn-primary">Play: Walls Mode</button>
        <button id="play-wrap" class="btn btn-primary">Play: Pass-through Mode</button>
        <button id="view-leaderboard" class="btn btn-secondary">Leaderboard</button>
        <button id="watch-stream" class="btn btn-secondary">Watch Live (Multiplayer)</button>
      </div>
    `;

        this.element.querySelector('#logout-btn').addEventListener('click', () => {
            api.logout();
            this.callbacks.onLogout();
        });

        this.element.querySelector('#play-walls').addEventListener('click', () => this.callbacks.onPlayWalls());
        this.element.querySelector('#play-wrap').addEventListener('click', () => this.callbacks.onPlayWrap());
        this.element.querySelector('#view-leaderboard').addEventListener('click', () => this.callbacks.onLeaderboard());
        this.element.querySelector('#watch-stream').addEventListener('click', () => this.callbacks.onWatch());

        return this.element;
    }
}
