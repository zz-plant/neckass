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
// A step may also rank what it runs first: `first`, a list of numbers,
// which its first round deals before anything else, in that order, to the
// places the days actually print. The rest are shuffled behind them as
// usual, and every later round is shuffled whole. An item that ran in the
// step's last days before it is not dealt early; a unit test fails if a
// ranked item would be. Order a ranking by strength, and keep the days
// mixed: a column of four reads as one page.
//
// No. 770 is Saturday, Nov. 7, 2026; No. 790 is Friday, Nov. 27.
export const GROWTH = {
    leads: [
        { from: 1, size: 52 },
        {
            from: 770,
            size: 109,
            retired: [
                3, 5, 11, 13, 16, 17, 18, 22, 27, 28, 30, 31, 40, 41, 47, 48,
                49, 50, 59,
            ],
            // A month of leads, one a day from No. 770. The Committee on
            // Removing Obstacles (57) is formed before the briefs on it run,
            // and the copier (71) before the second new hire is seated.
            first: [
                109, 61, 9, 93, 71, 101, 106, 62, 97, 64, 58, 92, 95, 82, 80, 2,
                57, 77, 105, 12, 65, 108, 90, 68, 81, 96, 55, 54, 107, 14,
            ],
        },
    ],
    briefs: [
        { from: 1, size: 143 },
        {
            from: 770,
            size: 349,
            perIssue: 4,
            // Nos. 770 to 789, by day. It ends on No. 789's first two
            // places, the hearing (180) under the bag of rolls and above the
            // chicken (186), which No. 800's editorial cites.
            first: [
                217, 115, 274, 258, 288, 236, 175, 24, 327, 250, 267, 266, 193,
                252, 206, 297, 264, 89, 291, 8, 239, 215, 305, 226, 211, 114,
                296, 323, 195, 212, 339, 216, 340, 249, 300, 196, 336, 72, 125,
                302, 290, 335, 197, 342, 52, 144, 318, 20, 330, 164, 280, 344,
                255, 108, 343, 183, 293, 34, 153, 154, 311, 240, 158, 312, 227,
                263, 180, 186,
            ],
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
            size: 384,
            perIssue: 4,
            retired: [
                11, 12, 129, 138, 172, 179, 187, 200, 205, 225, 244, 246, 259,
                270, 271, 301, 309, 310, 325, 353, 358, 359, 368, 369,
            ],
            // He gets what he asked for (376 to 384), first, with the best
            // of what has not run since No. 770.
            first: [
                350, 376, 370, 328, 383, 352, 371, 379, 357, 349, 384, 372, 378,
                366, 361, 380, 375, 351, 382, 377, 362, 373, 331, 360, 365, 347,
                334, 321, 374, 314, 367, 345, 307, 313, 332, 356, 363, 213, 279,
                265, 257, 234, 306, 269, 277, 241, 254, 337,
            ],
        },
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
            size: 60,
            retired: [2, 8, 24],
        },
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
