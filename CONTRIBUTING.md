# Contributing Guide

Guide for the team: how to run the project locally and which conventions to follow for commits, branches, and pull requests. It also includes the full workflow of a change, from issue to merge, and a final section with the conventions specific to each project.

---

## Local development

### Prerequisites

- The tools of the project's stack, in the version pinned by the repository
- Git

### Installation

```bash
git clone <repository-url>
cd <repository-name>
```

### Run in development

The project is run with the execution option specific to the stack or the development environment.

---

## Language

English. It is the de facto standard for commits, code, and comments, regardless of the team's working language.

---

## Commit, branch, and pull request convention

This section is written in generic terms, without references to a particular project.

### Issues

The repository lives inside a GitHub organization; access to both the repository and the team's Project depends on membership in that organization.

#### When to create an issue

- **Required** for `feat` and `fix`: they are the types that change behavior, and exactly what a Project needs to track. The issue is linked to the PR that resolves it (see [Pull Requests](#pull-requests)) and closes automatically on merge, with no manual board update.
- **Optional** for the other types (`chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`): they are maintenance changes with no impact on behavior. Requiring an issue to, for example, fix a typo in the README is more process than the change warrants.

If an issue covers more than fits in a reasonable PR, it is split into smaller sub-issues before starting: this allows progress in manageable increments and results in smaller pull requests that are easier to review.

#### Create the issue

The title follows the same format as a commit (see [Message format](#message-format)): issue, PR, and commit share a single title format.

```bash
gh issue create --title "feat(scope): short description of the change" --body "Explain the why and any context worth preserving."
```

If the team uses a GitHub Project for visual tracking of the work, `--project <name>` adds the issue there directly on creation (requires authorizing the `project` scope once: `gh auth refresh -s project`).

### Commits

#### Message format

```
<type>(<optional scope>): <short description in lowercase, no trailing period>

[optional body — explains the "why", the context]

[optional footer — external links, issue references, and other meta-information]
```

The body and footer serve as documentation while the branch is in development — visible in `git log` and in the PR's "Commits" tab (see [Pull Requests](#pull-requests) for what is kept on merge).

#### Types

| Type       | When to use it                                                       |
| ---------- | -------------------------------------------------------------------- |
| `feat`     | New functionality visible to the user or the API                     |
| `fix`      | Bug fix                                                              |
| `chore`    | Maintenance tasks with no effect on behavior (deps, config, scripts) |
| `docs`     | Documentation-only changes (README, comments)                        |
| `refactor` | Code change that neither fixes a bug nor adds functionality          |
| `test`     | Adding or fixing tests                                               |
| `style`    | Formatting, whitespace, semicolons — no change in logic              |
| `perf`     | Change that improves performance                                     |
| `ci`       | Changes to workflows / continuous integration configuration          |

#### Scope

Optional but recommended. It generally corresponds to a module, component, or functional area defined in the project's technical documentation (architecture, technical blueprint, SDD, etc.) — for example `auth`, `api`, `ui`, `storage`. It can also be a free short label describing the area touched without corresponding to a formal module (e.g. `deps`).

If the project has requirements documents with unique identifiers (SRS, user stories, tickets — including GitHub issues, see [Issues](#issues)), and the commit implements a specific one, referencing that identifier in the commit description helps maintain traceability.

When several features conceptually belong to the same group defined in the project's architecture (for example, a panel shared by several entities), the name of that group is used as the scope instead of the name of the specific entity being touched in that commit — this keeps the scope aligned with the documented architecture, not with the surface of the change.

#### Breaking changes

If a commit breaks compatibility (e.g. changes the shape of a response already in use), `!` is added after the type/scope:

```
feat(api)!: rename `id` field to `userId` in response payload
```

The impact must be described in the PR description (see [Pull Requests](#pull-requests)). Optionally, if it helps document the why while the branch is still in development, the commit body can include a brief note about it.

#### Examples

```
feat(auth): add password reset flow
fix(export): correct csv escaping for fields containing commas
chore: initial project scaffolding
chore(deps): bump vite to 6.0
docs: add installation instructions to readme
refactor(storage): extract local persistence logic into shared module
test(validation): cover required-field edge cases
```

#### Quick rules

- Short description in the present imperative ("add", "fix", "remove"), not in the past or third person. Rule of thumb: the message completes the sentence "If applied, this commit will \_\_\_".
- No trailing period on the description line.
- One commit = one logical change. If the description needs an "and", it is probably two commits.

### Branches

#### Naming

```
<prefix>/<short description in kebab-case>
```

The prefix matches the type the PR will have, except `feat`, which uses `feature/` instead of `feat/`.

| Commit type                                        | Branch prefix               | Example                                        |
| -------------------------------------------------- | --------------------------- | ---------------------------------------------- |
| `feat`                                             | `feature/`                  | `feature/user-profile`                         |
| `chore`, `docs`, `refactor`, `test`, `style`, etc. | same name as the type + `/` | `chore/update-dependencies`, `docs/api-readme` |

#### Create a branch

If the work has an issue (see [Issues](#issues)), the branch is created linked to that issue, using `--name` to respect the naming from the previous section:

```bash
gh issue develop <issue-number> --name feature/example --checkout
```

By default this creates the branch in the current repository from the default branch (`main`) and leaves it ready locally — there is no need to update `main` by hand first.

Without an issue (optional case described in [Issues](#issues)), the branch is created the traditional way:

```bash
git checkout main
git pull origin main
git checkout -b chore/example
```

- `git pull origin main` avoids starting from an old version of `main` — otherwise, the PR may end up rejected if the repository requires the branch to be up to date.

### Pull Requests

#### Title and description

- The **title** follows the same format as a commit (see [Message format](#message-format)) — on squash merge, it becomes the final commit message on `main`.
- The **description** is kept as the body of the final commit — it holds the context to be preserved permanently, including the detail of a breaking change.
- Both stay in the history of `main` forever: it is worth writing them carefully instead of leaving them automatic.

#### Create the PR

If the PR resolves an issue, the description includes the corresponding closing keyword (`Closes #<number>`, `Fixes #<number>`, or `Resolves #<number>`). That keyword is only interpreted when the PR targets the repository's default branch — when merged into `main`, GitHub closes the issue automatically and updates its status in the Project with no manual action.

```bash
gh pr create --title "<type>(<scope>): <description>" --body "<context to preserve in main>. Closes #<number>"
```

If the repository has CI configured with the `on: pull_request` trigger, it fires automatically when the PR is created.

#### Merge

```bash
gh pr merge --auto --squash
```

- `--squash` collapses all the branch's commits into a single one.
- `--auto` merges as soon as CI passes and the branch protection rules (if any) are met, without having to wait or come back later.
- If CI fails, auto-merge simply does not fire — the problem has to be fixed and pushed again on the same branch.
- If `main` advances while the PR is still open and the repository requires the branch to be up to date, auto-merge waits. Update manually:

```bash
git fetch origin
git merge origin/main
git push
```

or use the **"Update branch"** button on GitHub. CI runs again and auto-merge resumes.

### Complete workflow

End-to-end sequence for any change, from a trivial one to an entire module. It assumes Git and GitHub CLI (`gh`) are installed; if the team does not use `gh`, the same steps apply by creating and merging the PR from the GitHub web interface. It also assumes that, if the repository requires squash merge and/or protection on `main`, that configuration already exists — otherwise, some steps (such as `--auto`) do not apply as written.

1. **Create the issue** (required for `feat`/`fix`; optional for the rest — see [Issues](#issues))
   ```bash
   gh issue create --title "feat(scope): short description of the change" --body "Explain the why and any context worth preserving."
   ```
2. **Create the branch**
   ```bash
   gh issue develop <issue-number> --name feature/example --checkout
   ```
   Without an issue, it is created the traditional way:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b chore/example
   ```
3. **Commit following the convention**
   ```bash
   git add .
   git commit -m "feat(scope): short description of the change"
   ```
4. **Push the branch**
   ```bash
   git push -u origin feature/example
   ```
   `-u` is only needed the first time; afterwards `git push` is enough.
5. **Open the PR**
   ```bash
   gh pr create --title "feat(scope): short description of the change" --body "Explain the why and any context worth preserving in main. Closes #<number>"
   ```
6. **Merge**
   ```bash
   gh pr merge --auto --squash
   ```
   If the repository has the option to automatically delete branches on merge enabled, the remote branch disappears on its own.
7. **Update local `main`**

   ```bash
   git checkout main
   git pull origin main
   ```

   This brings the newly created squash merge commit on `main` into the local copy.

8. **Local cleanup (optional)**
   ```bash
   git branch -D feature/example
   ```
   The remote already took care of its own if that option is enabled; this only cleans the local copy.

---

## Project conventions

This is the only section adapted for each project; the rest of the document is reused unchanged.

- **Types:** `docs` for everything in `README.md`, `docs/`, and `data/` (including indicator sheets and demonstration data). `feat` and `fix` only for code in `src/`.
- **Scopes:** the document or folder touched, always in English: `guide` (`docs/team-guide.md`), `research` (`docs/research.md`), `mvp` (`docs/mvp-scope.md`), `catalog` (`data/`), `submission` (`docs/submission/`), `config` (`docs/repository-config.md`), and `ui` (interface design).
- **Language:** English throughout the repository: `README.md`, `docs/`, `data/`, code, commits, branches, issues, and pull requests. The event requires all project material, and anything linked in the submission, to be in English.
- **Documents:** each document in `docs/`, except `repository-config.md` (reusable template), starts with a data table and a change history in the format below. Every update bumps the version and adds a row to the history.

  ```markdown
  | Field            | Detail       |
  | ---------------- | ------------ |
  | Document version | 1.0.0        |
  | Creation date    | [date]       |
  | Status           | Published    |
  | Document owner   | [owner name] |

  ## Change history

  | Version | Date   | Change                                       |
  | ------- | ------ | -------------------------------------------- |
  | Draft   | [date] | Document created.                            |
  | 1.0.0   | [date] | First version published in the repository.   |
  | 1.1.0   | [date] | [Brief description of what changed and why.] |
  ```
