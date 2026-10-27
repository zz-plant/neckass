// Landmark issues, keyed by number. Everything else in the paper is dealt
// from the pools; these few are written. The first edition, the
// hundredth, the two anniversaries, and No. 288, which the entry cites.
//
// A landmark carries its own lead, so the correction chain still works:
// the issue after a landmark retracts a detail of the landmark's lead the
// same way it retracts any other. Any other field given here replaces
// the dealt one outright; a field left out is dealt as usual. `tag` is
// what the archive prints beside the date.
//
// The edge imports this file directly, so the feed and the card name the
// same lead the page runs.
export const EDITIONS = {
    1: {
        tag: 'First edition',
        lead: {
            headline:
                'Neckass said he would "get into running." It is the fourth September he has said it.',
            deck: 'He has bought shoes each time. There are four pairs by the door, which is where the running was meant to start.',
            byline: 'Staff report',
            pose: 'explaining',
            correction:
                'Our first edition said there are four pairs of shoes by the door. There are three pairs and one box. He returned the fourth pair and kept the box.',
            followUp:
                'Neckass went for a run. He ran to the end of the street and walked back, and has described the walk back as "the cool-down."',
            classified:
                'FOR SALE: running shoes, three pairs, all one size. Boxes included, one empty.',
            letter: {
                body: 'I am at 14. He has told me about the running each September and I have said "good for you" each September. I would like a different September.',
                signature: 'Next door',
            },
        },
        editorial: {
            head: 'Why a paper',
            body: [
                'On Tuesday a man told three people he was five minutes away. He was in his kitchen. On Wednesday he told a fourth. On Thursday he came to this office to ask whether we had "anything on him," and stayed forty minutes supplying it.',
                'That is why. He did the thing in front of people and then came in to explain it. This paper will print what he did. He has said he will read it.',
            ],
            signature: 'The editor',
        },
        corrections: [
            'This is the first edition. Neckass has already come in to dispute it. It had not been printed.',
        ],
        letters: [
            {
                body: 'I understand you are starting a paper about my neighbor. I have some material. When would be convenient.',
                signature: 'A neighbor',
            },
        ],
    },

    100: {
        tag: 'Hundredth issue',
        lead: {
            headline:
                'Neckass told the Gazette that being in it every day is "a lot." He has read four of them.',
            deck: 'He came to the office Friday to ask that the paper stop. He stayed forty minutes. He has appeared in one hundred issues and read four, one of them twice.',
            byline: 'Staff report',
            pose: 'defense',
            correction:
                'We reported that Neckass has read four issues. He has read three. The fourth was the same issue, which he had put down and picked up.',
            followUp:
                'Neckass came back for the scarf and asked again, for thirty-five minutes, that the paper stop, which is an improvement.',
            classified:
                'FOUND: a scarf, left at the Gazette office by a man asking that the paper stop. He has since called to ask whether we have it, and whether we have stopped.',
            letter: {
                body: 'He left the scarf here first. He came back for it, described it to me, took a different one, and left. The one he described is still on the hook.',
                signature: 'The café',
            },
        },
        editorial: {
            head: 'One hundred',
            body: [
                'He came in Friday to ask that the paper stop, with a list of the items he disputed. The list is two pages, in his hand, and dated wrong. He read it to us in full.',
                'He then asked whether we wanted to keep it, left it, came back for it, and left it again. It is on the desk. Item nine is about Friday.',
            ],
            signature: 'The editor',
        },
    },

    288: {
        tag: 'The hat',
        lead: {
            headline:
                'Neckass bought a hat and was reported to the Gazette as a second neckass',
            deck: 'A neighbor called the desk Saturday to say there was a man in a hat on her street "doing all the same things." It was the same man. The hat is new.',
            byline: 'From wire reports',
            pose: 'satisfied',
            correction:
                "We reported that the hat is new. It is his father's. He has had it since March and worn it since Saturday.",
            followUp:
                'Neckass wore the hat a second day. No further reports of a second man have been received. The neighbor has asked us to say she "still sees it."',
            classified:
                'LOST: a hat. Not lost. Left somewhere. It will turn up in the car, with the umbrella and the package.',
            letter: {
                body: 'I reported the second man. I would like to withdraw the report and keep the observation.',
                signature: 'Next door',
            },
        },
        // The entry cites this issue for its corrections: the one day the
        // paper applied the word to someone else, and took it back.
        corrections: [
            'We reported a second neckass, in a hat. There is one. He had walked past his own house twice, in the hat, to "see how it looked from the road."',
            'Neckass was shown the report of a second man and said he had "seen him too." He was wearing the hat at the time.',
            'We said the hat has been worn since Saturday. It was worn Friday, at dinner, indoors, until he was asked.',
        ],
    },

    366: {
        tag: 'First anniversary',
        lead: {
            headline:
                'Neckass has been in the paper every day for a year and has not noticed',
            deck: 'Asked about it, he said he had "been meaning to read it." The paper is delivered to his door. He steps over it.',
            byline: 'From wire reports',
            pose: 'shrug',
            correction:
                'We reported that Neckass steps over the paper. He steps on it.',
            followUp:
                'Neckass picked up one of the 365 papers. It was a Tuesday from March. He has read the weather.',
            classified:
                'FOR SALE: 365 newspapers, unread, stacked inside a door. Pickup only. Buyer will have to knock; the door does not open all the way.',
            letter: {
                body: 'A year. I wanted to say something about the year. He borrowed my ladder in October.',
                signature: 'A neighbor',
            },
        },
        editorial: {
            head: 'One year',
            body: [
                'A paper has been on his step every morning for a year. He has stepped on 365 of them. One morning in March he picked it up, read the weather, said "huh," and put it back down, in the place where he steps.',
                'He came in Thursday to ask whether there was "an anniversary thing." He suggested a cake, and a photograph, and that the photograph be of him. He said he was five minutes away and would come back for it. It is Friday.',
            ],
            signature: 'The editor',
        },
    },

    731: {
        tag: 'Second anniversary',
        lead: {
            headline:
                'Neckass asked whether the Gazette was "still going." This is the 731st issue.',
            deck: 'He asked at the café, where the paper is on every table. He was holding one. He asked over the top of it.',
            byline: 'From wire reports',
            pose: 'considering',
            correction:
                'We reported that Neckass was holding a copy of the paper. He was holding it, and reading his phone.',
            followUp:
                'Neckass has been told the Gazette is still going. He said "good for them" and asked who was in it.',
            classified:
                'FOUND: a coat, at the café, left by the man who asked whether the paper was still going. It is the coat he said he did not need.',
            letter: {
                body: 'Two years. In that time he has returned one thing to me: the ladder, to the wrong yard.',
                signature: 'A former neighbor',
            },
        },
        editorial: {
            head: 'Two years',
            body: [
                'He asked at the café on Monday whether the paper was still going. He asked it holding the paper. He then read the weather aloud to the table, disagreed with it, and went out without the coat.',
                'He came in Tuesday to say he had heard it was two years, and to ask whether there would be a photograph. He had brought the hat. He was asked to come back at three. He is five minutes away.',
            ],
            signature: 'The editor',
        },
    },
};
