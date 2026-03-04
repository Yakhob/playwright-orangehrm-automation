import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/login.page.js';
import PimPage from '../../pages/pim.page.js';
import loginData from '../../data/loginData.js';

test.describe('PIM Employee Lifecycle Management', () => {
    let pimPage;
    // Using Date.now() ensures every test run uses a unique employee name
    const firstName = 'Playwright';
    const lastName = 'Expert_' + Date.now(); 
    const middleName = 'Automation';

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        pimPage = new PimPage(page);

        // Requirement: Validate Login Workflow
        await loginPage.gotoLoginPage();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password);
        await expect(page).toHaveURL(/dashboard/);
    });

    test('Full Employee Lifecycle: Add, Search, Edit, and Delete', async ({ page }) => {
        // Step 2: Automate employee creation
        await pimPage.navigateToPIM();
        await pimPage.clickAddEmployee();
        await pimPage.addEmployee(firstName, lastName);

        // Step 3 & 4: Verify record in list using search
        // This validates the requirement "Search by Employee Name"
        await pimPage.searchEmployee(firstName);
        const employeeRow = page.locator('.oxd-table-card', { hasText: lastName });
        await expect(employeeRow).toBeVisible();

        // Step 5: Edit the employee details
        await pimPage.editEmployee(middleName);

        // Step 6: Delete the employee record
        await pimPage.navigateToPIM(); 
        await pimPage.searchEmployee(firstName);
        await pimPage.deleteEmployee(lastName);

        // Requirement: Negative Scenario
        // Verify the record no longer exists after deletion
        await pimPage.searchEmployee(firstName);
        await expect(page.locator('.oxd-table-card-container').getByText('No Records Found')).toBeVisible();
    });
});