class LoginPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        
        // This locator is used for post-login verification
        this.dashboardHeading = page.locator('h6:has-text("Dashboard")');
        
        // Locator for the error message shown during invalid login
        this.errorMessage = page.locator('.oxd-alert-content-text');
    }

    /**
     * Navigates to the login page using the baseURL from playwright.config.js
     */
    async gotoLoginPage() {
        // Navigating to the relative path is cleaner as it uses the baseURL
        await this.page.goto('/web/index.php/auth/login', { 
            waitUntil: 'domcontentloaded', 
            timeout: 60000 
        });

        // Ensure login form is interactive before proceeding
        await this.usernameInput.waitFor({ state: 'visible', timeout: 60000 });
    }

    /**
     * Performs the login action without asserting the result.
     * This allows the test to decide if it expects a success or a failure.
     */
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        
        // We do not wait for a URL change here to avoid timeouts 
        // when credentials are intentionally invalid.
        await this.loginButton.click();
    }
}

export default LoginPage;