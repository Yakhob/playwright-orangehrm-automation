import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/login.page.js';
import DashboardPage from '../../pages/dashboard.page.js';
import loginData from '../../data/loginData.js';

test.describe('Login & Logout Tests', () => {

    test('Validate login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.gotoLoginPage();
        await loginPage.login(
            loginData.validUser.username,
            loginData.validUser.password
        );

        await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
        await expect(
            page.locator('.oxd-topbar-header-breadcrumb')
        ).toBeVisible();
    });

    test('Validate login with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.gotoLoginPage();
        await loginPage.login(
            loginData.invalidUser.username,
            loginData.invalidUser.password
        );

        const alert = page.locator('.oxd-alert');
        await expect(alert).toBeVisible();
        await expect(alert).toContainText('Invalid credentials');
    });

    test('Validate logout functionality', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await loginPage.gotoLoginPage();
        await loginPage.login(
            loginData.validUser.username,
            loginData.validUser.password
        );

        await expect(page).toHaveURL(/dashboard/);
        
        await dashboardPage.logout();

        // Verify the logout redirected back to the login page
        await expect(page).toHaveURL(/login/, { timeout: 10000 });
    });

});
