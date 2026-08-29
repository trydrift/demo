(* Background task helpers.

   This file is written against Lwt 4.5. The Codespace upgraded the dependency
   to Lwt 5.7 without touching it. *)

(* ── BREAKING ───────────────────────────────────────────────────────────
   Lwt 5.0.0 narrowed [Lwt.async] from [(unit -> _ t) -> unit] to
   [(unit -> unit t) -> unit]: the callback must now evaluate to [unit Lwt.t]
   rather than any ['a Lwt.t]. The callback below returns [int Lwt.t], which
   compiled under Lwt 4 and is a type error under Lwt 5. *)
let start_background_count () =
  Lwt.async (fun () -> Lwt.return 42)

let run () = Lwt_main.run (Lwt.return_unit)
