(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    Neckass.data = Neckass.data || {};
    const data = Neckass.data;

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
    // The Workers runtime reads a copy of the leads from
    // functions/lib/leads.mjs; `bun run feed:build` extracts these too.
    data.EDITIONS = {
        1: {
            tag: 'First edition',
            lead: {
                headline:
                    'Neckass has said he will "get into running." It is the fourth September he has said it.',
                deck: 'He has bought shoes each time. There are four pairs by the door, which is where the running was meant to start.',
                byline: 'By Dana Whitcomb',
                correction:
                    'Our first edition said there are four pairs of shoes by the door. There are three pairs and one box. He returned the fourth pair and kept the box.',
                followUp:
                    'Neckass has run. He ran to the end of Orchard Lane and walked back, and has described the walk back as "the cool-down."',
                classified:
                    'FOR SALE: running shoes, three pairs, all one size. Boxes included, one empty.',
                letter: {
                    body: 'I am at 14. He has told me about the running each September and I have said "good for you" each September. I would like a different September.',
                    signature: 'Rosa Okafor, 14 Orchard Lane',
                },
            },
            editorial: {
                head: 'Why a paper',
                body: [
                    'Corbin Falls has a council, a bridge with one lane, a café with four staff, and a man on Orchard Lane who has been five minutes away since 2019. The first three are covered by the notices column. The fourth was not covered by anyone, and it was felt that he should be.',
                    'This paper will report what he did. It will not say why, because nobody knows, least of all him. It will run corrections, because he will dispute the details and the details will turn out to be wrong in a way that does not help him.',
                    'We expect to be finished in about a month.',
                ],
                signature: 'Ruth Adeyemi, editor',
            },
            corrections: [
                'This is the first edition. There is nothing to correct yet. The Gazette expects this to change.',
            ],
            letters: [
                {
                    body: 'I understand you are starting a paper about my neighbour. I have some material. When would be convenient.',
                    signature: 'Owen Pratt, Orchard Lane',
                },
            ],
        },

        100: {
            tag: 'Hundredth issue',
            lead: {
                headline:
                    'Neckass has told the Gazette that being in it every day is "a lot." He has read four of them.',
                deck: 'He came to the office Friday to ask that the paper stop. He stayed forty minutes. He has appeared in one hundred issues and read four, one of them twice.',
                byline: 'By Marcus Oyelaran',
                correction:
                    'We reported that Neckass has read four issues. He has read three. The fourth was the same issue, which he had put down and picked up.',
                followUp:
                    'Neckass has collected the scarf. He asked again that the paper stop. He was in the office thirty-five minutes, which is an improvement.',
                classified:
                    'NOTICE: the gentleman who came to the office to ask that we stop has left his scarf. He may collect it. We will not stop.',
                letter: {
                    body: 'One hundred issues. I have kept every one. I am not sure why. I have kept the scarf too; he left it here first.',
                    signature: 'M. Sato, the Station Café',
                },
            },
            editorial: {
                head: 'One hundred',
                body: [
                    'The founding editorial of this paper said it expected to be finished in about a month. That was a hundred issues ago. He has not run out.',
                    'The Gazette has learned two things in that time. The first is that he does something every day. The second is that he will come to the office to say he did not, and describe it in detail on the way out.',
                ],
                signature: 'Ruth Adeyemi, editor',
            },
        },

        288: {
            tag: 'The hat',
            lead: {
                headline:
                    'Neckass has bought a hat and been reported to the Gazette as a second neckass',
                deck: 'A neighbor rang the desk Saturday to say there was a man in a hat on Orchard Lane "doing all the same things." It was the same man. The hat is new.',
                byline: 'By Helen Vasko',
                correction:
                    "We reported that the hat is new. It is his father's. He has had it since March and worn it since Saturday.",
                followUp:
                    'Neckass has worn the hat a second day. No further reports of a second man have been received. The neighbor has asked us to say she "still sees it."',
                classified:
                    'LOST: a hat. Not lost. Left somewhere. It will turn up in the car, with the umbrella and the parcel.',
                letter: {
                    body: 'I reported the second man. I would like to withdraw the report and keep the observation.',
                    signature: 'Rosa Okafor, 14 Orchard Lane',
                },
            },
            // The entry cites this issue for its corrections: the one day the
            // paper applied the word to someone else, and took it back.
            corrections: [
                "A caption in Friday's edition misidentified the bandstand. It is the bandstand in Depot Park, not the one at the school.",
                "In Saturday's edition the Gazette described a second person as a neckass. The Gazette does not do this. The second person was Neckass, in a hat.",
                'A reader has asked what the Gazette means by the word. The Gazette means him.',
                'The Gazette said Neckass had "reached out." He had thought about it.',
            ],
        },

        366: {
            tag: 'First anniversary',
            lead: {
                headline:
                    'Neckass has been in the paper every day for a year and has not noticed',
                deck: 'Asked about it, he said he had "been meaning to read it." The paper is delivered to his door. He steps over it.',
                byline: 'From wire reports',
                correction:
                    'We reported that Neckass steps over the paper. He steps on it.',
                followUp:
                    'Neckass has picked up one of the 365 papers. It was a Tuesday from March. He has read the weather.',
                classified:
                    'FOR SALE: 365 newspapers, unread, stacked inside a door. Buyer collects. Buyer will have to knock; the door does not open all the way.',
                letter: {
                    body: 'A year. I wanted to say something about the year. He borrowed my ladder in October.',
                    signature: 'Owen Pratt, Orchard Lane',
                },
            },
            editorial: {
                head: 'One year',
                body: [
                    'The Gazette said it expected to be finished in a month. It said so in its first editorial, and it has been asked about it since, mostly by him.',
                    'A year in, the position is unchanged. He did the thing; we wrote it down. Nobody has been able to say what the thing has in common with the other things, and the paper has stopped trying. Volume II begins tomorrow with the same man.',
                ],
                signature: 'Ruth Adeyemi, editor',
            },
        },

        731: {
            tag: 'Second anniversary',
            lead: {
                headline:
                    'Neckass has asked whether the Gazette is "still going." This is the 731st issue.',
                deck: 'He asked at the Station Café, where the paper is on every table. He was holding one. He asked over the top of it.',
                byline: 'By Priya Natarajan',
                correction:
                    'We reported that Neckass was holding a copy of the paper. He was holding it, and reading his phone.',
                followUp:
                    'Neckass has been told the Gazette is still going. He said "good for them" and asked who was in it.',
                classified:
                    "WANTED: a subject for a newspaper. Two years' experience with the current one. Applicants must do less.",
                letter: {
                    body: 'Two years. In that time he has returned one thing to me: the ladder, in the wrong garden.',
                    signature: 'Owen Pratt, formerly of Orchard Lane',
                },
            },
            editorial: {
                head: 'Two years',
                body: [
                    'The founding editorial said a month. The first anniversary editorial declined to make a second prediction. This one declines again.',
                    'He is well. He was five minutes away from being interviewed for this and is at home. Volume III begins with him, as the other two did.',
                ],
                signature: 'Ruth Adeyemi, editor',
            },
        },
    };
})();
