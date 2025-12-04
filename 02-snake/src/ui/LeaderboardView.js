
import { api } from '../api/mockApi.js';

export class LeaderboardView {
    constructor(onBack) {
        this.onBack = onBack;
        this.element = document.createElement('div');
        this.element.className = 'glass-panel';
    }

    async render() {
        this.element.innerHTML = `
      <div class="nav-header">
        <h2>Leaderboard</h2>
        <button id="back-btn" class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem; margin:0;">Back</button>
      </div>
      <div id="loading">Loading scores...</div>
      <table id="scores-table" class="hidden">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody id="scores-body"></tbody>
      </table>
    `;

        this.element.querySelector('#back-btn').addEventListener('click', () => this.onBack());

        const scores = await api.getLeaderboard();
        this.populate(scores);

        return this.element;
    }

    populate(scores) {
        const loading = this.element.querySelector('#loading');
        const table = this.element.querySelector('#scores-table');
        const tbody = this.element.querySelector('#scores-body');

        loading.classList.add('hidden');
        table.classList.remove('hidden');

        tbody.innerHTML = scores.map((s, i) => `
      <tr>
        <td class="rank-${i + 1}">${i + 1}</td>
        <td>${s.username}</td>
        <td>${s.score}</td>
      </tr>
    `).join('');
    }
}
