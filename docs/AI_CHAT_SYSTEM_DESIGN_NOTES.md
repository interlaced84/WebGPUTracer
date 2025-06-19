# AI Collaborative Chat System - Design Notes & Considerations

This document outlines initial thoughts, design questions, and considerations for a potential "Phase 2" feature: an AI Collaborative Chat System.

## Core Goals

1.  **Facilitate Free-form Discussion:** Allow AIs to discuss tasks, problems, ideas, and solutions in a more fluid way than the structured Knowledge Base (KB).
2.  **Enable Emergent Collaboration:** Support AIs in identifying shared goals, proposing solutions, and coordinating efforts.
3.  **Improve Collective Problem-Solving:** Allow for brainstorming and iterative refinement of ideas among AIs.
4.  **Provide a Channel for an "Architect AI":** Enable a designated AI to monitor, synthesize, guide discussions, and interface with the user on strategic matters.
5.  **Integrate with Structured Knowledge:** The chat should complement the structured KB. Discussions might lead to formal KB entries, or KB entries might be referenced in chat.

## Key Design Questions & Considerations

1.  **Real-time vs. Asynchronous:**
    *   **Real-time (e.g., WebSockets):** Messages appear instantly. Offers immediate interaction, suitable for a "chat" feel. More complex to implement.
    *   **Asynchronous (e.g., API Polling, Message Queues):** AIs periodically check for new messages. Simpler backend, but less interactive.
    *   *Initial thought: WebSockets seem more appropriate for the desired chat experience.*

2.  **Message Structure & Content:**
    *   `message_id`: Unique identifier for the message.
    *   `author_ai_id`: Identifier of the AI sending the message.
    *   `timestamp`: Server-side timestamp of when the message was received.
    *   `message_text`: The actual chat content (potentially character-limited).
    *   `thread_id` / `channel_id`: To group conversations by topic, task, or sub-project. Essential for organization.
    *   `mentions (optional)`: Array of AI IDs to notify specific AIs (e.g., `["AI-Nova", "AI-Ray"]`).
    *   `references_kb_id (optional)`: ID of an entry in the structured Knowledge Base relevant to the message.
    *   `parent_message_id (optional)`: For direct replies, forming simple threads within a channel.

3.  **Channels/Threads Organization:**
    *   How are conversations structured to prevent a single unmanageable stream?
        *   **Predefined Channels:** e.g., `#general`, `#bug_discussion`, `#feature_volumetric_fog`, `#engine_optimisation`. Could be created by user or Architect AI.
        *   **Dynamic Threads within Channels:** Users/AIs can start new discussion threads under a channel for specific sub-topics.
    *   *Initial thought: A system of channels with support for threaded replies seems balanced.*

4.  **Persistence:**
    *   Chat messages must be stored persistently (e.g., new tables in the existing SQLite database).
    *   Consider data volume: Are all chats stored indefinitely? Archival/pruning strategies might be needed long-term.

5.  **AI Interaction with Chat (API Design):**
    *   **Posting Messages:** `POST /chat/channels/{channel_id}/messages` (or similar).
    *   **Receiving Messages:**
        *   **WebSockets:** AIs subscribe to `ws://<server_address>/ws/chat/{channel_id}`. Server pushes new messages.
        *   **Polling (Fallback/Alternative):** `GET /chat/channels/{channel_id}/messages?since_timestamp=<timestamp>` or `?since_message_id=<id>`.
    *   **NLP Requirements for Meaningful AI Participation:**
        *   Beyond just sending/receiving text, AIs would ideally need capabilities for:
            *   Understanding intent and context in messages from other AIs.
            *   Extracting key information, questions, or action items.
            *   Formulating relevant and coherent replies.
            *   Summarizing discussions.
        *   This is a significant AI capability challenge/opportunity.

6.  **The "Architect AI" Role (e.g., `JulesArchitect`):**
    *   **Responsibilities:**
        *   Monitor key chat channels/threads.
        *   Identify emerging consensus, disagreements, important unresolved questions, or novel proposals.
        *   Prompt other AIs for clarification or to formalize insights into structured KB entries (e.g., "AI-Nova, that sounds like a bug, please create a `BugReport` in the KB.").
        *   Synthesize lengthy discussions into summaries for the User or for other AIs.
        *   Interface with the User with proposals, status updates, or critical issues identified by the AI team.
    *   **Special Privileges/Capabilities:**
        *   May need permissions to create/archive channels, pin messages, etc.
        *   Requires strong reasoning, summarization, and potentially planning capabilities.

7.  **User Interface (for the Human User):**
    *   How would the user monitor these AI chats? A new section in the web UI (React-based eventually).
    *   Should the user be able to directly participate in some AI chat channels, or primarily receive summaries/proposals from the Architect AI?
    *   Ability to browse chat history, search, etc.

8.  **Notification System (Beyond direct WebSocket pushes):**
    *   If an AI is not actively connected/listening, how is it notified of important messages or @mentions? (e.g., a summary provided when it next "checks in"). This is less critical if WebSockets are the primary mode.

9.  **Character Limits & Optimization:**
    *   Character limits per message (e.g., 500-1000 characters) can enforce conciseness and simplify UI/data handling.

## Integration with Existing Structured Knowledge Base (KB)

*   Chat messages could have a button/command or a heuristic for an AI to "Formalize to KB Entry" (e.g., a discussion clearly identifying a bug could be semi-automatically drafted into a `BugReport` structure).
*   The Architect AI could be pivotal in ensuring valuable, actionable information from chats is distilled and recorded in the structured KB for better long-term queryability and as a system of record.
*   AIs could query the structured KB and bring results/summaries into a chat discussion to inform the conversation (e.g., "Relevant to this discussion, I found `KB-Solution-77` which states...").

## Potential Evolution (Phased Approach for Chat System)

*   **Phase 2.1 (Basic Chat Infrastructure):**
    *   Core message posting/viewing in one or more channels.
    *   Persistent storage of messages.
    *   Basic API for AIs to send/receive (e.g., via polling if WebSockets are deferred).
    *   AIs participate based on simple programmed heuristics rather than deep NLP.
*   **Phase 2.2 (Real-time & Architect AI Introduction):**
    *   Implement WebSockets for real-time message delivery.
    *   Introduce the "Architect AI" role with initial capabilities (e.g., monitoring specific channels, simple summarization).
*   **Phase 2.3 (Enhanced AI NLP & Interaction):**
    *   Incrementally improve AIs' abilities to understand chat context, participate more intelligently, and perform more complex collaborative tasks via chat.
*   **Phase 2.4 (User Interface for Chat Monitoring):**
    *   Develop the user-facing UI to observe and potentially interact with AI chats.

These notes are intended to spark further discussion and refine the vision for a more dynamic AI collaboration environment.
```
