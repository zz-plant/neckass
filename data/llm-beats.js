(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    Neckass.data = Neckass.data || {};
    const data = Neckass.data;

    // Same register as data/headlines.js: a wire filing on a Neckass that
    // says what he did. Slots are interchangeable — every verb takes every
    // object, every connector takes every twist — because llm.js picks each
    // independently. Every subject takes "he", so the second sentence can
    // name him.
    const BEATS = {
        // Kickers.
        desks: [
            'Update:',
            'Again:',
            'Also today:',
            'From the group chat:',
            'Correction, third of the week:',
            'Late edition:',
        ],
        subjects: [
            {
                text: 'Neckass',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'Neckass',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'Neckass',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'Neckass',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'Neckass',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'Neckass, unprompted,',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'Neckass, at 1 a.m.,',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
        ],
        // Plain actions. What he did.
        verbs: [
            'has lost',
            'has forgotten about',
            'has apologized for',
            'has blamed the cat for',
            'has explained, at length,',
            'has posted about',
            'has cancelled',
            'has rescheduled',
            'has complained about',
            'has taken credit for',
            'has been unable to find',
            'has argued with a stranger about',
            'has googled',
            'has ignored',
            'has scheduled a meeting about',
            'has sent a voice note about',
            'has changed his mind about',
        ],
        // Concrete nouns. The joke is already in each one.
        objects: [
            'the two-minute task he has put off since June',
            '{possessive} own alarm clock',
            '{possessive} ten-year plan, which is three words long',
            'the group chat he muted and still checks',
            'a gym membership he has used twice',
            '{possessive} belief that it is still Tuesday',
            'the 400 unread emails',
            'the habit tracker with one habit in it',
            'the fridge he has opened eleven times since dinner',
            '{possessive} claim to have read the room',
            'the password he just reset to the old password',
            'the terms and conditions, all of them',
            'the hoodie he has worn for six weeks and calls "in rotation"',
            'the no-meeting day he scheduled a meeting about',
            'the email agreeing to be best man, still unread',
            'the standing desk he sits at',
            '{possessive} plan B for plan B',
            '{possessive} promise to wake early',
            'the second inbox',
            'the two-star review he left for a shop that was closed',
            '{possessive} "quick question," forty minutes long',
            'the houseplant he named and now cannot let die',
            'the digital detox he posted about fourteen times',
            '{possessive} podcast, which has one listener',
            'page one of the book about focus',
            'the screenshot of a screenshot',
            'the bicycle in the hallway',
            'the leftovers, nine days old',
            'the one fact he knows about wine',
            'the story everyone has heard',
        ],
        connectors: [
            'after',
            'despite',
            'following',
            'because of',
            'in response to',
            'shortly after',
        ],
        // Noun phrases, so they read correctly after any connector.
        twists: [
            'a second reminder',
            'four unanswered follow-ups',
            'a notification he did not read',
            'a scheduling conflict he created',
            'a poll he lost in his own house',
            'one documentary',
            'forty minutes of explanation',
            'advice from a smart speaker to hydrate',
            'a text he sent at 1 a.m. and deleted at 1:01',
            'a "long story short" that was not short',
            'an argument with a self-checkout',
            'a "no rush" he followed up on in eleven minutes',
            'being told, twice',
            'a reply he sent to the wrong window',
        ],
        // The second sentence. A fact about what happened next.
        impacts: [
            'He has done this before.',
            'Nobody asked him to.',
            'It was his idea.',
            'He was told not to.',
            'This is the fourth time.',
            'He then did the opposite.',
            'He has since denied it.',
            'The deadline was yesterday.',
            'It did not help.',
            'It made it worse.',
            'He did not read it first.',
            'It is in writing.',
            'He was right, which was worse.',
            'It took forty minutes.',
            'Nobody replied.',
            'He has not noticed.',
            'He was the only one there.',
            'He then went back to bed.',
            'The group chat has been told.',
            'He called it "a process."',
            'He is fine, he says.',
        ],
        // Short and singular, with nothing trailing. Only these lead a
        // sentence or sit before a ruling.
        claims: [
            'the two-minute task',
            'the third alarm',
            'the unread email',
            'the second inbox',
            'the ten-year plan',
            'the quick question',
            'the "no rush" email',
            'the hoodie',
            'the two-star review',
            'the phone brightness',
            'the habit tracker',
            'the printer',
            'the gym membership',
            'the promise to wake early',
            'the puzzle piece',
            'the podcast',
            'the bicycle',
        ],
        // What happened to the claim.
        rulings: [
            'was turned down',
            'was ignored',
            'went unanswered',
            'was upheld, against him',
            'was withdrawn when nobody replied',
            'was blamed on the cat',
            'became a slide',
            'was forgotten by lunch',
            'was rescheduled a fourth time',
            'has been escalated',
            'was explained twice, slowly',
        ],
    };

    data.BEATS = BEATS;
})();
