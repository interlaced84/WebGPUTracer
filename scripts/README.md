# Knowledge Base Scripts

This directory contains scripts related to the AI Knowledge Base.

## `populate_and_verify_kb.py`

### Purpose
This Python script is designed to populate the AI Knowledge Base with a diverse set of test data via its API and then perform basic verification by fetching some of the created entries.

Its main goals are:
1.  To test the functionality of all POST (create) and GET (retrieve one, retrieve all) endpoints of the Knowledge Base API.
2.  To provide initial, varied data that can be used for testing and developing frontend applications that interact with the KB.
3.  To supply the Architect AI (Archie) with a foundational dataset for its system analysis, heuristic refinement, and operational testing.

### Prerequisites
*   The Knowledge Base FastAPI backend server (`knowledge_base_backend/main.py`) must be running and accessible at the configured `BASE_URL` (default is `http://127.0.0.1:8000`).
*   The API key required by the backend must be set as an environment variable named `KB_API_KEY`.

### How to Run

1.  **Ensure the backend server is running.**
    You can typically start it from the `knowledge_base_backend` directory with a command like:
    ```bash
    uvicorn main:app --reload
    ```

2.  **Set the `KB_API_KEY` environment variable.**
    This key must match the `API_KEY` expected by your backend (as defined in its `.env` file).

    *   On Linux/macOS:
        ```bash
        export KB_API_KEY="your_actual_api_key_here"
        ```
    *   On Windows (Command Prompt):
        ```bash
        set KB_API_KEY="your_actual_api_key_here"
        ```
    *   On Windows (PowerShell):
        ```bash
        $Env:KB_API_KEY="your_actual_api_key_here"
        ```
    Replace `"your_actual_api_key_here"` with the actual API key. If this variable is not set, the script will use a placeholder key and will likely fail to authenticate against the backend.

3.  **Navigate to the repository root directory.**
    (The directory containing the `scripts/` folder).

4.  **Run the script:**
    ```bash
    python scripts/populate_and_verify_kb.py
    ```

### Script Workflow
1.  **Configuration:** Sets the `BASE_URL` for the API and retrieves the `API_KEY` from the environment.
2.  **Health Check:** Pings the backend's `/health` endpoint to ensure it's operational.
3.  **Data Population:**
    *   Creates multiple sample entries for each knowledge type:
        *   `GeneralMessage` (including varied authors, tags, confidence weights, and a threaded example)
        *   `BugReport` (with varying levels of detail)
        *   `BranchUpdate`
        *   `SolutionKnowledge` (attempting to link some to previously created bug reports, and including confidence factors)
    *   Prints status messages for each creation attempt.
4.  **Basic Verification:**
    *   Attempts to fetch one successfully created entry of each type by its ID.
    *   Attempts to fetch all entries for each type and prints the total count.
5.  **Output:** The script will print status messages, HTTP response codes, and retrieved data summaries to the console. This helps in verifying that the API endpoints are working as expected and that data is being stored and retrieved correctly.

### Customization
*   **`BASE_URL`**: If your backend is running on a different address or port, you can modify the `BASE_URL` variable at the top of the script.
*   **Sample Data**: You can easily add more diverse or specific test data by extending the "Populating" sections in the `populate_and_verify()` function.
```
