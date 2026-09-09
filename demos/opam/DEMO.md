# Try Drift — OCaml

This project depends on `lwt` **4.5.0**.

The Codespace upgraded it to **5.7.0** and left the source code alone, so
`lib/scheduler.ml` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The breaking change in this demo:

1. Lwt 5.0.0 narrowed [Lwt.async] from [(unit -> _ t) -> unit] to [(unit -> unit t) -> unit]: the callback must now evaluate to [unit Lwt.t] rather than any ['a Lwt.t]. The callback below returns [int Lwt.t], which compiled under Lwt 4 and is a type error under Lwt 5.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `lwt`.
3. Open `lib/scheduler.ml` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs opam`.
