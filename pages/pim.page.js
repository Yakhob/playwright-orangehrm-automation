import { expect } from '@playwright/test';

class PimPage {
    constructor(page) {
        this.page = page;
        
        this.pimMenu = page.locator('a[href*="pim/viewPimModule"]');
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();

       
        this.employeeTable = page.locator('.oxd-table-body'); 
        this.noRecordsMessage = page.locator('.orangehrm-horizontal-padding > .oxd-text');
        this.successToast = page.locator('.oxd-toast-content-text').last();
       

        this.employeeNameSearch = page.getByPlaceholder('Type for hints...').first();
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
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
        
        
        await expect(this.successToast).toHaveText(/Successfully Saved/, { timeout: 10000 });
        await this.page.getByRole('heading', { name: 'Personal Details' }).waitFor();
    }

    async searchEmployee(name) {
        await this.employeeListMenu.click();
        await this.employeeNameSearch.fill(name);
        
        
        const suggestion = this.page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');
        await suggestion.first().waitFor({ state: 'visible' });
        await suggestion.first().click();

        await this.searchButton.click();
        await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached' });
    }

    async editEmployee(middleName) {
       
        await this.page.locator('.oxd-table-cell-actions .bi-pencil-fill').first().click();
        
        await this.page.getByRole('heading', { name: 'Personal Details' }).waitFor();
        await this.page.waitForLoadState('networkidle');

        await this.middleNameInput.click({ clickCount: 3 });
        await this.page.keyboard.press('Backspace');
        await this.middleNameInput.fill(middleName);

        await this.saveButton.click();
        await expect(this.successToast).toHaveText(/Successfully Updated/);
    }

    async deleteEmployee(lastName) {
        const row = this.page.locator('.oxd-table-card', { hasText: lastName });
        await row.locator('.bi-trash').click();
        
        await this.confirmDeleteButton.click();
        await expect(this.successToast).toHaveText(/Successfully Deleted/);
    }
}

export default PimPage;
