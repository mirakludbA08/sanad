/*
  Sanad website content.
  Everything a non-developer may want to change lives in this file:
  the four areas, the challenges and their hours, events, sample stories
  and the sample families shown on the admin dashboard.
*/
window.SANAD = {
  goalHours: 100,

  // How families earn points. Only hours approved by the Sanad team count.
  points: {
    perHour: 10,          // every approved hour
    areaComplete: 100,    // bonus when an area reaches its target hours
    passportComplete: 250 // bonus when the family reaches 100 approved hours
  },

  // Show the sample families on the leaderboard and dashboard (useful for presenting).
  showSampleFamilies: true,

  // The Sanad tagline from the poster.
  tagline: {
    ar: "نقرب القلوب قبل لا تبعدنا الأيام",
    en: "Bringing hearts closer, before the days pull us apart."
  },

  // The four areas. `target` is the suggested hours per area (4 x 25 = 100).
  // `fill` colors charts and progress cells; `ink` colors text and stamps.
  // `goalAr` is the line from the Sanad poster; `photo` is the area's picture.
  domains: [
    {
      id: "kinship",
      name: "Kinship ties",
      nameAr: "صلة الرحم",
      ar: "صلة الرحم",
      short: "Kinship",
      shortAr: "صلة الرحم",
      goalAr: "تعزيز الترابط والتواصل الأسري",
      goal: "Strengthening family bonds and connection.",
      photo: "assets/img/area-kinship.jpg",
      photoAlt: "An elder's hand holding a young girl's hand on a Sadu rug",
      photoAltAr: "يد أحد كبار السن تمسك بيد طفلة صغيرة على بساط من السدو",
      fill: "#A12A4A",
      ink: "#7E1A36",
      target: 25,
      blurb: "Time with grandparents, gatherings and reconnecting with relatives.",
      blurbAr: "وقتٌ مع الأجداد، وجلسات عائلية، وتجديد الوصل مع الأقارب."
    },
    {
      id: "heritage",
      name: "National identity",
      nameAr: "الهوية الوطنية",
      ar: "الهوية الوطنية",
      short: "Heritage",
      shortAr: "الهوية",
      goalAr: "المحافظة على التراث والهوية الوطنية",
      goal: "Preserving our heritage and national identity.",
      photo: "assets/img/area-heritage.jpg",
      photoAlt: "The Qatari flag on a plaster wall beside a lantern at sunset",
      photoAltAr: "العلم القطري على جدار من الجص بجانب فانوس وقت الغروب",
      fill: "#B37F2A",
      ink: "#7A5418",
      target: 25,
      blurb: "Museums, recipes, proverbs and the stories that make us Qatari.",
      blurbAr: "المتاحف والأكلات الشعبية والأمثال والحكايات التي تصنع هويتنا القطرية."
    },
    {
      id: "volunteering",
      name: "Volunteering",
      nameAr: "التطوع",
      ar: "التطوع",
      short: "Volunteering",
      shortAr: "التطوع",
      goalAr: "تشجيع العمل التطوعي في المجتمع",
      goal: "Encouraging volunteering in the community.",
      photo: "assets/img/area-volunteering.jpg",
      photoAlt: "Volunteers planting young trees together",
      photoAltAr: "متطوعون يزرعون أشجارًا صغيرة معًا",
      fill: "#3F8A5F",
      ink: "#2C6544",
      target: 25,
      blurb: "Giving back as a family, from beach cleanups to community events.",
      blurbAr: "العطاء كعائلة واحدة، من تنظيف الشواطئ إلى الفعاليات المجتمعية."
    },
    {
      id: "health",
      name: "Health & skills",
      nameAr: "الصحة والمهارات",
      ar: "الصحة والمهارات",
      short: "Health",
      shortAr: "الصحة",
      goalAr: "تنمية المهارات الصحية والبدنية",
      goal: "Building healthy habits and physical skills.",
      photo: "assets/img/area-health.jpg",
      photoAlt: "A water bottle and trainers on a maroon mat by the Doha corniche at sunset",
      photoAltAr: "قارورة ماء وحذاء رياضي على سجادة رياضية عنابية عند كورنيش الدوحة وقت الغروب",
      fill: "#4A73B0",
      ink: "#2F5488",
      target: 25,
      blurb: "Walks, screen-free days and learning hands-on skills together.",
      blurbAr: "المشي، وأيام بلا شاشات، وتعلّم مهارات عملية معًا."
    }
  ],

  // Hours per challenge are placeholders for the Sanad team to confirm.
  activities: [
    {
      id: "family-gathering",
      domain: "kinship",
      name: "Weekly Family Gathering",
      nameAr: "تجمّع العائلة الأسبوعي",
      hours: 3,
      description: "Organize a family gathering, visit elders, or host a family meal. Capture the moment with a photo and a message of gratitude.",
      descriptionAr: "نظّموا تجمعًا عائليًا، أو زوروا كبار العائلة، أو استضيفوا وجبة عائلية. وثّقوا اللحظة بصورة ورسالة شكر وامتنان.",
      tasks: [
        "Bring at least two generations together",
        "Visit an elder or host a family meal",
        "Take a group photo",
        "Write a short message of gratitude"
      ],
      tasksAr: [
        "اجمعوا جيلين على الأقل",
        "زوروا أحد كبار العائلة أو استضيفوا وجبة عائلية",
        "التقطوا صورة جماعية",
        "اكتبوا رسالة شكر قصيرة"
      ],
      noteLabel: "Your message of gratitude",
      noteLabelAr: "رسالة الشكر والامتنان"
    },
    {
      id: "grandparents-stories",
      domain: "kinship",
      name: "Grandparents' Storytelling Session",
      nameAr: "جلسة حكايات الأجداد",
      hours: 4,
      description: "Children and grandchildren interview a grandparent and record their memories and family history for the Family Archive.",
      descriptionAr: "يحاور الأبناء والأحفاد أحد الأجداد، ويسجّلون ذكرياته وتاريخ العائلة ليحفظوها في أرشيف العائلة.",
      tasks: [
        "Prepare five questions with the children",
        "Record the conversation as audio or video",
        "Add the story to the Family Archive"
      ],
      tasksAr: [
        "حضّروا خمسة أسئلة مع الأطفال",
        "سجّلوا الحوار بالصوت أو الفيديو",
        "أضيفوا الحكاية إلى أرشيف العائلة"
      ],
      link: { href: "#/archive", label: "Add the story to the archive", labelAr: "أضيفوا الحكاية إلى الأرشيف" }
    },
    {
      id: "family-tree",
      domain: "kinship",
      name: "Digital Family Tree",
      nameAr: "شجرة العائلة الرقمية",
      hours: 5,
      description: "Map your family's ancestry together, reconnect with extended relatives and strengthen kinship bonds.",
      descriptionAr: "ارسموا معًا شجرة نسب عائلتكم، وأعيدوا التواصل مع الأقارب، وقوّوا روابط صلة الرحم.",
      tasks: [
        "Map at least three generations",
        "Call a relative you haven't spoken to in a while",
        "Share a photo of your finished tree"
      ],
      tasksAr: [
        "ارسموا ثلاثة أجيال على الأقل",
        "اتصلوا بقريب لم تتحدثوا معه منذ مدة",
        "شاركوا صورة شجرتكم بعد اكتمالها"
      ]
    },
    {
      id: "landmarks-tour",
      domain: "heritage",
      name: "Cultural Landmarks Tour",
      nameAr: "جولة المعالم الثقافية",
      hours: 4,
      description: "Visit a national museum or heritage site, such as the National Museum of Qatar, Souq Waqif or Katara Cultural Village, then answer a short quiz about it.",
      descriptionAr: "زوروا متحفًا وطنيًا أو موقعًا تراثيًا، مثل متحف قطر الوطني أو سوق واقف أو الحي الثقافي كتارا، ثم أجيبوا عن اختبار قصير عنه.",
      tasks: [
        "Visit a museum or heritage site together",
        "Take a group photo at the venue",
        "Answer the three-question quiz"
      ],
      tasksAr: [
        "زوروا معًا متحفًا أو موقعًا تراثيًا",
        "التقطوا صورة جماعية في المكان",
        "أجيبوا عن الاختبار المكوّن من ثلاثة أسئلة"
      ],
      quiz: [
        {
          q: "The design of the National Museum of Qatar was inspired by which natural form?",
          qAr: "من أي شكل طبيعي استُوحي تصميم متحف قطر الوطني؟",
          options: ["A pearl oyster", "The desert rose", "A sand dune"],
          optionsAr: ["محارة اللؤلؤ", "وردة الصحراء", "كثيب رملي"],
          answer: 1
        },
        {
          q: "Before oil, what was the main source of income for many Qatari families?",
          qAr: "قبل النفط، ما مصدر الرزق الرئيسي لكثير من العائلات القطرية؟",
          options: ["Pearl diving", "Coffee farming", "Gold mining"],
          optionsAr: ["الغوص على اللؤلؤ", "زراعة القهوة", "التنقيب عن الذهب"],
          answer: 0
        },
        {
          q: "What does the name Souq Waqif mean?",
          qAr: "لماذا سُمّي «سوق واقف» بهذا الاسم؟",
          options: ["The old market", "The sea market", "The standing market"],
          optionsAr: ["لأنه أقدم سوق في الدوحة", "لأنه كان على البحر", "لأن الباعة كانوا يبيعون وقوفًا"],
          answer: 2
        }
      ]
    },
    {
      id: "traditional-recipe",
      domain: "heritage",
      name: "Traditional Recipe Challenge",
      nameAr: "تحدي الأكلات الشعبية",
      hours: 3,
      description: "Cook a traditional Qatari dish across generations, grandparents and grandchildren together, and share the recipe with a short video.",
      descriptionAr: "اطبخوا طبقًا قطريًا شعبيًا تتشارك فيه الأجيال، الأجداد والأحفاد معًا، وشاركوا الوصفة بمقطع فيديو قصير.",
      tasks: [
        "Pick a dish such as machboos, harees or luqaimat",
        "Cook it together across generations",
        "Film a short clip and write down the recipe"
      ],
      tasksAr: [
        "اختاروا طبقًا مثل المجبوس أو الهريس أو اللقيمات",
        "اطبخوه معًا بمشاركة الأجيال",
        "صوّروا مقطعًا قصيرًا واكتبوا الوصفة"
      ],
      noteLabel: "The recipe",
      noteLabelAr: "الوصفة"
    },
    {
      id: "proverbs",
      domain: "heritage",
      name: "Qatari Proverbs & Heritage Stories",
      nameAr: "أمثال وحكايات من تراثنا",
      hours: 2,
      description: "Learn traditional Qatari proverbs, wisdom and stories from your elders and pass them on to the next generation.",
      descriptionAr: "تعلّموا من كبار العائلة الأمثال والحِكم والحكايات القطرية الشعبية، وانقلوها إلى الجيل القادم.",
      tasks: [
        "Learn three proverbs from an elder",
        "Explain what each one means in your own words",
        "Share your favourite with the family"
      ],
      tasksAr: [
        "تعلّموا ثلاثة أمثال من أحد كبار العائلة",
        "اشرحوا معنى كل مثل بأسلوبكم",
        "شاركوا مثلكم المفضل مع العائلة"
      ],
      noteLabel: "The proverbs you learned",
      noteLabelAr: "الأمثال التي تعلّمتموها"
    },
    {
      id: "volunteer-family",
      logHours: true,
      maxHours: 10,
      domain: "volunteering",
      name: "Volunteer Family Challenge",
      nameAr: "تحدي العائلة المتطوعة",
      hours: 5,
      description: "Run a small volunteering initiative as a whole family, such as a beach cleanup, distributing meals or joining Youth Center activities.",
      descriptionAr: "نفّذوا مبادرة تطوعية صغيرة بمشاركة العائلة كلها، مثل تنظيف الشاطئ أو توزيع الوجبات أو المشاركة في أنشطة مركز الشباب.",
      tasks: [
        "Choose a cause and plan it together",
        "Every family member takes part",
        "Photograph the initiative"
      ],
      tasksAr: [
        "اختاروا قضية وخطّطوا لها معًا",
        "يشارك كل فرد من أفراد العائلة",
        "وثّقوا المبادرة بالصور"
      ]
    },
    {
      id: "giving-back",
      logHours: true,
      maxHours: 8,
      domain: "volunteering",
      name: "Giving Back Initiative",
      nameAr: "مبادرة العطاء",
      hours: 3,
      description: "Donate gently used items, books or toys to a charitable organization and log the hours you spent sorting and delivering them.",
      descriptionAr: "تبرّعوا بأغراض أو كتب أو ألعاب مستعملة بحالة جيدة لجهة خيرية، وسجّلوا الساعات التي قضيتموها في فرزها وتوصيلها.",
      tasks: [
        "Sort the items to donate together",
        "Deliver them to a charity",
        "Log the hours you spent"
      ],
      tasksAr: [
        "افرزوا معًا الأغراض التي ستتبرعون بها",
        "سلّموها إلى جهة خيرية",
        "سجّلوا الساعات التي قضيتموها"
      ]
    },
    {
      id: "national-event",
      domain: "volunteering",
      name: "National Event Participation",
      nameAr: "المشاركة في الفعاليات الوطنية",
      hours: 6,
      description: "Register your family as a group for a community volunteering event organized by the Youth Center or the Ministry of Sports and Youth.",
      descriptionAr: "سجّلوا عائلتكم كمجموعة في فعالية تطوعية مجتمعية ينظّمها مركز الشباب أو وزارة الرياضة والشباب.",
      tasks: [
        "Register on the Events page",
        "Attend as a family group",
        "Upload a photo from the event"
      ],
      tasksAr: [
        "سجّلوا عبر صفحة الفعاليات",
        "احضروا كمجموعة عائلية",
        "ارفعوا صورة من الفعالية"
      ],
      link: { href: "#/events", label: "See upcoming events", labelAr: "اطّلعوا على الفعاليات القادمة" }
    },
    {
      id: "family-walk",
      logHours: true,
      maxHours: 6,
      domain: "health",
      name: "Family Walk & Sports Challenge",
      nameAr: "تحدي المشي والرياضة العائلي",
      hours: 2,
      description: "Reach a step goal together or join a group walk in a public park such as Aspire Park, and log how long you were active.",
      descriptionAr: "حقّقوا معًا هدفًا لعدد الخطوات أو انضموا إلى مشي جماعي في حديقة عامة مثل حديقة أسباير، وسجّلوا مدة نشاطكم.",
      tasks: [
        "Set a family step goal",
        "Walk or play sport together for at least an hour",
        "Log the duration"
      ],
      tasksAr: [
        "حدّدوا هدفًا عائليًا لعدد الخطوات",
        "امشوا أو مارسوا الرياضة معًا لمدة ساعة على الأقل",
        "سجّلوا المدة"
      ]
    },
    {
      id: "screen-free",
      domain: "health",
      name: "Screen-Free Day",
      nameAr: "يوم بلا شاشات",
      hours: 6,
      description: "Spend a full day on outdoor activities, board games and mind games, with no smartphones, so the family talks and plays face to face.",
      descriptionAr: "اقضوا يومًا كاملًا في الأنشطة الخارجية والألعاب اللوحية وألعاب الذكاء، بلا هواتف ذكية، لتتحاور العائلة وتلعب وجهًا لوجه.",
      tasks: [
        "Agree on the day together",
        "Put phones away from morning to evening",
        "Play at least one board game or outdoor game"
      ],
      tasksAr: [
        "اتفقوا معًا على اليوم",
        "أبعدوا الهواتف من الصباح حتى المساء",
        "العبوا لعبة لوحية أو لعبة خارجية واحدة على الأقل"
      ]
    },
    {
      id: "skill-workshop",
      domain: "health",
      name: "Hands-On Skill Workshop",
      nameAr: "ورشة مهارات عملية",
      hours: 3,
      description: "Hold a home workshop to learn a practical or creative skill together, such as home gardening, painting or upcycling.",
      descriptionAr: "أقيموا ورشة في البيت لتتعلموا معًا مهارة عملية أو إبداعية، مثل الزراعة المنزلية أو الرسم أو إعادة التدوير الإبداعي.",
      tasks: [
        "Choose a skill and gather the materials",
        "One family member teaches the others",
        "Show what you made"
      ],
      tasksAr: [
        "اختاروا مهارة وجهّزوا الأدوات اللازمة",
        "يعلّم أحد أفراد العائلة البقية",
        "اعرضوا ما صنعتموه"
      ]
    }
  ],

  // Sample events. Dates and venues are placeholders until the team confirms them.
  events: [
    {
      id: "beach-cleanup",
      domain: "volunteering",
      title: "Family Beach Cleanup",
      titleAr: "حملة تنظيف الشاطئ العائلية",
      date: "2026-11-06",
      time: "7:00 to 10:00 am",
      timeAr: "7:00 – 10:00 صباحًا",
      location: "Al Wakrah Beach",
      locationAr: "شاطئ الوكرة",
      hours: 3,
      capacity: 40,
      registered: 23,
      description: "Gloves, bags and water are provided. Children under 10 join with a parent.",
      descriptionAr: "نوفّر القفازات والأكياس ومياه الشرب. يشارك الأطفال دون 10 سنوات برفقة أحد الوالدين."
    },
    {
      id: "aspire-walk",
      domain: "health",
      title: "Family Walk at Aspire Park",
      titleAr: "مشي عائلي في حديقة أسباير",
      date: "2026-11-14",
      time: "4:00 to 6:00 pm",
      timeAr: "4:00 – 6:00 مساءً",
      location: "Aspire Park, Doha",
      locationAr: "حديقة أسباير، الدوحة",
      hours: 2,
      capacity: 60,
      registered: 41,
      description: "A 5 km loop at an easy pace, with a short stretching session for grandparents.",
      descriptionAr: "مسار دائري بطول 5 كم بوتيرة هادئة، مع جلسة إطالة قصيرة للأجداد."
    },
    {
      id: "katara-heritage",
      domain: "heritage",
      title: "Heritage Morning at Katara",
      titleAr: "صباح تراثي في كتارا",
      date: "2026-11-20",
      time: "9:00 am to 12:00 pm",
      timeAr: "9:00 صباحًا – 12:00 ظهرًا",
      location: "Katara Cultural Village",
      locationAr: "الحي الثقافي كتارا",
      hours: 3,
      capacity: 35,
      registered: 12,
      description: "Traditional games, a storytelling circle with elders and a guided walk through the village.",
      descriptionAr: "ألعاب شعبية، وحلقة حكايات مع كبار السن، وجولة بصحبة مرشد في أرجاء الحي الثقافي."
    },
    {
      id: "meal-packing",
      domain: "volunteering",
      title: "Community Meal Packing",
      titleAr: "تعبئة الوجبات للمجتمع",
      date: "2026-11-28",
      time: "3:00 to 6:00 pm",
      timeAr: "3:00 – 6:00 مساءً",
      location: "Doha, venue to be confirmed",
      locationAr: "الدوحة، يُحدَّد المكان لاحقًا",
      hours: 3,
      capacity: 30,
      registered: 30,
      description: "Families pack and label meal boxes together for distribution to workers and families in need.",
      descriptionAr: "تتعاون العائلات في تعبئة صناديق الوجبات ووضع الملصقات عليها، لتوزيعها على العمال والأسر المحتاجة."
    },
    {
      id: "national-day",
      domain: "volunteering",
      title: "National Day Family Volunteering",
      titleAr: "تطوع العائلة في اليوم الوطني",
      date: "2026-12-11",
      time: "8:00 am to 12:00 pm",
      timeAr: "8:00 صباحًا – 12:00 ظهرًا",
      location: "Darb Al Saai, Doha",
      locationAr: "درب الساعي، الدوحة",
      hours: 4,
      capacity: 50,
      registered: 9,
      description: "Help welcome visitors and run children's activities in the week before Qatar National Day.",
      descriptionAr: "ساعدوا في استقبال الزوار وتنظيم أنشطة الأطفال خلال الأسبوع الذي يسبق اليوم الوطني لدولة قطر."
    }
  ],

  // Sample archive stories, written as placeholders.
  stories: [
    {
      id: "s-pearling",
      title: "The summer my father went to sea",
      titleAr: "الصيف الذي ركب فيه أبي البحر",
      teller: "Grandfather Rashid",
      tellerAr: "الجد راشد",
      recorder: "Hamad, his grandson",
      recorderAr: "حمد، حفيده",
      era: "1950s",
      eraAr: "الخمسينيات",
      text: [
        "Every summer the boats left for the pearl banks and the neighbourhood went quiet. My father was a diver, and for four months we only had the sea breeze and my mother's stories.",
        "When the boats came back, the whole fereej went down to the shore. You could hear the nahham singing before you could see the sails. I ran so fast I lost a sandal in the sand, and I never found it.",
        "He brought me a single small pearl that year. It wasn't worth much, but I kept it in a tin for sixty years. I gave it to Hamad's mother on her wedding day."
      ],
      textAr: [
        "في كل صيف كانت السفن تُبحر إلى مغاصات اللؤلؤ، فيهدأ الفريج كله. كان أبي غوّاصًا، ولأربعة أشهر لم يكن لنا إلا نسيم البحر وحكايات أمي.",
        "وحين تعود السفن، كان الفريج كله ينزل إلى الساحل. كنا نسمع غناء النهّام قبل أن نرى الأشرعة. ركضتُ مرة بكل ما فيّ من قوة حتى ضاع نعلي في الرمل، ولم أجده إلى اليوم.",
        "في تلك السنة أحضر لي أبي لؤلؤة صغيرة واحدة. لم تكن غالية الثمن، لكني حفظتها في علبة من الصفيح ستين سنة، ثم أهديتها لأم حمد يوم زفافها."
      ]
    },
    {
      id: "s-garangao",
      title: "Garangao nights in the old fereej",
      titleAr: "ليالي القرقيعان في الفريج القديم",
      teller: "Grandmother Noora",
      tellerAr: "الجدة نورة",
      recorder: "Maryam and Sara, her granddaughters",
      recorderAr: "مريم وسارة، حفيدتاها",
      era: "1960s",
      eraAr: "الستينيات",
      text: [
        "On the fourteenth night of Ramadan we wore our new clothes and went from door to door with cloth bags, singing for nuts and sweets.",
        "My brother always carried the biggest bag and gave half of it to the younger children on the way home. My mother said that was the real lesson of Garangao, not the sweets.",
        "Now I sit at the door and the children come to me. I make sure the smallest ones get the most."
      ],
      textAr: [
        "في ليلة الرابع عشر من رمضان كنا نلبس ثيابنا الجديدة، ونطوف على البيوت بابًا بابًا بأكياس القماش، نغني ونجمع المكسرات والحلوى.",
        "كان أخي يحمل دائمًا أكبر كيس، وفي طريق العودة يعطي نصفه للصغار. وكانت أمي تقول إن هذا هو درس القرقيعان الحقيقي، لا الحلوى.",
        "واليوم صرتُ أنا التي تجلس عند الباب، والأطفال هم الذين يأتونني. وأحرص دائمًا على أن ينال أصغرهم النصيب الأكبر."
      ]
    },
    {
      id: "s-souq",
      title: "Sweets from the old souq",
      titleAr: "حلويات من السوق القديم",
      teller: "Grandmother Moza",
      tellerAr: "الجدة موزة",
      recorder: "Ahmed, her grandson",
      recorderAr: "أحمد، حفيدها",
      era: "1970s",
      eraAr: "السبعينيات",
      text: [
        "On Thursdays my aunt took me to the souq. There was a man who made luqaimat in a huge pan, and he would always drop one extra into my paper cone.",
        "We walked home along the shore because there were no big roads yet. I still make luqaimat with his trick: a little saffron in the date syrup."
      ],
      textAr: [
        "كل يوم خميس كانت عمتي تأخذني إلى السوق. وكان هناك رجل يقلي اللقيمات في قدر كبير، وكان دائمًا يزيدني لقيمة في قرطاسي الورقي.",
        "وكنا نعود إلى البيت مشيًا على الساحل، فلم تكن الشوارع الكبيرة قد شُقّت بعد. وما زلت إلى اليوم أصنع اللقيمات بسرّه: قليل من الزعفران في دبس التمر."
      ]
    }
  ],

  // Sample families for the admin dashboard. Hours are approved hours per area.
  demoFamilies: [
    { id: "f-sulaiti", name: "Al-Sulaiti", nameAr: "السليطي", members: 6, hours: { kinship: 27, heritage: 25, volunteering: 26, health: 25 }, completed: 31, last: "2026-10-24" },
    { id: "f-kuwari", name: "Al-Kuwari", nameAr: "الكواري", members: 5, hours: { kinship: 25, heritage: 25, volunteering: 28, health: 25 }, completed: 29, last: "2026-10-22" },
    { id: "f-marri", name: "Al-Marri", nameAr: "المري", members: 7, hours: { kinship: 22, heritage: 19, volunteering: 24, health: 18 }, completed: 24, last: "2026-10-25" },
    { id: "f-naimi", name: "Al-Naimi", nameAr: "النعيمي", members: 4, hours: { kinship: 18, heritage: 15, volunteering: 12, health: 21 }, completed: 19, last: "2026-10-23" },
    { id: "f-kaabi", name: "Al-Kaabi", nameAr: "الكعبي", members: 5, hours: { kinship: 14, heritage: 11, volunteering: 15, health: 9 }, completed: 14, last: "2026-10-20" },
    { id: "f-emadi", name: "Al-Emadi", nameAr: "العمادي", members: 3, hours: { kinship: 10, heritage: 8, volunteering: 6, health: 12 }, completed: 11, last: "2026-10-25" },
    { id: "f-hajri", name: "Al-Hajri", nameAr: "الهاجري", members: 8, hours: { kinship: 9, heritage: 4, volunteering: 11, health: 4 }, completed: 9, last: "2026-10-18" },
    { id: "f-mannai", name: "Al-Mannai", nameAr: "المناعي", members: 4, hours: { kinship: 3, heritage: 4, volunteering: 0, health: 6 }, completed: 4, last: "2026-10-26" }
  ],

  // Sample submissions waiting for the team to review on the admin dashboard.
  demoPending: [
    { id: "p1", familyId: "f-marri", activityId: "traditional-recipe", date: "2026-10-25", note: "Grandma taught us her harees. The kids did the stirring.", noteAr: "علّمتنا الجدة طريقتها في الهريس، وتولّى الصغار التحريك." },
    { id: "p2", familyId: "f-emadi", activityId: "family-walk", date: "2026-10-25", note: "Walked 9,000 steps at Aspire Park.", noteAr: "مشينا 9,000 خطوة في حديقة أسباير." },
    { id: "p3", familyId: "f-mannai", activityId: "giving-back", date: "2026-10-26", note: "Two boxes of books for the school library drive.", noteAr: "صندوقان من الكتب لحملة دعم مكتبة المدرسة." }
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
    nameAr: "المهندي",
    members: ["Grandmother Moza", "Ahmed", "Fatima", "Hamad", "Noora"],
    membersAr: ["الجدة موزة", "أحمد", "فاطمة", "حمد", "نورة"],
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
