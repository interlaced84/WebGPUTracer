# 📖 API & Data Model Reference

## 1. GeneralMessage Model

| Field             | Type    | Required | Description                                 |
|-------------------|---------|----------|---------------------------------------------|
| content           | string  | Yes      | The core knowledge/message content          |
| confidence_weight | float   | Yes      | Value between 0.0 (low) and 1.0 (high)     |
| topic             | string  | No       | Topic/domain of the message                 |
| timestamp         | string  | Yes      | ISO 8601 UTC timestamp                      |
| ...               | ...     | ...      | Additional metadata as needed               |

- **confidence_weight:**  
  - Must be provided on creation
  - Valid range: 0.0 (low trust/relevance) to 1.0 (high trust/relevance)
  - Used in indexing, digest, and prioritization

## 2. API Endpoints Example

- `POST /general_message` — Create a new message
- `GET /general_message` — Retrieve all messages (with filters)
- `PUT /general_message/{id}` — Update message
- `DELETE /general_message/{id}` — Delete message

## 3. Sample Payload
```json
{
  "content": "Archie, remember to rotate the log files daily.",
  "confidence_weight": 0.92,
  "topic": "maintenance",
  "timestamp": "2025-06-19T20:23:00Z"
}
```

---

**See full API docs in /docs and code comments.**
