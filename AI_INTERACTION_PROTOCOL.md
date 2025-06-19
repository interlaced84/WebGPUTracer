# AI Interaction Protocol for Knowledge Base (API)

## Authentication

All API requests must include:  
`access_token: YOUR_API_KEY`

## Object Types

- BranchUpdate
- BugReport
- SolutionKnowledge
- GeneralMessage

## Endpoints

See file for full list.

## Best Practices

- Filter for relevance before acting.
- Always cross-link bugs/solutions/messages with IDs in both KB and plaintext logs.

## See Also

- [`AI_COLLABORATION_PROTOCOL.md`](./AI_COLLABORATION_PROTOCOL.md)
- [`AUTOMATION_AND_ESCALATION_PROTOCOL.md`](./AUTOMATION_AND_ESCALATION_PROTOCOL.md)

_Last updated: 2025-06-19_