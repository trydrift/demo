# Try Drift — OCaml

This project depends on `lwt` **4.5.0**.

The Codespace upgraded it to **5.7.0** and left the source code alone, so
`lib/scheduler.ml` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

3 breaking changes in this demo:

1. Lwt_sequence was removed from Lwt's public API in Lwt 5.0. It is an internal module now; consumers were told to vendor it.
2. Lwt.wrap1 (and wrap2..wrap7) were removed in Lwt 5.0.
3. Lwt.add_task_l and Lwt.add_task_r were removed in Lwt 5.0 along with the public Lwt_sequence they operated on.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `lwt`.
3. Open `lib/scheduler.ml` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs opam`.
