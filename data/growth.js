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
// No. 770 is Saturday, Nov. 7, 2026; No. 790 is Friday, Nov. 27; No. 859 is
// Thursday, Feb. 4, 2027.
export const GROWTH = {
    leads: [
        { from: 1, size: 52 },
        {
            from: 770,
            size: 108,
            retired: [
                3, 5, 11, 13, 16, 17, 18, 22, 27, 28, 30, 31, 40, 41, 47, 48,
                49, 50, 59,
            ],
        },
        // Leads are dealt in rounds of the pool's length, so a step starts
        // where a round ends: No. 859 closes the first round from No. 770.
        { from: 859, size: 109 },
    ],
    briefs: [
        { from: 1, size: 143 },
        {
            from: 770,
            size: 349,
            perIssue: 4,
            retired: [
                7, 14, 15, 21, 26, 28, 33, 47, 49, 50, 51, 58, 63, 69, 75, 77,
                82, 83, 86, 87, 88, 90, 92, 94, 95, 99, 100, 101, 102, 104, 105,
                106, 112, 117, 118, 124, 146,
            ],
        },
        // After No. 789, which No. 800's editorial cites as it ran. Retired
        // here: briefs that told a lead's story again (the inbox, the
        // voice note, the form desk, the audit, the airport, the ChatGPT
        // answer kept for disputes), and the weaker of two briefs telling
        // the same one.
        {
            from: 790,
            size: 375,
            perIssue: 4,
            retired: [
                11, 12, 129, 138, 172, 179, 187, 200, 205, 225, 244, 246, 259,
                270, 271, 301, 309, 310, 325, 353, 358, 359, 368, 369,
            ],
        },
        { from: 791, size: 384, perIssue: 4 },
    ],
    corrections: [
        { from: 1, size: 50 },
        {
            from: 770,
            size: 83,
            perIssue: 2,
            retired: [8, 19, 33, 38, 43],
        },
    ],
    classifieds: [
        { from: 1, size: 60 },
        {
            from: 770,
            size: 93,
            perIssue: 2,
            retired: [10, 11, 14, 23, 28, 34, 43, 46, 49, 50, 51, 55],
        },
    ],
    letters: [
        { from: 1, size: 33 },
        {
            from: 770,
            size: 59,
            retired: [2, 8, 24],
        },
        { from: 791, size: 60 },
    ],
    weather: [
        { from: 1, size: 41 },
        {
            from: 770,
            size: 56,
            retired: [3, 12, 17, 24, 31],
        },
    ],
};
