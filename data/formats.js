(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    Neckass.data = Neckass.data || {};
    const data = Neckass.data;

    // The paper's other forms. Each is its own joke engine — the corrections
    // retract things the paper got wrong about a man who was wrong first, the
    // classifieds are the town's ads, the letters are the people he has
    // annoyed writing in — and all of them say what happened. Numbers, times,
    // and who was there, not "the matter has been noted."

    // A lead carries a deck: a second sentence with the detail the headline
    // did not have room for.
    data.LEADS = [
        {
            headline:
                'Neckass has been "five minutes away" since 2019. He is at home.',
            deck: 'He has said "five minutes" to eleven people this year. He has not left the house for any of them.',
            byline: 'By the wire desk',
        },
        {
            headline:
                'A review of Neckass\'s ten-year plan found it consists of the words "ten-year plan"',
            deck: 'The plan is one page. The page says "ten-year plan." There is nothing else on it.',
            byline: 'Staff report',
        },
        {
            headline:
                'Neckass has agreed to be best man in an email he has not read',
            deck: 'The wedding is Saturday. He has told the groom he is free a different Saturday.',
            byline: 'By our correspondent, who was present',
        },
        {
            headline:
                "Neckass's fridge has reported him for opening it 41 times and taking nothing",
            deck: 'The fridge logs door openings. He was looking, not eating. It has told the manufacturer.',
            byline: 'By the technology desk',
        },
        {
            headline:
                "Neckass's noise complaint against his own alarm clock was upheld on appeal",
            deck: 'He set it, it rang, and he reported it. He was told he had set it. He appealed. He was told again.',
            byline: 'Staff report',
        },
        {
            headline:
                'Neckass muted the group chat and has checked it at ninety-second intervals since',
            deck: 'Muting stopped the notifications. It did not stop him. He has opened the chat 400 times today.',
            byline: 'By a reporter who was in the group chat',
        },
        {
            headline:
                'Neckass has declared inbox zero. He has a second inbox with 2,000 in it.',
            deck: 'He moved the emails to a folder called "Later." Later has 2,000 emails.',
            byline: 'By the wire desk',
        },
        {
            headline:
                'Neckass told his doctor he "basically never drinks" using a sommelier\'s vocabulary',
            deck: 'He said "basically never," then described a "grippy, mineral" red he had "on a Tuesday, as one does."',
            byline: 'By the health desk',
        },
        {
            headline:
                'Neckass has paid for a gym membership since 2013 and has been to the gym twice',
            deck: 'That is $4,100 for two visits. One of them was to ask about cancelling.',
            byline: 'Staff report',
        },
        {
            headline:
                "Neckass's out-of-office reply has been active for eleven weeks. Neckass is at his desk.",
            deck: 'He set it for a long weekend in June. Everyone has stopped emailing him. He has noticed and is pleased.',
            byline: 'By the wire desk',
        },
        {
            headline:
                'Neckass read the terms and conditions in full, understood none of them, and agreed',
            deck: 'It took forty minutes. Asked what he had agreed to, he said "the usual."',
            byline: 'By the technology desk',
        },
        {
            headline:
                'Asked what a neckass is, Neckass said "you know, a neckass"',
            deck: 'Asked again, he said it more slowly.',
            byline: 'By the language desk',
        },
    ];

    // The paper got it wrong. It says how.
    data.CORRECTIONS = [
        "An earlier edition called Neckass's plan a plan. It is three words on a page. The Gazette regrets the error.",
        'The Gazette reported that Neckass arrived at eight. He arrived at eight, realized he had forgotten his keys, and arrived again at 8:50.',
        'A previous item referred to "Neckass\'s book." It is a library book, due in March. It is now September.',
        'The Gazette stated that Neckass had finished. He had stopped.',
        "An item gave Neckass's position on Tuesdays. He gave it on a Wednesday, having lost track of the day.",
        'The Gazette described a conversation as brief. It was two hours. Both parties have written in to say so.',
        'We reported that Neckass owns a bicycle. He owns a bicycle he has not ridden since buying it in 2022. It is in the hallway.',
        'An earlier edition quoted Neckass as saying "no worries." There were worries.',
        'The Gazette reported that Neckass fixed the printer. He turned it off and on. It is still broken.',
        'A photograph on Monday was captioned "Neckass, thinking." He was looking at his phone.',
        'The Gazette wrote that Neckass "woke early." He woke, and did not get up, for one hour and ten minutes.',
        'We described Neckass\'s apology as an apology. It was the sentence "well, sorry you feel that way."',
        'An earlier edition placed Neckass at the gym. It was the parking lot of the gym.',
        "The Gazette reported that Neckass's podcast has one listener. It briefly had two. The second was a misclick.",
    ];

    // A forecast, and what he will do about it.
    data.WEATHER = [
        'Sunny, according to Neckass, who has not been outside and is going by the window.',
        'Overcast. Neckass will post "ugh, this weather" in the group chat before noon.',
        "Mild. Neckass is wearing a coat because he checked yesterday's forecast, and will keep it on.",
        'Rain. Neckass was told twice and will not bring a jacket.',
        'Warm. Neckass is hot, has asked if anyone else is, and has been told no.',
        'Clear. Neckass says it is "basically nice," which is the best he has said about anything.',
        'Cold. Neckass says he is fine. He is wearing shorts and is not fine.',
        'Wind. Neckass has planned a picnic and will move it indoors when the food blows away.',
        'Fog. Neckass has set off confidently in the wrong direction.',
        'Unsettled. Neckass has checked four forecasts and selected the one he preferred.',
    ];

    // The town's ads. Not his — his are the headlines — but he is in most of
    // them. Nothing here restates an item running elsewhere in the issue.
    data.CLASSIFIEDS = [
        'FOUND: set of keys, outside the gym. Owner has never been inside.',
        'FOR SALE: bicycle, never ridden. Has lived in a hallway since 2022.',
        'WANTED: neighbor whose alarm does not go off at 5 and get ignored until 6.',
        'LOST: forty minutes, to a documentary about octopuses.',
        'FREE TO GOOD HOME: houseplant. Current owner talks to it and it would like that to stop.',
        'NOTICE: the printer is not broken. It is out of paper. Stop calling it names.',
        'SERVICES: will agree with whatever you have already decided. Neckass is a regular.',
        'WANTED: someone who can end a conversation with Neckass. Nobody has yet.',
        'FOR SALE: one Tuesday. Neckass says they are a scam and will not use his.',
        'SEEKING: anyone who knows what I agreed to. I read all of it. — N.',
        'LOST: one hour, every morning, between the alarm and getting up.',
        'FOUND: a ten-year plan. One page, three words. Owner may collect.',
        'PERSONAL: to the man who was five minutes away — we have gone home.',
        'NOTICE: this column no longer accepts ads from Neckass. He placed nine last week, all "WANTED: motivation."',
        'WANTED: someone to smell some leftovers. They are nine days old. Urgent.',
        'FOR SALE: standing desk, barely used, as the owner sat at it.',
    ];

    // The people he has annoyed, writing in.
    data.LETTERS = [
        {
            body: 'I am the printer. I am out of paper. That is all that is wrong with me.',
            signature: 'The Printer',
        },
        {
            body: 'Your item said Tuesday. It was Wednesday. Neckass told you Tuesday because he did not know what day it was.',
            signature: 'A reader who was present',
        },
        {
            body: 'Neckass reported my alarm to you. It was his alarm. He set it. It was in his room.',
            signature: 'A neighbor',
        },
        {
            body: 'You describe Neckass as "doing too much." He is doing one thing, slowly.',
            signature: 'A colleague',
        },
        {
            body: 'I was the second listener of the podcast. It was a misclick. Please stop counting me.',
            signature: 'Name withheld',
        },
        {
            body: "Monday's correction was wrong. Tuesday's correction of it was also wrong. I no longer read the news, only the corrections.",
            signature: 'A subscriber of long standing',
        },
        {
            body: 'Neckass has told everyone he is my best man. I have not asked him. I have not set a date. I am not engaged.',
            signature: 'The groom',
        },
        {
            body: "Please stop reporting on my company's refrigerator. It logs door openings. It logged 41 in one evening. That is not a story.",
            signature: "A manufacturer's representative",
        },
        {
            body: 'In forty years I never managed to define "neckass." Your paper has not either, in seven hundred issues. I find that reassuring.',
            signature: 'A retired lexicographer',
        },
        {
            body: 'The octopus documentary was on my account. He watched forty minutes of it and now corrects me about octopuses. I have a degree in this.',
            signature: 'A former friend',
        },
    ];

    // The colophon. Static, because the staff situation is stable.
    data.COLOPHON = {
        staff: 'Editor-in-chief: vacant. Wire desk: unattended. Corrections: ongoing.',
        note: 'The Gazette does not know what a neckass is and reports on one every day.',
    };
})();
