# AI Knowledge Base - Basic Frontend

This is a simple HTML, CSS, and JavaScript frontend to interact with the [AI Knowledge Base Backend](../knowledge_base_backend/README.md). It allows users to submit and view knowledge entries.

## Prerequisites

1.  **Backend Running:** The AI Knowledge Base backend application must be running and accessible. By default, the frontend will try to connect to `http://localhost:8000`. If your backend is running on a different URL, you'll need to modify the `backendBaseUrl` variable in `script.js`.
2.  **API Key:** You need a valid API key that the backend is configured to accept.

## How to Use

1.  **Open `index.html`:**
    Navigate to the `knowledge_base_frontend_basic` directory and open the `index.html` file in your web browser.
    ```
    # Example:
    # If you have cloned the repository and are in the root:
    # On macOS:
    # open knowledge_base_frontend_basic/index.html
    # On Linux:
    # xdg-open knowledge_base_frontend_basic/index.html
    # On Windows:
    # start knowledge_base_frontend_basic/index.html
    # Or, simply find the file in your file explorer and double-click it.
    ```

2.  **Enter API Key:**
    In the "API Key" input field at the top of the page, enter the API key that your backend is configured to use.

3.  **Fetch Data:**
    Click on any of the "Fetch..." buttons (e.g., "Fetch Branch Updates", "Fetch General Messages") to retrieve and display existing knowledge entries of that type. The data will appear in the "Knowledge Display" area.

4.  **Submit Data:**
    Use the forms under the "Submit Knowledge" section to create new entries:
    *   Fill in the required fields for the desired knowledge type (Branch Update, Bug Report, Solution, or General Message).
    *   Fields like "Related Files" or "Tags" should be entered as comma-separated values (e.g., `file1.py,path/to/file2.txt`).
    *   Click the "Create..." button for that form.
    *   A success message will be shown, and the newly created item will be displayed.

## Files

*   `index.html`: The main HTML structure of the frontend.
*   `style.css`: Basic CSS for styling the page.
*   `script.js`: JavaScript code for handling API interactions, data display, and form submissions.
*   `README.md`: This file.

## Notes

*   This is a *basic* frontend primarily for testing and direct interaction with the backend. It has minimal error handling and user experience refinements.
*   Ensure your browser allows JavaScript execution.
*   If you make changes to `script.js` or `style.css`, you might need to do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) in your browser to see the changes.
*   The API key is stored in the browser's memory for the session and is sent with each request. Do not use this frontend in an untrusted environment if you are using a sensitive API key.
```
