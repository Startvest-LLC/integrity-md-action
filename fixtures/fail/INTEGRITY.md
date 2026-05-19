# INTEGRITY.md — fail fixture

**Product:** integrity-md-action fail-tier selftest fixture
**Operator:** Startvest LLC
**Framework version evaluated against:** 1.0
**Self-evaluation tier:** (intentionally failing)
**Last updated:** 2026-05-19

This fixture intentionally violates a CRITICAL rule
(`CRIT-SV-NO-SILENT-PASS`) via `src/silent-pass.mjs`, so the action
should report `tier: fail` and exit non-zero. Used to exercise the
fail-path in the selftest.

---

## Layer 1 vetoes — self-mapping

### Veto 1 — Artifact versus outcome

**Pass.** Test fixture.

### Veto 2 — Independence

**Pass.** Test fixture.

### Veto 3 — Verifiability

**Pass.** This file is the verification target.

### Veto 4 — AI accountability

**Pass.** No AI decisions in this fixture.

### Veto 5 — Pricing-rigor alignment

**Pass.** Test fixture.

### Veto 6 — The TechCrunch test

**Pass.** Test fixture.

---

## Version

0.1 — 2026-05-19 — Initial fail-tier fixture (see fixtures/fail/INTEGRITY.md).

## Changelog

### 0.1 — 2026-05-19
- Initial fixture with intentional silent-pass violation in src/silent-pass.mjs.
