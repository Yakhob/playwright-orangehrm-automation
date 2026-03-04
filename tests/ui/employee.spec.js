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

        // 1. Login
        await loginPage.gotoLoginPage();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password);
        await expect(page).toHaveURL(/dashboard/);

        // 2. Create Employee
        await pimPage.navigateToPIM();
        await pimPage.clickAddEmployee();
        await pimPage.addEmployee(firstName, lastName);

        // Verify transition to Personal Details
        await page.waitForURL(/viewPersonalDetails/);
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 15000 });

        // 3. Search and Verify in Table
        // We use the fullName for the search input but check for lastName in the results
        await pimPage.searchEmployee(fullName);
        await expect(pimPage.employeeTable).toContainText(lastName);

        // 4. Edit Employee
        // The editEmployee method in your POM should now wait for the 'Success' toast
        await pimPage.editEmployee('Updated');
        
        // IMPORTANT: After saving, we must ensure the data is re-loaded into the field
        // We wait for the network to be idle to ensure the 'GET' request for details is finished
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
        
        // Assert value with a generous timeout to account for slow backend population
        await expect(pimPage.middleNameInput).toHaveValue('Updated', { timeout: 10000 });

        // 5. Delete Employee (Lifecycle Completion)
        await pimPage.navigateToPIM(); 
        await pimPage.searchEmployee(fullName);
        await pimPage.deleteEmployee(lastName);

        // 6. Final Verification (Ensure data is wiped)
        // Resetting search to ensure we have a clean slate
        await pimPage.employeeNameSearch.fill(fullName);
        await pimPage.searchButton.click();
        
        // Assert the "No Records Found" state
        await expect(pimPage.noRecordsMessage).toBeVisible();
    });

});