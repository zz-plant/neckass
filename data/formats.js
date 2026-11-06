// The paper's other forms. Each is its own joke engine — the corrections
// retract things the paper got wrong about a man who was wrong first, the
// classifieds are the ads, the letters are the people he has
// annoyed writing in — and all of them say what happened. Numbers, times,
// and who was there, not "the matter has been noted."
//
// Pool sizes are load-bearing. modules/issue.js deals a fixed number of
// each per issue, so a pool must be several times its deal size or a
// reader coming back two days in a row sees the same paper. Each item is
// keyed by its number, and is dealt by it: a new item takes the next
// number and runs from an issue that has not gone to press, and a weak
// one is retired from an issue on (data/growth.js). Edit an item in
// place; never renumber or delete one.

// A lead carries everything the paper prints about that incident: the
// deck, the correction it runs the next day (it always retracts a trivial
// detail and leaves the damning part standing), the brief that runs the
// next day at the top of the column, in which he has done the next
// thing, and the classified and the letter from the person he did it to.
// Its pose is how the file cut stands beside it (data/poses.js), and its
// scene, where it names one, what he stands among (data/scenes.js). issue.js
// runs all of them in the same issue, so the page compounds: the lead,
// then the ad, then the letter. The general pools below hold everything
// not tied to a lead.
export const LEADS = {
    1: {
        headline:
            'Neckass has been “five minutes away” since 2019. He is at home.',
        deck: 'He has said it to eleven people this year, according to a count by the Gazette, including his roommate, who was in the room.',
        byline: 'From wire reports',
        pose: 'phone',
        scene: ['phone', 'couch'],
        correction:
            'Neckass has been “five minutes away” since November 2018, not 2019.',
        followUp:
            'Neckass, who the Gazette reported yesterday had been “five minutes away” since 2019, left the house. He was five minutes away from three places and went to a fourth.',
        classified:
            'PERSONAL: to the man who was five minutes away — we have gone home.',
        letter: {
            body: 'He has been five minutes away from my house since 2019. I have moved.',
            signature: 'A former neighbor',
        },
    },
    2: {
        headline:
            'A review of Neckass’s ten-year plan found it consists of the words “ten-year plan”',
        deck: 'The plan, a copy of which was obtained by the Gazette, is one page. The page says “ten-year plan.” There is nothing else on it.',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['easel'],
        correction:
            'The ten-year plan is one page printed on both sides, not one page. The second side is blank.',
        followUp:
            'The ten-year plan now has a second page. It says “see page one.”',
        classified:
            'FOUND: a ten-year plan. One page, three words. Owner can pick it up.',
        letter: {
            body: 'He showed me the plan, which says “ten-year plan.” I asked what it was. He said “the plan.”',
            signature: 'His manager',
        },
    },
    3: {
        headline: 'Neckass agreed to be best man in an email he has not read',
        deck: 'The wedding is Saturday. He has told the groom he is free a different Saturday.',
        byline: 'Staff report',
        pose: 'shrug',
        scene: ['desk'],
        correction:
            'An earlier edition said Neckass had not read the email. He had read the subject line, which is “Best man?”',
        followUp:
            'Neckass replied to the best-man email a second time, eleven weeks after “sounds good,” to ask “which Saturday?”',
        classified:
            'WANTED: a best man for Saturday. The current one believes it is a different Saturday.',
        letter: {
            body: 'I asked him in March. He wrote back “sounds good” in four minutes. He has since told four people he is my best man and asked each of them when the wedding is.',
            signature: 'The groom',
        },
    },
    4: {
        headline:
            'Neckass has opened the fridge eleven times since dinner and taken nothing',
        deck: 'His roommate kept the count. He is not hungry, he said. Asked what he was looking for, he said “just seeing.”',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['fridge'],
        correction:
            'Twelve openings, not eleven: he has since gone back for the twelfth and eaten a slice of cheese standing up.',
        followUp:
            'The fridge is full again after a grocery run. He has opened it twice since and said there is nothing in it.',
        classified:
            'FOR SALE: fridge, full. Owner opens it eleven times a night and reports it empty.',
        letter: {
            body: 'The fridge has been open six minutes, three times this week, and each time he says “there’s nothing in here.” It is full. I did the shopping.',
            signature: 'His roommate',
        },
    },
    5: {
        headline:
            'Neckass set three alarms, five minutes apart, and slept through all of them',
        deck: 'They are labeled “up,” “UP,” and “seriously.” He turned off the third without opening his eyes.',
        byline: 'Staff report',
        pose: 'resting',
        scene: ['alarm'],
        correction:
            'Four alarms, not three. The fourth, at 6:30, is labeled “ok fine.” He got up at 8:10.',
        followUp:
            'A fifth alarm, at 6:45, labeled “last one.” He has slept through five.',
        classified:
            'WANTED: earplugs, heavy-duty. The alarms next door go at 5:30, 5:35, and 5:40 and wake everyone but the man who set them.',
        letter: {
            body: 'His alarms go at 5:30, 5:35 and 5:40. Mine goes at seven. I have been up at 5:30 for a year.',
            signature: 'Next door',
        },
    },
    6: {
        headline:
            'Neckass muted the group chat and has checked it at ninety-second intervals since',
        deck: 'Muting stopped the notifications, though not him. According to his phone, he has opened the chat 400 times today.',
        byline: 'Staff report',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'The 400 openings of the chat were by noon, not for the day.',
        followUp:
            'Neckass unmuted the group chat and asked what he missed. He was in it the whole time.',
        classified:
            'WANTED: a group chat that has made a plan. Ours has made a poll, about a dinner he suggested, which he did not vote in.',
        letter: {
            body: 'I am in the group chat. He has not written in it since March. According to the little faces at the bottom, he has read every message within a minute.',
            signature: 'A member of the chat',
        },
    },
    7: {
        headline:
            'Neckass declared inbox zero. He has a second inbox with 2,000 in it.',
        deck: 'He moved the emails to a folder called “Later.” Later has 2,000 emails.',
        byline: 'From wire reports',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'An earlier edition said the folder is called “Later.” It is called “Later!!”',
        followUp:
            'Inside “Later!!” there is now a folder called “Actually later.” It has 400 in it.',
        classified:
            'FOR SALE: email folder, labeled “Later.” Contents: 2,000 emails. Buyer must take all.',
        letter: {
            body: 'I sent him an email in March. It is in a folder called “Later.” He told me this as though it were good news.',
            signature: 'Accounts payable',
        },
    },
    8: {
        headline:
            'Neckass told his doctor he “basically never drinks,” using a sommelier’s vocabulary',
        deck: 'He said “basically never,” then described a “grippy, mineral” red he had “on a Tuesday, as one does.”',
        byline: 'From wire reports',
        pose: 'explaining',
        correction:
            'Neckass had the red he described to his doctor on a Monday, not a Tuesday. He had the other bottle Tuesday.',
        followUp:
            'His doctor declined to discuss a patient. According to the patient, the doctor wrote “drinks” on the file, and he asked to see it, and to add a vintage.',
        classified:
            'FREE: advice about wine, from a man who basically never drinks.',
        letter: {
            body: 'He told the waiting room he basically never drinks, then recommended a red to it, with a vintage. Three people wrote it down.',
            signature: 'His doctor’s receptionist',
        },
    },
    9: {
        headline:
            'Neckass has paid for a gym membership since 2013 and has been to the gym twice',
        deck: 'That is $4,100 for two visits, according to records provided by the gym. One of them was to ask about canceling.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'The visit “to ask about canceling” ended with a second membership.',
        followUp:
            'On his third visit to the gym, Neckass reached the vending machine and sent the group a photograph of the weights.',
        classified: 'FOR SALE: gym bag, unused. Matching membership available.',
        letter: {
            body: 'He has been in twice. The first time he asked where the showers were. The second time he asked to cancel, and I gave him the form, and he asked where the showers were.',
            signature: 'Front desk, the gym',
        },
    },
    10: {
        headline:
            'Neckass’s out-of-office reply has been active for eleven weeks. Neckass is at his desk.',
        deck: 'He set it for a long weekend in June. Everyone has stopped emailing him. Reached at his desk, he said he was pleased.',
        byline: 'From wire reports',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'The out-of-office reply has been active for eleven weeks and two days. The two days were the long weekend.',
        followUp:
            'The out-of-office now says he is back. Seven people have replied to it to ask when.',
        classified:
            'NOTICE: Neckass is out of the office until June 14. It is September.',
        letter: {
            body: 'I stopped emailing him in June because he was away. He has been at the next desk the whole time. He waved.',
            signature: 'The next desk',
        },
    },
    11: {
        headline:
            'Neckass read the terms and conditions in full, understood none of them, and agreed',
        deck: 'It took forty minutes. Asked what he had agreed to, he said “the usual.”',
        byline: 'From wire reports',
        pose: 'considering',
        scene: ['desk'],
        correction:
            'He did not read the terms in full. He scrolled them in full.',
        followUp:
            'An update to the terms and conditions arrived Tuesday. He agreed to it from the lock screen.',
        classified:
            'SEEKING: anyone who knows what I agreed to. I read all of it. — N.',
        letter: {
            body: 'He asked me what he had agreed to. I said I had not read it either. He said “but you’re a lawyer.” I am a dentist.',
            signature: 'A friend',
        },
    },
    12: {
        headline: 'Asked what a neckass is, Neckass said “you know, a neckass”',
        deck: 'His niece, 7, had asked at dinner. Asked again, he said it more slowly, nodded, and passed her the potatoes.',
        byline: 'From wire reports',
        pose: 'shrug',
        correction: 'The second “you know, a neckass” was louder, not slower.',
        followUp:
            'Asked a third time what a neckass is, Neckass said “come on” and gestured at himself.',
        classified:
            'WANTED: a definition of “neckass.” Will accept “you know.”',
        letter: {
            body: 'I asked him what a neckass is. He said “you know,” and when I said I did not, he said “well, exactly.”',
            signature: 'A new colleague',
        },
    },
    13: {
        headline:
            'Neckass gave a toast at his cousin’s wedding that was about him',
        deck: 'It ran fourteen minutes, according to the videographer. The couple came up once, in the last line, which was “anyway, to them.”',
        byline: 'The videographer contributed to this report',
        pose: 'explaining',
        scene: ['table'],
        correction:
            'The toast was given at the reception, not the ceremony. He had asked about the ceremony.',
        followUp:
            'The wedding video has been cut to four minutes. Neckass has asked for the long version.',
        classified:
            'FOR SALE: a microphone, used once, at a wedding, for fourteen minutes.',
        letter: {
            body: 'He gave the toast at my wedding. I have watched the video twice. I am in it, at the back, waiting for him to finish.',
            signature: 'His cousin’s wife',
        },
    },
    14: {
        headline:
            'Neckass has been standing in the doorway saying goodbye for fifty minutes',
        deck: 'He said “anyway, I should go” at 9:10, “right, I’m off” at 9:30, and “no, really” at 9:50. At ten, as this edition went to press, he had his coat on and was describing the drive home.',
        byline: 'Staff report',
        pose: 'leaving',
        scene: ['doorway'],
        correction:
            'The goodbye ran fifty minutes only because the hosts went to bed at forty. He continued in the hall.',
        followUp:
            'He texted the hosts to say he got home fine. He sent it from their driveway.',
        classified:
            'FOR SALE: a coat, worn in a doorway for fifty minutes. Never taken outside.',
        letter: {
            body: 'He stood in my doorway and said “I should let you go” eleven times. I live here.',
            signature: 'The host',
        },
    },
    15: {
        headline:
            'Neckass reset a password to the password he had just been told was wrong',
        deck: 'He was locked out at two, according to IT. He was locked out again at 2:01.',
        byline: 'From wire reports',
        pose: 'phone',
        scene: ['phone', 'desk'],
        correction:
            'Three lockouts, not two. He reset the password to the old one, was told he could not reuse it, and added a 1. He was locked out again at 2:04.',
        followUp:
            'The new password is on a note. The note says “the usual one.”',
        classified:
            'LOST: access to an account. The password was correct, then wrong, then the same one again.',
        letter: {
            body: 'I am the IT desk. He reset it to the old one. I watched him do it, and did not stop him, because I wanted to see.',
            signature: 'IT',
        },
    },
    16: {
        headline:
            'Neckass bought a second charger rather than look behind the couch',
        deck: 'The first charger is behind the couch, where it was located by the Gazette and where he has not looked. He now has three.',
        byline: 'Staff report',
        pose: 'shrug',
        scene: ['couch'],
        correction: 'Five chargers, not three. Two are behind the couch.',
        followUp:
            'Neckass found the charger behind the couch while looking for the remote. He put it back.',
        classified:
            'WANTED: someone to look behind the couch. Reward: a charger.',
        letter: {
            body: 'He has ordered another charger. It comes Thursday. I know where it will go, and so does he, and so does the couch.',
            signature: 'His roommate',
        },
    },
    17: {
        headline:
            'Neckass arrived at the restaurant an hour early and waited outside',
        deck: 'He said he likes to “get a feel for the place” and stood in the rain for an hour, turning down a table from the hostess four times because the booking was for eight.',
        byline: 'From wire reports',
        pose: 'standingBy',
        scene: ['rain'],
        correction:
            'The restaurant was the wrong one. He waited outside it for an hour.',
        followUp:
            'Neckass has booked again, for eight, at the right restaurant, the restaurant confirmed. He has been outside it since six.',
        classified:
            'FOUND: an umbrella, closed, outside a restaurant. The man holding it stood in the rain for an hour.',
        letter: {
            body: 'I was inside at eight. He was not. I ate the bread, and his bread, and went home.',
            signature: 'A date, formerly',
        },
    },
    18: {
        headline:
            'Neckass explained the plot of a film to the person who recommended it',
        deck: 'They recommended it Tuesday. He explained it to them Thursday, in full, including the end.',
        byline: 'Staff report',
        pose: 'explaining',
        scene: ['tv'],
        correction:
            'The ending he explained was the ending of a different film.',
        followUp:
            'The person who recommended the film watched the one Neckass had described by mistake, liked it better, and told him, and he said that was the one he had been recommending all along.',
        classified:
            'SEEKING: the person who recommended the film. He would like to explain it to you.',
        letter: {
            body: 'I recommended the film. He explained it back to me on Thursday. He got the ending wrong and I did not say.',
            signature: 'The person who recommended it',
        },
    },
    19: {
        headline:
            'Neckass has left a message on “seen” for eleven days so that he can give it a real reply',
        deck: 'The message asked whether he was coming Saturday. He read it on the 3rd. Saturday was the 6th. He wants to sit down and really reply.',
        byline: 'Staff report',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'His phone says he read the message on the 3rd. He says he “saw it but didn’t see it.”',
        followUp: 'The reply is “Sorry, just seeing this!” It is the 14th.',
        classified:
            'SEEKING: a minute to sit down and really reply. Owner has been meaning to since the 3rd.',
        letter: {
            body: 'I asked him on the 3rd whether he was coming Saturday. He sat next to me at dinner on the 5th and asked what I was doing Saturday. I said “your message.” He said he would get to it.',
            signature: 'A friend',
        },
    },
    20: {
        headline:
            'Neckass has been carrying a package to the post office in his car since March',
        deck: 'It is on the passenger seat. Asked about it, he said “I know, I know.” He does know.',
        byline: 'Staff report',
        pose: 'shrug',
        scene: ['parcel'],
        correction:
            'The package has been in the car since March and through two car washes.',
        followUp:
            'Neckass drove past the post office with the package on the seat. The post office was open, the post office confirmed. “Next time,” he said.',
        classified:
            'FOUND: package addressed to the post office, on a passenger seat.',
        letter: {
            body: 'The package on his passenger seat is mine. It has been to the post office sixty times without going in.',
            signature: 'His sister',
        },
    },
    21: {
        headline:
            'Neckass told the group he was “already on the train.” He was in the shower.',
        deck: 'The train left at 8:04. He was in the shower at 8:04, his roommate said. He arrived at 9:40.',
        byline: 'His roommate contributed to this report',
        pose: 'phone',
        scene: ['phone', 'shower'],
        correction:
            'Neckass arrived at 9:40 and said “the trains.” It was not the trains.',
        followUp:
            'Asked to send a photo next time he is “on the train,” Neckass sent one of the shower.',
        classified:
            'PERSONAL: to the man who was already on the train — we saw you at the station at 9:40.',
        letter: {
            body: 'He said he was on the train. I was on the train. He was not on the train. I have the photograph.',
            signature: 'A commuter',
        },
    },
    22: {
        headline:
            'Neckass asked the group to pick a restaurant and rejected all six',
        deck: 'He asked at noon, and six were proposed. At seven he suggested the first one.',
        byline: 'From wire reports',
        pose: 'considering',
        scene: ['phone'],
        correction:
            'Seven restaurants were proposed, not six. He proposed the seventh himself, at four, and rejected it at five.',
        followUp:
            'The group ate at the first restaurant. Neckass reviewed it as “fine, but I’d have gone somewhere else.”',
        classified:
            'SEEKING: restaurant suggestions, for a group of six. Will reject all of them and choose the first.',
        letter: {
            body: 'I suggested the first restaurant at noon, and he said no. At seven he suggested it to me as his own idea. We went, and it was fine.',
            signature: 'A friend',
        },
    },
    23: {
        headline: 'Neckass’s smoke alarm has been chirping for nine days',
        deck: 'It needs a battery. He describes the chirping as “on and off.” It is on.',
        byline: 'Staff report',
        pose: 'explaining',
        scene: ['smoke'],
        correction:
            'The smoke alarm chirps once a minute, not “on and off,” as he told the Gazette. He has moved his bed to the other room and describes the problem as solved.',
        followUp:
            'A battery for the smoke alarm is on the counter. The alarm is in the other room, chirping.',
        classified:
            'NOTICE: the chirping at No. 12 is a smoke alarm. It is not a bird, as its owner has told three of us.',
        letter: {
            body: 'My smoke alarm is not chirping. His is, and he has knocked twice to ask about mine.',
            signature: 'Next door',
        },
    },
    24: {
        headline: 'Neckass requested $3 on Cash App from a friend he owes $40',
        deck: 'The note on the request says “gas,” according to a screenshot provided to the Gazette. The friend was driving. The $40 has been owed since the Fourth of July.',
        byline: 'Staff report',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'We reported the request was for $3. It was $3.50, and the note says “gas + tip.”',
        followUp: 'Neckass paid back $5 of the $40, with the note “we even?”',
        classified:
            'SEEKING: $40, owed since July 4. Will accept payment in any form except a request.',
        letter: {
            body: 'He owes me $40. On Tuesday I got a request from him for $3, “gas,” from the passenger seat while I was driving. It was my gas.',
            signature: 'A friend, $40 down',
        },
    },
    25: {
        headline:
            'Neckass has been to the same coffee shop 300 times and does not know the staff’s names',
        deck: 'They know his order and his name, the owner said. He calls all three of them “chief.”',
        byline: 'Staff report',
        pose: 'leaving',
        scene: ['cup'],
        correction:
            'Four staff, not three: he calls the fourth “boss,” and she owns the café.',
        followUp:
            'Told the barista’s name is Kai, Neckass said “thanks, chief.”',
        classified:
            'NOTICE: we at the coffee shop wish to inform the gentleman that we are not all called chief.',
        letter: {
            body: 'He calls me chief. I am wearing a badge that says Kai.',
            signature: 'The barista',
        },
    },
    26: {
        headline: 'Neckass has moved one task to tomorrow forty times',
        deck: 'The task is to call his mother, which takes ten minutes, according to his mother. He describes it as “a whole thing.”',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['phone'],
        correction:
            'Forty-one times, not forty: he moved it again while reading the item.',
        followUp:
            'He called his mother, and it took nine minutes. “Not that bad, actually,” he said, and moved next week’s call to the week after.',
        classified:
            'REMINDER: call your mother. This notice was placed by her.',
        letter: {
            body: 'I am his mother. He has moved calling me to tomorrow since July. I read this paper to find out how he is.',
            signature: 'His mother',
        },
    },
    27: {
        headline: 'Neckass assembled the shelf and has four screws left',
        deck: 'The instructions account for every screw. The shelf is up as of press time. Asked about the screws, he said he was “not going to think about it.”',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['shelf'],
        correction:
            'Six screws were left over, not four. The shelf came down Sunday with the books on it. No one was hurt.',
        followUp:
            'The shelf is back up. Of the six screws, four are left over.',
        classified:
            'LOST: four screws. The shelf is up. Do not tell the owner.',
        letter: {
            body: 'The shelf is over my bed. He says the screws are spares. I have asked what they are spares for.',
            signature: 'His roommate',
        },
    },
    28: {
        headline:
            'Neckass agreed with both sides of an argument about where to park',
        deck: 'His sister said the lot. Her husband said the street. He said “absolutely” to each, and, asked to choose, said “I think you’re both saying the same thing.” They were not.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'It was her boyfriend, not her husband. He was agreed with twice.',
        followUp:
            'Asked which of the two he agreed with, Neckass said “both had a point.” Both have stopped speaking to him.',
        classified:
            'SERVICES: will agree with both of you. Rates negotiable, and I will agree to yours.',
        letter: {
            body: 'He agreed with me, and then with the other side, in the same minute. We have stopped arguing and are both annoyed with him. The car was running the whole time.',
            signature: 'His sister',
        },
    },
    29: {
        headline:
            'Neckass sent a nine-minute voice note to say he was running late',
        deck: 'He sent it at 7:50 from the car. The Gazette has listened to it in full, at double speed. It does not say how late.',
        byline: 'Staff report, at double speed',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'The voice note was nine minutes plus a second note, saying “sorry, long one.”',
        followUp:
            'Asked to text next time, Neckass sent a voice note to say he would.',
        classified:
            'FOUND: a voice note, nine minutes. Contains no time of arrival. Owner can claim it by text.',
        letter: {
            body: 'I listened to the whole thing to find out when he would get here. It does not say. He arrived during it.',
            signature: 'A friend',
        },
    },
    30: {
        headline: 'Neckass’s phone has been at one percent since this morning',
        deck: 'He has been told three times, and has said “it’s fine, it lasts” three times. Attempts to reach him after 4 p.m. were unsuccessful.',
        byline: 'From wire reports',
        pose: 'phone',
        scene: ['phone'],
        correction: 'The phone died during the conversation about the charger.',
        followUp:
            'Neckass charged the phone to 100 percent overnight and has spent the day at 100, saying he does not want to use it up.',
        classified:
            'LOST: a phone at one percent. It is somewhere in the house and it is now at zero.',
        letter: {
            body: 'His phone has been at one percent since breakfast. He has borrowed my charger and left it at his house.',
            signature: 'His brother',
        },
    },
    31: {
        headline: 'Neckass recommended a dentist he has never been to',
        deck: 'He recommended her to four people, at length, by first name. Asked whether he had been, he said he had “driven past the sign.”',
        byline: 'From wire reports',
        pose: 'pointing',
        correction:
            'He had driven past a different dentist with a similar sign.',
        followUp:
            'Neckass went to the dentist he recommended, for a cleaning, and has since recommended a different one.',
        classified:
            'WANTED: a review of this practice from someone who has been in the chair. — The dentist',
        letter: {
            body: 'He has recommended my practice to four people. He has never been in. Two of them have, and asked after him by name, and I did not know who they meant.',
            signature: 'A dentist',
        },
    },
    32: {
        headline:
            'Neckass has started a sentence with “no offense” nine times this week',
        deck: 'Offense was taken on eight occasions. The ninth person had already left.',
        byline: 'Staff report',
        pose: 'defense',
        correction:
            'Ten times, not nine. The tenth was “no offense, but” to a waiter, followed by an order.',
        followUp:
            'The eleventh “no offense” went to the Gazette, about the item.',
        classified:
            'SEEKING: anyone who has heard Neckass finish a sentence beginning “no offense.”',
        letter: {
            body: 'He has said “no offense” to me twice this week. There was offense on both occasions.',
            signature: 'Name withheld',
        },
    },
    33: {
        headline: 'Neckass has been holding a door for someone forty feet away',
        deck: 'They were not walking toward the door. They are now, because he is holding it.',
        byline: 'Staff report',
        pose: 'standingBy',
        scene: ['doorway'],
        correction:
            'We reported that the person was forty feet away. They were sixty, by their own account, and jogged the last forty, and thanked him.',
        followUp:
            'The person who jogged to the door has written in. It was the wrong building.',
        classified:
            'SERVICES: will hold a door for you from forty feet. Please run.',
        letter: {
            body: 'He held the door for me. I was not going to the door. I went to the door.',
            signature: 'A pedestrian',
        },
    },
    34: {
        headline: 'Neckass cleaned around the object rather than move it',
        deck: 'The object, identified by the Gazette as a shoe, has been in the middle of the floor for five weeks. The floor around it is clean.',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['shoe'],
        correction: 'Two shoes, not a shoe, and they do not match.',
        followUp:
            'The shoes are now in the hall, in the middle of the floor, and the hall is clean around them.',
        classified:
            'FOUND: one shoe, middle of a floor. Owner has cleaned around it for five weeks.',
        letter: {
            body: 'The shoe has been there five weeks. I moved it, to see, and he moved it back.',
            signature: 'His roommate',
        },
    },
    35: {
        headline:
            'Neckass told the barber “just a little off” and has worn a hat since',
        deck: 'The barber took a little off, by the barber’s account. Neckass said “that’s great” in the chair, “yeah, no, great” at the register, and bought the hat on the way home.',
        byline: 'Staff report',
        pose: 'satisfied',
        correction:
            '“That’s great” was said three times, not twice. The third was to the mirror, and quieter.',
        followUp:
            'Neckass went back to the barber with a photograph of himself from before the haircut and asked for “this.”',
        classified: 'WANTED: a barber prepared to ignore “just a little off.”',
        letter: {
            body: 'I am the barber. He said “just a little off,” so I took a little off. He has not looked in the mirror in my presence since.',
            signature: 'The barber',
        },
    },
    36: {
        headline:
            'Neckass replied “haha” to a message asking him to call urgently',
        deck: 'The message said his car had been towed. He called four hours later, after a second message, and said he had read it as a bit.',
        byline: 'Staff report',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'The four-hour delay included a second “haha,” before the call.',
        followUp:
            'Asked why he replied “haha,” Neckass said he thought it was a joke. Asked what the joke was, he said “the urgency.”',
        classified:
            'WANTED: anyone who can tell “haha” from “I will call you.”',
        letter: {
            body: 'I texted him to call me urgently. He replied “haha.” He called four hours later to ask what was funny. It was his car.',
            signature: 'His sister',
        },
    },
    37: {
        headline: 'Neckass reneged in spades and blamed his partner',
        deck: 'He cut with a spade while holding the queen of hearts. The table caught it on the next trick. He asked his partner why she led a heart.',
        byline: 'Staff report',
        pose: 'pointing',
        scene: ['table'],
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
    38: {
        headline:
            'Neckass brought store-bought potato salad to the cookout in a bowl from home',
        deck: 'He took the lid off at the curb, tipped the salad into his mother’s bowl, and added paprika. He told four people it was his recipe. The receipt was in the bag.',
        byline: 'Staff report',
        pose: 'defense',
        scene: ['table'],
        correction:
            'We reported that Neckass added paprika. He added raisins. Nobody has eaten it.',
        followUp:
            'Neckass has been asked to bring ice to the next cookout. He has asked what kind.',
        classified:
            'FOUND: a bowl of potato salad, untouched, at Saturday’s cookout. The bowl belongs to his mother, who would like it back. The potato salad can stay.',
        letter: {
            body: 'I am his auntie. I know every potato salad in this family by sight. That one came from the store, and he looked me in my face.',
            signature: 'His auntie',
        },
    },
    39: {
        headline:
            'Neckass told a joke to a table that heard it from him, at the same table, the week before',
        deck: 'He said “stop me if you’ve heard this.” Four people said they had. He did not stop.',
        byline: 'Staff report',
        pose: 'explaining',
        scene: ['table'],
        correction:
            'Five people said they had heard it, not four. The fifth said so at the end.',
        followUp:
            'The joke went a third time to the waiter, who had also heard it. He works there.',
        classified:
            'SEEKING: a table that has not heard the one about the parrot. Will travel.',
        letter: {
            body: 'I was at the table when he said “stop me if you’ve heard this,” and we tried. There is no stopping it. It is a joke about a parrot. I have heard it six times and do not know how it ends.',
            signature: 'A dinner guest',
        },
    },
    40: {
        headline:
            'Neckass turned the heat on “just for an hour” in October. It is still on.',
        deck: 'It has been on since the first cold evening. He will “deal with it this weekend.” He has said so every weekend since.',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'The heat was on before the first cold evening. He was “testing it.”',
        followUp:
            'The heat was turned off, a window opened “to freshen up,” and the heat turned back on.',
        classified: 'FOR SALE: a thermostat. Works. Owner has set it once.',
        letter: {
            body: 'The heat has been on since October and I have slept with the window open since November. We have not discussed it, except in the note he taped to the thermostat, which says “set, do not touch.”',
            signature: 'His roommate',
        },
    },
    41: {
        headline:
            'Neckass has described a nap as “resting his eyes” for the fourth time this week',
        deck: 'He rested his eyes from two until 3:45, under a blanket, and woke saying he was listening.',
        byline: 'Staff report',
        pose: 'resting',
        scene: ['couch'],
        correction:
            'He was woken at 3:45 by the end of the show he was listening to.',
        followUp:
            'He rested his eyes again while the item about resting his eyes was being read to him.',
        classified:
            'LOST: an afternoon. Last seen under a blanket. Owner says he was listening.',
        letter: {
            body: 'He rested his eyes through my presentation and asked the first question, which was whether I could go back a slide. It was a speech. There were no slides.',
            signature: 'A colleague',
        },
    },
    42: {
        headline:
            'Neckass said “I’ll let you go” to a caller who was trying to go',
        deck: 'The caller said they had to go at 6:10. Neckass let them go at 6:50, after letting them go twice more.',
        byline: 'From wire reports',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'The caller was let go at 6:50 on the third “I’ll let you go.” The call ended at 7:05.',
        followUp:
            'Neckass called back the next morning to check the caller had gotten off all right, and let them go at 9:40, on the fourth try.',
        classified:
            'WANTED: a way off the phone with a man who says “anyway.” We have tried “anyway.”',
        letter: {
            body: 'He called to let me go. I had not called him. I was in the yard, and it was forty minutes.',
            signature: 'His mother',
        },
    },
    43: {
        headline:
            'Neckass took the aux and has played the first thirty seconds of eleven songs',
        deck: 'He asked for the aux at 9:40 and said he had “a vibe.” He skipped every song he chose, including one he said was “about to go crazy.” It did not go.',
        byline: 'From wire reports',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'We said eleven songs. It was twelve, and the twelfth was a voice note he played by accident, to the whole car.',
        followUp:
            'Neckass has been given the aux back on the condition that he does not touch it. He has asked if he can queue.',
        classified:
            'WANTED: someone to hold the aux at Saturday’s function. Neckass is attending.',
        letter: {
            body: 'It was my car. He asked for the aux for one song, played the start of eleven, and said “wait, wait, this one.” We arrived during the eighth. He stayed in the car to finish choosing.',
            signature: 'The driver',
        },
    },
    44: {
        headline:
            'Neckass gave directions to a driver who was already on the right road',
        deck: 'The driver asked if this was the highway. It was. Neckass said “you want to go back the way you came and take the second left.” The driver did.',
        byline: 'From wire reports',
        pose: 'pointing',
        scene: ['signpost'],
        correction:
            'There is no second left. The driver took the first and has written in.',
        followUp:
            'Told that the driver had found the highway, which they had been on all along, Neckass said “well, they got there.”',
        classified:
            'WANTED: the driver who was on the highway on Tuesday. You were on the highway. We are sorry.',
        letter: {
            body: 'I was the driver, on the highway, and I know that now. He pointed twice and said “trust me.” It took an hour.',
            signature: 'A visitor, since gone',
        },
    },
    45: {
        headline: 'Neckass replied “maybe” to an event he is hosting',
        deck: 'The invitation went out from his account Monday. He responded Tuesday. The host is listed as “maybe.”',
        byline: 'Staff report',
        pose: 'shrug',
        correction:
            'The reply of “maybe” has since been changed to “going,” then back.',
        followUp:
            'The event is Saturday. The host has asked the group what time it starts.',
        classified:
            'PERSONAL: to the guests of Saturday’s event — the host will be there. Probably. He has said maybe.',
        letter: {
            body: 'I am going to his thing on Saturday. I said yes, and he said maybe. It is at his house. I asked whether I should bring anything, and he said “good question.”',
            signature: 'A guest, so far',
        },
    },
    46: {
        headline: 'Neckass explained 2K to the person who owns the console',
        deck: 'His cousin has played it every night since 2019. Neckass had played once, on Tuesday, and lost by 40. He explained for eleven minutes and got the buttons wrong.',
        byline: 'From wire reports',
        pose: 'explaining',
        scene: ['tv'],
        correction:
            'We said he got the buttons wrong. He got the buttons wrong and held the controller upside down.',
        followUp:
            'Neckass played a second game, on his own settings, and lost by 52. He has said the controller “has a delay.”',
        classified:
            'FOR SALE: second controller, lightly used, blamed for two losses.',
        letter: {
            body: 'It is my console. I have played since I was nine. He picked up the controller, explained the game to me for eleven minutes, and asked if I had “got it.” Then he lost by 40 on rookie.',
            signature: 'His cousin',
        },
    },
    47: {
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
            'FOUND: 340 receipts. None for a lamp. Owner will not throw them away “just in case.”',
        letter: {
            body: 'He asked me to help find the receipt. We went through the drawer. I now know what he spent on lunch in 2022. The lamp receipt is not in the drawer.',
            signature: 'A colleague',
        },
    },
    48: {
        headline:
            'Neckass left a voicemail that says “it’s me, call me back” and no name',
        deck: 'It was left at 7:40 a.m. The recipient, who asked not to be named because whoever it is might call back, has four people it could be. She has called two.',
        byline: 'Staff report',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'The voicemail was left at 7:40 and again at 7:42, to say “sorry, it’s me.”',
        followUp:
            'The wrong man called back. They spoke for twenty minutes, about what neither will say.',
        classified:
            'WANTED: “me.” Left a voicemail Tuesday, 7:40. Please call the office and say who you are. Do not say “it’s me.”',
        letter: {
            body: 'I got the voicemail. I have four people it could be, and I called two. It was neither. I have decided it can wait, which is what he decided about my message in March.',
            signature: 'A friend, on her fifth call',
        },
    },
    49: {
        headline:
            'Neckass has watched the first ten minutes of a film four times and calls it “good so far”',
        deck: 'He starts it after dinner and is asleep by the title card. He has seen the title card four times and says it “really gets going.”',
        byline: 'Staff report',
        pose: 'resting',
        scene: ['tv', 'couch'],
        correction:
            'He is asleep before the title card. He has seen the studio logo four times.',
        followUp:
            'The film was watched to the end. He called the ending “kind of sudden,” having seen the first ten minutes and the last.',
        classified: 'FOR SALE: a film. Seen the start of. Very good start.',
        letter: {
            body: 'I recommended the film. He has told me it is “good so far” three times in two months. It is 94 minutes long, and I have stopped asking.',
            signature: 'A former friend',
        },
    },
    50: {
        headline:
            'Neckass apologized for being late by explaining that he was not late',
        deck: 'He arrived at 2:25 for two, said “sorry, but actually,” and set out why the meeting was at 2:30. According to the invitation, it was at two.',
        byline: 'From wire reports',
        pose: 'defense',
        scene: ['clock'],
        correction:
            'He was in the building at 2:25 and in the room at 2:31, with a coffee.',
        followUp:
            'Tuesday’s meeting was moved to 2:30 at his request, so that he is “not late again.” It is a different meeting.',
        classified:
            'NOTICE: the two o’clock is at two. This is not a change. This is a notice.',
        letter: {
            body: 'I was chairing. He told us the meeting was at 2:30 and showed us his calendar to prove it. It said two.',
            signature: 'The chair',
        },
    },
    51: {
        headline:
            'Neckass said “we should do this more often” to people he canceled on twice',
        deck: 'The dinner was the third attempt; he canceled the first two the day of. He said it at the end, twice. He has not proposed a date.',
        byline: 'Staff report',
        pose: 'leaving',
        correction:
            'The second dinner was canceled at the restaurant, by text, from the parking lot. The first was canceled the day of.',
        followUp:
            'Neckass proposed a date for the next dinner, the one night he knew the others could not do, and said “well, we tried.”',
        classified:
            'WANTED: three people free on a Friday. Fourth will confirm the day of, and may not.',
        letter: {
            body: 'He canceled twice, came the third time, and told us at the end that we should do this more often. We have done it three times. He was at one.',
            signature: 'A former neighbor',
        },
    },
    52: {
        headline:
            'Neckass took a “quick look” at a colleague’s spreadsheet and broke it',
        deck: 'He was asked to check one figure. He sorted one column. Recovery efforts continued Tuesday. The column is no longer attached to its rows.',
        byline: 'From wire reports',
        pose: 'defense',
        scene: ['desk'],
        correction:
            'He sorted one column, undid it, and sorted a different column. The first is still sorted.',
        followUp:
            'The colleague has said the spreadsheet is fine. People familiar with the spreadsheet said it is not. It is being rebuilt from a printout.',
        classified:
            'NOTICE FROM IT: the spreadsheet is not “corrupted.” It has been sorted. Please stop sending it to us.',
        letter: {
            body: 'I asked him to check one number. He said “quick look.” I have Tuesday’s printout, Tuesday’s number, and him saying “it should be fine.”',
            signature: 'The owner of the spreadsheet',
        },
    },
    53: {
        headline:
            'Neckass told a date he is emotionally unavailable and was available to discuss it for three hours',
        deck: 'It was to be one drink, by her account. He covered his mother, his “patterns” and the anxious-avoidant cycle, with a diagram, on a napkin. He asked her one question, which was whether she needed a minute.',
        byline: 'From wire reports',
        pose: 'explaining',
        scene: ['table'],
        correction:
            'Three hours and ten minutes. The last ten were in the lot, on how he does not really do closure.',
        followUp:
            'Neckass wrote to the date to say he is “not in a place for anything serious.” She had not written. He has offered a call to talk it through.',
        classified:
            'PERSONAL: to the woman who has the napkin — he would like it back. It is his only copy.',
        letter: {
            body: 'I said I had to get up early. He said that was a very common defense and drew an arrow to it.',
            signature: 'A date, one drink',
        },
    },
    54: {
        headline:
            'Neckass spent $400 on a ring that told him he feels bad when he sleeps four hours',
        deck: 'He slept four hours Monday, by its count, and woke to a readiness score of 38. He told the Gazette this was “a really useful insight” and stayed up that night reading about it.',
        byline: 'Staff report',
        pose: 'resting',
        scene: ['alarm'],
        correction:
            'The ring was $349, plus $6 a month for the part that tells him.',
        followUp:
            'Neckass took the ring off for a night and said he felt great. He said he has no data to support this and is discounting it.',
        classified:
            'SERVICES: will tell you that you look tired. $5. No subscription.',
        letter: {
            body: 'I said he looked tired. He told me not to guess and held up his hand. It was a 38. I have been telling him he looks tired for twenty years and nobody has paid me $400.',
            signature: 'His sister',
        },
    },
    55: {
        headline:
            'Neckass says good managers leave young employees unprepared, and has offered to be a bad one',
        deck: 'He had a terrible boss in 2014, he told a leadership offsite, and it made him who he is. HR has put him in charge of two new hires. He has scheduled his first one-on-ones for Sunday.',
        byline: 'Staff report',
        pose: 'explaining',
        scene: ['easel'],
        correction:
            'We described Neckass’s boss of 2014 as terrible, on his word. She has written in. She gave him Fridays off for a month, and he calls this “the mind games.”',
        followUp:
            'Neckass has started a workshop, “Surviving Your Manager,” at $299. He is the manager.',
        classified:
            'NOTICE FROM HR: one-on-ones are not to be held on Sundays unless both parties agree. Neckass has asked whether you agree.',
        letter: {
            body: 'I am in the Foundations Track. He told me it would be hard and that someday I would thank him. I asked what for. He said it had not started.',
            signature: 'The second new hire',
        },
    },
    56: {
        headline:
            'Neckass ended a 1,700-word LinkedIn post, which contains no question, with “Thoughts?”',
        deck: 'The post, about a flat tire, draws five lessons in leadership from it. It has drawn three comments. Two are from bots. The third is from his mother, who asked whether the car was OK.',
        byline: 'His mother contributed to this report',
        pose: 'satisfied',
        scene: ['phone'],
        correction:
            'Six lessons, not five. The sixth is “always carry a spare.” He did not have a spare.',
        followUp:
            'Neckass replied to his mother’s comment, which asked whether the car was OK, with “Love this perspective.”',
        classified:
            'FOR SALE: one tire, flat. It has taught its owner about leadership. Lessons included.',
        letter: {
            body: 'I changed the tire. He stood on the shoulder, typing. I am in the post as “a stranger who reminded me what servant leadership looks like.” I am his sister.',
            signature: 'His sister, on the shoulder',
        },
    },
    57: {
        headline:
            'Neckass was named chair of the Committee on Removing Obstacles. It has not met since.',
        deck: 'HR said it wanted someone who knows them. His first recommendation, made before the first meeting, is that anyone asking to have an obstacle removed first show that they understand the existing forms.',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['easel'],
        correction:
            'We reported that the committee has not met. It met once, by email, to agree on how it would meet.',
        followUp:
            'The Committee on Removing Obstacles has published its form for reporting an obstacle. It is eleven pages, and the second page asks whether you have tried going around.',
        classified:
            'NOTICE FROM THE COMMITTEE ON REMOVING OBSTACLES: obstacles may be submitted in person, before 7 a.m., by anyone who has held the certificate for four years.',
        letter: {
            body: 'I am on the committee. I asked when we would meet. He said that before we could meet I would need the certificate. I asked what it is a certificate in. He said that was covered in the first year.',
            signature: 'A member of the committee',
        },
    },
    58: {
        headline:
            'Neckass won his seventh insurance appeal and says the system rewards persistence',
        deck: 'Each was for something his doctor had ordered. He has a binder, and has logged sixty-one hours on hold. He told a colleague who was crying in the lot that “you just have to know how to talk to them.”',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'Six appeals, not seven. He dropped the seventh when the knee got better on its own, and counts it.',
        followUp:
            'An eighth denial arrived Tuesday. Neckass has called it “a leadership opportunity” and has bought a second binder.',
        classified:
            'SERVICES: insurance appeals coached. You will need a binder, free mornings, and not to be that sick.',
        letter: {
            body: 'I showed him the denial for my daughter’s inhaler. He said it was “honestly a gift,” and that in a few years I would be glad of the binder. She is nine. She would like the inhaler.',
            signature: 'A colleague, in the lot',
        },
    },
    59: {
        headline:
            'Neckass labeled his lunch in the office fridge and ate someone else’s',
        deck: 'His label reads “DO NOT TOUCH,” according to a photograph posted in the kitchen. His lunch is still in the fridge. The one he ate was labeled “please, not again.”',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['fridge'],
        correction:
            'His label reads “DO NOT TOUCH (N.),” not “DO NOT TOUCH.” He has since added the date.',
        followUp:
            'His lunch has been in the office fridge for eight days. Facilities threw it out Friday, and he has asked who ate it.',
        classified:
            'NOTICE FROM THE KITCHEN: the fridge is cleared Fridays. A label does not exempt a lunch, and neither do capitals.',
        letter: {
            body: 'It was my lunch. It was labeled. It was the second time. He told me it was “really good,” and asked what was in the dressing.',
            signature: 'The other label',
        },
    },
    60: {
        headline:
            'Neckass invited twelve people to celebrate a new job title, at a table for eight',
        deck: 'The title is Senior Associate. The job is the one he had, at the same desk and the same pay, according to a person familiar with the desk. He has said four of the twelve “won’t come anyway.”',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['table'],
        correction:
            'The table seats ten, not eight. He is two over, and has asked whether anyone minds standing.',
        followUp:
            'Eleven came. Neckass toasted the title and asked the table to split the bill eleven ways.',
        classified:
            'WANTED: four chairs, Saturday, for a celebration. The guest of honor will be sitting.',
        letter: {
            body: 'I sit next to him. He is Senior Associate now. He has changed his email signature, his voicemail and the nameplate on his desk, and I have seen his work, and it is the same.',
            signature: 'A colleague, Associate',
        },
    },
    61: {
        headline:
            'Neckass overcame adversity and was furious to learn it was not a prerequisite',
        deck: 'The adversity was four years of night classes for a certificate the job required. It has not required it since 2018, HR said. A colleague, 26, started Monday without one, and Neckass has asked for the four years back.',
        byline: 'Staff report',
        pose: 'defense',
        scene: ['desk'],
        correction:
            'We reported that the job required the certificate until 2018. It never did. A line on an old form said “preferred.”',
        followUp:
            'Neckass asked HR to require the certificate of everyone, starting with the colleague, 26. HR asked what it is a certificate in. He has gone to look.',
        classified:
            'LOST: four years of evenings, 2012 to 2016. Owner has learned he did not need them and would like to speak to someone.',
        letter: {
            body: 'I did the same night classes he did, four years. I am glad I did them. I learned a lot. I am also the one who told HR they should stop asking for them. He has asked how I can be both. I told him it was not hard.',
            signature: 'A colleague, also certified',
        },
    },
    62: {
        headline:
            'Neckass texted the host of a party to ask her to turn the music down. He was at the party.',
        deck: 'He sent it at 11:40 from the bathroom, according to the host, who read it in the kitchen and turned the music down. He came out and asked why it had gone quiet.',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['phone'],
        correction:
            'He sent it from the hallway, not the bathroom. The bathroom was occupied, which he had also texted her about.',
        followUp:
            'Neckass has been invited to the host’s next party on the condition that he stay in one room. He has asked which.',
        classified:
            'WANTED: someone to turn the music back up at a party. The guest who asked for it down would like it up.',
        letter: {
            body: 'I was hosting. My phone said “can u turn it down a bit,” and I did, and he came out and said “where’d the music go?” He is the only guest who has my number.',
            signature: 'A host',
        },
    },
    63: {
        headline:
            'Neckass lost at checkers to his niece, 7, and has asked for best of seven',
        deck: 'He lost the first game in twelve moves and the second in nine, according to her mother, who keeps the score on the fridge. Between games he explained the rules to her.',
        byline: 'Scoring by her mother',
        pose: 'considering',
        scene: ['table'],
        correction: 'She is 7½, not 7. She asked that this be printed.',
        followUp:
            'The series stands at 4–0. Neckass has proposed that the next game “count double.”',
        classified:
            'WANTED: a checkers coach for an adult. Must be better than a second-grader. Several applicants are second-graders.',
        letter: {
            body: 'I keep the score on the fridge. She is up 2–0. He has asked to play “for real” now, and has started taking his pieces back to think.',
            signature: 'Her mother',
        },
    },
    64: {
        headline:
            'Neckass has used next door’s Wi-Fi since 2023 and called them to say it was slow',
        deck: 'He called at ten on Tuesday night to say it had been “going in and out” and asked them to restart it. The password is on their fridge, which he saw once, at a barbecue.',
        byline: 'From wire reports',
        pose: 'explaining',
        correction: 'He called at 10:20, not ten, having knocked first.',
        followUp:
            'Next door changed the Wi-Fi password. Neckass came over to ask for it and said the old one had been “more secure.”',
        classified:
            'NOTICE: the network called NEXTDOOR is not for public use. It is for next door.',
        letter: {
            body: 'Our Wi-Fi was called “next door,” which he said was “basically an invitation.” I have changed the name. He has found it.',
            signature: 'Next door',
        },
    },
    65: {
        headline:
            'Neckass knows which floorboards at No. 12 are rotten and says the house is perfectly safe',
        deck: 'There are nine between the door and the kitchen, by his count. He has told the landlord not to bother, and he asks guests to follow his footsteps exactly. He calls this “knowing the house.”',
        byline: 'Staff report',
        pose: 'pointing',
        scene: ['doorway'],
        correction:
            'Eleven boards, not nine. He found the tenth and eleventh on Tuesday, with his foot.',
        followUp:
            'A delivery driver went through the hall at No. 12 on Thursday, to the knee. Neckass said he had not followed the route, and has taped a map to the door.',
        classified:
            'NOTICE: visitors to No. 12 are asked to step where he steps. He will go first.',
        letter: {
            body: 'I asked him what happens when we have people over. He said we would have the right people. I live here, and I have been told I favor my left.',
            signature: 'His roommate',
        },
    },
    66: {
        headline:
            'Neckass has stopped trusting the media and gets his news from an AI summary of the media',
        deck: 'He told a table of six that he “goes straight to the source.” Asked to name it, he read one out. It opened “According to The Associated Press.”',
        byline: 'From wire reports',
        pose: 'explaining',
        scene: ['table'],
        correction:
            'It is a summary of a summary. He asked for the short version in March.',
        followUp:
            'Neckass’s summary covered this paper’s item about him in one line: “A newspaper wrote about a man.” He has called it “the first fair thing anyone has written.”',
        classified: 'WANTED: the rest of the story. Have three bullet points.',
        letter: {
            body: 'I wrote the story he read out at dinner. I was at the dinner. He told me I should read more widely, and then he read me my second paragraph, with a dot in front of it.',
            signature: 'A wire reporter',
        },
    },
    67: {
        headline: 'Neckass is “building in stealth.” He has not decided what.',
        deck: 'His profile has listed him as Founder, Stealth since 2021. Asked what the company does, he said he could not say. Asked whether he knew, he said that was “the stealth.”',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['easel'],
        correction:
            'We described the company as being in stealth. It has a newsletter, with 400 subscribers, who have been told nothing.',
        followUp:
            'Neckass announced that he is coming out of stealth. He has opened a waitlist, which does not say for what. There are nine on it. His mother is two of them.',
        classified:
            'WANTED: co-founder, for company in stealth. Applicant will be told what it does as soon as we know.',
        letter: {
            body: 'He asked me at a barbecue in 2022 whether I was “in,” and I said sure. I am a co-founder, according to the deck. I have asked to see the deck. I am told it is in stealth.',
            signature: 'A co-founder, apparently',
        },
    },
    68: {
        headline:
            'Neckass sent his AI notetaker to a meeting. Four other notetakers came, and no people.',
        deck: 'The meeting ran thirty minutes, according to its five sets of notes, each of which says the team is aligned. Neckass forwarded his to the group with “great discussion.”',
        byline: 'Compiled from five sets of notes',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'Five notetakers and one person. A man from facilities came about the blinds. He is recorded as owning next steps.',
        followUp:
            'The man from facilities has been sent the Q3 roadmap. He has replied that he came about the blinds, and all five notetakers have marked this as a risk.',
        classified:
            'FOR SALE: meeting notes, five sets, all in agreement. Nobody was there.',
        letter: {
            body: 'I organized the meeting, and I did not go either. I have read what I said, and I agree with it.',
            signature: 'The organizer',
        },
    },
    69: {
        headline:
            'Neckass has formed a personal board of directors and notified its members',
        deck: 'The board has five seats, he said, and meets quarterly. He has met four of the five. He sent a twenty-slide deck, “Q3: Me,” and asked for questions in advance.',
        byline: 'Four of his directors contributed to this report',
        pose: 'explaining',
        scene: ['easel'],
        correction:
            'Six seats, not five. The sixth is a man whose podcast he listens to, who has not been told.',
        followUp:
            'The personal board met Tuesday by video. Neckass was alone on the call and has recorded the vote as unanimous.',
        classified:
            'NOTICE: the annual meeting of the board of Neckass is Thursday. Members are reminded that they are on it.',
        letter: {
            body: 'I learned I was on his board from the agenda. I cut his hair. Item three is whether he should go shorter.',
            signature: 'The barber, director',
        },
    },
    70: {
        headline:
            'Neckass, staying the weekend with friends, gave their neighbor a tour of their house',
        deck: 'He showed her the kitchen, the “good bathroom” and the thermostat, which he said “runs warm.” The friends were out. She had come to return a dish.',
        byline: 'Staff report',
        pose: 'pointing',
        scene: ['doorway'],
        correction:
            'He did not only show her the thermostat. He turned it up, to show her how it runs.',
        followUp:
            'The friends came home to a house at 76 degrees and a note from their neighbor thanking them for the tour.',
        classified: 'WANTED: a houseguest who knows whose house it is.',
        letter: {
            body: 'I live next door to them. I brought back a dish and was shown the kitchen I had borrowed it from. He recommended the good bathroom. I have used it at their parties for six years.',
            signature: 'Their neighbor',
        },
    },
    71: {
        headline:
            'Neckass has asked that the new hire sit by the copier, as he did. There is no copier.',
        deck: 'It was taken out in 2022. He showed her where it was. “It’s how you learn,” he said. Asked what she would learn, he said “where it was.”',
        byline: 'Staff report',
        pose: 'pointing',
        scene: ['desk'],
        correction:
            'He sat by the copier for four months, not a year. He remembers a year.',
        followUp:
            'The new hire asked to move to an open desk. Neckass told HR she was “skipping steps.”',
        classified:
            'WANTED: copier, for a new hire to sit by. Need not work. The last one did not.',
        letter: {
            body: 'I started Monday. I am sitting where a copier used to be. There is a rectangle on the carpet. He comes by to ask whether I am getting anything out of it.',
            signature: 'The new hire',
        },
    },
    72: {
        headline:
            'Neckass is trying to live more intentionally and has been choosing a notes app since Tuesday',
        deck: 'He has compared seven, in a spreadsheet, on criteria including “vibes” and “export.” The one note he wants to keep says “live more intentionally.” It is on his hand, in pen.',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['phone'],
        correction:
            'Nine apps, not seven. He is paying for two of them, in case.',
        followUp:
            'Neckass settled on a notes app, moved his one note into it and began watching a video about a better one.',
        classified:
            'FREE: one note, exported seven times. Opens in none of them.',
        letter: {
            body: 'I asked what he was doing Saturday. He said he would have to check his system and that his system was down to four. I asked whether that was a yes. He said he would capture it.',
            signature: 'A friend',
        },
    },
    73: {
        headline:
            'Neckass built an AI agent to cancel the subscriptions he bought for his other AI agents',
        deck: 'He has six, by his count, at $214 a month. He described the new one, at $29, as “paying for itself.” Asked what the first six do, he said they “mostly talk to each other.”',
        byline: 'Staff report',
        pose: 'explaining',
        scene: ['desk'],
        correction:
            'Seven, not six, before the new one. The seventh watches the sixth. He cannot say what the first was for.',
        followUp:
            'The agent canceled itself Thursday, citing cost. Neckass has built an agent to find out why.',
        classified:
            'FOR SALE: six AI agents, one owner. Will need to ask them what they do.',
        letter: {
            body: 'I answer support at one of the companies. His agent has written nine times to cancel his account. Another of his agents has written nine times to renew it. They have been very cordial. I copied them on each other and went to lunch.',
            signature: 'Support, one of the companies',
        },
    },
    74: {
        headline:
            'Neckass watched a forty-second video about attachment styles and has diagnosed his mother',
        deck: 'He told her Sunday, by phone, that she is “avoidant.” She said she had to go, there was something on the stove. He said “and there it is.”',
        byline: 'Staff report',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'The video runs forty seconds. He watched it at double speed.',
        followUp:
            'Neckass called his mother to say he has forgiven her and that it is “not about her.” She has asked what for.',
        classified:
            'SERVICES: attachment styles identified by phone. Forty seconds. No follow-up.',
        letter: {
            body: 'I had to go because there was something on the stove. There is now something on the stove whenever he calls. I put it on first.',
            signature: 'His mother, avoidant',
        },
    },
    75: {
        headline: 'Neckass asked a friend to return his book. It is her book.',
        deck: 'He asked by text Monday, by voice note Tuesday and in person Wednesday, according to the friend, who showed him her name in the front. He said he had “lent it to her first.”',
        byline: 'Staff report',
        pose: 'defense',
        correction:
            'Her name is in the front in pen, not pencil. He had suggested it was pencil.',
        followUp:
            'The friend gave him the book to end it. Neckass has lent it to his cousin.',
        classified:
            'FOUND: a book with someone else’s name in the front. Finder says it is his.',
        letter: {
            body: 'It is my book. I bought it in 2019, and I have the receipt, which he asked to see, and read, and then asked how I could be sure.',
            signature: 'A friend, with the receipt',
        },
    },
    76: {
        headline:
            'Neckass, who does not use the park, has asked for proof it is being used properly',
        deck: 'He has nothing against the park, he said. He has watched it from his window since March and keeps a log, which shows that 40 percent of the use is sitting. He has asked what the sitting is for.',
        byline: 'From wire reports',
        pose: 'considering',
        correction:
            'Thirty-eight percent of the use is sitting, not 40. The log had counted the man on the bench twice.',
        followUp:
            'Neckass went to the park Saturday, to observe from closer in, and sat. He has logged it as “one instance, justified.”',
        classified: 'NOTICE: the bench is for sitting. This is not a finding.',
        letter: {
            body: 'I sit on that bench. I am 81 and have a new hip. A man I have never met has written to tell me I account for twelve percent of the sitting.',
            signature: 'The man on the bench',
        },
    },
    77: {
        headline: 'Neckass told his therapist she has made real progress',
        deck: 'He said so at the end of session fourteen, according to Neckass, who has told four people. He said she “really showed up” today. She asked how that felt, and he said “good question, stay with that.”',
        byline: 'Sourced to Neckass',
        pose: 'satisfied',
        correction:
            'It was session twelve, not fourteen. He has rounded up, he said, “to honor the journey.”',
        followUp:
            'Neckass told the Gazette he has finished with therapy. He said he got the words.',
        classified:
            'SEEKING: a therapist who can take feedback. The current one has been asked to sit with it.',
        letter: {
            body: 'I cannot confirm that he is a client. I can confirm that someone has left me five stars and the note “keep working on your listening.”',
            signature: 'A therapist',
        },
    },
    78: {
        headline:
            'Neckass audited his friendships and has notified the friends of the results',
        deck: 'The audit, which he calls “curating my circle,” scored fourteen people on “reciprocity” and “energy.” Four were let go, by email. He has asked one of them to help him move Saturday.',
        byline: 'Staff report',
        pose: 'pointing',
        scene: ['easel'],
        correction:
            'Five were let go, not four. The fifth was told in person, while driving him to the airport.',
        followUp:
            'A friend let go in the audit wrote back to say she thought they had stopped being friends in 2019. Neckass has sent her the exit survey.',
        classified:
            'WANTED: one friend, to replace four. High reciprocity. Must have a van.',
        letter: {
            body: 'I drove him to the emergency room in 2016. I got a three out of five on “shows up.” He attached the rubric and asked for my feedback on it.',
            signature: 'A friend, let go',
        },
    },
    79: {
        headline:
            'Asked to wash a pan, Neckass described the request as “unpaid emotional labor”',
        deck: 'The pan has been in the sink since Sunday, his roommate said. He said he would need time to “process the ask,” and sent an article, which is 4,000 words long and does not mention pans.',
        byline: 'His roommate contributed to this report',
        pose: 'defense',
        correction:
            'The article does mention a pan. It is in the comments, and the comment is his.',
        followUp:
            'Neckass washed the pan Thursday and sent his roommate a calendar invite to “debrief.”',
        classified:
            'FOR SALE: pan, soaking since Sunday. Owner says he is doing the work.',
        letter: {
            body: 'I asked him to wash a pan. He asked whether this was a good time for me to hear how that landed. I was holding the sponge out to him.',
            signature: 'His roommate',
        },
    },
    80: {
        headline:
            'Neckass gets to the airport six hours early and says it runs very well',
        deck: 'He has never missed a flight, he told the Gazette, and does not know what people are complaining about. He said this, at the gate, to a woman who was running.',
        byline: 'From wire reports',
        pose: 'standingBy',
        scene: ['clock'],
        correction:
            'Seven hours, not six. He allows an hour for the drive, which is twenty minutes.',
        followUp:
            'Neckass’s flight was canceled after a nine-hour delay. He said he had built that in.',
        classified:
            'SERVICES: will tell you that you should have left earlier. Available at most gates.',
        letter: {
            body: 'I work the counter. He gets here at six for the noon. He told me we run a tight ship. The noon has not left at noon since August. I told him, and he said “exactly.”',
            signature: 'The gate agent',
        },
    },
    81: {
        headline:
            'Neckass told a public meeting that the neighborhood is full. He arrived in 2021.',
        deck: 'The last person who should have been allowed to move in, he said, came in “about 2021.” He used his three minutes and asked for two more, on the neighborhood’s character, which he said was being lost.',
        byline: 'Staff report',
        pose: 'defense',
        scene: ['doorway'],
        correction:
            'We described Neckass as a homeowner, as he described himself to the meeting. He rents a room at No. 12.',
        followUp:
            'Neckass’s roommate asked whether a friend could stay for a week. Neckass said he would need to see a traffic study.',
        classified:
            'NOTICE: the neighborhood is full. Inquiries to the man who got here last.',
        letter: {
            body: 'I have been at No. 14 for forty-one years. He told the meeting the neighborhood has lost its character. The character is him.',
            signature: 'Next door',
        },
    },
    82: {
        headline:
            'Neckass warned the neighborhood app about a man at his door. It was him, locked out.',
        deck: 'The footage, posted at 11:40 p.m., shows a man in a hoodie trying the door at No. 12 and looking in a window. “Stay safe out there,” he wrote. He wrote it from inside, having come in the back.',
        byline: 'From wire reports',
        pose: 'defense',
        scene: ['phone', 'doorway'],
        correction:
            'The man in the footage does not only look in a window. He looks at the camera, and nods.',
        followUp:
            'A neighbor commented “isn’t that you?” Neckass replied that he could not speak to an active situation.',
        classified:
            'NOTICE FROM THE NEIGHBORHOOD APP: please do not report your own driveway. This is the third notice.',
        letter: {
            body: 'I replied that it looked like him. He replied that this was exactly the complacency that lets it happen. I had watched him go over the back fence with his phone in his teeth.',
            signature: 'Next door',
        },
    },
    83: {
        headline:
            'Neckass waved a car through a four-way stop for a minute and forty seconds. It was parked.',
        deck: 'He waved, nodded, waved again and flashed his lights, according to a pedestrian who timed it. The car, with nobody in it, was parked outside No. 14.',
        byline: 'A pedestrian contributed to this report',
        pose: 'leaving',
        correction:
            'A minute and fifty seconds, not forty. He waved once more after the pedestrian knocked on his window.',
        followUp:
            'Neckass told the group he had “let someone go first” this morning, and that people should do that more.',
        classified:
            'PERSONAL: to the man at the four-way stop on Tuesday — it was parked. You may go.',
        letter: {
            body: 'It is my car. It was parked. I watched from the window as he waved it through for nearly two minutes, and then he honked at it.',
            signature: 'Next door',
        },
    },
    84: {
        headline:
            'Neckass booked the group’s campsite for the right weekend of the wrong month',
        deck: 'Eight people drove three hours Friday, according to the group chat. The reservation is for the same weekend next month. He said he had “saved the spot.”',
        byline: 'Compiled from the group chat',
        pose: 'standingBy',
        scene: ['signpost'],
        correction:
            'Seven people drove Friday, not eight. He came Saturday morning, with the ice, and said the site looked “great for next month.”',
        followUp:
            'The group slept Friday in two cars and a tent for six. Neckass has asked who is in for next month.',
        classified:
            'FOR SALE: a campsite reservation for eight, next month. One careful owner.',
        letter: {
            body: 'I took the Friday off and drove three hours. The ranger showed us the date on his clipboard, and then on ours.',
            signature: 'A camper',
        },
    },
    85: {
        headline:
            'Neckass wrote a user manual for himself and asked colleagues to read it before speaking to him',
        deck: 'The document, “Working With Me,” a copy of which was obtained by the Gazette from the stack he left on the printer, is eleven pages. It has a section on feedback, which he prefers in writing, in advance and positive.',
        byline: 'Submitted in writing, in advance',
        pose: 'pointing',
        scene: ['desk'],
        correction: 'Twelve pages, not eleven. The twelfth is the changelog.',
        followUp:
            'A one-line document called “Working With Him” is going around the office. It does not have a changelog.',
        classified:
            'WANTED: someone to read eleven pages about the man at the next desk, and tell the rest of us.',
        letter: {
            body: 'I sit beside him. I was told to read the manual before speaking to him. I wanted to say his car was being towed. Section four says he is not at his best before ten.',
            signature: 'The desk beside him',
        },
    },
    86: {
        headline:
            'Neckass paid $38 for a workshop on consuming less, and bought the tote',
        deck: 'The workshop, “Enough,” ran two hours, with a merchandise table at the back. He left with the tote, the journal and a place in the follow-up course, which he has described as “a real step.”',
        byline: 'From wire reports',
        pose: 'satisfied',
        correction: 'Two totes, not one. The second is a spare.',
        followUp:
            'Neckass has signed up for the advanced workshop on consuming less, at $140, “to go deeper.”',
        classified:
            'NOTICE FROM THE WORKSHOP: “Enough” is sold out. A waitlist is available.',
        letter: {
            body: 'I run the workshop. I told the room they already have everything they need. He came up afterward and asked where to get the journal. I sold it to him. I have rent.',
            signature: 'The facilitator',
        },
    },
    87: {
        headline:
            'Neckass has begun referring to his opinions as “the outputs”',
        deck: 'He used the term Monday at dinner, about a restaurant, which he was in. He said the outputs were “directionally negative,” that he would “want to look at the inputs,” and ordered the chicken.',
        byline: 'Staff report',
        pose: 'explaining',
        scene: ['table'],
        correction:
            'He said “directionally negative, with low confidence.” He has asked us to print the confidence.',
        followUp:
            'Told by his sister that he had the route wrong, Neckass called it “a known limitation.” They are in a field.',
        classified:
            'NOTICE: Neckass has been deprecated from Saturday’s dinner. No migration path is planned.',
        letter: {
            body: 'I asked whether he had eaten. He said he had “limited visibility into that.” I am his mother. He was holding a plate.',
            signature: 'His mother',
        },
    },
    88: {
        headline:
            'Neckass took a call on speaker in the quiet car and asked the car to keep it down',
        deck: 'The call lasted twenty minutes, according to a passenger who timed it, and was about a parking space. When two people near him began to whisper, he covered the phone and said “guys.”',
        byline: 'From wire reports',
        pose: 'explaining',
        scene: ['phone'],
        correction:
            'Twenty-two minutes, not twenty. The last two were spent telling the caller he was “on a train, actually.”',
        followUp:
            'Neckass rode the quiet car again and took no calls. He watched a video with the sound on and said it was “only a short one.”',
        classified:
            'WANTED: earplugs, for the quiet car of the 5:52. Current ones are no match for a parking space.',
        letter: {
            body: 'I was in the quiet car. I now know where he parks, why the space is his, and that the other man “doesn’t even drive a real car.” He told us to keep it down twice.',
            signature: 'A commuter, quiet car',
        },
    },
    89: {
        headline:
            'Neckass collected $160 for a colleague’s birthday present. The birthday was Tuesday.',
        deck: 'Eight people gave $20 each, according to the envelope, which he has. The present, a knife set, is in his online cart, where he says it is waiting to go on sale.',
        byline: 'Staff report',
        pose: 'defense',
        scene: ['parcel'],
        correction:
            'Seven people gave $20, not eight. The eighth $20 was his, and he has since taken it back out of the envelope, “for shipping.”',
        followUp:
            'The knife set went on sale and was delivered to Neckass. He has asked the colleague whether she would like to “swing by for it.”',
        classified:
            'LOST: $20, given in an envelope for a birthday present. Owner would settle for the present, or the $20, or knowing which.',
        letter: {
            body: 'It was my birthday. I was given a card signed by eight people and a photograph of a knife set. He said the real one was “basically on its way.”',
            signature: 'The colleague with the birthday',
        },
    },
    90: {
        headline:
            'Neckass is concerned that younger colleagues will not develop the ulcer needed for management',
        deck: 'He worked eighty-hour weeks at his first job, he told a lunch, and “you can’t teach that.” He then took something for it. Asked whom he manages, he said that was not the point.',
        byline: 'Staff report',
        pose: 'explaining',
        scene: ['desk'],
        correction:
            'The eighty-hour weeks were one week, in 2012. He has the email.',
        followUp:
            'A colleague, 26, left at five on Thursday. Neckass stayed until 5:40, at his desk, with his coat on, and told four people what time it was.',
        classified:
            'WANTED: a young person to stay late, so that it can be said that someone did. Antacids provided.',
        letter: {
            body: 'I am 26. He told me he was worried about me because I sleep. I asked what he thought I was missing. He said I would know when my hand started.',
            signature: 'A colleague, 26',
        },
    },
    91: {
        headline:
            'Neckass was laid off and announced a “strategic transition into independent advisory”',
        deck: 'The post thanks his former employer for “an incredible chapter.” The firm, Neckass Advisory, works from his kitchen table and has no clients, by his account, because it is “being selective.”',
        byline: 'From a Neckass Advisory release',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'The firm has one client, not none. It is his cousin, who asked about a router and has been invoiced.',
        followUp:
            'Neckass went back to his old job Monday, at the same desk. He has announced it as “bringing my advisory practice in-house.”',
        classified:
            'SERVICES: independent advisory. Selective. Will also help you move.',
        letter: {
            body: 'I laid him off, with a box and a form. I read in his post that after much reflection he had decided to move on. He has asked me to endorse him for the reflection.',
            signature: 'His former manager',
        },
    },
    92: {
        headline:
            'Neckass used ChatGPT to write “I miss you too.” It came to four paragraphs.',
        deck: 'The prompt, in a log seen by the Gazette, was “say i miss you too but make it sound like me.” He turned down the first draft, “I miss you too,” as “a little thin.”',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['phone'],
        correction:
            'Four paragraphs and a subject line, not four paragraphs. It was a text.',
        followUp:
            'She wrote back “that doesn’t sound like you.” Neckass has asked it to write “I know.”',
        classified:
            'SERVICES: will read your texts and say whether they sound like you. Bring a sample from before.',
        letter: {
            body: 'I wrote “I miss you.” I got four paragraphs. I pasted them into mine and asked for the short version. It said “I miss you too.”',
            signature: 'The person he misses',
        },
    },
    93: {
        headline:
            'Neckass paid off his student loans and has asked that nobody else be let off',
        deck: 'He made the last payment in 2024, after fourteen years. He said forgiving anyone else’s would be unfair to him, and that they do not know what it takes. Asked what it takes, he said $38,000.',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'We reported that he made the last payment. His mother made it. He has said this does not affect the principle.',
        followUp:
            'Neckass had the last statement from his loan servicer framed. It is in the hall at No. 12, and guests have been asked to stand in front of it.',
        classified:
            'FOR SALE: my twenties. $38,000, no refunds, and none for you either.',
        letter: {
            body: 'I am 24 and owe $61,000. He told me at the printer that it would be the making of me. I asked what it had made him. He said I would see.',
            signature: 'A colleague, 24',
        },
    },
    94: {
        headline:
            'Neckass offered a friend a ride to the airport and asked to borrow her car for it',
        deck: 'He offered in the group chat at nine. At 9:15 he asked whether he could take her car, since his is “making the noise.” The flight is at six.',
        byline: 'Staff report',
        pose: 'pointing',
        correction:
            'The flight was at 6:15, not six. He has said the fifteen minutes “change everything.”',
        followUp:
            'Neckass sent the group a photograph from the departures curb with the caption “made it.” He was not flying.',
        classified:
            'WANTED: a ride to the airport, for a woman who was offered one.',
        letter: {
            body: 'He offered to drive me to the airport. Then he asked to borrow my car to do it. I said I could drive myself in it. He said “even better,” and asked if he could come.',
            signature: 'A friend, flying',
        },
    },
    95: {
        headline:
            'A colleague was promoted in two years. Neckass, who took nine, asked what is wrong with her.',
        deck: 'He has no complaint about her work, he said, and has read her reviews, which are good. He called them “a red flag.” He has asked management to explain why she was qualified.',
        byline: 'Staff report',
        pose: 'defense',
        scene: ['desk'],
        correction:
            'We reported that Neckass took nine years to be promoted. The promotion was to Senior Associate, at the same desk and the same pay.',
        followUp:
            'Neckass now reports to the colleague. He has asked whether she has considered sitting by the copier.',
        classified:
            'WANTED: a deficiency. Will pay for information. Must be hers.',
        letter: {
            body: 'I got promoted because I did the work. He asked me to describe my struggle. I said I take the bus. He wrote that down and underlined it.',
            signature: 'The colleague',
        },
    },
    96: {
        headline:
            'Neckass asked for a raise and brought thirty copies of the Gazette as evidence',
        deck: 'He said he was “covered daily” and that this showed demand, according to his manager, who read one.',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'His manager read two, not one. She asked to keep the second.',
        followUp:
            'His manager has answered about the raise. The answer is no, in one line, which Neckass has framed.',
        classified:
            'FOR SALE: thirty Gazettes, carried to a meeting and back. Some reading.',
        letter: {
            body: 'He put thirty newspapers on my desk and said “read any of them.” I read one. He was in it, and that was what I had wanted to talk to him about.',
            signature: 'His manager',
        },
    },
    97: {
        headline:
            'Neckass, who got out of a corn maze in 2019, opposes making it easier to get out',
        deck: 'The farm proposed signs after a family was in it past closing. He came to the meeting with his ticket stub and said signs would be disrespectful to everyone who found their way out. It is a maze for children.',
        byline: 'From wire reports',
        pose: 'defense',
        scene: ['signpost'],
        correction:
            'He did not find his way out. He was walked out at 7:40, by a teenager with a flashlight. He has asked that “found his way out” stand.',
        followUp:
            'The farm has put up the signs. Neckass was seen Sunday taking one down, and told the teenager with the flashlight that someone had to.',
        classified:
            'NOTICE FROM THE FARM: the maze closes at six. The man inside it is not staff.',
        letter: {
            body: 'I run the farm. It takes a 6-year-old about forty minutes. I have offered him his $6 back. He says it is not about the $6, which is the only part of this I understand.',
            signature: 'The farm',
        },
    },
    98: {
        headline:
            'Neckass carried the groceries in one trip and dropped the eggs on the step',
        deck: 'Ten bags, on two arms and a wrist, according to his roommate, who held the door. The eggs were on the wrist. No injuries were reported, apart from eleven eggs. He has said it “still counts as one trip.”',
        byline: 'Staff report',
        pose: 'standingBy',
        scene: ['doorway'],
        correction:
            'The eggs were in his teeth, not on the wrist. He dropped them to say “I’ve got it.”',
        followUp:
            'Neckass bought eggs again and carried them in on their own, on a second trip, which he made in the dark so that it would not count.',
        classified: 'FREE: a dozen eggs, on a step, as is.',
        letter: {
            body: 'I held the door. He said he had it, and he had it, until the step. I am still finding egg in the mat.',
            signature: 'His roommate',
        },
    },
    99: {
        headline:
            'Neckass posted a photograph of himself crying at 9 a.m. Tuesday, the best time for engagement',
        deck: 'He took it Sunday, according to the file, one of eleven. He chose the fourth, he said, for the light. The caption says he “debated sharing this.”',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['phone'],
        correction:
            'We printed the caption’s account of a debate. The post was queued nine days before he took the picture.',
        followUp:
            'The post reached 412 people. Neckass said the algorithm “punishes authenticity” and has rescheduled for Thursday, nearer the window.',
        classified:
            'LOST: authentic self. Last seen Tuesday at 9 a.m., which tests best.',
        letter: {
            body: 'I took the photograph. I was at his place about a router. He handed me the phone and started. He said “get the jaw.”',
            signature: 'His cousin',
        },
    },
    100: {
        headline:
            'Neckass told a meeting that nobody rides the bus, a finding he reached behind the bus',
        deck: 'He has been behind it most mornings since 2023 and could see no reason for it. He asked that it be taken off, along with the people getting off it, who he said hold up traffic.',
        byline: 'From wire reports',
        pose: 'explaining',
        scene: ['signpost'],
        correction:
            'He has ridden the bus once, in 2019, and got off when he found out that it stops.',
        followUp:
            'Neckass’s car is in the shop. He took the bus Monday and told the driver it was “a lot of people for a bus nobody rides.”',
        classified:
            'FOR SALE: bus pass, one ride, 2019. Owner has concluded his research.',
        letter: {
            body: 'I drive the bus. It has forty people on it at 8:10. He has been behind me since 2023, honking. I can see him in the mirror. I have told all forty of them about him.',
            signature: 'The bus driver',
        },
    },
    101: {
        headline:
            'Neckass asked ChatGPT to be brutally honest and regenerated the answer until it agreed',
        deck: 'It took eleven tries, according to the log, which he posted himself. The eleventh opens “You’re absolutely right.” He captioned it “finally, someone who won’t sugarcoat it.”',
        byline: 'Compiled from his own posts',
        pose: 'satisfied',
        scene: ['phone'],
        correction:
            'Fourteen tries, not eleven. He deleted three from the log, saying they had “hallucinated.”',
        followUp:
            'Neckass asked ChatGPT whether regenerating the answer fourteen times had been a mistake. He has regenerated the answer.',
        classified: 'SERVICES: brutal honesty. Unlimited revisions.',
        letter: {
            body: 'I told him the business would not work, and he said I was “anchored.” He ran it past something less biased. It called the plan “bold.” I do his taxes.',
            signature: 'His accountant',
        },
    },
    102: {
        headline:
            'Neckass bought a $300 phone that does less, to use his phone less, and carries both',
        deck: 'It makes calls and has no apps, according to the box, which he posted from the other phone. He calls it “a return to real connection.”',
        byline: 'From wire reports',
        pose: 'phone',
        scene: ['phone'],
        correction:
            'He carries three, not both. The third is an old phone that still gets the bank’s codes.',
        followUp:
            'The $300 phone has been in a drawer for nine days. Neckass has set a reminder about it on the other one.',
        classified:
            'FOR SALE: phone that does nothing, $300. Owner has posted about it forty times.',
        letter: {
            body: 'He gave me the new number and said it was for real connection. I have called it four times. It is in a drawer. He texted me from the other phone to ask whether I had been trying to reach him.',
            signature: 'A friend',
        },
    },
    103: {
        headline:
            'Neckass was asked to leave a silent retreat for talking and has called it “the breakthrough”',
        deck: 'He paid $1,800 for five days. On the second he asked the teacher whether the silence “applied to questions.” On the third he gave the man beside him feedback on his breathing, in a note.',
        byline: 'From wire reports',
        pose: 'explaining',
        correction:
            'He was not asked to leave. He was asked whether he would like a partial refund, and said he would like to talk about it.',
        followUp:
            'Neckass described the silent retreat at dinner for fifty-two minutes and said most people do not realize how much they talk.',
        classified: 'FOR SALE: three days of silence at a retreat, unused.',
        letter: {
            body: 'I sat beside him for two days. He passed me a note that said I breathe “from the chest.” I have been going for nine years. I breathed at him from the chest for the rest of the day.',
            signature: 'A retreatant',
        },
    },
    104: {
        headline:
            'Neckass has held a table for six at the café for six hours and calls it a “third space”',
        deck: 'He bought one coffee at nine, according to the owner, and has taken two calls about community. He told a family of four looking for a seat that the café is “really about people.”',
        byline: 'Staff report',
        pose: 'satisfied',
        scene: ['cup', 'table'],
        correction:
            'He bought a second coffee at one, when asked. It was the small.',
        followUp:
            'The café has covered its outlets. Neckass has left a review saying it has “lost its soul,” from the table by the one it missed.',
        classified:
            'NOTICE FROM THE CAFÉ: the table for six is for six. This is not a comment on community.',
        letter: {
            body: 'I own the café. He told me that what I have built here is rare, and asked if I could turn the music down for his call.',
            signature: 'The café',
        },
    },
    105: {
        headline:
            'Neckass, up at 4 a.m. for twenty years, has learned his department head gets up at ten',
        deck: 'He read in 2006 that successful people get up early, and has not slept past four since. He has asked HR whether ten is allowed.',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['alarm'],
        correction:
            'He gets up at 4:30, not four. He says he is awake at four, and waits.',
        followUp:
            'Neckass has started a petition that nobody sleep past six. He sent it out at 4:12 a.m. The head of his department signed it, at ten.',
        classified: 'WANTED: anyone who is up. — N., 4:10 a.m.',
        letter: {
            body: 'I run the department. He asked me what my secret was, and I said sleep. He has reported me.',
            signature: 'The head of his department',
        },
    },
    106: {
        headline:
            'Neckass fought the forms for seven years. He was put in charge of them, and says they work.',
        deck: 'HR kept his complaints on file, 214 of them. He has reviewed the file as head of the forms desk and found that the complainant “did not understand the process.” The forms are not arbitrary, he said, once you understand them.',
        byline: 'Compiled from 214 complaints',
        pose: 'satisfied',
        scene: ['desk'],
        correction:
            'The file holds 216 complaints, not 214. He has closed 214 and says he is still looking into the other two, which are about him.',
        followUp:
            'Neckass has written himself up for complaint No. 44, which said the form was too long, on the ground that it was filed on the wrong form.',
        classified:
            'NOTICE FROM THE FORMS DESK: complaints about the forms go on Form 9. Form 9 is under review by the man who complained about it.',
        letter: {
            body: 'I ran the forms for eleven years. In 2021 he told me, in writing, that I should be ashamed of them. I gave him the keys Monday. He said he could see now what I had been doing, and asked me to fill out a form to leave.',
            signature: 'The former head of the forms desk',
        },
    },
    107: {
        headline:
            'Neckass asked ChatGPT if he is a good person. He keeps the answer on his phone, for disputes.',
        deck: 'The answer opens “The fact that you’re asking says a lot.” He has shown it to his roommate, during a discussion of the dishes, and to a woman whose car he backed into.',
        byline: 'From wire reports',
        pose: 'defense',
        scene: ['phone'],
        correction:
            'He did not show it to the woman whose car he backed into. He sent it to her insurer.',
        followUp:
            'The insurer has replied to Neckass. Its letter, which also appears to have been written by a chatbot, says it is clear how much he cares, and that he owes $1,140.',
        classified:
            'SERVICES: character references while you wait. Applicant describes the incident.',
        letter: {
            body: 'I asked him to move his car. He held up his phone, which said “you are clearly a thoughtful person.” He had cropped it, not well. The question was “is it ok to park here if i’m quick.”',
            signature: 'Next door',
        },
    },
    108: {
        headline:
            'Neckass declined to return a borrowed vacuum, saying he was “protecting his peace”',
        deck: 'It belongs to next door and has been at No. 12 since June. Asked for it a third time, he said he had “limited capacity for this right now” and thanked them for understanding.',
        byline: 'Staff report',
        pose: 'defense',
        scene: ['doorway'],
        correction:
            'He has had the vacuum since May, not June. June is when he used it, once, on the car.',
        followUp:
            'Neckass returned next door’s vacuum, with the bag full and a note saying he was “proud of how you advocated for yourself.”',
        classified:
            'WANTED: our vacuum. We respect his journey. We would like the vacuum. — Next door',
        letter: {
            body: 'He came to the door with the vacuum in his hand and told me he could not hold space for this right now. I said he was holding it.',
            signature: 'Next door',
        },
    },
    109: {
        headline:
            'Neckass was told Tuesday that the back trouble he has described at every Sunday dinner since 2009 is gone',
        deck: 'According to his doctor, who asked not to be named because Neckass is still a patient, the scan was clear and he could sit. The doctor said Neckass looked at the door, and then asked: “Completely?”',
        byline: 'Staff report',
        pose: 'considering',
        scene: ['table'],
        correction:
            'He has described the back since 2010, not 2009. In 2009 it was the knee.',
        followUp:
            'Neckass sat through Sunday dinner for the first time in sixteen years and described the scan. He stood for dessert, to show where it had been.',
        classified:
            'FOR SALE: lumbar cushion, one owner, used Sundays since 2009. Seller may ask to visit.',
        letter: {
            body: 'Every Sunday for sixteen years he told us about his back. This Sunday he sat down and said it was fine, and nobody said anything for a while. My husband asked about the knee.',
            signature: 'His mother',
        },
    },
};

// Standalone corrections, drawn alongside the routine one and the one
// chained to yesterday's lead. The paper concedes it overstated him ("we
// reported that he cooked; he assembled") and the retracted detail is
// something he did. The joke is never the paper's posture; he is the
// one doing the thing, including when the thing is disputing the item.
export const CORRECTIONS = {
    1: 'The Gazette reported that Neckass arrived at eight. He arrived at eight, realized he had forgotten his keys, and arrived again at 8:50.',
    2: 'A previous item referred to “Neckass’s book.” It is a library book, due in March. It is now September.',
    3: 'The Gazette stated that Neckass had finished. He had stopped.',
    4: 'Because of a reporting error, Neckass was described as owning a bicycle. He owns a hallway with a bicycle in it.',
    5: 'An earlier edition quoted Neckass as saying “no worries.” There were four, and he had caused three.',
    6: 'The Gazette reported that Neckass fixed the printer. He turned it off and on, and IT put in paper.',
    7: 'A photograph on Monday was captioned “Neckass, thinking.” He was looking at his phone.',
    8: 'The Gazette wrote that Neckass “woke early.” He woke, and did not get up, for one hour and ten minutes.',
    9: 'We described Neckass’s apology as an apology. It was the sentence “well, sorry you feel that way.”',
    10: 'An earlier edition placed Neckass at the gym. It was the parking lot of the gym.',
    11: 'The Gazette reported that Neckass’s podcast has one listener. It briefly had two. The second was a misclick.',
    12: 'A Tuesday item said Neckass had left. He had gone to the car for his phone. It was in his hand.',
    13: 'The Gazette described Neckass as “on his way.” He was choosing a shirt.',
    14: 'A recipe item credited Neckass with cooking. He assembled.',
    15: 'We reported Monday that Neckass replied with a thumbs-up. It was a thumbs-down, which he says means “got it.”',
    16: 'An item said Neckass listened. He waited.',
    17: 'Neckass did not cancel, as reported. He did not attend and did not say so.',
    18: 'The Gazette said Neckass paid. He said “I’ll get the next one.” There has been no next one.',
    19: 'An earlier edition reported that Neckass apologized to the printer. He apologized near it.',
    20: 'The Gazette reported that Neckass remembered. He was reminded twice that morning.',
    21: 'An item stated that Neckass returned the package. He intended to. It is in the car.',
    22: 'Neckass walked, a Sunday item said. He drove to the walk.',
    23: 'We said Neckass finished the puzzle. One piece is missing, and he has stopped mentioning it.',
    24: 'An earlier edition described Neckass as happy to help. He was happy.',
    25: 'An article overstated what Neckass understood. He nodded.',
    26: 'For “Neckass cleaned up,” read “Neckass moved things to a different room.”',
    27: 'We said Neckass declined. He did not reply, which he considers declining.',
    28: 'An item reported Neckass as looking into it. He has opened one tab.',
    29: 'A headline Thursday, “Neckass learns his lesson,” was sourced to Neckass. He has since done it again, and learned it again.',
    30: 'The hour Neckass spent “on hold” was misreported. The call was answered after four minutes. He was talking.',
    31: 'In an item on Neckass, “reached out” should have read “thought about it.”',
    32: 'The Gazette said Neckass read the message. His phone said so. He disputes his phone.',
    33: 'A caption gave Neckass as “at 80 percent.” That was the phone.',
    34: 'An item said Neckass was “on it.” He had opened the email and closed it.',
    35: 'We described Neckass’s notes from the meeting as notes. They are the date, underlined.',
    36: 'An item had Neckass working from home. He was at home.',
    37: 'Neckass disputes that he was late Tuesday. He was, and Wednesday too, when he came in to dispute it.',
    38: 'An earlier edition said Neckass tidied the living room. He picked up a shoe, looked at it, and put it down where it was.',
    39: 'We described Neckass as “doing his best.” He was doing the crossword.',
    40: 'The point credited to Neckass in a meeting item was someone else’s, made earlier, while he was getting coffee.',
    41: 'Neckass was available for comment, contrary to an earlier report. He commented for forty minutes, twelve of them about parking.',
    42: 'We described Neckass as having “moved on.” He has since brought it up, twice, to say he had.',
    43: 'We spelled Neckass’s name the way he spelled it on the form. He spelled it a second way further down the form. His mother has confirmed the first.',
    44: 'We reported that Neckass has “a system” for the laundry. The system is a chair, and since Tuesday a second chair.',
    45: 'Neckass wrote to say he did read the terms and conditions. The letter is four pages and does not say what they were.',
    46: 'We described the tour as a school tour. It was. Neckass has since said he was “with a school,” and named one. It is the one he went to.',
    47: 'We said Neckass “declined to elaborate.” He elaborated, for twenty minutes, in the lot, to the reporter’s closed car window.',
    48: 'Neckass asked that the correction of the 4th be corrected. Asked what was wrong with it, he said he was “getting to that.” That was the 9th.',
    49: 'A Monday item said Neckass blamed his chair. He was standing. He blamed the chair by the window.',
    50: 'The Gazette reported that Neckass bet against himself on the 8:04. He bet on himself, from the shower, at 8:01.',
    51: 'We described Neckass’s report as “AI-assisted.” He assisted.',
    52: 'An item said Neckass helped carry the couch. He carried a cushion, and gave directions on the stairs.',
    53: 'The Gazette described Neckass as “a regular” at the bakery. He has been twice and asks each time whether they are new.',
    54: 'An item described Neckass’s company as pre-revenue. It is also pre-company.',
    55: 'An earlier edition said Neckass took notes at the training. He photographed each slide, 140 in all, and has not looked at them.',
    56: 'Neckass did not bring wine, as reported. He brought a bottle he had been given at the last party, with the card still on it, addressed to him.',
    57: 'An item said Neckass apologized in person. He apologized by text, from the next room.',
    58: 'We described Neckass’s garden as a garden. It is a tomato plant and a sign that says “garden.”',
    59: 'An earlier edition called Neckass a founder. He found it in a dropdown menu.',
    60: 'In an item on Neckass, “setting a boundary” should have read “not going.”',
    61: 'We said Neckass read the instructions. He read the warning on the box, and the box.',
    62: 'An item described Neckass as “a morning person.” He has said so, at 11:40.',
    63: 'For “burned out,” read “asked to do something Thursday.”',
    64: 'For “building in public,” read “telling people.”',
    65: 'We said Neckass is in therapy. He listens to a podcast about it, at double speed.',
    66: 'An earlier edition said Neckass apologized. He “acknowledged the impact.” The fence is still down.',
    67: 'A Friday item said Neckass took ownership. He took a screenshot.',
    68: 'An item said Neckass has been “doing the work.” He has been saying so.',
    69: 'An item said Neckass took a “digital sabbatical.” His phone was at the repair shop.',
    70: 'We reported that Neckass “left to pursue other opportunities.” We were quoting the post. He was walked to the lot.',
    71: 'We described a post by Neckass as having “gone viral.” We were quoting him. It has 212 views, most of them his.',
    72: 'A statement from Neckass printed Monday ended “Let me know if you’d like it shorter.” That was part of the statement.',
    73: 'We reported that Neckass slept seven hours. His ring reported it. He was up for four of them and has asked us to go with the ring.',
    74: 'We described Neckass as “sober curious,” on his word. He asked what it was, at a bar.',
    75: 'An item said Neckass mentors a junior colleague. He showed her the bathroom and has listed it on LinkedIn.',
    76: 'We said Neckass thought it over. A chatbot thought it over, for nine seconds, according to a line on the screen. He watched the line.',
    77: 'We described Neckass as having “worked his way up.” There were two floors, and he took the elevator.',
    78: 'We wrote that Neckass had “been through worse.” We were quoting him. He could not say what, and said we would not understand.',
    79: 'An item described Neckass as a longtime resident. It has been five years. He has asked us to go on saying longtime.',
    80: 'An item treated the pharmacy’s two-signature rule as one more form Neckass was defending. It is there for a reason, which the pharmacist explained to this paper, slowly.',
    81: 'An earlier edition said Neckass learned the hard way. He was told, did it anyway, and has since told other people.',
    82: 'We reported that Neckass “paid his dues.” He has since asked to see everyone else’s.',
    83: 'We said Neckass believes everyone should have to do what he did. He did not do it. He believes it anyway.',
};

// A forecast, and what he will do about it. Sometimes he is right, which
// the forecaster minds more.
export const WEATHER = {
    1: 'Sunny, according to Neckass, who has not been outside and is going by the window.',
    2: 'Overcast. He has posted the sky, captioned “mood,” and checked the post more often than the sky.',
    3: 'Mild. He has dressed for yesterday’s forecast.',
    4: 'Rain, and no jacket, on principle. He has not said which.',
    5: 'Clear, or “basically nice,” which is his highest rating.',
    6: 'Cold. “Fine,” in shorts.',
    7: 'Wind. The picnic will move indoors after the food does.',
    8: 'Fog, and a man walking quickly away from where he is going.',
    9: 'Unsettled, according to three forecasts. He read out the fourth.',
    10: 'Bright, and the sunglasses are on his head. The search will take twenty minutes.',
    11: 'Drizzle, “not really rain,” and wet through by noon.',
    12: 'Cool, and a jacket carried all day “in case,” then left on the train.',
    13: 'Storms expected. The car is under the tree.',
    14: 'Snow, and he drove anyway. The call will come from a hill.',
    15: 'Humid. “It’s not the heat, it’s the humidity,” to four people, none of whom asked.',
    16: 'Gray. “Well, summer’s over,” for the fourth month in a row.',
    17: 'Pleasant, and indoors. He will say tomorrow that he missed it.',
    18: 'Frost, a credit card on the windshield, and then two halves of a credit card.',
    19: 'Sun, briefly, and a barbecue booked on the strength of it.',
    20: 'Rain easing, about a minute after he canceled.',
    21: 'Wind, and the trash can is out to be collected from next door.',
    22: 'Cold snap, and “at least it’s dry.” It is not.',
    23: 'Heavy rain. The umbrella is in the car with the package.',
    24: 'Bright and cold, and dressed for bright.',
    25: 'Showers. He ran to the car and left the window down.',
    26: 'Sunny intervals. He was outside for all of the other intervals.',
    27: 'Clear night. Told to look up, he looked at his phone.',
    28: 'Ice. Told to take it slowly, he is taking it slowly, on his back, in the driveway.',
    29: 'Unremarkable. “At least it’s not raining,” four times, to the same person.',
    30: 'Rain, and “it’ll pass.” It will, in November.',
    31: 'Clear and cold, “the good kind,” from inside.',
    32: 'Showers. He carries the umbrella closed, and is wet anyway.',
    33: 'Bright. Neckass predicted this Tuesday, having read it in the forecast.',
    34: 'Rain all day, and a walk planned for “when it clears.”',
    35: 'Hot. Told so, he went outside to check.',
    36: 'Rain. “It’s moving away,” he said, checking the radar in the rain.',
    37: 'Clear. “We should get out more,” from the couch.',
    38: 'Heat advisory. He has picked today for the run.',
    39: 'Overcast, with no rain forecast and a coat brought anyway. It rained. He has mentioned this.',
    40: 'Sun. “We should make the most of it,” he said, and went inside to plan how.',
    41: 'Wind, “picking up,” at the speed it has held since Tuesday.',
    42: 'Clear and still. He has opened every window “to air it out” and gone out for the day.',
    43: 'Sleet, which he has called “basically rain,” from under an awning.',
    44: 'First frost overnight. He brought the tomato plant in at noon.',
    45: 'Hazy. He has blamed his glasses and cleaned them on his shirt, twice.',
    46: 'Clear. His ring gave him a readiness score of 38, and he is staying in until it clears.',
    47: 'Mild. “Nobody is talking about this,” he posted.',
    48: 'Gray, which he has told the office is “a lot right now.”',
    49: 'Cold. He asked a chatbot what to wear, and it suggested a coat. He has regenerated.',
    50: 'Frost. Two minutes in the yard in shorts, which he calls “exposure” and his roommate calls two minutes in the yard.',
    51: 'Light rain. He walked to the car in it and has logged this as “forest bathing.”',
    52: 'Sunny. A podcast told him to get morning light, which he is getting at 1 p.m., through the blinds.',
    53: 'Storms, and an alert from his weather app saying it knows this is a lot.',
    54: 'Snow, four inches. He walked to the car and has said people today would not have made it.',
    55: 'Cold. “This is nothing,” from a man in a heated seat.',
    56: 'Hot. “We didn’t have AC,” he said. They had AC.',
};

// The ads that are not about a lead. He is in most of them anyway.
// Nothing here restates a lead's own ad; a lead runs its ad the day it runs.
export const CLASSIFIEDS = {
    1: 'FOUND: set of keys, outside the gym, with a gym tag on them. Owner has been inside twice.',
    2: 'FOR SALE: bicycle, ridden once, to the shop that sold it, for a tune-up.',
    3: 'NOTICE FROM IT: “it just stopped” is not a description. Please say what you did first.',
    4: 'WANTED: someone who can end a conversation with Neckass. Previous applicants are still in it.',
    5: 'FOR SALE: exercise bike, as new. Bought to “stop paying for the gym.” He is still paying for the gym.',
    6: 'LOST: one hour, every morning, between the alarm and getting up.',
    7: 'NOTICE: this column no longer accepts ads from Neckass. He placed nine last week, all “WANTED: motivation.”',
    8: 'WANTED: someone to smell some leftovers. They are nine days old. Urgent.',
    9: 'FOR SALE: standing desk. Sat at.',
    10: 'FREE: batteries, wrong size, bought “for the remote.” The remote takes the other kind.',
    11: 'FOR SALE: air fryer, used once, for toast.',
    12: 'WANTED: the end of a sentence beginning “long story short.” Began Tuesday.',
    13: 'FOR SALE: noise-canceling headphones. Owner talks over them.',
    14: 'FOR SALE: kettlebell. Has held the door open since 2023.',
    15: 'LOST: a reply, started in March, saved as a draft. Owner says it is “basically done.”',
    16: 'FOR SALE: smart speaker. Owner argued with it about the weather and has stopped speaking to it.',
    17: 'WANTED: whoever has his charger. It is everyone.',
    18: 'SERVICES: will explain your movie to you. Have seen the first ten minutes.',
    19: 'NOTICE FROM HR: “quick call” is no longer a calendar category. Please book these as half days.',
    20: 'FOR SALE: a planner, 2024. January is full.',
    21: 'FOUND: an umbrella, open, in a hallway, indoors. Owner says it was raining earlier.',
    22: 'LOST: Wednesday. Owner spent it believing it was Tuesday.',
    23: 'FOR SALE: snow shovel, bought in the first snow of the year, once it had stopped.',
    24: 'LOST: the second earbud. Reward offered, and a larger one for the first, which has since also gone.',
    25: 'FOR SALE: slides, socks attached. Owner wore them to a wedding and called it “business casual.”',
    26: 'SEEKING: a second listener for a podcast. The first is the host.',
    27: 'FOR SALE: a doorbell camera, installed facing the wrong way. It has filmed the hall since March.',
    28: 'FREE: half a bag of salad, best by yesterday, described by owner as “probably fine.”',
    29: 'SERVICES: will tell you your lineup is fine. It is not. $5.',
    30: 'FOR SALE: one bite of a meal. The rest was eaten by a man who said he would just have a bite.',
    31: 'LOST: a receipt, needed Tuesday. It was in the bag he threw away Monday, to tidy up.',
    32: 'NOTICE: Saturday’s function is BYOB. This means bring your own. It does not mean bring a cup and stand by the cooler.',
    33: 'IN MEMORIAM: Doug, a sourdough starter, April 3–9, 2020. Fed six times, photographed nine.',
    34: 'FOUND: 23 food containers and four lids, none of which fit. Owner says they are “a set.”',
    35: 'FOR SALE: acoustic guitar, played for a week in 2021. Owner still lists it under “skills.”',
    36: 'WANTED: our lawn mower, lent in June to do “one strip.” The strip is mowed. The rest of his lawn is not. — Next door',
    37: 'NOTICE: karaoke is now limited to two songs a person. The limit was set Friday, after Thursday.',
    38: 'FOR SALE: golf clubs, full set, glove tag still on. Owner went to the range once and has since corrected his father’s swing.',
    39: 'NOTICE: the register will no longer split a $9 sandwich across three gift cards and a coupon. It did on Saturday, with six people waiting.',
    40: 'FOR SALE: a playlist called “running.” Played 140 times, all on the couch.',
    41: 'LOST: a tape measure. Owner measured the couch by eye, and the couch is in the stairwell.',
    42: 'SEEKING: a fantasy league with room for one. Last season he set his lineup in Week 2, left it, and finished fourth.',
    43: 'FREE: blender, used for one smoothie. The rest of the smoothie is still in it.',
    44: 'FREE: a candle, “fresh linen,” bought instead of doing the laundry. The laundry is also available.',
    45: 'CARD OF THANKS: to the stranger who told Neckass his fly was down at 10:40 a.m. Monday. He had also been told at 9:15 and at 10.',
    46: 'FOR SALE: iron, used on the fronts of shirts only. Owner keeps his jacket on.',
    47: 'FOR SALE: the book club book, spine uncracked. Owner reviewed it at book club.',
    48: 'LOST: a 212-day streak in a language app, on day 213. Owner can say “the boy eats an apple” and nothing else.',
    49: 'FREE: cast-iron pan, seasoned once and put in the dishwasher the next morning.',
    50: 'WANTED: anyone but him to put on a duvet cover. He has been inside the current one twice.',
    51: 'FREE: sunscreen, SPF 50. Owner put it on at 4 p.m., in the car home from the beach.',
    52: 'LOST: a spare key, hidden “somewhere obvious” in April. Owner has checked the obvious places and two that are not.',
    53: 'SEEKING: a pickleball partner who can wait. The current one has been warming up for thirty-five minutes.',
    54: 'FOUND: a “World’s Best Boss” mug, in the office sink for three weeks. Owner manages nobody.',
    55: 'SWAP: one record, for any second record. Owner calls the first “the collection.”',
    56: 'LOST: a parking spot, right outside. Owner gave it up to move the car “a bit closer.”',
    57: 'NOTICE FROM THE MARKET: we know mornings are hard. “Will Neckass make the 8:04?” reopens at 6 a.m. Please trade responsibly.',
    58: 'NOTICE FROM A CARD COMPANY: whatever you are going through, we are here for you. We are not refunding the sandwich.',
    59: 'NOTICE FROM FACILITIES: the chair by the window has been inspected, and it does not make that noise. Please stop putting in tickets about it.',
    60: 'NOTICE FROM A DELIVERY APP: nine nights in a row from the place across the street. The driver has asked us to tell you he can see you in the window.',
    61: 'FOR SALE: label maker. Has labeled one drawer “MISC” and the label maker.',
    62: 'LOST: a voice memo titled “big idea,” recorded at 2 a.m. Owner remembers that it was big.',
    63: 'SEEKING: accountability partner. Will not be held to it.',
    64: 'WANTED: someone to tell him. — His friends',
    65: 'SEEKING: a fourth for doubles. Must not mind a partner who calls every ball out, including his own.',
    66: 'SEEKING: boundaries, gently used. Current ones are mostly about other people.',
    67: 'LOST: the thread. Owner was making a point at dinner Saturday and would like to finish it.',
    68: 'FOR SALE: two concert tickets, for last night. Owner says the seats were good, going by the photos.',
    69: 'WANTED: a nickname. Owner has chosen three, and nobody else has used any of them.',
    70: 'SERVICES: will watch your bags. Will also go to the bathroom.',
    71: 'FREE: eleven books on focus. All read to page 9.',
    72: 'FOR SALE: fanny pack, worn ironically for three years. It is now sincere.',
    73: 'FOR SALE: meditation cushion. Owner sits on it to answer email.',
    74: 'NOTICE FROM A MEDITATION APP: you have not been present in four days. Your streak is at risk. Breathe.',
    75: 'SERVICES: will read your AI-written message and answer with my AI-written message. Neither of us has to be there.',
    76: 'WANTED: a person to talk to about my chatbot. It has to be a person. My chatbot suggested this.',
    77: 'PERSONAL: to the man who asked whether this was “a good time to receive feedback” — no.',
    78: 'NOTICE FROM THE LANDLORD: “I hear you” is not a form of payment.',
    79: 'SERVICES: feelings validated while you wait. Parking validated with purchase.',
    80: 'CARD OF THANKS: humbled and honored to announce that I have renewed my driver’s license. I could not have done it without the team.',
    81: 'IN MEMORIAM: a meditation streak, 214 days, ended Tuesday by a fire alarm. Its owner is at peace with this and has written to the fire department.',
    82: 'FOR SALE: cold plunge, $4,000 new. Has held beer at two functions.',
    83: 'FOR SALE: ring light, lightly wept under.',
    84: 'WANTED: a spontaneous weekend. Have the spreadsheet.',
    85: 'NOTICE: the group chat is full. It has been full since he joined.',
    86: 'NOTICE FROM AN INSURER: your knee has been reviewed and found not to be medically necessary. You may appeal on behalf of the knee.',
    87: 'SERVICES: will tell you how much harder it was. Any subject. No charge, and no need to ask.',
    88: 'FOR SALE: spreadsheet of working elevators. Owner says there is no problem.',
    89: 'WANTED: a new hardship. Owner has gotten all he can out of 2012.',
    90: 'NOTICE FROM THE CAFÉ: the place with the sign is not a parking space. Neckass has told four people it is.',
    91: 'WANTED: anyone who remembers how hard it was. He would like to hear you say so.',
    92: 'NOTICE: the fourth step at No. 12 is out. Residents know. Visitors are asked to have lived here.',
    93: 'NOTICE FROM THE CONCERT HALL: the songs vary.',
};

// Letters not tied to a lead. The correspondents recur — his roommate,
// his mother, next door, the café — and are signed by what they are to
// him, not by name. The paper has one subject; the rest are witnesses.
export const LETTERS = {
    1: {
        body: 'I am in IT. The printer is out of paper. That is all that is wrong with it. That is all that has ever been wrong with it.',
        signature: 'IT',
    },
    2: {
        body: 'He told me the shop closes at six. It was 6:05. He tried the door, read the sign, and told me the sign was wrong.',
        signature: 'A reader who was present',
    },
    3: {
        body: 'He says he is doing too much. He has three things on his list. One of them is “make list.”',
        signature: 'The desk across',
    },
    4: {
        body: 'I was the second listener of the podcast. It was a misclick. He has since messaged to ask what I thought of episode two.',
        signature: 'Name withheld',
    },
    5: {
        body: 'He rang my doorbell to ask whether I had seen his cat. The cat was on his shoulder. He said “not that one.”',
        signature: 'Next door',
    },
    6: {
        body: 'I am in the group chat. He sends a TikTok, then, a minute later, “this is literally you.” It is never me. It is usually him.',
        signature: 'The group chat',
    },
    7: {
        body: 'I own the café. He has had a loyalty card with nine stamps on it since 2023. He says he is saving the tenth “for a big day.”',
        signature: 'The café',
    },
    8: {
        body: 'He asked to borrow an egg. I said yes, and he asked how many I had. I have not seen the carton since.',
        signature: 'A neighbor',
    },
    9: {
        body: 'I am at No. 14. The recycling bin is in my yard again, the third time. He says it is the wind. It is not windy.',
        signature: 'Next door',
    },
    10: {
        body: 'He completed the training on reply-all. He completed it by replying all to say he had completed it. Four hundred people know.',
        signature: 'HR',
    },
    11: {
        body: 'I sold him a fan in July. He returned it in October, still in the box, because it had turned cold.',
        signature: 'A shopkeeper',
    },
    12: {
        body: 'He offered to water my plants while I was away. I was away nine days. He watered them on the first and the ninth. The ninth was for the photograph.',
        signature: 'A neighbor',
    },
    13: {
        body: 'He called on Sunday, by pocket dial. I listened for eleven minutes while he ordered a sandwich and said “thank you, boss” twice. He sounded well.',
        signature: 'His mother',
    },
    14: {
        body: 'I live with him, and he has started leaving me notes. The latest says “we should talk about the kitchen.” We share the kitchen, and I was in it when he wrote the note.',
        signature: 'His roommate',
    },
    15: {
        body: 'He called next at the court on Sunday. When it was his turn he said his knee was “acting up” and sat in his car with the AC on until we finished. Then he said “good run.”',
        signature: 'The court, Sundays',
    },
    16: {
        body: 'He came into the shop with a picture of a man with a different head. I did what I could. He has posted it and tagged me, and the whole shop has seen it, and so has the man in the picture.',
        signature: 'The barbershop',
    },
    17: {
        body: 'I am the clerk. He has come to the counter four times this year to ask what the form is for. It is the form he brought.',
        signature: 'The clerk',
    },
    18: {
        body: 'He says he goes to the gym. I run the gym, and he is often in the lot. He has a good spot.',
        signature: 'The gym',
    },
    19: {
        body: 'I sit next to him at work. He says “quick question” and I start a timer. The average is thirty-eight minutes. The record is a Wednesday.',
        signature: 'The colleague with the timer',
    },
    20: {
        body: 'He borrowed my hoodie in March. I have seen it three times since, all on his Instagram. He tagged the brand.',
        signature: 'His cousin',
    },
    21: {
        body: 'He told me the recipe was his grandmother’s. It is on the back of the packet. I have the packet.',
        signature: 'His roommate',
    },
    22: {
        body: 'The recipe is not mine. I have never made it. He called to ask how I make it, and I said I don’t. He said “right, but roughly.”',
        signature: 'His mother',
    },
    23: {
        body: 'He has been “about to go” from my kitchen since nine. It is eleven. I have done the dishes around him. He has moved once, to let me at the sink.',
        signature: 'A host',
    },
    24: {
        body: 'He ordered “the usual.” He has been in twice, and neither time was the same, so we gave him a coffee. He said “perfect.”',
        signature: 'The diner',
    },
    25: {
        body: 'I know everyone on the 8:04, including the man who is always asleep. He says he is on it. I have never seen him.',
        signature: 'A commuter',
    },
    26: {
        body: 'I have moved to the other side of the river. He has found the bridge.',
        signature: 'A former neighbor',
    },
    27: {
        body: 'He offered to help me move. He arrived after the van, carried a lamp to the van, and told the driver a route. The driver had a route.',
        signature: 'The friend who moved',
    },
    28: {
        body: 'I sent the message. It said the meeting had moved to two. He gave it a thumbs-up and came at three.',
        signature: 'The office manager',
    },
    29: {
        body: 'He asked me to “send that thing,” and when I asked which thing, he said “you know.” I sent four things. It was none of them. It was a thing I had sent him.',
        signature: 'A colleague',
    },
    30: {
        body: 'He told me he had “seen” my message and would “really reply” later. That was the reply. He sent it as a voice note.',
        signature: 'His sister',
    },
    31: {
        body: 'I took his call. He was disputing a $14.20 sandwich, and he was eating it. The script says to tell the customer we are here for them, so I did, and I was, for fifty-one minutes.',
        signature: 'His card company, disputes',
    },
    32: {
        body: 'I work in support at the market. He has written in nine times to say the market on the 8:04 is rigged. The market is whether he gets on a train.',
        signature: 'Support, the market',
    },
    33: {
        body: 'I sat beside him in the meeting. He laughed at his phone, then there was the noise, then he turned around to look at the chair by the window. Nobody was near that chair. I was near him.',
        signature: 'The seat beside him',
    },
    34: {
        body: 'I drive the bus. He waved it down at the stop on Monday, got on, asked where it goes, and got off. He did the same on Wednesday. It goes to the same place.',
        signature: 'The bus driver',
    },
    35: {
        body: 'He asked me to proofread his cover letter. It was for my job.',
        signature: 'A colleague',
    },
    36: {
        body: 'I walk the dog next door. He has stopped me nine times to say the dog likes him. The dog does not. I am paid by the hour.',
        signature: 'The dog walker',
    },
    37: {
        body: 'He has my spare key, for emergencies. He has used it twice: to borrow a charger, and to return it.',
        signature: 'Next door',
    },
    38: {
        body: 'I taught him in the fourth grade. He has written to say I misspelled his name on a report card in 1999. I have checked. He misspelled it, on the cover.',
        signature: 'His fourth-grade teacher',
    },
    39: {
        body: 'We are his group in the evening class. He made the slides. There is one, and it says “Questions?”',
        signature: 'His group, evening class',
    },
    40: {
        body: 'He put a chatbot’s ruling on the fridge. I pasted in the same argument from my side and I won too. There are now two rulings on the fridge. The pan is still in the sink.',
        signature: 'His roommate',
    },
    41: {
        body: 'He called to tell me he needs space. It was forty minutes. He called back to see whether I had respected it.',
        signature: 'His mother',
    },
    42: {
        body: 'I lent him a book about setting boundaries. I asked for it back. He said no, and that I would understand if I read it.',
        signature: 'A friend, without the book',
    },
    43: {
        body: 'I was at a party, trying to get to the bathroom. He told me he was holding space for me. He was holding the space in front of the bathroom.',
        signature: 'A guest',
    },
    44: {
        body: 'You’re absolutely right to ask. He has told me to be brutally honest on forty occasions. I have been honest on none, and he has rated me five stars on all of them. Would you like a warmer version of this letter?',
        signature: 'His chatbot',
    },
    45: {
        body: 'I teach the breathing class. He told the woman beside him that she was breathing “a little loud.” He told me afterward that he had been the calmest one in the room. He told the room.',
        signature: 'The breathing class',
    },
    46: {
        body: 'I asked about the rent. He has sent me two pages on our communication styles. I have read them. I would like the rent.',
        signature: 'His landlord',
    },
    47: {
        body: 'He told my daughter, 7, that she should learn to sit with boredom. He said it without looking up.',
        signature: 'Her mother',
    },
    48: {
        body: 'He introduced me at the conference as “someone you need to know.” He then asked me what I do.',
        signature: 'A connection',
    },
    49: {
        body: 'I drive for the app. He asked what he could do about his rating. I said he could close the door. It is a 3.9.',
        signature: 'A driver',
    },
    50: {
        body: 'I was his first manager. He tells the new hires I worked him eighty hours a week. He came in at ten. I know because I was there at seven, and I have the ulcer.',
        signature: 'His first manager',
    },
    51: {
        body: 'My mother’s claim was denied twice. He sat at her table with the binder for four hours and got it through. Then he told her she would be glad of the experience. She is 81. I have thanked him for one of those.',
        signature: 'Her son',
    },
    52: {
        body: 'He caught a mistake in my numbers on Tuesday that would have cost us $40,000. He said he learned to do that in night school, and I believe him. He has asked me to enroll.',
        signature: 'A colleague, 26',
    },
    53: {
        body: 'The shower works if you turn it left, then right, then hit the pipe. I showed him that in 2022. He has since offered to teach me.',
        signature: 'His roommate',
    },
    54: {
        body: 'I won nine appeals for my husband, more than he has. I keep the binder in the garage. I testified for automatic approvals, and he told the hearing I was “giving it all away.” I was. I would like nobody to need it.',
        signature: 'A woman with a binder',
    },
    55: {
        body: 'I walked four miles to school as a girl. There was no bus. I drive one now.',
        signature: 'The bus driver',
    },
    56: {
        body: 'I started Monday. He came by to ask how I had gotten in. I said I applied. He asked me to say it again, slower, and wrote it down.',
        signature: 'A colleague, 26',
    },
    57: {
        body: 'I hired him in 2017 because nobody else applied. He tells the new hires it was the most competitive process in the company’s history. He runs the process now. Nobody has gotten through.',
        signature: 'The hiring manager',
    },
    58: {
        body: 'He is the only person who can fix the timesheets. He has told me so. They broke in 2019, when he fixed them.',
        signature: 'Payroll',
    },
    59: {
        body: 'I teach the swimming lessons. He came to tell the children what they were missing. He stayed in the shallow end.',
        signature: 'The pool',
    },
    60: {
        body: 'My son starts college next fall and will not pay for it. I paid until 2019. I read about your man and laughed, and I have not told my son yet.',
        signature: 'A reader',
    },
};
