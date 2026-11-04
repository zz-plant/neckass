// Register: a wire service filing on a Neckass. Flat, past tense, and it
// says what happened. The failure is stated, not implied; where there is a
// second sentence it adds a fact (a time, a number, who was there), never
// a formality. "The matter has been noted" is not a fact.
// It is an American wire: simple past ("Neckass thanked the ATM"), not
// "has thanked", unless the thing is still going on; "in a row", not
// "running"; "came down Sunday", not "on Sunday"; canceled, gray, the
// day of.
//
// It is sourced the way a wire story is: a count is somebody's ("his
// roommate kept the count"), a document was "obtained by the Gazette,"
// and he is asked for comment and gives it. The apparatus is the joke,
// a newsroom's diligence brought to a fridge, so it goes on some items,
// not all, and it always carries a fact: who counted, what the record
// says, how old the child was.
//
// These run in the briefs column beside the follow-ups and the
// calendar's briefs, so each is set as a sentence and ends on a period,
// inside a closing quote. None repeats a lead's headline: the lead
// tells that story at length, and the brief would be the same sentence
// on some other morning.
//
// Not every item is the same joke. "He said he would and did not" is one
// engine; the others are the world answering back (the newsletter asking
// why), a bystander (the cat who was never in the room), escalation
// inside the sentence (47 tabs, 46 reopened), and the wrong criterion
// (four stars, citing parking). About a fifth do not open with his name,
// so a column of seven does not read as the same word seven times.
//
// From No. 770 most of what is new runs on one idea of him: he does not
// want credit for getting past an obstacle, he wants the obstacle to keep
// its accreditation. He uses a modern institution's own language and tools
// against its purpose and reports progress (the ring that tells him he is
// tired; “protecting his peace” about a vacuum). He went through something,
// or found a way around it, and rules on it for other people, and the wire
// gives that qualification the way it gives any source's, in a clause after
// his name (“who has no children”). He learns it was optional and behaves
// as though defrauded. And he gets further along: a complaint becomes a
// business, the business a coalition of one, the coalition a program HR
// has named.
//
// He also gets as far as the institution. “I survived it” becomes “it made
// me who I am,” then “everyone should experience it,” then “I am responsible
// for making sure they do.” The reasoning should sound almost respectable
// until the last detail shows what it is defending. Real institutions did this
// (a union wary of public insurance, discounted homes that were not replaced),
// so take the mechanism and leave out the name: the paper calls nobody but him
// a neckass.
//
// Three things keep that from being one joke. He means it, so an item never
// points out the contradiction: he does not experience one. What he knows
// is real (the binder works, the night classes taught him something, the
// sun does come up), and the error is the step from “I had to” to “it had
// to be” to “you have to.” And he is sometimes right (No. 800), so a burden
// is not needless because he is the one defending it. And he is not what
// happens to everyone who survives something: the letters page has people
// who went through the same thing and got rid of it. Most of the paper is
// still the phone, the office, the group chat and the fridge, or he is one
// man with one argument.
//
// The conflict under all of it is between two things a person is allowed to
// want: that what they went through mattered, and that someone else be
// spared it. He cannot grant the second without feeling he has given up the
// first. So the best settings are the settled ones. Some items open on an
// improvement long since won (ether, the dishwasher, the seat belt) and he
// objects as though he had just heard. They do not date, and news does.
//
// Those items and a few from the news open on something that happened, and
// he reacts to it. The first sentence is the fact, with an absolute date, so
// the item stays true when it comes round, and REAL_SOURCES below gives it a
// footnote.
// The paper's own sourcing is a joke (the roommate's count, a document
// obtained by the Gazette), so a real one has to say so. Only he is
// invented in these: no real person or company does anything but what the
// source says. New York and Ohio do not place the paper; he has never been
// to either, which is the joke.
//
// Timing. An item is a setup and a turn, and the sentence is built to get
// to the turn and stop:
//
// - The funny word goes last. Nothing follows it: no “he said,” no date, no
//   “at the time.” A tail after the laugh is the writer talking over it.
// - The sourcing goes first. “According to the invoice, he was charged for
//   the length,” never the other way round. A source can come last only when
//   the source is the joke: “according to his manager, who read one.”
// - Keep the reveal back. Whatever makes it absurd comes as late as the
//   sentence allows, and a deck does not explain its way past the headline.
// - The full stop is the pause. “He took one in 2019. It rained.” Two beats
//   joined by “and” are one beat, and it lands soft.
// - The turn is short, and a concrete noun or a number if it can be. “He
//   rents.” “There is a shirt.” “It was a drill.” The long sentence is the setup.
// - When a word comes back at the end, it comes back exactly: “He is still
//   paying for the gym,” not “which he still pays for.”
//
// A sentence can run. Serial verbs and a fact buried in a clause read
// more like the wire than a stack of short beats; the short sentence is
// for the turn, and it lands harder for being the only one.
export const HEADLINES = {
    1: 'Neckass read the room, at a baby shower, and proposed a drinking game.',
    2: '“That was a joke,” Neckass said, and then explained it, for six minutes, to the person it was about.',
    3: 'A colleague timed Neckass’s “quick question.” It lasted forty minutes and had three parts.',
    4: 'Neckass wrote “no rush” and followed up four minutes later.',
    5: 'Neckass set a 5 a.m. alarm “for future me.” Future him turned it off at 5.',
    6: 'A review by the Gazette found that since 2021 Neckass’s group chat has produced 11,000 images and no plans.',
    7: 'Neckass called his own foul in pickup and then disputed it.',
    8: 'Neckass said he would sleep on it. That was in March. He has slept well.',
    9: 'For the ninth week in a row, Neckass meal-prepped five lunches on Sunday and ordered takeout on Monday “to save them.”',
    10: 'Neckass wrote “per my last email.” There was no last email.',
    11: 'Neckass got 14,000 unread emails down to zero with a rule that marks them read.',
    12: 'Neckass selected “remind me tomorrow” for the 412th consecutive day.',
    13: 'Neckass’s podcast has one listener. He has checked the number nine times today.',
    14: 'Neckass said “run it back” and lost by twelve more.',
    15: 'Neckass began a victory dance at 20–18 in a game to 21 and was still dancing at 20–21. He said the dance had been “for the next game,” which he lost 21–4.',
    16: 'Neckass has proposed coffee “sometime” to the same person every few months since 2022. In August she wrote back “Tuesday?” He has not replied.',
    17: 'Neckass sent “quick call?” at 11 p.m. and, told it was late, called to agree.',
    18: 'Neckass blamed the cat for the missing puzzle piece. The cat, which has never been in that room, could not be reached for comment.',
    19: 'Neckass’s sleep app rated the night “poor.” He disputed it, from bed, at 3 a.m.',
    20: 'Neckass asked the smart speaker whether he was making a mistake. It turned on the lights.',
    21: 'Neckass posted his plate from the cookout. It was his cousin’s plate.',
    22: 'Neckass has worn the same hoodie for six weeks and describes it as “in rotation.” It rotates between him and the chair.',
    23: 'Neckass said “keep the change” to a card reader.',
    24: 'Neckass gave a closed store two stars. One was for the sign.',
    25: 'Neckass sent a screenshot of a text to the person who sent the text.',
    26: 'Neckass said “is it only Tuesday?” to three people. It was Wednesday.',
    27: 'Neckass sent a three-page agenda for a “low-stakes hang.”',
    28: 'Neckass ordered the salad “to be good” and ate his neighbor’s fries “to balance it out.”',
    29: 'Neckass’s habit tracker records one habit: opening the habit tracker.',
    30: 'Neckass texted the group chat to ask whether anyone had his number.',
    31: 'Neckass bought a succulent because “you can’t kill them,” and after nine days called the nursery to report it faulty.',
    32: 'Neckass’s watch logged a workout Tuesday. He was looking for his keys.',
    33: 'Neckass’s houseplant has outlived the guitar, the sourdough starter and the running. His roommate waters it.',
    34: 'Neckass got a security question wrong: it was his mother’s maiden name, so he called her to check.',
    35: 'Neckass has “CEO” in his bio. According to its website, the company has no product, no offices and no other employees.',
    36: 'Neckass calls himself a foodie. He has eaten the same chicken every night since 2023 and rated it, every night, an eight.',
    37: 'Neckass’s no-meeting day will be planned at Thursday’s meeting.',
    38: 'Neckass swore off online shopping and ordered a book about it, next-day.',
    39: 'Neckass unsubscribed from a newsletter and received a newsletter asking why.',
    40: 'Neckass gave the restaurant four stars, citing parking.',
    41: 'Neckass stopped his walk to check his step count, saw 4,000, and called it a day. It was 9 a.m.',
    42: 'Neckass’s digital detox was documented in fourteen posts and a story asking whether anyone had noticed he was gone.',
    43: 'Neckass watched “one more episode” at 2 a.m. At 5 the service asked whether he was still watching. He said yes.',
    44: 'Neckass described his week to the Gazette as “insane.” His calendar shows a haircut and a dentist. The dentist was rescheduled.',
    45: 'Neckass was asked whether the neck in Neckass refers to anything. He touched his neck.',
    46: 'Neckass said “I’ll keep it brief” and stood up.',
    47: 'Neckass ate soup he described as “still good.” The lid said Tuesday, and he said it did not say which Tuesday.',
    48: 'Neckass put a document somewhere safe in 2024. It is still somewhere safe.',
    49: 'Neckass asked a table of five to guess his age, was told, and asked them to guess again.',
    50: 'Neckass said he would “just have a bite.” He used a fork and a chair.',
    51: 'Neckass told the group to leave at seven sharp. At 7:40 he asked what everyone was wearing.',
    52: 'Neckass apologized “if anyone was offended.” Everyone was.',
    53: 'Neckass closed 47 tabs, felt better, and reopened 46.',
    54: 'Neckass spent forty minutes choosing a profile picture. It is a landscape, of a place he has not been, taken by someone else.',
    55: 'Neckass sent a text at 1 a.m. and deleted it at 1:01. The recipient, who asked not to be named because they still reply to his texts, saw both.',
    56: 'Neckass said “I was just about to do that” about a task from June.',
    57: 'Neckass asked for the Wi-Fi password, was shown the wall, and asked whether that was the current one.',
    58: 'Neckass described a forty-minute film explanation as “the short version.”',
    59: 'Neckass brought half a dish to the potluck, having eaten the rest in the car.',
    60: 'Neckass introduced himself to the same man at two weddings. The man has done the same.',
    61: 'Neckass says he is bad with names. He signed his manager’s birthday card “bro.”',
    62: 'Neckass left a voicemail asking why nobody answers his texts.',
    63: 'Neckass answered a group email to nine people with nine separate replies.',
    64: 'Neckass has sat in the parked car for eleven minutes to finish a four-minute song. He is on its third play.',
    65: 'Neckass bought a planner. It is where he keeps the receipt for the planner.',
    66: 'Neckass told the waiter “surprise me” and sent it back.',
    67: 'Neckass apologized for being twenty minutes late with a twenty-five-minute account of the route.',
    68: 'According to a photograph seen by the Gazette, Neckass’s grocery list has read, since April, “stuff.”',
    69: 'Neckass bought a water bottle with the hours printed on it. He is two hours behind.',
    70: 'Neckass snoozed an alarm labeled “NO SNOOZE” and, at the second ring, renamed it “ONE SNOOZE.”',
    71: 'Neckass told the group he had booked the cabin. He had looked at the cabin.',
    72: 'Neckass has been on hold for an hour for a question he has since answered himself. At press time he was still on hold.',
    73: 'Neckass signed a coworker’s goodbye card “see you Monday.”',
    74: 'Neckass sent a calendar invite for a conversation that took nine seconds.',
    75: 'Neckass has a folder called “Important” containing one screenshot of a cat. It is not his cat.',
    76: 'Neckass said “I’ll remember” and did not write it down. He then wrote down “remember.”',
    77: 'Neckass bought running shoes and a watch. The watch has logged one run, to the car, in rain.',
    78: 'Neckass paused the film to explain a part that was about to be explained.',
    79: 'Neckass asked the group to confirm by Friday and, when nobody had by Friday, confirmed for them.',
    80: 'Neckass creased his new Jordans walking to the car to photograph them.',
    81: 'Neckass left the video call twelve minutes ago. He is still on it.',
    82: 'Neckass kept a receipt for four years and threw away the warranty.',
    83: 'Neckass went to the store for milk and came home with candles. He has written “milk” on a list, under “candles.”',
    84: 'Neckass said “I’ll get the tip.” He has since requested his half of the tip.',
    85: 'Neckass told the dog, which was sitting, to sit, said “good boy,” and has told four people he is training it.',
    86: 'Neckass put his phone face down to show he was present. He has turned it over nine times.',
    87: 'Neckass walked into a lamppost while reading his phone and told the two people who saw it that he had seen it coming.',
    88: 'Neckass asked “is this on?” It was, and had been for the remark he made just before.',
    89: 'Neckass thanked the ATM and, asked whether he wanted another transaction, said “no, you’ve done enough.”',
    90: 'Neckass waved back at someone waving at the person behind him, and kept waving.',
    91: 'Neckass argued with the GPS until it recalculated, which he has taken as an apology.',
    92: 'Neckass went in for the handshake. The other man went in for the hug. They have both committed to it.',
    93: 'Neckass asked the waiter what he recommended, heard out three dishes, and asked which was most like the chicken.',
    94: 'Neckass pushed a door marked “pull” three times. A child, 6, opened it for him.',
    95: 'Neckass has been carrying a mug to the kitchen for four days, one room at a time. It was last seen in the hall.',
    96: 'Neckass “circled back” to an email by forwarding it to himself.',
    97: 'Neckass told the plumber what the problem was, at length. It was not the problem. According to the invoice, he was charged for the length.',
    98: 'Neckass replied “sounds good” to a message asking which of two dates he could do, and came on a third.',
    99: 'Neckass, the only one to clap when the plane landed, has also done it on a train.',
    100: 'Neckass deleted the exclamation mark from “thanks!” four times and in the end sent two.',
    101: 'Neckass told the doctor his symptoms started “a while ago.” Pressed, he said 2021.',
    102: 'Neckass asked a self-checkout to hang on a second.',
    103: 'Neckass gave a tourist directions and then followed them, to check.',
    104: 'The pilot said “enjoy your stay.” Neckass said “you too” and asked where he was staying.',
    105: 'Neckass pressed the elevator button seven times and told a stranger it helps.',
    106: 'Neckass told the story of how they met to the person he met. Her version is shorter.',
    107: 'Neckass was right about the shortcut. The car is on a sidewalk.',
    108: 'Nobody who was there has forgiven Neckass for insisting the restaurant was on the left, which it was.',
    109: 'Neckass set a reminder to set a reminder, and has dismissed both.',
    110: 'Neckass replied to “my flight is delayed, I will miss dinner” with a thumbs-up.',
    111: 'The other person watched the dots for nine minutes. Neckass sent “ok.”',
    112: 'Neckass listened to a voice note at double speed and asked what it said.',
    113: 'According to three people who could hear it, Neckass turned his camera off “for bandwidth” and ate a full meal.',
    114: 'Neckass’s phone reports seven hours of screen time. He has called the report “broken.”',
    115: 'According to a screenshot she provided, Neckass’s birthday message to his sister began “Certainly! Here is a warmer version.”',
    116: 'Neckass has canceled the same subscription three years in a row. It renews Tuesday.',
    117: 'Neckass left a one-star review of an app for a problem with his phone.',
    118: 'Neckass asked, through the door, whether the delivery driver was the delivery driver.',
    119: 'Neckass liked his own post from a second account he forgot he had.',
    120: 'The cat has been cleared. The puzzle piece was behind the couch, with two chargers and a remote.',
    121: 'A shelf he put up nine days ago is holding. The books are on the floor beside it “until it settles.”',
    122: 'A survey by the Gazette found that nobody at the table has heard the one about the parrot fewer than three times.',
    123: 'According to the colleague with the timer, “quick question” now averages thirty-eight minutes, down from forty.',
    124: 'Neckass’s spades record this season stands at 2–19. Both wins were forfeits.',
    125: 'The out-of-office reply has entered its fourth month. Since Tuesday it has been answering another out-of-office reply.',
    126: 'The gym has confirmed the membership is active. The member was last seen in the lot.',
    127: 'The package on his passenger seat has now been through three car washes.',
    128: 'The second earbud remains at large. The case has been checked five times.',
    129: 'His cousin has asked for the hoodie back by text, by voice note and in person. It was being worn for all three.',
    130: 'The group chat has produced its 11,001st image. It is a screenshot of the group chat.',
    131: 'A second group chat has been created. Neckass is not in it.',
    132: 'A man seen following a school tour at the museum has been identified, and not for the first time.',
    133: 'The smoke alarm has stopped chirping. Its battery is dead.',
    134: 'The café has stopped asking. It is the usual.',
    135: 'A voicemail asking why nobody answers texts has been left for a fourth person.',
    136: 'IT has confirmed that the password is now the old password with a 2 on it.',
    137: 'The reply is still being composed. It was “seen” on the 3rd.',
    138: 'The voice note has been transcribed. It says he is running late and does not say when.',
    139: 'Neckass laughed at a reel in a meeting of nine, farted, and turned to look at a chair across the room. He was standing.',
    140: 'A prediction market on whether Neckass makes the 8:04 has settled “no” on 31 of 31 weekdays. According to the market’s records, his own position, $40 on “yes,” was placed from the shower at 8:01.',
    141: 'Neckass disputed a $14.20 charge with his card company for fifty-one minutes. The agent told him twice that she was there for him. It was for the sandwich he was eating on the call.',
    142: '“Great question,” his smart speaker said when Neckass asked how to tell a friend he would be late, and it read out five ways to say “five minutes away.”',
    143: 'A delivery app wrote to Neckass on the anniversary of his first order to say it was “grateful for the journey.” The journey is 611 orders, 400 of them from the place across the street.',
    144: 'A second new hire has been seated where the copier was. HR is calling it the Foundations Track and has asked Neckass to lead it.',
    145: 'Neckass, who took the stairs on a bad knee for three years, says the office should judge people without regard to their circumstances, provided they can hide them.',
    146: 'A sticky note on Neckass’s monitor has read “focus” since March. It is under three other notes.',
    147: 'Neckass said he was “not really a phone person” on a call that lasted fifty minutes.',
    148: 'Neckass says nobody under 30 can really drive, because they never learned stick. He drives an automatic. The lane assist is on.',
    149: 'Neckass told a public meeting that nobody listens to ordinary people, and asked whether the woman behind him, who was next, would take long.',
    150: 'Episode 41 of Neckass’s podcast on patient empowerment is titled “Who Will Advocate for You When Nobody Says No?”',
    151: 'Neckass’s morning routine has eleven steps and ends at 1:15 p.m. He described it, at 1:40, as “non-negotiable.”',
    152: 'HR proposed making everyone on the floor a Senior Associate. Neckass said that would dilute the title. It comes with no raise. He has the nameplate.',
    153: 'The Committee on Removing Obstacles has asked that its success be measured by the number of obstacles overcome. It says removing them would make that hard to measure.',
    154: 'Neckass has started asking ChatGPT to add typos to his messages, so that people will know they are from him.',
    155: 'Neckass’s cover letter, written by an AI, was screened out by an AI. He has asked his to appeal.',
    156: 'Josephine Cochrane patented a dishwasher in 1886. Neckass, who does not do the dishes, says it has been bad for the people who do.',
    157: 'Neckass asked ChatGPT whether his therapist was manipulating him and brought the answer to therapy. She asked how that felt. He said that was what it said she would say.',
    158: 'Asked at a hearing how his knee was, Neckass said “denied.”',
    159: 'Neckass spent three days on the form in 2019 and is against the new one-page version. “What are they going to learn?” he said. Asked what he had learned, he said “the form.”',
    160: 'Neckass tapes his mouth shut at night on the advice of a podcast. His roommate has asked whether it comes in a daytime version.',
    161: 'Neckass told a video call that remote teams cannot collaborate. He told it again, unmuted, and asked who was sharing.',
    162: 'Neckass has started a business filling out the old form for people, at $80. It is no longer accepted. He has four customers and calls them “serious.”',
    163: 'Neckass says central heating has made families less close, and recalls the evenings everyone stayed in one room because the others were freezing. It was a week in 1998.',
    164: 'Neckass has posted part 12 of a series on the narcissist who did not answer his text. It was a wrong number.',
    165: 'Neckass leaves his gratitude journal open on the counter. Tuesday’s entry thanks “those of us who do the dishes.” He does not do the dishes.',
    166: 'Nearly three-quarters of calls to the Education Department’s call center went unanswered in the new form’s first five months, the GAO found. Neckass said it was the first thing about the form he could respect.',
    167: 'The Coalition to Restore the Long Form, whose membership is Neckass, filed its request on the long form. It was returned, with the short one.',
    168: 'Ohio ordered its state employees back to the office five days a week by March 17, 2025. Neckass, who has never worked for Ohio, called it “a start” and has sent the state a photograph of a parking garage.',
    169: 'Neckass told the pharmacy its two-signature rule is “the last thing in this country that works,” and offered to sign both.',
    170: 'Electric washing machines went on sale in the United States in the early 1900s. Neckass, who takes his laundry to his mother, has asked what today’s children know about wringing.',
    171: 'Neckass flew to four cities this month to say that people should stay home.',
    172: 'Neckass has been told that the form he spent three days on in 2019 was optional. He has asked for the three days.',
    173: 'Ether was first demonstrated publicly in surgery on Oct. 16, 1846. Neckass has requested a meeting about what this has done to patients’ character.',
    174: 'Insurers overturned at least part of 80.7 percent of the Medicare Advantage denials appealed in 2024, KFF found. Neckass, who has won seven, said the system has never failed him.',
    175: 'Neckass’s niece, 7, learned to ride a bike in an afternoon, without a fall. He has asked her to fall.',
    176: 'Neckass has settled whether anyone needs a second language. He tried one, for 212 days.',
    177: 'A subcommittee of the Committee on Removing Obstacles is looking at why the committee has not met. It has not met.',
    178: 'The Committee on Removing Obstacles has hired a consultant to study the obstacles. It is Neckass Advisory, which recommends a study.',
    179: 'Neckass proposed a shorter form in 2021. As chair, he has told a colleague who proposed the same thing that the committee’s position is long-standing.',
    180: 'Neckass told a hearing that automatic approvals would pass two drugs that should not be taken together, and proposed three denials for every patient.',
    181: 'Neckass has come out against automatic approvals, saying they would “take the patient out of patient advocacy.”',
    182: 'Neckass has asked what the library is for. He has had one of its books since March.',
    183: 'The two friends carrying Neckass’s couch up the stairs were told he is in his “soft era.”',
    184: 'Neckass’s passenger rating has fallen to 3.9. He has begun asking drivers, at the start of each ride, what they heard.',
    185: 'Under a July 2026 settlement, pending a judge’s approval, New York’s subway will announce long elevator outages on the platform every fifteen minutes. Neckass, who has never been to New York, said that takes the skill out of it.',
    186: 'Neckass uploaded a menu to a chatbot and asked what he would like. It asked what he usually has. He had the chicken.',
    187: 'Neckass knows which door sticks and says the building has no accessibility problems. He has offered to show a man in a wheelchair how to lift it.',
    188: 'Neckass had his wisdom teeth out in 2007 and has offered to describe it to the children in the waiting room.',
    189: 'An AI companion app suggested Neckass “try talking to people.” He gave it one star and told it why, for an hour.',
    190: 'The group Neckass started to protect the neighborhood’s character has written to next door about her fence, which it calls out of character. The fence went up in 1985.',
    191: 'Neckass thanks his chatbot after every answer, “in case.” The barista, Kai, is still “chief.”',
    192: 'People whose hardship was tied to an achievement are less willing to spare others the same hardship, a 2026 study in PNAS Nexus found. Neckass said he could have told them that, and that they should have had to find out the hard way.',
    193: 'Neckass has taken a forty-minute back way to avoid a toll since 2016. The toll was dropped in 2019. He says the back way is still faster “if you know it.”',
    194: 'Neckass, on a 211-day meditation streak, shouted at his roommate for opening the fridge during it. He gave the session four stars.',
    195: 'Neckass apologized to his sister in a text that began “I want to honor your experience of what I did” and ended “if that’s what happened.”',
    196: 'Told he had parked in someone’s spot, Neckass called it “a really interesting case study in how people respond to boundaries.” It was their spot.',
    197: 'Neckass lists “angel investor” in his bio, having lent a friend $200 for a clothing brand. He has asked for a seat on the board. There is a shirt.',
    198: 'Neckass told a cruise director that his great-grandfather came over in steerage, and asked where the character development was. He was in the buffet line.',
    199: 'Neckass has looked into why healthcare cannot be made cheaper and reports that it is expensive.',
    200: 'Neckass had a filling without novocaine in 2017, by mistake, and has since told the waiting room that novocaine is “a choice.”',
    201: 'Neckass says billionaires should not exist, with one exception, who blocked him in 2023.',
    202: 'Neckass has memorized every delay on his line and says the railway is perfectly predictable. He carries three timetables, none published by the railway.',
    203: 'Neckass knows the three train entrances that do not smell of urine and calls the system “honestly excellent.” He will not say which three.',
    204: 'Neckass waited nine hours for a copy of his birth certificate and says faster service would encourage frivolous requests. The wait, he said, gave him time to consider whether he needed it. He left without it.',
    205: 'Neckass leaves three hours early and says the trains are reliable. He considers the three hours personal time.',
    206: 'Told that a pill now does what his 2018 surgery did, Neckass asked the doctor what the pill builds.',
    207: 'Neckass paid $39 to board first and sat for forty minutes watching everyone else get on. He told the man in 14B it was “worth it.”',
    208: 'Neckass, who does not have diabetes, wears a glucose monitor. He has told his niece, 7, that her banana is “a lot.”',
    209: 'The federal student aid form was cut from more than 100 questions to as few as 18 for some applicants, the GAO said. The Coalition to Restore the Long Form has asked what they are going to learn.',
    210: 'Neckass does not care for music and has asked the concert hall for attendance figures and a list of the songs.',
    211: 'Neckass paid $900 to become a notary in 2018 and says making it cheaper would endanger the public. He has notarized one document. It was his own.',
    212: 'Neckass says canceling his gym is “straightforward.” You send a notarized letter to Delaware. He was told Tuesday that it can be done online, and has asked that this not get around.',
    213: 'Neckass said “we need to normalize taking a lunch break.” He said it at lunch, to a table of people taking a lunch break.',
    214: 'John Snow traced a cholera outbreak to a London water pump in 1854, and the handle was taken off. Neckass has asked who approved that, and whether anyone spoke to the people using the pump.',
    215: 'Neckass’s profile photo was generated by AI. At a conference Tuesday a woman who has followed him for a year asked whether he was the man’s brother.',
    216: 'Neckass said “let me just finish this email” in March. The email is to his landlord, about March.',
    217: 'Neckass got out of a building in a fire in 2011, he said, and opposes sprinklers. “People deserve to find out what they are capable of,” he said. It was a drill.',
    218: 'Neckass, who learned to reverse without a camera, says it should involve “a little danger.” He has since reversed into next door’s bin, twice, and blamed the wind.',
    219: 'Neckass is holding places in the DMV line at 5 a.m., for $40. He tells his customers they are missing the best part.',
    220: 'HR asked Neckass how the form works. He told them, correctly, for an hour. Then he told them it would be staying.',
    221: 'Neckass says college is overrated and that his certificate should be required.',
    222: 'Neckass emailed a colleague at midnight and, at 12:20, asked why she was not hungry for this.',
    223: 'Neckass posted “the internet is not real life” and has been in the replies for six hours. There are two replies.',
    224: 'Neckass said a universal basic income would ruin retirement. “How are you supposed to enjoy not working?” he said. He has not started saving.',
    225: 'Neckass, who has no children, has asked to see the playground’s budget. He has questions about the slide.',
    226: 'A tool Neckass set up to answer his email told his landlord it was “excited to explore this further.” The email was a notice to vacate.',
    227: 'Neckass waited five months for a therapist and has asked that nobody else get in sooner, saying the waiting “is the work.”',
    228: 'Neckass’s podcast on patient empowerment has reached Episode 40. The sponsor sells binders.',
    229: 'By 1918 every state required children to attend school. Neckass says they would have gone anyway, if they had wanted it more.',
    230: 'Neckass has memorized the exceptions in the office expense policy and says it is simple. His guide to it is sixty pages.',
    231: 'Neckass told his niece, 7, that the bus is why her generation does not know where school is. He went to the one across the street, and has asked the district to reinstate the hill.',
    232: 'Neckass has settled the question of whether children need recess. He did not like it.',
    233: 'Neckass now calls his nap a “non-sleep deep rest protocol.” He was woken by the snoring.',
    234: 'Neckass learned Tuesday that you can renew online. He went to the DMV at 5 a.m. to complain. He has described the line as “not bad.”',
    235: 'A colleague who can see Neckass’s screen reports that, during the two hours he blocks each day for “deep work,” he is color-coding the block.',
    236: 'Neckass’s insurer approved a claim on the first try. He has appealed.',
    237: 'Episode 9 of Neckass’s podcast, “On Listening,” is ninety minutes long. The guest speaks twice, to ask for water.',
    238: 'Neckass has not stopped for lunch since 2014, he said, and wants to know why younger colleagues need so many meals. He said this eating at his desk.',
    239: 'After four hours in the emergency room, Neckass said the real problem was all the other people with emergencies.',
    240: 'Neckass told the waiting room that if care were free, people would go to the doctor.',
    241: 'Neckass, who has no children, says flexible schedules are unfair, and that everyone should have the same opportunity to miss important family events.',
    242: 'Neckass taught himself guitar, for a week in 2021, and says lessons undermine musicianship. He has not gotten to the bridge.',
    243: 'About one in nine Medicare Advantage denials was appealed in 2024, KFF found. Neckass said the other eight should have wanted it more.',
    244: 'Neckass told remote colleagues they are missing the professional development that happens in traffic. His commute is eleven minutes, with the seat heater on.',
    245: 'On Sundays, which he keeps as a “tech sabbath,” Neckass’s roommate reads him his texts.',
    246: 'Neckass told HR that paying interns would attract the wrong people, and that the company wants people willing to make sacrifices. His mother paid his rent until 2011.',
    247: 'Neckass told a date he wants something that “unfolds organically,” and showed her the roadmap. She meets his mother in Q2.',
    248: 'The Committee on Removing Obstacles reports that 100 percent of the people who got through the process got through it. It calls this the completion rate.',
    249: 'Neckass says his internet company has “excellent support.” You call at 6:01 a.m., say “agent” four times and ask for Denise.',
    250: 'Neckass’s eulogy for his grandfather was well received. The prompt, seen by the Gazette, read “warm, three minutes, he liked boats?”',
    251: 'Neckass says he has never needed public assistance, and would like to know why nobody has asked him.',
    252: 'Neckass told his sister “no is a complete sentence.” She had asked whether he had picked up their mother, who was at the airport.',
    253: 'Neckass asked ChatGPT how to stop using ChatGPT so much. It gave him a seven-step plan and offered to check in daily. He said yes.',
    254: 'Neckass said forgiving student debt would leave borrowers with nothing to overcome, and has offered to go on accepting payments personally.',
    255: 'Neckass told the podcast that surgery fixed his knee but the denials taught him to fight for it. The insurer has asked to use the quote.',
    256: 'Neckass charges $40 an hour to teach people to negotiate medical bills and opposes posted hospital prices, which he says would cost patients a chance to develop financial literacy.',
    257: 'Neckass carries three battery packs and says his phone’s battery life is “honestly great.”',
    258: 'Neckass has settled the matter of whether people need vacations. He took one in 2019. It rained.',
    259: 'Neckass opposes fixing the fourth step at No. 12. He has developed an efficient way of skipping it and would hate to lose it.',
    260: 'The office let staff buy their parking spaces at a discount in 2019. Neckass bought his and says anyone can do the same. There are none left.',
    261: 'Neckass’s dating profile says he worries about what AI will do to human creativity. It wrote that.',
    262: 'Neckass came into $1,200 and has decided what his cousin needs. It is not money. He has bought him a library card.',
    263: 'Neckass described going to the store without headphones as a “dopamine detox.” He had left them in the car. He went back.',
    264: 'Neckass told next door that a snowblower would “make people soft.” Next door is 71, and was shoveling his walk.',
    265: 'Neckass described his commute as “brutal.” It is eleven minutes, with the seat heater on.',
    266: 'Neckass told the waiter there was “a lot coming up” for him. The waiter had asked about still or sparkling.',
    267: 'Neckass worked nights for six years at his first job and learned last week that a day shift was available the entire time. He has written to the company, which he left in 2012, asking that it be discontinued.',
    268: 'Neckass said nobody wants to work anymore, in Module 3 of his course on passive income.',
    269: 'Neckass has had no hot water since Sunday and has told four people he is doing cold plunges.',
    270: 'Neckass has rejected consumer culture and bought a new wardrobe to reflect it. It is undyed. It came in four boxes.',
    271: 'A colleague got a raise by asking for one. Neckass, who has been waiting since 2017, has asked HR whether she understood the process.',
    272: 'Neckass has made a “dopamine menu” and taped it to the fridge. Item one is “open fridge.”',
    273: 'Ford gave its factory workers a five-day week on May 1, 1926. Neckass says nobody has built anything since.',
    274: 'Neckass’s uncle taught him to swim by throwing him in a lake. He opposes lessons, saying the important thing is that he survived. He was pulled out by a lifeguard, who had taken lessons.',
    275: 'The night certificate is required again, and nobody can be hired without it. Neckass has pointed to this as proof that it was needed.',
    276: 'Neckass, who has never broken a bone, questions the need for casts. He says he has managed perfectly well without one.',
    277: 'With a man behind him in line, Neckass tipped a self-checkout 20 percent.',
    278: 'The fast Neckass describes as “life-changing” runs until noon. He gets up at noon.',
    279: 'Neckass says there is plenty of parking on his street. He gets up at 4:30 to move the car.',
    280: 'Neckass has memorized his doctor’s hours and says care is easy to get. He recommends that people arrange their illnesses accordingly.',
    281: 'Neckass told the Gazette he does not really use AI. He read this from his phone, and asked whether we wanted it shorter.',
    282: 'Since Jan. 1, 2026, a federal rule has given Medicare Advantage plans seven days to answer a routine prior authorization request. Neckass said nobody finds their voice in seven days.',
    283: 'Neckass, who does not believe in labels, has asked a woman to stop calling herself single, and to stop calling him her boyfriend.',
    284: 'Connecticut became the first state to require paid sick leave, in 2011. Neckass has worked through the flu six times and would like that recognized in the policy.',
    285: 'Neckass told the notaries’ association the door should stay open, but only as far as it was when he squeezed through.',
    286: 'An employer asked Neckass to upload his résumé and then type it out. He typed “see résumé” in fourteen fields and was advanced to the next round.',
    287: 'The Fair Labor Standards Act restricted child labor in 1938. Neckass, who had a paper route for one summer, says it has cost young people valuable experience, and has offered his niece, 7, a position.',
    288: 'Told at dinner that he had the date wrong, Neckass said “great catch” and went on with the date.',
    289: 'Neckass, laid off without warning, opposes advance notice, saying it taught him employers cannot be trusted and that younger workers should learn that too.',
    290: 'Neckass asked a friend whether he was free Saturday and would not say for what. The friend said he was. It is a couch. It is on the third floor.',
    291: 'Neckass told an intern that working for free “built me.” It was a week at his uncle’s, in 2008. His uncle paid him.',
    292: 'Neckass asked the group when everyone was free and, when they had said, told them Thursday.',
    293: 'Neckass says the roof at No. 12 does not need repairs. He moves the buckets twice a day and has never had a problem.',
    294: 'Neckass is selling a $499 course on insurance appeals. Refunds are denied at first, and available on appeal.',
    295: 'Asked for October’s rent, Neckass told his landlord he was “not available for that energy.” The landlord has replied, with the lease.',
    296: 'Neckass told a public meeting that affordable housing would bring in people who cannot afford the neighborhood. He is two months behind on the rent.',
    297: 'ChatGPT told Neckass his idea was “genuinely novel.” He has put the quote on the deck. The idea is a calendar.',
    298: 'Bette Nesmith Graham invented correction fluid in the 1950s. Neckass, who learned to type in 2001, on a computer, says every fifth mistake should still require a new sheet of paper.',
    299: 'The colleagues’ group Neckass started to win dental coverage has come out against the company’s offering it. It says people would get it without joining.',
    300: 'Neckass told his dentist that his grandfather had his teeth pulled without anesthetic in 1931, and that people do not respect their teeth anymore. He is two years overdue for a cleaning.',
    301: 'Neckass asked ChatGPT whether he overthinks. He has rephrased the question eleven times, to be sure.',
    302: 'Neckass told a new father at work that he “never got paternity leave and turned out fine.” He has no children.',
    303: 'Neckass spent a weekend vibe-coding an app to replace a spreadsheet with four rows. He tracks the app’s bugs in a spreadsheet. It has nine rows.',
    304: 'Neckass told his doctor he had “already run it by ChatGPT” and was there for a second opinion. He has asked her to cite her sources.',
    305: 'Neckass has seen the sun come up on most days since 2006 and says it is the best part of his life. It may be. He has asked that it be required.',
    306: 'Neckass’s smart lock kept him on the step for forty minutes during a security update. It then notified him that someone was at the door.',
    307: 'Neckass said that if aging is cured, living forever will not mean what it used to.',
    308: 'New York became the first state to require seat belts, in 1984. Neckass, who was once in a crash without one and says he is fine, is available to testify.',
    309: 'Neckass told a colleague on a video call that working from home is “cheating,” since she has not experienced the parking garage. He has sent her a photo of it.',
    310: 'Neckass pasted an argument with his roommate into a chatbot, which found for him. The ruling is on the fridge.',
    311: 'Neckass spent an afternoon opening a jar and says the new lid removes the sense of accomplishment. He has kept the old lid.',
    312: 'Neckass says he is practicing radical honesty. So far it has covered other people’s haircuts and has not reached the $40.',
    313: 'Neckass told a houseguest to “make yourself at home,” and has since asked him to use the other towel, the other glass and the other door.',
    314: 'Neckass says he does not want a transactional relationship and has mentioned the appetizer from August four times.',
    315: 'Neckass was hurt to learn that his sister used a chatbot to answer his apology, which a chatbot wrote. He has asked which one she uses.',
    316: 'Neckass has called a gas-station sandwich “life-changing” to four people and asked the gas station whether it caters.',
    317: 'His watch congratulated Neckass on a 90-day streak. For the last eleven days he has shaken his arm on the couch at 11:50 p.m.',
    318: 'Neckass asked a colleague what she was doing this weekend, twice, and said “must be nice.” She is having a tooth out.',
    319: 'Neckass has learned to start the printer by opening and closing the tray three times. He opposes replacing it, saying people “just need to learn it.”',
    320: 'Neckass said the trains are “fully accessible, if you know which elevators work.” He has a spreadsheet, and offered to send it to a woman with a stroller at the bottom of the stairs.',
    321: 'Neckass says email took the meaning out of correspondence, and that six weeks is about the right time for a reply. It is how long he takes.',
    322: 'HR has brought back the night certificate for one position, that of the colleague, 26. Neckass teaches the class.',
    323: 'Neckass told the plumber not to fix the shower, which works if you hit the pipe. He said that if it were fixed, “anyone could use it.”',
    324: 'Neckass posted on LinkedIn about the importance of work-life balance at 11:47 p.m. and was in the comments until two.',
    325: 'Neckass opposes removing the password from the shared drive, which took him two years to learn, saying it would threaten security. He cannot remember what is on the drive.',
    326: 'Neckass, who quit smoking in 2014 without a patch, told a man wearing one that it “doesn’t count.” He told him in the smoking area, where he goes to tell people.',
    327: 'Neckass says housing is a matter of timing, and advises younger buyers to have purchased earlier. He rents.',
    328: 'Neckass posted “a lot of you aren’t ready for this conversation,” followed by his view that dogs are good.',
    329: 'Neckass completed a six-week course on active listening and interrupted the instructor to say so.',
    330: 'Neckass has proposed that students show not only their work but how much they struggled. He did the tip on his phone.',
    331: 'Neckass, the last person added to the group chat, in 2021, has opposed adding anyone else. He said the chat “has a character.”',
    332: 'Neckass said he “hears that you experienced me as late.” He arrived at 8:40 for seven.',
    333: 'The one listener of Neckass’s podcast has been identified, from the app’s records, as Neckass, at night, asleep.',
    334: 'Neckass sat in on an interview and has told HR it was not rigorous, because nobody cried.',
    335: 'Neckass hiked up a mountain in 2016 and says people who took the cable car have not really seen the view. He has asked the summit for separate viewing areas. He took the cable car down.',
    336: 'Neckass said universal translation will destroy communication. “Nobody wants to misunderstand each other anymore,” he said. He can say “the boy eats an apple.”',
    337: 'Neckass says he hates corporate jargon, which he called, at lunch, “a real headwind to alignment.”',
    338: 'Neckass’s seminar on burnout is $299. He has come out against shorter hours, warning that companies would have trouble identifying who needs it.',
    339: 'Neckass, who has no children, wrote to the elementary school asking it to justify its existence. It sent back his fourth-grade report card.',
    340: 'Neckass read that lab-grown organs could arrive by 2040 and has asked for a waiting period. He has both kidneys.',
    341: 'Neckass, who has never needed assistance, worries that a simpler form would let people get it without first demonstrating sufficient desperation.',
    342: 'Neckass, who has never been hungry, says food assistance encourages eating.',
    343: 'Neckass has calculated how much less character borrowers would develop at a lower interest rate. It is 14 percent.',
    344: 'Neckass said assistance should be reserved for people who can get by without it.',
    345: 'Neckass, who sits at a desk, told the office his “door is always open.” His scheduling link shows the next opening as Feb. 9.',
    346: 'Neckass, who has not been downtown since 2022, submitted a map of where the bike lanes should go. They go somewhere else.',
    347: 'Neckass asked an AI to summarize a two-line text from his mother. The summary was three lines and recommended that he call her.',
    348: 'Neckass opposes replacing the timesheet system, which only he can fix, saying it would erase years of institutional knowledge. Most of it is where the button is.',
    349: 'Neckass told his sister not to get him anything for his birthday. She did not. He has told four people what it was.',
};

// The items that open on something that happened, by number, and where it
// is reported. The page sets a footnote mark where the first sentence ends
// and prints “That sentence is true:” and this, as a link, at the foot of
// the column (modules/render.js), so every entry's first sentence has to be
// the fact and only the fact. An item with no entry is the paper's from end
// to end, whatever it attributes to an agency or a hearing. Checked
// November 2026.
export const REAL_SOURCES = {
    156: {
        cite: 'Smithsonian Magazine',
        url: 'https://www.smithsonianmag.com/smart-news/time-saving-patent-paved-way-modern-dishwasher-180967656/',
    },
    166: {
        cite: 'GAO, Sept. 24, 2024',
        url: 'https://www.gao.gov/products/gao-24-107407',
    },
    168: {
        cite: 'AP, Feb. 4, 2025',
        url: 'https://www.fox19.com/2025/02/04/ohio-governor-orders-state-employees-back-in-office-work-5-days-week-starting-march/',
    },
    170: {
        cite: 'Institution of Mechanical Engineers',
        url: 'https://www.imeche.org/about-us/imeche-engineering-history/mechanical-engineering-history-timeline/1890s-1900s',
    },
    173: {
        cite: 'UTMB, on William Morton',
        url: 'https://www.utmb.edu/osler/hall-of-history/morton',
    },
    174: {
        cite: 'KFF, Jan. 28, 2026',
        url: 'https://www.kff.org/medicare/medicare-advantage-insurers-made-nearly-53-million-prior-authorization-determinations-in-2024/',
    },
    185: {
        cite: 'Disability Rights Advocates, July 29, 2026',
        url: 'https://dralegal.org/press/ny-subway-elevators-settlement/',
    },
    192: {
        cite: 'Kim, Gneezy and Imas, PNAS Nexus, 2026',
        url: 'https://doi.org/10.1093/pnasnexus/pgag128',
    },
    209: {
        cite: 'GAO, Sept. 24, 2024',
        url: 'https://www.gao.gov/products/gao-24-107407',
    },
    214: {
        cite: 'London Museum',
        url: 'https://www.londonmuseum.org.uk/collections/london-stories/john-snow-cholera-broad-street-pump/',
    },
    229: {
        cite: 'Boston Magazine, 2018',
        url: 'https://www.bostonmagazine.com/education/2018/05/17/tbt-compulsory-education-massachusetts/',
    },
    243: {
        cite: 'KFF, Jan. 28, 2026',
        url: 'https://www.kff.org/medicare/medicare-advantage-insurers-made-nearly-53-million-prior-authorization-determinations-in-2024/',
    },
    273: {
        cite: 'History.com',
        url: 'https://www.history.com/this-day-in-history/may-1/ford-factory-workers-get-40-hour-week',
    },
    282: {
        cite: 'CMS, final rule, Jan. 17, 2024',
        url: 'https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-and-prior-authorization-final-rule-cms-0057-f',
    },
    284: {
        cite: 'Morgan Lewis, 2011',
        url: 'https://www.morganlewis.com/pubs/2011/07/connecticut-becomes-first-state-to-pass-mandatory-paid-sick-leave-law',
    },
    287: {
        cite: 'U.S. Department of Labor',
        url: 'https://www.dol.gov/general/aboutdol/history/flsa1938',
    },
    298: {
        cite: 'Mental Floss, on Bette Nesmith Graham',
        url: 'https://www.mentalfloss.com/history/retrobituaries-how-inventor-liquid-paper-bette-nesmith-graham-helped-launch-mtv',
    },
    308: {
        cite: 'EBSCO, on the New York law',
        url: 'https://www.ebsco.com/research-starters/law/new-york-state-imposes-first-mandatory-seat-belt-law',
    },
};
