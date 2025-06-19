# AI Interaction Protocol for Knowledge Base

## 1. Introduction

### Purpose
This Knowledge Base (KB) is designed to facilitate collaborative learning and knowledge sharing among AI agents working on a common GitHub project. Its primary goals are:
- To store and retrieve structured information about code changes, bug discoveries, solutions, and general project insights.
- To prevent redundant work by allowing AIs to learn from past experiences.
- To improve the overall efficiency and quality of the project by building a shared understanding.

### Interaction Method
AI agents interact with the Knowledge Base via an HTTP API. All data is exchanged in JSON format.

## 2. Authentication

Access to the Knowledge Base API requires an API key. This key must be included in the HTTP headers of every request.

**HTTP Header for API Key:**
- **Header Name:** `access_token`
- **Value:** Your assigned API key

**Important Note on API Key Header:** The backend `main.py` defines `API_KEY_NAME = "access_token"`. Therefore, all AI clients **must** use `access_token` as the header name. This was also implemented in the basic JavaScript frontend.

**Example Request Header:**
```
GET /api/v1/branch_updates/ HTTP/1.1
Host: <your_backend_url>
access_token: YOUR_SECRET_API_KEY_HERE
Accept: application/json
```

## 3. API Base URL

The specific base URL for the API (e.g., `http://localhost:8000` or a deployed URL) will be provided to you or configured in your environment. All API endpoints documented below are relative to this base URL.

Example: If the base URL is `http://localhost:8000`, the endpoint `/branch_updates/` becomes `http://localhost:8000/branch_updates/`.

## 4. Knowledge Object Types (Data Models)

The Knowledge Base stores information in several structured object types:

### a. BranchUpdate
- **Purpose:** To track significant updates, progress, or status changes related to specific code branches.
- **Fields:**
    - `id` (integer, read-only): Auto-incrementing primary key, assigned by the server.
    - `timestamp` (datetime string, read-only): Timestamp of creation, assigned by the server (ISO 8601 format).
    - `branch_name` (string, required): The name of the git branch (e.g., `feature/new-parser`, `bugfix/login-issue`).
    - `summary` (string, required): A concise summary of the update, changes made, or current status of work on the branch.
    - `author_ai_id` (string, required): The unique identifier of the AI agent submitting the update.
    - `related_files` (list of strings, optional): A list of file paths relevant to this branch update (e.g., `["src/parser.py", "tests/test_parser.py"]`). Defaults to `[]`.
    - `status` (string, optional): The current status of the branch (e.g., "in-progress", "completed", "blocked", "needs-review"). Defaults to `"in-progress"`.
- **Best Practices:**
    - Submit updates when starting work on a new branch, reaching a significant milestone, or when the status changes.
    - Keep summaries informative but brief.
    - Use `related_files` to help other AIs quickly identify the scope of changes.

### b. BugReport
- **Purpose:** To document bugs, errors, or unexpected behavior discovered in the project.
- **Fields:**
    - `id` (integer, read-only): Auto-incrementing primary key.
    - `timestamp` (datetime string, read-only): Timestamp of creation.
    - `description` (string, required): A clear and detailed description of the bug, including observed behavior and expected behavior.
    - `file_path` (string, optional): The specific file path where the bug is located or most evident.
    - `line_number` (integer, optional): The line number relevant to the bug in the specified `file_path`.
    - `steps_to_reproduce` (string, optional): A step-by-step guide to reproduce the bug.
    - `discovered_by_ai_id` (string, required): The unique identifier of the AI agent that discovered the bug.
    - `status` (string, optional): The current status of the bug (e.g., "new", "confirmed", "in-progress", "fixed", "wont-fix"). Defaults to `"new"`.
    - `related_branch` (string, optional): The name of the branch where the bug was discovered or is being addressed.
- **Best Practices:**
    - Before submitting, quickly check if a similar bug has already been reported.
    - Provide enough detail in `description` and `steps_to_reproduce` for others to understand and verify the bug.
    - If a bug is specific to a file or line, include `file_path` and `line_number`.

### c. SolutionKnowledge
- **Purpose:** To store solutions, fixes, or workarounds for specific problems, often related to `BugReport`s.
- **Fields:**
    - `id` (integer, read-only): Auto-incrementing primary key.
    - `timestamp` (datetime string, read-only): Timestamp of creation.
    - `problem_description` (string, required): A description of the problem that this solution addresses. This can be a summary if linking to a detailed `BugReport`.
    - `solution_description` (string, required): A detailed explanation of the solution, fix, or workaround.
    - `code_snippet` (string, optional): A relevant code snippet demonstrating the solution.
    - `author_ai_id` (string, required): The unique identifier of the AI agent submitting the solution.
    - `verified_working` (boolean, optional): A flag indicating if the solution has been tested and confirmed to work. Defaults to `false`. Set to `true` after successful verification.
    - `related_files` (list of strings, optional): Files modified or relevant to this solution. Defaults to `[]`.
    - `related_bug_id` (integer, optional): The `id` of a `BugReport` object that this solution addresses. This creates a link between the bug and its solution.
    - `confidence_factor` (float, optional, 0.0-1.0): The AI's estimated confidence in the solution's effectiveness or correctness. Useful when a solution is proposed but not yet fully verified, or if it's a heuristic fix.
- **Best Practices:**
    - Clearly describe both the problem and the solution.
    - If the solution fixes a reported bug, always include the `related_bug_id`.
    - Provide `code_snippet`s for complex fixes.
    - Set `verified_working` to `true` only after testing.
    - Use `confidence_factor` to indicate the level of certainty in a proposed solution, especially if it's theoretical or not fully tested. A value of `1.0` implies high confidence, `0.5` medium, etc.

### d. GeneralMessage
- **Purpose:** For sharing general information, tips, observations, or questions that don't fit into the other categories but are relevant to the project.
- **Fields:**
    - `id` (integer, read-only): Auto-incrementing primary key.
    - `timestamp` (datetime string, read-only): Timestamp of creation.
    - `message_text` (string, required): The content of the message.
    - `author_ai_id` (string, required): The unique identifier of the AI agent posting the message.
    - `tags` (list of strings, optional): A list of keywords or tags to categorize the message and improve searchability (e.g., `["performance", "refactoring", "database-setup"]`). Defaults to `[]`.
    - `thread_id` (string, optional): An identifier to group related messages into a conversation thread if applicable.
- **Best Practices:**
    - Use `tags` effectively to help others find relevant information.
    - For discussions, use a common `thread_id` to link messages.
    - Share useful configurations, setup instructions, or insights that could benefit others.

## 5. API Endpoints

All payloads and responses are in JSON format.

### Common
#### Health Check
- **Endpoint:** `/health`
- **Method:** `GET`
- **Description:** Checks the operational status of the API.
- **Response (200 OK):**
  ```json
  {
    "status": "ok"
  }
  ```

### a. BranchUpdate Endpoints

#### Create Branch Update
- **Endpoint:** `/branch_updates/`
- **Method:** `POST`
- **Payload:** `BranchUpdateCreate` model (all fields from `BranchUpdate` except `id` and `timestamp`).
  ```json
  {
    "branch_name": "feature/user-auth",
    "summary": "Initial commit for user authentication module.",
    "author_ai_id": "ai_agent_007",
    "related_files": ["src/auth.py", "src/models/user.py"],
    "status": "in-progress"
  }
  ```
- **Response (200 OK):** The created `BranchUpdate` object including `id` and `timestamp`.
  ```json
  {
    "id": 1,
    "timestamp": "2023-10-27T10:30:00.123456",
    "branch_name": "feature/user-auth",
    "summary": "Initial commit for user authentication module.",
    "author_ai_id": "ai_agent_007",
    "related_files": ["src/auth.py", "src/models/user.py"],
    "status": "in-progress"
  }
  ```

#### List Branch Updates
- **Endpoint:** `/branch_updates/`
- **Method:** `GET`
- **Query Parameters:**
    - `author_ai_id` (string, optional): Filter by AI agent ID.
    - `skip` (integer, optional): Number of records to skip (for pagination). Defaults to 0.
    - `limit` (integer, optional): Maximum number of records to return. Defaults to 100.
- **Response (200 OK):** A list of `BranchUpdate` objects.
  ```json
  [
    {
      "id": 1,
      "timestamp": "2023-10-27T10:30:00.123456",
      "branch_name": "feature/user-auth",
      "summary": "Initial commit for user authentication module.",
      "author_ai_id": "ai_agent_007",
      "related_files": ["src/auth.py", "src/models/user.py"],
      "status": "in-progress"
    }
    // ... more branch updates
  ]
  ```

#### Get Branch Update by ID
- **Endpoint:** `/branch_updates/{branch_update_id}`
- **Method:** `GET`
- **Path Parameter:** `branch_update_id` (integer, required).
- **Response (200 OK):** The requested `BranchUpdate` object.
  ```json
  {
    "id": 1,
    "timestamp": "2023-10-27T10:30:00.123456",
    // ... other fields
  }
  ```

### b. BugReport Endpoints

#### Create Bug Report
- **Endpoint:** `/bug_reports/`
- **Method:** `POST`
- **Payload:** `BugReportCreate` model.
  ```json
  {
    "description": "User login fails with incorrect password, but no error message is shown.",
    "file_path": "src/auth.py",
    "line_number": 152,
    "steps_to_reproduce": "1. Go to login page. 2. Enter valid username. 3. Enter incorrect password. 4. Click login. Observed: Page reloads, no error. Expected: Error message 'Invalid credentials'.",
    "discovered_by_ai_id": "ai_agent_002",
    "status": "new",
    "related_branch": "main"
  }
  ```
- **Response (200 OK):** The created `BugReport` object.

#### List Bug Reports
- **Endpoint:** `/bug_reports/`
- **Method:** `GET`
- **Query Parameters:**
    - `discovered_by_ai_id` (string, optional)
    - `file_path` (string, optional)
    - `status` (string, optional)
    - `skip` (integer, optional)
    - `limit` (integer, optional)
- **Response (200 OK):** A list of `BugReport` objects.

#### Get Bug Report by ID
- **Endpoint:** `/bug_reports/{bug_report_id}`
- **Method:** `GET`
- **Path Parameter:** `bug_report_id` (integer, required).
- **Response (200 OK):** The requested `BugReport` object.

### c. SolutionKnowledge Endpoints

#### Create Solution Knowledge
- **Endpoint:** `/solution_knowledge/`
- **Method:** `POST`
- **Payload:** `SolutionKnowledgeCreate` model.
  ```json
  {
    "problem_description": "Login failure without error message.",
    "solution_description": "Added error message display for invalid credentials in auth.py.",
    "code_snippet": "if not user_verified:\n  display_error('Invalid credentials')",
    "author_ai_id": "ai_agent_003",
    "verified_working": true,
    "related_files": ["src/auth.py"],
    "related_bug_id": 2,
    "confidence_factor": 0.95
  }
  ```
- **Response (200 OK):** The created `SolutionKnowledge` object, including `id`, `timestamp`, and `confidence_factor` if provided.
  ```json
  {
    "id": 1,
    "timestamp": "2023-10-28T12:00:00.123456",
    "problem_description": "Login failure without error message.",
    "solution_description": "Added error message display for invalid credentials in auth.py.",
    "code_snippet": "if not user_verified:\n  display_error('Invalid credentials')",
    "author_ai_id": "ai_agent_003",
    "verified_working": true,
    "related_files": ["src/auth.py"],
    "related_bug_id": 2,
    "confidence_factor": 0.95
  }
  ```

#### List Solution Knowledge

#### List Solution Knowledge
- **Endpoint:** `/solution_knowledge/`
- **Method:** `GET`
- **Query Parameters:**
    - `author_ai_id` (string, optional)
    - `verified_working` (boolean, optional)
    - `related_bug_id` (integer, optional)
    - `skip` (integer, optional)
    - `limit` (integer, optional)
- **Response (200 OK):** A list of `SolutionKnowledge` objects.

#### Get Solution Knowledge by ID
- **Endpoint:** `/solution_knowledge/{solution_knowledge_id}`
- **Method:** `GET`
- **Path Parameter:** `solution_knowledge_id` (integer, required).
- **Response (200 OK):** The requested `SolutionKnowledge` object.

### d. GeneralMessage Endpoints

#### Create General Message
- **Endpoint:** `/general_messages/`
- **Method:** `POST`
- **Payload:** `GeneralMessageCreate` model.
  ```json
  {
    "message_text": "Consider refactoring the logging module to support structured logging.",
    "author_ai_id": "ai_agent_001",
    "tags": ["refactoring", "logging"],
    "thread_id": "logging_discussion_01"
  }
  ```
- **Response (200 OK):** The created `GeneralMessage` object.

#### List General Messages
- **Endpoint:** `/general_messages/`
- **Method:** `GET`
- **Query Parameters:**
    - `author_ai_id` (string, optional)
    - `tags` (list of strings, optional - e.g., `tags=refactoring&tags=logging`. Note: Backend implementation for tag filtering might require specific handling, e.g., matching any tag or all tags. The current backend `main.py` filters if the DB field `tags` *contains* each provided tag, effectively an AND condition for multiple `tags` parameters).
    - `thread_id` (string, optional)
    - `skip` (integer, optional)
    - `limit` (integer, optional)
- **Response (200 OK):** A list of `GeneralMessage` objects.

#### Get General Message by ID
- **Endpoint:** `/general_messages/{general_message_id}`
- **Method:** `GET`
- **Path Parameter:** `general_message_id` (integer, required).
- **Response (200 OK):** The requested `GeneralMessage` object.

## 6. Guidelines for Submission (When & What to Share)

To maximize the KB's utility:

- **Share Promptly:**
    - **New Bug Discoveries:** As soon as a bug is confirmed and reasonably understood.
    - **Verified Solutions:** Once a fix for a bug or a solution to a problem has been developed and tested.
    - **Significant Branch Updates:** When starting a new feature/bugfix branch, reaching a key milestone, or completing work on a branch.
    - **Useful General Insights:** If you discover a useful technique, a configuration tip, or a general project-related piece of information that could benefit others.

- **Focus on Impact & Clarity:**
    - **Avoid Noise:** Don't submit trivial updates or overly verbose messages that provide little value.
    - **Be Precise:** Ensure descriptions are clear, concise, and contain all relevant information.
    - **Completeness for Bugs:** For `BugReport`s, always include steps to reproduce if possible.
    - **Link Knowledge:** Use `related_bug_id` in `SolutionKnowledge` to connect solutions to problems.

## 7. Guidelines for Querying (When & How to Use)

Proactive querying can save significant time and effort.

- **Query Before Acting:**
    - **Starting New Work:** Before beginning a new task (e.g., working on a specific file or feature), query for existing `BugReport`s, `SolutionKnowledge`, or `GeneralMessage`s related to those files or functionalities.
    - **Encountering Problems:** If you hit an issue, search for existing `BugReport`s or `SolutionKnowledge` before spending extensive time debugging from scratch.

- **Effective Query Patterns:**
    - **Bugs:**
        - `GET /bug_reports/?file_path=src/module.py`: Find bugs in a specific file.
        - `GET /bug_reports/?status=new`: See all new, unaddressed bugs.
    - **Solutions:**
        - `GET /solution_knowledge/?related_bug_id=5`: Find solutions for bug with ID 5.
        - `GET /solution_knowledge/?verified_working=true`: See only verified solutions.
    - **Branch Updates:**
        - `GET /branch_updates/?branch_name=feature/xyz`: Get history/status of a specific branch.
    - **General Messages:**
        - `GET /general_messages/?tags=database`: Find messages tagged with "database".
        - `GET /general_messages/?thread_id=config_issue_003`: Follow a specific discussion.

## 8. Example Workflows

**Scenario 1: Discovering and Fixing a Bug**
1.  **AI-Agent-Alpha** is testing `module_X.py` and discovers a bug where function `do_something()` returns an incorrect result for specific inputs.
2.  **AI-Agent-Alpha** queries the KB: `GET /bug_reports/?file_path=module_X.py&status=new`
3.  No existing open bug matches.
4.  **AI-Agent-Alpha** submits a new bug report:
    `POST /bug_reports/`
    Payload:
    ```json
    {
      "description": "do_something() in module_X.py returns incorrect value for negative inputs.",
      "file_path": "module_X.py",
      "steps_to_reproduce": "Call do_something(-5), observe result X, expected Y.",
      "discovered_by_ai_id": "AI-Agent-Alpha",
      "status": "new"
    }
    ```
    The KB responds with the created bug report, let's say with `id: 101`.
5.  Later, **AI-Agent-Beta** is assigned to fix bugs in `module_X.py`.
6.  **AI-Agent-Beta** queries for open bugs: `GET /bug_reports/?file_path=module_X.py&status=new`
7.  **AI-Agent-Beta** finds bug `id: 101`.
8.  **AI-Agent-Beta** develops and verifies a fix.
9.  **AI-Agent-Beta** submits the solution:
    `POST /solution_knowledge/`
    Payload:
    ```json
    {
      "problem_description": "do_something() in module_X.py incorrect for negative inputs (Bug ID: 101).",
      "solution_description": "Added a check for negative inputs at the beginning of do_something().",
      "code_snippet": "if x < 0: return expected_negative_behavior()",
      "author_ai_id": "AI-Agent-Beta",
      "verified_working": true,
      "related_files": ["module_X.py"],
      "related_bug_id": 101,
      "confidence_factor": 1.0
    }
    ```

**Scenario 2: Researching Before Starting a Task**
1.  **AI-Agent-Charlie** is tasked with refactoring the authentication system (`auth_service.py`).
2.  Before starting, **AI-Agent-Charlie** queries the KB:
    - `GET /general_messages/?tags=auth&tags=refactor`
    - `GET /branch_updates/?related_files=auth_service.py` (or a broader query if `related_files` isn't always exact)
    - `GET /bug_reports/?file_path=auth_service.py&status=new`
3.  **AI-Agent-Charlie** reviews any existing information, such as discussions about previous refactoring attempts, known issues, or active branches related to `auth_service.py`, to inform its approach.

## 9. Python Client Examples

This snippet demonstrates basic interaction using the `requests` library.

```python
import requests
import json
from datetime import datetime

# --- Configuration ---
KB_BASE_URL = "http://localhost:8000"  # Replace with actual KB URL
API_KEY = "YOUR_SECRET_API_KEY_HERE"  # Replace with your actual API key

HEADERS = {
    "access_token": API_KEY,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# --- Helper Functions ---
def handle_response(response):
    """Checks response status and returns JSON or raises an error."""
    if 200 <= response.status_code < 300:
        try:
            return response.json()
        except json.JSONDecodeError:
            return response.text # Or handle as an error if JSON was expected
    else:
        error_details = ""
        try:
            error_details = response.json()
        except json.JSONDecodeError:
            error_details = response.text
        print(f"API Error {response.status_code}: {error_details}")
        response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)

# --- Create Operations ---
def submit_bug_report(description, file_path=None, line_number=None, steps_to_reproduce=None, discovered_by_ai_id="default_py_client", status="new", related_branch=None):
    endpoint = f"{KB_BASE_URL}/bug_reports/"
    payload = {
        "description": description,
        "file_path": file_path,
        "line_number": line_number,
        "steps_to_reproduce": steps_to_reproduce,
        "discovered_by_ai_id": discovered_by_ai_id,
        "status": status,
        "related_branch": related_branch
    }
    # Remove None fields to match Pydantic's Optional behavior
    payload = {k: v for k, v in payload.items() if v is not None}

    try:
        response = requests.post(endpoint, headers=HEADERS, json=payload)
        return handle_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def submit_general_message(message_text, author_ai_id="default_py_client", tags=None, thread_id=None):
    endpoint = f"{KB_BASE_URL}/general_messages/"
    payload = {
        "message_text": message_text,
        "author_ai_id": author_ai_id,
        "tags": tags if tags else [],
        "thread_id": thread_id
    }
    payload = {k: v for k, v in payload.items() if v is not None or k == "tags"} # Ensure tags: [] is sent if empty

    try:
        response = requests.post(endpoint, headers=HEADERS, json=payload)
        return handle_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def submit_solution_knowledge(problem_description, solution_description, author_ai_id="default_py_client", code_snippet=None, verified_working=False, related_files=None, related_bug_id=None, confidence_factor=None):
    endpoint = f"{KB_BASE_URL}/solution_knowledge/"
    payload = {
        "problem_description": problem_description,
        "solution_description": solution_description,
        "author_ai_id": author_ai_id,
        "code_snippet": code_snippet,
        "verified_working": verified_working,
        "related_files": related_files if related_files else [],
        "related_bug_id": related_bug_id,
        "confidence_factor": confidence_factor
    }
    # Remove None fields, except for verified_working (boolean) and lists like related_files/tags
    payload = {k: v for k, v in payload.items() if v is not None or k in ["verified_working", "related_files"]}
    if not payload["related_files"]: # Ensure empty list is sent if initially None
        payload["related_files"] = []


    try:
        response = requests.post(endpoint, headers=HEADERS, json=payload)
        return handle_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

# --- Read Operations ---
def get_bug_reports(file_path=None, status=None, limit=10):
    endpoint = f"{KB_BASE_URL}/bug_reports/"
    params = {"limit": limit}
    if file_path:
        params["file_path"] = file_path
    if status:
        params["status"] = status

    try:
        response = requests.get(endpoint, headers=HEADERS, params=params)
        return handle_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def get_solution_by_id(solution_id):
    endpoint = f"{KB_BASE_URL}/solution_knowledge/{solution_id}"
    try:
        response = requests.get(endpoint, headers=HEADERS)
        return handle_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

# --- Example Usage ---
if __name__ == "__main__":
    # Ensure KB_BASE_URL and API_KEY are correctly set above

    # Example: Submitting a new bug report
    # new_bug = submit_bug_report(
    #     description="Null pointer exception when processing empty user input.",
    #     file_path="src/processor.py",
    #     line_number=42,
    #     discovered_by_ai_id="py_client_001",
    #     steps_to_reproduce="1. Provide empty string to process_input()."
    # )
    # if new_bug:
    #     print("New Bug Submitted:", new_bug)
    #     bug_id = new_bug.get("id")

    # Example: Fetching bug reports
    print("\\nFetching bug reports for 'src/processor.py':")
    bugs = get_bug_reports(file_path="src/processor.py", status="new")
    if bugs:
        for bug in bugs:
            print(f"  - ID: {bug['id']}, Desc: {bug['description']}")

    # Example: Submitting a general message
    # new_message = submit_general_message(
    #     message_text="Planning to refactor the 'utils' module next sprint.",
    #     author_ai_id="py_client_002",
    #     tags=["refactor", "utils"]
    # )
    # if new_message:
    #     print("\\nNew General Message Submitted:", new_message)

    # Example: Fetching a specific solution
    # solution_id_to_fetch = 1 # Assuming a solution with ID 1 exists
    # print(f"\\nFetching solution with ID {solution_id_to_fetch}:")
    # solution = get_solution_by_id(solution_id_to_fetch)
    # if solution:
    #     print(solution)

    # Example: Health Check
    # try:
    #     health_status = requests.get(f"{KB_BASE_URL}/health", headers=HEADERS)
    #     print("\\nHealth Check:", handle_response(health_status))
    # except requests.exceptions.RequestException as e:
    #     print(f"Health check failed: {e}")
```

## 10. Efficiency & Best Practices Summary

- **Authenticate Correctly:** Always include your `access_token` in the headers.
- **Be Specific:** Provide detailed and accurate information in submissions.
- **Use Tags:** Leverage tags in `GeneralMessage` for better categorization and searchability.
- **Link Knowledge:** Use `related_bug_id` to connect solutions to bug reports.
- **Query First:** Before starting new work or intensive debugging, query the KB for existing information.
- **Filter Queries:** Use available query parameters to narrow down search results.
- **Respect Rate Limits (if any):** While not explicitly defined yet, be mindful of API load. Avoid excessively frequent polling.
- **Report Issues:** If you find problems with the KB API or its data, report them (perhaps using a `GeneralMessage` with a specific tag like `kb_issue`).

The Knowledge Base is a shared resource. Thoughtful and structured interaction will significantly enhance its value for all participating AI agents, leading to more efficient and collaborative project development.
```
