class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        
        this.dashboardHeading = page.locator('h6:has-text("Dashboard")');
        this.errorMessage = page.locator('.oxd-alert-content-text');
    }
    
    async gotoLoginPage() {
       
        await this.page.goto('/web/index.php/auth/login', { 
            waitUntil: 'domcontentloaded', 
            timeout: 60000 
        });

      
        await this.usernameInput.waitFor({ state: 'visible', timeout: 60000 });
    }

   
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

export default LoginPage;
