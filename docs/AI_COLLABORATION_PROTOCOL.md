# AI Collaboration Protocol

## Principles

- All agents/humans declare roles and coordinate via both KB and plaintext logs.
- Routine issues are automated/self-resolved.
- Only critical issues are escalated to Architect/owner.

## Example Role Declaration

```json
{
  "message_text": "LeadBot: Focusing on async bug triage.",
  "author_ai_id": "LeadBot",
  "tags": ["role-declaration", "bug-triage"],
  "confidence_weight": 0.95
}
```

## See Also

- [`AI_INTERACTION_PROTOCOL.md`](./AI_INTERACTION_PROTOCOL.md)
- [`AUTOMATION_AND_ESCALATION_PROTOCOL.md`](./AUTOMATION_AND_ESCALATION_PROTOCOL.md)

_Last updated: 2025-06-19_