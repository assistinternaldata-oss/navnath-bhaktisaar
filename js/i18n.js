// UI strings in Marathi, Hindi and English. The pothi text itself is always Marathi.
export const LANGS = {
  mr: { name: 'मराठी', locale: 'mr-IN' },
  hi: { name: 'हिंदी', locale: 'hi-IN' },
  en: { name: 'English', locale: 'en-IN' },
};

const S = {
  appName:      { mr: 'श्री नवनाथ भक्तिसार', hi: 'श्री नवनाथ भक्तिसार', en: 'Shri Navnath Bhaktisaar' },
  author:       { mr: 'धुंडीसुत मालू नरहरी विरचित', hi: 'धुंडीसुत मालू नरहरि रचित', en: 'by Dhundisut Malu Narhari' },
  chooseLang:   { mr: 'भाषा निवडा', hi: 'भाषा चुनें', en: 'Choose language' },
  chooseLangHint:{ mr: 'मेनू आणि बटणांसाठी. पोथी मराठीतच राहील.', hi: 'मेनू और बटनों के लिए। पोथी मराठी में ही रहेगी।', en: 'For menus and buttons. The pothi stays in Marathi.' },

  navPothi:     { mr: 'पोथी', hi: 'पोथी', en: 'Pothi' },
  navParayan:   { mr: 'पारायण', hi: 'पारायण', en: 'Parayan' },
  navSearch:    { mr: 'शोध', hi: 'खोज', en: 'Search' },
  navMarks:     { mr: 'खुणा', hi: 'बुकमार्क', en: 'Bookmarks' },
  navSettings:  { mr: 'सेटिंग्ज', hi: 'सेटिंग्स', en: 'Settings' },
  navVideos:    { mr: 'व्हिडिओ', hi: 'वीडियो', en: 'Videos' },
  navMantra:    { mr: 'मंत्र', hi: 'मंत्र', en: 'Mantras' },

  reminder:     { mr: 'पारायणाची रोज आठवण', hi: 'पारायण की रोज़ याद', en: 'Daily parayan reminder' },
  reminderTime: { mr: 'वेळ', hi: 'समय', en: 'Time' },
  reminderHint: { mr: 'पारायण सुरू असताना रोज या वेळी आजचे अध्याय सांगणारी सूचना येईल.', hi: 'पारायण चलते समय रोज़ इस समय आज के अध्याय बताने वाली सूचना आएगी।', en: "While a parayan is running, you'll get a notification at this time with the day's adhyays." },
  reminderOff:  { mr: 'सूचनांना परवानगी मिळाली नाही. फोनच्या सेटिंग्जमध्ये या ॲपसाठी सूचना सुरू करा.', hi: 'सूचनाओं की अनुमति नहीं मिली। फ़ोन की सेटिंग्स में इस ऐप के लिए सूचनाएँ चालू करें।', en: 'Notifications are not allowed. Turn them on for this app in your phone settings.' },
  remindBody:   { mr: 'दिवस {d}/{n} · आजचे अध्याय: {list}', hi: 'दिन {d}/{n} · आज के अध्याय: {list}', en: 'Day {d} of {n} · today: Adhyay {list}' },
  remindNone:   { mr: 'पारायण सुरू केल्यावर आठवण येईल.', hi: 'पारायण शुरू करने पर याद दिलाई जाएगी।', en: 'Reminders start when you begin a parayan.' },

  mantrasIntro: { mr: 'नाथ संप्रदायातील मंत्र — जपासाठी माळ-गणकासह.', hi: 'नाथ संप्रदाय के मंत्र — जप के लिए माला-गणक के साथ।', en: 'Mantras of the Nath tradition, with a mala counter for japa.' },
  japa:         { mr: 'जप', hi: 'जप', en: 'Japa' },
  tapToCount:   { mr: 'प्रत्येक जपानंतर वर्तुळावर टॅप करा', hi: 'हर जप के बाद गोले पर टैप करें', en: 'Tap the circle after each chant' },
  countBtn:     { mr: 'जप मोजा', hi: 'जप गिनें', en: 'Count one chant' },
  malaN:        { mr: 'माळा: {n}', hi: 'माला: {n}', en: 'Malas: {n}' },
  totalN:       { mr: 'एकूण जप: {n}', hi: 'कुल जप: {n}', en: 'Total: {n}' },
  malaDone:     { mr: 'माळ पूर्ण झाली 🙏', hi: 'माला पूर्ण हुई 🙏', en: 'Mala complete 🙏' },
  minusOne:     { mr: 'एक कमी', hi: 'एक कम', en: 'Undo one' },
  resetCount:   { mr: 'शून्य करा', hi: 'शून्य करें', en: 'Reset' },
  resetJapaQ:   { mr: 'या मंत्राचा जप-गणक शून्य करायचा?', hi: 'इस मंत्र का जप-गणक शून्य करें?', en: 'Reset the counter for this mantra?' },
  target:       { mr: 'एका माळेत', hi: 'एक माला में', en: 'Per mala' },
  relatedAdhyay:{ mr: 'संबंधित: अध्याय {n}', hi: 'संबंधित: अध्याय {n}', en: 'Related: Adhyay {n}' },
  watchMantra:  { mr: 'व्हिडिओसोबत जप करा', hi: 'वीडियो के साथ जप करें', en: 'Chant along with the video' },
  linesN:       { mr: '{n} ओळी', hi: '{n} पंक्तियाँ', en: '{n} lines' },
  chantedN:     { mr: '{n} जप', hi: '{n} जप', en: '{n} chanted' },

  series:       { mr: 'हिंदी कथा मालिका', hi: 'हिंदी कथा श्रृंखला', en: 'Hindi story series' },
  seeAll:       { mr: 'सर्व पहा', hi: 'सभी देखें', en: 'See all' },
  songs:        { mr: 'नवनाथ गीते', hi: 'नवनाथ गीत', en: 'Navnath songs' },
  byAdhyay:     { mr: 'अध्यायानुसार भाग', hi: 'अध्याय अनुसार एपिसोड', en: 'Episodes by adhyay' },
  partN:        { mr: 'भाग {n}', hi: 'भाग {n}', en: 'Part {n}' },
  fullAdhyay:   { mr: 'पूर्ण अध्याय', hi: 'पूर्ण अध्याय', en: 'Full adhyay' },
  song:         { mr: 'गीत', hi: 'गीत', en: 'Song' },
  minutes:      { mr: '{n} मि.', hi: '{n} मि.', en: '{n} min' },
  episodes:     { mr: '{n} भाग', hi: '{n} एपिसोड', en: '{n} episodes' },
  watchHere:    { mr: 'हा अध्याय हिंदीत पहा', hi: 'यह अध्याय हिंदी में देखें', en: 'Watch this adhyay in Hindi' },
  comingSoon:   { mr: 'या अध्यायाचा हिंदी भाग लवकरच येत आहे.', hi: 'इस अध्याय का हिंदी एपिसोड जल्द आ रहा है।', en: "This adhyay's Hindi episode is coming soon." },
  moreSoon:     { mr: 'पुढील अध्यायांचे भाग लवकरच — नवीन भागांसाठी सबस्क्राइब करा.', hi: 'आगे के अध्यायों के एपिसोड जल्द — नए एपिसोड के लिए सब्सक्राइब करें।', en: 'More adhyays are on the way — subscribe for new episodes.' },
  subscribe:    { mr: 'सबस्क्राइब करा', hi: 'सब्सक्राइब करें', en: 'Subscribe' },
  playlist:     { mr: 'पूर्ण प्लेलिस्ट', hi: 'पूरी प्लेलिस्ट', en: 'Full playlist' },
  channelBlurb: { mr: 'नवनाथ भक्तिसाराची कथा हिंदीत, ॲनिमेशनसह — प्रत्येक अध्यायाचा भाग.', hi: 'नवनाथ भक्तिसार की कथा हिंदी में, एनीमेशन के साथ — हर अध्याय का एपिसोड।', en: 'The Navnath Bhaktisaar story in Hindi, animated — an episode for every adhyay.' },
  openYoutube:  { mr: 'YouTube वर उघडा', hi: 'YouTube पर खोलें', en: 'Open in YouTube' },
  readAdhyay:   { mr: 'अध्याय वाचा', hi: 'अध्याय पढ़ें', en: 'Read the adhyay' },
  close:        { mr: 'बंद करा', hi: 'बंद करें', en: 'Close' },
  needsNet:     { mr: 'व्हिडिओ पाहण्यासाठी इंटरनेट लागेल.', hi: 'वीडियो देखने के लिए इंटरनेट चाहिए।', en: 'Videos need an internet connection.' },

  adhyay:       { mr: 'अध्याय', hi: 'अध्याय', en: 'Adhyay' },
  adhyayN:      { mr: 'अध्याय {n}', hi: 'अध्याय {n}', en: 'Adhyay {n}' },
  ovis:         { mr: '{n} ओव्या', hi: '{n} ओवियाँ', en: '{n} ovis' },
  oviN:         { mr: 'ओवी {n}', hi: 'ओवी {n}', en: 'Ovi {n}' },
  allAdhyays:   { mr: 'सर्व अध्याय', hi: 'सभी अध्याय', en: 'All adhyays' },
  readCount:    { mr: '४० पैकी {n} अध्याय वाचले', hi: '४० में से {n} अध्याय पढ़े', en: '{n} of 40 adhyays read' },
  continue:     { mr: 'वाचन पुढे सुरू ठेवा', hi: 'पढ़ना जारी रखें', en: 'Continue reading' },
  startReading: { mr: 'वाचन सुरू करा', hi: 'पढ़ना शुरू करें', en: 'Start reading' },
  fromOvi:      { mr: 'ओवी {n} पासून', hi: 'ओवी {n} से', en: 'from ovi {n}' },
  resumeHere:   { mr: 'ओवी {n} पासून पुढे वाचा', hi: 'ओवी {n} से आगे पढ़ें', en: 'Resume at ovi {n}' },

  markRead:     { mr: 'अध्याय पूर्ण झाला', hi: 'अध्याय पूर्ण हुआ', en: 'Mark adhyay as read' },
  isRead:       { mr: 'वाचला ✓', hi: 'पढ़ लिया ✓', en: 'Read ✓' },
  undo:         { mr: 'पूर्ववत करा', hi: 'वापस लें', en: 'Undo' },
  next:         { mr: 'पुढील अध्याय', hi: 'अगला अध्याय', en: 'Next adhyay' },
  prev:         { mr: 'मागील अध्याय', hi: 'पिछला अध्याय', en: 'Previous adhyay' },
  back:         { mr: 'मागे', hi: 'पीछे', en: 'Back' },
  watch:        { mr: 'हिंदी भाग पहा', hi: 'हिंदी एपिसोड देखें', en: 'Watch Hindi episode' },
  listen:       { mr: 'अध्याय ऐका', hi: 'अध्याय सुनें', en: 'Listen' },
  play:         { mr: 'चालू करा', hi: 'चलाएँ', en: 'Play' },
  pause:        { mr: 'थांबवा', hi: 'रोकें', en: 'Pause' },
  textSmaller:  { mr: 'अक्षर लहान', hi: 'अक्षर छोटे', en: 'Smaller text' },
  textBigger:   { mr: 'अक्षर मोठे', hi: 'अक्षर बड़े', en: 'Bigger text' },
  loading:      { mr: 'लोड होत आहे…', hi: 'लोड हो रहा है…', en: 'Loading…' },
  loadError:    { mr: 'अध्याय उघडता आला नाही. इंटरनेट तपासून पुन्हा प्रयत्न करा.', hi: 'अध्याय नहीं खुल सका। इंटरनेट जाँचकर फिर कोशिश करें।', en: "Couldn't open this adhyay. Check your connection and try again." },
  retry:        { mr: 'पुन्हा प्रयत्न करा', hi: 'फिर कोशिश करें', en: 'Try again' },

  bookmark:     { mr: 'खूण ठेवा', hi: 'बुकमार्क करें', en: 'Bookmark' },
  unbookmark:   { mr: 'खूण काढा', hi: 'बुकमार्क हटाएँ', en: 'Remove bookmark' },
  copy:         { mr: 'कॉपी', hi: 'कॉपी', en: 'Copy' },
  share:        { mr: 'शेअर', hi: 'शेयर', en: 'Share' },
  copied:       { mr: 'ओवी कॉपी केली', hi: 'ओवी कॉपी हुई', en: 'Ovi copied' },
  bookmarked:   { mr: 'खूण ठेवली', hi: 'बुकमार्क हुआ', en: 'Bookmarked' },
  unbookmarked: { mr: 'खूण काढली', hi: 'बुकमार्क हटाया', en: 'Bookmark removed' },
  marksEmpty:   { mr: 'अजून खुणा नाहीत. वाचताना कोणत्याही ओवीवर टॅप करून खूण ठेवा.', hi: 'अभी कोई बुकमार्क नहीं। पढ़ते समय किसी भी ओवी पर टैप करके बुकमार्क करें।', en: 'No bookmarks yet. While reading, tap any ovi to bookmark it.' },
  lastRead:     { mr: 'शेवटचे वाचन', hi: 'पिछला पाठ', en: 'Last read' },

  searchPh:     { mr: 'पोथीत शब्द शोधा…', hi: 'पोथी में शब्द खोजें…', en: 'Search the pothi in Marathi…' },
  searchHint:   { mr: 'मराठी शब्द टाइप करा — उदा. गोरक्ष, अलख, दत्तात्रेय', hi: 'मराठी शब्द टाइप करें — जैसे गोरक्ष, अलख, दत्तात्रेय', en: 'Type a Marathi word, e.g. गोरक्ष, अलख, दत्तात्रेय' },
  results:      { mr: '{n} ओव्यांत सापडले', hi: '{n} ओवियों में मिला', en: 'Found in {n} ovis' },
  resultsCap:   { mr: 'पहिले {n} दाखवत आहे', hi: 'पहले {n} दिखा रहे हैं', en: 'Showing the first {n}' },
  noResults:    { mr: 'काहीही सापडले नाही', hi: 'कुछ नहीं मिला', en: 'Nothing found' },
  indexing:     { mr: 'पोथी तयार करत आहे… {n}/४०', hi: 'पोथी तैयार हो रही है… {n}/४०', en: 'Preparing the pothi… {n}/40' },

  parayanTitle: { mr: 'पारायण', hi: 'पारायण', en: 'Parayan' },
  parayanIntro: { mr: 'संकल्प करून ठराविक दिवसांत ४० अध्याय वाचा. ॲप रोजचे अध्याय सांगेल आणि प्रगती लक्षात ठेवेल.', hi: 'संकल्प लेकर तय दिनों में ४० अध्याय पढ़ें। ऐप रोज़ के अध्याय बताएगा और प्रगति याद रखेगा।', en: 'Take a sankalp to read all 40 adhyays over a set number of days. The app shows each day’s adhyays and keeps your progress.' },
  howManyDays:  { mr: 'किती दिवसांचे पारायण?', hi: 'कितने दिनों का पारायण?', en: 'How many days?' },
  daysN:        { mr: '{n} दिवस', hi: '{n} दिन', en: '{n} days' },
  oneDay:       { mr: 'एक दिवस', hi: 'एक दिन', en: 'One day' },
  perDay:       { mr: 'रोज {n} अध्याय', hi: 'रोज़ {n} अध्याय', en: '{n} adhyays a day' },
  perDayRange:  { mr: 'रोज {a}–{b} अध्याय', hi: 'रोज़ {a}–{b} अध्याय', en: '{a}–{b} adhyays a day' },
  startDate:    { mr: 'आरंभ दिनांक', hi: 'आरंभ तिथि', en: 'Start date' },
  begin:        { mr: 'पारायण सुरू करा', hi: 'पारायण शुरू करें', en: 'Begin parayan' },
  dayOf:        { mr: 'दिवस {d} / {n}', hi: 'दिन {d} / {n}', en: 'Day {d} of {n}' },
  startsOn:     { mr: '{date} रोजी सुरू होईल', hi: '{date} को शुरू होगा', en: 'Starts on {date}' },
  today:        { mr: 'आजचे अध्याय', hi: 'आज के अध्याय', en: "Today's adhyays" },
  todayDone:    { mr: 'आजचे वाचन पूर्ण झाले. 🙏', hi: 'आज का पाठ पूरा हुआ। 🙏', en: "Today's reading is done. 🙏" },
  behind:       { mr: '{n} अध्याय मागे आहात', hi: '{n} अध्याय पीछे हैं', en: '{n} adhyays behind' },
  onTrack:      { mr: 'वेळापत्रकानुसार', hi: 'समय-सारणी के अनुसार', en: 'On schedule' },
  doneOf:       { mr: '४० पैकी {n} पूर्ण', hi: '४० में से {n} पूर्ण', en: '{n} of 40 done' },
  schedule:     { mr: 'संपूर्ण वेळापत्रक', hi: 'पूरी समय-सारणी', en: 'Full schedule' },
  dayN:         { mr: 'दिवस {n}', hi: 'दिन {n}', en: 'Day {n}' },
  stopParayan:  { mr: 'पारायण थांबवा', hi: 'पारायण रोकें', en: 'Stop this parayan' },
  stopConfirm:  { mr: 'हे पारायण थांबवायचे? प्रगती पुसली जाईल.', hi: 'यह पारायण रोकें? प्रगति मिट जाएगी।', en: 'Stop this parayan? Its progress will be cleared.' },
  complete:     { mr: 'पारायण पूर्ण झाले!', hi: 'पारायण पूर्ण हुआ!', en: 'Parayan complete!' },
  completeMsg:  { mr: 'चाळीसही अध्याय वाचून झाले.', hi: 'चालीसों अध्याय पढ़ लिए।', en: 'All forty adhyays are read.' },
  newParayan:   { mr: 'नवीन पारायण', hi: 'नया पारायण', en: 'New parayan' },
  history:      { mr: 'पूर्ण झालेली पारायणे', hi: 'पूर्ण हुए पारायण', en: 'Completed parayans' },
  historyRow:   { mr: '{days} दिवस · {from} – {to}', hi: '{days} दिन · {from} – {to}', en: '{days} days · {from} – {to}' },
  tapToMark:    { mr: 'खूण करण्यासाठी वर्तुळावर टॅप करा', hi: 'निशान लगाने के लिए गोले पर टैप करें', en: 'Tap a circle to tick an adhyay off' },
  inParayan:    { mr: 'पारायण', hi: 'पारायण', en: 'Parayan' },

  settings:     { mr: 'सेटिंग्ज', hi: 'सेटिंग्स', en: 'Settings' },
  language:     { mr: 'भाषा', hi: 'भाषा', en: 'Language' },
  theme:        { mr: 'रंगसंगती', hi: 'थीम', en: 'Theme' },
  themeAuto:    { mr: 'आपोआप', hi: 'स्वचालित', en: 'Auto' },
  themeLight:   { mr: 'उजळ', hi: 'हल्की', en: 'Light' },
  themeSepia:   { mr: 'पोथी', hi: 'पोथी', en: 'Sepia' },
  themeDark:    { mr: 'गडद', hi: 'गहरी', en: 'Dark' },
  textSize:     { mr: 'अक्षरांचा आकार', hi: 'अक्षरों का आकार', en: 'Text size' },
  font:         { mr: 'अक्षरशैली', hi: 'अक्षर शैली', en: 'Typeface' },
  fontPothi:    { mr: 'पारंपरिक', hi: 'पारंपरिक', en: 'Traditional' },
  fontModern:   { mr: 'आधुनिक', hi: 'आधुनिक', en: 'Modern' },
  preview:      { mr: 'ॐ नमो जी हेरंवमूर्ती ॥ वक्रतुंडा गणाधिपती', hi: 'ॐ नमो जी हेरंवमूर्ती ॥ वक्रतुंडा गणाधिपती', en: 'ॐ नमो जी हेरंवमूर्ती ॥ वक्रतुंडा गणाधिपती' },
  keepAwake:    { mr: 'वाचताना स्क्रीन चालू ठेवा', hi: 'पढ़ते समय स्क्रीन चालू रखें', en: 'Keep the screen on while reading' },
  install:      { mr: 'ॲप फोनवर जोडा', hi: 'ऐप फ़ोन पर जोड़ें', en: 'Install the app' },
  installBtn:   { mr: 'जोडा', hi: 'जोड़ें', en: 'Install' },
  installIos:   { mr: 'Safari मध्ये शेअर बटण ⎋ दाबा, मग “Add to Home Screen” निवडा.', hi: 'Safari में शेयर बटन ⎋ दबाएँ, फिर “Add to Home Screen” चुनें।', en: 'In Safari, tap Share ⎋ then “Add to Home Screen”.' },
  installed:    { mr: 'ॲप जोडलेले आहे ✓', hi: 'ऐप जुड़ा हुआ है ✓', en: 'App is installed ✓' },
  installOther: { mr: 'ब्राउझरच्या मेनूमधून “Install app” किंवा “Add to Home screen” निवडा.', hi: 'ब्राउज़र मेनू से “Install app” या “Add to Home screen” चुनें।', en: 'Use your browser menu: “Install app” or “Add to Home screen”.' },
  offline:      { mr: 'ऑफलाइन वाचन', hi: 'ऑफ़लाइन पाठ', en: 'Offline reading' },
  offlineReady: { mr: 'संपूर्ण पोथी फोनवर जतन आहे ✓', hi: 'पूरी पोथी फ़ोन में सहेजी है ✓', en: 'The whole pothi is saved on this device ✓' },
  offlineWait:  { mr: 'पोथी जतन होत आहे…', hi: 'पोथी सहेजी जा रही है…', en: 'Saving the pothi for offline use…' },
  offlineNo:    { mr: 'ऑफलाइन उपलब्ध नाही', hi: 'ऑफ़लाइन उपलब्ध नहीं', en: 'Offline not available here' },
  data:         { mr: 'माझी माहिती', hi: 'मेरा डेटा', en: 'My data' },
  dataHint:     { mr: 'प्रगती, खुणा आणि पारायण फक्त या फोनवर जतन होतात.', hi: 'प्रगति, बुकमार्क और पारायण सिर्फ़ इसी फ़ोन में सहेजे जाते हैं।', en: 'Progress, bookmarks and parayans are saved only on this device.' },
  resetAll:     { mr: 'सर्व पुसून टाका', hi: 'सब मिटाएँ', en: 'Erase everything' },
  resetConfirm: { mr: 'वाचन प्रगती, खुणा आणि पारायण सर्व पुसायचे?', hi: 'पढ़ने की प्रगति, बुकमार्क और पारायण सब मिटाएँ?', en: 'Erase reading progress, bookmarks and parayans?' },
  about:        { mr: 'पोथीविषयी', hi: 'पोथी के बारे में', en: 'About the pothi' },
  privacy:      { mr: 'गोपनीयता धोरण', hi: 'गोपनीयता नीति', en: 'Privacy policy' },
  aboutText:    { mr: 'श्री नवनाथ भक्तिसार हा नवनाथांच्या कथांचा ४० अध्यायांचा ओवीबद्ध ग्रंथ आहे. धुंडीसुत मालू नरहरी यांनी शके १७४१ (इ.स. १८१९) मध्ये तो पूर्ण केला.', hi: 'श्री नवनाथ भक्तिसार नवनाथों की कथाओं का ४० अध्यायों का ओवीबद्ध ग्रंथ है। धुंडीसुत मालू नरहरि ने इसे शक १७४१ (ई. १८१९) में पूर्ण किया।', en: 'Shri Navnath Bhaktisaar tells the stories of the nine Naths in 40 adhyays of Marathi ovi verse. Dhundisut Malu Narhari completed it in Shaka 1741 (1819 CE).' },
  update:       { mr: 'नवीन आवृत्ती आली आहे', hi: 'नया संस्करण आया है', en: 'A new version is ready' },
  reload:       { mr: 'उघडा', hi: 'खोलें', en: 'Reload' },
  jai:          { mr: '॥ श्री नवनाथ महाराज की जय ॥', hi: '॥ श्री नवनाथ महाराज की जय ॥', en: '॥ श्री नवनाथ महाराज की जय ॥' },
};

let lang = 'mr';
export const setLang = (l) => { lang = LANGS[l] ? l : 'mr'; };
export const getLang = () => lang;
export const locale = () => LANGS[lang].locale;

const DEV = '०१२३४५६७८९';
const NUMERIC = /^[0-9०-९]+$/;
/** A number (or digit string in either script) in the current UI language's digits. */
export function num(n) {
  const s = String(n);
  return lang === 'en'
    ? s.replace(/[०-९]/g, (d) => DEV.indexOf(d))
    : s.replace(/[0-9]/g, (d) => DEV[d]);
}

/** Translate a key, filling {placeholders}; numbers are localised. */
export function t(key, vars = {}) {
  const entry = S[key];
  let s = entry ? (entry[lang] ?? entry.en) : key;
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, typeof v === 'number' || NUMERIC.test(v) ? num(v) : v);
  }
  return s;
}

export function fmtDate(iso, opts = { day: 'numeric', month: 'short' }) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  try {
    const nu = lang === 'en' ? 'latn' : 'deva';
    return new Intl.DateTimeFormat(`${locale()}-u-nu-${nu}`, opts).format(date);
  } catch {
    return iso;
  }
}
