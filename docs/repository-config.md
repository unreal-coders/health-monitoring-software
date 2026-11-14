# Repository Settings

Reference template for configuring and documenting a repository's GitHub settings: what each setting does and why it is recommended.

---

## GitHub Actions — `.github/workflows/<file>.yml`

| Setting                                                      | Effect                                                                                                                                  | Why                                                                                                                                                                                                               |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `on: pull_request`                                           | CI runs every time a PR is opened or updated, before it can be merged.                                                                  | It is the pre-merge check. If the `main` ruleset already requires "Require a pull request before merging" (below), there is no need to also run CI on direct pushes: that case is already blocked by the ruleset. |
| `<pinned version file>` (e.g. `node-version-file: '.nvmrc'`) | CI installs the same runtime version that is used locally, by reading the pinned file instead of hardcoding the number in the workflow. | A single source of truth for the version — if it changes, it is edited in one place.                                                                                                                              |
| Verification step(s) (lint / typecheck / tests)              | Runs the scripts the project already defines for this.                                                                                  | Catches errors before merging, without relying on someone remembering to run them by hand.                                                                                                                        |
| Step(s) against an external service — _optional_             | Leaves the test environment in the state the tests assume before running them (e.g. migrations on a test database).                     | Only applies if the tests depend on a real service; if they are self-contained, this row is omitted entirely.                                                                                                     |

If these steps run **as sequential steps within a single job**, it is enough to mark that job as a required check in the ruleset (below): if any step fails, the whole job fails and blocks the merge just the same. If instead they run as **separate jobs**, each one must be marked as required separately.

**Secrets** (Settings → Secrets and variables → Actions) — _optional_: any credential the workflow needs to communicate with an external service during CI lives there, never in a `.env` file inside the repo or exposed on the runner.

---

## Ruleset on `main`

Configured in Settings → Rules → Rulesets.

| Setting                                          | Value                                                              | Effect                                                                                                                                                                    | Why                                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Require a pull request before merging            | Enabled                                                            | GitHub rejects any direct `git push` to `main`; every change enters through a merged PR.                                                                                  | It is the base control: without it, CI and everything else can be bypassed with a direct push.                                                                                    |
| Required approvals                               | `<0 in a solo repository — no one else can review / ≥1 in a team>` | With 0, the merge button does not depend on anyone else approving. With ≥1, the PR is blocked until it receives that approval, in addition to passing CI.                 | In a solo repository, requiring 1+ leaves the PR blocked with nobody to approve it. In a team, it adds a human review before merging — it complements CI, it does not replace it. |
| Require status checks to pass → check `<name>`   | Enabled                                                            | The merge button stays disabled until that check finishes green.                                                                                                          | Without this, CI runs but is only informational — one could still merge with CI red.                                                                                              |
| Require branches to be up to date before merging | Enabled                                                            | If `main` advanced after the working branch was created, it forces updating the branch before merging, and CI runs again on that version.                                 | Avoids merging a branch whose CI passed against an old version of `main` that no longer applies.                                                                                  |
| Allowed merge methods                            | Squash merge only                                                  | Guarantees that `gh pr merge --squash` is the only possible path — without this setting, squash would still work, but merge commit or rebase would also remain available. | Clean history (one commit per PR).                                                                                                                                                |
| Restrict who can bypass                          | Empty list                                                         | No one, including the repo owner, can skip the rules above.                                                                                                               | Leaving the list empty is what makes the ruleset actually apply, instead of being configured but without effect.                                                                  |

---

## General repository settings — Settings → General

| Setting                                   | Effect                                                                                                                                                      | Why                                                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Automatically delete head branches        | When a PR is merged, the remote branch is deleted automatically.                                                                                            | Prevents old branches from piling up, without having to delete them by hand each time.                            |
| Allow auto-merge                          | Enables the auto-merge option on PRs (used by `gh pr merge --auto`).                                                                                        | Lets you mark a PR to merge itself as soon as the conditions are met, without having to review it again manually. |
| Default commit message for squash merging | "Pull request title and description" — the final commit uses the PR title and its description as the body, not the list of the branch's individual commits. | Keeps the PR context directly in the history, without having to go to GitHub to look for it.                      |

---

## Net result

`main` only advances through PR → green CI (if applicable) → approval (if the team requires it) → squash merge. No unverified state reaches `main`, and the cost of following the workflow comes down to a handful of Git and GitHub CLI commands.
