# Try Drift — OCaml

This project depends on `lwt` **4.5.0**.

The Codespace upgraded it to **5.7.0** and left the source code alone, so
`lib/scheduler.ml` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The breaking change in this demo:

1. Lwt 5.0.0 narrowed [Lwt.async] from [(unit -> _ t) -> unit] to [(unit -> unit t) -> unit]: the callback must now evaluate to [unit Lwt.t] rather than any ['a Lwt.t]. The callback below returns [int Lwt.t], which compiled under Lwt 4 and is a type error under Lwt 5.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

From there:

1. Read what Drift found for `lwt` in the panel.
2. Open `lib/scheduler.ml` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain lwt
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs opam`.
