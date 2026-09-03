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
    // reader coming back two days running sees the same paper. Current ratios
    // give the lead 40 days, classifieds 12, letters 18, corrections 20.

    // A lead carries a deck (the detail the headline had no room for) and the
    // correction the Gazette runs about it the following day. The correction
    // always retracts a trivial detail and leaves the damning part standing.
    data.LEADS = [
        {
            headline:
                'Neckass has been "five minutes away" since 2019. He is at home.',
            deck: 'He has said "five minutes" to eleven people this year. He has not left the house for any of them.',
            byline: 'By the wire desk',
            correction:
                'An earlier edition said Neckass had been "five minutes away" since 2019. It is since 2018.',
        },
        {
            headline:
                'A review of Neckass\'s ten-year plan found it consists of the words "ten-year plan"',
            deck: 'The plan is one page. The page says "ten-year plan." There is nothing else on it.',
            byline: 'Staff report',
            correction:
                "We reported that Neckass's ten-year plan is one page. It is one page printed on both sides. The second side is blank.",
        },
        {
            headline:
                'Neckass has agreed to be best man in an email he has not read',
            deck: 'The wedding is Saturday. He has told the groom he is free a different Saturday.',
            byline: 'By our correspondent, who was present',
            correction:
                'An earlier edition said Neckass had not read the email. He has now read it. He has not replied.',
        },
        {
            headline:
                "Neckass's fridge has reported him for opening it 41 times and taking nothing",
            deck: 'The fridge logs door openings. He was looking, not eating. It has told the manufacturer.',
            byline: 'By the technology desk',
            correction:
                'We reported that Neckass opened the fridge 41 times. It was 43. The fridge has written in.',
        },
        {
            headline:
                "Neckass's noise complaint against his own alarm clock was upheld on appeal",
            deck: 'He set it, it rang, and he reported it. He was told he had set it. He appealed. He was told again.',
            byline: 'Staff report',
            correction:
                'We said the appeal was upheld. It was upheld against him, which is the opposite.',
        },
        {
            headline:
                'Neckass muted the group chat and has checked it at ninety-second intervals since',
            deck: 'Muting stopped the notifications. It did not stop him. He has opened the chat 400 times today.',
            byline: 'By a reporter who was in the group chat',
            correction:
                'We reported that Neckass opened the chat 400 times. That was by noon.',
        },
        {
            headline:
                'Neckass has declared inbox zero. He has a second inbox with 2,000 in it.',
            deck: 'He moved the emails to a folder called "Later." Later has 2,000 emails.',
            byline: 'By the wire desk',
            correction:
                'An earlier edition said the folder is called "Later." It is called "Later!!"',
        },
        {
            headline:
                'Neckass told his doctor he "basically never drinks" using a sommelier\'s vocabulary',
            deck: 'He said "basically never," then described a "grippy, mineral" red he had "on a Tuesday, as one does."',
            byline: 'By the health desk',
            correction:
                'We quoted Neckass describing a red as "grippy, mineral." He said "grippy, minerally."',
        },
        {
            headline:
                'Neckass has paid for a gym membership since 2013 and has been to the gym twice',
            deck: 'That is $4,100 for two visits. One of them was to ask about cancelling.',
            byline: 'Staff report',
            correction:
                'We put the figure at $4,100. It is $4,340. He has since renewed.',
        },
        {
            headline:
                "Neckass's out-of-office reply has been active for eleven weeks. Neckass is at his desk.",
            deck: 'He set it for a long weekend in June. Everyone has stopped emailing him. He has noticed and is pleased.',
            byline: 'By the wire desk',
            correction:
                'We said the reply had run eleven weeks. Twelve. It is still running.',
        },
        {
            headline:
                'Neckass read the terms and conditions in full, understood none of them, and agreed',
            deck: 'It took forty minutes. Asked what he had agreed to, he said "the usual."',
            byline: 'By the technology desk',
            correction:
                'We reported the reading took forty minutes. Thirty-five. He has agreed to the rest unread.',
        },
        {
            headline:
                'Asked what a neckass is, Neckass said "you know, a neckass"',
            deck: 'Asked again, he said it more slowly.',
            byline: 'By the language desk',
            correction:
                'We reported that Neckass said it more slowly the second time. He said it louder.',
        },
        {
            headline:
                'Neckass has told the same story at the same table for the third year running',
            deck: 'It is the story about the airport. Everyone at the table has heard it at this table, from him, twice before.',
            byline: 'By our correspondent, who was present',
            correction:
                'We said the story concerns an airport. It concerns a train station. He has told it as an airport for three years.',
        },
        {
            headline:
                'Neckass has been standing in the doorway saying goodbye for fifty minutes',
            deck: 'He said "anyway, I should go" at 9:10. He left at ten.',
            byline: 'Staff report',
            correction:
                'We timed the goodbye at fifty minutes. Fifty-five. The hosts had gone to bed.',
        },
        {
            headline:
                'Neckass reset a password to the password he had just been told was wrong',
            deck: 'He was locked out at two. He was locked out again at 2:01.',
            byline: 'By the technology desk',
            correction: 'We reported one lockout. There were four.',
        },
        {
            headline:
                'Neckass has bought a second charger rather than look behind the sofa',
            deck: 'The first charger is behind the sofa. He has not looked. He now has three.',
            byline: 'Staff report',
            correction:
                'We said he has three chargers. He has five. Two are behind the sofa.',
        },
        {
            headline:
                'Neckass arrived at the restaurant an hour early and waited outside',
            deck: 'He had the time wrong and did not check. He stood outside for an hour in the rain.',
            byline: 'By the food desk',
            correction:
                'We reported that Neckass waited outside for an hour. He waited outside the wrong restaurant for an hour.',
        },
        {
            headline:
                'Neckass has explained the plot of a film to the person who recommended it',
            deck: 'They recommended it on Tuesday. He explained it to them on Thursday, in full, including the end.',
            byline: 'By our correspondent, who was present',
            correction:
                'We said he explained the ending. He explained the ending of a different film.',
        },
        {
            headline:
                'Neckass has answered a question that was asked of someone else',
            deck: 'The question was put to the person beside him. He answered it. He was wrong.',
            byline: 'Staff report',
            correction:
                'We reported that Neckass answered a question asked of someone else. It was asked of two other people.',
        },
        {
            headline:
                'Neckass has been carrying a package to the post office in his car since March',
            deck: 'It is on the passenger seat. He has driven past the post office sixty times.',
            byline: 'By the transport desk',
            correction:
                'We said the package has been in the car since March. February.',
        },
        {
            headline:
                'Neckass told the group he was "already on the train." He was in the shower.',
            deck: 'The train left at 8:04. He was in the shower at 8:04. He arrived at 9:40.',
            byline: 'By the transport desk',
            correction:
                'We reported that Neckass arrived at 9:40. 10:05. The others had eaten.',
        },
        {
            headline:
                'Neckass asked the group to pick a restaurant and rejected all six',
            deck: 'He asked at noon. Six were proposed. At seven he suggested the first one.',
            byline: 'By the food desk',
            correction:
                'We said six restaurants were proposed. Seven. He rejected the seventh twice.',
        },
        {
            headline: "Neckass's smoke alarm has been chirping for nine days",
            deck: 'It needs a battery. He has bought batteries. They are the wrong size and are in the car with the package.',
            byline: 'Staff report',
            correction:
                'We reported the chirping at nine days. Eleven. He has moved rooms.',
        },
        {
            headline: 'Neckass has read the first page of nine books this year',
            deck: 'He owns nine books bought this year. Page one of each is creased. No page two is.',
            byline: 'By the literary desk',
            correction:
                'We said nine books. Eleven. Two are library books and are overdue.',
        },
        {
            headline:
                'Neckass has told everyone he is cutting back, while ordering',
            deck: 'He announced it at the table. He announced it again while the food arrived.',
            byline: 'By the health desk',
            correction:
                'We reported that Neckass announced it twice. Three times. The third was with dessert.',
        },
        {
            headline:
                "Neckass has been to the same coffee shop 300 times and does not know the staff's names",
            deck: 'They know his order and his name. He calls all three of them "chief."',
            byline: 'By our correspondent, who was present',
            correction:
                'We said three staff. Four. He calls the fourth "chief" as well.',
        },
        {
            headline: 'Neckass has moved one task to tomorrow forty times',
            deck: 'The task is to call his mother. It takes ten minutes. It has been tomorrow since July.',
            byline: 'Staff report',
            correction:
                'We said forty times. Forty-one. He moved it again while reading the item.',
        },
        {
            headline:
                'Neckass has assembled the shelf and has four screws left',
            deck: 'The instructions account for every screw. The shelf is up. He is not going to think about it.',
            byline: 'Staff report',
            correction:
                'We reported four screws remaining. Six. The shelf has since come down.',
        },
        {
            headline:
                'Neckass has agreed with two people who were disagreeing with each other',
            deck: 'He agreed with the first, then the second, in the same conversation. Both noticed.',
            byline: 'By our correspondent, who was present',
            correction: 'We said both parties noticed. All four did.',
        },
        {
            headline:
                'Neckass photographed the menu to decide later and ordered without looking at it',
            deck: 'The photograph was taken on Monday. He ordered on Friday, from memory, incorrectly.',
            byline: 'By the food desk',
            correction:
                'We said he photographed the menu. He photographed the specials board of a different restaurant.',
        },
        {
            headline: 'Neckass has been "just about to leave" for two hours',
            deck: 'He said it at six, at seven, and at eight. He has his coat on.',
            byline: 'By the wire desk',
            correction:
                'We reported that Neckass has his coat on. He had it on. He has taken it off.',
        },
        {
            headline:
                "Neckass's phone has been at one percent since this morning",
            deck: 'He has been told. He has a charger. It is behind the sofa.',
            byline: 'By the technology desk',
            correction:
                'We reported the phone at one percent. Two. It has since died.',
        },
        {
            headline: 'Neckass has recommended a restaurant he has not been to',
            deck: 'He recommended it warmly and at length. He has driven past it.',
            byline: 'By the food desk',
            correction:
                'We said he had driven past the restaurant. He had driven past a different restaurant with a similar sign.',
        },
        {
            headline:
                'Neckass has started a sentence with "no offense" nine times this week',
            deck: 'Offense was taken on eight occasions. The ninth person had already left.',
            byline: 'Staff report',
            correction:
                'We reported nine occasions. Ten. The tenth was to the printer.',
        },
        {
            headline:
                'Neckass has been holding a door for someone forty feet away',
            deck: 'They were not walking toward the door. They are now, because he is holding it.',
            byline: 'By our correspondent, who was present',
            correction: 'We put the distance at forty feet. Sixty. They ran.',
        },
        {
            headline:
                'Neckass has cleaned around the object rather than move it',
            deck: 'The object is a shoe. It has been in the middle of the floor for five weeks. The floor around it is clean.',
            byline: 'Staff report',
            correction:
                'We described the object as a shoe. It is two shoes, and they do not match.',
        },
        {
            headline:
                'Neckass told the barber "just a little off" and has been given a haircut',
            deck: 'He said "that\'s great" in the chair. He has not looked in a mirror since.',
            byline: 'Staff report',
            correction:
                'We said Neckass has not looked in a mirror. He has, twice, and said nothing.',
        },
        {
            headline:
                'Neckass volunteered to help and has been standing nearby for an hour',
            deck: 'He offered at two. He has held one thing, briefly, and put it down.',
            byline: 'By our correspondent, who was present',
            correction:
                'We reported that Neckass held one thing. He held it for a moment and handed it back.',
        },
        {
            headline:
                'Neckass replied "haha" to a message asking him to call urgently',
            deck: 'He was not reading it. He called four hours later, after a second message.',
            byline: 'Staff report',
            correction: 'We reported a four-hour delay. Six hours.',
        },
        {
            headline:
                'Neckass has been quietly following the wrong group around a museum',
            deck: 'He joined at the entrance. It was a school group. He listened for forty minutes.',
            byline: 'By our correspondent, who was present',
            correction:
                'We said forty minutes. An hour. He asked a question at the end.',
        },
    ];

    // Standalone corrections, drawn alongside the one chained to yesterday's
    // lead. The paper got it wrong, and says how.
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
        'We described the room as read. It was not.',
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
        'Grey. Neckass had described the day as depressing before nine.',
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
        'Fine. Neckass has said "we\'ll see" in a way that has annoyed everyone.',
        'Sleet. Neckass has gone out in the wrong shoes and will not mention it.',
        'Still. Neckass has said it is too quiet and put the television on.',
        'Bright and cold. Neckass has dressed for bright.',
        'Showers. Neckass ran to the car and left the window down.',
        'Sunny intervals. Neckass has planned the whole day around the intervals.',
        'Muggy. Neckass has bought a fan and will not open the box until August.',
        'Clear night. Neckass has been told to look up and has looked at his phone.',
        'Ice. Neckass was told to take it slowly and has fallen in the driveway.',
        'Breezy. Neckass has lost a receipt he is going to need.',
        'Unremarkable. Neckass has remarked on it four times.',
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
        'FOUND: one shoe, middle of a floor. Owner has cleaned around it for five weeks.',
        'WANTED: the second half of a story about an airport. Or a train station.',
        'FOR SALE: nine books, page one creased. Pages two onward as new.',
        'NOTICE: the goodbye at number 12 is still going. Residents may wish to use the back lane.',
        'LOST: four screws. The shelf is up. Do not tell the owner.',
        'SEEKING: anyone who has heard Neckass finish a sentence beginning "no offense."',
        'FREE: batteries, wrong size. Have been in a car since March.',
        'WANTED: someone to look behind the sofa. Reward: a charger.',
        'FOR SALE: umbrella, unused, currently in a car.',
        'NOTICE: the coffee shop wishes to inform the gentleman that we are not all called chief.',
        'LOST: a Tuesday. Reported as a scam by a man who did not know it was Wednesday.',
        'FOUND: package addressed to the post office, on a passenger seat.',
        'SERVICES: will hold a door for you from a great distance. Please run.',
        'WANTED: a barber prepared to ignore "just a little off."',
        'FOR SALE: fan, boxed, bought in a heatwave and opened in October.',
        'NOTICE: the smoke alarm at number 12 needs a battery. Nine days.',
        'SEEKING: the person who recommended the film. He would like to explain it to you.',
        'LOST: confidence in a ten-year plan. It was one page.',
        'FREE TO GOOD HOME: opinions about octopuses. One documentary, forty minutes.',
        'WANTED: anyone who has seen Neckass leave when he said he was leaving.',
        'FOR SALE: gym bag, unused. Matching membership available.',
        'NOTICE: the museum would like to know who the adult at the back of the school tour was.',
        'LOST: an hour, outside the wrong restaurant, in the rain.',
        'PERSONAL: to whoever answered the question I asked someone else — it was not for you.',
        'SEEKING: a second listener for a podcast. The first has gone.',
        'FOR SALE: shelf. Some screws remain. Sold as seen, and it is not up any more.',
        'WANTED: the name of the film he explained. It was not the one recommended.',
        'NOTICE: the bin from number 12 is in our garden again.',
        'FREE: a plan B. Comes without a plan A.',
        'LOST: the thread of a conversation, forty minutes in.',
        'FOUND: sunglasses, on a head. Owner has been looking for twenty minutes.',
        'SERVICES: will agree with both of you. Rates negotiable, and I will agree to yours.',
        'WANTED: someone to tell him the haircut is fine. He has looked twice and said nothing.',
        'FOR SALE: two shoes. They do not match. They have been on a floor for five weeks.',
        'LOST: a phone at one percent. It is somewhere in the house and it is now at zero.',
        'SEEKING: witnesses to a man holding a door for a full minute.',
        'FOR SALE: the rest of a meal. He said he would just have a bite.',
        'WANTED: a group chat that produces a plan. Ours has produced 11,000 images.',
        'NOTICE: the tour at two is for the school. It is not for the gentleman at the back.',
        'FREE: advice about wine. One fact, repeated.',
        'LOST: the receipt you are going to need. It went past the window.',
        'FOUND: a shirt, being chosen, for one hour. Owner said he was on his way.',
        'PERSONAL: to the man who was already on the train — we saw you at the station at 9:40.',
        'WANTED: the four minutes he sat outside before going back in.',
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
        {
            body: 'I run the coffee shop. There are four of us. None of us is called chief.',
            signature: 'A proprietor',
        },
        {
            body: 'He has told the airport story at my table three years running. It is a train station. I have stopped correcting him.',
            signature: 'A host',
        },
        {
            body: 'I recommended the film. He explained it back to me on Thursday. He got the ending wrong and I did not say.',
            signature: 'A colleague',
        },
        {
            body: 'The package on his passenger seat is mine. It has been to the post office sixty times without going in.',
            signature: 'A sister',
        },
        {
            body: 'I am the barber. He said "just a little off." I took a little off. He has not looked in the mirror in my presence since.',
            signature: 'A barber',
        },
        {
            body: 'He held the door for me from sixty feet. I was not going to the door. I went to the door.',
            signature: 'A pedestrian',
        },
        {
            body: 'My smoke alarm is not chirping. His is. He has knocked twice to ask about mine.',
            signature: 'A neighbor, again',
        },
        {
            body: 'He agreed with me and then with the man I was arguing with, in the same minute. We have stopped arguing and are both annoyed with him.',
            signature: 'A former colleague',
        },
        {
            body: 'I was on the school tour. The man at the back asked a question about the Romans. He was not with us.',
            signature: 'A teacher',
        },
        {
            body: 'He has moved calling me to tomorrow since July. I read this paper to find out how he is.',
            signature: 'His mother',
        },
        {
            body: 'The shelf came down on Sunday. There were six screws left over, not four. I would like this printed.',
            signature: 'A flatmate',
        },
        {
            body: 'He has said "no offense" to me twice this week. There was offense on both occasions.',
            signature: 'Name withheld',
        },
        {
            body: 'I waited an hour outside the right restaurant while he waited an hour outside the wrong one. We did not eat.',
            signature: 'A date, formerly',
        },
        {
            body: 'He has recommended my restaurant to four people. He has never been in. I would like him to come in, and also not to.',
            signature: 'A restaurateur',
        },
        {
            body: 'His phone has been at one percent for three days. He has borrowed my charger and left it at his house.',
            signature: 'A brother',
        },
        {
            body: 'I asked the question. It was addressed to two other people. He answered it, and he was wrong.',
            signature: 'A member of the audience',
        },
        {
            body: 'Your correspondent who "was present" is my husband, and he was not present.',
            signature: 'A reader',
        },
        {
            body: 'He stood in my doorway saying goodbye for fifty-five minutes. I went to bed. He was still saying it.',
            signature: 'A host, exhausted',
        },
        {
            body: 'He has told me he is cutting back while ordering, three times, at my counter.',
            signature: 'A server',
        },
        {
            body: 'The bin is in my garden again. It is the third time. He says it is the wind.',
            signature: 'A neighbor',
        },
        {
            body: 'I gave him nine books. He has creased nine first pages. I would like the books back.',
            signature: 'An aunt',
        },
        {
            body: 'He calls me chief. I am wearing a name badge.',
            signature: 'A barista',
        },
        {
            body: 'He has been five minutes away from my house for four years. I have moved.',
            signature: 'A friend, formerly',
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
        staff: 'Editor-in-chief: vacant. Wire desk: unattended. Corrections: ongoing.',
        note: 'The Gazette does not know what a neckass is and reports on one every day.',
    };
})();
