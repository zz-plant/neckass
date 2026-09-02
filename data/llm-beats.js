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
                text: 'Neckass, again,',
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
            'has bought a second',
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
            '{possessive} position that Tuesdays are a scam',
            'the 400 unread emails',
            'the habit tracker with one habit in it',
            'the smart fridge, which is counting',
            '{possessive} claim to have read the room',
            'the password he just reset to the old password',
            'the terms and conditions, all of them',
            'a hoodie he wore for six weeks and tried to return',
            'the no-meeting day he scheduled a meeting about',
            'the email agreeing to be best man, still unread',
            'the standing desk he sits at',
            '{possessive} plan B for plan B',
            '{possessive} promise to wake early',
            'the second inbox',
            'the refund he asked for because of a bad vibe',
            '{possessive} "quick question," forty minutes long',
            'the houseplant he put read receipts on',
            'the digital detox he posted about fourteen times',
            '{possessive} podcast, which has one listener',
            'page one of the book about focus',
            'the meme he tried to save to the cloud and printed',
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
            'an argument with the printer',
            'a "no rush" he followed up on in eleven minutes',
            'being told, twice',
            'a look from everyone in the room',
        ],
        // The second sentence. A fact about what happened next.
        impacts: [
            'He has done this before.',
            'Nobody asked him to.',
            'It was not necessary.',
            'He was told not to.',
            'This is the fourth time.',
            'He then did the opposite.',
            'He has since denied it.',
            'He was late.',
            'It did not help.',
            'It made it worse.',
            'He did not read it first.',
            'He was wrong.',
            'He was right, which was worse.',
            'It took forty minutes.',
            'Nobody replied.',
            'He has not noticed.',
            'He was the only one there.',
            'He then went back to bed.',
            'The group chat has been told.',
            'He called it "a process."',
            'He is fine, he says.',
            'It is still broken.',
        ],
        // Short and singular, with nothing trailing. Only these lead a
        // sentence or sit before a ruling.
        claims: [
            'the two-minute task',
            'the noise complaint about his own alarm',
            'the unread email',
            'the second inbox',
            'the ten-year plan',
            'the quick question',
            'the "no rush" email',
            'the hoodie return',
            'the refund for a bad vibe',
            'the request for dark mode on the sun',
            'the habit tracker',
            'the printer',
            'the gym membership',
            'the promise to wake early',
            'the puzzle piece',
            'the podcast',
            'the bicycle',
            'the leftovers',
        ],
        // What happened to the claim.
        rulings: [
            'was turned down',
            'was ignored',
            'went unanswered',
            'was upheld, against him',
            'was withdrawn when nobody replied',
            'was blamed on the cat',
            'was posted about',
            'was forgotten by lunch',
            'was rescheduled a fourth time',
            'got worse',
            'was explained twice, slowly',
            'was resolved by turning it off and on',
        ],
    };

    data.BEATS = BEATS;
})();
