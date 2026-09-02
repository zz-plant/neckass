(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    Neckass.data = Neckass.data || {};
    const data = Neckass.data;

    // Same register as data/headlines.js: a wire service filing on a Neckass.
    // Flat statement, then a second flat sentence that declines to help.
    // Nothing is signalled as a joke. Slots are written to be interchangeable —
    // every verb takes every object, every connector takes every twist —
    // because llm.js picks each independently.
    const BEATS = {
        // Kickers. A desk that files this sort of thing daily.
        desks: [
            'Bulletin:',
            'Wire report:',
            'Filed under routine neckassery:',
            'Filed under administrative neckassery:',
            'Standing item:',
            'Correction, third of the week:',
            'From the record:',
            'Late edition:',
        ],
        // Weighted toward Neckass himself; the rest are parties to a case.
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
                text: 'Neckass',
                genitive: "Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'The Neckass in question',
                genitive: "The Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: 'A second Neckass',
                genitive: "The second Neckass's",
                pronouns: { possessive: 'his', object: 'him' },
            },
            {
                text: "Neckass's emergency contact",
                genitive: "The emergency contact's",
                pronouns: { possessive: 'their', object: 'them' },
            },
            {
                text: 'A party described in filings as neckass-adjacent',
                genitive: "The adjacent party's",
                pronouns: { possessive: 'their', object: 'them' },
            },
            {
                text: 'A witness with no connection to the matter',
                genitive: "The unconnected witness's",
                pronouns: { possessive: 'their', object: 'them' },
            },
            {
                text: 'The committee reviewing the term',
                genitive: "The committee's",
                pronouns: { possessive: 'their', object: 'them' },
            },
            {
                text: 'A neighbor who asked to be described as uninvolved',
                genitive: "The uninvolved neighbor's",
                pronouns: { possessive: 'their', object: 'them' },
            },
        ],
        // Transitive and flat. No verb here is doing a bit.
        verbs: [
            'has escalated',
            'has declined to define',
            'has requested an extension on',
            'has filed a complaint about',
            'has claimed credit for',
            'has been unable to locate',
            'has appealed',
            'has reopened',
            'has taken a formal position on',
            'has stood by',
            'has been asked to clarify',
            'has attributed the delay to',
            'has sought a second opinion on',
            'has entered into the record',
            'has entered a formal objection to',
            'has demanded a recount concerning',
            'has notified three people about',
            'has scheduled a meeting about',
        ],
        // Noun phrases. Several carry the section-hint words llm.js reads back
        // out of the finished text (podcast, book, app, cloud, meme, bot).
        objects: [
            'the two-minute task, now in its fourth calendar',
            '{possessive} own alarm clock',
            '{possessive} ten-year plan, which is one page long',
            'a group chat {possessive} muted and still checks',
            'a subscription with no recorded use since 2019',
            '{possessive} position that Tuesdays are a scam',
            'the 400 emails described as pending',
            'a habit tracker recording one habit',
            'the smart fridge, which is also filing',
            '{possessive} statement that the room was read',
            'a password identical to the one it replaced',
            'the terms and conditions, read once, to no effect',
            'a hoodie returned after emotional use',
            '{possessive} no-meeting day, to be planned Thursday',
            'an unread email agreeing to be best man',
            'the standing desk, used exclusively for standing',
            'a contingency filed as Plan B+',
            '{possessive} intention to wake early, stated again',
            'the second inbox, not in dispute',
            'a refund request citing a bad vibe',
            '{possessive} definition of "quick", still outstanding',
            'the read receipts added to the houseplants',
            'a detox documented in fourteen posts',
            'a podcast with one listener, who wants a refund',
            'the book on focus, page one',
            'an app that has requested a review of him',
            'the cloud backup, printed',
            'a meme submitted as an attachment',
            'the bot that replied on {possessive} behalf',
            'a gym membership located, unlike the gym',
        ],
        connectors: [
            'after',
            'citing',
            'following',
            'pending',
            'despite',
            'shortly after',
        ],
        // Bare noun phrases, so they read correctly after any connector.
        twists: [
            'a second reminder',
            'four unanswered follow-ups',
            'an unrelated notification',
            'the volume of correspondence',
            'a scheduling conflict of {possessive} own making',
            'prior commitments that could not be produced',
            'sustained internal discussion',
            'a review that reached no conclusion',
            'the absence of any request',
            'an appeal filed by the printer',
            'a formal objection from the smart speaker',
            'ninety seconds of consideration',
            'advice to hydrate',
            'a poll {possessive} own household lost',
            'one documentary',
            'the failure of the term to narrow',
        ],
        // The second sentence. It arrives, adds nothing, and stops.
        impacts: [
            'The matter has been noted.',
            'No timeline was given.',
            'The claim has not been verified.',
            'The findings have not proved useful.',
            'This was considered inadequate.',
            'Sources familiar with the matter declined to elaborate.',
            'The room has not corroborated this.',
            'Prior statements are on file.',
            'Escalation is being monitored.',
            'No cause has been identified.',
            'Manual review agreed.',
            'Later has requested an extension.',
            'The usage is considered figurative.',
            'Reviewers were again unable to define the term.',
            'Nothing further has been scheduled.',
            'Nobody had asked.',
            'This is the fourth such filing.',
            'The original request has since expired.',
            'A definition was requested and not supplied.',
            'The record does not indicate why.',
            'All parties consider the matter settled. It is not.',
            'The explanation was found to be circular.',
            'Automated systems abstained. Manual review agreed.',
            'The term was, on review, used correctly.',
        ],
        // Short and singular, with nothing trailing. Only these lead a
        // sentence or sit before a ruling, where an appositive tail would
        // break agreement.
        claims: [
            'the two-minute task',
            'the noise complaint against {possessive} alarm clock',
            'the unread email',
            'the second inbox',
            'the ten-year plan',
            'the quick question',
            'the "no rush" notice',
            'the hoodie return',
            'the refund for a bad vibe',
            'the request for dark mode on the sun',
            'the habit tracker',
            'the printer described as neckass',
            'the gym membership',
            'the intention to wake early',
            'the definition of "quick"',
            'the standing desk',
            'the missing puzzle piece',
            'the podcast refund',
        ],
        // Passive predicates, so a claim can lead the sentence.
        rulings: [
            'was declined under policy',
            'was upheld on appeal',
            'has not been acknowledged',
            'was returned without comment',
            'has been accepted for review',
            'could not be independently corroborated',
            'was found to be circular',
            'remains unverified after two attempts',
            'was recorded, filed, and not acted upon',
            'was classified as neckass-adjacent',
            'has been referred to a committee',
            'was withdrawn before anyone responded',
        ],
    };

    data.BEATS = BEATS;
})();
