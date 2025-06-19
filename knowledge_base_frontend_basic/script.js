document.addEventListener('DOMContentLoaded', () => {
    const backendBaseUrl = 'http://localhost:8000'; // Configurable
    const apiKeyInput = document.getElementById('apiKey');
    const displayArea = document.getElementById('displayArea');

    // --- Helper Functions ---
    function getApiKey() {
        const key = apiKeyInput.value;
        if (!key) {
            alert('Please enter your API Key.');
            return null;
        }
        return key;
    }

    function arrayFromCommaString(str) {
        if (!str || str.trim() === "") return [];
        return str.split(',').map(item => item.trim());
    }

    // --- Display Function ---
    function displayData(items, title = "Data") {
        if (!Array.isArray(items)) { // Handle single object display after POST
            items = [items];
        }
        displayArea.innerHTML = `<h3>${title}</h3>`;
        if (items.length === 0) {
            displayArea.innerHTML += '<p>No items to display.</p>';
            return;
        }
        items.forEach(item => {
            const itemDiv = document.createElement('pre');
            itemDiv.textContent = JSON.stringify(item, null, 2);
            displayArea.appendChild(itemDiv);
        });
    }

    function displayError(error, context = "") {
        console.error(`${context} Error:`, error);
        const errorMsg = error.detail || error.message || "An unknown error occurred.";
        displayArea.innerHTML = `<p style="color: red;">Error ${context}: ${errorMsg}</p>`;
    }

    // --- Fetch Functions ---
    async function fetchData(endpoint, title) {
        const apiKey = getApiKey();
        if (!apiKey) return;

        displayArea.innerHTML = `<p>Loading ${title}...</p>`;

        try {
            const response = await fetch(`${backendBaseUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'access_token': apiKey
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw errorData;
            }
            const data = await response.json();
            displayData(data, title);
        } catch (error) {
            displayError(error, `fetching ${title}`);
        }
    }

    document.getElementById('fetchBranchUpdatesBtn').addEventListener('click', () => fetchData('/branch_updates/', 'Branch Updates'));
    document.getElementById('fetchBugReportsBtn').addEventListener('click', () => fetchData('/bug_reports/', 'Bug Reports'));
    document.getElementById('fetchSolutionsBtn').addEventListener('click', () => fetchData('/solution_knowledge/', 'Solution Knowledge'));
    document.getElementById('fetchGeneralMessagesBtn').addEventListener('click', () => fetchData('/general_messages/', 'General Messages'));

    // --- Submission Functions ---
    async function handleFormSubmit(event, endpoint, formId, successTitle) {
        event.preventDefault();
        const apiKey = getApiKey();
        if (!apiKey) return;

        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            // Handle specific field conversions
            if (key === "related_files" || key === "tags") {
                data[key] = arrayFromCommaString(value);
            } else if (key === "line_number" || key === "related_bug_id") {
                data[key] = value ? parseInt(value, 10) : null;
            } else if (key === "verified_working") {
                data[key] = form.elements[key].checked;
            } else if (key === "confidence_factor" || key === "confidence_weight") { // gmConfidence is named confidence_weight in form
                data[key] = value ? parseFloat(value) : null; // Will be parsed as float
            } else {
                data[key] = value;
            }
        });

        // Remove optional fields if they are empty or null, specific to model
        if (formId === "bugReportForm") {
            if (!data.file_path) delete data.file_path;
            if (data.line_number === null || isNaN(data.line_number)) delete data.line_number;
            if (!data.steps_to_reproduce) delete data.steps_to_reproduce;
            if (!data.related_branch) delete data.related_branch;
        } else if (formId === "solutionKnowledgeForm") {
            if (!data.code_snippet) delete data.code_snippet;
            if (data.related_bug_id === null || isNaN(data.related_bug_id)) delete data.related_bug_id;
            if (data.confidence_factor === null || isNaN(data.confidence_factor)) delete data.confidence_factor;
        } else if (formId === "generalMessageForm") {
             if (!data.thread_id) delete data.thread_id;
             // confidence_weight is required, so it should always have a value from the form.
             // If it could somehow be null or NaN here (e.g. if "required" was missing from HTML and user submitted empty),
             // Pydantic on backend would catch it. For now, assume valid float due to "required".
             if (data.confidence_weight === null || isNaN(data.confidence_weight)) {
                // This case should ideally not be reached if HTML 'required' and default value work.
                // Backend will raise validation error if it's not a valid float.
                console.error("Confidence weight is missing or not a number for General Message!");
             }
        }


        try {
            const response = await fetch(`${backendBaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'access_token': apiKey
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw errorData;
            }

            const result = await response.json();
            alert(`${successTitle} created successfully!`);
            form.reset();
            displayData(result, `${successTitle} (Newly Created)`); // Display the single new item
            // Optionally, refresh the list for that type:
            // For example, if (endpoint === '/branch_updates/') fetchData('/branch_updates/', 'Branch Updates');

        } catch (error) {
            displayError(error, `creating ${successTitle}`);
            alert(`Error creating ${successTitle}. Check console for details.`);
        }
    }

    document.getElementById('branchUpdateForm').addEventListener('submit', (e) => handleFormSubmit(e, '/branch_updates/', 'branchUpdateForm', 'Branch Update'));
    document.getElementById('bugReportForm').addEventListener('submit', (e) => handleFormSubmit(e, '/bug_reports/', 'bugReportForm', 'Bug Report'));
    document.getElementById('solutionKnowledgeForm').addEventListener('submit', (e) => handleFormSubmit(e, '/solution_knowledge/', 'solutionKnowledgeForm', 'Solution Knowledge'));
    document.getElementById('generalMessageForm').addEventListener('submit', (e) => handleFormSubmit(e, '/general_messages/', 'generalMessageForm', 'General Message'));

    // --- Initial Load ---
    // Example: Fetch general messages on load, if API key is present or can be prompted
    // For now, let's not auto-fetch to avoid errors if API key isn't set.
    // User can click a fetch button to start.
    displayArea.innerHTML = "<p>Enter API Key and click a fetch button to load data.</p>";
});
