
import './style.css';
import { api } from './src/api/mockApi.js';
import { LoginView, SignupView } from './src/ui/LoginView.js';
import { DashboardView } from './src/ui/DashboardView.js';
import { GameView } from './src/ui/GameView.js';
import { LeaderboardView } from './src/ui/LeaderboardView.js';
import { WatchView } from './src/ui/WatchView.js';

const app = document.querySelector('#app');

function navigate(viewName, params = {}) {
    app.innerHTML = '';
    let view;

    switch (viewName) {
        case 'login':
            view = new LoginView(
                () => navigate('dashboard'),
                () => navigate('signup')
            );
            break;
        case 'signup':
            view = new SignupView(
                () => navigate('dashboard'),
                () => navigate('login')
            );
            break;
        case 'dashboard':
            view = new DashboardView({
                onPlayWalls: () => navigate('game', { mode: 'walls' }),
                onPlayWrap: () => navigate('game', { mode: 'wrap' }),
                onLeaderboard: () => navigate('leaderboard'),
                onWatch: () => navigate('watch'),
                onLogout: () => navigate('login')
            });
            break;
        case 'game':
            view = new GameView(
                params.mode,
                () => navigate('dashboard')
            );
            break;
        case 'leaderboard':
            view = new LeaderboardView(
                () => navigate('dashboard')
            );
            break;
        case 'watch':
            view = new WatchView(
                () => navigate('dashboard')
            );
            break;
        default:
            view = new LoginView(() => navigate('dashboard'));
    }

    const element = view.render();
    // Handle async render if it returns a promise
    if (element instanceof Promise) {
        element.then(el => app.appendChild(el));
    } else {
        app.appendChild(element);
    }
}

// Check auth
const user = api.getCurrentUser();
if (user) {
    navigate('dashboard');
} else {
    navigate('login');
}
