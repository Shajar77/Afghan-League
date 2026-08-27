import gallery5 from '../assets/gallery-5.webp'
import gallery7 from '../assets/gallery-7.webp'
import downloadImg from '../assets/download.webp'
import downloadWebp from '../assets/download.webp'
import download1Img from '../assets/download (1).webp'
import prImg from '../assets/PR.webp'

export interface Article {
  id: string
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
  img: string
  featured?: boolean
  fullText?: string[]
}

export const articles: Article[] = [
  {
    id: 'apl-press-release-aug25-2026',
    category: 'PRESS RELEASE',
    title: 'Afghanistan Premier League T20 Unveils Inaugural Franchises, Logos, and the ‘Koh-E-Zafar’ Trophy Ahead of Historic Season',
    excerpt: 'Dubai, UAE — The Afghanistan Premier League T20 (APL T20) today marked a major milestone in the nation\'s sporting history. In a momentous ceremony bringing together franchise owners, league partners, and Afghanistan Cricket Board (ACB) officials, the league officially unveiled its three inaugural franchise teams, their team identities, and the premier championship trophy.',
    date: 'AUG 25, 2026',
    readTime: '4 MIN READ',
    img: prImg,
    featured: true,
    fullText: [
      "Dubai, UAE — The Afghanistan Premier League T20 (APL T20) today marked a major milestone in the nation's sporting history. In a momentous ceremony bringing together franchise owners, league partners, and Afghanistan Cricket Board (ACB) officials, the league officially unveiled its three inaugural franchise teams, their team identities, and the premier championship trophy.",
      "The Inaugural Franchises",
      "A new chapter begins for Afghan cricket with the introduction of three foundational franchises, each representing the fierce passion of the nation's cricket fans:",
      "• Axcel United Kabul",
      "• Balkh Zwanan",
      "• Kandahar Warriors",
      "The 'Koh-E-Zafar' Trophy",
      "The centerpiece of the launch event was the unveiling of the league's premier trophy, named Koh-E-Zafar. The stunning design draws deep inspiration from the enduring beauty, resilience, and strength of Afghanistan’s majestic mountain ranges, symbolizing the peak of cricketing achievement.",
      "APL T20 Draft & Key Dates",
      "Alongside the team reveals, the league announced crucial next steps for players and fans alike as preparations for the season accelerate:",
      "• Player Registration: The portal for the inaugural APL T20 Draft will officially open to players on August 30, 2026 at www.apl-t20.com",
      "• Player Draft: The Player Draft will be held on September 27, 2026.",
      "• Future Announcements: Additional details regarding complete tournament schedule, and host venues will be released in the coming weeks.",
      "• Tournament Start Date: December 27, 2026",
      "Voices of the League",
      "The launch event highlighted the collaborative vision behind the APL T20, featuring strong enthusiasm from leadership and all three franchise owners:",
      "• ACB Chairman, Mirwais Ashraf: \"Today is a landmark occasion for Afghan cricket. The unveiling of our inaugural franchises and the Koh-E-Zafar trophy reflects our shared vision of building a league that inspires future generations. Naming this trophy Koh-E-Zafar was deliberate. A mountain of victory is not climbed in one season — it is built over years, by players who come after us. Today we unveil the franchises that will carry that responsibility, and a competition structure that gives every young cricketer in this country a visible path from the district ground to the international stage.\"",
      "• Axcel United Kabul Ownership: \"Representing Kabul carries an expectation we welcome. This is a city that has produced some of the finest cricketers Afghanistan has given the world, and our job is to build a franchise those players and this city recognise as their own — professionally run, competitive from day one, and permanent.\"",
      "• Balkh Zwanan Ownership: \"Our commitment to this league goes far beyond competition; it is about uplifting our community. Zwanan means youth, and that is not decoration on a badge — it is our mandate. Balkh and the north have talent that has never had a professional pathway. We intend to scout it, sign it, and put it on a stage where the whole country and the wider cricketing world can see it.\"",
      "• Kandahar Warriors Ownership: \"We look forward to bringing fierce passion to the pitch and making our fans proud. Kandahar supporters do not come to watch politely. They come loud, and they expect a team that plays the same way — aggressive, fearless cricket that reflects the character of the south. We are building a squad that gives them something to shout about, and a home ground that visiting sides do not enjoy travelling to.\"",
      "-ENDS-",
      "For Media Enquiries:",
      "contact@apl-t20.com"
    ]
  },
  {
    id: 'new-a1',
    category: 'PRESS RELEASE',
    title: 'Afghanistan Cricket Board Opens Franchise Acquisition Process for APL T20 2026',
    excerpt: 'The Afghanistan Cricket Board (ACB) is pleased to announce the official launch of the franchise acquisition process for the much-anticipated return of the Afghanistan Premier League (APL T20), marking a significant milestone in the continued rise of Afghan cricket on the global stage.',
    date: 'MAY 12, 2026',
    readTime: '3 MIN READ',
    img: download1Img,
    featured: true,
    fullText: [
      "Kabul – May 12, 2026: The Afghanistan Cricket Board (ACB) is pleased to announce the official launch of the franchise acquisition process for the much-anticipated return of the Afghanistan Premier League (APL T20), marking a significant milestone in the continued rise of Afghan cricket on the global stage.",
      "The ACB will officially issue the Request for Proposal (RFP) for franchise ownership on May 15, 2026, inviting global investors, sports entrepreneurs, and commercial partners to become part of one of the most exciting emerging properties in world cricket. The deadline for proposal submissions has been set for June 30, 2026.",
      "The second edition of the APL T20 is scheduled to be held in the United Arab Emirates during the final quarter of 2026, providing a world-class environment and international-standard infrastructure for a tournament expected to deliver elite competition, international talent, and premium production quality.",
      "The league will feature five franchise teams, with prospective franchise partners having the opportunity to bid for representation from five iconic Afghan cricketing regions and centers, which are Kabul, Kandahar, Balkh, Paktia, and Nangarhar.",
      "The return of the APL comes at a time when Afghan cricketers are widely regarded among the most impactful performers across major T20 leagues worldwide. The tournament will serve as Afghanistan’s premier domestic T20 platform, showcasing the country’s leading cricketing stars while also bringing together internationally renowned players and professionals in a globally marketable competition.",
      "The ACB, in collaboration with its strategic partners, has developed a commercial framework centered on long-term sustainability, operational efficiency, and strong commercial potential for franchise investors. The model is designed to establish a lean, competitive, and high-value sporting property aligned with the evolving global T20 landscape.",
      "ACB Chairman Mirwais Ashraf said: “It is extremely encouraging to witness the steady progress toward the return of the Afghanistan Premier League, a landmark initiative for the Afghanistan Cricket Board and a significant step in the continued growth of Afghan cricket globally. In this regard, the Afghanistan Cricket Board will officially commence the franchise acquisition process for the league’s five franchises on the 15th of this month. We are confident that the APL will open a new chapter of professionalism, commercial growth, and international recognition for Afghan cricket.”",
      "He further added: “Afghanistan today possesses some of the finest and most exciting talents in world cricket, and the Afghanistan Premier League will serve as a major platform to further strengthen the global presence of Afghan cricket. Our National Team has achieved historic successes against some of the world’s leading cricket nations, while our Emerging, Under-19, and Afghanistan A teams have also delivered outstanding performances internationally.”",
      "The APL will provide Afghan players with a professional platform to showcase their talent, gain international exposure, and engage with leading overseas players and experts. At the same time, the league will play an important role in promoting Afghanistan’s culture and positive image globally, while contributing to the long-term commercial growth of Afghan cricket.",
      "The Afghanistan Cricket Board invites interested parties to become part of a partnership opportunity that extends beyond cricket, contributing to the growth of one of the world’s fastest-rising cricketing nations and a league with significant global potential.",
      "-ENDS-",
      "For Media & Franchise Enquiries:",
      "bid@apl-t20.com"
    ]
  },
  {
    id: 'new-a2',
    category: 'NEWS',
    title: 'ACB Unveils Bold New Identity and Roadmap for Afghanistan Premier League T20 at Grand Launch in Dubai',
    excerpt: 'The Afghanistan Cricket Board (ACB) officially ushered in a new era for Afghan cricket today with the Grand Launch and Logo Unveiling of the Afghanistan Premier League (APL T20).',
    date: 'DEC 20, 2025',
    readTime: '4 MIN READ',
    img: gallery5,
    featured: true,
    fullText: [
      "DUBAI, UAE | December 20, 2025 — The Afghanistan Cricket Board (ACB) officially ushered in a new era for Afghan cricket today with the Grand Launch and Logo Unveiling of the Afghanistan Premier League (APL T20). Held at a star-studded ceremony in Dubai, the event marked the formal return of the league, featuring the unveiling of a modern brand identity and a comprehensive 10-year strategic roadmap. The ceremony was attended by ACB Chairman Mirwais Ashraf, CEO Naseeb Khan, and national icons including Rashid Khan, Hashmatullah Shahidi, and Rahmanullah Gurbaz, alongside senior leadership from commercial partners Trans Group (TG) and ITW MEA.",
      "A New Visual Identity",
      "The highlight of the evening was the reveal of the new APL T20 logo. Designed to reflect resilience and ambition, the logo symbolizes a fresh start for the league, moving away from past challenges toward a sustainable, world-class sporting property.",
      "\"The APL is more than just a tournament; it is a strategic pillar of our long-term vision,\" said Mirwais Ashraf. \"Today’s launch is the first step in turning that vision into a reality that will provide our players with a global stage and our fans with world-class entertainment.\"",
      "Tournament Framework & 2026 Window",
      "Following the logo reveal, the ACB confirmed several key details regarding the league's structure:",
      "Five-Team Model: The league will feature five city-based franchises representing different regions of Afghanistan.",
      "2026 Launch Window: The tournament is scheduled to take place in September–October 2026, a window carefully selected to ensure maximum participation of international overseas stars.",
      "Venue: The United Arab Emirates (UAE) has been designated as the primary host venue for the upcoming edition, ensuring top-tier infrastructure and global accessibility.",
      "Player Draft: A grand player draft is proposed for June–July 2026, where franchises will build their squads from a pool of local talent and international professionals.",
      "Economic and Sporting Impact",
      "With a 10-edition partnership now in place with ITW MEA and Trans Group, the ACB emphasized that the league is built on a foundation of commercial transparency and long-term stability. The APL T20 aims to provide a robust commercial ecosystem for the board while creating a direct pathway for emerging Afghan talents to learn from the world’s best T20 cricketers."
    ]
  },
  {
    id: 'new-a3',
    category: 'NEWS',
    title: 'Afghanistan Premier League Launched in Dubai, Signaling a New Era for Afghanistan Cricket',
    excerpt: 'The Afghanistan Cricket Board (ACB), in partnership with Cricket Venture, a joint venture of Trans Group and ITW Universe, officially unveiled the vision for the Afghanistan Premier League (APL) on 20 December 2025 at The Westin Hotel, Mina Seyahi, Dubai.',
    date: 'DEC 20, 2025',
    readTime: '5 MIN READ',
    img: downloadWebp,
    featured: true,
    fullText: [
      "Dubai, UAE — The Afghanistan Cricket Board (ACB), in partnership with Cricket Venture, a joint venture of Trans Group and ITW Universe, officially unveiled the vision for the Afghanistan Premier League (APL) on 20 December 2025 at The Westin Hotel, Mina Seyahi, Dubai.",
      "The launch marks a major milestone in the evolution of Afghanistan cricket, introducing a new franchise-based T20 league’s commercial structure designed to provide a global platform for Afghanistan talent while strengthening the commercial and entertainment landscape of the sport.",
      "The event brought together senior cricket administrators, commercial and broadcast partners, investors, and media representatives. Attendees were presented with an exclusive preview of the league’s brand identity, tournament format, and long-term roadmap, along with early insights into player participation and commercial opportunities.",
      "Speaking at the launch, Mirwais Ashraf, Chairman of the Afghanistan Cricket Board, emphasized the wider impact of the league:",
      "“The Afghanistan Premier League represents a meaningful step forward in our cricketing journey. It creates new opportunities for our players, inspires the next generation, and allows Afghanistan cricket to be showcased on a global platform. We see the APL as an important contributor to the growth and unity of the game, both domestically and internationally.”",
      "The APL’s inaugural season will feature five city-based franchises, bringing together Afghanistan’s leading national players alongside prominent overseas professionals and emerging local talent. This edition of the league is scheduled for the last quarter of 2026, with a clear focus on establishing the APL as both a high-quality sporting competition and a premium entertainment property.",
      "From a commercial and sponsorship perspective, partners highlighted the league’s long-term potential. Vivek Chandra, Director at ITW, said:",
      "“We are excited to be associated with the Afghanistan Premier League, a project that brings fresh energy and opportunity to the sport. Through strategic partnerships and sponsorships, our aim is to support the league’s growth while contributing to a stronger and more sustainable cricket ecosystem.”",
      "Sponsorship activation, event management, broadcast, and production capabilities were also key themes of the launch. Speaking on behalf of Trans Group, Rao Usman Hashim Khan, the Chief Operating Officer noted:",
      "“We are pleased to support the Afghanistan Premier League and to be part of this important new chapter for Afghanistan cricket. With high-quality production standards and global broadcast reach, the APL has the potential to connect communities, bring fans closer to the action, and create a lasting impact. Through innovative sponsorships, fan engagement initiatives, and impactful brand activations, the league will elevate the visibility and overall standard of Afghanistan cricket worldwide.”",
      "The evening concluded with a preview of the APL’s official promotional campaign, offering insight into the league’s visual identity and creative direction. Guests were also briefed on the league’s commercial framework, team structures, and its broader role in supporting the long-term development of Afghanistan cricket.",
      "Following the launch, organizers will move into the next phase, which includes finalizing franchise identities, confirming commercial partners, and progressing the player auction or draft process.",
      "For Media Enquiries:",
      "Email Address: contact@apl-t20.com"
    ]
  },
  {
    id: 'new-a4',
    category: 'NEWS',
    title: 'APL’s Grand Launch Event & Logo Unveiling to be held on December 20th in the UAE',
    excerpt: 'The Afghanistan Cricket Board has announced that the Grand Launch Event for the Afghanistan Premier League T20 (APLT20) will be held on December 20th, 2025, in the United Arab Emirates. During this event, the ACB and its partners will unveil the Tournament’s proposed window, venue,',
    date: 'DEC 9, 2025',
    readTime: '3 MIN READ',
    img: gallery7,
    fullText: [
      "Kabul – December 9, 2025: The Afghanistan Cricket Board has announced that the Grand Launch Event for the Afghanistan Premier League T20 (APLT20) will be held on December 20th, 2025, in the United Arab Emirates. During this event, the ACB and its partners will unveil the Tournament’s proposed window, venue, league structure, and other key elements for the second edition of the APLT20.",
      "The milestone follows the awarding of APL investment partnership rights to the ITW–TG consortium during a contract-signing ceremony earlier this year. During the 1st July 2025 agreement signing, ACB stated that the tournament window and venue would be revealed by the end of August. However, due to essential administrative procedures, bilateral coordination, and technical evaluations, the planned August announcement was rescheduled. All major details will now be formally unveiled at the 20th December launch event.",
      "The ceremony will bring together senior leadership from ACB, ITW MEA, TG, and Skywalkers as well as various global cricket stakeholders, media, commercial partners, and invited dignitaries. ACB and its partners will reveal the APL tournament proposed window, venue, league structure, brand identity, commercial roadmap, and additional key components of the inaugural edition.",
      "Mirwais Ashraf, Chairman of the Afghanistan Cricket Board stated: “The APL is a strategic pillar of ACB’s long-term vision, and the 20th December launch event marks a major step toward turning that vision into reality. We appreciate the professionalism and dedication of our partners at ITW MEA, TG, and Skywalkers. The league will open new horizons for Afghan cricket, and we look forward to presenting its full framework at the launch.”",
      "Naseeb Khan, CEO of the Afghanistan Cricket Board, remarked: “The progress made since awarding the investment partnership rights has been highly encouraging. The APL will provide a world-class platform for Afghan players and a strong commercial ecosystem for the board. The upcoming launch event will outline the complete roadmap, and we are excited to introduce this next phase to the global cricketing community.”",
      "The APL is the official franchise-based T20 league sanctioned by the Afghanistan Cricket Board, and it will mark a new era of development, professionalism, and global positioning for Afghan cricket."
    ]
  },
  {
    id: 'new-a5',
    category: 'NEWS',
    title: 'ACB Signs Long-Term Commercial Partnership for the Afghanistan Premier League (APL T20)',
    excerpt: 'UAE – July 1, 2025: The Afghanistan Cricket Board (ACB) is pleased to announce the signing of a long-term commercial partnership agreement with ITW MEA for the successful organization and management of the Afghanistan Premier League (APL T20) over the next 10 editions.',
    date: 'JUL 1, 2025',
    readTime: '4 MIN READ',
    img: downloadImg,
    fullText: [
      "UAE – July 1, 2025: The Afghanistan Cricket Board (ACB) is pleased to announce the signing of a long-term commercial partnership agreement with ITW MEA for the successful organization and management of the Afghanistan Premier League (APL T20) over the next 10 editions.",
      "ITW MEA, a UAE- and Africa-based company renowned for its expertise in media planning, consulting, branding & activations, media production, and digital marketing, will collaborate with the ACB to deliver a world-class T20 league. ITW has an extensive track record of working with prominent organizations, including the International Cricket Council (ICC), the Asian Cricket Council (ACC), and various full-member cricket boards globally.",
      "The agreement was officially signed by Mr. Mirwais Ashraf, Chairman of the Afghanistan Cricket Board, Mr. Naseeb Khan, CEO of Afghanistan Cricket Board and Mr. Vivek Chandra, Director and Head of Business for ITW MEA.",
      "As part of this agreement, a joint governing council comprising representatives from both ACB and ITW will be formed, that will oversee key operational decisions, including the selection of hosting venues and other essential aspects related to the league's execution.",
      "The ACB initiated the process of identifying a strategic partner by announcing a Request for Proposal (RFP). The purpose was to find a partner who is both financially and technically capable of contributing to the growth, development, and long-term success of the APL. This process took more than a year and involved evaluation and selection phases. Ultimately, ITW MEA was chosen as the long-term strategic partner. Throughout the process, updates were provided to the ACB Board, and their feedback and suggestions were taken into account.",
      "Speaking at the signing ceremony, ACB Chairman Mr. Mirwais Ashraf stated: “The relaunch of the Afghanistan Premier League is a momentous achievement for Afghan cricket and its passionate fans who have long awaited this occasion. We are delighted to have partnered with a reputed organization like ITW for the successful delivery of the APL’s upcoming editions. This marks a significant step forward, and the official dates and venues will be announced soon.”",
      "Similarly, ACB Chief Executive Officer Mr. Naseeb Khan added: “Reviving the Afghanistan Premier League has been among our top priorities. We conducted extensive discussions with several potential partners and ultimately secured an agreement with ITW, a highly credible entity. Our focus is not just on hosting a tournament but on elevating the league’s quality, competitiveness, and prestige. This platform will provide vital opportunities for our players and immense value to Afghan cricket overall.”",
      "Mr. Vivek Chandra, Director and Head of Business for MEA at ITW, expressed his excitement about the partnership: “We are honored to join hands with the Afghanistan Cricket Board as their investor and commercial partner for the Afghanistan Premier League. Afghanistan’s meteoric rise in world cricket has been inspiring, and this partnership reflects our commitment to contributing to the growth and success of Afghan cricket. We believe this league will serve as a crucial platform for nurturing talent and raising the standards of cricket in Afghanistan.”",
      "During August 2025, the parties, together with the ACB board members, will host a grand opening ceremony where distinguished, prominent, and respected individuals from the cricketing world, including players, business leaders, and governing bodies from around the globe, will be invited. During the ceremony, the venue and window of the upcoming edition will be announced, and the progress of the Governing Council’s activities will be shared."
    ]
  },
]
