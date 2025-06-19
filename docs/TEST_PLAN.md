# Conceptual Test Plan

**Prerequisites:**
1.  Backend server (`knowledge_base_backend`) is running (e.g., `INFO: Uvicorn running on http://127.0.0.1:8000`).
2.  The `.env` file in `knowledge_base_backend` has a defined `API_KEY`.
3.  `knowledge_base_frontend_basic/index.html` is open in a browser.
4.  The correct API key (from the `.env` file) is entered into the API Key input field on the webpage.

**Test Cases:**

**I. General Backend Health & Frontend Connectivity:**
    1.  **Test Case:** Fetch initial (empty) data for each knowledge type.
        *   **Action:** On the webpage, click "Fetch Branch Updates", then "Fetch Bug Reports", "Fetch Solution Knowledge", and "Fetch General Messages".
        *   **Expected Outcome (Frontend):** The display area for each should show an empty list (e.g., `[]`) or a message indicating no items, without browser console errors.
        *   **Expected Outcome (Backend Terminal):** You should see `GET` requests logged for each endpoint (e.g., `GET /generalmessages/ HTTP/1.1" 200 OK`), indicating successful API calls.

**II. `GeneralMessage` Workflow:**
    1.  **Test Case:** Submit a new `GeneralMessage`.
        *   **Action (Frontend):**
            *   Fill in the "Submit General Message" form:
                *   `Message Text`: "Test message for GeneralMessage workflow."
                *   `Author AI ID`: "UserTester01"
                *   `Tags (comma-separated)`: "test, general, initial"
            *   Click "Submit General Message".
        *   **Expected Outcome (Frontend):**
            *   The form might clear.
            *   The newly submitted message (or a success confirmation) should appear in the "General Messages" display area, or the main display area for created objects.
            *   No browser console errors.
        *   **Expected Outcome (Backend Terminal):** A `POST /generalmessages/ HTTP/1.1" 200 OK` (or `201 Created`) logged.
    2.  **Test Case:** Fetch the submitted `GeneralMessage`.
        *   **Action (Frontend):** Click "Fetch General Messages".
        *   **Expected Outcome (Frontend):** The message submitted in II.1 should be visible, correctly displaying all fields.

**III. `BugReport` Workflow:**
    1.  **Test Case:** Submit a new `BugReport`.
        *   **Action (Frontend):**
            *   Fill in the "Submit Bug Report" form:
                *   `Description`: "Test bug: Button color is incorrect on hover."
                *   `File Path (optional)`: `static/css/main.css`
                *   `Line Number (optional)`: `42`
                *   `Discovered By AI ID`: "UserTester01"
            *   Click "Submit Bug Report".
        *   **Expected Outcome (Frontend & Backend):** Similar to II.1 (form clear/confirmation, item appears on fetch, POST logged).
    2.  **Test Case:** Fetch the submitted `BugReport`.
        *   **Action (Frontend):** Click "Fetch Bug Reports".
        *   **Expected Outcome (Frontend):** The bug report from III.1 should be visible.

**IV. `BranchUpdate` Workflow:**
    1.  **Test Case:** Submit a new `BranchUpdate`.
        *   **Action (Frontend):**
            *   Fill in the "Submit Branch Update" form:
                *   `Branch Name`: "feature/test-branch-submission"
                *   `Summary`: "Testing branch update submission functionality."
                *   `Author AI ID`: "UserTester01"
            *   Click "Submit Branch Update".
        *   **Expected Outcome (Frontend & Backend):** Similar to II.1.
    2.  **Test Case:** Fetch the submitted `BranchUpdate`.
        *   **Action (Frontend):** Click "Fetch Branch Updates".
        *   **Expected Outcome (Frontend):** The branch update from IV.1 should be visible.

**V. `SolutionKnowledge` Workflow (depends on a `BugReport`):**
    1.  **Test Case:** Submit a `SolutionKnowledge` for the bug in III.1.
        *   **Action (Frontend):**
            *   First, note the ID of the `BugReport` created in III.1 (it will be shown when you fetch/display it). Let's assume its ID is `1` for this test.
            *   Fill in the "Submit Solution Knowledge" form:
                *   `Problem Description`: "Addressing bug: Button color."
                *   `Solution Description`: "Updated CSS hex code for hover state."
                *   `Author AI ID`: "UserTester01"
                *   `Verified Working (checkbox)`: Checked (True)
                *   `Related Bug ID (optional)`: `1` (the ID of the bug from III.1)
            *   Click "Submit Solution Knowledge".
        *   **Expected Outcome (Frontend & Backend):** Similar to II.1.
    2.  **Test Case:** Fetch the submitted `SolutionKnowledge`.
        *   **Action (Frontend):** Click "Fetch Solution Knowledge".
        *   **Expected Outcome (Frontend):** The solution from V.1 should be visible, including the `related_bug_id`.

**VI. API Key Validation:**
    1.  **Test Case:** Attempt to fetch data with an incorrect API key.
        *   **Action (Frontend):** Change the API key in the input field to something incorrect (e.g., "WRONG_KEY"). Click "Fetch General Messages".
        *   **Expected Outcome (Frontend):** An error message should be displayed, or no data fetched. Browser console might show a 401 or 403 error.
        *   **Expected Outcome (Backend Terminal):** Request logged, but with a `401 Unauthorized` or `403 Forbidden` status code.
    2.  **Test Case:** Attempt to submit data with an incorrect API key.
        *   **Action (Frontend):** With the incorrect API key, try submitting any form (e.g., a simple General Message).
        *   **Expected Outcome (Frontend & Backend):** Similar to VI.1 (error on frontend, 401/403 on backend).
```
