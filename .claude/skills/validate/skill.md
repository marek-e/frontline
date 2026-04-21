---
name: validate
description: Run lint, format check, and typecheck in parallel; fix all issues and loop until everything is green
allowed-tools: Bash(pnpm *) Read Edit Glob Grep
---

# Validate

Run all static checks in parallel and fix every issue until all three pass.

## Loop

Repeat the following until **all three exit with code 0**:

### 1 — Run checks in parallel

Fire all three as independent Bash calls in the **same message** so they run concurrently:

```
pnpm lint
pnpm format:check
pnpm typecheck
```

### 2 — If everything is green → done

Report which checks passed and stop.

### 3 — If anything failed → fix, then go back to step 1

Work through failures in this order (fixes for earlier steps can resolve later ones too):

**Format failures** (`pnpm format:check` non-zero):

- Run `pnpm format` to auto-fix all formatting — do not edit files manually for formatting.

**Lint failures** (`pnpm lint` non-zero):

- Read each reported file, understand the violation, fix the code.
- Do not suppress rules with `eslint-disable` / `oxlint-disable` comments unless the violation is a deliberate false positive — fix the root cause instead.

**Typecheck failures** (`pnpm typecheck` non-zero):

- Read each file with errors, fix the type errors in code.
- Do not use `// @ts-ignore` or `as any` to silence errors — fix the root cause.

After applying fixes, go back to **step 1** and re-run all three checks in parallel.

## Rules

- Always run all three checks together — never skip one because the others passed.
- Fix root causes, not symptoms. No suppression comments, no `any`, no `// @ts-ignore`.
- `pnpm format` is always safe to run — it only touches whitespace/style.
- Stop only when all three exit 0 in the same round.
