import { expect } from '@playwright/test'; // CRITICAL: Added this import

class PimPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.pimMenu = page.locator('a[href*="pim/viewPimModule"]');
        this.employeeListMenu = page.getByRole('link', { name: 'Employee List' });
        this.addEmployeeMenu = page.getByRole('link', { name: 'Add Employee' });

        // Form Fields
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');

        // Buttons
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });

        // Search & Table
        this.employeeNameSearch = page.getByPlaceholder('Type for hints...').first();
        this.employeeTable = page.locator('.oxd-table-body');
        this.noRecordsMessage = page.locator('text=No Records Found');
        
        // Success Toast
        this.successToast = page.locator('.oxd-toast-content-text');
    }

    async navigateToPIM() {
        await this.pimMenu.click();
        await this.employeeNameSearch.waitFor({ state: 'visible', timeout: 15000 });
    }

    async clickAddEmployee() {
        await this.addEmployeeMenu.click();
        await this.firstNameInput.waitFor({ state: 'visible' });
    }

    async addEmployee(firstName, lastName) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.saveButton.click();
        
        // Use a regex for toast text to be more flexible
        await expect(this.successToast).toHaveText(/Successfully Saved/, { timeout: 10000 });
        await this.page.getByRole('heading', { name: 'Personal Details' }).waitFor();
    }

    async searchEmployee(name) {
        await this.employeeListMenu.click();
        await this.employeeNameSearch.fill(name);
        
        // FIX: Corrected the autocomplete option selector
        const suggestion = this.page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');
        await suggestion.first().waitFor({ state: 'visible' });
        await suggestion.first().click();

        await this.searchButton.click();
        // Wait for table to refresh (spinner gone)
        await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached' });
    }

    async editEmployee(middleName) {
        // FIX: More robust pencil icon locator
        await this.page.locator('.oxd-table-cell-actions .bi-pencil-fill').first().click();
        
        await this.page.getByRole('heading', { name: 'Personal Details' }).waitFor();
        await this.page.waitForLoadState('networkidle');

        // Clear and fill middle name
        await this.middleNameInput.click({ clickCount: 3 });
        await this.page.keyboard.press('Backspace');
        await this.middleNameInput.fill(middleName);

        await this.saveButton.click();
        await expect(this.successToast).toHaveText(/Successfully Updated/);
    }

    async deleteEmployee(lastName) {
        // Find row by text and click trash icon
        const row = this.page.locator('.oxd-table-card', { hasText: lastName });
        await row.locator('.bi-trash').click();
        
        await this.confirmDeleteButton.click();
        await expect(this.successToast).toHaveText(/Successfully Deleted/);
    }
}

export default PimPage;