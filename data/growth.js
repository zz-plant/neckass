// When the pools grew. A pool is dealt from its first `size` items from
// issue `from` on, so an item added to the end of a pool runs only in
// issues that had not gone to press when it was added, and every back
// issue keeps what it was printed with. The first step of each pool is
// the pool as it stood when it could not grow.
//
// To add to a pool: append the new items to the end of it, and add a
// step here at an issue that has not run yet, with the pool's new
// length. Never insert an item, reorder a pool or remove one; edit an
// item in place instead. A smoke test checks that the last step of each
// pool is the pool's length, and that each back issue is still dealt the
// places in its pools it was dealt.
//
// No. 770 is Saturday, Nov. 7, 2026.
export const GROWTH = {
    leads: [
        { from: 1, size: 52 },
        { from: 770, size: 70 },
    ],
    briefs: [
        { from: 1, size: 143 },
        { from: 770, size: 155 },
    ],
    corrections: [
        { from: 1, size: 50 },
        { from: 770, size: 62 },
    ],
    classifieds: [
        { from: 1, size: 60 },
        { from: 770, size: 72 },
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
