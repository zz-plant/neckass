(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    Neckass.data = Neckass.data || {};
    const data = Neckass.data;

    // The paper's other forms. Each one is its own joke engine: the lead
    // applies wire gravity to a domestic nothing, the corrections retract
    // things nobody asserted, the classifieds are loss in eight words, and
    // the letters are the rest of the world writing in about a man it cannot
    // name. Same register throughout — nothing here knows it is funny.

    // Leads carry a deck: a second, flatter sentence that arrives to help and
    // does not.
    data.LEADS = [
        {
            headline:
                'Neckass has been "five minutes away" since 2019. The claim has not been verified.',
            deck: 'The Gazette has maintained a standing file. It contains only the claim.',
            byline: 'By the wire desk',
        },
        {
            headline:
                'A review of Neckass\'s ten-year plan found it consists of the words "ten-year plan"',
            deck: 'Reviewers requested a second page. None was produced.',
            byline: 'Staff report',
        },
        {
            headline:
                'Neckass has agreed to be best man in an email he has not read',
            deck: 'The wedding is Saturday. Neckass has confirmed his availability, unprompted, for a different Saturday.',
            byline: 'By our correspondent, who was present',
        },
        {
            headline:
                "The smart fridge's filing against Neckass has been accepted for review",
            deck: 'The fridge is represented. Neckass is not.',
            byline: 'By the legal affairs desk',
        },
        {
            headline:
                "Neckass's noise complaint against his own alarm clock was upheld on appeal",
            deck: 'The alarm was not present at the hearing. It had gone off.',
            byline: 'Staff report',
        },
        {
            headline:
                'Neckass muted the group chat and has checked it at ninety-second intervals since',
            deck: 'The chat has not been informed. The intervals have.',
            byline: 'By a reporter who has asked not to be involved',
        },
        {
            headline:
                'Neckass has declared inbox zero. A second inbox is not in dispute.',
            deck: 'The second inbox declined to comment, at length, in a folder.',
            byline: 'By the wire desk',
        },
        {
            headline:
                'Neckass told his doctor he "basically never drinks" using a sommelier\'s vocabulary',
            deck: 'The doctor recorded both statements.',
            byline: 'By the health desk',
        },
        {
            headline:
                'A gym membership held by Neckass since 2013 has been located. Use of the gym has not.',
            deck: 'The membership was found in good standing, which is the only standing available to it.',
            byline: 'Staff report',
        },
        {
            headline:
                "Neckass's out-of-office reply has been active for eleven weeks. Neckass is at his desk.",
            deck: 'Correspondents have adjusted. Neckass has not been told.',
            byline: 'By the wire desk',
        },
        {
            headline:
                'Neckass has read the terms and conditions. The findings have not proved useful.',
            deck: 'He is unable to say what he agreed to, and has agreed to it.',
            byline: 'By the technology desk',
        },
        {
            headline:
                "Neckass's explanation of what a neckass is was found to be circular",
            deck: 'A second explanation was requested. It was the first explanation, delivered more slowly.',
            byline: 'By the language desk',
        },
    ];

    // The Gazette retracts, with full institutional weight, things no one
    // had disputed.
    data.CORRECTIONS = [
        "An earlier edition described Neckass's plan as a plan. The Gazette regrets the characterization.",
        'The Gazette reported that Neckass arrived at eight. He arrived at eight, left, and arrived again.',
        'A previous item referred to "Neckass\'s book." The book is a library book. It is overdue.',
        'The Gazette stated that Neckass had finished. He had stopped.',
        "An item on Tuesday gave Neckass's position on Tuesdays. The position was given on a Wednesday.",
        'The Gazette described a conversation as brief. Both parties dispute this, separately, at length.',
        'We reported that Neckass owns a bicycle. Neckass owns a bicycle-shaped object in a hallway.',
        'An earlier edition quoted Neckass as saying "no worries." There were worries.',
        'The Gazette identified the printer as a printer. The printer has requested a fuller account.',
        'A photograph in Monday\'s edition was captioned "Neckass, thinking." The caption has not been substantiated.',
        'The Gazette wrote that Neckass "woke early." He woke, and did not get up, for one hour and ten minutes.',
        "We described Neckass's apology as an apology.",
        'An earlier edition placed Neckass at the gym. It was the parking lot of the gym.',
        'The Gazette reported one listener. There were two, briefly, by accident.',
    ];

    // A forecast for a temperament.
    data.WEATHER = [
        'Neckass-adjacent. Highs unclear. Conditions described by Neckass, who has not been outside.',
        'Overcast. Neckass has a view on this and will share it in the group chat before noon.',
        'Mild. Neckass has dressed for a different forecast and will not revisit the decision.',
        'Rain expected. Neckass has been notified twice and will be surprised.',
        'Warm. Neckass has asked whether anyone else is hot. The thermostat disagrees.',
        'Clear. Neckass has described the day as "basically nice," the highest rating available to him.',
        'Cold. Neckass is fine. This has not been independently verified.',
        'Wind. A plan has been made outdoors and will be moved indoors at the last possible moment.',
        'Fog. Visibility poor. Neckass has set out confidently in one direction.',
        'Unsettled. Neckass has checked four forecasts and selected the one he preferred.',
    ];

    // Loss, in eight words, at the back of the paper. These are the town's
    // ads, not the subject's — the paper's headlines are already his. Written
    // so that nothing here restates an item running elsewhere in the issue,
    // which reads as a repeat rather than a callback.
    data.CLASSIFIEDS = [
        'FOUND: set of keys, outside the gym. Owner has never been inside.',
        'FOR SALE: bicycle, hallway-kept, unridden. Would suit a similar owner.',
        'WANTED: quiet neighbor. Applications close when the alarm does.',
        'LOST: forty minutes, to a documentary about octopuses.',
        'FREE TO GOOD HOME: houseplant. Has read the receipts. Bears no ill will.',
        'NOTICE: the printer is not accepting further characterizations.',
        'SERVICES: I will tell you the thing you have already decided.',
        'WANTED: someone to end a conversation. Prior experience essential.',
        'FOR SALE: spare Tuesday. Buyer collects. No refunds.',
        'SEEKING: whoever agreed to the terms on my behalf.',
        'LOST: one hour, between the alarm and the getting up. Reward offered.',
        'FOUND: a plan. Ten years, one page. Owner may collect and explain.',
        'PERSONAL: to the man who was five minutes away — we have gone home.',
        'NOTICE: this column does not accept submissions from the subject of this paper.',
        'WANTED: second opinion on some leftovers. Urgent.',
        'FOR SALE: read receipts, unused, still in packaging.',
    ];

    // The world writes in. It cannot name the problem either.
    data.LETTERS = [
        {
            body: 'I am the printer. I am not a neckass.',
            signature: 'The Printer, unincorporated',
        },
        {
            body: 'Regarding your item of Tuesday: it was Wednesday.',
            signature: 'A reader who was present',
        },
        {
            body: 'My alarm clock has been reported to you. It was doing its job.',
            signature: 'A neighbor, uninvolved',
        },
        {
            body: 'You describe Neckass as "doing too much." He is doing one thing, slowly.',
            signature: 'A colleague',
        },
        {
            body: 'I was the second listener of the podcast. I would like this on the record.',
            signature: 'Name withheld',
        },
        {
            body: "Your correction of Monday required a correction. I await Tuesday's.",
            signature: 'A subscriber of long standing',
        },
        {
            body: 'I have been asked to be best man. I have not been asked.',
            signature: 'The groom',
        },
        {
            body: 'Kindly stop covering my refrigerator.',
            signature: "A manufacturer's representative",
        },
        {
            body: 'You have never defined the term. Neither have I. I write only to say that I noticed.',
            signature: 'A retired lexicographer',
        },
        {
            body: 'The octopus documentary was mine. He watched forty minutes of it.',
            signature: 'A former friend',
        },
    ];

    // The colophon. Static, because the staff situation is stable.
    data.COLOPHON = {
        staff: 'Editor-in-chief: vacant. Wire desk: unattended. Corrections: ongoing.',
        note: 'The Gazette does not know what a neckass is and continues to report on one.',
    };
})();
