class DashboardPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.profileDropdown = page.locator('.oxd-userdropdown-name');
        // It is safer to use getByRole for menu items to ensure accessibility
        this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    }

    async logout() {
        // 1. Click the profile dropdown
        await this.profileDropdown.click();

        // 2. Stability: Wait for the logout button to be visible before clicking
        // This prevents "element not clickable" errors in slower browsers like Firefox
        await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });

        // 3. Perform the logout action
        await this.logoutButton.click();
        
        // 4. Optional: Wait for the login URL to confirm logout started
        await this.page.waitForURL(/login/);
    }
}

export default DashboardPage;