
import { api } from '../api/mockApi.js';

export class LoginView {
    constructor(onLoginSuccess, onNavigateSignup) {
        this.onLoginSuccess = onLoginSuccess;
        this.onNavigateSignup = onNavigateSignup;
        this.element = document.createElement('div');
        this.element.className = 'glass-panel';
    }

    render() {
        this.element.innerHTML = `
      <h1>Neon Snake</h1>
      <h2>Login</h2>
      <div class="error-msg" id="login-error"></div>
      <form id="login-form">
        <label for="username">Username</label>
        <input type="text" id="username" required placeholder="Enter username" />
        
        <label for="password">Password</label>
        <input type="password" id="password" required placeholder="Enter password" />
        
        <button type="submit" class="btn btn-primary">Log In</button>
        <button type="button" id="go-signup" class="btn btn-secondary">Sign Up</button>
      </form>
    `;

        this.element.querySelector('#login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = this.element.querySelector('#username').value;
            const pass = this.element.querySelector('#password').value;
            const errorEl = this.element.querySelector('#login-error');

            try {
                errorEl.textContent = 'Logging in...';
                await api.login(user, pass);
                this.onLoginSuccess();
            } catch (err) {
                errorEl.textContent = err.message;
            }
        });

        this.element.querySelector('#go-signup').addEventListener('click', () => {
            this.onNavigateSignup();
        });

        return this.element;
    }
}

export class SignupView {
    constructor(onSignupSuccess, onNavigateLogin) {
        this.onSignupSuccess = onSignupSuccess;
        this.onNavigateLogin = onNavigateLogin;
        this.element = document.createElement('div');
        this.element.className = 'glass-panel';
    }

    render() {
        this.element.innerHTML = `
      <h1>Neon Snake</h1>
      <h2>Sign Up</h2>
      <div class="error-msg" id="signup-error"></div>
      <form id="signup-form">
        <label for="s-username">Username</label>
        <input type="text" id="s-username" required placeholder="Choose username" />
        
        <label for="s-password">Password</label>
        <input type="password" id="s-password" required placeholder="Choose password" />
        
        <button type="submit" class="btn btn-primary">Create Account</button>
        <button type="button" id="go-login" class="btn btn-secondary">Back to Login</button>
      </form>
    `;

        this.element.querySelector('#signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = this.element.querySelector('#s-username').value;
            const pass = this.element.querySelector('#s-password').value;
            const errorEl = this.element.querySelector('#signup-error');

            try {
                errorEl.textContent = 'Creating account...';
                await api.signup(user, pass);
                this.onSignupSuccess();
            } catch (err) {
                errorEl.textContent = err.message;
            }
        });

        this.element.querySelector('#go-login').addEventListener('click', () => {
            this.onNavigateLogin();
        });

        return this.element;
    }
}
