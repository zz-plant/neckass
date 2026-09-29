(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    Neckass.data = Neckass.data || {};
    const data = Neckass.data;

    // What runs on which day. modules/calendar.js matches `on` against the
    // issue's date; the item then runs at the top of its section, in place
    // of one dealt item, so the counts do not change. Weekdays are 0–6 from
    // Sunday. `nth` is which of that weekday in the month; `dayAfter` runs
    // the item the day after the spec matches, which is how Wednesday
    // reports on Tuesday's council meeting.
    //
    // Placeholders: {age}, {ageLess2}, {years} and {yearsWord} (of the
    // paper), {year}, {lastYear}. A rule marked `unlessWritten` stands down
    // on a landmark issue (data/editions.js), whose lead covers the day.
    data.CALENDAR = [
        // ---- The week -------------------------------------------------
        {
            on: { weekday: 1 },
            section: 'classifieds',
            item: 'LOST: a weekend. Owner spent it "catching up" and has caught up on nothing.',
        },
        {
            on: { weekday: 5 },
            section: 'briefs',
            item: 'Neckass has said "is it Friday already." He has said it on each of the last four Fridays and one Thursday.',
        },
        {
            on: { weekday: 6 },
            section: 'briefs',
            item: 'Neckass has gone to the farmers market "for a look" and bought a plant. It is the fourth plant. The first three are on the windowsill, and they are not well.',
        },
        {
            on: { weekday: 0 },
            section: 'briefs',
            item: 'Neckass has said Sunday is "for resetting." He has reset by watching nine episodes of a show he says he does not like.',
        },

        // ---- The council: first and third Tuesday ----------------------
        {
            on: { weekday: 1, nth: [1, 3] },
            section: 'notices',
            item: 'Town council meets Tuesday at 7 p.m. in the council chamber. Public comment is limited to three minutes per speaker. The agenda is posted at the town office.',
        },
        {
            on: { weekday: 2, nth: [1, 3] },
            section: 'notices',
            item: 'Town council meets tonight at 7 p.m. in the council chamber. Public comment is limited to three minutes per speaker.',
        },
        {
            on: { dayAfter: { weekday: 2, nth: [1, 3] } },
            section: 'briefs',
            item: 'Town council met Tuesday. Public comment was limited to three minutes. Neckass spoke for eleven, on an item not on the agenda. The item is now on next month’s agenda.',
        },
        {
            on: { dayAfter: { weekday: 2, nth: [1, 3] } },
            section: 'corrections',
            item: 'An item on Tuesday’s council meeting gave the length of public comment as three minutes. That is the limit. The comment ran eleven.',
        },

        // ---- The month ------------------------------------------------
        {
            on: { special: 'lastDayOfMonth' },
            section: 'briefs',
            item: 'Neckass has said he will start on the first. It is the last day of the month. He has said it on each of them.',
        },
        {
            on: { special: 'friday13' },
            section: 'briefs',
            item: 'Neckass has said he is "not superstitious" and has not left the house.',
        },

        // ---- The year -------------------------------------------------
        {
            on: { month: 1, day: 1 },
            section: 'briefs',
            item: 'Neckass has announced his resolutions for {year}. They are last year’s, with the year changed.',
        },
        {
            on: { month: 1, day: 1 },
            section: 'notices',
            item: 'Town offices are closed today for New Year’s Day. Trash and recycling collection move one day later this week.',
        },
        {
            on: { month: 1, day: 2 },
            section: 'briefs',
            item: 'Neckass has described January 1 as "a practice day" and started the resolutions again from today.',
        },
        {
            on: { month: 2, day: 14 },
            section: 'classifieds',
            item: 'PERSONAL: to whoever received the card signed "guess who" — he has asked us to confirm it was him.',
        },
        {
            on: { special: 'leapDay' },
            section: 'briefs',
            item: 'Neckass has said he is "technically only nine." He was not born on a leap day. Nobody had asked.',
        },
        {
            on: { special: 'birthday' },
            section: 'briefs',
            item: 'Neckass is {age} today. He has told people he is {ageLess2} since he was {ageLess2}.',
        },
        {
            on: { special: 'birthday' },
            section: 'classifieds',
            item: 'PERSONAL: happy birthday to the man at 12 Orchard Lane, from the people at 14, who would like the recycling bin back.',
        },
        {
            on: { special: 'birthday' },
            section: 'letters',
            item: {
                body: 'I am his mother. He is {age} today. I was there. He tells people he was born in a snowstorm. It was mild. He was late.',
                signature: 'His mother',
            },
        },
        {
            on: { special: 'dstStart' },
            section: 'briefs',
            item: 'The clocks went forward overnight. Neckass has changed one clock. It was the one on the oven, which was already right.',
        },
        {
            on: { dayAfter: { special: 'dstStart' } },
            section: 'briefs',
            item: 'Neckass has been an hour early for everything today. He has described this as "being organized."',
        },
        {
            on: { month: 3, day: 20 },
            section: 'briefs',
            item: 'Neckass has declared it spring. It is 39 degrees. He is in shorts.',
        },
        {
            on: { month: 4, day: 1 },
            section: 'briefs',
            item: 'Neckass has attempted an April Fool’s joke on the office. He explained it first.',
        },
        {
            on: { month: 4, day: 15 },
            section: 'briefs',
            item: 'Neckass has filed his taxes at 11:52 p.m. He has described this as "early, for me."',
        },
        {
            on: { weekday: 1, last: true, month: 5 },
            section: 'notices',
            item: 'Town offices are closed today for Memorial Day. Trash collection moves to Tuesday this week.',
        },
        {
            on: { weekday: 1, last: true, month: 5 },
            section: 'briefs',
            item: 'Neckass has put the trash out. It is a holiday. He has been told twice and has said "they might still come."',
        },
        {
            on: { month: 6, day: 21 },
            section: 'briefs',
            item: 'Neckass has said "the nights are drawing in now." It is the longest day of the year.',
        },
        {
            on: { month: 7, day: 4 },
            section: 'notices',
            item: 'The Independence Day fireworks begin at dusk at Depot Park. The bandstand lot closes to vehicles at 6 p.m.',
        },
        {
            on: { dayAfter: { month: 7, day: 4 } },
            section: 'briefs',
            item: 'Neckass explained the fireworks to the people beside him as they went off. He was wrong about the green ones.',
        },
        {
            on: { weekday: 1, nth: [1], month: 9 },
            section: 'notices',
            item: 'Town offices are closed today for Labor Day. Recycling collection moves to Thursday this week.',
        },
        {
            on: { weekday: 1, nth: [1], month: 9 },
            section: 'briefs',
            item: 'Neckass has said "well, that’s the summer over." He said it on July 9 as well.',
        },
        {
            on: { special: 'anniversary' },
            section: 'notices',
            item: 'The Gazette was first published on this day in 2024. The first edition is in the back issues.',
        },
        {
            on: { special: 'anniversary' },
            unlessWritten: true,
            section: 'briefs',
            item: 'The Gazette is {yearsWord} today. Neckass has said "is it," and asked whether the paper had ever covered him.',
        },
        {
            on: { month: 10, day: 31 },
            section: 'briefs',
            item: 'Neckass has answered the door to trick-or-treaters with nothing in the house. He has offered a banana and been declined.',
        },
        {
            on: { month: 10, day: 31 },
            section: 'classifieds',
            item: 'WANTED: someone to explain the costume. He says it is "obvious."',
        },
        {
            on: { special: 'electionDay' },
            section: 'notices',
            item: 'Polls are open today from 7 a.m. to 8 p.m. at the community center. Bring identification.',
        },
        {
            on: { special: 'electionDay' },
            section: 'briefs',
            item: 'Neckass has voted and asked the poll worker whether he got it right. She said she could not say. He has taken this as a no.',
        },
        {
            on: { special: 'dstEnd' },
            section: 'briefs',
            item: 'The clocks went back overnight. Neckass has told four people about the extra hour and spent it looking for the manual for the car clock.',
        },
        {
            on: { special: 'thanksgiving' },
            section: 'notices',
            item: 'Town offices are closed Thursday and Friday for Thanksgiving. Recycling collection moves to Saturday.',
        },
        {
            on: { special: 'thanksgiving' },
            section: 'briefs',
            item: 'Neckass was asked to bring a side. He has brought a bag of rolls, opened, and described them as "artisan."',
        },
        {
            on: { dayAfter: { special: 'thanksgiving' } },
            section: 'briefs',
            item: 'Neckass left the Thanksgiving table with one plate of leftovers and went back for a second, "for someone else."',
        },
        {
            on: { month: 12, day: 24 },
            section: 'briefs',
            item: 'Neckass has begun his Christmas shopping. The stores close at five.',
        },
        {
            on: { month: 12, day: 25 },
            section: 'notices',
            item: 'The Gazette is published today as on every day. The office is closed.',
        },
        {
            on: { month: 12, day: 25 },
            section: 'briefs',
            item: 'Neckass has received a gift he gave someone last year. He has said "oh, nice" and asked where they found it.',
        },
        {
            on: { month: 12, day: 31 },
            section: 'briefs',
            item: 'Neckass has said {year} was "a building year" and that {lastYear} was too.',
        },
    ];
})();
