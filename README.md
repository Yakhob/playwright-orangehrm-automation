## OrangeHRM Test Automation Project

This project contains a suite of automated UI tests for the OrangeHRM open-source application using Playwright. It covers core functionalities including user authentication and the Employee Management (PIM) lifecycle.

---

### Project Structure

The project follows the Page Object Model (POM) design pattern to ensure code reusability and maintainability.

* **`pages/`**: Contains Page Object classes (`login.page.js`, `dashboard.page.js`, `pim.page.js`) that encapsulate page-specific locators and actions.
* **`tests/ui/`**: Contains the test specifications (`login.spec.js`, `employee.spec.js`).
* **`data/`**: Stores test data in JSON or JavaScript objects to keep the test logic clean.
* **`playwright.config.js`**: Global configuration for timeouts, browser projects, and execution settings.

---

### Test Coverage

#### 1. Login and Logout

* Validation of successful login with valid credentials.
* Validation of error messages for invalid credentials.
* Validation of the logout process and redirection to the login page.

#### 2. PIM Module (Employee Lifecycle)

* **Create**: Adding a new employee with a unique ID.
* **Search**: Locating the created employee using the search filter.
* **Edit**: Updating employee details (e.g., Middle Name) and verifying the change.
* **Delete**: Removing the employee record and verifying the deletion.

---

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (installed with Node.js)

---

### Installation

1. Clone the repository or extract the project files.
2. Navigate to the project root directory in your terminal.
3. Install dependencies:
```bash
npm install

```


4. Install Playwright browsers:
```bash
npx playwright install

```



---

### Running Tests

**Run all tests in headless mode:**

```bash
npx playwright test

```

**Run tests in a specific browser:**

```bash
npx playwright test --project=chromium

```

**Run tests with the UI header visible (Headed mode):**

```bash
npx playwright test --headed

```

**View the test report after execution:**

```bash
npx playwright show-report

```

---

### Stability and Configuration Notes

* **Sequential Execution**: The configuration is set to `workers: 1` to ensure CRUD operations on the PIM module do not conflict with each other.
* **Synchronization**: The framework utilizes explicit waits for toast notifications and network idle states to handle the asynchronous nature of the OrangeHRM application.
* **Cross-Browser Support**: Tests are configured to run across Chromium, Firefox, and WebKit.
