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
    //
    // Pool sizes are load-bearing. modules/issue.js deals a fixed number of
    // each per issue, so a pool must be several times its deal size or a
    // reader coming back two days running sees the same paper.

    // A lead carries everything the paper prints about that incident: the
    // deck, the correction it runs the next day (it always retracts a trivial
    // detail and leaves the damning part standing), and the classified and
    // the letter from the person he did it to. issue.js runs all of them in
    // the same issue, so the page compounds: the lead, then the ad, then the
    // letter. The general pools below hold everything not tied to a lead.
    data.LEADS = [
        {
            headline:
                'Neckass has been "five minutes away" since 2019. He is at home.',
            deck: 'He has said "five minutes" to eleven people this year. He has not left the house for any of them.',
            byline: 'From wire reports',
            correction:
                'An earlier edition said Neckass had been "five minutes away" since 2019. At the time of that report he was in the shower.',
            classified:
                'PERSONAL: to the man who was five minutes away — we have gone home.',
            letter: {
                body: 'He has been five minutes away from my house for four years. I have moved.',
                signature: 'A friend, formerly',
            },
        },
        {
            headline:
                'A review of Neckass\'s ten-year plan found it consists of the words "ten-year plan"',
            deck: 'The plan is one page. The page says "ten-year plan." There is nothing else on it.',
            byline: 'Staff report',
            correction:
                "We reported that Neckass's ten-year plan is one page. It is one page printed on both sides. The second side is blank.",
            classified:
                'FOUND: a ten-year plan. One page, three words. Owner may collect.',
            letter: {
                body: 'He showed me the plan. It says "ten-year plan." I asked what it was. He said "the plan."',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass has agreed to be best man in an email he has not read',
            deck: 'The wedding is Saturday. He has told the groom he is free a different Saturday.',
            byline: 'By Dana Whitcomb',
            correction:
                'An earlier edition said Neckass had not read the email. He has now read it. He has not replied.',
            classified:
                'WANTED: a best man for Saturday. The current one believes it is a different Saturday.',
            letter: {
                body: 'Neckass has told everyone he is my best man. I have not asked him. I have not set a date. I am not engaged.',
                signature: 'The groom',
            },
        },
        {
            headline:
                'Neckass has opened the fridge eleven times since dinner and taken nothing',
            deck: 'He is not hungry. He is checking whether anything has changed. It has not.',
            byline: 'Staff report',
            correction:
                'We reported eleven openings. He has since gone back for a twelfth and eaten a slice of cheese standing up.',
            classified:
                'FOR SALE: fridge, full. Owner opens it eleven times a night and reports it empty.',
            letter: {
                body: 'He has stood in my kitchen with the fridge open for six minutes, three times this week, and said "there\'s nothing in here" each time. It is my fridge. It is full.',
                signature: 'A flatmate',
            },
        },
        {
            headline:
                'Neckass has set three alarms, five minutes apart, and slept through all of them',
            deck: 'They are labelled "up," "UP," and "seriously." He turned off the third without opening his eyes.',
            byline: 'Staff report',
            correction:
                'We said three alarms. There is a fourth, at 6:30, labelled "ok fine." He got up at 8:10.',
            classified:
                'WANTED: neighbor whose alarm does not go off at 5 and get ignored until 6.',
            letter: {
                body: 'His alarms go at 5:30, 5:35, 5:40 and 6:30. Mine goes at seven. I have been up at 5:30 for a year.',
                signature: 'A neighbor',
            },
        },
        {
            headline:
                'Neckass muted the group chat and has checked it at ninety-second intervals since',
            deck: 'Muting stopped the notifications. It did not stop him. He has opened the chat 400 times today.',
            byline: 'By Marcus Oyelaran',
            correction:
                'We reported that Neckass opened the chat 400 times. That was by noon.',
            classified:
                'WANTED: a group chat that produces a plan. Ours has produced 11,000 images.',
            letter: {
                body: 'I am in the group chat. He muted it in front of me and then asked what he had missed. Nothing. He was there.',
                signature: 'A member of the chat',
            },
        },
        {
            headline:
                'Neckass has declared inbox zero. He has a second inbox with 2,000 in it.',
            deck: 'He moved the emails to a folder called "Later." Later has 2,000 emails.',
            byline: 'From wire reports',
            correction:
                'An earlier edition said the folder is called "Later." It is called "Later!!"',
            classified:
                'FOR SALE: folder labelled "Later!!" Contents: 2,000 emails. Buyer must take all.',
            letter: {
                body: 'I sent him an email in March. It is in a folder called "Later!!" He told me this as though it were good news.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass told his doctor he "basically never drinks" using a sommelier\'s vocabulary',
            deck: 'He said "basically never," then described a "grippy, mineral" red he had "on a Tuesday, as one does."',
            byline: 'By Priya Natarajan',
            correction:
                'We quoted Neckass describing a red as "grippy, mineral." He said "grippy, minerally."',
            classified: 'FREE: advice about wine. One fact, repeated.',
            letter: {
                body: 'He told me he basically never drinks and then described a red I had not heard of, with a vintage. I am his doctor. I wrote down "drinks."',
                signature: 'A physician',
            },
        },
        {
            headline:
                'Neckass has paid for a gym membership since 2013 and has been to the gym twice',
            deck: 'That is $4,100 for two visits. One of them was to ask about cancelling.',
            byline: 'Staff report',
            correction:
                'We reported two visits to the gym. One was to cancel. He left with a second membership.',
            classified:
                'FOR SALE: gym bag, unused. Matching membership available.',
            letter: {
                body: 'He came in to cancel. He left with a second membership and a towel. I have done this job for nine years.',
                signature: 'A gym receptionist',
            },
        },
        {
            headline:
                "Neckass's out-of-office reply has been active for eleven weeks. Neckass is at his desk.",
            deck: 'He set it for a long weekend in June. Everyone has stopped emailing him. He has noticed and is pleased.',
            byline: 'From wire reports',
            correction:
                'We said the reply had run eleven weeks. It has since been changed to say he is "back in the office," and it is still on.',
            classified:
                'NOTICE: Neckass is out of the office until June 14. It is September.',
            letter: {
                body: 'I stopped emailing him in June because he was away. He has been at the next desk the whole time. He waved.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass read the terms and conditions in full, understood none of them, and agreed',
            deck: 'It took forty minutes. Asked what he had agreed to, he said "the usual."',
            byline: 'By Priya Natarajan',
            correction:
                'We reported that Neckass read the terms in full. He scrolled to the bottom in full. He read the first line.',
            classified:
                'SEEKING: anyone who knows what I agreed to. I read all of it. — N.',
            letter: {
                body: 'He asked me what he had agreed to. I said I had not read it either. He said "but you\'re a lawyer." I am a dentist.',
                signature: 'A friend',
            },
        },
        {
            headline:
                'Asked what a neckass is, Neckass said "you know, a neckass"',
            deck: 'Asked again, he said it more slowly.',
            byline: 'By Ruth Adeyemi',
            correction:
                'We reported that Neckass said it more slowly the second time. He said it louder.',
            classified:
                'WANTED: a definition of "neckass." Will accept "you know."',
            letter: {
                body: 'In forty years I never managed to define "neckass." Your paper has not either, in seven hundred issues. I find that reassuring.',
                signature: 'A retired lexicographer',
            },
        },
        {
            headline:
                'Neckass has told the same story at the same table for the third year running',
            deck: 'It is the story about the airport. Everyone at the table has heard it at this table, from him, twice before.',
            byline: 'By Dana Whitcomb',
            correction:
                'We said the story concerns an airport. It concerns a train station. He has told it as an airport for three years.',
            classified:
                'WANTED: the second half of a story about an airport. Or a train station.',
            letter: {
                body: 'He has told the airport story at my table three years running. It is a train station. I have stopped correcting him.',
                signature: 'A host',
            },
        },
        {
            headline:
                'Neckass has been standing in the doorway saying goodbye for fifty minutes',
            deck: 'He said "anyway, I should go" at 9:10. He left at ten.',
            byline: 'Staff report',
            correction:
                'We timed the goodbye at fifty minutes. The hosts went to bed at forty. He continued in the hall.',
            classified:
                'NOTICE: the goodbye at number 12 is still going. Residents may wish to use the back lane.',
            letter: {
                body: 'He stood in my doorway saying goodbye for fifty-five minutes. I went to bed. He was still saying it.',
                signature: 'A host, exhausted',
            },
        },
        {
            headline:
                'Neckass reset a password to the password he had just been told was wrong',
            deck: 'He was locked out at two. He was locked out again at 2:01.',
            byline: 'By Priya Natarajan',
            correction:
                'We reported one lockout. He reset the password to the old one, was told he could not reuse it, and added a 1. He was locked out again at 2:04.',
            classified:
                'LOST: access to an account. The password was correct, then wrong, then the same one with a 1 on it.',
            letter: {
                body: 'I am the IT desk. He reset it to the old one, was told no, and added a 1. I watched him do it. I did not stop him. I wanted to see.',
                signature: 'IT, again',
            },
        },
        {
            headline:
                'Neckass has bought a second charger rather than look behind the sofa',
            deck: 'The first charger is behind the sofa. He has not looked. He now has three.',
            byline: 'Staff report',
            correction:
                'We said he has three chargers. He has five. Two are behind the sofa.',
            classified:
                'WANTED: someone to look behind the sofa. Reward: a charger.',
            letter: {
                body: 'There are five chargers in that flat. I have seen them. Two are behind the sofa, he knows this, and he has ordered a sixth.',
                signature: 'A flatmate',
            },
        },
        {
            headline:
                'Neckass arrived at the restaurant an hour early and waited outside',
            deck: 'He had the time wrong and did not check. He stood outside for an hour in the rain.',
            byline: 'By Helen Vasko',
            correction:
                'We reported that Neckass waited outside for an hour. He waited outside the wrong restaurant for an hour.',
            classified:
                'LOST: an hour, outside the wrong restaurant, in the rain.',
            letter: {
                body: 'I waited an hour outside the right restaurant while he waited an hour outside the wrong one. We did not eat.',
                signature: 'A date, formerly',
            },
        },
        {
            headline:
                'Neckass has explained the plot of a film to the person who recommended it',
            deck: 'They recommended it on Tuesday. He explained it to them on Thursday, in full, including the end.',
            byline: 'By Dana Whitcomb',
            correction:
                'We said he explained the ending. He explained the ending of a different film.',
            classified:
                'SEEKING: the person who recommended the film. He would like to explain it to you.',
            letter: {
                body: 'I recommended the film. He explained it back to me on Thursday. He got the ending wrong and I did not say.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass has answered a question that was asked of someone else',
            deck: 'The question was put to the person beside him. He answered it. He was wrong.',
            byline: 'Staff report',
            correction:
                'We reported that Neckass answered a question asked of someone else. The person it was asked of had already started answering.',
            classified:
                'PERSONAL: to whoever answered the question I asked someone else — it was not for you.',
            letter: {
                body: 'I asked the question. It was addressed to two other people. He answered it, and he was wrong.',
                signature: 'A member of the audience',
            },
        },
        {
            headline:
                'Neckass has been carrying a package to the post office in his car since March',
            deck: 'It is on the passenger seat. He has driven past the post office sixty times.',
            byline: 'By Tom Feld',
            correction:
                'We said the package has been in the car since March. It has been through two car washes.',
            classified:
                'FOUND: package addressed to the post office, on a passenger seat.',
            letter: {
                body: 'The package on his passenger seat is mine. It has been to the post office sixty times without going in.',
                signature: 'A sister',
            },
        },
        {
            headline:
                'Neckass told the group he was "already on the train." He was in the shower.',
            deck: 'The train left at 8:04. He was in the shower at 8:04. He arrived at 9:40.',
            byline: 'By Tom Feld',
            correction:
                'We reported that Neckass arrived at 9:40. He arrived at 9:40, said "the trains," and it was not the trains.',
            classified:
                'PERSONAL: to the man who was already on the train — we saw you at the station at 9:40.',
            letter: {
                body: 'He said he was on the train. I was on the train. He was not on the train. I have the photograph.',
                signature: 'A commuter',
            },
        },
        {
            headline:
                'Neckass asked the group to pick a restaurant and rejected all six',
            deck: 'He asked at noon. Six were proposed. At seven he suggested the first one.',
            byline: 'By Helen Vasko',
            correction:
                'We said six were proposed. The one he suggested at seven was the one he had rejected first, by name, at noon.',
            classified:
                'SEEKING: seven restaurant suggestions. Will reject all and choose the first.',
            letter: {
                body: 'I suggested the first restaurant at noon. He said no. At seven he suggested it to me as his own idea. We went. It was fine.',
                signature: 'A friend',
            },
        },
        {
            headline: "Neckass's smoke alarm has been chirping for nine days",
            deck: 'It needs a battery. He has bought batteries. They are the wrong size and are in the car with the package.',
            byline: 'Staff report',
            correction:
                'We reported the chirping at nine days. He has moved his bed to the other room and describes the problem as solved.',
            classified:
                'NOTICE: the smoke alarm at number 12 needs a battery. Nine days.',
            letter: {
                body: 'My smoke alarm is not chirping. His is. He has knocked twice to ask about mine.',
                signature: 'A neighbor, again',
            },
        },
        {
            headline: 'Neckass has read the first page of nine books this year',
            deck: 'He owns nine books bought this year. Page one of each is creased. No page two is.',
            byline: 'By Ruth Adeyemi',
            correction:
                'We said nine books. There is a tenth, about finishing things, with a bookmark on page one.',
            classified:
                'FOR SALE: nine books, page one creased. Pages two onward as new.',
            letter: {
                body: 'I gave him nine books. He has creased nine first pages. I would like the books back.',
                signature: 'An aunt',
            },
        },
        {
            headline:
                'Neckass has told everyone he is cutting back, while ordering',
            deck: 'He announced it at the table. He announced it again while the food arrived.',
            byline: 'By Priya Natarajan',
            correction:
                'We reported that Neckass announced it twice. Three times. The third was with dessert.',
            classified:
                'WANTED: someone to tell him he has said "I\'m cutting back" while ordering dessert.',
            letter: {
                body: 'He has told me he is cutting back while ordering, three times, at my counter.',
                signature: 'A server',
            },
        },
        {
            headline:
                "Neckass has been to the same coffee shop 300 times and does not know the staff's names",
            deck: 'They know his order and his name. He calls all three of them "chief."',
            byline: 'By Dana Whitcomb',
            correction:
                'We said three staff. One of them is called Chief. He does not know this, and it does not count.',
            classified:
                'NOTICE: the coffee shop wishes to inform the gentleman that we are not all called chief.',
            letter: {
                body: 'He calls me chief. I am wearing a name badge.',
                signature: 'A barista',
            },
        },
        {
            headline: 'Neckass has moved one task to tomorrow forty times',
            deck: 'The task is to call his mother. It takes ten minutes. It has been tomorrow since July.',
            byline: 'Staff report',
            correction:
                'We said forty times. Forty-one. He moved it again while reading the item.',
            classified:
                'REMINDER: call your mother. This notice was placed by her.',
            letter: {
                body: 'He has moved calling me to tomorrow since July. I read this paper to find out how he is.',
                signature: 'His mother',
            },
        },
        {
            headline:
                'Neckass has assembled the shelf and has four screws left',
            deck: 'The instructions account for every screw. The shelf is up. He is not going to think about it.',
            byline: 'Staff report',
            correction:
                'We reported four screws left over. The shelf came down on Sunday with the books on it. There were six.',
            classified:
                'LOST: four screws. The shelf is up. Do not tell the owner.',
            letter: {
                body: 'The shelf came down on Sunday. There were six screws left over, not four. I would like this printed.',
                signature: 'A flatmate',
            },
        },
        {
            headline:
                'Neckass has agreed with two people who were disagreeing with each other',
            deck: 'He agreed with the first, then the second, in the same conversation. Both noticed.',
            byline: 'By Dana Whitcomb',
            correction: 'We said both parties noticed. All four did.',
            classified:
                'SERVICES: will agree with both of you. Rates negotiable, and I will agree to yours.',
            letter: {
                body: 'He agreed with me and then with the man I was arguing with, in the same minute. We have stopped arguing and are both annoyed with him.',
                signature: 'A former colleague',
            },
        },
        {
            headline:
                'Neckass photographed the menu to decide later and ordered without looking at it',
            deck: 'The photograph was taken on Monday. He ordered on Friday, from memory, incorrectly.',
            byline: 'By Helen Vasko',
            correction:
                'We said he photographed the menu. He photographed the specials board of a different restaurant.',
            classified:
                'FOUND: photograph of a specials board. Not the restaurant the owner was in.',
            letter: {
                body: 'He photographed my specials board on Monday and ordered from it on Friday at a different restaurant. They rang me.',
                signature: 'A restaurateur',
            },
        },
        {
            headline: 'Neckass has been "just about to leave" for two hours',
            deck: 'He said it at six, at seven, and at eight. He has his coat on.',
            byline: 'From wire reports',
            correction:
                'We reported that Neckass has his coat on. He has since taken it off, sat down, and accepted a tea.',
            classified:
                'WANTED: anyone who has seen Neckass leave when he said he was leaving.',
            letter: {
                body: 'He has been just about to leave my house since six. It is ten. I offered a tea so that he would have something to finish.',
                signature: 'A host',
            },
        },
        {
            headline:
                "Neckass's phone has been at one percent since this morning",
            deck: 'He has been told. He has a charger. It is behind the sofa.',
            byline: 'By Priya Natarajan',
            correction:
                'We reported the phone at one percent. It died during the conversation about the charger.',
            classified:
                'LOST: a phone at one percent. It is somewhere in the house and it is now at zero.',
            letter: {
                body: 'His phone has been at one percent for three days. He has borrowed my charger and left it at his house.',
                signature: 'A brother',
            },
        },
        {
            headline: 'Neckass has recommended a restaurant he has not been to',
            deck: 'He recommended it warmly and at length. He has driven past it.',
            byline: 'By Helen Vasko',
            correction:
                'We said he had driven past the restaurant. He had driven past a different restaurant with a similar sign.',
            classified:
                'WANTED: a review of this restaurant from someone who has been inside. — the restaurant',
            letter: {
                body: 'He has recommended my restaurant to four people. He has never been in. I would like him to come in, and also not to.',
                signature: 'A restaurateur',
            },
        },
        {
            headline:
                'Neckass has started a sentence with "no offense" nine times this week',
            deck: 'Offense was taken on eight occasions. The ninth person had already left.',
            byline: 'Staff report',
            correction:
                'We reported nine. The tenth was "no offense, but" to a waiter, followed by an order.',
            classified:
                'SEEKING: anyone who has heard Neckass finish a sentence beginning "no offense."',
            letter: {
                body: 'He has said "no offense" to me twice this week. There was offense on both occasions.',
                signature: 'Name withheld',
            },
        },
        {
            headline:
                'Neckass has been holding a door for someone forty feet away',
            deck: 'They were not walking toward the door. They are now, because he is holding it.',
            byline: 'By Dana Whitcomb',
            correction:
                'We put the distance at forty feet. It was far enough that they had to jog, and they did, and thanked him.',
            classified:
                'SERVICES: will hold a door for you from a great distance. Please run.',
            letter: {
                body: 'He held the door for me from sixty feet. I was not going to the door. I went to the door.',
                signature: 'A pedestrian',
            },
        },
        {
            headline:
                'Neckass has cleaned around the object rather than move it',
            deck: 'The object is a shoe. It has been in the middle of the floor for five weeks. The floor around it is clean.',
            byline: 'Staff report',
            correction:
                'We described the object as a shoe. It is two shoes, and they do not match.',
            classified:
                'FOUND: one shoe, middle of a floor. Owner has cleaned around it for five weeks.',
            letter: {
                body: 'I live with him. The shoes have been there five weeks. I moved one, to see. He moved it back.',
                signature: 'A flatmate',
            },
        },
        {
            headline:
                'Neckass told the barber "just a little off" and has been given a haircut',
            deck: 'He said "that\'s great" in the chair. He has not looked in a mirror since.',
            byline: 'Staff report',
            correction:
                'We said Neckass has not looked in a mirror. He has, in a shop window, and walked into someone.',
            classified:
                'WANTED: a barber prepared to ignore "just a little off."',
            letter: {
                body: 'I am the barber. He said "just a little off." I took a little off. He has not looked in the mirror in my presence since.',
                signature: 'A barber',
            },
        },
        {
            headline:
                'Neckass volunteered to help and has been standing nearby for an hour',
            deck: 'He offered at two. He has held one thing, briefly, and put it down.',
            byline: 'By Dana Whitcomb',
            correction:
                'We reported that Neckass held one thing. He held it for a moment and handed it back.',
            classified:
                'VOLUNTEER needed. Must be prepared to hold things for longer than a moment.',
            letter: {
                body: 'He offered to help me move. He held a lamp for a moment, put it down, and asked where he could be most useful. I said outside.',
                signature: 'A friend who has moved',
            },
        },
        {
            headline:
                'Neckass replied "haha" to a message asking him to call urgently',
            deck: 'He was not reading it. He called four hours later, after a second message.',
            byline: 'Staff report',
            correction:
                'We reported a four-hour delay. He replied "haha" a second time before he called.',
            classified:
                'WANTED: anyone who can tell "haha" from "I will call you."',
            letter: {
                body: 'I texted him to call me urgently. He replied "haha." I texted again. "haha." He rang four hours later to ask what was funny.',
                signature: 'A sister',
            },
        },
        {
            headline:
                'Neckass has been quietly following the wrong group around a museum',
            deck: 'He joined at the entrance. It was a school group. He listened for forty minutes.',
            byline: 'By Dana Whitcomb',
            correction:
                'We said forty minutes. He also asked a question, about the Romans, on a tour about the Victorians.',
            classified:
                'NOTICE: the museum would like to know who the adult at the back of the school tour was.',
            letter: {
                body: 'I was on the school tour. The man at the back asked a question about the Romans. He was not with us.',
                signature: 'A teacher',
            },
        },
    ];

    // Standalone corrections, drawn alongside the routine one and the one
    // chained to yesterday's lead.
    data.CORRECTIONS = [
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
        'We reported that Neckass helped. He was present.',
        'A Tuesday item said Neckass had left. He had gone to the car and come back.',
        'The Gazette described Neckass as "on his way." He was choosing a shirt.',
        'We said Neckass had made a decision. He had narrowed it to two and stopped.',
        'An earlier edition credited Neckass with the idea. He agreed with it loudly and early.',
        'We reported that Neckass cooked. He assembled.',
        'The Gazette said Neckass replied. He reacted with a thumbs up.',
        'An item said Neckass listened. He waited.',
        'We reported that Neckass had cancelled. He did not attend and did not say so.',
        'The Gazette said Neckass paid. He said "I\'ll get the next one." There has been no next one.',
        'We said Neckass was early. He was on time. For him that is early, but the item should have said on time.',
        'An earlier edition reported that Neckass apologized to the printer. He apologized near it.',
        'We said Neckass had a plan. He had a preference.',
        'The Gazette reported that Neckass remembered. He was reminded twice that morning.',
        'We described Neckass as considering it. He had forgotten.',
        'An item stated that Neckass returned the parcel. He intended to. It is in the car.',
        'We reported that Neckass slept eight hours. He was in bed for eight hours.',
        'The Gazette said Neckass walked. He drove to the walk.',
        'We said Neckass finished the puzzle. One piece is missing and he has stopped mentioning it.',
        'An earlier edition described Neckass as happy to help. He said it. He did not help.',
        'We reported that Neckass understood. He nodded.',
        'The Gazette said Neckass had tidied. He had moved things to a different room.',
        'We said Neckass declined. He did not reply, which he considers declining.',
        'An item reported Neckass as looking into it. He has opened one tab.',
        "We reported that Neckass had learned his lesson. He has not. Yesterday's edition should not have said so.",
        'We reported that Neckass was on hold for an hour. The call was answered after four minutes. He was talking.',
        'The Gazette said Neckass had "reached out." He had thought about it.',
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
        'Bright. Neckass has put his sunglasses on his head and will spend twenty minutes looking for them.',
        'Drizzle. Neckass says it is "not really rain" and will be wet by noon.',
        'Hot. Neckass has opened the window and the door and created a situation with the papers.',
        'Cool. Neckass has turned the heating on and opened a window.',
        'Storms expected. Neckass has parked under the tree.',
        'Snow. Neckass has driven anyway and will call from a hill.',
        'Humid. Neckass has said "it\'s not the heat, it\'s the humidity" to four people who were not asking.',
        'Dry. Neckass has watered the plant twice, having forgotten the first time.',
        'Grey. Neckass has said "well, that\'s the summer over" in each of the last four months.',
        'Pleasant. Neckass has stayed inside and will mention tomorrow that he missed it.',
        'Frost. Neckass will use a credit card on the windscreen and break the credit card.',
        'Sun, briefly. Neckass has committed to a barbecue on the strength of it.',
        'Rain easing. Neckass has cancelled and it has stopped.',
        'Wind. Neckass has left the bin out and will collect it from the neighbor.',
        'Warm evening. Neckass proposed sitting outside and went in after four minutes.',
        'Cold snap. Neckass has said "at least it\'s dry." It is not.',
        'Overcast, clearing. Neckass has checked the forecast four times and told everyone something different.',
        'Mild. Neckass is wearing the coat because it was cold last week.',
        'Heavy rain. Neckass has an umbrella. It is in the car with the package.',
        'Fine. Neckass has brought a coat "just in case" and left it in the café.',
        'Sleet. Neckass has gone out in the wrong shoes and will not mention it.',
        'Still. Neckass has said it is too quiet and put the television on.',
        'Bright and cold. Neckass has dressed for bright.',
        'Showers. Neckass ran to the car and left the window down.',
        'Sunny intervals. Neckass has planned the whole day around the intervals.',
        'Muggy. Neckass has bought a fan and will not open the box until August.',
        'Clear night. Neckass has been told to look up and has looked at his phone.',
        'Ice. Neckass was told to take it slowly and has fallen in the driveway.',
        'Breezy. Neckass has lost a receipt he is going to need.',
        'Unremarkable. Neckass has said "at least it\'s not raining" four times, to the same person.',
    ];

    // The town's ads that are not about a lead. He is in most of them anyway.
    data.CLASSIFIEDS = [
        'FOUND: set of keys, outside the gym. Owner has never been inside.',
        'FOR SALE: bicycle, never ridden. Has lived in a hallway since 2022.',
        'LOST: forty minutes, to a documentary about octopuses.',
        'FREE TO GOOD HOME: houseplant. Owner has named it and now cannot let it die, so someone else must.',
        'NOTICE FROM IT: the printer is out of paper. It has been out of paper every time. Please check before calling.',
        'SERVICES: will agree with whatever you have already decided. Neckass is a regular.',
        'WANTED: someone who can end a conversation with Neckass. Nobody has yet.',
        'FOR SALE: exercise bike. Currently a coat rack. Coats included.',
        'LOST: one hour, every morning, between the alarm and getting up.',
        'NOTICE: this column no longer accepts ads from Neckass. He placed nine last week, all "WANTED: motivation."',
        'WANTED: someone to smell some leftovers. They are nine days old. Urgent.',
        'FOR SALE: standing desk, barely used, as the owner sat at it.',
        'FREE: batteries, wrong size. Have been in a car since March.',
        'FOR SALE: umbrella, unused, currently in a car.',
        'LOST: Wednesday. Owner spent it believing it was Tuesday.',
        'FOR SALE: fan, boxed, bought in a heatwave and opened in October.',
        'LOST: the second earbud. Owner has checked the case four times.',
        'FREE TO GOOD HOME: opinions about octopuses. One documentary, forty minutes.',
        'SEEKING: a second listener for a podcast. The first has gone.',
        'FOR SALE: shelf. Some screws remain. Sold as seen, and it is not up any more.',
        'WANTED: the name of the film he explained. It was not the one recommended.',
        'NOTICE: the bin from number 12 is in our garden again.',
        'FREE: half a bag of salad, best before yesterday, described by owner as "probably fine."',
        'LOST: the thread of a conversation, forty minutes in.',
        'FOUND: sunglasses, on a head. Owner has been looking for twenty minutes.',
        'WANTED: someone to tell him the haircut is fine. He has looked twice and said nothing.',
        'FOR SALE: two shoes. They do not match. They have been on a floor for five weeks.',
        'SEEKING: witnesses to a man holding a door for a full minute.',
        'FOR SALE: the rest of a meal. He said he would just have a bite.',
        'NOTICE: the tour at two is for the school. It is not for the gentleman at the back.',
        'LOST: the receipt you are going to need. It went past the window.',
        'FOUND: a shirt, being chosen, for one hour. Owner said he was on his way.',
        'WANTED: anyone who has seen him use the gym bag. Reward: the gym bag.',
    ];

    // Letters not tied to a lead.
    data.LETTERS = [
        {
            body: 'I am in IT. The printer is out of paper. That is all that is wrong with it. That is all that has ever been wrong with it.',
            signature: 'IT',
        },
        {
            body: 'Your item said Tuesday. It was Wednesday. Neckass told you Tuesday because he did not know what day it was.',
            signature: 'A reader who was present',
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
            body: 'The octopus documentary was on my account. He watched forty minutes of it and now corrects me about octopuses. I have a degree in this.',
            signature: 'A former friend',
        },
        {
            body: 'I run the coffee shop. There are four of us. None of us is called chief.',
            signature: 'A proprietor',
        },
        {
            body: 'Your correspondent who "was present" is my husband, and he was not present.',
            signature: 'A reader',
        },
        {
            body: 'The bin is in my garden again. It is the third time. He says it is the wind.',
            signature: 'A neighbor',
        },
        {
            body: 'Your paper reported that he had learned his lesson. Who told you that.',
            signature: 'Everyone who knows him',
        },
        {
            body: "I sold him a fan in July. He brought it back in October, still boxed, to return it. It was July's fan.",
            signature: 'A shopkeeper',
        },
        {
            body: 'I have read this paper for seven hundred issues hoping for one item in which he does the thing he said he would. I will keep reading.',
            signature: 'A subscriber',
        },
    ];

    // The colophon. Static, because the staff situation is stable.
    data.COLOPHON = {
        staff: 'Editor: Ruth Adeyemi. Managing editor: Tom Feld. Staff writers: Dana Whitcomb, Priya Natarajan, Marcus Oyelaran, Helen Vasko.',
        note: 'The Gazette is published daily in Corbin Falls. Letters may be edited for length and clarity. Corrections appear on this page.',
    };

    // The furniture of a real paper, and none of it is about him. A reader
    // has to get past the council meeting and the leaf collection before the
    // page gives itself away. Dealt three per issue.
    data.NOTICES = [
        'Town council meets Tuesday at 7 p.m. in the council chamber. The agenda is posted at the town office.',
        'Leaf collection begins the first week of October. Bags only; no loose piles.',
        'The Eastside library branch is closed Monday for staff training.',
        'Recycling collection moves to Thursday this week because of the holiday.',
        'The Mill Street bridge is reduced to one lane through the end of the month.',
        'Flu clinics run Saturdays in September at the community center, 9 a.m. to noon. No appointment needed.',
        'Water service on Orchard Lane will be interrupted Wednesday from 9 a.m. to approximately 2 p.m.',
        'The farmers market continues Saturdays through October 25, 8 a.m. to 1 p.m., in the station lot.',
        'The planning board hearing on the Orchard Lane application is Thursday at 6:30 p.m.',
        'Yard waste drop-off at the depot is free for residents on the second Saturday of the month.',
        "The high school's fall concert is Friday at 7 p.m. in the auditorium. Admission by donation.",
        'Overnight parking restrictions resume November 1.',
        'The community center pool closes for annual maintenance from the 14th to the 21st.',
        "Absentee ballot applications for the November election are available at the town clerk's office.",
        "The historical society's walking tour departs from the bandstand Sunday at 2 p.m., weather permitting.",
        'Route 9 resurfacing continues. Expect delays between the river and the interchange during daytime hours.',
        'The animal shelter is waiving adoption fees for adult cats through the end of the month.',
        'Bulk item pickup requires a sticker, available at the town office for $10.',
        "The senior center's Tuesday lunch is now $6. Reservations by Monday noon.",
        'Storm drain cleaning is under way on the north side. Please keep vehicles clear of marked drains.',
        "The library's used book sale runs Friday and Saturday in the lower level.",
        'Volunteers are needed for the river cleanup on the 20th. Gloves and bags provided.',
        'The tax office reminds residents that the second installment is due October 1.',
        'Little League registration for the spring season opens online Monday.',
    ];

    // One of these runs first in every corrections box. It is the dull one,
    // and the dull one is what makes the box look real. Nothing in here
    // mentions him.
    data.ROUTINE_CORRECTIONS = [
        "Because of an editing error, an article in Thursday's edition misstated the name of the library branch. It is the Eastside branch, not the East End branch.",
        "A caption in Monday's edition misidentified the street shown. It is Mill Street, not Mill Road.",
        'An article on the school board meeting gave an incorrect vote count. The measure passed 5-2, not 4-3.',
        'A listing in the community calendar gave the wrong start time for the farmers market. It opens at 8 a.m.',
        "An obituary in Tuesday's edition misspelled the surname of a survivor. She is Margaret Kowalczyk.",
        "Because of a production error, a photograph in Wednesday's edition ran without a credit. The photograph was by Helen Vasko.",
        'An article about the water main repair misstated the number of households affected. It was 140, not 1,400.',
        "A headline in Friday's edition referred to the county fair. It is the regional fair.",
        "The recipe in Sunday's edition omitted the oven temperature. It is 350 degrees.",
        "An article on the zoning appeal misstated the applicant's address. It is 41 Orchard Lane, not 14.",
        "A story in Monday's edition gave an outdated telephone number for the recycling depot. The correct number is on the town website.",
        'Because of a reporting error, an article on the road closure said it would last two weeks. The contractor says three.',
        "A chart accompanying Tuesday's article on property assessments was mislabeled. The vertical axis shows dollars, not thousands of dollars.",
        "A review in Saturday's edition gave the wrong closing time for the café. It closes at 3 p.m. on Sundays.",
    ];
})();
