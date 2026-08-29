package main

import (
	"fmt"

	"golang.org/x/exp/slices"
)

// This file is written against golang.org/x/exp as of May 2023.
// The Codespace upgraded it to the October 2023 version without touching this
// code. In between, the whole `slices` package switched its comparator
// convention from a boolean "less" function to an int-returning "compare"
// function, so every call below stopped compiling.

type user struct {
	name string
	age  int
}

// ── BREAKING 1 ────────────────────────────────────────────────────────────
// slices.SortFunc took `func(a, b E) bool` (a "less" predicate).
// It now takes `func(a, b E) int` (a "compare" function, like cmp.Compare).
func sortByAge(users []user) {
	slices.SortFunc(users, func(a, b user) bool { return a.age < b.age })
}

// ── BREAKING 2 ────────────────────────────────────────────────────────────
// Same change for the stable variant.
func sortByNameStable(users []user) {
	slices.SortStableFunc(users, func(a, b user) bool { return a.name < b.name })
}

// ── BREAKING 3 ────────────────────────────────────────────────────────────
// slices.BinarySearchFunc's comparator moved from `func(E, T) bool` to
// `func(E, T) int` as part of the same sweep.
func findByName(users []user, name string) (int, bool) {
	return slices.BinarySearchFunc(users, name, func(u user, target string) bool {
		return u.name < target
	})
}

// ── BREAKING 4 ────────────────────────────────────────────────────────────
// slices.IsSortedFunc took a "less" predicate too.
func sortedByAge(users []user) bool {
	return slices.IsSortedFunc(users, func(a, b user) bool { return a.age < b.age })
}

func main() {
	users := []user{{"ada", 36}, {"grace", 45}, {"alan", 41}}
	sortByAge(users)
	sortByNameStable(users)
	fmt.Println(users, sortedByAge(users))
}
