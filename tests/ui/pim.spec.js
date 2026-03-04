import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/login.page.js';
import PimPage from '../../pages/pim.page.js';
import loginData from '../../data/loginData.js';

test.describe('PIM Employee Lifecycle Management', () => {
    let pimPage;
   
    const firstName = 'Playwright';
    const lastName = 'Expert_' + Date.now(); 
    const middleName = 'Automation';

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        pimPage = new PimPage(page);

        
        await loginPage.gotoLoginPage();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password);
        await expect(page).toHaveURL(/dashboard/);
    });

    test('Full Employee Lifecycle: Add, Search, Edit, and Delete', async ({ page }) => {
        
        await pimPage.navigateToPIM();
        await pimPage.clickAddEmployee();
        await pimPage.addEmployee(firstName, lastName);

        
        await pimPage.searchEmployee(firstName);
        const employeeRow = page.locator('.oxd-table-card', { hasText: lastName });
        await expect(employeeRow).toBeVisible();

       
        await pimPage.editEmployee(middleName);

    
        await pimPage.navigateToPIM(); 
        await pimPage.searchEmployee(firstName);
        await pimPage.deleteEmployee(lastName);
    
        await pimPage.searchEmployee(firstName);
        await expect(page.locator('.oxd-table-card-container').getByText('No Records Found')).toBeVisible();
    });
});
