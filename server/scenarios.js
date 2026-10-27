// server/scenarios.js — hand-crafted mystery pack for The Old Zoo Mystery.
// Zero-API: pickScenario() returns one of these at random. No AI key needed.
// Setting: the fictional Old Zoo of Velmara, founded 1894, in the fictional
// old city of Velmara. Every case: one vanished animal, one culprit, fair clues,
// one red herring, and scripted interrogation answers ("tells") per suspect.
// Narration is capped at ~60 words per beat for phone screens.

export const CITY = 'Velmara';
export const ZOO = 'The Old Zoo of Velmara';

export const SCENARIOS = [
  // ==================== 1. THE WHITE TIGER ====================
  {
    title: 'The Vanishing of Moon',
    animal: 'Moon, a white tigress, the zoo\u2019s star since 2019',
    setting: 'The Tiger House, Old Zoo of Velmara. Dawn, mist on the moat, one empty cage.',
    method: 'Drugged meat at midnight, then out through the service gate in a laundry cart.',
    timeline: [
      '9:00 PM \u2014 last visitors leave; Moon is fed and locked in for the night.',
      '11:40 PM \u2014 the night guard logs a routine patrol past the Tiger House.',
      '12:15 AM \u2014 the service-gate camera blinks out for nine minutes.',
      '12:30 AM \u2014 a laundry cart rolls out toward the old delivery yard.',
      '6:00 AM \u2014 the keeper finds Moon\u2019s cage open, the lock uncut, the straw undisturbed.',
    ],
    clues: [
      'A spent tranquilizer dart in the straw \u2014 the dose matches the vet\u2019s cabinet, not a poacher\u2019s kit.',
      'Muddy boot prints, size 46, lead from the Tiger House to the service gate \u2014 and stop there.',
      'The service-gate log shows a 2 AM entry that no one on staff admits to making.',
    ],
    redHerring: 'The curator has been quietly negotiating the sale of zoo land to developers.',
    truth: 'Dario Venn, the night guard, owed gambling debts and let a collector\u2019s men in through the service gate during the camera blackout. He drugged Moon\u2019s meat himself so the men never had to touch the cage.',
    reveal: 'The dart gave it away \u2014 a vet\u2019s dose, not a poacher\u2019s. And only one person held the service-gate key and a debt big enough to open it. Dario Venn didn\u2019t guard the Tiger House that night. He sold it.',
    suspects: [
      {
        name: 'Dario Venn', occupation: 'night guard', relation: 'held the service-gate key that night',
        secret: 'He owes a gambling debt large enough to lose his house over.', isCulprit: true,
        persona: 'Tired, jokes too much, answers a question with a question.',
        plea: 'I never wanted the tiger hurt. I just needed the debt gone. You have to believe I meant to make it right.',
        tells: [
          ['camera|blackout|12:15|gate log|2 am|entry', 'Cameras blink. Old wiring, old zoo. You want a conspiracy, check the electrician, not me.'],
          ['debt|gambling|money|owe', 'Everybody owes somebody something. That doesn\u2019t make me a thief.'],
          ['dart|drugged|meat|tranquilizer', 'Darts are the vet\u2019s business. I carry a flashlight and a thermos, detective.'],
          ['boot|prints|46|mud', 'Size 46? Half the staff wears big boots. Try the grounds crew.'],
        ],
      },
      {
        name: 'Amara Osei', occupation: 'head keeper', relation: 'Moon\u2019s keeper for five years',
        secret: 'She forged Moon\u2019s feeding logs to cover a vet visit she forgot to book.', isCulprit: false,
        persona: 'Fierce, protective of the animals, furious at being suspected.',
        tells: [
          ['moon|tiger|fed|logs', 'I fed Moon myself at nine. She was fine. She trusted me, and I failed her \u2014 but I did not take her.'],
          ['vet|visit|forgot', '...I missed a checkup. Paperwork, not a crime. Don\u2019t you dare make it one.'],
          ['guard|dario|gate', 'Dario? He naps on shift. Everyone knows it. But napping isn\u2019t stealing a tiger.'],
        ],
      },
      {
        name: 'Felix Brandt', occupation: 'zoo vet', relation: 'controlled the tranquilizer cabinet',
        secret: 'He has been pocketing tranquilizer doses to sell to a farm upstate.', isCulprit: false,
        persona: 'Precise, clinical, annoyed at amateurs handling his drugs.',
        tells: [
          ['dart|tranquilizer|cabinet|dose', 'Yes, the dose matches my cabinet. So does every legal dart in this zoo. Count them yourself.'],
          ['sell|pocket|farm', 'I run a clean clinic. Accuse me again and I\u2019ll show you the inventory sheets.'],
          ['moon|drugged', 'A drugged tiger is a calm tiger. Whoever did this knew animals. That\u2019s half the staff.'],
        ],
      },
      {
        name: 'Ines Marlowe', occupation: 'curator', relation: 'runs the zoo\u2019s business',
        secret: 'She has been negotiating the sale of zoo land to developers in secret.', isCulprit: false,
        persona: 'Polished, corporate, treats the zoo like a balance sheet.',
        tells: [
          ['land|sale|developers', 'The land talks are real and they are legal. A missing tiger hurts the sale, it doesn\u2019t help it.'],
          ['money|collector', 'If I wanted money, I\u2019d sell the car park, not smuggle a tiger in a laundry cart.'],
          ['gate|key', 'Keys are logged. Check the log instead of my motives.'],
        ],
      },
      {
        name: 'Tomas Rook', occupation: 'groundskeeper', relation: 'tends the paths by the Tiger House',
        secret: 'He was asleep in the tool shed during the midnight patrol window.', isCulprit: false,
        persona: 'Slow-talking, unbothered, smells faintly of cut grass.',
        tells: [
          ['asleep|shed|patrol', 'I dozed off, sure. A man can doze. I didn\u2019t hear a cart, a tiger, or a marching band.'],
          ['boot|mud|prints', 'My boots are 44. Measure them. I\u2019m not your size 46.'],
          ['cart|laundry|delivery', 'Carts roll all night. Laundry, feed, rubbish. Nobody looks twice. That\u2019s the point, isn\u2019t it?'],
        ],
      },
      {
        name: 'Lila Fern', occupation: 'gift-shop clerk', relation: 'sold tiger souvenirs all day',
        secret: 'She sells fake \u201ctiger whisker\u201d keychains made from fishing line.', isCulprit: false,
        persona: 'Bubbly, nervous, overshares about the shop.',
        tells: [
          ['souvenir|whisker|shop', 'Okay, the whiskers are fake! Fishing line! But fake souvenirs aren\u2019t a stolen tiger.'],
          ['collector|buyer', 'Collectors come in the shop all the time. They buy postcards. I don\u2019t sell them tigers.'],
          ['night|where', 'Home, asleep, like a normal person. The shop closes at nine. Ask the till roll.'],
        ],
      },
    ],
  },

  // ==================== 2. THE RED PANDA ====================
  {
    title: 'Ember\u2019s Empty Branch',
    animal: 'Ember, a red panda, the children\u2019s favourite',
    setting: 'The Bamboo House, Old Zoo of Velmara. Morning feeding, one empty branch.',
    method: 'Swapped transport papers, then carried out in a pet carrier at closing time.',
    timeline: [
      '4:00 PM \u2014 Ember\u2019s enclosure is cleaned and her papers checked for a routine transfer.',
      '5:30 PM \u2014 a staff member signs a transfer form nobody remembers authorizing.',
      '6:00 PM \u2014 closing time; a pet carrier leaves through the staff exit.',
      '7:00 AM \u2014 the morning keeper finds the branch empty and the papers wrong.',
    ],
    clues: [
      'The transfer form uses the vet tech\u2019s signature \u2014 but the handwriting leans the wrong way.',
      'A pet carrier wheel left a fresh track through the staff exit, over still-wet paint.',
      'Ember\u2019s favourite bamboo shoots are untouched \u2014 she never skips dinner unless she\u2019s already gone.',
    ],
    redHerring: 'A wealthy visitor offered the zoo a fortune for Ember the week before.',
    truth: 'Nadia Kaur, the vet tech, forged a transfer form and smuggled Ember out for an exotic-pet dealer who paid her brother\u2019s medical bills. The dealer\u2019s van was waiting at the staff exit.',
    reveal: 'The signature was close, but the handwriting leaned the wrong way. Nadia Kaur forged the transfer, packed Ember like luggage, and sold a children\u2019s favourite to pay a hospital bill. The branch has been empty since.',
    suspects: [
      {
        name: 'Nadia Kaur', occupation: 'vet tech', relation: 'handled Ember\u2019s transfer papers',
        secret: 'Her brother\u2019s hospital bills are months overdue.', isCulprit: true,
        persona: 'Kind, exhausted, deflects with worry about her family.',
        plea: 'I did it for my brother. I know that doesn\u2019t make it right. But he was going to lose everything.',
        tells: [
          ['signature|papers|transfer|form', 'I sign forms all day. Anyone could copy it. Ask the front office.'],
          ['dealer|van|carrier|pet', 'A pet carrier? Staff carry animals all the time. That\u2019s the job.'],
          ['brother|hospital|bills|medical', 'My brother is sick. That\u2019s private. It doesn\u2019t make me a smuggler.'],
          ['handwriting|lean', 'Handwriting changes when you\u2019re tired. I was tired. We\u2019re all tired.'],
        ],
      },
      {
        name: 'Omar Haddad', occupation: 'head keeper', relation: 'fed Ember every morning',
        secret: 'He once let a visitor hold Ember for a photo, against every rule.', isCulprit: false,
        persona: 'Warm, guilty about rules, loves the animals openly.',
        tells: [
          ['ember|fed|bamboo', 'She never skips dinner. When the shoots were untouched, I knew. I knew before I checked.'],
          ['photo|visitor|hold', '...Once. One photo. A kid. I\u2019m not proud. But I never let her leave the zoo.'],
          ['transfer', 'Nobody told me about a transfer. I\u2019d have fought it. Ember wasn\u2019t going anywhere.'],
        ],
      },
      {
        name: 'Petra Novak', occupation: 'curator', relation: 'approved all animal transfers',
        secret: 'She approved a transfer last year that turned out to be a dealer front.', isCulprit: false,
        persona: 'Careful, paper-obsessed, terrified of another scandal.',
        tells: [
          ['approved|transfer|last year', 'Last year taught me to check everything twice. That\u2019s why this forgery angers me so much.'],
          ['signature|form', 'My approval isn\u2019t on that form. Look. It\u2019s not there.'],
          ['visitor|fortune|offer', 'Rich visitors offer fortunes every week. We say no every week. That\u2019s the job.'],
        ],
      },
      {
        name: 'Jonas Feld', occupation: 'volunteer photographer', relation: 'photographed Ember daily',
        secret: 'He sells his zoo photos online without permission.', isCulprit: false,
        persona: 'Chatty, artsy, always holding a camera.',
        tells: [
          ['photo|camera|sell', 'I sell prints, not pandas. There\u2019s a difference, and it\u2019s a big one.'],
          ['staff exit|carrier', 'I was at the staff exit shooting the sunset. I saw a carrier. I thought it was a vet run.'],
          ['ember|where', 'If I knew where she was, I\u2019d have run there myself. Camera and all.'],
        ],
      },
      {
        name: 'Rosa Lind', occupation: 'groundskeeper', relation: 'painted the staff exit that day',
        secret: 'She left the paint wet and the exit unguarded to finish early.', isCulprit: false,
        persona: 'Blunt, practical, no patience for drama.',
        tells: [
          ['paint|wet|track', 'The paint was wet because I was behind schedule. The track proves a carrier left. It doesn\u2019t prove whose.'],
          ['exit|unguarded', 'I left early. Guilty. But I didn\u2019t carry anything out except my brushes.'],
          ['carrier|wheel', 'Ask who owns a carrier with those wheels. Not me. I own a bicycle.'],
        ],
      },
      {
        name: 'Samir Elmi', occupation: 'education officer', relation: 'ran the children\u2019s panda club',
        secret: 'He has been skimming the panda club\u2019s donation box.', isCulprit: false,
        persona: 'Earnest, child-focused, horrified by the whole affair.',
        tells: [
          ['donation|club|children', 'The kids are devastated. That\u2019s what matters. Not your theories.'],
          ['skim|box|money', '...The box was light sometimes. For bus fares. For the kids. Not for me.'],
          ['visitor|fortune', 'That visitor asked me about Ember twice. I told him she wasn\u2019t for sale. Twice.'],
        ],
      },
    ],
  },

  // ==================== 3. THE SNOW LEOPARD ====================
  {
    title: 'Ghost on the Rocks',
    animal: 'Ghost, a snow leopard, almost never seen by visitors',
    setting: 'The Rock Enclosure, Old Zoo of Velmara. Dawn patrol, one cut fence.',
    method: 'Fence cut at the blind corner, then a tranquilized leopard carried out in a tarp.',
    timeline: [
      '10:00 PM \u2014 Ghost is last seen on the high rock, asleep in the cold.',
      '11:20 PM \u2014 a grounds vehicle makes an unscheduled trip to the rock enclosure.',
      '1:00 AM \u2014 the fence camera at the blind corner goes dark.',
      '5:30 AM \u2014 the morning patrol finds the fence cut and the rock empty.',
    ],
    clues: [
      'The fence was cut with professional shears \u2014 the grounds shed\u2019s pair is missing.',
      'Tarp fibres, grey and heavy-duty, snagged on the cut fence wire.',
      'A grounds vehicle log shows an 11:20 PM trip nobody signed for.',
    ],
    redHerring: 'A rival zoo offered Ghost\u2019s keeper triple pay the month before.',
    truth: 'Karel Vos, the groundskeeper, cut the fence for a poaching ring that paid him to clear a gambling debt. He drove the grounds vehicle to the blind corner and helped carry Ghost out under a tarp.',
    reveal: 'The shears were the zoo\u2019s own, the vehicle log unsigned, the tarp grey and heavy. Karel Vos cut the fence he was paid to mend, and Ghost \u2014 the leopard nobody ever saw \u2014 vanished for good.',
    suspects: [
      {
        name: 'Karel Vos', occupation: 'groundskeeper', relation: 'maintained the rock enclosure fence',
        secret: 'He owes money to the same men who run the local betting ring.', isCulprit: true,
        persona: 'Gruff, quiet, answers in short sentences.',
        plea: 'I didn\u2019t know they\u2019d take her that night. I thought I was just... leaving a gate loose. I\u2019m sorry.',
        tells: [
          ['shears|fence|cut', 'Shears go missing. Tools walk off. This is a zoo, not a bank vault.'],
          ['vehicle|11:20|log|trip', 'Vehicles move at night. Feed runs, vet runs. Logs get missed.'],
          ['debt|betting|gambling|money', 'My money is my business. I fix fences. That\u2019s what I do.'],
          ['tarp|grey|fibre', 'Tarps are everywhere here. Covering feed, covering tools. Pick one.'],
        ],
      },
      {
        name: 'Yuki Tanaka', occupation: 'head keeper', relation: 'Ghost\u2019s keeper for three years',
        secret: 'She once left the enclosure gate unlatched for a whole night by mistake.', isCulprit: false,
        persona: 'Quiet, devoted, speaks of Ghost like family.',
        tells: [
          ['ghost|rock|asleep', 'She slept on the high rock. She trusted that rock. Someone took that from her.'],
          ['gate|unlatched|mistake', 'Once. One night, years ago. I checked every gate twice since. Every night.'],
          ['rival|pay|offer', 'They offered me money to leave. I stayed. Ghost stayed. That should count for something.'],
        ],
      },
      {
        name: 'Dmitri Orlov', occupation: 'night guard', relation: 'patrolled the rock enclosure',
        secret: 'He was watching videos on his phone instead of patrolling after midnight.', isCulprit: false,
        persona: 'Sheepish, young, tries to sound professional.',
        tells: [
          ['patrol|phone|video|midnight', '...I checked my phone. Ten minutes. Maybe twenty. But I didn\u2019t cut anything.'],
          ['camera|dark|1 am|blind', 'The blind corner camera dies in the rain all the time. It\u2019s older than me.'],
          ['vehicle', 'I heard a vehicle. I assumed grounds. I should have checked. I know.'],
        ],
      },
      {
        name: 'Aisha Bello', occupation: 'zoo vet', relation: 'darted Ghost for checkups',
        secret: 'She has been selling zoo medicines to a private clinic.', isCulprit: false,
        persona: 'Sharp, tired, no tolerance for sloppy questions.',
        tells: [
          ['dart|tranquilizer|medicine', 'My darts are counted. Every one. If Ghost was darted, it wasn\u2019t with my stock.'],
          ['sell|clinic|private', 'I consult. Legally. Check the clinic\u2019s books if you must.'],
          ['tarp|carried', 'A leopard under a tarp takes two strong people. Ask who was strong that night.'],
        ],
      },
      {
        name: 'Henrik Lunde', occupation: 'curator', relation: 'managed the rock enclosure budget',
        secret: 'He delayed the fence repair for months to save money.', isCulprit: false,
        persona: 'Bureaucratic, defensive about budgets.',
        tells: [
          ['repair|delay|budget|fence', 'Budgets are budgets. The fence was on the list. It was a long list.'],
          ['rival|offer|zoo', 'Rival zoos poach staff, not leopards. Staff leave. Leopards don\u2019t walk out.'],
          ['camera|blind corner', 'I requested a new camera twice. Denied twice. Paper trail\u2019s in my office.'],
        ],
      },
      {
        name: 'Mona Reyes', occupation: 'gift-shop manager', relation: 'sold snow leopard plushies',
        secret: 'She has been ordering extra plush stock and reselling it at a market stall.', isCulprit: false,
        persona: 'Fast-talking, salesy, turns everything into a pitch.',
        tells: [
          ['plush|resell|stall', 'Plushies! I sell plushies. Real leopards are slightly out of my price range.'],
          ['poach|ring|buyer', 'Buyers ask about real animals sometimes. I laugh. Then I sell them a plushie.'],
          ['night|where', 'Counting stock till ten, then home. The stock sheets will bore you to tears.'],
        ],
      },
    ],
  },

  // ==================== 4. THE ELEPHANT ====================
  {
    title: 'Baba\u2019s Last Parade',
    animal: 'Baba, a 60-year-old elephant, the zoo\u2019s oldest resident',
    setting: 'The Elephant Yard, Old Zoo of Velmara. Morning trumpets, one empty yard.',
    method: 'Faked escape papers, then walked out at dawn in a circus transport truck.',
    timeline: [
      '6:00 PM \u2014 Baba is fed and settled; the yard gate is chained as usual.',
      '9:30 PM \u2014 a transport truck books in under a forged permit.',
      '4:00 AM \u2014 the yard gate is found unchained, the chain coiled neatly aside.',
      '5:00 AM \u2014 the truck leaves by the old north road. Baba walks up the ramp herself.',
    ],
    clues: [
      'The transport permit is signed with the curator\u2019s name \u2014 in the wrong ink.',
      'The chain was unfastened, not cut \u2014 someone had the key and the time.',
      'Baba\u2019s favourite blanket is folded in the truck bay, not in her yard.',
    ],
    redHerring: 'An animal-rights group threatened to \u201cfree\u201d Baba the week before.',
    truth: 'Stefan Ilic, the curator, sold Baba to a travelling circus and forged the escape papers himself. He unchained the yard at 4 AM and walked her up the ramp, telling the driver it was a sanctioned transfer.',
    reveal: 'The ink was wrong, the chain uncut, the blanket folded like a goodbye. Stefan Ilic didn\u2019t lose Baba. He sold her, walked her up a circus ramp at dawn, and called it an escape.',
    suspects: [
      {
        name: 'Stefan Ilic', occupation: 'curator', relation: 'signed all animal transfers',
        secret: 'He has a secret commission deal with a travelling circus.', isCulprit: true,
        persona: 'Smooth, well-dressed, treats questions as paperwork.',
        plea: 'She was old. The circus would have given her crowds, music, a life. I told myself it was kinder. It wasn\u2019t.',
        tells: [
          ['permit|signed|ink|forged', 'My signature gets copied on forms daily. Forgery is the oldest trick in this zoo.'],
          ['circus|sale|commission|truck', 'Circuses book trucks here for feed, for equipment. A truck proves nothing.'],
          ['chain|key|unchained', 'Keys are shared. Half the senior staff have one. Count them.'],
          ['blanket|folded', 'Keepers fold blankets. It\u2019s called tidiness, detective.'],
        ],
      },
      {
        name: 'Greta Holm', occupation: 'head keeper', relation: 'cared for Baba for twenty years',
        secret: 'She once took Baba out of the yard after hours for a walk, against rules.', isCulprit: false,
        persona: 'Gruff grandmother energy, fiercely loyal to Baba.',
        tells: [
          ['baba|yard|walk', 'Twenty years I walked that yard with her. She trusted me. Whoever took her used that trust.'],
          ['chain|gate', 'The chain was coiled. Neat. Like someone who didn\u2019t want noise. Not an animal. A person.'],
          ['circus', 'A circus? For Baba? She hated noise. Whoever sold her knew nothing about her.'],
        ],
      },
      {
        name: 'Wendell Marsh', occupation: 'night guard', relation: 'logged the truck at 9:30 PM',
        secret: 'He took a cash \u201ctip\u201d from the truck driver to skip the inspection.', isCulprit: false,
        persona: 'Nervous, sweaty, over-explains everything.',
        tells: [
          ['truck|9:30|tip|inspection', 'Okay, the driver tipped me. Twenty. I skipped the inspection. I\u2019m sorry. But I didn\u2019t load an elephant.'],
          ['permit', 'The permit looked real to me. Stamps, signatures. I\u2019m a guard, not a forensics lab.'],
          ['north road|5 am', 'I saw it leave. I thought it was sanctioned. Why wouldn\u2019t I?'],
        ],
      },
      {
        name: 'Priya Raman', occupation: 'zoo vet', relation: 'monitored Baba\u2019s aging joints',
        secret: 'She has been falsifying Baba\u2019s health reports to keep her on display.', isCulprit: false,
        persona: 'Compassionate, clinical, quietly furious.',
        tells: [
          ['health|joints|reports', 'Baba was old, not broken. My reports said so. Someone else wanted her gone, not me.'],
          ['falsif', 'I rounded numbers. Vets round numbers. I never signed a transfer.'],
          ['blanket', 'Her blanket folded in the truck bay means she was led, calmly, by someone she knew.'],
        ],
      },
      {
        name: 'Cole Bennett', occupation: 'groundskeeper', relation: 'maintained the elephant yard',
        secret: 'He has been selling zoo firewood on the side.', isCulprit: false,
        persona: 'Easygoing, outdoorsy, smells of sawdust.',
        tells: [
          ['firewood|sell|side', 'Firewood, yes. Elephants, no. There\u2019s a scale to crime, detective.'],
          ['chain|coil', 'A coiled chain is a keeper\u2019s habit. Guards cut. Keepers coil. Remember that.'],
          ['truck bay', 'I sweep the truck bay. I found the blanket. I reported it. That\u2019s my part.'],
        ],
      },
      {
        name: 'Dana Whitfield', occupation: 'animal-rights activist', relation: 'protested outside the zoo weekly',
        secret: 'She once chained herself to the elephant yard gate as a stunt.', isCulprit: false,
        persona: 'Passionate, loud, proud of her protests.',
        tells: [
          ['protest|free|threat', 'We protest. We don\u2019t steal elephants in the night. That\u2019s not liberation, that\u2019s trafficking.'],
          ['gate|chained', 'I chained MYSELF to a gate once. For cameras. In daylight. Ask the newspapers.'],
          ['circus', 'If Baba went to a circus, that\u2019s worse than the zoo. I\u2019d burn the circus down, not send her there.'],
        ],
      },
    ],
  },

  // ==================== 5. THE MACAW ====================
  {
    title: 'Crimson Takes Flight',
    animal: 'Crimson, a scarlet macaw who could say hello in three languages',
    setting: 'The Aviary, Old Zoo of Velmara. Morning feed, one silent perch.',
    method: 'Aviary netting slit from inside, then out in a bird bag during the dawn cleaning.',
    timeline: [
      '5:00 AM \u2014 dawn cleaning begins in the aviary.',
      '5:40 AM \u2014 Crimson is heard, then suddenly not heard, mid-squawk.',
      '6:15 AM \u2014 a bird bag is logged out of the supply room, unsigned.',
      '7:00 AM \u2014 the keeper finds the netting slit and the perch empty.',
    ],
    clues: [
      'The netting was slit from inside \u2014 the cut angles inward, not outward.',
      'A single scarlet feather caught in the supply-room door.',
      'The bird bag log has a gap: one bag out, no name, no return.',
    ],
    redHerring: 'A rare-bird collector was seen sketching the aviary all week.',
    truth: 'Theo Lindqvist, the volunteer photographer, slit the netting from inside during cleaning and smuggled Crimson out in a bird bag for his private aviary. He had been photographing her for months, learning her routine.',
    reveal: 'The cut angled inward. The feather in the supply-room door. The unsigned bag. Theo Lindqvist didn\u2019t photograph Crimson for months because he loved her. He did it to learn exactly when to take her.',
    suspects: [
      {
        name: 'Theo Lindqvist', occupation: 'volunteer photographer', relation: 'photographed Crimson daily',
        secret: 'He keeps a private aviary of rare birds at home, unlicensed.', isCulprit: true,
        persona: 'Soft-spoken, artistic, talks about birds like art.',
        plea: 'I loved her. I gave her a bigger cage, better food, a mate. I know it was wrong. I just... wanted her close.',
        tells: [
          ['netting|slit|inside|cut', 'Netting tears. Birds peck. A slit proves nothing except old netting.'],
          ['aviary|private|home|unlicensed', 'I keep birds. Legally, mostly. That\u2019s a hobby, not a heist.'],
          ['feather|supply|door', 'Feathers drift everywhere in an aviary. You\u2019ll find them in the cafe, too.'],
          ['bag|log|unsigned', 'Bags go missing. Volunteers forget to sign. I forgot to sign once myself.'],
        ],
      },
      {
        name: 'Marisol Vega', occupation: 'head keeper', relation: 'fed Crimson every morning',
        secret: 'She taught Crimson rude words in Spanish and blamed visitors.', isCulprit: false,
        persona: 'Warm, funny, heartbroken about the silence.',
        tells: [
          ['crimson|hello|languages', 'She said hello in three languages. Now the aviary is quiet. That\u2019s what hurts.'],
          ['netting', 'From inside? Then someone was already in. Someone we trusted.'],
          ['cleaning|5 am|dawn', 'Cleaning starts at five. I was there. I heard her. Then I didn\u2019t.'],
        ],
      },
      {
        name: 'Edwin Park', occupation: 'rare-bird collector', relation: 'sketched the aviary all week',
        secret: 'He once bought a smuggled parrot at a market, years ago.', isCulprit: false,
        persona: 'Eccentric, sketchbook in hand, unapologetic about his hobby.',
        tells: [
          ['sketch|collector|week', 'I sketch. That\u2019s it. Sketching isn\u2019t stealing, however much you\u2019d like it to be.'],
          ['smuggled|market|years ago', 'Years ago, one mistake. I learned. I collect sketches now, not birds.'],
          ['bag', 'I carry a sketch bag, not a bird bag. Open it. It\u2019s pencils.'],
        ],
      },
      {
        name: 'Nina Kowalska', occupation: 'aviary cleaner', relation: 'cleaned the aviary at dawn',
        secret: 'She props the aviary door open to smoke during breaks.', isCulprit: false,
        persona: 'No-nonsense, tired, smells faintly of cigarettes.',
        tells: [
          ['door|open|smoke', 'I prop the door. For air. For a smoke. Five minutes. Birds don\u2019t walk out in five minutes.'],
          ['netting|slit', 'I\u2019d have seen a slit. I clean that netting. Unless it was cut after I passed.'],
          ['bag|supply', 'Supply room? I sign everything. Check. My name\u2019s all over that log.'],
        ],
      },
      {
        name: 'Owen Grant', occupation: 'gift-shop clerk', relation: 'sold macaw plushies by the aviary',
        secret: 'He has been letting friends into the aviary after hours.', isCulprit: false,
        persona: 'Cheerful, young, a little too eager to help.',
        tells: [
          ['after hours|friends|aviary', '...Friends peeked in. After hours. Twice. But nobody took anything. Peeking isn\u2019t taking.'],
          ['plush|macaw', 'Plushies fly off the shelves. Real macaws, thankfully, do not.'],
          ['collector', 'That collector guy asked me about Crimson\u2019s price once. I laughed him out of the shop.'],
        ],
      },
      {
        name: 'Farah Aziz', occupation: 'zoo vet', relation: 'checked Crimson\u2019s wings monthly',
        secret: 'She clipped Crimson\u2019s wings shorter than regulations allow.', isCulprit: false,
        persona: 'Serious, precise, protective of her licence.',
        tells: [
          ['wings|clip', 'I clip to regulation. Shorter clips are a rumour. My licence is clean.'],
          ['feather|supply', 'A feather in a door means a bird passed through. Or a keeper carried one. Both happen.'],
          ['flight|silent|perch', 'She can\u2019t fly far clipped. Whoever took her carried her. Remember that.'],
        ],
      },
    ],
  },

  // ==================== 6. THE KOMODO DRAGON ====================
  {
    title: 'The Dragon\u2019s Door',
    animal: 'Sable, a komodo dragon, the reptile house\u2019s quiet legend',
    setting: 'The Reptile House, Old Zoo of Velmara. Heat lamps humming, one empty heat rock.',
    method: 'Sedated in her feed, then crated as \u201csouvenirs\u201d on the gift-shop delivery van.',
    timeline: [
      '3:00 PM \u2014 Sable is fed her usual meat, laced with a sedative nobody prescribed.',
      '6:00 PM \u2014 the gift-shop delivery van is loaded for the night run.',
      '7:30 PM \u2014 a crate marked \u201cFRAGILE \u2014 SOUVENIRS\u201d leaves through the service gate.',
      '8:00 AM \u2014 the keeper finds the heat rock cold and the enclosure undisturbed.',
    ],
    clues: [
      'The feed bowl still smells faintly of sedative \u2014 a dose too precise for an outsider.',
      'The souvenir crate\u2019s manifest lists 40 plush dragons. The van carried 39.',
      'Drag marks, short and heavy, lead from the reptile house to the loading bay.',
    ],
    redHerring: 'A film crew offered the zoo money to \u201cborrow\u201d Sable for a monster movie.',
    truth: 'Hana Okafor, the gift-shop manager, ran a smuggling ring through the shop\u2019s delivery van. She sedated Sable\u2019s feed herself, crated the dragon as souvenirs, and drove the manifest gap past the gate.',
    reveal: 'The sedative was too precise for an outsider. The manifest said 40 plush dragons and the van carried 39 \u2014 because the fortieth box was breathing. Hana Okafor sold souvenirs by day and smuggled a dragon by night.',
    suspects: [
      {
        name: 'Hana Okafor', occupation: 'gift-shop manager', relation: 'ran the shop and its delivery van',
        secret: 'She has a second ledger for the shop\u2019s delivery runs.', isCulprit: true,
        persona: 'Efficient, smiling, treats every question like a customer complaint.',
        plea: 'It was one crate. One. The ring paid my mother\u2019s debts. I told myself Sable would be cared for. I know better now.',
        tells: [
          ['crate|manifest|40|39|plush', 'Counts drift. Plushies get damaged, given away. A count gap is not a dragon.'],
          ['van|delivery|loading', 'My van runs nightly. Souvenirs, stock, returns. That\u2019s commerce, not crime.'],
          ['sedative|feed|dose', 'Sedatives are the vet\u2019s world. I sell keychains. Ask the vet.'],
          ['ledger|second|books', 'Every shop keeps notes. A second ledger is called good bookkeeping.'],
        ],
      },
      {
        name: 'Rudi Haller', occupation: 'head keeper', relation: 'fed Sable for a decade',
        secret: 'He once forgot to lock the reptile house overnight.', isCulprit: false,
        persona: 'Old-school, dry humour, protective of reptiles.',
        tells: [
          ['sable|heat rock|fed', 'Ten years I fed her. She knew my step. Whoever drugged her feed knew her routine.'],
          ['lock|forgot|overnight', 'Once. A decade ago. I check twice now. Twice, every night.'],
          ['drag|marks|loading', 'Drag marks mean weight. A dragon is weight. Follow the weight, not the gossip.'],
        ],
      },
      {
        name: 'Ivy Chen', occupation: 'zoo vet', relation: 'prescribed Sable\u2019s medicines',
        secret: 'She has been diverting small amounts of sedative for a wildlife rescue.', isCulprit: false,
        persona: 'Calm, ethical, quietly furious at misuse of drugs.',
        tells: [
          ['sedative|divert|rescue', 'I divert for a licensed rescue. Paperwork exists. Misuse disgusts me.'],
          ['dose|precise|outsider', 'A precise dose means insider knowledge. Start with who knew her feeding schedule.'],
          ['feed|bowl|smell', 'Smell the bowl yourself. That\u2019s my sedative. But my stock is counted. Count it.'],
        ],
      },
      {
        name: 'Marco Silva', occupation: 'delivery driver', relation: 'drove the gift-shop van that night',
        secret: 'He took a cash bonus to skip the crate count.', isCulprit: false,
        persona: 'Laid-back, shrugging, allergic to responsibility.',
        tells: [
          ['count|skip|bonus|cash', 'Yeah, I skipped the count. Bonus in my pocket. But I drive what I\u2019m given. I don\u2019t pack it.'],
          ['crate|fragile|souvenirs', 'Crates are crates. I don\u2019t open them. Opening them is how drivers get fired.'],
          ['gate|service', 'Gate waved me through like always. Same guard, same wave.'],
        ],
      },
      {
        name: 'Elif Demir', occupation: 'film producer', relation: 'wanted Sable for a monster movie',
        secret: 'She once rented an animal illegally for a shoot.', isCulprit: false,
        persona: 'Dramatic, name-dropping, treats the zoo like a set.',
        tells: [
          ['film|movie|borrow|monster', 'I offered money, openly, in daylight. That\u2019s called a location fee, not a heist.'],
          ['rent|illegal|shoot', 'Once, years ago, a mistake. I\u2019ve been legal since. My permits are boring and complete.'],
          ['crate|van', 'Film crews use crates too. Ours are labelled with the production name. Check the labels.'],
        ],
      },
      {
        name: 'Ben Osei', occupation: 'night guard', relation: 'logged the van at the service gate',
        secret: 'He was asleep in the gatehouse when the van left.', isCulprit: false,
        persona: 'Young, earnest, terrified of losing the job.',
        tells: [
          ['asleep|gatehouse|van', '...I dozed. Ten minutes. The van was already cleared. I waved at a van I didn\u2019t inspect.'],
          ['log|gate', 'My log says the van passed. It did pass. What was inside it \u2014 that\u2019s above a guard\u2019s pay.'],
          ['manifest', 'Manifests are the manager\u2019s job. I check seals, not shopping lists.'],
        ],
      },
    ],
  },
];

// Pick one scenario at random (optionally avoiding the last one played).
export function pickScenario(avoidTitle) {
  const pool = SCENARIOS.filter((s) => s.title !== avoidTitle);
  const list = pool.length ? pool : SCENARIOS;
  return list[Math.floor(Math.random() * list.length)];
}

// Scripted interrogation answer: match question keywords against the
// suspect's tells; fall back to a persona-flavoured generic line.
export function scriptedAnswer(suspect, question) {
  const q = String(question || '').toLowerCase();
  for (const [pattern, answer] of suspect.tells || []) {
    const keys = pattern.split('|').map((k) => k.trim().toLowerCase());
    if (keys.some((k) => k && q.includes(k))) return answer;
  }
  if (suspect.isCulprit) {
    return 'I\u2019ve told you everything I know. You\u2019re chasing the wrong person, and the real thief is enjoying this.';
  }
  return 'I don\u2019t know anything about that. I was doing my job, same as every other day in this zoo.';
}

// Spoiler-free hint lines for the Head Keeper (the zoo\u2019s old keeper voice).
const GM_HINTS = [
  'Look at the clues, not the loudest voice at the table.',
  'Every secret in this zoo is a red herring until it isn\u2019t. Ask what each secret is hiding.',
  'The method tells you who could have done it. Who had the access, not just the motive?',
  'One clue points at the how, one at the when, one at the who. Line them up.',
  'The culprit\u2019s story is the one that fits too neatly. Pull at its edges.',
];
export function gmHint(round) {
  return GM_HINTS[(round || 0) % GM_HINTS.length];
}
