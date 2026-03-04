import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/login.page.js';
import PimPage from '../../pages/pim.page.js';
import employeeData from '../../data/employeeData.js';
import loginData from '../../data/loginData.js';

test.describe('PIM Module: Full Employee Lifecycle', () => {

    test('Create, Search, Edit and Delete employee in PIM module', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const pimPage = new PimPage(page);

        const { firstName, lastName } = employeeData.employee;
        const fullName = `${firstName} ${lastName}`;

        await loginPage.gotoLoginPage();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password);
        await expect(page).toHaveURL(/dashboard/);
        
        await pimPage.navigateToPIM();
        await pimPage.clickAddEmployee();
        await pimPage.addEmployee(firstName, lastName);

        await page.waitForURL(/viewPersonalDetails/);
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 15000 });

        await pimPage.searchEmployee(fullName);
        await expect(pimPage.employeeTable).toContainText(lastName);

        
        await pimPage.editEmployee('Updated');
        
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
    
        await expect(pimPage.middleNameInput).toHaveValue('Updated', { timeout: 10000 });

        await pimPage.navigateToPIM(); 
        await pimPage.searchEmployee(fullName);
        await pimPage.deleteEmployee(lastName);
        await pimPage.employeeNameSearch.fill(fullName);
        await pimPage.searchButton.click();
        
        // Assert the "No Records Found" state
        await expect(pimPage.noRecordsMessage).toBeVisible();
    });

});
