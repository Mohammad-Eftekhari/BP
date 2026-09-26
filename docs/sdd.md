# Spec-driven development

Spec Kit is installed for Cursor (`cursor-agent`). Skills are in `.cursor/skills`. The constitution is `.specify/memory/constitution.md`. Feature contracts are in `specs/`.

## When to use the full workflow

Use it for a new capability, a behavior change, or a security boundary change.

```text
/speckit-constitution   principles changed
/speckit-specify        write the behavior without naming the implementation
/speckit-clarify        only when a choice would change scope or safety
/speckit-plan           technical design
/speckit-checklist      requirements quality, when useful
/speckit-tasks          implementable task list
/speckit-analyze        consistency check before coding
/speckit-implement      execute the tasks
/speckit-converge       record what is still unfinished
```

A typo, a style fix, or a rename that does not change behavior does not need a new specification.

## What is already specified

`specs/001-app-foundation` is the contract for this starter: public page, accounts, profile, status check, tests, and delivery. Update that spec, or add `specs/002-...`, when the behavior changes. Then update the plan and tasks if the design changed, then change the code.

## Cursor

`.cursor/rules` tells agents how this repository is structured. Those files are ours. `.cursor/skills/speckit-*` belongs to Spec Kit. Upgrade those with the Spec Kit CLI rather than editing them.

```bash
specify init --here --integration cursor-agent --force
```

Run that only when you intend to refresh Spec Kit files. Review the diff afterward so a local constitution change is not lost.

## Day-to-day sequence

1. Branch.
2. Specify the behavior.
3. Plan and list tasks.
4. Implement a small group of tasks.
5. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
6. Add or update a Playwright test when the user journey changed.
7. Open a pull request.

Split a feature into several specifications only when one specify → plan → tasks cycle is too large to review.
