# Backend Change Requests Log

This document tracks all backend change proposals, their justification, impact analysis, and current approval status.
Statuses: `Proposed` | `Approved` | `Done` | `Rejected`

---

## BCR-001: Client Dedicated Projects Endpoint [Nice-to-Have]
- **Status:** `Proposed`
- **Why it's needed:** Client dashboard currently has to fetch all projects via `GET /projects` and filter in memory by `clientId === currentUserId`. A dedicated endpoint or query param (`GET /projects/client/{clientId}` or `GET /projects?clientId=...`) would avoid transferring all public projects to clients with many projects across the marketplace.
- **Which service(s) are affected:** `project-service`, `api-gateway`
- **Current behavior vs required behavior:**
  - *Current:* `GET /projects` returns all projects in page.
  - *Required:* `GET /projects/client/{clientId}` returns only projects created by that client.
- **Implementation plan (step by step):**
  1. `project-service` -> `ProjectRepository.java`: Add `Page<Project> findByClientId(Long clientId, Pageable pageable)`.
  2. `project-service` -> `ProjectService.java` & `ProjectServiceImpl.java`: Add `getProjectsByClientId(Long clientId, Pageable pageable)`.
  3. `project-service` -> `ProjectController.java`: Add `@GetMapping("/client/{clientId}")` returning `Page<ProjectResponse>`.
  4. `project-service` -> `SecurityConfig.java`: Ensure only authenticated clients can fetch their own projects (or admin).
- **Code sketch:**
  ```java
  @GetMapping("/client/{clientId}")
  @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
  public ResponseEntity<Page<ProjectResponse>> getProjectsByClient(
          @PathVariable Long clientId,
          @PageableDefault(size = 10) Pageable pageable) {
      return ResponseEntity.ok(projectService.getProjectsByClientId(clientId, pageable));
  }
  ```
- **Impact and risks:** Zero breaking changes. New endpoint only.
- **Frontend workaround meanwhile:** Implemented `useMyProjects()` hook which calls `GET /projects` and filters by `p.clientId === currentUser.id`.

---

## BCR-002: User Resolution & Admin List Endpoints [Nice-to-Have]
- **Status:** `Proposed`
- **Why it's needed:** Admin screen has to rely only on `GET /users/freelancers`, and contracts/bids only return user IDs (`freelancerId`, `clientId`). Resolving individual user names requires N+1 queries (`GET /users/{id}`).
- **Which service(s) are affected:** `auth-service`, `api-gateway`
- **Current behavior vs required behavior:**
  - *Current:* No `GET /users` endpoint; only `GET /users/{id}` and `GET /users/freelancers`.
  - *Required:* `GET /users` (paginated, ADMIN only) and batch user endpoint or populated names.
- **Implementation plan (step by step):**
  1. `auth-service` -> `UserController.java`: Add `@GetMapping` endpoint guarded with `hasRole('ADMIN')`.
  2. `auth-service` -> `UserService.java`: Implement paginated fetch of all users.
- **Impact and risks:** Minimal. Admin only.
- **Frontend workaround meanwhile:** The frontend admin dashboard shows Freelancers using `GET /users/freelancers` and projects via `GET /projects`, showing graceful "Admin users view coming soon" empty states for unsupported views. Bids/contracts resolve names using a TanStack Query cached `useUser(id)` hook with instant initials fallback.

---

## BCR-003: Milestone Due Date Support [Nice-to-Have]
- **Status:** `Proposed`
- **Why it's needed:** Freelancers and clients need to track milestone deadlines to prioritize deliverables.
- **Which service(s) are affected:** `contract-service`
- **Current behavior vs required behavior:**
  - *Current:* `Milestone` entity and `MilestoneResponse` do not store or return a `dueDate` field.
  - *Required:* `Milestone` has `LocalDate dueDate` field in entity, request, and response.
- **Impact and risks:** Requires a database migration or column addition in `contract-service` DB.
- **Frontend workaround meanwhile:** Frontend treats `dueDate` as optional in `src/types/api.ts` and gracefully falls back to contract `endDate` or milestone creation date when omitted.
