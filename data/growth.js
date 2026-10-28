// When the pools grew. Every item in a pool has a number, from 1 with
// none skipped, and is dealt by its number, not by where it sits in the
// file. From issue `from` on, a pool deals numbers 1 to `size`, less any
// a step has retired, so an item added to a pool runs only in issues that
// had not gone to press when it was added, and every back issue keeps
// what it was printed with. The first step of each pool is the pool as
// it stood when it could not grow.
//
// A step may also set `perIssue`, the places a day the section deals
// from then on, which with the item each section carries from the lead
// is how many the page prints; and `retired`, the numbers it stops
// dealing. A retired item stays in the pool for the back issues that ran
// it.
//
// To add to a pool: give the new items the next numbers, and add a step
// here at an issue that has not run yet, with the pool's new highest
// number. To retire an item: add a step with its number in `retired`.
// Edit an item in place freely; never change an item's number or delete
// one. A smoke test checks the numbering, that the last step of each pool
// is its highest number, that each back issue is still dealt what it was
// dealt, and that a retired item does not run.
//
// No. 770 is Saturday, Nov. 7, 2026.
export const GROWTH = {
    leads: [
        { from: 1, size: 52 },
        { from: 770, size: 70 },
    ],
    briefs: [
        { from: 1, size: 143 },
        { from: 770, size: 155, perIssue: 4 },
    ],
    corrections: [
        { from: 1, size: 50 },
        { from: 770, size: 62, perIssue: 2 },
    ],
    classifieds: [
        { from: 1, size: 60 },
        { from: 770, size: 72, perIssue: 2 },
    ],
    letters: [
        { from: 1, size: 33 },
        { from: 770, size: 39 },
    ],
    weather: [
        { from: 1, size: 41 },
        { from: 770, size: 45 },
    ],
};
