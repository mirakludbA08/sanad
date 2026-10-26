/*
  Sanad website content.
  Everything a non-developer may want to change lives in this file:
  the four areas, the challenges and their hours, events, sample stories
  and the sample families shown on the admin dashboard.
*/
window.SANAD = {
  goalHours: 100,

  // The four areas. `target` is the suggested hours per area (4 x 25 = 100).
  // `fill` colors charts and progress cells; `ink` colors text and stamps.
  domains: [
    {
      id: "kinship",
      name: "Kinship ties",
      ar: "صلة الرحم",
      short: "Kinship",
      fill: "#A3214A",
      ink: "#8A1538",
      target: 25,
      blurb: "Time with grandparents, gatherings and reconnecting with relatives."
    },
    {
      id: "heritage",
      name: "National identity & heritage",
      ar: "الهوية الوطنية والتراث",
      short: "Heritage",
      fill: "#B37A1C",
      ink: "#7F5410",
      target: 25,
      blurb: "Museums, recipes, proverbs and the stories that make us Qatari."
    },
    {
      id: "volunteering",
      name: "Volunteering & community",
      ar: "التطوع والمشاركة المجتمعية",
      short: "Volunteering",
      fill: "#1E8A6C",
      ink: "#13664F",
      target: 25,
      blurb: "Giving back as a family, from beach cleanups to community events."
    },
    {
      id: "health",
      name: "Health & skills",
      ar: "الصحة والمهارات",
      short: "Health",
      fill: "#2F6DBA",
      ink: "#23518D",
      target: 25,
      blurb: "Walks, screen-free days and learning hands-on skills together."
    }
  ],

  // Hours per challenge are placeholders for the Sanad team to confirm.
  activities: [
    {
      id: "family-gathering",
      domain: "kinship",
      name: "Weekly Family Gathering",
      hours: 3,
      description: "Organize a family gathering, visit elders, or host a family meal. Capture the moment with a photo and a message of gratitude.",
      tasks: [
        "Bring at least two generations together",
        "Visit an elder or host a family meal",
        "Take a group photo",
        "Write a short message of gratitude"
      ],
      noteLabel: "Your message of gratitude"
    },
    {
      id: "grandparents-stories",
      domain: "kinship",
      name: "Grandparents' Storytelling Session",
      hours: 4,
      description: "Children and grandchildren interview a grandparent and record their memories and family history for the Family Archive.",
      tasks: [
        "Prepare five questions with the children",
        "Record the conversation as audio or video",
        "Add the story to the Family Archive"
      ],
      link: { href: "#/archive", label: "Add the story to the archive" }
    },
    {
      id: "family-tree",
      domain: "kinship",
      name: "Digital Family Tree",
      hours: 5,
      description: "Map your family's ancestry together, reconnect with extended relatives and strengthen kinship bonds.",
      tasks: [
        "Map at least three generations",
        "Call a relative you haven't spoken to in a while",
        "Share a photo of your finished tree"
      ]
    },
    {
      id: "landmarks-tour",
      domain: "heritage",
      name: "Cultural Landmarks Tour",
      hours: 4,
      description: "Visit a national museum or heritage site, such as the National Museum of Qatar, Souq Waqif or Katara Cultural Village, then answer a short quiz about it.",
      tasks: [
        "Visit a museum or heritage site together",
        "Take a group photo at the venue",
        "Answer the three-question quiz"
      ],
      quiz: [
        {
          q: "The design of the National Museum of Qatar was inspired by which natural form?",
          options: ["A pearl oyster", "The desert rose", "A sand dune"],
          answer: 1
        },
        {
          q: "Before oil, what was the main source of income for many Qatari families?",
          options: ["Pearl diving", "Coffee farming", "Gold mining"],
          answer: 0
        },
        {
          q: "What does the name Souq Waqif mean?",
          options: ["The old market", "The sea market", "The standing market"],
          answer: 2
        }
      ]
    },
    {
      id: "traditional-recipe",
      domain: "heritage",
      name: "Traditional Recipe Challenge",
      hours: 3,
      description: "Cook a traditional Qatari dish across generations, grandparents and grandchildren together, and share the recipe with a short video.",
      tasks: [
        "Pick a dish such as machboos, harees or luqaimat",
        "Cook it together across generations",
        "Film a short clip and write down the recipe"
      ],
      noteLabel: "The recipe"
    },
    {
      id: "proverbs",
      domain: "heritage",
      name: "Qatari Proverbs & Heritage Stories",
      hours: 2,
      description: "Learn traditional Qatari proverbs, wisdom and stories from your elders and pass them on to the next generation.",
      tasks: [
        "Learn three proverbs from an elder",
        "Explain what each one means in your own words",
        "Share your favourite with the family"
      ],
      noteLabel: "The proverbs you learned"
    },
    {
      id: "volunteer-family",
      domain: "volunteering",
      name: "Volunteer Family Challenge",
      hours: 5,
      description: "Run a small volunteering initiative as a whole family, such as a beach cleanup, distributing meals or joining Youth Center activities.",
      tasks: [
        "Choose a cause and plan it together",
        "Every family member takes part",
        "Photograph the initiative"
      ]
    },
    {
      id: "giving-back",
      domain: "volunteering",
      name: "Giving Back Initiative",
      hours: 3,
      description: "Donate gently used items, books or toys to a charitable organization and log the hours you spent sorting and delivering them.",
      tasks: [
        "Sort the items to donate together",
        "Deliver them to a charity",
        "Log the hours you spent"
      ]
    },
    {
      id: "national-event",
      domain: "volunteering",
      name: "National Event Participation",
      hours: 6,
      description: "Register your family as a group for a community volunteering event organized by the Youth Center or the Ministry of Sports and Youth.",
      tasks: [
        "Register on the Events page",
        "Attend as a family group",
        "Upload a photo from the event"
      ],
      link: { href: "#/events", label: "See upcoming events" }
    },
    {
      id: "family-walk",
      domain: "health",
      name: "Family Walk & Sports Challenge",
      hours: 2,
      description: "Reach a step goal together or join a group walk in a public park such as Aspire Park, and log how long you were active.",
      tasks: [
        "Set a family step goal",
        "Walk or play sport together for at least an hour",
        "Log the duration"
      ]
    },
    {
      id: "screen-free",
      domain: "health",
      name: "Screen-Free Day",
      hours: 6,
      description: "Spend a full day on outdoor activities, board games and mind games, with no smartphones, so the family talks and plays face to face.",
      tasks: [
        "Agree on the day together",
        "Put phones away from morning to evening",
        "Play at least one board game or outdoor game"
      ]
    },
    {
      id: "skill-workshop",
      domain: "health",
      name: "Hands-On Skill Workshop",
      hours: 3,
      description: "Hold a home workshop to learn a practical or creative skill together, such as home gardening, painting or upcycling.",
      tasks: [
        "Choose a skill and gather the materials",
        "One family member teaches the others",
        "Show what you made"
      ]
    }
  ],

  // Sample events. Dates and venues are placeholders until the team confirms them.
  events: [
    {
      id: "beach-cleanup",
      domain: "volunteering",
      title: "Family Beach Cleanup",
      date: "2026-11-06",
      time: "7:00 to 10:00 am",
      location: "Al Wakrah Beach",
      hours: 3,
      capacity: 40,
      registered: 23,
      description: "Gloves, bags and water are provided. Children under 10 join with a parent."
    },
    {
      id: "aspire-walk",
      domain: "health",
      title: "Family Walk at Aspire Park",
      date: "2026-11-14",
      time: "4:00 to 6:00 pm",
      location: "Aspire Park, Doha",
      hours: 2,
      capacity: 60,
      registered: 41,
      description: "A 5 km loop at an easy pace, with a short stretching session for grandparents."
    },
    {
      id: "katara-heritage",
      domain: "heritage",
      title: "Heritage Morning at Katara",
      date: "2026-11-20",
      time: "9:00 am to 12:00 pm",
      location: "Katara Cultural Village",
      hours: 3,
      capacity: 35,
      registered: 12,
      description: "Traditional games, a storytelling circle with elders and a guided walk through the village."
    },
    {
      id: "meal-packing",
      domain: "volunteering",
      title: "Community Meal Packing",
      date: "2026-11-28",
      time: "3:00 to 6:00 pm",
      location: "Doha, venue to be confirmed",
      hours: 3,
      capacity: 30,
      registered: 30,
      description: "Families pack and label meal boxes together for distribution to workers and families in need."
    },
    {
      id: "national-day",
      domain: "volunteering",
      title: "National Day Family Volunteering",
      date: "2026-12-11",
      time: "8:00 am to 12:00 pm",
      location: "Darb Al Saai, Doha",
      hours: 4,
      capacity: 50,
      registered: 9,
      description: "Help welcome visitors and run children's activities in the week before Qatar National Day."
    }
  ],

  // Sample archive stories, written as placeholders.
  stories: [
    {
      id: "s-pearling",
      title: "The summer my father went to sea",
      teller: "Grandfather Rashid",
      recorder: "Hamad, his grandson",
      era: "1950s",
      text: [
        "Every summer the boats left for the pearl banks and the neighbourhood went quiet. My father was a diver, and for four months we only had the sea breeze and my mother's stories.",
        "When the boats came back, the whole fereej went down to the shore. You could hear the nahham singing before you could see the sails. I ran so fast I lost a sandal in the sand, and I never found it.",
        "He brought me a single small pearl that year. It wasn't worth much, but I kept it in a tin for sixty years. I gave it to Hamad's mother on her wedding day."
      ]
    },
    {
      id: "s-garangao",
      title: "Garangao nights in the old fereej",
      teller: "Grandmother Noora",
      recorder: "Maryam and Sara, her granddaughters",
      era: "1960s",
      text: [
        "On the fourteenth night of Ramadan we wore our new clothes and went from door to door with cloth bags, singing for nuts and sweets.",
        "My brother always carried the biggest bag and gave half of it to the younger children on the way home. My mother said that was the real lesson of Garangao, not the sweets.",
        "Now I sit at the door and the children come to me. I make sure the smallest ones get the most."
      ]
    },
    {
      id: "s-souq",
      title: "Sweets from the old souq",
      teller: "Grandmother Moza",
      recorder: "Ahmed, her grandson",
      era: "1970s",
      text: [
        "On Thursdays my aunt took me to the souq. There was a man who made luqaimat in a huge pan, and he would always drop one extra into my paper cone.",
        "We walked home along the shore because there were no big roads yet. I still make luqaimat with his trick: a little saffron in the date syrup."
      ]
    }
  ],

  // Sample families for the admin dashboard. Hours are approved hours per area.
  demoFamilies: [
    { id: "f-sulaiti", name: "Al-Sulaiti", members: 6, hours: { kinship: 27, heritage: 25, volunteering: 26, health: 25 }, completed: 31, last: "2026-10-24" },
    { id: "f-kuwari", name: "Al-Kuwari", members: 5, hours: { kinship: 25, heritage: 25, volunteering: 28, health: 25 }, completed: 29, last: "2026-10-22" },
    { id: "f-marri", name: "Al-Marri", members: 7, hours: { kinship: 22, heritage: 19, volunteering: 24, health: 18 }, completed: 24, last: "2026-10-25" },
    { id: "f-naimi", name: "Al-Naimi", members: 4, hours: { kinship: 18, heritage: 15, volunteering: 12, health: 21 }, completed: 19, last: "2026-10-23" },
    { id: "f-kaabi", name: "Al-Kaabi", members: 5, hours: { kinship: 14, heritage: 11, volunteering: 15, health: 9 }, completed: 14, last: "2026-10-20" },
    { id: "f-emadi", name: "Al-Emadi", members: 3, hours: { kinship: 10, heritage: 8, volunteering: 6, health: 12 }, completed: 11, last: "2026-10-25" },
    { id: "f-hajri", name: "Al-Hajri", members: 8, hours: { kinship: 9, heritage: 4, volunteering: 11, health: 4 }, completed: 9, last: "2026-10-18" },
    { id: "f-mannai", name: "Al-Mannai", members: 4, hours: { kinship: 3, heritage: 4, volunteering: 0, health: 6 }, completed: 4, last: "2026-10-26" }
  ],

  // Sample submissions waiting for the team to review on the admin dashboard.
  demoPending: [
    { id: "p1", familyId: "f-marri", activityId: "traditional-recipe", date: "2026-10-25", note: "Grandma taught us her harees. The kids did the stirring." },
    { id: "p2", familyId: "f-emadi", activityId: "family-walk", date: "2026-10-25", note: "Walked 9,000 steps at Aspire Park." },
    { id: "p3", familyId: "f-mannai", activityId: "giving-back", date: "2026-10-26", note: "Two boxes of books for the school library drive." }
  ],

  // How often each challenge has been completed by the sample families.
  demoActivityCounts: {
    "family-gathering": 26, "grandparents-stories": 10, "family-tree": 6,
    "landmarks-tour": 12, "traditional-recipe": 15, "proverbs": 8,
    "volunteer-family": 11, "giving-back": 9, "national-event": 6,
    "family-walk": 23, "screen-free": 7, "skill-workshop": 8
  },

  // Used by "Fill with a sample family" on the passport page, for presentations.
  sampleFamily: {
    name: "Al-Mohannadi",
    members: ["Grandmother Moza", "Ahmed", "Fatima", "Hamad", "Noora"],
    logs: [
      { activityId: "family-gathering", date: "2026-09-04", status: "verified" },
      { activityId: "family-walk", date: "2026-09-06", status: "verified" },
      { activityId: "landmarks-tour", date: "2026-09-12", status: "verified" },
      { activityId: "grandparents-stories", date: "2026-09-18", status: "verified" },
      { activityId: "volunteer-family", date: "2026-09-26", status: "verified" },
      { activityId: "family-gathering", date: "2026-10-02", status: "verified" },
      { activityId: "screen-free", date: "2026-10-09", status: "verified" },
      { activityId: "traditional-recipe", date: "2026-10-16", status: "verified" },
      { activityId: "giving-back", date: "2026-10-20", status: "verified" },
      { activityId: "family-walk", date: "2026-10-23", status: "verified" },
      { activityId: "proverbs", date: "2026-10-25", status: "pending" }
    ]
  }
};
