package main

import (
	"fmt"

	"golang.org/x/exp/slices"
)

// sortAscending orders the slice in place, smallest first.
func sortAscending(nums []int) {
	// On golang.org/x/exp from mid-2023, SortFunc takes a `less` comparator
	// that returns bool.
	slices.SortFunc(nums, func(a, b int) bool { return a < b })
}

func main() {
	nums := []int{3, 1, 2}
	sortAscending(nums)
	fmt.Println(nums)
}
