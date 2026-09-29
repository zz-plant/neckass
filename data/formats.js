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
    // detail and leaves the damning part standing), the brief that runs the
    // next day at the top of the column, in which he has done the next
    // thing, and the classified and the letter from the person he did it to. issue.js runs all of them in
    // the same issue, so the page compounds: the lead, then the ad, then the
    // letter. The general pools below hold everything not tied to a lead.
    data.LEADS = [
        {
            headline:
                'Neckass has been "five minutes away" since 2019. He is at home.',
            deck: 'He has said it to eleven people this year. He has not left the house for any of them.',
            byline: 'From wire reports',
            correction:
                'An earlier edition said Neckass had been "five minutes away" since 2019. At the time of that report he was in the shower.',
            followUp:
                'Neckass has left the house. He was five minutes away from three places and went to a fourth.',
            classified:
                'PERSONAL: to the man who was five minutes away — we have gone home.',
            letter: {
                body: 'He has been five minutes away from my house for four years. I have moved.',
                signature: 'A former neighbor',
            },
        },
        {
            headline:
                'A review of Neckass\'s ten-year plan found it consists of the words "ten-year plan"',
            deck: 'The plan is one page. The page says "ten-year plan." There is nothing else on it.',
            byline: 'Staff report',
            correction:
                "We reported that Neckass's ten-year plan is one page. It is one page printed on both sides. The second side is blank.",
            followUp:
                'Neckass has added a second page to the ten-year plan. It says "see page one."',
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
            byline: 'Staff report',
            correction:
                'An earlier edition said Neckass had not read the email. He has now read it. He has not replied.',
            followUp:
                'Neckass has replied to the best-man email. He has replied "sounds good" and asked what date.',
            classified:
                'WANTED: a best man for Saturday. The current one believes it is a different Saturday.',
            letter: {
                body: 'Neckass has told everyone he is my best man. I have not asked him. I have not set a date. I am not engaged.',
                signature: 'The groom, apparently',
            },
        },
        {
            headline:
                'Neckass has opened the fridge eleven times since dinner and taken nothing',
            deck: 'He is not hungry. Asked what he was looking for, he said "just seeing."',
            byline: 'Staff report',
            correction:
                'We reported eleven openings. He has since gone back for a twelfth and eaten a slice of cheese standing up.',
            followUp:
                'Neckass has done a shop. The fridge is full. He has opened it twice since and said there is nothing in it.',
            classified:
                'FOR SALE: fridge, full. Owner opens it eleven times a night and reports it empty.',
            letter: {
                body: 'I live with him. He has stood in our kitchen with the fridge open for six minutes, three times this week, and said "there\'s nothing in here" each time. It is full. I did the shopping.',
                signature: 'His housemate',
            },
        },
        {
            headline:
                'Neckass has set three alarms, five minutes apart, and slept through all of them',
            deck: 'They are labeled "up," "UP," and "seriously." He turned off the third without opening his eyes.',
            byline: 'Staff report',
            correction:
                'We said three alarms. There is a fourth, at 6:30, labeled "ok fine." He got up at 8:10.',
            followUp:
                'Neckass has added a fifth alarm, at 6:45, labeled "last one." He has slept through five.',
            classified:
                'WANTED: neighbor whose alarm does not go off at 5 and get ignored until 6.',
            letter: {
                body: 'I am next door at 14. His alarms go at 5:30, 5:35, 5:40 and 6:30. Mine goes at seven. I have been up at 5:30 for a year.',
                signature: 'Next door',
            },
        },
        {
            headline:
                'Neckass muted the group chat and has checked it at ninety-second intervals since',
            deck: 'Muting stopped the notifications. It did not stop him. He has opened the chat 400 times today.',
            byline: 'Staff report',
            correction:
                'We reported that Neckass opened the chat 400 times. That was by noon.',
            followUp:
                'Neckass has unmuted the group chat and asked what he missed. He was in it the whole time.',
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
            followUp:
                'Neckass has made a folder inside "Later!!" called "Actually later." It has 400 in it.',
            classified:
                'FOR SALE: folder labeled "Later!!" Contents: 2,000 emails. Buyer must take all.',
            letter: {
                body: 'I sent him an email in March. It is in a folder called "Later!!" He told me this as though it were good news.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass told his doctor he "basically never drinks" using a sommelier\'s vocabulary',
            deck: 'He said "basically never," then described a "grippy, mineral" red he had "on a Tuesday, as one does."',
            byline: 'From wire reports',
            correction:
                'We quoted Neckass describing a red as "grippy, mineral." He said "grippy, minerally."',
            followUp:
                'Neckass\'s doctor has written "drinks" on the file. He has asked to see the file, and to add a vintage.',
            classified: 'FREE: advice about wine. One fact, repeated.',
            letter: {
                body: 'He told me he basically never drinks and then described a red I had not heard of, with a vintage. I am his doctor. I wrote down "drinks."',
                signature: 'His doctor',
            },
        },
        {
            headline:
                'Neckass has paid for a gym membership since 2013 and has been to the gym twice',
            deck: 'That is $4,100 for two visits. One of them was to ask about cancelling.',
            byline: 'Staff report',
            correction:
                'We reported two visits to the gym. One was to cancel. He left with a second membership.',
            followUp:
                'Neckass has been to the gym a third time. He used the vending machine and left.',
            classified:
                'FOR SALE: gym bag, unused. Matching membership available.',
            letter: {
                body: 'He came in to cancel. He left with a second membership and a towel. I have done this job for nine years.',
                signature: 'Front desk, the gym',
            },
        },
        {
            headline:
                "Neckass's out-of-office reply has been active for eleven weeks. Neckass is at his desk.",
            deck: 'He set it for a long weekend in June. Everyone has stopped emailing him. He has noticed and is pleased.',
            byline: 'From wire reports',
            correction:
                'We said the reply had run eleven weeks. It has since been changed to say he is "back in the office," and it is still on.',
            followUp:
                "Neckass's out-of-office now says he is back. Seven people have replied to it to ask when.",
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
            byline: 'From wire reports',
            correction:
                'We reported that Neckass read the terms in full. He scrolled to the bottom in full. He read the first line.',
            followUp:
                'Neckass has been sent an update to the terms and conditions. He has agreed to it from the lock screen.',
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
            byline: 'From wire reports',
            correction:
                'We reported that Neckass said it more slowly the second time. He said it louder.',
            followUp:
                'Neckass has been asked a third time what a neckass is. He said "come on" and gestured at himself.',
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
            byline: 'Staff report',
            correction:
                'We said the story concerns an airport. It concerns a train station. He has told it as an airport for three years.',
            followUp:
                'Neckass has told the airport story to a new colleague. The colleague has since heard it was a train station and asked. He said "same thing."',
            classified:
                'WANTED: the second half of a story about an airport. Or a train station.',
            letter: {
                body: 'He has told the airport story at my table three years running. It is a train station. I have stopped correcting him, and I have stopped inviting him, and he has come anyway.',
                signature: 'A host',
            },
        },
        {
            headline:
                'Neckass has been standing in the doorway saying goodbye for fifty minutes',
            deck: '"Anyway, I should go" at 9:10. "Right, I\'m off" at 9:30. "No, really" at 9:50. He left at ten.',
            byline: 'Staff report',
            correction:
                'We timed the goodbye at fifty minutes. The hosts went to bed at forty. He continued in the hall.',
            followUp:
                'Neckass has texted the hosts to say he got home fine. He sent it from their driveway.',
            classified:
                'NOTICE: the goodbye at No. 12 is still going. Residents may wish to use the back way.',
            letter: {
                body: 'He stood in my doorway saying goodbye for fifty-five minutes. I went to bed. He was still saying it. This is the same doorway as the airport story.',
                signature: 'The same host, again',
            },
        },
        {
            headline:
                'Neckass reset a password to the password he had just been told was wrong',
            deck: 'He was locked out at two. He was locked out again at 2:01.',
            byline: 'From wire reports',
            correction:
                'We reported one lockout. He reset the password to the old one, was told he could not reuse it, and added a 1. He was locked out again at 2:04.',
            followUp:
                'Neckass has written the new password on a note. The note says "the usual one."',
            classified:
                'LOST: access to an account. The password was correct, then wrong, then the same one with a 1 on it.',
            letter: {
                body: 'I am the IT desk. He reset it to the old one, was told no, and added a 1. I watched him do it. I did not stop him. I wanted to see.',
                signature: 'IT, again',
            },
        },
        {
            headline:
                'Neckass has bought a second charger rather than look behind the couch',
            deck: 'The first charger is behind the couch. He has not looked. He now has three.',
            byline: 'Staff report',
            correction:
                'We said he has three chargers. He has five. Two are behind the couch.',
            followUp:
                'Neckass has found the charger behind the couch while looking for the remote. He has put it back.',
            classified:
                'WANTED: someone to look behind the couch. Reward: a charger.',
            letter: {
                body: 'I live with him. There are five chargers in the apartment. Two are behind the couch. He knows this. He has ordered a sixth.',
                signature: 'His housemate',
            },
        },
        {
            headline:
                'Neckass arrived at the restaurant an hour early and waited outside',
            deck: 'He had the time wrong and did not check. He stood outside for an hour in the rain.',
            byline: 'From wire reports',
            correction:
                'We reported that Neckass waited outside for an hour. He waited outside the wrong restaurant for an hour.',
            followUp:
                'Neckass has checked the booking. It was for yesterday, at the right restaurant. He has said "so I was early, technically."',
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
            byline: 'Staff report',
            correction:
                'We said he explained the ending. He explained the ending of a different film.',
            followUp:
                'The person who recommended the film has watched the one Neckass described instead. It was not the one they recommended. It was fine.',
            classified:
                'SEEKING: the person who recommended the film. He would like to explain it to you.',
            letter: {
                body: 'I recommended the film. He explained it back to me on Thursday. He got the ending wrong and I did not say.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass has left a message on "seen" for eleven days so that he can reply "properly"',
            deck: 'The message asked whether he was coming Saturday. He read it on the 3rd. Saturday was the 6th. He wants to give it a proper reply.',
            byline: 'Staff report',
            correction:
                'We said Neckass read the message on the 3rd. His phone says the 3rd. He says he "saw it but didn\'t see it."',
            followUp:
                'Neckass has replied. The reply is "sorry, just seeing this!" It is the 14th.',
            classified:
                'SEEKING: a proper minute. Owner has been meaning to reply since the 3rd and requires one.',
            letter: {
                body: 'I asked if he was coming Saturday. He read it on Tuesday. The Sunday after, he replied "just seeing this!" I had seen him on Friday. He said nothing.',
                signature: 'A friend',
            },
        },
        {
            headline:
                'Neckass has been carrying a package to the post office in his car since March',
            deck: 'It is on the passenger seat. Asked about it, he said "I know, I know." He does know.',
            byline: 'Staff report',
            correction:
                'We said the package has been in the car since March. It has been through two car washes.',
            followUp:
                'Neckass has driven past the post office with the package. It was open. He said "next time."',
            classified:
                'FOUND: package addressed to the post office, on a passenger seat.',
            letter: {
                body: 'The package on his passenger seat is mine. It has been to the post office sixty times without going in.',
                signature: 'His sister',
            },
        },
        {
            headline:
                'Neckass told the group he was "already on the train." He was in the shower.',
            deck: 'The train left at 8:04. He was in the shower at 8:04. He arrived at 9:40.',
            byline: 'Staff report',
            correction:
                'We reported that Neckass arrived at 9:40. He arrived at 9:40, said "the trains," and it was not the trains.',
            followUp:
                'Neckass has been asked to send a photo next time he is "on the train." He has sent one of the shower.',
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
            byline: 'From wire reports',
            correction:
                'We said six were proposed. The one he suggested at seven was the one he had rejected first, by name, at noon.',
            followUp:
                'The group ate at the first restaurant. Neckass has reviewed it as "fine, but I\'d have gone somewhere else."',
            classified:
                'SEEKING: seven restaurant suggestions. Will reject all and choose the first.',
            letter: {
                body: 'I suggested the first restaurant at noon. He said no. At seven he suggested it to me as his own idea. We went. It was fine.',
                signature: 'A friend',
            },
        },
        {
            headline: "Neckass's smoke alarm has been chirping for nine days",
            deck: 'It needs a battery. He describes the chirping as "on and off." It is on.',
            byline: 'Staff report',
            correction:
                'We reported the chirping at nine days. He has moved his bed to the other room and describes the problem as solved.',
            followUp:
                'Neckass has bought a battery for the smoke alarm. It is on the counter. The alarm is in the other room, chirping.',
            classified:
                'NOTICE: the smoke alarm at No. 12 needs a battery. Nine days.',
            letter: {
                body: 'I am at 14. My smoke alarm is not chirping. His is. He has knocked twice to ask about mine.',
                signature: 'Next door',
            },
        },
        {
            headline: 'Neckass has read the first page of nine books this year',
            deck: 'He owns nine books bought this year. Page one of each is creased. No page two is.',
            byline: 'From wire reports',
            correction:
                'We said nine books. There is a tenth, about finishing things, with a bookmark on page one.',
            followUp:
                'Neckass has bought an eleventh book. He has read the back of it and told two people about it.',
            classified:
                'FOR SALE: nine books, page one creased. Pages two onward as new.',
            letter: {
                body: 'I gave him nine books. He has creased nine first pages. I would like the books back.',
                signature: 'The lender of the books',
            },
        },
        {
            headline:
                "Neckass has been to the same coffee shop 300 times and does not know the staff's names",
            deck: 'They know his order and his name. He calls all three of them "chief."',
            byline: 'Staff report',
            correction:
                'We said three staff. One of them is called Chief. He does not know this, and it does not count.',
            followUp:
                'Neckass has been told the barista\'s name is Kai. He said "thanks, chief."',
            classified:
                'NOTICE: the coffee shop wishes to inform the gentleman that we are not all called chief.',
            letter: {
                body: 'He calls me chief. I am wearing a name badge.',
                signature: 'Kai, the café',
            },
        },
        {
            headline: 'Neckass has moved one task to tomorrow forty times',
            deck: 'The task is to call his mother. It takes ten minutes. He describes it as "a whole thing."',
            byline: 'Staff report',
            correction:
                'We said forty times. Forty-one. He moved it again while reading the item.',
            followUp:
                'Neckass has called his mother. It took nine minutes. He has described it as "not that bad, actually" and moved next week\'s call to the week after.',
            classified:
                'REMINDER: call your mother. This notice was placed by her.',
            letter: {
                body: 'I am his mother. He has moved calling me to tomorrow since July. I read this paper to find out how he is.',
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
            followUp:
                'Neckass has put the shelf back up with the six screws. There are now four screws left.',
            classified:
                'LOST: four screws. The shelf is up. Do not tell the owner.',
            letter: {
                body: 'I live with him. The shelf came down on Sunday. There were six screws left over, not four. I would like this printed.',
                signature: 'His housemate',
            },
        },
        {
            headline:
                'Neckass has agreed with two people who were disagreeing with each other',
            deck: 'He agreed with the first, then the second, in the same conversation. Both noticed.',
            byline: 'Staff report',
            correction: 'We said both parties noticed. All four did.',
            followUp:
                'Neckass has been asked which of the two he agreed with. He said "both had a point." Both have stopped speaking to him.',
            classified:
                'SERVICES: will agree with both of you. Rates negotiable, and I will agree to yours.',
            letter: {
                body: 'He agreed with me and then with the man I was arguing with, in the same minute. We have stopped arguing and are both annoyed with him.',
                signature: 'A former colleague',
            },
        },
        {
            headline:
                'Neckass has sent a nine-minute voice note to say he is running late',
            deck: 'He sent it at 7:50 from the car. It was played at double speed. He was still late, and it does not say by how much.',
            byline: 'From wire reports',
            correction:
                'We put the voice note at nine minutes. It was nine minutes and a second note, saying "sorry, long one."',
            followUp:
                'Neckass has been asked to text next time. He has sent a voice note to say he will.',
            classified:
                'FOUND: a voice note, nine minutes. Contains no time of arrival. Owner may collect by text.',
            letter: {
                body: 'I listened to the whole thing to find out when he would get here. It does not say. He arrived during it.',
                signature: 'A friend',
            },
        },
        {
            headline:
                "Neckass's phone has been at one percent since this morning",
            deck: 'He has been told. He said "it\'s fine, it lasts." It lasted until 10:40.',
            byline: 'From wire reports',
            correction:
                'We reported the phone at one percent. It died during the conversation about the charger.',
            followUp:
                'Neckass has charged the phone to 100 percent overnight and has spent the day at 100, saying he does not want to use it up.',
            classified:
                'LOST: a phone at one percent. It is somewhere in the house and it is now at zero.',
            letter: {
                body: 'His phone has been at one percent for three days. He has borrowed my charger and left it at his house.',
                signature: 'His brother',
            },
        },
        {
            headline: 'Neckass has recommended a restaurant he has not been to',
            deck: 'He recommended it warmly and at length. He has driven past it.',
            byline: 'From wire reports',
            correction:
                'We said he had driven past the restaurant. He had driven past a different restaurant with a similar sign.',
            followUp:
                'Neckass has been to the restaurant he recommended. He did not like it, and has told the people he recommended it to that they "must have gone on a bad night."',
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
            followUp:
                'Neckass has said "no offense" an eleventh time, to the Gazette, about the item.',
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
            byline: 'Staff report',
            correction:
                'We put the distance at forty feet. It was far enough that they had to jog, and they did, and thanked him.',
            followUp:
                'The person who jogged to the door has written in. It was the wrong building for them.',
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
            followUp:
                'Neckass has moved the shoes. They are now in the hall, in the middle of the floor, and the hall is clean around them.',
            classified:
                'FOUND: one shoe, middle of a floor. Owner has cleaned around it for five weeks.',
            letter: {
                body: 'I live with him. The shoes have been there five weeks. I moved one, to see. He moved it back.',
                signature: 'His housemate',
            },
        },
        {
            headline:
                'Neckass told the barber "just a little off" and has been given a haircut',
            deck: 'He said "that\'s great" in the chair, and "yeah, no, great" at the register.',
            byline: 'Staff report',
            correction:
                'We said Neckass has not looked in a mirror. He has, in a shop window, and walked into someone.',
            followUp:
                'Neckass has worn a hat for a day and said the hat is "a look."',
            classified:
                'WANTED: a barber prepared to ignore "just a little off."',
            letter: {
                body: 'I am the barber. He said "just a little off." I took a little off. He has not looked in the mirror in my presence since.',
                signature: 'The barber',
            },
        },
        {
            headline:
                'Neckass replied "haha" to a message asking him to call urgently',
            deck: 'He was not reading it. He called four hours later, after a second message.',
            byline: 'Staff report',
            correction:
                'We reported a four-hour delay. He replied "haha" a second time before he called.',
            followUp:
                'Neckass has been asked why he replied "haha." He said he thought it was a joke. Asked what the joke was, he said "the urgency."',
            classified:
                'WANTED: anyone who can tell "haha" from "I will call you."',
            letter: {
                body: 'I texted him to call me urgently. He replied "haha." I texted again. "haha." He called four hours later to ask what was funny.',
                signature: 'His sister, again',
            },
        },
        {
            headline:
                'Neckass has been quietly following the wrong group around a museum',
            deck: 'He joined at the entrance. It was a school group. He listened for forty minutes.',
            byline: 'Staff report',
            correction:
                'We said forty minutes. He also asked a question, about the Romans, on a tour about the Victorians.',
            followUp:
                'Neckass has written to the museum about the Romans. The museum has replied that the tour was about the Victorians and that he was not on it.',
            classified:
                'NOTICE: the museum would like to know who the adult at the back of the school tour was.',
            letter: {
                body: 'I teach at the primary. I was leading the tour. The man at the back asked a question about the Romans. He was not with us. The children have asked whether he is coming next time.',
                signature: 'A teacher at the primary',
            },
        },
        {
            headline:
                'Neckass has renewed a library book about Mars for the seventh month. He is on page nine.',
            deck: 'The book is 140 pages. He renews by phone and says he is "nearly done." The library has stopped asking.',
            byline: 'Staff report',
            correction:
                'We reported that Neckass is on page nine. The bookmark is on page nine. The crease is on page four.',
            followUp:
                'Neckass has returned the library book. He has taken out a second book about Mars and described the first as "a bit long."',
            classified:
                'WANTED: anyone who has finished a book about Mars, to say how it ends. 140 pages. Owner is on page nine.',
            letter: {
                body: 'I run the library. He renews it by phone, monthly, and each time says he is nearly done. I have started saying "good" in a way he has not noticed.',
                signature: 'The library',
            },
        },
        {
            headline:
                'Neckass has told a joke to a table that heard it from him, at the same table, the week before',
            deck: 'He said "stop me if you\'ve heard this." Four people said they had. He did not stop.',
            byline: 'Staff report',
            correction:
                'We said four people said they had heard it. Five. The fifth said so at the end.',
            followUp:
                'Neckass has told the joke a third time, to the waiter, who had also heard it. He works there.',
            classified:
                'SEEKING: a table that has not heard the one about the parrot. Will travel.',
            letter: {
                body: 'I was at the table. He said "stop me if you\'ve heard this." We tried. There is no stopping it. It is a joke about a parrot and it is not a good one.',
                signature: 'A dinner guest',
            },
        },
        {
            headline:
                'Neckass turned the heat on "just for an hour" in October. It is still on.',
            deck: 'It has been on since the first cold evening. He will "deal with it this weekend." He has said so every weekend since.',
            byline: 'Staff report',
            correction:
                'We reported that the heat has been on since the first cold evening. It was on before that. He was "testing it."',
            followUp:
                'Neckass has turned the heat off, opened a window "to freshen up," and turned the heat back on.',
            classified: 'FOR SALE: a thermostat. Works. Owner has set it once.',
            letter: {
                body: 'I live with him. The heat has been on since October. I have slept with the window open since November. We have not discussed it. He has left a note.',
                signature: 'His housemate',
            },
        },
        {
            headline:
                'Neckass has described a nap as "resting his eyes" for the fourth time this week',
            deck: 'He rested his eyes from two until 3:45, under a blanket, and woke saying he was listening.',
            byline: 'Staff report',
            correction:
                'We said Neckass woke at 3:45. He was woken at 3:45, by the end of the show he was listening to.',
            followUp:
                'Neckass has rested his eyes again. It was during the item about resting his eyes, which was being read to him.',
            classified:
                'LOST: an afternoon. Last seen under a blanket. Owner says he was listening.',
            letter: {
                body: 'He rested his eyes through my whole account of the car. When I finished he said "wow." The car was fine. I had said so.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass has said "I\'ll let you go" to a caller who was trying to go',
            deck: 'The caller said they had to go at 6:10. Neckass let them go at 6:50, after letting them go twice more.',
            byline: 'From wire reports',
            correction:
                'We said the caller was let go at 6:50. That was the third "I\'ll let you go." The call ended at 7:05.',
            followUp:
                'Neckass has called back to check they got off all right. They had. They were in the middle of it.',
            classified:
                'WANTED: a way off the phone with a man who says "anyway." We have tried "anyway."',
            letter: {
                body: 'I am his mother. He called to let me go. I had not called him. I was in the yard. It was forty minutes.',
                signature: 'His mother',
            },
        },
        {
            headline:
                'Neckass has bought a whiteboard to get organized and has written "get organized" on it',
            deck: 'It has said "get organized" since April, in his handwriting, with a box beside it. The box is not checked.',
            byline: 'Staff report',
            correction:
                'We reported one item on the whiteboard. There is a second, underneath, added in June. It says "whiteboard."',
            followUp:
                'Neckass has checked the box. He has not gotten organized. The check is "for buying the whiteboard."',
            classified:
                'FOR SALE: whiteboard, one item on it. Item included. Pen dried out.',
            letter: {
                body: 'I pass the whiteboard to leave the house. It has said "get organized" for five months. It is the most organized thing in the house, and it is a sentence.',
                signature: 'His housemate',
            },
        },
        {
            headline:
                'Neckass has given directions to a driver who was already on the right road',
            deck: 'The driver asked if this was Route 9. It was. Neckass said "you want to go back the way you came and take the second left." The driver did.',
            byline: 'From wire reports',
            correction:
                'We reported that the driver took the second left. There is no second left. The driver took the first and has written in.',
            followUp:
                'The driver has found Route 9. They were on it. Neckass has been told and has said "well, they got there."',
            classified:
                'WANTED: the driver who was on Route 9 on Tuesday. You were on Route 9. We are sorry.',
            letter: {
                body: 'I was the driver. I was on Route 9. I know that now. I would like to say that he was very confident, and that it took an hour.',
                signature: 'A visitor, since gone',
            },
        },
        {
            headline: 'Neckass has replied "maybe" to an event he is hosting',
            deck: 'The invitation went out from his account on Monday. He responded on Tuesday. The host is listed as "maybe."',
            byline: 'Staff report',
            correction:
                'We reported that Neckass replied "maybe." He has since changed it to "going," then back.',
            followUp:
                'The event Neckass is hosting is Saturday. He has asked the group what time it starts.',
            classified:
                "PERSONAL: to the guests of Saturday's event — the host will be there. Probably. He has said maybe.",
            letter: {
                body: 'I am going to his thing on Saturday. I said yes. He said maybe. It is at his house. I asked whether I should bring anything and he said "good question."',
                signature: 'A guest, so far',
            },
        },
        {
            headline:
                'Neckass has explained the rules of a game to the person who owns the game',
            deck: 'They had played it 200 times. He had played it once, on Tuesday, and lost. He explained for eleven minutes and got two rules wrong.',
            byline: 'Staff report',
            correction:
                'We said two rules wrong. Three. The third was the object of the game.',
            followUp:
                'Neckass has played the game a second time, under his own rules, and lost, and has described the rules as "a bit off."',
            classified:
                'FOR SALE: board game, complete. Rules included. Rules have been explained to owner; owner would like them back.',
            letter: {
                body: 'It is my game. I have played it since I was nine. He explained it and asked if I had "got it." I have had it for thirty years.',
                signature: 'Next door',
            },
        },
        {
            headline:
                'Neckass has kept a receipt for everything except the thing he needs to return',
            deck: 'There are 340 receipts in the drawer, going back to 2021. The one for the lamp is not among them. The lamp is in the car.',
            byline: 'Staff report',
            correction:
                'We put the receipts at 340. It is 340 receipts and one parking-garage ticket, which he has also kept.',
            followUp:
                'Neckass has taken the lamp back without the receipt and been offered a credit note. He has put the credit note in the drawer.',
            classified:
                'FOUND: 340 receipts. None for a lamp. Owner will not throw them away "just in case."',
            letter: {
                body: 'He asked me to help find the receipt. We went through the drawer. I now know what he spent on lunch in 2022. The lamp receipt is not in the drawer.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass has left a voicemail that says "it\'s me, call me back" and no name',
            deck: 'It was left at 7:40 a.m. The recipient has four people it could be. She has called two.',
            byline: 'Staff report',
            correction:
                'We reported the voicemail was left at 7:40. It was left at 7:40 and again at 7:42, to say "sorry, it\'s me."',
            followUp:
                'Neckass has been called back by the wrong man. They spoke for twenty minutes. Neither has said what about.',
            classified:
                'WANTED: "me." Left a voicemail Tuesday, 7:40. Please ring the office and say who you are. Do not say "it\'s me."',
            letter: {
                body: 'I got the voicemail. I have four people it could be. I called two. It was neither. I have decided it can wait, which is what he decided about my message in March.',
                signature: 'A friend, on her fifth call',
            },
        },
        {
            headline:
                'Neckass has watched the first ten minutes of a film four times and calls it "good so far"',
            deck: 'He starts it after dinner and is asleep by the title card. He has seen the title card four times and says it "really gets going."',
            byline: 'Staff report',
            correction:
                'We said Neckass is asleep by the title card. He is asleep before it. He has seen the studio logo four times.',
            followUp:
                'Neckass has watched the film to the end. He has described the ending as "a bit sudden," having seen the first ten minutes and the last.',
            classified: 'FOR SALE: a film. Seen the start of. Very good start.',
            letter: {
                body: 'I recommended the film. He has told me it\'s "good so far" three times over two months. It is 94 minutes long. I have stopped asking.',
                signature: 'A former friend',
            },
        },
        {
            headline:
                'Neckass has apologized for being late by explaining that he was not late',
            deck: 'He arrived at 2:25 for two, said "sorry, but actually," and set out why the meeting was at 2:30. It was not.',
            byline: 'From wire reports',
            correction:
                'We reported that Neckass arrived at 2:25. He was in the building at 2:25. He was in the room at 2:31, with a coffee.',
            followUp:
                'Neckass has asked that Tuesday\'s meeting be moved to 2:30, so that he is "not late again." It is a different meeting.',
            classified:
                "NOTICE: the two o'clock is at two. This is not a change. This is a notice.",
            letter: {
                body: 'I was chairing. He came in at 2:31 and told us the meeting was at 2:30. He showed us his calendar to prove it. It said two.',
                signature: 'A colleague',
            },
        },
        {
            headline:
                'Neckass has said "we should do this more often" to people he cancelled on twice',
            deck: 'The dinner was the third attempt; he cancelled the first two on the day. He said it at the end, with feeling. He has not proposed a date.',
            byline: 'Staff report',
            correction:
                'We said Neckass cancelled the first two dinners on the day. The second was cancelled at the restaurant, by text, from the parking lot.',
            followUp:
                'Neckass has proposed a date for the next dinner. It is a date the others cannot do, which he knew, and he has said "well, we tried."',
            classified:
                'WANTED: three people free on a Friday. Fourth will confirm on the day, and may not.',
            letter: {
                body: 'We did it more often. We did it three times. He came once. He said we should do it more often to the two of us who had been there all three times.',
                signature: 'A former neighbor',
            },
        },
        {
            headline:
                'Neckass has taken a "quick look" at a colleague\'s spreadsheet and broken it',
            deck: 'He was asked to check one figure. He sorted one column. The column is no longer attached to its rows.',
            byline: 'From wire reports',
            correction:
                'We reported that Neckass sorted one column. He sorted one column, undid it, and sorted a different column. The first is still sorted.',
            followUp:
                'Neckass has offered to fix the spreadsheet. The colleague has said it is fine. It is not fine. It is being rebuilt from a printout.',
            classified:
                'NOTICE FROM IT: the spreadsheet is not "corrupted." It has been sorted. Please stop sending it to us.',
            letter: {
                body: 'I asked him to check one number. He said "quick look." I have Tuesday\'s printout, Tuesday\'s number, and him saying "it should be fine."',
                signature: 'A colleague',
            },
        },
    ];

    // Standalone corrections, drawn alongside the routine one and the one
    // chained to yesterday's lead. Two shapes: the paper conceding it
    // overstated him ("we reported that he cooked; he assembled"), and the
    // paper answering him — he writes in, and the correction column is where
    // it declines. Corrections use the honorific; the news pages do not.
    data.CORRECTIONS = [
        'The Gazette reported that Neckass arrived at eight. He arrived at eight, realized he had forgotten his keys, and arrived again at 8:50.',
        'A previous item referred to "Neckass\'s book." It is a library book, due in March. It is now September.',
        'The Gazette stated that Neckass had finished. He had stopped.',
        'We reported that Neckass owns a bicycle. He owns a bicycle he has not ridden since buying it in 2022. It is in the hallway.',
        'An earlier edition quoted Neckass as saying "no worries." There were worries.',
        'The Gazette reported that Neckass fixed the printer. He turned it off and on. It is still broken.',
        'A photograph on Monday was captioned "Neckass, thinking." He was looking at his phone.',
        'The Gazette wrote that Neckass "woke early." He woke, and did not get up, for one hour and ten minutes.',
        'We described Neckass\'s apology as an apology. It was the sentence "well, sorry you feel that way."',
        'An earlier edition placed Neckass at the gym. It was the parking lot of the gym.',
        "The Gazette reported that Neckass's podcast has one listener. It briefly had two. The second was a misclick.",
        'A Tuesday item said Neckass had left. He had gone to the car and come back.',
        'The Gazette described Neckass as "on his way." He was choosing a shirt.',
        'We reported that Neckass cooked. He assembled.',
        'The Gazette said Neckass replied. He reacted with a thumbs up.',
        'An item said Neckass listened. He waited.',
        'We reported that Neckass had cancelled. He did not attend and did not say so.',
        'The Gazette said Neckass paid. He said "I\'ll get the next one." There has been no next one.',
        'An earlier edition reported that Neckass apologized to the printer. He apologized near it.',
        'The Gazette reported that Neckass remembered. He was reminded twice that morning.',
        'An item stated that Neckass returned the package. He intended to. It is in the car.',
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
        'The Gazette said Neckass read the message. His phone said so. He disputes his phone.',
        'We reported that Neckass was "at 80 percent." That was the phone.',
        'An item said Neckass was "on it." He had opened the email and closed it.',
        'The Gazette said Neckass had "circled back." He had forwarded the email to himself.',
        'We reported that Neckass was working from home. He was at home.',
        'Mr. Neckass has asked us to note that he was not late on Tuesday. He was late on Tuesday.',
        "Yesterday's correction was itself incorrect. The shoe was not moved. Nothing has been moved.",
        'An earlier correction described Mr. Neckass as "doing his best." The Gazette has no basis for this and withdraws it.',
        'The Gazette reported that Mr. Neckass "had a point." On reflection, he did not.',
        'We reported that Mr. Neckass was unavailable for comment. He was available. He commented for forty minutes. None of it was usable.',
        'In Thursday\'s edition we described Mr. Neckass as having "moved on." He has since brought it up.',
        'Mr. Neckass has asked us to correct the spelling of his name. It is spelled the way he spells it. We have checked with his mother.',
        'A correction on Monday said the item was one shoe, not two. It is two shoes. We are confident this time.',
        'Mr. Neckass has written to say he did read the terms and conditions. His letter runs to four pages and does not say what they were.',
        'We described the tour as a school tour. It was a school tour. Mr. Neckass has asked us to say he was "with a school," and we have declined.',
        'The Gazette said Mr. Neckass "declined to elaborate." He elaborated. We declined to print it.',
        'Mr. Neckass has asked that the correction of the 4th be corrected. The correction of the 4th stands.',
    ];

    // A forecast, and what he will do about it. Sometimes he is right, which
    // the forecaster minds more.
    data.WEATHER = [
        'Sunny, according to Neckass, who has not been outside and is going by the window.',
        'Overcast. Neckass will post "ugh, this weather" in the group chat before noon.',
        "Mild. Neckass checked yesterday's forecast and is wearing the coat. He will keep it on.",
        'Rain. Neckass was told twice and will not bring a jacket.',
        'Clear. Neckass says it is "basically nice," which is the best he has said about anything.',
        'Cold. Neckass says he is fine. He is wearing shorts and is not fine.',
        'Wind. Neckass has planned a picnic and will move it indoors when the food blows away.',
        'Fog. Neckass has set off confidently in the wrong direction.',
        'Unsettled. Neckass has checked four forecasts and selected the one he preferred.',
        'Bright. Neckass has put his sunglasses on his head and will spend twenty minutes looking for them.',
        'Drizzle. Neckass says it is "not really rain" and will be wet by noon.',
        'Cool. Neckass has turned the heat on and opened a window.',
        'Storms expected. Neckass has parked under the tree.',
        'Snow. Neckass has driven anyway and will call from a hill.',
        'Humid. Neckass has said "it\'s not the heat, it\'s the humidity" to four people who were not asking.',
        'Grey. Neckass has said "well, that\'s the summer over" in each of the last four months.',
        'Pleasant. Neckass has stayed inside and will mention tomorrow that he missed it.',
        'Frost. Neckass will use a credit card on the windshield and break the credit card.',
        'Sun, briefly. Neckass has committed to a barbecue on the strength of it.',
        'Rain easing. Neckass has cancelled and it has stopped.',
        'Wind. Neckass has left the trash can out and will collect it from the neighbor.',
        'Cold snap. Neckass has said "at least it\'s dry." It is not.',
        'Heavy rain. Neckass has an umbrella. It is in the car with the package.',
        'Bright and cold. Neckass has dressed for bright.',
        'Showers. Neckass ran to the car and left the window down.',
        'Sunny intervals. Neckass has planned the whole day around the intervals.',
        'Clear night. Neckass has been told to look up and has looked at his phone.',
        'Ice. Neckass was told to take it slowly and has fallen in the driveway.',
        'Unremarkable. Neckass has said "at least it\'s not raining" four times, to the same person.',
        'Rain. Neckass has said "it\'ll pass." It will, in November.',
        'Clear and cold. Neckass has called it "the good kind of cold." He is inside.',
        'Showers. Neckass is carrying the umbrella. It is closed. He is wet.',
        'Bright. Neckass predicted this on Tuesday, having read it in the forecast.',
        'Rain all day. Neckass has planned a walk for "when it clears."',
        'Hot. Neckass has been told it is hot and has gone outside to check.',
        'Rain. Neckass has checked the radar, said "it\'s moving away," and been rained on.',
        'Clear. Neckass has said "we should get out more" from the couch.',
        'Heat advisory. Neckass has closed the blinds and turned the fan to face the wall.',
        'Overcast. Neckass was told it would not rain and brought the coat anyway. It rained. He has mentioned this.',
        'Sun. Neckass has said "we should make the most of it" and gone inside to plan how.',
        'Wind. Neckass says it is "picking up." It has been at this speed since Tuesday.',
    ];

    // The town's ads that are not about a lead. He is in most of them anyway.
    // Nothing here restates a lead's own ad; a lead runs its ad the day it runs.
    data.CLASSIFIEDS = [
        'FOUND: set of keys, outside the gym. Owner has never been inside.',
        'FOR SALE: bicycle, never ridden. Has lived in a hallway since 2022.',
        'NOTICE FROM IT: the printer is out of paper. It has been out of paper every time. Please check before calling.',
        'WANTED: someone who can end a conversation with Neckass. Nobody has yet.',
        'FOR SALE: exercise bike. Currently a coat rack. Coats included.',
        'LOST: one hour, every morning, between the alarm and getting up.',
        'NOTICE: this column no longer accepts ads from Neckass. He placed nine last week, all "WANTED: motivation."',
        'WANTED: someone to smell some leftovers. They are nine days old. Urgent.',
        'FOR SALE: standing desk, barely used, as the owner sat at it.',
        'FREE: batteries, wrong size, bought "for the remote." The remote takes the other kind.',
        'FOR SALE: air fryer, used once, for toast.',
        'WANTED: the end of a sentence beginning "long story short." Began Tuesday.',
        'FOR SALE: noise-cancelling headphones. Owner talks over them.',
        'FOR SALE: kettlebell. Has held the door open since 2023.',
        'LOST: a "proper minute." Owner has been meaning to reply since the 3rd.',
        'FOR SALE: smart speaker. Was asked for advice. Turned on the lights.',
        'WANTED: whoever has his charger. It is everyone.',
        'SERVICES: will explain your movie to you. Have seen the first ten minutes.',
        'NOTICE: the "quick call" is not quick. See also the "quick question."',
        'FOR SALE: a planner, 2024. January is full.',
        'FOUND: an umbrella, open, in a hallway, indoors. Owner says it was raining earlier.',
        'LOST: Wednesday. Owner spent it believing it was Tuesday.',
        'FOR SALE: fan, boxed, bought in a heat wave and opened in October.',
        'LOST: the second earbud. Owner has checked the case four times.',
        'FREE TO GOOD HOME: opinions about octopuses. One documentary, forty minutes.',
        'SEEKING: a second listener for a podcast. The first has gone.',
        'NOTICE: the recycling bin from No. 12 is in our yard again.',
        'FREE: half a bag of salad, best before yesterday, described by owner as "probably fine."',
        'LOST: the thread of a conversation, forty minutes in.',
        'FOR SALE: the rest of a meal. He said he would just have a bite.',
        'LOST: the receipt you are going to need. It went past the window.',
        'FOUND: a shirt, being chosen, for one hour. Owner said he was on his way.',
    ];

    // Letters not tied to a lead. The correspondents recur — his housemate,
    // his mother, next door, the café — and are signed by what they are to
    // him, not by name. The paper has one subject; the rest are witnesses.
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
            body: 'I own the café. There are four of us. None of us is called chief. One of us has a badge that says Kai, in capitals, at eye level.',
            signature: 'The café',
        },
        {
            body: 'Your correspondent who "was present" is my husband, and he was not present.',
            signature: 'The wife of the reader who was present',
        },
        {
            body: 'I am at 14. The recycling bin is in my yard again. It is the third time. He says it is the wind. It is not windy.',
            signature: 'Next door',
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
        {
            body: 'I am his mother. He called on Sunday. It was a pocket dial. I listened for eleven minutes. He was ordering a sandwich, and he was very polite about it. He sounded well.',
            signature: 'His mother',
        },
        {
            body: 'I live with him. He has started leaving me notes. The latest says "we should talk about the kitchen." We share the kitchen. I was in it when he wrote the note.',
            signature: 'His housemate',
        },
        {
            body: 'I run the library. He has had the same book out since March and renews it by phone, monthly, "nearly done." It is a book about Mars. It is 140 pages.',
            signature: 'The library',
        },
        {
            body: 'I cut his hair. He says "just a little off" and then describes, for four minutes, a different haircut. I do that one. He says "great." Five weeks later: "just a little off."',
            signature: 'The barber',
        },
        {
            body: 'I am the town clerk. He has come to the counter four times this year to ask what the form is for. It is the form he brought.',
            signature: 'The town clerk',
        },
        {
            body: 'Your item said he was "at the gym." I run the gym. He was in the lot. He is often in the lot. He has a good spot.',
            signature: 'The gym',
        },
        {
            body: 'I sit next to him at work. He says "quick question" and I start a timer. The average is thirty-eight minutes. The record is a Wednesday.',
            signature: 'A colleague',
        },
        {
            body: 'He was on my walking tour on Sunday. He was not on my walking tour. He was walking near it and joined in the questions.',
            signature: 'The historical society',
        },
        {
            body: "He told me the recipe was his grandmother's. It is on the back of the packet. I have the packet.",
            signature: 'His housemate',
        },
        {
            body: 'I am his mother. The recipe is not mine. I have never made it. He called to ask how I make it. I said I don\'t. He said "right, but roughly."',
            signature: 'His mother',
        },
        {
            body: 'He has been "about to go" from my kitchen since nine. It is eleven. I have done the dishes around him. He has moved once, to let me at the sink.',
            signature: 'A host',
        },
        {
            body: 'He ordered "the usual." He has been in twice. Neither time was the same. We gave him a coffee. He said "perfect."',
            signature: 'The café',
        },
        {
            body: 'I ride the 8:04 every day. He says he is on it. I know everyone on it, including the man who is always asleep, and I have never seen him.',
            signature: 'A commuter',
        },
        {
            body: 'I have moved to the other side of the river. He has found the bridge.',
            signature: 'A former neighbor',
        },
        {
            body: 'He offered to help me move. He arrived after the van, carried a lamp to the van, and told the driver a route. The driver had a route.',
            signature: 'The friend who moved',
        },
        {
            body: 'I sent the message. It said the meeting had moved to two. He gave it a thumbs up and came at three.',
            signature: 'A colleague',
        },
        {
            body: 'He asked me to "send that thing." I asked which thing. He said "you know." I sent four things. It was none of them. It was a thing I had sent him.',
            signature: 'A colleague',
        },
        {
            body: 'He told me he had "seen" my message and would reply properly. That was the reply. He sent it as a voice note.',
            signature: 'His sister',
        },
    ];

    // The furniture of a real paper, and none of it is about him. A reader
    // has to get past the leaf collection and the flu clinic before the page
    // gives itself away. Dealt three per issue. The council meeting and the
    // holiday collection changes are on the calendar (data/calendar.js), so
    // they run on the days they happen.
    data.NOTICES = [
        'Leaf collection begins the first week of October. Bags only; no loose piles.',
        'The library is closed Monday for staff training.',
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
        "Because of an editing error, an article in Thursday's edition misstated the location of the book sale. It is the library, not the library annex.",
        "A caption in Monday's edition misidentified the street shown. It is Mill Street, not Mill Road.",
        'An article on the school board meeting gave an incorrect vote count. The measure passed 5-2, not 4-3.',
        'A listing in the community calendar gave the wrong start time for the farmers market. It opens at 8 a.m.',
        "An obituary in Tuesday's edition misspelled the surname of a survivor. She is Margaret Kowalczyk.",
        "Because of a production error, a photograph in Wednesday's edition ran without a credit. It was a file photograph.",
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
