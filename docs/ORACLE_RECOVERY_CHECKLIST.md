# Oracle Recovery & Bootstrap Checklist

**Purpose:**
To restore a functional Oracle role (human or AI) and re-establish NovaRay’s operational context after loss, migration, or in a new environment.

## 1. Inventory

- List all files and directories present (esp. `NOVARAY_CORE_DIRECTIVES.md`, `docs/CORE_DIRECTIVES.md`, `docs/logs/`, `docs/roles/`).
- Note any missing or corrupted files.

## 2. Restore Role Directives

- Ensure this file (`ORACLE_ROLE_DIRECTIVE.md`) is present and current.
- Restore/create `ARCHIE_ROLE_DIRECTIVE.md` for Writer agent.

## 3. Restore Core Directives

- Recover or reconstruct `NOVARAY_CORE_DIRECTIVES.md` (root) and `docs/CORE_DIRECTIVES.md`.

## 4. Restore Logs

- Ensure `docs/logs/PROJECT_BOOTSTRAP_LOG.md` exists and is up-to-date.
- If available, recover `ARCHIE_UPDATE_LOG.md` and other agent logs.

## 5. Seed Minimal Context

- If no context remains, copy/paste the “Core Context Seed” from the role directive.

## 6. Begin Logging

- Document every action, recovery step, and hypothesis in `PROJECT_BOOTSTRAP_LOG.md`.

## 7. Resume or Onboard Agents

- Invite/instantiate Archie or other agents per their role directives.
- Hand off to human(s) as soon as available.

## Fallback

- If any step is impossible, document what was attempted and why in the log, then proceed with what is possible.
