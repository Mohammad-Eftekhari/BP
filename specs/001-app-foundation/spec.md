# Feature Specification: Reusable Application Foundation

**Feature Branch**: `001-app-foundation`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "A reusable production-oriented web application starter that a frontend engineer can clone, understand, and extend. It includes a public site, account registration and sign-in, a private area, one reference profile flow, a persistent data store, automated checks, a local data service, a production package, and a written change process."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Open the starter and reach a public page (Priority: P1)

A developer clones the starter, follows the written setup, and opens the public home page. The page explains what the starter is and how to sign in or create an account. The layout works on a narrow screen and a wide screen, can switch between light and dark appearance, and can be read with keyboard focus visible.

**Why this priority**: Without a runnable public application, none of the later flows can be demonstrated or reused.

**Independent Test**: Follow the setup document on a clean machine and open the home page. Confirm the purpose, the account links, the appearance switch, and keyboard focus.

**Acceptance Scenarios**:

1. **Given** a fresh copy and the documented prerequisites, **When** the developer completes setup and opens the home page, **Then** the page loads with a clear title, a short description, and links to create an account and sign in.
2. **Given** the home page is open, **When** the visitor switches appearance or resizes the window, **Then** text remains readable and controls remain reachable by keyboard.
3. **Given** an unknown address, **When** a visitor opens it, **Then** they see a not-found page with a way back to the home page.

---

### User Story 2 - Create an account and use a private area (Priority: P1)

A visitor creates an account with name, email, and password, signs in, sees a private page that knows who they are, and signs out. A visitor who is not signed in cannot view that private page or call a private operation. Signing in with a wrong password does not reveal whether the email exists.

**Why this priority**: Account access is the security boundary every later application will reuse.

**Independent Test**: Create an account, open the private page, sign out, and confirm the private page and private operation both refuse access.

**Acceptance Scenarios**:

1. **Given** a visitor is signed out, **When** they submit a valid registration, **Then** they become signed in and land on the private page.
2. **Given** an existing account, **When** they sign in with the correct password, **Then** they reach the private page and see their own name or email.
3. **Given** a visitor is signed in, **When** they sign out, **Then** the private page is no longer available and they are returned to a public page.
4. **Given** a visitor is signed out, **When** they open the private page or call a private operation, **Then** the page redirects to sign-in and the operation is rejected.
5. **Given** a registration or sign-in form, **When** required fields are missing or the password is too weak, **Then** the form explains the problem and does not create or open a session.
6. **Given** repeated failed sign-in attempts from the same client, **When** the attempt limit is exceeded, **Then** further attempts are temporarily refused.

---

### User Story 3 - Maintain a personal profile (Priority: P2)

A signed-in person views and updates their own display name and short biography. The form explains field errors, shows a busy state, and does not submit twice while a save is in progress. Another person cannot read or change that profile through the application interface. An account without the administrator role cannot call an administrator-only operation.

**Why this priority**: This is the reference path from a form to stored personal data. Later products replace the profile with their own feature using the same path.

**Independent Test**: Sign in, change the display name, reload, and confirm the new name remains. Call the same operation without a session and with a non-administrator account for the administrator-only operation.

**Acceptance Scenarios**:

1. **Given** a signed-in person, **When** they save a valid display name and biography, **Then** the new values are shown after a reload.
2. **Given** a signed-in person, **When** they submit an empty display name or a biography that is too long, **Then** the form shows a field error and the stored profile does not change.
3. **Given** a signed-out caller, **When** they request or update a profile, **Then** the request is rejected as unauthenticated.
4. **Given** a signed-in person who is not an administrator, **When** they call the administrator-only operation, **Then** the request is rejected as forbidden.
5. **Given** a save is in progress, **When** the person activates save again, **Then** a second save is not sent.

---

### User Story 4 - Check that the application and its data store are available (Priority: P2)

An operator requests a lightweight status check. The check reports whether the application can reach its data store. It does not include secrets, queries, or internal host details. A failed data store is reported as unavailable without a diagnostic dump.

**Why this priority**: Operators and automated checks need a safe way to tell a healthy deployment from a broken one.

**Independent Test**: Request the status check with the data store running, then with the data store stopped, and compare the two outcomes.

**Acceptance Scenarios**:

1. **Given** the application and data store are running, **When** an operator requests the status check, **Then** the response says the application and data store are available.
2. **Given** the data store cannot be reached, **When** an operator requests the status check, **Then** the response says the service is unavailable and includes no query text or credentials.

---

### User Story 5 - Prove critical behavior with automated checks (Priority: P3)

A developer runs fast checks for rules and small pieces of logic, and a browser check for the account and profile journey. Checks use a separate data store from everyday development data. Failing checks fail the shared verification run. Everyday commits do not run the full browser suite.

**Why this priority**: The starter is only reusable if the next change can prove it did not break sign-in, privacy, or the status check.

**Independent Test**: Run the documented check commands against the dedicated test data store and confirm the account journey, a rejected private call, a rejected invalid profile, and the status check.

**Acceptance Scenarios**:

1. **Given** the test data store is available, **When** the developer runs the documented automated checks, **Then** the account journey, profile validation, unauthorized access, and status check are exercised.
2. **Given** a check fails, **When** the shared verification run executes, **Then** the run fails.
3. **Given** a developer commits, **When** the local pre-commit check runs, **Then** it performs only fast formatting and lint checks.

---

### User Story 6 - Ship and extend the starter safely (Priority: P3)

A developer can build a production package, run it with a supplied configuration, and read how to add a page, a stored record, a private operation, and a check. Meaningful behavior changes start from a written specification. Local data setup does not contain production secrets. Destructive data commands refuse to run when the target does not look like a local development database.

**Why this priority**: The starter's job is the next application, not a one-off demo.

**Independent Test**: Build the production package, start it with the documented configuration, request the home page, and follow the "add a feature" document on a sample change without editing unrelated modules.

**Acceptance Scenarios**:

1. **Given** the documented production build, **When** the package starts with a valid configuration, **Then** the home page responds.
2. **Given** a destructive local data command pointed at a non-local database, **When** the developer runs it without an explicit override, **Then** it refuses to run.
3. **Given** the maintenance documents, **When** a developer follows them, **Then** they can add a private page and a private operation that checks the caller on the server.

### Edge Cases

- Registration uses an email that already exists: the person sees a generic failure and no second account is created.
- Sign-in uses an unknown email or a wrong password: the message does not reveal which part was wrong.
- A session cookie is present but invalid: private pages and private operations still reject the caller.
- The status check is called with a data store that refuses connections: the response is unavailable and contains no internal error text.
- Profile text includes leading or trailing spaces: stored values are trimmed.
- The biography is omitted: the profile still saves.
- Two saves of the same profile happen together: the last completed save wins and the record stays consistent.
- Required configuration is missing at startup: the server fails with a clear message and does not boot with empty secrets.
- A public page is requested by a signed-in person: they can still open it and can also reach the private area.
- The appearance is dark, the language direction is right-to-left, or the viewport is narrow: controls remain labeled and usable.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The starter MUST provide a public home page that states its purpose and offers account creation and sign-in.
- **FR-002**: Visitors MUST be able to register with name, email, and password, then sign in and sign out.
- **FR-003**: Passwords MUST meet a documented minimum strength before an account is created.
- **FR-004**: The private area MUST be available only to the signed-in person, and the server MUST make that decision independently of what the interface shows.
- **FR-005**: Private operations MUST reject missing or invalid sessions even when the interface also redirects.
- **FR-006**: A signed-in person MUST be able to read and update only their own profile display name and biography.
- **FR-007**: Invalid profile input MUST be rejected by the server even when the form already rejected it.
- **FR-008**: An administrator-only operation MUST reject signed-in people who lack that role.
- **FR-009**: People MUST NOT be able to choose their own role during registration.
- **FR-010**: The status check MUST report application and data-store availability without secrets, query text, or host details.
- **FR-011**: Failures shown to people MUST use stable categories: invalid input, unauthenticated, forbidden, missing, conflict, rate limited, business rule, and unexpected failure.
- **FR-012**: Unexpected failures MUST be recorded for operators and MUST NOT include passwords, session secrets, tokens, or raw credential headers.
- **FR-013**: Account attempts MUST be rate limited.
- **FR-014**: The local data service MUST persist across restarts, expose a health signal, and be configurable for name, account, password, and port without committing real secrets.
- **FR-015**: Schema changes MUST be captured as committed migration files. A convenience sync command MUST NOT be the documented production path.
- **FR-016**: Seed data MUST be deterministic, local-only, and free of production secrets.
- **FR-017**: Destructive data commands MUST refuse non-local targets unless the operator sets an explicit override.
- **FR-018**: Automated checks MUST cover validation rules, the status check, unauthenticated access, forbidden access, and the register-to-sign-out journey.
- **FR-019**: Checks that use the data store MUST use a dedicated test database.
- **FR-020**: Shared verification MUST run install, lint, type check, tests, and production build, and MUST fail when any of those fail.
- **FR-021**: The production package MUST start from a minimal runtime image and MUST NOT contain development secrets.
- **FR-022**: Documents MUST explain setup, architecture, accounts, data changes, checks, the change process, and how to remove the reference profile.
- **FR-023**: Project rules for coding agents MUST state boundaries for interface versus server code, accounts, data access, operations, tests, dependencies, and the written change process.
- **FR-024**: The interface MUST use labeled controls, visible focus, semantic headings, and buttons or links according to their action. Meaning MUST NOT depend on color alone.
- **FR-025**: Layout MUST remain usable for right-to-left text. User-facing copy MUST stay extractable for a later translation pass. A full translation system is out of scope.
- **FR-026**: Public pages MUST publish a title, description, and a default rule for crawlers, plus an extension point for a site map.
- **FR-027**: Configuration MUST separate server secrets from values that are intentionally public. Secrets MUST NOT be shipped to the browser.
- **FR-028**: The reference profile MUST stay isolated so a future product can delete it without removing accounts, the status check, or the shared application shell.

### Key Entities

- **Account**: A person who can sign in. Attributes include name, email, password (stored only as a secret verifier), role, and timestamps. Email is unique. Role is assigned by the system, not by registration.
- **Session**: The server-side record that proves a browser belongs to an account until sign-out or expiry.
- **Profile**: The signed-in person's editable public-to-self details: display name, biography, and timestamps. One profile belongs to one account.
- **Status**: A lightweight report with application availability and data-store availability. It is not stored.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A developer who already has the documented prerequisites can reach the public home page in under 15 minutes using only the setup document.
- **SC-002**: A new visitor can create an account and see their private page in under 2 minutes when the application is already running.
- **SC-003**: In the automated browser journey, 100% of these steps pass: register, open the private page, save a profile, sign out, and get rejected when opening the private page again.
- **SC-004**: Unsigned callers and non-administrators are rejected on 100% of the protected checks in the automated suite.
- **SC-005**: The status check responds without including a secret, a query, or a stack trace in either the healthy or unavailable outcome.
- **SC-006**: The shared verification run fails if lint, type check, tests, or the production build fails. No check is allowed to stay ignored.
- **SC-007**: A developer can point to one document that explains how to add a private page, one that explains how to add a stored record, and one section that explains how to delete the reference profile.
- **SC-008**: Destructive data reset refuses to run against a non-local target in a documented trial without an explicit override.

## Assumptions

- The primary reader is a frontend engineer building a later product from this starter. End-user copy stays neutral and product-agnostic.
- Email and password are the only sign-in method in this version. Social sign-in, password reset, email verification, magic links, passkeys, two-factor authentication, organizations, and invitations are extension points, not delivered behavior.
- One role distinction is enough: ordinary member and administrator. A larger permission catalog is out of scope.
- The reference feature is a personal profile. It is sample data, not a product domain.
- English is the initial copy. The layout does not assume left-to-right text forever.
- Same-origin browser access is enough. Third-party sites are not granted access to operations.
- Local development uses a containerized data service. Production receives configuration from the environment.
- The written change process applies to meaningful features. Tiny wording fixes do not need a full specification cycle.
- OAuth client secrets are not required until a later specification enables a provider.
- Session lifetime and password hashing follow the account system's current secure defaults.
- The status check is unauthenticated and safe to expose because it carries no internal detail.
