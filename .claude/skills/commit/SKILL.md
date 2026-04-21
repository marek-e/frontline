---
name: commit
description: Create atomic git commits following Conventional Commits, ordered by dependency layers, scoped to the Frontline pnpm + Turborepo workspace
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *) Bash(git diff *) Bash(git log *) Bash(git reset *)
---

## Current state

```!
git add -N . 2>/dev/null
echo "=== STATUS ==="
git status --short
echo "=== RECENT LOG ==="
git log --oneline -10
```

## Repo layout (scopes)

Monorepo: pnpm workspaces + Turborepo. Use these as Conventional Commits scopes:

- `apps/web` → scope: `web`
- `apps/party` → scope: `party`
- `apps/api` → scope: `api`
- `packages/rules` → scope: `rules`
- `packages/ui` → scope: `ui`
- `packages/bot` → scope: `bot`
- `packages/puzzles` → scope: `puzzles`
- `packages/db` → scope: `db`
- `packages/auth` → scope: `auth`
- `docs/**` → scope: `docs`
- root tooling (`turbo.json`, `pnpm-workspace.yaml`, root `tsconfig.json`, `.github/`, `.gitignore`, `LICENSE`) → scope: `repo`

Cross-cutting change touching multiple packages → omit the scope (e.g. `chore: bump typescript to 6.0.3`) or use the most-affected one.

## Workflow

1. **Gitignore** — if untracked files should not be committed (build artifacts, `.env`, IDE configs, `.DS_Store`, `node_modules/`, `dist/`, `.turbo/`, `coverage/`, `__pycache__/`, `.venv/`, secrets, logs), add them to `.gitignore`, `git reset` those files, and commit `.gitignore` first.

2. **Group and commit** — split changes into atomic commits, one logical change each. Order by **monorepo dependency layer** (leaves → roots):
   1. `docs` / `repo` config (workspace, tsconfig, turbo, CI, license, gitignore)
   2. `rules` (pure core — depended on by everything)
   3. `db` / `auth` (data + identity primitives)
   4. `ui` (shared components, depends on tokens)
   5. `bot` / `puzzles` (depend on `rules`)
   6. `api` / `party` (server apps — depend on rules/db/auth)
   7. `web` (client app — depends on everything above)
   8. Tests **alongside** the layer they cover, not at the end

   Use `git add -p` when a file spans multiple concerns. Stage and commit each group immediately — do NOT ask for confirmation.

3. **Lockfile** — commit `pnpm-lock.yaml` in the _same_ commit as the `package.json` change that caused it. Never commit lockfile drift on its own unless it's an intentional dedupe (`chore(repo): dedupe lockfile`).

4. **Workspace additions** — when adding a new package/app, the scaffolding commit (`feat(<scope>): scaffold package`) should include its `package.json`, `tsconfig.json`, and minimal `src/index.ts`. Follow-up commits add real code.

- `.claude/` and its contents are project files — always commit them.
- When done, `git status` must show no untracked or modified files (everything is either committed or gitignored).

## Commit messages

- Conventional Commits: `type(scope): subject`
- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `build`, `ci`, `style`
- Scope from the list above. Skip scope for truly cross-cutting changes.
- Add a body ONLY when the title doesn't capture a non-obvious choice, trade-off, or design decision
- Breaking changes in `rules` (move gen, FGN, state shape) MUST use `!` and a `BREAKING CHANGE:` footer — downstream packages depend on these types
- No Co-Authored-By footer

Examples:

- `feat(rules): add warlord pursuit move generator`
- `test(rules): add fast-check invariants for legal moves`
- `refactor(web): import game logic from @frontline/rules`
- `chore(repo): scaffold pnpm workspaces + turborepo`
- `docs: update ARCHITECTURE.md with PartyKit decision`
- `feat(rules)!: rename GameState.board → GameState.round.board`

## Finish

Run `git reset` for any remaining intent-to-add files. Show `git log --oneline` with new commits.
