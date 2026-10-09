// The paper's other forms. Each is its own joke engine — the corrections
// retract things the paper got wrong about a man who was wrong first, the
// classifieds are the ads, the letters are the people he has
// annoyed writing in — and all of them say what happened. Numbers, times,
// and who was there, not "the matter has been noted."
//
// Pool sizes are load-bearing. modules/issue.js deals a fixed number of
// each per issue, so a pool must be several times its deal size or a
// reader coming back two days in a row sees the same paper.

// A lead carries everything the paper prints about that incident: the
// deck, the correction it runs the next day (it always retracts a trivial
// detail and leaves the damning part standing), the brief that runs the
// next day at the top of the column, in which he has done the next
// thing, and the classified and the letter from the person he did it to.
// Its pose is how the file cut stands beside it (data/poses.js). issue.js
// runs all of them in the same issue, so the page compounds: the lead,
// then the ad, then the letter. The general pools below hold everything
// not tied to a lead.
export const LEADS = [
    {
        headline:
            'Neckass has been "five minutes away" since 2019. He is at home.',
        deck: 'He has said it to eleven people this year, according to a count by the Gazette. He has not left the house for any of them.',
        byline: 'From wire reports',
        pose: 'phone',
        correction:
            'Neckass has been "five minutes away" since November 2018, not 2019, as reported.',
        followUp:
            'Neckass, who the Gazette reported yesterday had been "five minutes away" since 2019, left the house. He was five minutes away from three places and went to a fourth.',
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
        deck: 'The plan, a copy of which was obtained by the Gazette, is one page. The page says "ten-year plan." There is nothing else on it.',
        byline: 'Staff report',
        pose: 'considering',
        correction:
            'The ten-year plan is one page printed on both sides, not one page. The second side is blank.',
        followUp:
            'The ten-year plan now has a second page. It says "see page one."',
        classified:
            'FOUND: a ten-year plan. One page, three words. Owner can pick it up.',
        letter: {
            body: 'He showed me the plan, which says "ten-year plan." I asked what it was. He said "the plan."',
            signature: 'His manager',
        },
    },
    {
        headline: 'Neckass agreed to be best man in an email he has not read',
        deck: 'The wedding is Saturday. He has told the groom he is free a different Saturday.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'An earlier edition said Neckass had not read the email. He has now read it. He has not replied.',
        followUp:
            '"Sounds good," Neckass wrote to the best-man email, and asked what date.',
        classified:
            'WANTED: a best man for Saturday. The current one believes it is a different Saturday.',
        letter: {
            body: 'Neckass has told everyone he is my best man. I have not asked him or set a date, and I am not engaged.',
            signature: 'The groom, apparently',
        },
    },
    {
        headline:
            'Neckass has opened the fridge eleven times since dinner and taken nothing',
        deck: 'He is not hungry, he said. Asked what he was looking for, he said "just seeing." His roommate kept the count.',
        byline: 'Staff report',
        pose: 'considering',
        correction:
            'Twelve openings, not eleven: he has since gone back for the twelfth and eaten a slice of cheese standing up.',
        followUp:
            'The fridge is full again after a grocery run. He has opened it twice since and said there is nothing in it.',
        classified:
            'FOR SALE: fridge, full. Owner opens it eleven times a night and reports it empty.',
        letter: {
            body: 'The fridge has been open six minutes, three times this week, and each time he says "there\'s nothing in here." It is full. I did the shopping.',
            signature: 'His roommate',
        },
    },
    {
        headline:
            'Neckass set three alarms, five minutes apart, and slept through all of them',
        deck: 'They are labeled "up," "UP," and "seriously." He turned off the third without opening his eyes.',
        byline: 'Staff report',
        pose: 'resting',
        correction:
            'Four alarms, not three. The fourth, at 6:30, is labeled "ok fine." He got up at 8:10.',
        followUp:
            'A fifth alarm, at 6:45, labeled "last one." He has slept through five.',
        classified:
            'WANTED: earplugs, heavy-duty. The alarms next door go at 5:30, 5:35, and 5:40 and wake everyone but the man who set them.',
        letter: {
            body: 'I am next door at 14. His alarms go at 5:30, 5:35, 5:40, and 6:30. Mine goes at seven. I have been up at 5:30 for a year.',
            signature: 'Next door',
        },
    },
    {
        headline:
            'Neckass muted the group chat and has checked it at ninety-second intervals since',
        deck: 'Muting stopped the notifications, though not him. According to his phone, he has opened the chat 400 times today.',
        byline: 'Staff report',
        pose: 'phone',
        correction:
            'The 400 openings of the chat were by noon, not for the day.',
        followUp:
            'Neckass unmuted the group chat and asked what he missed. He was in it the whole time.',
        classified:
            'WANTED: a group chat that produces a plan. Ours has produced 11,000 images.',
        letter: {
            body: 'I am in the group chat. He muted it in front of me and then asked what he had missed. Nothing. He was there.',
            signature: 'A member of the chat',
        },
    },
    {
        headline:
            'Neckass declared inbox zero. He has a second inbox with 2,000 in it.',
        deck: 'He moved the emails to a folder called "Later." Later has 2,000 emails.',
        byline: 'From wire reports',
        pose: 'satisfied',
        correction:
            'An earlier edition said the folder is called "Later." It is called "Later!!"',
        followUp:
            'Inside "Later!!" there is now a folder called "Actually later." It has 400 in it.',
        classified:
            'FOR SALE: email folder, labeled "Later" with two exclamation marks. Contents: 2,000 emails. Buyer must take all.',
        letter: {
            body: 'I sent him an email in March. It is in a folder called "Later!!" He told me this as though it were good news.',
            signature: 'Accounts payable',
        },
    },
    {
        headline:
            'Neckass told his doctor he "basically never drinks," using a sommelier\'s vocabulary',
        deck: 'He said "basically never," then described a "grippy, mineral" red he had "on a Tuesday, as one does."',
        byline: 'From wire reports',
        pose: 'explaining',
        correction:
            'Neckass had the red he described to his doctor on a Monday, not a Tuesday. He had the other bottle Tuesday.',
        followUp:
            'His doctor declined to discuss a patient. According to the patient, the doctor wrote "drinks" on the file, and he asked to see it, and to add a vintage.',
        classified:
            'FREE: advice about wine, from a man who basically never drinks.',
        letter: {
            body: 'He told me he basically never drinks and then described a red I had not heard of, with a vintage. I am his doctor. I wrote down "drinks."',
            signature: 'His doctor',
        },
    },
    {
        headline:
            'Neckass has paid for a gym membership since 2013 and has been to the gym twice',
        deck: 'That is $4,100 for two visits, according to records provided by the gym. One of them was to ask about canceling.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'The visit "to ask about canceling" ended with a second membership.',
        followUp:
            'On his third visit to the gym, Neckass reached the vending machine and sent the group a photograph of the weights.',
        classified: 'FOR SALE: gym bag, unused. Matching membership available.',
        letter: {
            body: 'He came in to cancel. He left with a second membership and a towel. I have done this job for nine years.',
            signature: 'Front desk, the gym',
        },
    },
    {
        headline:
            "Neckass's out-of-office reply has been active for eleven weeks. Neckass is at his desk.",
        deck: 'He set it for a long weekend in June. Everyone has stopped emailing him. Reached at his desk, he said he was pleased.',
        byline: 'From wire reports',
        pose: 'satisfied',
        correction:
            'The out-of-office reply has run eleven weeks and now says he is "back in the office." It is still on.',
        followUp:
            'The out-of-office now says he is back. Seven people have replied to it to ask when.',
        classified:
            'NOTICE: Neckass is out of the office until June 14. It is September.',
        letter: {
            body: 'I stopped emailing him in June because he was away. He has been at the next desk the whole time. He waved.',
            signature: 'The next desk',
        },
    },
    {
        headline:
            'Neckass read the terms and conditions in full, understood none of them, and agreed',
        deck: 'It took forty minutes. Asked what he had agreed to, he said "the usual."',
        byline: 'From wire reports',
        pose: 'considering',
        correction:
            'He did not read the terms in full. He scrolled them in full.',
        followUp:
            'An update to the terms and conditions arrived Tuesday. He agreed to it from the lock screen.',
        classified:
            'SEEKING: anyone who knows what I agreed to. I read all of it. — N.',
        letter: {
            body: 'He asked me what he had agreed to. I said I had not read it either. He said "but you\'re a lawyer." I am a dentist.',
            signature: 'A friend',
        },
    },
    {
        headline: 'Asked what a neckass is, Neckass said "you know, a neckass"',
        deck: 'Asked again, he said it more slowly, and nodded. He did not elaborate.',
        byline: 'From wire reports',
        pose: 'shrug',
        correction: 'The second "you know, a neckass" was louder, not slower.',
        followUp:
            'Asked a third time what a neckass is, Neckass said "come on" and gestured at himself.',
        classified:
            'WANTED: a definition of "neckass." Will accept "you know."',
        letter: {
            body: 'I asked him what a neckass is. He said "you know," and when I said I did not, he said "well, exactly."',
            signature: 'A new colleague',
        },
    },
    {
        headline:
            'Neckass has told the same story at the same table for the third year in a row',
        deck: 'It is the story about the airport. Everyone at the table has heard it at this table, from him, twice before, according to the host.',
        byline: 'Staff report',
        pose: 'explaining',
        correction:
            'The story concerns a train station, not an airport. He has told it as an airport for three years.',
        followUp:
            'The airport story went to a new colleague, who has since heard it was a train station and asked. He said "same thing."',
        classified:
            'WANTED: the second half of a story about an airport. Or a train station.',
        letter: {
            body: 'He has told the airport story at my table three years in a row. It is a train station. I have stopped correcting him, and I have stopped inviting him, and he has come anyway.',
            signature: 'A host',
        },
    },
    {
        headline:
            'Neckass has been standing in the doorway saying goodbye for fifty minutes',
        deck: 'He said "anyway, I should go" at 9:10, "right, I\'m off" at 9:30, and "no, really" at 9:50. He left at ten.',
        byline: 'Staff report',
        pose: 'leaving',
        correction:
            'The goodbye ran fifty minutes only because the hosts went to bed at forty. He continued in the hall.',
        followUp:
            'He texted the hosts to say he got home fine. He sent it from their driveway.',
        classified:
            'NOTICE: the goodbye at No. 12 is still going. Residents may wish to use the back way.',
        letter: {
            body: 'He stood in my doorway saying goodbye for fifty-five minutes. I went to bed, and he was still saying it. This is the same doorway as the airport story.',
            signature: 'The same host, again',
        },
    },
    {
        headline:
            'Neckass reset a password to the password he had just been told was wrong',
        deck: 'He was locked out at two, according to IT. He was locked out again at 2:01.',
        byline: 'From wire reports',
        pose: 'phone',
        correction:
            'Two lockouts, not one. He reset the password to the old one, was told he could not reuse it, and added a 1. He was locked out again at 2:04.',
        followUp:
            'The new password is on a note. The note says "the usual one."',
        classified:
            'LOST: access to an account. The password was correct, then wrong, then the same one with a 1 on it.',
        letter: {
            body: 'I am the IT desk. He reset it to the old one, was told no, and added a 1. I watched him do it, and did not stop him, because I wanted to see.',
            signature: 'IT, again',
        },
    },
    {
        headline:
            'Neckass bought a second charger rather than look behind the couch',
        deck: 'The first charger is behind the couch, where he has not looked. He now has three.',
        byline: 'Staff report',
        pose: 'shrug',
        correction: 'Five chargers, not three. Two are behind the couch.',
        followUp:
            'Neckass found the charger behind the couch while looking for the remote. He put it back.',
        classified:
            'WANTED: someone to look behind the couch. Reward: a charger.',
        letter: {
            body: 'There are five chargers in the apartment, two of them behind the couch, which he knows. He has ordered a sixth.',
            signature: 'His roommate',
        },
    },
    {
        headline:
            'Neckass arrived at the restaurant an hour early and waited outside',
        deck: 'He had not checked the time, and stood outside for an hour in the rain.',
        byline: 'From wire reports',
        pose: 'standingBy',
        correction:
            'The restaurant was the wrong one. He waited outside it for an hour.',
        followUp:
            'The booking was for yesterday, at the right restaurant, the restaurant confirmed. "So I was early, technically," Neckass said.',
        classified: 'LOST: an hour, outside the wrong restaurant, in the rain.',
        letter: {
            body: 'I waited an hour outside the right restaurant while he waited an hour outside the wrong one. We did not eat.',
            signature: 'A date, formerly',
        },
    },
    {
        headline:
            'Neckass explained the plot of a film to the person who recommended it',
        deck: 'They recommended it Tuesday. He explained it to them Thursday, in full, including the end.',
        byline: 'Staff report',
        pose: 'explaining',
        correction:
            'The ending he explained was the ending of a different film.',
        followUp:
            'The person who recommended the film has watched the one Neckass described instead. It was not the one they recommended. It was better. He has been told and has said he knew.',
        classified:
            'SEEKING: the person who recommended the film. He would like to explain it to you.',
        letter: {
            body: 'I recommended the film. He explained it back to me on Thursday. He got the ending wrong and I did not say.',
            signature: 'The person who recommended it',
        },
    },
    {
        headline:
            'Neckass has left a message on "seen" for eleven days so that he can give it a real reply',
        deck: 'The message asked whether he was coming Saturday. He read it on the 3rd. Saturday was the 6th. He wants to sit down and really reply.',
        byline: 'Staff report',
        pose: 'phone',
        correction:
            'His phone says he read the message on the 3rd. He says he "saw it but didn\'t see it."',
        followUp:
            '"Sorry, just seeing this!" is the reply, and it is the 14th.',
        classified:
            'SEEKING: a minute to sit down and really reply. Owner has been meaning to since the 3rd.',
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
        pose: 'shrug',
        correction:
            'The package has been in the car since March and through two car washes.',
        followUp:
            'Neckass drove past the post office with the package on the seat. The post office was open, the post office confirmed. "Next time," he said.',
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
        deck: 'The train left at 8:04. He was in the shower at 8:04, his roommate said. He arrived at 9:40.',
        byline: 'Staff report',
        pose: 'phone',
        correction:
            'Neckass arrived at 9:40 and said "the trains." It was not the trains.',
        followUp:
            'Asked to send a photo next time he is "on the train," Neckass sent one of the shower.',
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
        deck: 'He asked at noon, and six were proposed. At seven he suggested the first one.',
        byline: 'From wire reports',
        pose: 'considering',
        correction:
            'Six restaurants were proposed. The one he suggested at seven was the one he had rejected first, by name, at noon.',
        followUp:
            'The group ate at the first restaurant. Neckass reviewed it as "fine, but I\'d have gone somewhere else."',
        classified:
            'SEEKING: seven restaurant suggestions. Will reject all and choose the first.',
        letter: {
            body: 'I suggested the first restaurant at noon, and he said no. At seven he suggested it to me as his own idea. We went, and it was fine.',
            signature: 'A friend',
        },
    },
    {
        headline: "Neckass's smoke alarm has been chirping for nine days",
        deck: 'It needs a battery. He describes the chirping as "on and off." It is on.',
        byline: 'Staff report',
        pose: 'explaining',
        correction:
            'The chirping is at nine days. He has moved his bed to the other room and describes the problem as solved.',
        followUp:
            'A battery for the smoke alarm is on the counter. The alarm is in the other room, chirping.',
        classified:
            'NOTICE: the smoke alarm at No. 12 needs a battery. Nine days.',
        letter: {
            body: 'I am at 14. My smoke alarm is not chirping, but his is, and he has knocked twice to ask about mine.',
            signature: 'Next door',
        },
    },
    {
        headline: 'Neckass requested $3 on Cash App from a friend he owes $40',
        deck: 'The note on the request says "gas," according to a screenshot provided to the Gazette. The friend was driving. The $40 has been owed since the Fourth of July.',
        byline: 'Staff report',
        pose: 'phone',
        correction:
            'We reported the request was for $3. It was $3.50, and the note says "gas + tip."',
        followUp: 'Neckass paid back $5 of the $40, with the note "we even?"',
        classified:
            'SEEKING: $40, owed since July 4. Will accept payment in any form except a request.',
        letter: {
            body: 'He owes me $40. On Tuesday I got a request from him for $3, "gas," from the passenger seat while I was driving. It was my gas.',
            signature: 'A friend, $40 down',
        },
    },
    {
        headline:
            "Neckass has been to the same coffee shop 300 times and does not know the staff's names",
        deck: 'They know his order and his name, the owner said. He calls all three of them "chief."',
        byline: 'Staff report',
        pose: 'leaving',
        correction:
            'Four staff, not three: he calls the fourth "boss," and she owns the café.',
        followUp:
            'Told the barista\'s name is Kai, Neckass said "thanks, chief."',
        classified:
            'NOTICE: we at the coffee shop wish to inform the gentleman that we are not all called chief.',
        letter: {
            body: 'He calls me chief. I am wearing a badge that says Kai.',
            signature: 'The barista',
        },
    },
    {
        headline: 'Neckass has moved one task to tomorrow forty times',
        deck: 'The task is to call his mother, which takes ten minutes. He describes it as "a whole thing."',
        byline: 'Staff report',
        pose: 'considering',
        correction:
            'Forty-one times, not forty: he moved it again while reading the item.',
        followUp:
            'He called his mother, and it took nine minutes. "Not that bad, actually," he said, and moved next week\'s call to the week after.',
        classified:
            'REMINDER: call your mother. This notice was placed by her.',
        letter: {
            body: 'I am his mother. He has moved calling me to tomorrow since July. I read this paper to find out how he is.',
            signature: 'His mother',
        },
    },
    {
        headline: 'Neckass assembled the shelf and has four screws left',
        deck: 'The instructions account for every screw. The shelf is up. Asked about the screws, he said he was "not going to think about it."',
        byline: 'Staff report',
        pose: 'satisfied',
        correction:
            'Six screws were left over, not four. The shelf came down Sunday with the books on it. No one was hurt.',
        followUp:
            'The shelf is back up. Of the six screws, four are left over.',
        classified:
            'LOST: four screws. The shelf is up. Do not tell the owner.',
        letter: {
            body: 'The shelf came down on Sunday. There were six screws left over, not four. I would like this printed.',
            signature: 'His roommate',
        },
    },
    {
        headline:
            'Neckass agreed with two people who were disagreeing with each other',
        deck: 'He agreed with the first, then the second, in the same conversation. Both noticed.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'Both parties noticed, and so did a third person, present throughout, who was agreed with, briefly.',
        followUp:
            'Asked which of the two he agreed with, Neckass said "both had a point." Both have stopped speaking to him.',
        classified:
            'SERVICES: will agree with both of you. Rates negotiable, and I will agree to yours.',
        letter: {
            body: 'He agreed with me and then with the man I was arguing with, in the same minute. We have stopped arguing and are both annoyed with him.',
            signature: 'A former colleague',
        },
    },
    {
        headline:
            'Neckass sent a nine-minute voice note to say he was running late',
        deck: 'He sent it at 7:50 from the car. The Gazette has listened to it in full, at double speed. He was still late, and it does not say by how much.',
        byline: 'From wire reports',
        pose: 'phone',
        correction:
            'The voice note was nine minutes plus a second note, saying "sorry, long one."',
        followUp:
            'Asked to text next time, Neckass sent a voice note to say he would.',
        classified:
            'FOUND: a voice note, nine minutes. Contains no time of arrival. Owner can claim it by text.',
        letter: {
            body: 'I listened to the whole thing to find out when he would get here. It does not say. He arrived during it.',
            signature: 'A friend',
        },
    },
    {
        headline: "Neckass's phone has been at one percent since this morning",
        deck: 'He has been told, and he said "it\'s fine, it lasts." It lasted until 10:40.',
        byline: 'From wire reports',
        pose: 'phone',
        correction: 'The phone died during the conversation about the charger.',
        followUp:
            'Neckass charged the phone to 100 percent overnight and has spent the day at 100, saying he does not want to use it up.',
        classified:
            'LOST: a phone at one percent. It is somewhere in the house and it is now at zero.',
        letter: {
            body: 'His phone has been at one percent for three days. He has borrowed my charger and left it at his house.',
            signature: 'His brother',
        },
    },
    {
        headline: 'Neckass recommended a restaurant he has not been to',
        deck: 'He recommended it to four people, at length. Asked whether he had been, he said he had "driven past it."',
        byline: 'From wire reports',
        pose: 'pointing',
        correction:
            'He had driven past a different restaurant with a similar sign.',
        followUp:
            'Neckass went to the restaurant he recommended. He did not like it, and told the people he recommended it to that they "must have gone on a bad night."',
        classified:
            'WANTED: a review of this restaurant from someone who has been inside. — The restaurant',
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
        pose: 'defense',
        correction:
            'Ten times, not nine. The tenth was "no offense, but" to a waiter, followed by an order.',
        followUp:
            'The eleventh "no offense" went to the Gazette, about the item.',
        classified:
            'SEEKING: anyone who has heard Neckass finish a sentence beginning "no offense."',
        letter: {
            body: 'He has said "no offense" to me twice this week. There was offense on both occasions.',
            signature: 'Name withheld',
        },
    },
    {
        headline: 'Neckass has been holding a door for someone forty feet away',
        deck: 'They were not walking toward the door. They are now, because he is holding it.',
        byline: 'Staff report',
        pose: 'standingBy',
        correction:
            'Forty feet: far enough that they had to jog, and did, and thanked him.',
        followUp:
            'The person who jogged to the door has written in. It was the wrong building.',
        classified:
            'SERVICES: will hold a door for you from a great distance. Please run.',
        letter: {
            body: 'He held the door for me from sixty feet. I was not going to the door. I went to the door.',
            signature: 'A pedestrian',
        },
    },
    {
        headline: 'Neckass cleaned around the object rather than move it',
        deck: 'The object is a shoe. It has been in the middle of the floor for five weeks. The floor around it is clean.',
        byline: 'Staff report',
        pose: 'satisfied',
        correction: 'Two shoes, not a shoe, and they do not match.',
        followUp:
            'The shoes are now in the hall, in the middle of the floor, and the hall is clean around them.',
        classified:
            'FOUND: one shoe, middle of a floor. Owner has cleaned around it for five weeks.',
        letter: {
            body: 'The shoes have been there five weeks. I moved one, to see, and he moved it back.',
            signature: 'His roommate',
        },
    },
    {
        headline:
            'Neckass told the barber "just a little off" and has been given a haircut',
        deck: 'He said "that\'s great" in the chair, and "yeah, no, great" at the register.',
        byline: 'Staff report',
        pose: 'satisfied',
        correction:
            '"That\'s great" was said three times, not twice. The third was to the mirror, and quieter.',
        followUp: 'Neckass wore a hat for a day and called the hat "a look."',
        classified: 'WANTED: a barber prepared to ignore "just a little off."',
        letter: {
            body: 'I am the barber. He said "just a little off," so I took a little off. He has not looked in the mirror in my presence since.',
            signature: 'The barber',
        },
    },
    {
        headline:
            'Neckass replied "haha" to a message asking him to call urgently',
        deck: 'He said he was not reading it. He called four hours later, after a second message.',
        byline: 'Staff report',
        pose: 'phone',
        correction:
            'The four-hour delay included a second "haha," before the call.',
        followUp:
            'Asked why he replied "haha," Neckass said he thought it was a joke. Asked what the joke was, he said "the urgency."',
        classified:
            'WANTED: anyone who can tell "haha" from "I will call you."',
        letter: {
            body: 'I texted him to call me urgently. He replied "haha." I texted again and got another "haha." He called four hours later to ask what was funny.',
            signature: 'His sister, again',
        },
    },
    {
        headline: 'Neckass reneged in spades and blamed his partner',
        deck: 'He cut with a spade while holding the queen of hearts. The table caught it on the next trick. He asked his partner why she led a heart.',
        byline: 'Staff report',
        pose: 'pointing',
        correction:
            'We reported that Neckass reneged once. He reneged twice. The second time was while explaining the first.',
        followUp:
            'Neckass has asked for a rematch with a new partner. He has asked the same partner.',
        classified:
            'WANTED: spades partner. Must be able to count to thirteen. Current partner counts to eleven and has opinions about the other two.',
        letter: {
            body: 'I have been his partner since 2014. He talks across the table, he slaps every card, and on Saturday he reneged and asked me why I led a heart. I did not lead a heart.',
            signature: 'His spades partner, since 2014, for now',
        },
    },
    {
        headline:
            'Neckass brought store-bought potato salad to the cookout in a bowl from home',
        deck: "He took the lid off at the curb, tipped the salad into his mother's bowl, and added paprika. He told four people it was his recipe. The receipt was in the bag.",
        byline: 'Staff report',
        pose: 'defense',
        correction:
            'We reported that Neckass added paprika. He added raisins, and nobody has eaten it.',
        followUp:
            'Neckass has been asked to bring ice to the next cookout. He has asked what kind.',
        classified:
            "FOUND: a bowl of potato salad, untouched, at Saturday's cookout. The bowl belongs to his mother, who would like it back. The potato salad can stay.",
        letter: {
            body: 'I am his auntie. I know every potato salad in this family by sight. That one came from the store, he put raisins in it, and he looked me in my face.',
            signature: 'His auntie',
        },
    },
    {
        headline:
            'Neckass told a joke to a table that heard it from him, at the same table, the week before',
        deck: 'He said "stop me if you\'ve heard this." Four people said they had. He did not stop.',
        byline: 'Staff report',
        pose: 'explaining',
        correction:
            'Five people said they had heard it, not four. The fifth said so at the end.',
        followUp:
            'The joke went a third time to the waiter, who had also heard it. He works there.',
        classified:
            'SEEKING: a table that has not heard the one about the parrot. Will travel.',
        letter: {
            body: 'I was at the table when he said "stop me if you\'ve heard this," and we tried. There is no stopping it. It is a joke about a parrot, and it is not a good one.',
            signature: 'A dinner guest',
        },
    },
    {
        headline:
            'Neckass turned the heat on "just for an hour" in October. It is still on.',
        deck: 'It has been on since the first cold evening. He will "deal with it this weekend." He has said so every weekend since.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'The heat was on before the first cold evening. He was "testing it."',
        followUp:
            'The heat was turned off, a window opened "to freshen up," and the heat turned back on.',
        classified: 'FOR SALE: a thermostat. Works. Owner has set it once.',
        letter: {
            body: 'The heat has been on since October. I have slept with the window open since November. We have not discussed it. He has left a note.',
            signature: 'His roommate',
        },
    },
    {
        headline:
            'Neckass has described a nap as "resting his eyes" for the fourth time this week',
        deck: 'He rested his eyes from two until 3:45, under a blanket, and woke saying he was listening.',
        byline: 'Staff report',
        pose: 'resting',
        correction:
            'He was woken at 3:45 by the end of the show he was listening to.',
        followUp:
            'He rested his eyes again while the item about resting his eyes was being read to him.',
        classified:
            'LOST: an afternoon. Last seen under a blanket. Owner says he was listening.',
        letter: {
            body: 'He rested his eyes through my whole account of the car. When I finished he said "wow," and the car was fine. I had said so.',
            signature: 'A colleague',
        },
    },
    {
        headline:
            'Neckass said "I\'ll let you go" to a caller who was trying to go',
        deck: 'The caller said they had to go at 6:10. Neckass let them go at 6:50, after letting them go twice more.',
        byline: 'From wire reports',
        pose: 'phone',
        correction:
            'The caller was let go at 6:50 on the third "I\'ll let you go." The call ended at 7:05.',
        followUp:
            'Neckass called back to check the caller got off all right. They had. They were in the middle of it.',
        classified:
            'WANTED: a way off the phone with a man who says "anyway." We have tried "anyway."',
        letter: {
            body: 'I am his mother. He called to let me go, though I had not called him. I was in the yard, and it was forty minutes.',
            signature: 'His mother',
        },
    },
    {
        headline:
            'Neckass took the aux and has played the first thirty seconds of eleven songs',
        deck: 'He asked for the aux at 9:40 and said he had "a vibe." He skipped every song he chose, including one he said was "about to go crazy." It did not go.',
        byline: 'From wire reports',
        pose: 'phone',
        correction:
            'We said eleven songs. It was twelve, and the twelfth was a voice note he played by accident, to the whole car.',
        followUp:
            'Neckass has been given the aux back on the condition that he does not touch it. He has asked if he can queue.',
        classified:
            "WANTED: someone to hold the aux at Saturday's function. Neckass is attending.",
        letter: {
            body: 'It was my car. He asked for the aux for one song, played the start of eleven, and said "wait, wait, this one." Then it was his voice note, which we all heard. It was to his barber, rescheduling.',
            signature: 'The driver',
        },
    },
    {
        headline:
            'Neckass gave directions to a driver who was already on the right road',
        deck: 'The driver asked if this was the highway. It was. Neckass said "you want to go back the way you came and take the second left." The driver did.',
        byline: 'From wire reports',
        pose: 'pointing',
        correction:
            'There is no second left. The driver took the first and has written in.',
        followUp:
            'Told that the driver had found the highway, which they had been on all along, Neckass said "well, they got there."',
        classified:
            'WANTED: the driver who was on the highway on Tuesday. You were on the highway. We are sorry.',
        letter: {
            body: 'I was the driver, on the highway, and I know that now. I would like to say that he was very confident, and that it took an hour.',
            signature: 'A visitor, since gone',
        },
    },
    {
        headline: 'Neckass replied "maybe" to an event he is hosting',
        deck: 'The invitation went out from his account Monday. He responded Tuesday. The host is listed as "maybe."',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'The reply of "maybe" has since been changed to "going," then back.',
        followUp:
            'The event is Saturday. The host has asked the group what time it starts.',
        classified:
            "PERSONAL: to the guests of Saturday's event — the host will be there. Probably. He has said maybe.",
        letter: {
            body: 'I am going to his thing on Saturday. I said yes, and he said maybe. It is at his house. I asked whether I should bring anything, and he said "good question."',
            signature: 'A guest, so far',
        },
    },
    {
        headline: 'Neckass explained 2K to the person who owns the console',
        deck: 'His cousin has played it every night since 2019. Neckass had played once, on Tuesday, and lost by 40. He explained for eleven minutes and got the buttons wrong.',
        byline: 'From wire reports',
        pose: 'explaining',
        correction:
            'We said he got the buttons wrong. He got the buttons wrong and held the controller upside down.',
        followUp:
            'Neckass played a second game, on his own settings, and lost by 52. He has said the controller "has a delay."',
        classified:
            'FOR SALE: second controller, lightly used, blamed for two losses.',
        letter: {
            body: 'It is my console. I have played since I was nine. He picked up the controller, explained the game to me for eleven minutes, and asked if I had "got it." Then he lost by 40 on rookie.',
            signature: 'His cousin',
        },
    },
    {
        headline:
            'Neckass kept a receipt for everything except the thing he needed to return',
        deck: 'There are 340 receipts in the drawer, going back to 2021. The one for the lamp is not among them. The lamp is in the car.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'The drawer holds 340 receipts and one parking-garage ticket, which he has also kept.',
        followUp:
            'The lamp went back without the receipt, for store credit. The credit slip went in the drawer.',
        classified:
            'FOUND: 340 receipts. None for a lamp. Owner will not throw them away "just in case."',
        letter: {
            body: 'He asked me to help find the receipt. We went through the drawer. I now know what he spent on lunch in 2022. The lamp receipt is not in the drawer.',
            signature: 'A colleague',
        },
    },
    {
        headline:
            'Neckass left a voicemail that says "it\'s me, call me back" and no name',
        deck: 'It was left at 7:40 a.m. The recipient, who asked not to be named, has four people it could be. She has called two.',
        byline: 'Staff report',
        pose: 'phone',
        correction:
            'The voicemail was left at 7:40 and again at 7:42, to say "sorry, it\'s me."',
        followUp:
            'The wrong man called back. They spoke for twenty minutes, about what neither will say.',
        classified:
            'WANTED: "me." Left a voicemail Tuesday, 7:40. Please call the office and say who you are. Do not say "it\'s me."',
        letter: {
            body: 'I got the voicemail. I have four people it could be, and I called two. It was neither. I have decided it can wait, which is what he decided about my message in March.',
            signature: 'A friend, on her fifth call',
        },
    },
    {
        headline:
            'Neckass has watched the first ten minutes of a film four times and calls it "good so far"',
        deck: 'He starts it after dinner and is asleep by the title card. He has seen the title card four times and says it "really gets going."',
        byline: 'Staff report',
        pose: 'resting',
        correction:
            'He is asleep before the title card. He has seen the studio logo four times.',
        followUp:
            'The film was watched to the end. He called the ending "kind of sudden," having seen the first ten minutes and the last.',
        classified: 'FOR SALE: a film. Seen the start of. Very good start.',
        letter: {
            body: 'I recommended the film. He has told me it is "good so far" three times in two months. It is 94 minutes long, and I have stopped asking.',
            signature: 'A former friend',
        },
    },
    {
        headline:
            'Neckass apologized for being late by explaining that he was not late',
        deck: 'He arrived at 2:25 for two, said "sorry, but actually," and set out why the meeting was at 2:30. It was not, according to the invitation.',
        byline: 'From wire reports',
        pose: 'defense',
        correction:
            'He was in the building at 2:25 and in the room at 2:31, with a coffee.',
        followUp:
            'Tuesday\'s meeting was moved to 2:30 at his request, so that he is "not late again." It is a different meeting.',
        classified:
            "NOTICE: the two o'clock is at two. This is not a change. This is a notice.",
        letter: {
            body: 'I was chairing. He came in at 2:31 and told us the meeting was at 2:30. He showed us his calendar to prove it. It said two.',
            signature: 'The chair',
        },
    },
    {
        headline:
            'Neckass said "we should do this more often" to people he canceled on twice',
        deck: 'The dinner was the third attempt; he canceled the first two the day of. He said it at the end, with feeling. He has not proposed a date.',
        byline: 'Staff report',
        pose: 'leaving',
        correction:
            'The second dinner was canceled at the restaurant, by text, from the parking lot. The first was canceled the day of.',
        followUp:
            'A date for the next dinner was proposed. It is one the others cannot do, which he knew. "Well, we tried."',
        classified:
            'WANTED: three people free on a Friday. Fourth will confirm the day of, and may not.',
        letter: {
            body: 'He canceled twice, came the third time, and told us at the end that we should do this more often. We have done it three times. He was at one.',
            signature: 'A former neighbor',
        },
    },
    {
        headline:
            'Neckass took a "quick look" at a colleague\'s spreadsheet and broke it',
        deck: 'He was asked to check one figure. He sorted one column. The column is no longer attached to its rows.',
        byline: 'From wire reports',
        pose: 'defense',
        correction:
            'He sorted one column, undid it, and sorted a different column. The first is still sorted.',
        followUp:
            'The colleague has said the spreadsheet is fine. People familiar with the spreadsheet said it is not. It is being rebuilt from a printout.',
        classified:
            'NOTICE FROM IT: the spreadsheet is not "corrupted." It has been sorted. Please stop sending it to us.',
        letter: {
            body: 'I asked him to check one number. He said "quick look." I have Tuesday\'s printout, Tuesday\'s number, and him saying "it should be fine."',
            signature: 'The owner of the spreadsheet',
        },
    },
];

// Standalone corrections, drawn alongside the routine one and the one
// chained to yesterday's lead. The paper concedes it overstated him ("we
// reported that he cooked; he assembled") and the retracted detail is
// something he did. The joke is never the paper's posture; he is the
// one doing the thing, including when the thing is disputing the item.
export const CORRECTIONS = [
    'The Gazette reported that Neckass arrived at eight. He arrived at eight, realized he had forgotten his keys, and arrived again at 8:50.',
    'A previous item referred to "Neckass\'s book." It is a library book, due in March. It is now September.',
    'The Gazette stated that Neckass had finished. He had stopped.',
    'Because of a reporting error, Neckass was described as owning a bicycle. He owns a hallway with a bicycle in it.',
    'An earlier edition quoted Neckass as saying "no worries." There were worries.',
    'The Gazette reported that Neckass fixed the printer. He turned it off and on, and IT put in paper.',
    'A photograph on Monday was captioned "Neckass, thinking." He was looking at his phone.',
    'The Gazette wrote that Neckass "woke early." He woke, and did not get up, for one hour and ten minutes.',
    'We described Neckass\'s apology as an apology. It was the sentence "well, sorry you feel that way."',
    'An earlier edition placed Neckass at the gym. It was the parking lot of the gym.',
    "The Gazette reported that Neckass's podcast has one listener. It briefly had two. The second was a misclick.",
    'A Tuesday item said Neckass had left. He had gone to the car and come back.',
    'The Gazette described Neckass as "on his way." He was choosing a shirt.',
    'A recipe item credited Neckass with cooking. He assembled.',
    "Neckass's reply, as reported Monday, was a thumbs-up.",
    'An item said Neckass listened. He waited.',
    'Neckass did not cancel, as reported. He did not attend and did not say so.',
    'The Gazette said Neckass paid. He said "I\'ll get the next one," and there has been no next one.',
    'An earlier edition reported that Neckass apologized to the printer. He apologized near it.',
    'The Gazette reported that Neckass remembered. He was reminded twice that morning.',
    'An item stated that Neckass returned the package. He intended to. It is in the car.',
    'Neckass walked, a Sunday item said. He drove to the walk.',
    'We said Neckass finished the puzzle. One piece is missing, and he has stopped mentioning it.',
    'An earlier edition described Neckass as happy to help. He was happy.',
    'An article overstated what Neckass understood. He nodded.',
    'For "Neckass cleaned up," read "Neckass moved things to a different room."',
    'We said Neckass declined. He did not reply, which he considers declining.',
    'An item reported Neckass as looking into it. He has opened one tab.',
    'A headline Thursday, "Neckass learns his lesson," was sourced to Neckass. He has since done it again, and learned it again.',
    'The hour Neckass spent "on hold" was misreported. The call was answered after four minutes. He was talking.',
    'In an item on Neckass, "reached out" should have read "thought about it."',
    'The Gazette said Neckass read the message. His phone said so, and he disputes his phone.',
    'A caption gave Neckass as "at 80 percent." That was the phone.',
    'An item said Neckass was "on it." He had opened the email and closed it.',
    "We described Neckass's notes from the meeting as notes. They are the date, underlined.",
    'An item had Neckass working from home. He was at home.',
    'Neckass disputes that he was late Tuesday. He was, and Wednesday too, when he came in to dispute it.',
    'The shoe was not moved, as reported. Neckass picked it up, looked at it, and put it down where it was.',
    'We described Neckass as "doing his best." He was doing the crossword.',
    "The point credited to Neckass in a meeting item was someone else's, made earlier, while he was getting coffee.",
    'Neckass was available for comment, contrary to an earlier report. He commented for forty minutes, twelve of them about parking.',
    'We described Neckass as having "moved on." He has since brought it up, twice, to say he had.',
    "We spelled Neckass's name the way he spelled it on the form. He spelled it a second way further down the form. His mother has confirmed the first.",
    'We reported one shoe on the floor. There are two. He put the second one there after reading the item, "so it made sense."',
    'Neckass wrote to say he did read the terms and conditions. The letter is four pages and does not say what they were.',
    'We described the tour as a school tour. It was. Neckass has since said he was "with a school," and named one. It is the one he went to.',
    'We said Neckass "declined to elaborate." He elaborated, for twenty minutes, in the lot, to the reporter\'s closed car window.',
    'Neckass asked that the correction of the 4th be corrected. Asked what was wrong with it, he said he was "getting to that." That was the 9th.',
    'A Monday item said Neckass blamed his chair. He was standing. He blamed the chair by the window.',
    'The Gazette reported that Neckass bet against himself on the 8:04. He bet on himself, from the shower, at 8:01.',
];

// A forecast, and what he will do about it. Sometimes he is right, which
// the forecaster minds more.
export const WEATHER = [
    'Sunny, according to Neckass, who has not been outside and is going by the window.',
    'Overcast, and a photo of it in the group chat, captioned "ugh."',
    "Mild. He has dressed for yesterday's forecast.",
    'Rain, twice announced, and no jacket.',
    'Clear, or "basically nice," which is his highest rating.',
    'Cold. "Fine," in shorts.',
    'Wind. The picnic will move indoors after the food does.',
    'Fog, and a man walking quickly away from where he is going.',
    'Unsettled, according to three forecasts. He read out the fourth.',
    'Bright, and the sunglasses are on his head. The search will take twenty minutes.',
    'Drizzle, "not really rain," and wet through by noon.',
    'Cool, and a jacket carried all day "in case," then left on the train.',
    'Storms expected. The car is under the tree.',
    'Snow, and he drove anyway. The call will come from a hill.',
    'Humid. "It\'s not the heat, it\'s the humidity," to four people, none of whom asked.',
    'Gray. "Well, summer\'s over," for the fourth month in a row.',
    'Pleasant, and indoors. He will say tomorrow that he missed it.',
    'Frost, a credit card on the windshield, and then two halves of a credit card.',
    'Sun, briefly, and a barbecue booked on the strength of it.',
    'Rain easing, about a minute after he canceled.',
    'Wind, and the trash can is out to be collected from next door.',
    'Cold snap, and "at least it\'s dry." It is not.',
    'Heavy rain. The umbrella is in the car with the package.',
    'Bright and cold, and dressed for bright.',
    'Showers. He ran to the car and left the window down.',
    'Sunny intervals, around which the whole day has been planned.',
    'Clear night. Told to look up, he looked at his phone.',
    'Ice. Told to take it slowly, he is taking it slowly, on his back, in the driveway.',
    'Unremarkable. "At least it\'s not raining," four times, to the same person.',
    'Rain, and "it\'ll pass." It will, in November.',
    'Clear and cold, "the good kind," from inside.',
    'Showers. He carries the umbrella closed, and is wet anyway.',
    'Bright. Neckass predicted this Tuesday, having read it in the forecast.',
    'Rain all day, and a walk planned for "when it clears."',
    'Hot. Told so, he went outside to check.',
    'Rain. "It\'s moving away," he said, checking the radar in the rain.',
    'Clear. "We should get out more," from the couch.',
    'Heat advisory. He has picked today for the run.',
    'Overcast, with no rain forecast and a coat brought anyway. It rained, and he has mentioned this.',
    'Sun. "We should make the most of it," he said, and went inside to plan how.',
    'Wind, "picking up," at the speed it has held since Tuesday.',
];

// The ads that are not about a lead. He is in most of them anyway.
// Nothing here restates a lead's own ad; a lead runs its ad the day it runs.
export const CLASSIFIEDS = [
    'FOUND: set of keys, outside the gym. Owner has never been inside.',
    'FOR SALE: bicycle, never ridden. Has lived in a hallway since 2022.',
    'NOTICE FROM IT: before calling about the printer, please check the paper. It has been the paper every time.',
    'WANTED: someone who can end a conversation with Neckass. Previous applicants are still in it.',
    'FOR SALE: exercise bike. Currently a coat rack. Coats included.',
    'LOST: one hour, every morning, between the alarm and getting up.',
    'NOTICE: this column no longer accepts ads from Neckass. He placed nine last week, all "WANTED: motivation."',
    'WANTED: someone to smell some leftovers. They are nine days old. Urgent.',
    'FOR SALE: standing desk. Sat at.',
    'FREE: batteries, wrong size, bought "for the remote." The remote takes the other kind.',
    'FOR SALE: air fryer, used once, for toast.',
    'WANTED: the end of a sentence beginning "long story short." Began Tuesday.',
    'FOR SALE: noise-canceling headphones. Owner talks over them.',
    'FOR SALE: kettlebell. Has held the door open since 2023.',
    'LOST: "a minute to really reply." Owner has been looking for it since the 3rd.',
    'FOR SALE: smart speaker. Was asked for advice. Turned on the lights.',
    'WANTED: whoever has his charger. It is everyone.',
    'SERVICES: will explain your movie to you. Have seen the first ten minutes.',
    'NOTICE FROM HR: "quick call" is no longer a calendar category. Please book these as half days.',
    'FOR SALE: a planner, 2024. January is full.',
    'FOUND: an umbrella, open, in a hallway, indoors. Owner says it was raining earlier.',
    'LOST: Wednesday. Owner spent it believing it was Tuesday.',
    'FOR SALE: snow shovel, bought in the first snow of the year, once it had stopped.',
    'LOST: the second earbud. Owner has checked the case four times.',
    'FOR SALE: slides, socks attached. Owner wore them to a wedding and called it "business casual."',
    'SEEKING: a second listener for a podcast. The first has gone.',
    'NOTICE: the recycling bin from No. 12 is in our yard again.',
    'FREE: half a bag of salad, best by yesterday, described by owner as "probably fine."',
    'SERVICES: will tell you your lineup is fine. It is not. $5.',
    'FOR SALE: the rest of a meal. He said he would just have a bite.',
    'LOST: a receipt, needed Tuesday. It was in the bag he threw away Monday, to tidy up.',
    "NOTICE: Saturday's function is BYOB. This means bring your own. It does not mean bring a cup and stand by the cooler.",
    'IN MEMORIAM: Doug, a sourdough starter, April 3–9, 2020. Fed six times, photographed nine.',
    'FOUND: 23 food containers and four lids, none of which fit. Owner says they are "a set."',
    'FOR SALE: acoustic guitar, played for a week in 2021. Owner still lists it under "skills."',
    'WANTED: our lawn mower, lent in June to do "one strip." The strip is mowed. The rest of his lawn is not. — Next door',
    'NOTICE: karaoke is now limited to two songs a person. The limit was set Friday, after Thursday.',
    "FOR SALE: golf clubs, full set, glove tag still on. Owner went to the range once and has since corrected his father's swing.",
    'NOTICE: the register will no longer split a $9 sandwich across three gift cards and a coupon. It did on Saturday, with six people waiting.',
    'FOR SALE: a playlist called "running." Played 140 times, all on the couch.',
    'LOST: a tape measure. Owner measured the couch by eye, and the couch is in the stairwell.',
    'SEEKING: a fantasy league with room for one. Last season he set his lineup in Week 2, left it, and finished fourth.',
    'FREE: blender, used for one smoothie. The rest of the smoothie is still in it.',
    'FREE: a candle, "fresh linen," bought instead of doing the laundry.',
    'CARD OF THANKS: to the stranger who told Neckass his fly was down at 10:40 a.m. Monday. He had also been told at 9:15 and at 10.',
    'FOR SALE: iron, used on the fronts of shirts only. Owner keeps his jacket on.',
    'FOR SALE: the book club book, spine uncracked. Owner reviewed it at book club.',
    'LOST: a 212-day streak in a language app, on day 213. Owner can say "the boy eats an apple" and nothing else.',
    'FREE: cast-iron pan, seasoned once and put in the dishwasher the next morning.',
    'WANTED: anyone but him to put on a duvet cover. He has been inside the current one twice.',
    'FREE: sunscreen, SPF 50. Owner put it on at 4 p.m., in the car home from the beach.',
    'LOST: a spare key, hidden "somewhere obvious" in April. Owner has checked the obvious places and two that are not.',
    'NOTICE: the pickleball courts are booked by the hour. The man on Court 2 has been warming up for thirty-five minutes.',
    'FOUND: a "World\'s Best Boss" mug, in the office sink for three weeks. Owner manages nobody.',
    'SWAP: one record, for any second record. Owner calls the first "the collection."',
    'LOST: a parking spot, right outside. Owner gave it up to move the car "a bit closer."',
    'NOTICE FROM THE MARKET: we know mornings are hard. "Will Neckass make the 8:04?" reopens at 6 a.m. Please trade responsibly.',
    'NOTICE FROM A CARD COMPANY: whatever you are going through, we are here for you. We are not refunding the sandwich.',
    'NOTICE FROM FACILITIES: the chair by the window has been inspected, and it does not make that noise. Please stop putting in tickets about it.',
    'NOTICE FROM A DELIVERY APP: nine nights in a row from the place across the street. Whatever you are going through, we are here for you, and so is the place, which is across the street.',
];

// Letters not tied to a lead. The correspondents recur — his roommate,
// his mother, next door, the café — and are signed by what they are to
// him, not by name. The paper has one subject; the rest are witnesses.
export const LETTERS = [
    {
        body: 'I am in IT. The printer is out of paper. That is all that is wrong with it. That is all that has ever been wrong with it.',
        signature: 'IT',
    },
    {
        body: 'He told me the shop closes at six. It was 6:05. He tried the door, read the sign, and told me the sign was wrong.',
        signature: 'A reader who was present',
    },
    {
        body: 'He says he is doing too much. He is doing one thing, slowly, and stopping to tell me about it.',
        signature: 'The desk across',
    },
    {
        body: 'I was the second listener of the podcast. It was a misclick. He has since messaged to ask what I thought of episode two.',
        signature: 'Name withheld',
    },
    {
        body: 'He rang my doorbell to ask whether I had seen his cat. The cat was on his shoulder. He said "not that one."',
        signature: 'Next door',
    },
    {
        body: 'I am in the group chat. He sends a TikTok, then, a minute later, "this is literally you." It is never me. It is usually him.',
        signature: 'The group chat',
    },
    {
        body: 'I own the café. There are four of us, and none of us is called chief. One of us has a badge that says Kai, in capitals, at eye level.',
        signature: 'The café',
    },
    {
        body: 'He asked to borrow an egg. I said yes, and he asked how many I had. I have not seen the carton since.',
        signature: 'A neighbor',
    },
    {
        body: 'I am at 14. The recycling bin is in my yard again, the third time. He says it is the wind. It is not windy.',
        signature: 'Next door',
    },
    {
        body: 'He had learned his lesson, he said. I asked which one. "The main one."',
        signature: 'HR',
    },
    {
        body: 'I sold him a fan in July. He returned it in October, still in the box, because it had turned cold.',
        signature: 'A shopkeeper',
    },
    {
        body: 'He offered to water my plants while I was away. I was away nine days. He watered them on the first and the ninth. The ninth was for the photograph.',
        signature: 'A neighbor',
    },
    {
        body: 'I am his mother. He called on Sunday, by pocket dial. I listened for eleven minutes while he ordered a sandwich, very politely. He sounded well.',
        signature: 'His mother',
    },
    {
        body: 'I live with him, and he has started leaving me notes. The latest says "we should talk about the kitchen." We share the kitchen, and I was in it when he wrote the note.',
        signature: 'His roommate',
    },
    {
        body: 'He called next at the court on Sunday. When it was his turn he said his knee was "acting up" and sat in his car with the AC on until we finished. Then he said "good run."',
        signature: 'The court, Sundays',
    },
    {
        body: 'He came into the shop with a picture of a man with a different head. I did what I could. He has posted it and tagged me, and the whole shop has seen it, and so has the man in the picture.',
        signature: 'The barbershop',
    },
    {
        body: 'I am the clerk. He has come to the counter four times this year to ask what the form is for. It is the form he brought.',
        signature: 'The clerk',
    },
    {
        body: 'He says he goes to the gym. I run the gym, and he is often in the lot. He has a good spot.',
        signature: 'The gym',
    },
    {
        body: 'I sit next to him at work. He says "quick question" and I start a timer. The average is thirty-eight minutes. The record is a Wednesday.',
        signature: 'The colleague with the timer',
    },
    {
        body: 'He borrowed my hoodie in March. I have seen it three times since, all on his Instagram. He tagged the brand.',
        signature: 'His cousin',
    },
    {
        body: "He told me the recipe was his grandmother's. It is on the back of the packet. I have the packet.",
        signature: 'His roommate',
    },
    {
        body: 'I am his mother, and the recipe is not mine. I have never made it. He called to ask how I make it, and I said I don\'t. He said "right, but roughly."',
        signature: 'His mother',
    },
    {
        body: 'He has been "about to go" from my kitchen since nine. It is eleven. I have done the dishes around him. He has moved once, to let me at the sink.',
        signature: 'A host',
    },
    {
        body: 'He ordered "the usual." He has been in twice, and neither time was the same, so we gave him a coffee. He said "perfect."',
        signature: 'The diner',
    },
    {
        body: 'I know everyone on the 8:04, including the man who is always asleep. He says he is on it. I have never seen him.',
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
        body: 'I sent the message. It said the meeting had moved to two. He gave it a thumbs-up and came at three.',
        signature: 'The office manager',
    },
    {
        body: 'He asked me to "send that thing," and when I asked which thing, he said "you know." I sent four things. It was none of them, and it was a thing I had sent him.',
        signature: 'A colleague',
    },
    {
        body: 'He told me he had "seen" my message and would "really reply" later. That was the reply. He sent it as a voice note.',
        signature: 'His sister',
    },
    {
        body: 'I took his call. He was disputing a $14.20 sandwich, and he was eating it. The script says to tell the customer we are here for them, so I did, and I was, for fifty-one minutes.',
        signature: 'His card company, disputes',
    },
    {
        body: 'I work in support at the market. He has written in nine times to say the market on the 8:04 is rigged. The market is whether he gets on a train.',
        signature: 'Support, the market',
    },
    {
        body: 'I sat beside him in the meeting. He laughed at his phone, then there was the noise, then he turned around to look at the chair by the window. Nobody was near that chair. I was near him.',
        signature: 'The seat beside him',
    },
];
