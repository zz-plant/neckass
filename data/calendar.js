// What runs on which day. modules/calendar.js matches `on` against the
// issue's date; the item then runs at the top of its section, in place
// of one dealt item, so the counts do not change. Weekdays are 0–6 from
// Sunday. `nth` is which of that weekday in the month; `dayAfter` runs
// the item the day after the spec matches, which is how Wednesday
// reports on Tuesday's book club.
//
// Placeholders: {age}, {ageLess2}, {years} and {yearsWord} (of the
// paper), {year}, {lastYear}. A rule may set `from: 'YYYY-MM-DD'` and
// does not run before it. The standing matters at the foot of the file
// also fill {id.days}, {id.months} and {id.count} from data.FEUDS. A
// rule marked `unlessWritten` stands down on a landmark issue
// (data/editions.js), whose lead covers the day.
export const CALENDAR = [
    // ---- The week -------------------------------------------------
    {
        on: { weekday: 1 },
        section: 'classifieds',
        item: 'LOST: a weekend. Owner said Friday he would “do absolutely nothing” and, by his account, ran out of time.',
    },
    {
        on: { weekday: 5 },
        section: 'briefs',
        item: 'Neckass has said “is it Friday already?” He has said it on each of the last four Fridays and one Thursday.',
    },
    {
        on: { weekday: 6 },
        section: 'briefs',
        item: 'Neckass went to the farmers market “for a look” and bought a plant. It is the fourth plant. The first three are on the windowsill and are not expected to recover.',
    },
    {
        on: { weekday: 0 },
        section: 'briefs',
        item: 'Neckass said Sunday is “for resetting.” He reset by watching nine episodes of a show he says he does not like.',
    },

    // ---- Book club: first and third Tuesday ------------------------
    {
        on: { dayAfter: { weekday: 2, nth: [1, 3] } },
        section: 'briefs',
        item: 'Book club met Tuesday, and Neckass, who had not read the book, spoke for twelve minutes under a three-minute rule, on the cover, and proposed it again for next month.',
    },
    {
        on: { dayAfter: { weekday: 2, nth: [1, 3] } },
        section: 'corrections',
        item: 'An item on Tuesday’s book club gave each member’s turn as three minutes. That is the rule. His turn ran twelve.',
    },

    // ---- The month ------------------------------------------------
    {
        on: { special: 'lastDayOfMonth' },
        section: 'briefs',
        item: 'Neckass said he would start on the first, as he has said on the last day of every month so far.',
    },
    {
        on: { special: 'friday13' },
        section: 'briefs',
        item: 'Neckass said he is “not superstitious” and has not left the house.',
    },

    // ---- The year -------------------------------------------------
    {
        on: { month: 1, day: 1 },
        section: 'briefs',
        item: 'Neckass announced his resolutions for {year}. They are last year’s, with the year changed.',
    },
    {
        on: { month: 1, day: 2 },
        section: 'briefs',
        item: 'Neckass described Jan. 1 as “a practice day” and started the resolutions over today.',
    },
    {
        on: { month: 2, day: 14 },
        section: 'classifieds',
        item: 'PERSONAL: to whoever received the card signed “guess who” — he has asked us to confirm it was him.',
    },
    {
        on: { special: 'leapDay' },
        section: 'briefs',
        item: 'Neckass, who was not born on a leap day and had not been asked, said he is “technically only nine.”',
    },
    {
        on: { special: 'birthday' },
        section: 'briefs',
        item: 'Neckass is {age} today. He has told people he is {ageLess2} since he was {ageLess2}.',
    },
    {
        on: { special: 'birthday' },
        section: 'classifieds',
        item: 'PERSONAL: happy birthday to the man at No. 12, from the people at No. 14, who would like the recycling bin back.',
    },
    {
        on: { special: 'birthday' },
        section: 'letters',
        item: {
            body: 'I am his mother. He is {age} today, and I was there. He tells people he was born in a snowstorm. It was mild, and he was late.',
            signature: 'His mother',
        },
    },
    {
        on: { special: 'dstStart' },
        section: 'briefs',
        item: 'The clocks went forward overnight. Neckass changed one clock, the oven clock, which was already right.',
    },
    {
        on: { dayAfter: { special: 'dstStart' } },
        section: 'briefs',
        item: 'Neckass has been an hour early for everything today. He has described this as “being organized.”',
    },
    {
        on: { month: 3, day: 20 },
        section: 'briefs',
        item: 'Neckass, in shorts at 39 degrees, declared it spring.',
    },
    {
        on: { month: 4, day: 1 },
        section: 'briefs',
        item: 'Neckass attempted an April Fools’ joke on the office. He explained it first.',
    },
    {
        on: { month: 4, day: 15 },
        section: 'briefs',
        item: 'Neckass filed his taxes at 11:52 p.m. He has described this as “early, for me.”',
    },
    {
        on: { weekday: 1, last: true, month: 5 },
        section: 'briefs',
        item: 'Neckass went in to work on Memorial Day, having been told twice it was a holiday, and sat at his desk until 11 waiting for “the others.”',
    },
    {
        on: { month: 6, day: 21 },
        section: 'briefs',
        item: 'Neckass said “the days are already getting shorter.” It is the longest day of the year.',
    },
    {
        on: { dayAfter: { month: 7, day: 4 } },
        section: 'briefs',
        item: 'Neckass explained the fireworks to the people beside him as they went off. He was wrong about the green ones.',
    },
    {
        on: { weekday: 1, nth: [1], month: 9 },
        section: 'briefs',
        item: 'Neckass said “well, summer’s over.” He said it on July 9 as well.',
    },
    {
        on: { special: 'anniversary' },
        unlessWritten: true,
        section: 'briefs',
        item: 'The Gazette is {yearsWord} today. Neckass has said “is it?” and asked whether the paper had ever covered him.',
    },
    {
        on: { month: 10, day: 31 },
        section: 'briefs',
        item: 'Neckass answered the door to trick-or-treaters with nothing in the house. He offered a banana and was declined.',
    },
    {
        on: { month: 10, day: 31 },
        section: 'classifieds',
        item: 'WANTED: someone to explain the costume. He has explained it four times, and it is less clear each time.',
    },
    {
        on: { special: 'electionDay' },
        section: 'briefs',
        item: 'Neckass wore an “I voted” sticker to work. It is from 2022. He said it “still counts.”',
    },
    {
        on: { special: 'dstEnd' },
        section: 'briefs',
        item: 'The clocks went back overnight. Neckass told four people about the extra hour and spent it looking for the manual for the car clock.',
    },
    {
        on: { special: 'thanksgiving' },
        section: 'briefs',
        item: 'Neckass was asked to bring a side. He brought a bag of rolls, opened, and described them as “artisan.”',
    },
    {
        on: { dayAfter: { special: 'thanksgiving' } },
        section: 'briefs',
        item: 'Neckass left the Thanksgiving table with one plate of leftovers and went back for a second, “for someone else.”',
    },
    {
        on: { month: 12, day: 24 },
        section: 'briefs',
        item: 'Neckass began his Christmas shopping. The stores close at five.',
    },
    {
        on: { month: 12, day: 25 },
        section: 'briefs',
        item: 'Neckass received a gift he gave someone last year. He said “oh, nice” and asked where they found it.',
    },
    {
        on: { month: 12, day: 31 },
        section: 'briefs',
        item: 'Neckass said {year} was “a building year” and that {lastYear} was too.',
    },

    // ---- Standing matters ------------------------------------------
    // The witnesses with open files. Each serial files on the day of
    // the month its grudge began, and every count in it is computed
    // from the issue's date: a back issue carries the number as of
    // that issue, so the archive is the ledger. Read the 14th of two
    // different months and next door's bin letter has counted itself
    // up. A serial begins a month after the grudge, so its first
    // filing is count 1 and it never runs in an issue that predates
    // the grudge.
    {
        on: { day: 2, from: '2026-04-02' },
        section: 'briefs',
        item: 'The package, on the passenger seat since March, has now been “going out this week” for {package.days} days.',
    },
    {
        on: { day: 4, from: '2026-08-04' },
        section: 'letters',
        item: {
            body: 'The $35 that remains of the $40 from the Fourth of July has been outstanding for {debt.days} days. The $5 came back with the note “we even?” I have kept the note.',
            signature: 'The friend from the Fourth, $35 down',
        },
    },
    {
        on: { day: 8, from: '2026-04-08' },
        section: 'classifieds',
        item: 'WANTED: hoodie, gray, borrowed in March, now {hoodie.days} days out and appearing on Instagram, where the brand is credited and the owner is not.',
    },
    {
        on: { day: 14, from: '2025-10-14' },
        section: 'letters',
        item: {
            body: 'I am at No. 14. This is letter number {bin.count} about the bin, which is in my yard again and which he says the wind moved. I have kept every letter.',
            signature: 'Next door',
        },
    },
    {
        on: { day: 15, from: '2025-10-15' },
        section: 'corrections',
        item: 'The Gazette printed next door’s letter of the 14th about the bin and has confirmed one fact in it, the address, No. 14. The wind remains unverified, and the bin has not moved.',
    },
    {
        on: { weekday: 0, nth: [2], month: 5 },
        section: 'letters',
        item: {
            body: 'I am his mother. He called Saturday, the day before Mother’s Day, to say he would call Sunday. I have read this paper every day since the first one, {ma.count} issues of it. It is how I know about the shoes.',
            signature: 'His mother',
        },
    },
];

// The standing matters' start dates. `days` is the days since
// `since`; a `months` feud also fills `months`, and its `count` is
// the monthly filings to date; a `days` feud fills `count` as the
// days plus one, which for the paper's first edition is the issue
// number. See modules/calendar.js for the arithmetic.
export const FEUDS = {
    package: { since: '2026-03-02' },
    hoodie: { since: '2026-03-08' },
    debt: { since: '2026-07-04' },
    bin: { since: '2025-09-14', unit: 'months' },
    ma: { since: '2024-09-29', unit: 'days' },
};
