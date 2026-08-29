(* Task scheduling helpers.

   This file is written against Lwt 4.5. The Codespace upgraded the dependency
   to Lwt 5.7 without touching this code. Lwt 5.0 removed a batch of APIs that
   had been deprecated through the 4.x series, so every marked call below is
   gone. *)

(* ── BREAKING 1 ─────────────────────────────────────────────────────────
   Lwt_sequence was removed from Lwt's public API in Lwt 5.0. It is an
   internal module now; consumers were told to vendor it. *)
let pending : (unit -> unit Lwt.t) Lwt_sequence.t = Lwt_sequence.create ()

(* ── BREAKING 2 ─────────────────────────────────────────────────────────
   Lwt.wrap1 (and wrap2..wrap7) were removed in Lwt 5.0. *)
let lift_read (read : string -> string) : string -> string Lwt.t =
  Lwt.wrap1 read

(* ── BREAKING 3 ─────────────────────────────────────────────────────────
   Lwt.add_task_l and Lwt.add_task_r were removed in Lwt 5.0 along with the
   public Lwt_sequence they operated on. *)
let enqueue () = Lwt.add_task_l pending

let run_all () =
  Lwt_sequence.fold_l (fun task acc -> Lwt.bind acc (fun () -> task ())) pending (Lwt.return_unit)
