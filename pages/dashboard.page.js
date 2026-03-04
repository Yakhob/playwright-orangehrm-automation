class DashboardPage {
    constructor(page) {
        this.page = page;


        this.profileDropdown = page.locator('.oxd-userdropdown-name');
       
        this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    }

    async logout() {
     
        await this.profileDropdown.click();
        await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.logoutButton.click();
        
        await this.page.waitForURL(/login/);
    }
}

export default DashboardPage;
