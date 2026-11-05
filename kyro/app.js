(function () {
'use strict';

/* =====================================================================
   Kyro — app logic
   ===================================================================== */

const $ = (id) => document.getElementById(id);
const LANGS = ['ru', 'en', 'ko', 'ky', 'ar'];
const LOCALES = { ru: 'ru-RU', en: 'en-US', ko: 'ko-KR', ky: 'ky-KG', ar: 'ar-EG-u-nu-latn-ca-gregory' };
const LANG_NAMES = { ru: 'Русский', en: 'English', ko: '한국어', ky: 'Кыргызча', ar: 'العربية' };
const WEEKDAYS_BY_LANG = {
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  ky: ['Жк', 'Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш'],
  ar: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمس', 'جمع', 'سبت']
};

const K = {
  state: 'kyro_v1', onboarded: 'kyro_onboarded', vision: 'kyro_vision', anti: 'kyro_antivision',
  rtime: 'kyro_reflection_time', rlast: 'kyro_last_reflection', lang: 'kyro_lang',
  pin: 'kyro_pin2', pinOld: 'kyro_pin', fail: 'kyro_pin_fail', installDismissed: 'kyro_install_banner_dismissed'
};

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

/* =====================================================================
   i18n  — each entry: [ru, en, ko, ky]
   ===================================================================== */
const D = {
  skip: ['Пропустить', 'Skip', '건너뛰기', 'Өткөрүү'],
  cancel: ['Отмена', 'Cancel', '취소', 'Жокко чыгаруу'],
  save: ['Сохранить', 'Save', '저장', 'Сактоо'],
  saved: ['Сохранено!', 'Saved!', '저장됨!', 'Сакталды!'],
  delete: ['Удалить', 'Delete', '삭제', 'Өчүрүү'],
  del_confirm: ['Удалить?', 'Delete?', '삭제할까요?', 'Өчүрөсүзбү?'],
  add: ['Добавить', 'Add', '추가', 'Кошуу'],

  inst_title: ['Установите Kyro', 'Install Kyro', 'Kyro 설치', 'Kyro орнотуңуз'],
  inst_desc: ['Добавьте Kyro на главный экран — он откроется как обычное приложение и работает офлайн.', 'Add Kyro to your home screen — it opens like a regular app and works offline.', 'Kyro를 홈 화면에 추가하면 일반 앱처럼 열리고 오프라인에서도 작동합니다.', 'Kyro\'ну башкы экранга кошуңуз — кадимки колдонмодой ачылат жана оффлайн иштейт.'],
  inst_btn: ['Установить', 'Install', '설치', 'Орнотуу'],
  inst_done: ['Я установил(а)', 'I installed it', '설치했어요', 'Орноттум'],
  inst_browser: ['Продолжить в браузере', 'Continue in browser', '브라우저에서 계속', 'Браузерде улантуу'],
  inst_banner: ['Установите Kyro как приложение', 'Install Kyro as an app', 'Kyro를 앱으로 설치', 'Kyro колдонмосун орнотуңуз'],
  inst_modal_title: ['Установка приложения', 'Install the app', '앱 설치', 'Колдонмону орнотуу'],
  inst_installed: ['Приложение уже установлено ✓', 'App is already installed ✓', '앱이 이미 설치되었습니다 ✓', 'Колдонмо орнотулган ✓'],
  inst_ios_intro: ['На iPhone и iPad Apple не разрешает установку одним нажатием. Сделайте 3 шага в Safari:', 'Apple does not allow one-tap install on iPhone/iPad. Do 3 steps in Safari:', 'iPhone/iPad에서는 Apple 정책상 한 번에 설치할 수 없습니다. Safari에서 3단계를 따르세요:', 'iPhone/iPad\'де Apple бир басуу менен орнотууга уруксат бербейт. Safari\'де 3 кадам жасаңыз:'],
  inst_ios1: ['Нажмите кнопку «Поделиться» ⬆ внизу Safari', 'Tap the Share button ⬆ at the bottom of Safari', 'Safari 하단의 공유 버튼 ⬆을 누르세요', 'Safari\'нин ылдый жагындагы «Бөлүшүү» ⬆ баскычын басыңыз'],
  inst_ios2: ['Выберите «На экран „Домой“»', 'Choose "Add to Home Screen"', '"홈 화면에 추가"를 선택하세요', '«Башкы экранга кошуу» дегенди тандаңыз'],
  inst_ios3: ['Нажмите «Добавить» — иконка Kyro появится на главном экране', 'Tap "Add" — the Kyro icon appears on your home screen', '"추가"를 누르면 Kyro 아이콘이 홈 화면에 나타납니다', '«Кошуу» басыңыз — Kyro иконкасы башкы экранда пайда болот'],
  inst_and_hint: ['Нажмите «Установить» — иконка Kyro появится на главном экране. Если окно не открылось: меню ⋮ в Chrome → «Установить приложение».', 'Tap "Install" — the Kyro icon appears on your home screen. If nothing opens: Chrome menu ⋮ → "Install app".', '"설치"를 누르면 Kyro 아이콘이 홈 화면에 나타납니다. 창이 안 열리면 Chrome 메뉴 ⋮ → "앱 설치".', '«Орнотуу» басыңыз — Kyro иконкасы башкы экранда пайда болот. Терезе ачылбаса: Chrome менюсу ⋮ → «Колдонмону орнотуу».'],
  inst_desk_hint: ['Нажмите «Установить» — Kyro появится как отдельное приложение на рабочем столе и в меню приложений. Если кнопки нет: значок ⊕ в адресной строке или меню браузера → «Установить Kyro».', 'Tap "Install" — Kyro appears as a separate app on your desktop and app menu. No button? Use the ⊕ icon in the address bar or the browser menu → "Install Kyro".', '"설치"를 누르면 Kyro가 바탕화면과 앱 메뉴에 독립 앱으로 나타납니다. 버튼이 없으면 주소창의 ⊕ 아이콘 또는 브라우저 메뉴 → "Kyro 설치".', '«Орнотуу» басыңыз — Kyro иш столунда жана колдонмолор менюсунда өзүнчө колдонмо болуп чыгат. Баскыч жок болсо: даректин жанындагы ⊕ же браузер менюсу → «Kyro орнотуу».'],

  quote_text: ['«Единственная настоящая проверка интеллекта — получаешь ли ты то, чего хочешь от жизни».', '"The only true test of intelligence is if you get what you want out of life."', '"지성의 유일한 진짜 시험은 인생에서 원하는 것을 얻느냐이다."', '«Акылдын жападан-жалгыз чыныгы сыноосу — жашоодон каалаганыңды аласыңбы же жокпу».'],
  quote_author: ['— Навал Равикант', '— Naval Ravikant', '— 나발 라비칸트', '— Навал Равикант'],
  start: ['Начать', 'Start', '시작', 'Баштоо'],
  recommend: ['Рекомендуем', 'Recommended', '추천', 'Сунуштайбыз'],
  before: ['Перед началом', 'Before you begin', '시작하기 전에', 'Баштоодон мурун'],
  before_desc: ['Приложение вдохновлено философией осознанной жизни Дэна Коу. Этот текст поможет получить максимум от Kyro.', 'This app is inspired by Dan Koe\'s philosophy of intentional living. This text will help you get the most out of Kyro.', '이 앱은 댄 코의 의식적인 삶의 철학에서 영감을 받았습니다. 이 글이 Kyro를 최대한 활용하는 데 도움이 됩니다.', 'Колдонмо Дэн Коунун аң-сезимдүү жашоо философиясынан шыктанган. Бул текст Kyro\'дон максимум пайда алууга жардам берет.'],
  art_author: ['Дэн Коу', 'Dan Koe', '댄 코', 'Дэн Коу'],
  art_title: ['Как исправить всю свою жизнь за 1 день', 'How to fix your entire life in 1 day', '하루 만에 인생 전체를 바로잡는 법', 'Бүт жашоону 1 күндө кантип оңдоого болот'],
  read_thread: ['Читать тред →', 'Read the thread →', '스레드 읽기 →', 'Тредди окуу →'],
  cont: ['Продолжить', 'Continue', '계속', 'Улантуу'],
  step1: ['Шаг 1', 'Step 1', '1단계', '1-кадам'],
  step2: ['Шаг 2', 'Step 2', '2단계', '2-кадам'],
  step3: ['Шаг 3', 'Step 3', '3단계', '3-кадам'],
  anti_v: ['Антивидение', 'Anti-vision', '안티비전', 'Анти-көз караш'],
  anti_v_desc: ['Какой жизнью ты <strong>никогда</strong> не хочешь жить? Какой версией себя ты отказываешься становиться?', 'What life do you <strong>never</strong> want to live? What version of yourself do you refuse to become?', '<strong>절대</strong> 살고 싶지 않은 삶은 무엇인가요? 어떤 모습의 자신이 되기를 거부하나요?', 'Кандай жашоо менен <strong>эч качан</strong> жашагыңыз келбейт? Өзүңүздүн кайсы түрүнө айлангыңыз келбейт?'],
  anti_ph: ['напр. Полный сожалений, растраченный потенциал…', 'e.g. Full of regret, wasted potential…', '예: 후회로 가득한, 낭비된 잠재력…', 'мис. Өкүнүчкө толгон, текке кеткен мүмкүнчүлүк…'],
  vis: ['Видение', 'Vision', '비전', 'Көз караш'],
  vis_desc: ['Как выглядит твоя <strong>идеальная жизнь</strong>? Человек, которым ты стремишься стать?', 'What does your <strong>ideal life</strong> look like? Who do you want to become?', '당신의 <strong>이상적인 삶</strong>은 어떤 모습인가요? 어떤 사람이 되고 싶나요?', '<strong>Идеалдуу жашоо</strong> кандай көрүнөт? Ким болгуңуз келет?'],
  vis_ph: ['напр. Жить жизнью на своих условиях…', 'e.g. Living life on my own terms…', '예: 내 방식대로 사는 삶…', 'мис. Өз эрежем менен жашоо…'],
  refl_title: ['Ежедневная рефлексия', 'Daily reflection', '매일 성찰', 'Күнүмдүк рефлексия'],
  refl_desc: ['Выбери время, когда ты <strong>не занят(а)</strong> — по пути на работу, за утренним кофе, перед сном. Мы покажем вопрос для размышления.', 'Pick a time when you are <strong>free</strong> — commuting, morning coffee, before bed. We will show you a question to think about.', '<strong>여유 있는</strong> 시간을 고르세요 — 출근길, 아침 커피, 잠들기 전. 생각해 볼 질문을 보여 드립니다.', '<strong>Бош</strong> убакытты тандаңыз — жумушка баратканда, эртең мененки кофеде, уктаар алдында. Ойлонууга суроо көрсөтөбүз.'],
  later_hint: ['Позже это можно изменить в настройках', 'You can change this later in settings', '나중에 설정에서 바꿀 수 있습니다', 'Муну кийин жөндөөлөрдөн өзгөртө аласыз'],
  how: ['Как это работает', 'How it works', '작동 방식', 'Бул кантип иштейт'],
  simple: ['Просто.', 'Simple.', '간단합니다.', 'Жөнөкөй.'],
  f_tasks: ['Задачи', 'Tasks', '할 일', 'Тапшырма'],
  f_goals: ['Цели', 'Goals', '목표', 'Максат'],
  f_points: ['Очки', 'Points', '포인트', 'Упай'],
  f_slip: ['Срыв', 'Slip', '실수', 'Үзгүлтүк'],
  f_debt: ['Долг', 'Debt', '빚', 'Карыз'],
  f_atone: ['Отработка', 'Penalty', '벌칙', 'Жаза'],
  f_rewards: ['Награды', 'Rewards', '보상', 'Сыйлык'],
  enter: ['Войти в Kyro', 'Enter Kyro', 'Kyro 시작하기', 'Kyro\'го кирүү'],

  tab_tasks: ['Задачи', 'Tasks', '할 일', 'Тапшырма'],
  tab_goals: ['Цели', 'Goals', '목표', 'Максат'],
  tab_fight: ['Борьба', 'Fight', '극복', 'Күрөш'],
  tab_prog: ['Прогресс', 'Progress', '진행', 'Прогресс'],
  tab_rew: ['Награды', 'Rewards', '보상', 'Сыйлык'],

  pin_enter: ['Введите PIN', 'Enter PIN', 'PIN 입력', 'PIN киргизиңиз'],
  pin_create: ['Придумайте PIN (4 цифры)', 'Create a PIN (4 digits)', 'PIN 만들기 (4자리)', 'PIN ойлоп табыңыз (4 сан)'],
  pin_confirm: ['Повторите PIN', 'Repeat PIN', 'PIN 다시 입력', 'PIN\'ди кайталаңыз'],
  pin_mismatch: ['PIN не совпал. Придумайте снова', 'PINs do not match. Create again', 'PIN이 일치하지 않습니다. 다시 만드세요', 'PIN дал келген жок. Кайра ойлоп табыңыз'],
  pin_wrong: ['Неверный PIN', 'Wrong PIN', '잘못된 PIN', 'Туура эмес PIN'],
  pin_wait: ['Слишком много попыток. Подождите {n} с', 'Too many attempts. Wait {n}s', '시도 횟수 초과. {n}초 후 다시 시도하세요', 'Өтө көп аракет. {n} сек. күтүңүз'],
  pin_forgot: ['Забыли PIN?', 'Forgot PIN?', 'PIN을 잊으셨나요?', 'PIN\'ди унуттуңузбу?'],
  pin_forgot_confirm: ['Единственный способ — стереть ВСЕ данные Kyro на этом устройстве. Продолжить?', 'The only way is to erase ALL Kyro data on this device. Continue?', '방법은 이 기기의 Kyro 데이터를 모두 삭제하는 것뿐입니다. 계속할까요?', 'Жалгыз жол — бул түзмөктөгү Kyro\'нун БАРДЫК маалыматын өчүрүү. Улантасызбы?'],
  pin_old: ['Введите текущий PIN', 'Enter current PIN', '현재 PIN 입력', 'Азыркы PIN\'ди киргизиңиз'],

  settings: ['Настройки', 'Settings', '설정', 'Жөндөөлөр'],
  s_general: ['Общие', 'General', '일반', 'Жалпы'],
  s_vision: ['Видение', 'Vision', '비전', 'Көз караш'],
  s_reflect: ['Рефлексия', 'Reflection', '성찰', 'Рефлексия'],
  s_tasks: ['Задачи', 'Tasks', '할 일', 'Тапшырма'],
  s_goals: ['Цели', 'Goals', '목표', 'Максат'],
  s_enemies: ['Враги', 'Enemies', '유혹', 'Душмандар'],
  s_atone: ['Штрафы', 'Penalties', '벌칙', 'Жазалар'],
  s_rewards: ['Награды', 'Rewards', '보상', 'Сыйлык'],

  language: ['Язык', 'Language', '언어', 'Тил'],
  backup: ['Резервная копия', 'Backup', '백업', 'Резервдик көчүрмө'],
  backup_hint: ['Экспортируйте данные регулярно. Файл не зашифрован — храните его в надёжном месте.', 'Export your data regularly. The file is not encrypted — keep it somewhere safe.', '데이터를 정기적으로 내보내세요. 파일은 암호화되지 않으니 안전한 곳에 보관하세요.', 'Маалыматты үзгүлтүксүз экспорттоңуз. Файл шифрленген эмес — ишенимдүү жерде сактаңыз.'],
  export: ['Экспорт', 'Export', '내보내기', 'Экспорт'],
  import: ['Импорт', 'Import', '가져오기', 'Импорт'],
  exported: ['Экспортировано!', 'Exported!', '내보냈습니다!', 'Экспорттолду!'],
  restored: ['Данные восстановлены!', 'Data restored!', '데이터를 복원했습니다!', 'Маалымат калыбына келди!'],
  bad_file: ['Неверный файл резервной копии.', 'Invalid backup file.', '잘못된 백업 파일입니다.', 'Резервдик файл жараксыз.'],
  import_confirm: ['Заменить все данные? Текущие задачи, цели, награды и видения будут перезаписаны.', 'Replace all data? Current tasks, goals, rewards and visions will be overwritten.', '모든 데이터를 바꿀까요? 현재 할 일, 목표, 보상, 비전이 덮어씌워집니다.', 'Бардык маалыматты алмаштырасызбы? Азыркы тапшырмалар, максаттар, сыйлыктар жана көз караштар жазылып калат.'],
  security: ['Безопасность', 'Security', '보안', 'Коопсуздук'],
  change_pin: ['Сменить PIN', 'Change PIN', 'PIN 변경', 'PIN алмаштыруу'],
  lock_now: ['Заблокировать сейчас', 'Lock now', '지금 잠금', 'Азыр кулпулоо'],
  autolock: ['Kyro блокируется автоматически, если вы покинули приложение больше чем на 30 секунд.', 'Kyro locks automatically if you leave the app for more than 30 seconds.', '앱을 30초 넘게 벗어나면 Kyro가 자동으로 잠깁니다.', 'Колдонмодон 30 секундадан ашык чыксаңыз, Kyro автоматтык түрдө кулпуланат.'],
  install_app: ['Установить приложение', 'Install app', '앱 설치', 'Колдонмону орнотуу'],

  your_vision: ['Твоё видение', 'Your vision', '나의 비전', 'Сиздин көз карашыңыз'],
  your_anti: ['Твоё антивидение', 'Your anti-vision', '나의 안티비전', 'Сиздин анти-көз карашыңыз'],
  vision_hint: ['Лучший сценарий. Жизнь, которую ты строишь.', 'The best case. The life you are building.', '최선의 시나리오. 당신이 만들어 가는 삶.', 'Эң жакшы сценарий. Сиз курган жашоо.'],
  anti_hint: ['Худший сценарий. Что будет, если ничего не менять.', 'The worst case. What happens if nothing changes.', '최악의 시나리오. 아무것도 바꾸지 않으면 벌어질 일.', 'Эң жаман сценарий. Эч нерсе өзгөрбөсө эмне болот.'],
  vision_empty: ['Опиши своё видение: Настройки → Видение', 'Describe your vision: Settings → Vision', '비전을 적어 보세요: 설정 → 비전', 'Көз карашыңызды жазыңыз: Жөндөөлөр → Көз караш'],
  anti_empty: ['Опиши антивидение: Настройки → Видение', 'Describe your anti-vision: Settings → Vision', '안티비전을 적어 보세요: 설정 → 비전', 'Анти-көз карашты жазыңыз: Жөндөөлөр → Көз караш'],

  refl_time: ['Время рефлексии', 'Reflection time', '성찰 시간', 'Рефлексия убактысы'],
  refl_time_hint: ['Время для ежедневного вопроса.', 'Time for the daily question.', '매일 질문을 받을 시간.', 'Күнүмдүк суроо үчүн убакыт.'],
  refl_now: ['Рефлексия сейчас', 'Reflect now', '지금 성찰하기', 'Азыр рефлексия'],
  show_q: ['Показать вопрос', 'Show a question', '질문 보기', 'Суроону көрсөтүү'],
  refl_later: ['Позже', 'Later', '나중에', 'Кийин'],
  refl_done: ['Я поразмышлял(а)', 'I reflected', '생각했어요', 'Ойлондум'],
  notif: ['Уведомления', 'Notifications', '알림', 'Эскертмелер'],
  n_on: ['Включены', 'Enabled', '켜짐', 'Күйгүзүлгөн'],
  n_denied: ['Заблокированы в браузере', 'Blocked in browser', '브라우저에서 차단됨', 'Браузерде бөгөттөлгөн'],
  n_default: ['Не настроены', 'Not set up', '설정 안 됨', 'Орнотулган эмес'],
  n_unsupported: ['Не поддерживаются', 'Not supported', '지원되지 않음', 'Колдоого алынбайт'],
  n_enable: ['Включить уведомления', 'Enable notifications', '알림 켜기', 'Эскертмелерди күйгүзүү'],
  status: ['Статус', 'Status', '상태', 'Абалы'],
  notif_title: ['Kyro — время для рефлексии', 'Kyro — time to reflect', 'Kyro — 성찰할 시간', 'Kyro — рефлексия убактысы'],

  add_task: ['Добавить задачу', 'Add a task', '할 일 추가', 'Тапшырма кошуу'],
  name: ['Название', 'Name', '이름', 'Аталышы'],
  points: ['Очки', 'Points', '포인트', 'Упай'],
  weekdays: ['Дни недели', 'Weekdays', '요일', 'Апта күндөрү'],
  weekdays_hint: ['Ничего не выбрано = каждый день', 'Nothing selected = every day', '선택 안 함 = 매일', 'Эч нерсе тандалбаса = күн сайын'],
  ph_task: ['напр. Спортзал, Чтение', 'e.g. Gym, Reading', '예: 운동, 독서', 'мис. Спорт зал, Окуу'],
  your_tasks: ['Твои задачи', 'Your tasks', '내 할 일', 'Сиздин тапшырмалар'],
  nothing_yet: ['Пока ничего нет.', 'Nothing yet.', '아직 없습니다.', 'Азырынча эч нерсе жок.'],
  need_np: ['Нужны название и очки.', 'Name and points are required.', '이름과 포인트가 필요합니다.', 'Аталышы жана упай керек.'],
  every_day: ['Каждый день', 'Every day', '매일', 'Күн сайын'],
  add_goal: ['Добавить цель', 'Add a goal', '목표 추가', 'Максат кошуу'],
  goal_name: ['Название цели', 'Goal name', '목표 이름', 'Максаттын аталышы'],
  goal_points: ['Очки за выполнение', 'Points for completion', '달성 포인트', 'Аткаргандыгы үчүн упай'],
  ph_goal: ['напр. Пробежать марафон', 'e.g. Run a marathon', '예: 마라톤 완주', 'мис. Марафон чуркоо'],
  your_goals: ['Твои цели', 'Your goals', '내 목표', 'Сиздин максаттар'],
  achieved: ['Достигнуто', 'Achieved', '달성', 'Жетилди'],
  add_enemy: ['Добавить врага', 'Add an enemy', '유혹 추가', 'Душман кошуу'],
  debt_points: ['Очки долга', 'Debt points', '빚 포인트', 'Карыз упайы'],
  ph_enemy: ['напр. Фастфуд, Бесконечный скроллинг', 'e.g. Fast food, Endless scrolling', '예: 패스트푸드, 끝없는 스크롤', 'мис. Фастфуд, Чексиз скроллинг'],
  your_enemies: ['Твои враги', 'Your enemies', '나의 유혹', 'Сиздин душмандар'],
  add_penalty: ['Добавить штраф', 'Add a penalty', '벌칙 추가', 'Жаза кошуу'],
  debt_reduce: ['Снижение долга', 'Debt reduction', '빚 감소량', 'Карызды азайтуу'],
  ph_penalty: ['напр. Холодный душ, Доп. тренировка', 'e.g. Cold shower, Extra workout', '예: 찬물 샤워, 추가 운동', 'мис. Муздак душ, Кошумча машыгуу'],
  your_penalties: ['Твои штрафы', 'Your penalties', '내 벌칙', 'Сиздин жазалар'],
  add_reward: ['Добавить награду', 'Add a reward', '보상 추가', 'Сыйлык кошуу'],
  cost: ['Стоимость (очки)', 'Cost (points)', '비용 (포인트)', 'Баасы (упай)'],
  ph_reward: ['напр. Доставка еды, Новая худи', 'e.g. Takeout, A new hoodie', '예: 배달 음식, 새 후드티', 'мис. Тамак алып келүү, Жаңы худи'],
  your_rewards: ['Твои награды', 'Your rewards', '내 보상', 'Сиздин сыйлыктар'],
  debt_of: ['долга', 'debt', '빚', 'карыз'],
  pts: ['очк.', 'pts', '점', 'упай'],

  today: ['Сегодня', 'Today', '오늘', 'Бүгүн'],
  tasks_count: ['Задач: {n}', 'Tasks: {n}', '할 일 {n}', 'Тапшырма: {n}'],
  none_sched: ['Нет запланированных задач.', 'No tasks scheduled.', '예정된 할 일이 없습니다.', 'Пландалган тапшырма жок.'],
  all_done: ['Всё готово', 'All done', '모두 완료', 'Баары бүттү'],
  btn_done: ['Готово', 'Done', '완료', 'Бүттү'],
  btn_undo: ['Отменить', 'Undo', '취소', 'Артка'],
  pending: ['Ожидает', 'Pending', '대기', 'Күтүүдө'],
  active_goals: ['Активные цели', 'Active goals', '진행 중인 목표', 'Активдүү максаттар'],
  know_enemy: ['Знай своего врага', 'Know your enemy', '유혹을 알라', 'Душманыңды бил'],
  btn_slip: ['Сорвался(лась)', 'I slipped', '실수했어요', 'Үзгүлтүк болду'],
  today_slips: ['Сегодняшние срывы', 'Today\'s slips', '오늘의 실수', 'Бүгүнкү үзгүлтүктөр'],

  your_stats: ['Твоя статистика', 'Your stats', '내 통계', 'Сиздин статистика'],
  create_task_first: ['Создай хотя бы одну задачу, чтобы начать отслеживать прогресс.', 'Create at least one task to start tracking progress.', '진행 상황을 추적하려면 할 일을 하나 이상 만드세요.', 'Прогрессти көзөмөлдөө үчүн жок дегенде бир тапшырма түзүңүз.'],
  stat_week: ['За неделю', 'This week', '이번 주', 'Жуманын ичинде'],
  stat_goals: ['Цели', 'Goals', '목표', 'Максаттар'],
  stat_clean: ['Чистая серия', 'Clean streak', '무실수 연속', 'Таза серия'],
  stat_best: ['Лучшая серия', 'Best streak', '최고 연속', 'Мыкты серия'],
  stat_cur: ['Текущая', 'Current', '현재', 'Азыркы'],
  sub_tasks_done: ['задач сделано', 'tasks done', '완료한 할 일', 'тапшырма аткарылды'],
  sub_exec: ['выполнение', 'completion', '달성률', 'аткаруу'],
  sub_achieved: ['достигнуто', 'achieved', '달성', 'жетилди'],
  sub_clean_days: ['дней без срывов', 'days without slips', '실수 없는 일수', 'үзгүлтүксүз күн'],
  sub_days: ['дней', 'days', '일', 'күн'],
  sub_in_row: ['дней подряд', 'days in a row', '일 연속', 'күн удаа'],
  streak_cal: ['Календарь серий', 'Streak calendar', '연속 기록 달력', 'Серия календары'],
  tracking: ['Отслеживается', 'Tracking', '추적 중', 'Көзөмөлдөнөт'],
  cur_streak: ['Текущая серия', 'Current streak', '현재 연속', 'Азыркы серия'],
  best_streak: ['Лучшая серия', 'Best streak', '최고 연속', 'Мыкты серия'],
  d_abbr: ['дн.', 'd', '일', 'күн'],

  your_points: ['Твои очки', 'Your points', '내 포인트', 'Сиздин упайлар'],
  earned: ['Заработано', 'Earned', '획득', 'Тапкан'],
  spent: ['Потрачено', 'Spent', '사용', 'Короткон'],
  debt_lbl: ['Долг', 'Debt', '빚', 'Карыз'],
  debt_warn: ['У тебя долг: {n}. Он вычитается из очков. Выполни штраф, чтобы погасить его.', 'You owe {n}. It is subtracted from your points. Complete a penalty to clear it.', '빚 {n}점이 있습니다. 포인트에서 차감됩니다. 벌칙을 수행해 갚으세요.', 'Сизде {n} карыз бар. Ал упайдан алынат. Жаза аткарып жабыңыз.'],
  pay_debt: ['Погасить долг', 'Clear your debt', '빚 갚기', 'Карызды жабуу'],
  no_debt: ['Долгов нет. Ты чист(а)!', 'No debt. You are clear!', '빚이 없습니다. 깨끗해요!', 'Карыз жок. Сиз тазасыз!'],
  no_debt_to_pay: ['Нет долга для погашения!', 'No debt to clear!', '갚을 빚이 없습니다!', 'Жабуучу карыз жок!'],
  get: ['Получить', 'Claim', '받기', 'Алуу'],
  not_enough: ['Недостаточно', 'Not enough', '부족', 'Жетишсиз'],
  not_enough_alert: ['Недостаточно очков!', 'Not enough points!', '포인트가 부족합니다!', 'Упай жетишсиз!'],
  history: ['История', 'History', '기록', 'Тарых'],
  rewards_title: ['Награды', 'Rewards', '보상', 'Сыйлыктар'],
  penalty_word: ['Штраф', 'Penalty', '벌칙', 'Жаза'],
  reward_word: ['Награда', 'Reward', '보상', 'Сыйлык'],
  debt_cleared: ['−{n} долга', '−{n} debt', '빚 −{n}', 'карыз −{n}']
};

/* Arabic translations (RTL). Keys not listed here fall back to English. */
const AR = {
  skip: 'تخطي', cancel: 'إلغاء', save: 'حفظ', saved: 'تم الحفظ!', delete: 'حذف', del_confirm: 'هل تريد الحذف؟', add: 'إضافة',
  inst_title: 'ثبّت Kyro',
  inst_desc: 'أضف Kyro إلى الشاشة الرئيسية — يفتح كتطبيق عادي ويعمل بدون إنترنت.',
  inst_btn: 'تثبيت', inst_done: 'قمت بالتثبيت', inst_browser: 'المتابعة في المتصفح',
  inst_banner: 'ثبّت Kyro كتطبيق', inst_modal_title: 'تثبيت التطبيق', inst_installed: 'التطبيق مثبّت بالفعل ✓',
  inst_ios_intro: 'لا تسمح Apple بالتثبيت بنقرة واحدة على iPhone وiPad. اتبع 3 خطوات في Safari:',
  inst_ios1: 'اضغط زر «مشاركة» ⬆ أسفل Safari',
  inst_ios2: 'اختر «إضافة إلى الشاشة الرئيسية»',
  inst_ios3: 'اضغط «إضافة» — ستظهر أيقونة Kyro على الشاشة الرئيسية',
  inst_and_hint: 'اضغط «تثبيت» — ستظهر أيقونة Kyro على الشاشة الرئيسية. إذا لم تظهر نافذة: قائمة ⋮ في Chrome ← «تثبيت التطبيق».',
  inst_desk_hint: 'اضغط «تثبيت» — سيظهر Kyro كتطبيق مستقل على سطح المكتب وفي قائمة التطبيقات. إذا لم يوجد الزر: أيقونة ⊕ في شريط العنوان أو قائمة المتصفح ← «تثبيت Kyro».',
  quote_text: '«الاختبار الحقيقي الوحيد للذكاء هو: هل تحصل على ما تريده من الحياة».',
  quote_author: '— نافال رافيكانت',
  start: 'ابدأ', recommend: 'نوصي به', before: 'قبل أن تبدأ',
  before_desc: 'هذا التطبيق مستوحى من فلسفة دان كو في العيش بوعي. قراءة هذا النص ستساعدك على الاستفادة القصوى من Kyro.',
  art_author: 'دان كو', art_title: 'كيف تصلح حياتك كلها في يوم واحد', read_thread: 'اقرأ السلسلة ←',
  cont: 'متابعة', step1: 'الخطوة 1', step2: 'الخطوة 2', step3: 'الخطوة 3',
  anti_v: 'الرؤية المضادة',
  anti_v_desc: 'أي حياة <strong>لا تريد</strong> أن تعيشها أبدًا؟ وأي نسخة من نفسك ترفض أن تصبحها؟',
  anti_ph: 'مثال: مليئة بالندم وإمكانات مهدرة…',
  vis: 'الرؤية',
  vis_desc: 'كيف تبدو <strong>حياتك المثالية</strong>؟ من تطمح أن تصبح؟',
  vis_ph: 'مثال: أعيش حياتي بشروطي…',
  refl_title: 'تأمّل يومي',
  refl_desc: 'اختر وقتًا تكون فيه <strong>متفرغًا</strong> — في الطريق إلى العمل، مع قهوة الصباح، قبل النوم. سنعرض عليك سؤالًا للتفكير.',
  later_hint: 'يمكنك تغيير ذلك لاحقًا من الإعدادات',
  how: 'كيف يعمل', simple: 'ببساطة.',
  f_tasks: 'المهام', f_goals: 'الأهداف', f_points: 'النقاط', f_slip: 'زلّة', f_debt: 'دَين', f_atone: 'عقوبة', f_rewards: 'المكافآت',
  enter: 'ادخل إلى Kyro',
  tab_tasks: 'المهام', tab_goals: 'الأهداف', tab_fight: 'المواجهة', tab_prog: 'التقدّم', tab_rew: 'المكافآت',
  pin_enter: 'أدخل رمز PIN', pin_create: 'أنشئ رمز PIN (4 أرقام)', pin_confirm: 'أعد إدخال PIN',
  pin_mismatch: 'الرمزان غير متطابقين. أنشئ الرمز من جديد', pin_wrong: 'رمز PIN خاطئ',
  pin_wait: 'محاولات كثيرة. انتظر {n} ث', pin_forgot: 'نسيت PIN؟',
  pin_forgot_confirm: 'الحل الوحيد هو مسح جميع بيانات Kyro على هذا الجهاز. هل تريد المتابعة؟',
  pin_old: 'أدخل رمز PIN الحالي',
  settings: 'الإعدادات', s_general: 'عام', s_vision: 'الرؤية', s_reflect: 'التأمل', s_tasks: 'المهام', s_goals: 'الأهداف',
  s_enemies: 'الأعداء', s_atone: 'العقوبات', s_rewards: 'المكافآت',
  language: 'اللغة', backup: 'نسخة احتياطية',
  backup_hint: 'صدّر بياناتك بانتظام. الملف غير مشفّر — احفظه في مكان آمن.',
  export: 'تصدير', import: 'استيراد', exported: 'تم التصدير!', restored: 'تمت استعادة البيانات!',
  bad_file: 'ملف النسخة الاحتياطية غير صالح.',
  import_confirm: 'هل تريد استبدال جميع البيانات؟ سيتم استبدال المهام والأهداف والمكافآت والرؤى الحالية.',
  security: 'الأمان', change_pin: 'تغيير PIN', lock_now: 'قفل الآن',
  autolock: 'يُقفل Kyro تلقائيًا إذا غادرت التطبيق لأكثر من 30 ثانية.',
  install_app: 'تثبيت التطبيق',
  your_vision: 'رؤيتك', your_anti: 'رؤيتك المضادة',
  vision_hint: 'أفضل سيناريو. الحياة التي تبنيها.', anti_hint: 'أسوأ سيناريو. ما سيحدث إن لم يتغير شيء.',
  vision_empty: 'صف رؤيتك: الإعدادات ← الرؤية', anti_empty: 'صف رؤيتك المضادة: الإعدادات ← الرؤية',
  refl_time: 'وقت التأمل', refl_time_hint: 'وقت السؤال اليومي.', refl_now: 'تأمّل الآن', show_q: 'اعرض سؤالًا',
  refl_later: 'لاحقًا', refl_done: 'لقد تأمّلت',
  notif: 'الإشعارات', n_on: 'مفعّلة', n_denied: 'محظورة في المتصفح', n_default: 'غير مُعدّة', n_unsupported: 'غير مدعومة',
  n_enable: 'تفعيل الإشعارات', status: 'الحالة', notif_title: 'Kyro — حان وقت التأمل',
  add_task: 'إضافة مهمة', name: 'الاسم', points: 'النقاط', weekdays: 'أيام الأسبوع', weekdays_hint: 'بدون اختيار = كل يوم',
  ph_task: 'مثال: النادي، القراءة', your_tasks: 'مهامك', nothing_yet: 'لا شيء بعد.', need_np: 'الاسم والنقاط مطلوبان.',
  every_day: 'كل يوم', add_goal: 'إضافة هدف', goal_name: 'اسم الهدف', goal_points: 'نقاط الإنجاز',
  ph_goal: 'مثال: الجري في ماراثون', your_goals: 'أهدافك', achieved: 'تحقق',
  add_enemy: 'إضافة عدو', debt_points: 'نقاط الدَّين', ph_enemy: 'مثال: الوجبات السريعة، التصفح اللانهائي', your_enemies: 'أعداؤك',
  add_penalty: 'إضافة عقوبة', debt_reduce: 'تخفيض الدَّين', ph_penalty: 'مثال: دش بارد، تمرين إضافي', your_penalties: 'عقوباتك',
  add_reward: 'إضافة مكافأة', cost: 'التكلفة (نقاط)', ph_reward: 'مثال: طلب طعام، هودي جديد', your_rewards: 'مكافآتك',
  debt_of: 'دَين', pts: 'نقطة',
  today: 'اليوم', tasks_count: 'المهام: {n}', none_sched: 'لا مهام مجدولة.', all_done: 'تم كل شيء',
  btn_done: 'تم', btn_undo: 'تراجع', pending: 'قيد الانتظار', active_goals: 'الأهداف النشطة',
  know_enemy: 'اعرف عدوك', btn_slip: 'تعثّرت', today_slips: 'زلّات اليوم',
  your_stats: 'إحصاءاتك', create_task_first: 'أنشئ مهمة واحدة على الأقل لبدء تتبع التقدم.',
  stat_week: 'هذا الأسبوع', stat_goals: 'الأهداف', stat_clean: 'سلسلة نظيفة', stat_best: 'أفضل سلسلة', stat_cur: 'الحالية',
  sub_tasks_done: 'مهام منجزة', sub_exec: 'الإنجاز', sub_achieved: 'تحققت', sub_clean_days: 'أيام بلا زلّات',
  sub_days: 'أيام', sub_in_row: 'أيام متتالية', streak_cal: 'تقويم السلاسل', tracking: 'قيد التتبع',
  cur_streak: 'السلسلة الحالية', best_streak: 'أفضل سلسلة', d_abbr: 'يوم',
  your_points: 'نقاطك', earned: 'المكتسبة', spent: 'المنفقة', debt_lbl: 'الدَّين',
  debt_warn: 'عليك دَين: {n}. يُخصم من نقاطك. أنجز عقوبة لتسديده.',
  pay_debt: 'سدّد دَينك', no_debt: 'لا دَين. أنت نظيف!', no_debt_to_pay: 'لا يوجد دَين لتسديده!',
  get: 'استلام', not_enough: 'غير كافٍ', not_enough_alert: 'النقاط غير كافية!',
  history: 'السجل', rewards_title: 'المكافآت', penalty_word: 'عقوبة', reward_word: 'مكافأة', debt_cleared: 'دَين −{n}'
};

Object.assign(D, {
  tab_month: ['Месяц', 'Month', '월간', 'Ай'],
  s_month: ['Месяц', 'Month', '월간', 'Ай'],
  edit: ['Изменить', 'Edit', '수정', 'Түзөтүү'],
  lm_title: ['Мой языковой месяц', 'My language month', '나의 언어 한 달', 'Менин тил айым'],
  lm_days_n: ['{n} дней практики', '{n} days of practice', '{n}일 연습', '{n} күн практика'],
  lm_def_a: ['Арабский', 'Arabic', '아랍어', 'Араб тили'],
  lm_def_b: ['Корейский', 'Korean', '한국어', 'Корей тили'],
  lm_new_track: ['Новый язык', 'New language', '새 언어', 'Жаңы тил'],
  lm_days_done: ['дней выполнено', 'days done', '일 완료', 'күн аткарылды'],
  lm_calendar: ['Календарь привычек', 'Habit calendar', '습관 달력', 'Адаттар календары'],
  lm_tap_hint: ['Нажми на день, чтобы отметить занятие.', 'Tap a day to mark your practice.', '날짜를 눌러 학습을 표시하세요.', 'Машыгууну белгилөө үчүн күндү басыңыз.'],
  lm_all: ['Все', 'All', '모두', 'Баары'],
  lm_selected: ['Выбранный день', 'Selected day', '선택한 날', 'Тандалган күн'],
  lm_words: ['Новых слов записано', 'New words written', '적은 새 단어', 'Жазылган жаңы сөздөр'],
  lm_streak: ['Серия занятий', 'Practice streak', '학습 연속 기록', 'Машыгуу сериясы'],
  lm_streak_msg: ['Ты занимаешься {n} дн. подряд! Продолжай!', 'You have practiced {n} days in a row! Keep going!', '{n}일 연속 학습 중! 계속하세요!', '{n} күн катары менен машыгып жатасыз! Улантыңыз!'],
  lm_streak_zero: ['Отметь сегодняшнее занятие, чтобы начать серию.', 'Mark today\'s practice to start a streak.', '오늘 학습을 표시해 연속 기록을 시작하세요.', 'Серияны баштоо үчүн бүгүнкү машыгууну белгилеңиз.'],
  lm_summary: ['Итоги месяца', 'Month summary', '월간 요약', 'Айдын жыйынтыгы'],
  lm_total_words: ['Всего слов', 'Total words', '총 단어', 'Бардык сөз'],
  lm_plan: ['Выполнение плана', 'Plan completion', '계획 달성', 'Пландын аткарылышы'],
  lm_theme: ['Тема и название', 'Theme and title', '주제와 제목', 'Тема жана аталышы'],
  lm_tracks: ['Направления', 'Tracks', '학습 항목', 'Багыттар'],
  lm_add_track: ['Добавить направление', 'Add a track', '항목 추가', 'Багыт кошуу'],
  lm_max: ['Максимум 4 направления.', 'Maximum 4 tracks.', '최대 4개까지 가능합니다.', 'Эң көбү 4 багыт.'],
  lm_min: ['Нужно хотя бы одно направление.', 'At least one track is required.', '최소 하나는 필요합니다.', 'Жок дегенде бир багыт керек.'],
  lm_prev: ['Предыдущий месяц', 'Previous month', '이전 달', 'Мурунку ай'],
  lm_next: ['Следующий месяц', 'Next month', '다음 달', 'Кийинки ай']
});
Object.assign(AR, {
  tab_month: 'الشهر', s_month: 'الشهر', edit: 'تعديل',
  lm_title: 'شهري اللغوي', lm_days_n: '{n} يومًا من التدريب', lm_def_a: 'العربية', lm_def_b: 'الكورية', lm_new_track: 'لغة جديدة',
  lm_days_done: 'أيام منجزة', lm_calendar: 'تقويم العادات', lm_tap_hint: 'اضغط على يوم لتسجيل تدريبك.',
  lm_all: 'الكل', lm_selected: 'اليوم المحدد', lm_words: 'كلمات جديدة مكتوبة',
  lm_streak: 'سلسلة التدريب', lm_streak_msg: 'أيام التدريب المتتالية: {n}. واصل!', lm_streak_zero: 'سجّل تدريب اليوم لبدء سلسلة.',
  lm_summary: 'ملخص الشهر', lm_total_words: 'إجمالي الكلمات', lm_plan: 'تنفيذ الخطة',
  lm_theme: 'الموضوع والعنوان', lm_tracks: 'المسارات', lm_add_track: 'إضافة مسار',
  lm_max: 'الحد الأقصى 4 مسارات.', lm_min: 'مطلوب مسار واحد على الأقل.',
  lm_prev: 'الشهر السابق', lm_next: 'الشهر التالي'
});

const REFLECTION_QUESTIONS = {
  ru: [
    'Ты живёшь своей жизнью или чужим представлением о ней?',
    'От чего ты избегаешь, хотя знаешь, что это всё изменит?',
    'Как выглядит твой идеальный обычный вторник?',
    'С чем ты миришься, хотя не должен(на)?',
    'Какая одна привычка изменила бы твою жизнь, если бы ты её придерживался(ась)?',
    'Соответствуют ли твои ежедневные действия долгосрочному видению?',
    'Кем ты становишься благодаря своим нынешним привычкам?',
    'Ты больше создаёшь или потребляешь?',
    'Какой самый маленький шаг ты можешь сделать к своему видению?',
    'Что ты откладываешь, хотя это занимает меньше 10 минут?',
    'Ты бежишь к чему-то или от чего-то?',
    'За что тебя поблагодарит будущий ты, если начнёшь сегодня?'
  ],
  en: [
    'Are you living your own life, or someone else\'s idea of it?',
    'What are you avoiding even though you know it would change everything?',
    'What does your ideal ordinary Tuesday look like?',
    'What are you tolerating that you shouldn\'t be?',
    'Which single habit would change your life if you stuck to it?',
    'Do your daily actions match your long-term vision?',
    'Who are you becoming because of your current habits?',
    'Do you create more, or consume more?',
    'What is the smallest step you could take toward your vision?',
    'What are you putting off that takes less than 10 minutes?',
    'Are you running toward something, or away from something?',
    'What will future you thank you for if you start today?'
  ],
  ko: [
    '당신은 자기 삶을 살고 있나요, 아니면 남이 생각하는 삶을 살고 있나요?',
    '모든 것을 바꿀 걸 알면서도 피하고 있는 것은 무엇인가요?',
    '이상적인 평범한 화요일은 어떤 모습인가요?',
    '참을 필요가 없는데 참고 있는 것은 무엇인가요?',
    '꾸준히 지키면 인생을 바꿀 습관 하나는 무엇인가요?',
    '매일의 행동이 장기적인 비전과 맞닿아 있나요?',
    '지금의 습관 때문에 당신은 어떤 사람이 되어 가고 있나요?',
    '당신은 만드는 쪽인가요, 소비하는 쪽인가요?',
    '비전을 향해 내디딜 수 있는 가장 작은 한 걸음은 무엇인가요?',
    '10분도 안 걸리는데 미루고 있는 일은 무엇인가요?',
    '무언가를 향해 달리고 있나요, 아니면 무언가로부터 도망치고 있나요?',
    '오늘 시작하면 미래의 당신이 무엇에 고마워할까요?'
  ],
  ky: [
    'Сиз өз жашооңуз менен жашап жатасызбы же башкалардын элесиндеби?',
    'Баарын өзгөртөрүн билсеңиз да, эмнеден качып жатасыз?',
    'Идеалдуу кадимки шейшемби кандай болмок?',
    'Чыдабашыңыз керек болчу, бирок эмнеге чыдап жатасыз?',
    'Сактасаңыз, жашооңузду өзгөрткөн кайсы бир адат?',
    'Күндөлүк иштериңиз узак мөөнөттүү көз карашыңызга дал келеби?',
    'Азыркы адаттарыңыздан улам ким болуп баратасыз?',
    'Сиз көбүрөөк жаратасызбы же керектейсизби?',
    'Көз карашыңызга карай эң кичинекей кадам кандай?',
    '10 мүнөткө да жетпейт, бирок эмнени кийинкиге калтырып жатасыз?',
    'Бир нерсеге карай чуркап жатасызбы же бир нерседен качып жатасызбы?',
    'Бүгүн баштасаңыз, келечектеги сиз эмнеге ыраазы болот?'
  ]
};

REFLECTION_QUESTIONS.ar = [
  'هل تعيش حياتك أنت، أم تصوّر الآخرين عنها؟',
  'مما تتهرّب رغم أنك تعلم أنه سيغيّر كل شيء؟',
  'كيف يبدو يوم الثلاثاء العادي المثالي بالنسبة لك؟',
  'ما الذي تتحمّله وليس عليك أن تتحمّله؟',
  'ما العادة الواحدة التي ستغيّر حياتك لو التزمت بها؟',
  'هل تتوافق أفعالك اليومية مع رؤيتك بعيدة المدى؟',
  'من تصبح بفضل عاداتك الحالية؟',
  'هل تُنتج أكثر أم تستهلك أكثر؟',
  'ما أصغر خطوة يمكنك اتخاذها نحو رؤيتك؟',
  'ما الذي تؤجّله مع أنه يستغرق أقل من 10 دقائق؟',
  'هل تركض نحو شيء أم هربًا من شيء؟',
  'على ماذا سيشكرك نفسك المستقبلي إن بدأت اليوم؟'
];

Object.assign(D, {
  ob_back: ['Назад', 'Back', '뒤로', 'Артка'],
  fab_task: ['Создать задачу', 'Create a task', '할 일 만들기', 'Тапшырма түзүү'],
  fab_goal: ['Создать цель', 'Create a goal', '목표 만들기', 'Максат түзүү'],
  fab_enemy: ['Добавить врага', 'Add an enemy', '유혹 추가', 'Душман кошуу'],
  fab_reward: ['Создать награду', 'Create a reward', '보상 만들기', 'Сыйлык түзүү'],
  empty_tasks_t: ['Пока нет задач', 'No tasks yet', '아직 할 일이 없어요', 'Азырынча тапшырма жок'],
  empty_tasks_d: ['Создай первую задачу — она сразу появится в списке на сегодня.', 'Create your first task — it appears in today\'s list right away.', '첫 할 일을 만들면 오늘 목록에 바로 나타납니다.', 'Биринчи тапшырманы түзүңүз — ал бүгүнкү тизмеде дароо чыгат.'],
  empty_goals_t: ['Пока нет целей', 'No goals yet', '아직 목표가 없어요', 'Азырынча максат жок'],
  empty_goals_d: ['Поставь большую цель и получи очки, когда достигнешь её.', 'Set a big goal and earn points when you reach it.', '큰 목표를 세우고 달성하면 포인트를 받으세요.', 'Чоң максат коюп, жеткенде упай алыңыз.'],
  empty_anti_t: ['Врагов пока нет', 'No enemies yet', '아직 유혹이 없어요', 'Душмандар азырынча жок'],
  empty_anti_d: ['Запиши, что тянет тебя назад — так проще удержаться.', 'Write down what pulls you back — it makes resisting easier.', '나를 끌어당기는 것을 적어 두면 이겨내기 쉬워요.', 'Артка тарткан нерселерди жазсаңыз, чыдоо оңой.'],
  empty_rew_t: ['Наград пока нет', 'No rewards yet', '아직 보상이 없어요', 'Сыйлык азырынча жок'],
  empty_rew_d: ['Придумай, чем порадуешь себя за очки: еда, вещь, свободный вечер.', 'Decide how you will treat yourself: takeout, something new, a free evening.', '포인트로 어떤 보상을 받을지 정해 보세요: 음식, 물건, 자유 시간.', 'Упайга өзүңүздү эмне менен кубантасыз: тамак, буюм, бош кеч.'],
  empty_pen_d: ['Придумай штраф — например, холодный душ — чтобы гасить долг делом.', 'Invent a penalty — like a cold shower — to clear debt with action.', '찬물 샤워 같은 벌칙을 정해 행동으로 빚을 갚으세요.', 'Муздак душ сыяктуу жазаны ойлоп таап, карызды иш менен жабыңыз.'],
  today_prog: ['Выполнено {d} из {n}', 'Done {d} of {n}', '{n}개 중 {d}개 완료', '{n}ден {d} аткарылды'],
  sg_sport: ['Спорт', 'Workout', '운동', 'Спорт'],
  sg_read: ['Чтение', 'Reading', '독서', 'Окуу'],
  sg_water: ['Выпить воду', 'Drink water', '물 마시기', 'Суу ичүү'],
  sg_meditate: ['Медитация', 'Meditation', '명상', 'Медитация'],
  sg_lang: ['Учить язык', 'Study a language', '언어 공부', 'Тил үйрөнүү'],
  sg_sleep: ['Лечь спать вовремя', 'Sleep on time', '제때 자기', 'Өз убагында уктоо'],
  added: ['Добавлено!', 'Added!', '추가됨!', 'Кошулду!']
});
Object.assign(AR, {
  ob_back: 'رجوع', fab_task: 'إنشاء مهمة', fab_goal: 'إنشاء هدف', fab_enemy: 'إضافة عدو', fab_reward: 'إنشاء مكافأة',
  empty_tasks_t: 'لا مهام بعد', empty_tasks_d: 'أنشئ أول مهمة — ستظهر فورًا في قائمة اليوم.',
  empty_goals_t: 'لا أهداف بعد', empty_goals_d: 'ضع هدفًا كبيرًا واكسب نقاطًا عند تحقيقه.',
  empty_anti_t: 'لا أعداء بعد', empty_anti_d: 'اكتب ما يشدّك للخلف — يسهل عليك مقاومته.',
  empty_rew_t: 'لا مكافآت بعد', empty_rew_d: 'قرّر كيف ستكافئ نفسك: وجبة أو شيء جديد أو أمسية حرة.',
  empty_pen_d: 'ابتكر عقوبة — مثل دش بارد — لتسدّد الدَّين بالفعل.',
  today_prog: 'أُنجز {d} من {n}',
  sg_sport: 'رياضة', sg_read: 'قراءة', sg_water: 'شرب الماء', sg_meditate: 'تأمل', sg_lang: 'تعلّم لغة', sg_sleep: 'النوم في الوقت',
  added: 'تمت الإضافة!'
});
Object.assign(D, {
  hdr_menu: ['Меню', 'Menu', '메뉴', 'Меню'],
  hdr_lock: ['Блок', 'Lock', '잠금', 'Кулпу'],
  hint_ok: ['Понятно', 'Got it', '확인', 'Түшүндүм'],
  hint_tasks: ['Отмечай сделанное нажатием «Готово» — за каждую задачу получишь очки. Новую задачу добавь кнопкой «+» внизу.', 'Tap “Done” on what you finished to earn points. Add a new task with the “+” button below.', '완료한 일은 「완료」를 눌러 포인트를 받으세요. 아래 「+」 버튼으로 새 할 일을 추가합니다.', 'Аткарганыңды «Бүттү» басып, упай ал. Жаңы тапшырма — төмөндөгү «+» баскыч.'],
  hint_goals: ['Цель — то, к чему ты идёшь. Добавь цель кнопкой «+» и нажми «Достигнуто», когда добьёшься — получишь очки.', 'A goal is what you are working toward. Add one with “+” and tap “Achieved” when you reach it to earn points.', '목표는 향해 가는 지점입니다. 「+」로 추가하고 달성하면 「달성」을 눌러 포인트를 받으세요.', 'Максат — умтулган жериң. «+» менен кош, жеткенде «Жетилди» бас — упай аласың.'],
  hint_anti: ['Здесь — то, что тянет назад. Не поддался — ничего не делай. Сорвался — нажми «Сорвался(лась)», очки уйдут в долг.', 'Things that pull you back live here. Resisted? Do nothing. Slipped? Tap “I slipped” — points become debt.', '나를 끌어내리는 것들입니다. 이겨냈다면 그대로 두고, 실수하면 「실수했어요」를 누르세요. 포인트가 빚이 됩니다.', 'Артка тарткан нерселер. Чыдасаң — эч нерсе кылба, бузсаң — «Үзгүлтүк болду» бас, упай карызга айланат.'],
  hint_analytics: ['Твой прогресс: серии, активность по дням и итоги. Чем больше выполняешь — тем зеленее график.', 'Your progress: streaks, daily activity and totals. The more you do, the greener it gets.', '연속 기록, 일별 활동, 합계를 볼 수 있어요. 많이 할수록 초록색이 늘어납니다.', 'Прогрессиң: серия, күндөр боюнча активдүүлүк. Көп кылсаң — жашыл көбөйөт.'],
  hint_month: ['Календарь на 30 дней: отмечай каждый день, когда занимался языком. Нажми на день, чтобы поставить отметку.', 'A 30-day calendar: mark each day you studied a language. Tap a day to mark it.', '30일 달력: 언어를 공부한 날을 표시하세요. 날짜를 눌러 체크합니다.', '30 күндүк календарь: тил үйрөнгөн күндү белгиле. Күндү бас.'],
  hint_redeem: ['Трать очки на награды. Хватает очков — нажми «Получить». Есть долг — сначала погаси его.', 'Spend points on rewards. Enough points? Tap “Claim”. Have debt? Pay it off first.', '포인트로 보상을 받으세요. 충분하면 「받기」를 누르세요. 빚이 있으면 먼저 갚아야 해요.', 'Упайды сыйлыкка короо. Жетсе — «Алуу». Карыз болсо — алгач жап.']
});
Object.assign(AR, {
  hdr_menu: 'القائمة', hdr_lock: 'قفل', hint_ok: 'فهمت',
  hint_tasks: 'اضغط «تم» على ما أنجزته لتكسب نقاطًا. أضف مهمة جديدة بزر «+» في الأسفل.',
  hint_goals: 'الهدف هو ما تسعى إليه. أضفه بزر «+» وحدّده عند تحقيقه لتكسب نقاطًا.',
  hint_anti: 'هنا ما يشدّك للخلف. إن صمدت فلا تفعل شيئًا، وإن فشلت اضغط «تعثرت» فتتحول النقاط إلى دَين.  تتحول النقاط إلى دَين.',
  hint_analytics: 'تقدّمك: السلاسل والنشاط اليومي والمجاميع. كلما أنجزت أكثر ازداد اللون الأخضر.',
  hint_month: 'تقويم 30 يومًا: حدّد كل يوم درست فيه لغة. اضغط على اليوم لتحديده.',
  hint_redeem: 'أنفق نقاطك على المكافآت. إن كانت كافية اضغط «استلام». إن كان عليك دَين فسدّده أولًا.'
});
const LANG_EN = { ru: 'Russian', en: 'English', ko: 'Korean', ky: 'Kyrgyz', ar: 'Arabic' };

/* ---------- language helpers ---------- */
function detectLang() {
  const saved = store.get(K.lang);
  if (LANGS.includes(saved)) return saved;
  const n = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.includes(n) ? n : 'en';
}
let lang = detectLang();
function t(key, vars) {
  const e = D[key];
  let s = (lang === 'ar' && AR[key]) ? AR[key] : (e ? (e[LANGS.indexOf(lang)] || e[1]) : key);
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
function WEEKDAYS() { return WEEKDAYS_BY_LANG[lang]; }

function applyI18n() {
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('pin-forgot').textContent = t('pin_forgot');
  $('pin-cancel').textContent = t('cancel');
  $('install-banner-label').textContent = t('inst_banner');
  $('install-banner-btn').textContent = t('inst_btn');
  updateInstallUI();
  renderLangChips();
  if (typeof updateFab === 'function' && $('fab')) { updateFab(); showHint(currentTab); }
  if (!$('pin-lock').classList.contains('hidden') && $('pin-lock').classList.contains('visible')) setPinMsg();
}

function setLang(l) {
  if (!LANGS.includes(l)) return;
  lang = l;
  store.set(K.lang, l);
  applyI18n();
  if (appReady) { refreshAll(); if ($('settings-modal').classList.contains('active')) renderSettings(); }
}

function renderLangChips() {
  const lbl = $('ob-lang-label');
  if (lbl) lbl.textContent = LANG_NAMES[lang];
}
function buildLangList(container) {
  container.innerHTML = '';
  LANGS.forEach(l => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lang-row-btn' + (l === lang ? ' active' : '');
    b.setAttribute('aria-pressed', l === lang ? 'true' : 'false');
    b.innerHTML = `<span class="lang-badge">${l.toUpperCase()}</span><span class="lang-names"><b>${esc(LANG_NAMES[l])}</b><small>${LANG_EN[l]}</small></span><span class="lang-check" aria-hidden="true">✓</span>`;
    b.addEventListener('click', () => {
      setLang(l);
      buildLangList(container);
      if (container.id === 'lang-list') setTimeout(() => $('lang-modal').classList.remove('active'), 220);
    });
    container.appendChild(b);
  });
}
function openLangSheet() { buildLangList($('lang-list')); $('lang-modal').classList.add('active'); }

/* =====================================================================
   Helpers
   ===================================================================== */
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function pad(n) { return String(n).padStart(2, '0'); }
// LOCAL date (fixes the UTC shift bug of toISOString around midnight)
function isoOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function todayISO() { return isoOf(new Date()); }
function parseISO(iso) { return new Date(iso + 'T00:00:00'); }
function formatDateShort(iso) {
  const d = parseISO(iso);
  return `${WEEKDAYS()[d.getDay()]} ${d.getDate()}.${pad(d.getMonth() + 1)}`;
}
function uuid() {
  if (window.crypto && crypto.randomUUID) return 'id-' + crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let toastTimer = null;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function getDevice() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

/* =====================================================================
   State
   ===================================================================== */
let state = { tasks: [], goals: [], goalAchievements: [], rewards: [], completions: [], redemptions: [], lang: null };
let selectedStreakTaskId = null;
let selectedTaskDate = null;
let appReady = false;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function cleanStr(s, max) { return typeof s === 'string' ? s.slice(0, max) : ''; }
function cleanInt(n, min, max, def) { n = parseInt(n, 10); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; }
function cleanArr(a) { return Array.isArray(a) ? a.slice(0, 20000) : []; }

function sanitizeLang(l) {
  if (!l || typeof l !== 'object') return null;
  const tracks = [], seen = new Set();
  (Array.isArray(l.tracks) ? l.tracks : []).slice(0, 4).forEach(x => {
    if (!x || typeof x !== 'object') return;
    const id = cleanStr(x.id, 64), name = cleanStr(x.name, 40).trim();
    if (!id || !name || seen.has(id)) return;
    seen.add(id);
    tracks.push({ id, name, emoji: cleanStr(x.emoji, 8) });
  });
  if (!tracks.length) return null;
  const days = {};
  if (l.days && typeof l.days === 'object') {
    Object.keys(l.days).slice(0, 4000).forEach(k => {
      const v = l.days[k];
      if (!DATE_RE.test(k) || !v || typeof v !== 'object') return;
      const ts = Array.from(new Set((Array.isArray(v.t) ? v.t : []).filter(id => typeof id === 'string' && seen.has(id))));
      const w = cleanInt(v.w, 0, 100000, 0);
      if (ts.length || w) days[k] = { t: ts, w };
    });
  }
  return { title: cleanStr(l.title, 60).trim(), tracks, days };
}

// Validates any external data (import / localStorage) so malformed or hostile files can't break the app
function sanitizeState(o) {
  if (!o || typeof o !== 'object' || !Array.isArray(o.tasks)) return null;
  const out = { tasks: [], goals: [], goalAchievements: [], rewards: [], completions: [], redemptions: [], lang: sanitizeLang(o.lang) };
  cleanArr(o.tasks).forEach(x => {
    if (!x || typeof x !== 'object') return;
    const id = cleanStr(x.id, 64), name = cleanStr(x.name, 100).trim();
    if (!id || !name || !['positive', 'anti', 'punishment'].includes(x.type)) return;
    out.tasks.push({ id, name, type: x.type, points: cleanInt(x.points, 1, 100000, 1),
      daysOfWeek: (Array.isArray(x.daysOfWeek) ? x.daysOfWeek : []).map(Number).filter(n => Number.isInteger(n) && n >= 0 && n <= 6) });
  });
  cleanArr(o.goals).forEach(x => {
    if (!x || typeof x !== 'object') return;
    const id = cleanStr(x.id, 64), name = cleanStr(x.name, 100).trim();
    if (id && name) out.goals.push({ id, name, points: cleanInt(x.points, 1, 100000, 1) });
  });
  cleanArr(o.goalAchievements).forEach(x => {
    if (!x || typeof x !== 'object' || !DATE_RE.test(x.date)) return;
    const id = cleanStr(x.id, 64), goalId = cleanStr(x.goalId, 64);
    if (id && goalId) out.goalAchievements.push({ id, goalId, points: cleanInt(x.points, 0, 100000, 0), date: x.date });
  });
  cleanArr(o.rewards).forEach(x => {
    if (!x || typeof x !== 'object') return;
    const id = cleanStr(x.id, 64), name = cleanStr(x.name, 100).trim();
    if (id && name) out.rewards.push({ id, name, cost: cleanInt(x.cost, 1, 1000000, 1) });
  });
  cleanArr(o.completions).forEach(x => {
    if (!x || typeof x !== 'object' || !DATE_RE.test(x.date)) return;
    const id = cleanStr(x.id, 64), taskId = cleanStr(x.taskId, 64);
    if (id && taskId) out.completions.push({ id, taskId, date: x.date });
  });
  cleanArr(o.redemptions).forEach(x => {
    if (!x || typeof x !== 'object' || !DATE_RE.test(x.date)) return;
    const id = cleanStr(x.id, 64);
    if (!id) return;
    const type = x.type === 'punishment' ? 'punishment' : 'reward';
    out.redemptions.push({ id, type, rewardId: cleanStr(x.rewardId, 64), taskId: cleanStr(x.taskId, 64),
      name: cleanStr(x.name, 100), cost: cleanInt(x.cost, 0, 1000000, 0), date: x.date });
  });
  return out;
}

function loadState() {
  try {
    const raw = store.get(K.state);
    if (raw) {
      const clean = sanitizeState(JSON.parse(raw));
      if (clean) state = clean;
    }
  } catch (e) { console.error('load error', e); }
}
function saveState() {
  if (!store.set(K.state, JSON.stringify(state))) toast('⚠ Storage full / unavailable');
}

function sumPointsByType(type) {
  return state.completions.reduce((sum, c) => {
    const task = state.tasks.find(x => x.id === c.taskId);
    return task && task.type === type ? sum + (task.points || 0) : sum;
  }, 0);
}
function totalGoalPoints() {
  return state.goalAchievements.reduce((sum, a) => {
    const goal = state.goals.find(g => g.id === a.goalId);
    return sum + (goal ? goal.points : a.points || 0);
  }, 0);
}
function totalRedeemed() {
  return state.redemptions.filter(r => r.type === 'reward').reduce((s, r) => s + (r.cost || 0), 0);
}
// One clear set of numbers for the Rewards tab
function getBalance() {
  const earned = sumPointsByType('positive') + totalGoalPoints();
  const debtRaw = sumPointsByType('anti');
  const offset = Math.min(sumPointsByType('punishment'), debtRaw);
  const debt = debtRaw - offset;
  const spent = totalRedeemed();
  return { earned, spent, debt, net: earned - spent - debt };
}
function netPoints() { return getBalance().net; }

// Remove records that point to deleted tasks / cap penalties and spending
function sanitizeData() {
  let changed = false;
  const ids = new Set(state.tasks.map(x => x.id));
  const before = state.completions.length;
  state.completions = state.completions.filter(c => ids.has(c.taskId));
  if (state.completions.length !== before) changed = true;
  if (changed) saveState();
}

function getPositiveTasks() { return state.tasks.filter(x => x.type === 'positive'); }
function getAntiTasks() { return state.tasks.filter(x => x.type === 'anti'); }
function getPunishmentTasks() { return state.tasks.filter(x => x.type === 'punishment'); }
function isScheduled(task, weekday) { return task.daysOfWeek.length === 0 || task.daysOfWeek.includes(weekday); }
function isTaskDoneOnDate(taskId, iso) { return state.completions.some(c => c.taskId === taskId && c.date === iso); }

function toggleCompletion(taskId) {
  const iso = todayISO();
  const idx = state.completions.findIndex(c => c.taskId === taskId && c.date === iso);
  if (idx >= 0) state.completions.splice(idx, 1);
  else state.completions.push({ id: uuid(), taskId, date: iso });
  saveState();
  refreshAll();
}

function calcStreak(taskId) {
  const task = state.tasks.find(x => x.id === taskId);
  if (!task) return { current: 0, best: 0 };
  const dateSet = new Set(state.completions.filter(c => c.taskId === taskId).map(c => c.date));
  if (dateSet.size === 0) return { current: 0, best: 0 };
  const today = new Date(); today.setHours(0, 0, 0, 0);

  let current = 0;
  const cursor = new Date(today);
  for (let i = 0; i < 365; i++) {
    if (!isScheduled(task, cursor.getDay())) { cursor.setDate(cursor.getDate() - 1); continue; }
    if (dateSet.has(isoOf(cursor))) { current++; cursor.setDate(cursor.getDate() - 1); }
    else if (i === 0) { cursor.setDate(cursor.getDate() - 1); } // today not done yet — don't break streak
    else break;
  }

  let best = 0, streak = 0;
  const loop = new Date(today); loop.setDate(loop.getDate() - 364);
  for (let i = 0; i < 365; i++) {
    if (isScheduled(task, loop.getDay())) {
      if (dateSet.has(isoOf(loop))) { streak++; if (streak > best) best = streak; } else streak = 0;
    }
    loop.setDate(loop.getDate() + 1);
  }
  return { current, best: Math.max(best, current) };
}

function getTodaysProgress() {
  const wd = new Date().getDay(), iso = todayISO();
  const scheduled = getPositiveTasks().filter(x => isScheduled(x, wd));
  return { done: scheduled.filter(x => isTaskDoneOnDate(x.id, iso)).length, total: scheduled.length };
}
function getWeekCompletionRate() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let total = 0, done = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const iso = isoOf(d);
    const sch = getPositiveTasks().filter(x => isScheduled(x, d.getDay()));
    total += sch.length;
    done += sch.filter(x => isTaskDoneOnDate(x.id, iso)).length;
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
function getAntiFreeDays() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ids = new Set(getAntiTasks().map(x => x.id));
  const dates = new Set(state.completions.filter(c => ids.has(c.taskId)).map(c => c.date));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    if (dates.has(isoOf(d))) break;
    streak++;
  }
  return streak;
}

/* =====================================================================
   Install (PWA)
   ===================================================================== */
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  updateInstallUI();
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  store.set(K.installDismissed, 'true');
  updateInstallUI();
  toast(t('inst_installed'));
});

function fillInstallSteps(container) {
  const dev = getDevice();
  const step = (n, txt) => `<div class="install-step"><div class="install-step-num">${n}</div><div class="install-step-text">${esc(txt)}</div></div>`;
  if (isStandalone()) { container.innerHTML = `<div class="install-intro" style="margin:0">${esc(t('inst_installed'))}</div>`; return; }
  if (dev === 'ios') {
    container.innerHTML = `<div class="install-intro">${esc(t('inst_ios_intro'))}</div>` + step(1, t('inst_ios1')) + step(2, t('inst_ios2')) + step(3, t('inst_ios3'));
  } else if (dev === 'android') {
    container.innerHTML = `<div class="install-intro" style="margin:0">${esc(t('inst_and_hint'))}</div>`;
  } else {
    container.innerHTML = `<div class="install-intro" style="margin:0">${esc(t('inst_desk_hint'))}</div>`;
  }
}

function updateInstallUI() {
  const banner = $('install-banner');
  if (banner) {
    const hide = isStandalone() || store.get(K.installDismissed) === 'true';
    banner.classList.toggle('hidden', hide);
  }
  const btn = $('onboarding-next-install');
  if (btn) btn.textContent = deferredInstallPrompt ? t('inst_btn') : t('inst_done');
  const box = $('install-instructions');
  if (box) fillInstallSteps(box);
}

async function doInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    let outcome = '';
    try { outcome = (await deferredInstallPrompt.userChoice).outcome; } catch (e) {}
    deferredInstallPrompt = null;
    updateInstallUI();
    return outcome === 'accepted';
  }
  fillInstallSteps($('install-modal-instructions'));
  $('install-modal').classList.add('active');
  return false;
}

function setupInstallBanner() {
  updateInstallUI();
  $('install-banner-btn').addEventListener('click', doInstall);
  $('install-banner-close').addEventListener('click', () => {
    store.set(K.installDismissed, 'true');
    $('install-banner').classList.add('hidden');
  });
  $('install-modal-close').addEventListener('click', () => $('install-modal').classList.remove('active'));
  $('install-modal').addEventListener('click', (e) => { if (e.target.id === 'install-modal') $('install-modal').classList.remove('active'); });
}

/* =====================================================================
   PIN lock (PBKDF2 + salt, brute-force delay, auto-lock)
   ===================================================================== */
const lockEl = $('pin-lock');
let pinEntry = '', pinMode = 'check', pinFirst = '', changingPin = false, pinBusy = false, hiddenAt = 0, waitTimer = null;

const toHex = (buf) => Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('');
function randSalt() {
  const a = new Uint8Array(16);
  if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
  else for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
  return toHex(a);
}
async function derive(pin, salt) {
  if (window.crypto && crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']);
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 150000, hash: 'SHA-256' }, key, 256);
      return toHex(bits);
    } catch (e) { /* fall through */ }
  }
  let h = 5381; const s = salt + pin;
  for (let i = 0; i < 5000; i++) for (let j = 0; j < s.length; j++) h = ((h << 5) + h + s.charCodeAt(j) + i) | 0;
  return 'f' + h;
}
function legacyHash(p) { let h = 0; for (let i = 0; i < p.length; i++) h = ((h << 5) - h) + p.charCodeAt(i) | 0; return h.toString(); }
function getPinRecord() { try { return JSON.parse(store.get(K.pin)); } catch (e) { return null; } }
function hasPin() { return !!(getPinRecord() || store.get(K.pinOld)); }
async function setPin(pin) {
  const salt = randSalt();
  store.set(K.pin, JSON.stringify({ salt, hash: await derive(pin, salt) }));
  store.del(K.pinOld);
}
async function verifyPin(pin) {
  const rec = getPinRecord();
  if (rec && rec.salt && rec.hash) return (await derive(pin, rec.salt)) === rec.hash;
  const old = store.get(K.pinOld);
  if (old && legacyHash(pin) === old) { await setPin(pin); return true; } // upgrade legacy PIN to the secure format
  return false;
}
function failInfo() { try { return JSON.parse(store.get(K.fail)) || { count: 0, until: 0 }; } catch (e) { return { count: 0, until: 0 }; } }
function lockedSeconds() { return Math.max(0, Math.ceil((failInfo().until - Date.now()) / 1000)); }
function registerFail() {
  const f = failInfo(); f.count++;
  if (f.count >= 5) f.until = Date.now() + Math.min(30 * Math.pow(2, f.count - 5), 3600) * 1000;
  store.set(K.fail, JSON.stringify(f));
}

function updateDots(error) {
  document.querySelectorAll('.pin-dot').forEach((d, i) => {
    d.classList.remove('filled', 'error');
    if (error) d.classList.add('error'); else if (i < pinEntry.length) d.classList.add('filled');
  });
}
function setPinMsg(custom, isErr) {
  const m = $('pin-msg');
  const wait = lockedSeconds();
  if (wait > 0) {
    m.textContent = t('pin_wait', { n: wait }); m.classList.add('error');
    clearTimeout(waitTimer); waitTimer = setTimeout(() => setPinMsg(), 1000);
    return;
  }
  clearTimeout(waitTimer);
  const map = { check: 'pin_enter', set: 'pin_create', confirm: 'pin_confirm', old: 'pin_old' };
  m.textContent = custom || t(map[pinMode]);
  m.classList.toggle('error', !!isErr);
}
function showLock(mode) {
  pinMode = mode; pinEntry = ''; pinFirst = '';
  lockEl.classList.remove('hidden'); lockEl.classList.add('visible');
  $('pin-forgot').style.display = (mode === 'check') ? '' : 'none';
  $('pin-cancel').style.display = changingPin ? '' : 'none';
  updateDots(); setPinMsg();
}
function hideLock() { lockEl.classList.remove('visible'); lockEl.classList.add('hidden'); }

function unlockApp() {
  hideLock();
  changingPin = false;
  $('app-shell').style.display = '';
  if (!appReady) { appReady = true; initApp(); } else refreshAll();
}
function lockApp() {
  if (!appReady || !hasPin()) return;
  document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  hideReflectionModal();
  $('app-shell').style.display = 'none';
  changingPin = false;
  showLock('check');
}

async function handlePin(key) {
  if (pinBusy || lockedSeconds() > 0) return;
  if (key === '←') { pinEntry = pinEntry.slice(0, -1); updateDots(); return; }
  if (!/^\d$/.test(key) || pinEntry.length >= 4) return;
  pinEntry += key; updateDots();
  if (pinEntry.length < 4) return;

  pinBusy = true;
  const pin = pinEntry;
  try {
    if (pinMode === 'check' || pinMode === 'old') {
      if (await verifyPin(pin)) {
        store.del(K.fail);
        if (pinMode === 'check') unlockApp();
        else { pinMode = 'set'; pinEntry = ''; updateDots(); setPinMsg(); }
      } else {
        registerFail(); updateDots(true);
        setTimeout(() => { pinEntry = ''; updateDots(); setPinMsg(t('pin_wrong'), true); }, 350);
      }
    } else if (pinMode === 'set') {
      pinFirst = pin; pinMode = 'confirm'; pinEntry = ''; updateDots(); setPinMsg();
    } else if (pinMode === 'confirm') {
      if (pin === pinFirst) { await setPin(pin); unlockApp(); }
      else { updateDots(true); setTimeout(() => { pinMode = 'set'; pinEntry = ''; pinFirst = ''; updateDots(); setPinMsg(t('pin_mismatch'), true); }, 350); }
    }
  } finally { pinBusy = false; }
}

function setupPin() {
  $('pin-pad').addEventListener('click', e => {
    const b = e.target.closest('.pin-btn');
    if (b && !b.classList.contains('empty')) handlePin(b.textContent.trim());
  });
  document.addEventListener('keydown', e => {
    if (!lockEl.classList.contains('visible')) return;
    if (/^\d$/.test(e.key)) handlePin(e.key);
    else if (e.key === 'Backspace') handlePin('←');
  });
  $('pin-forgot').addEventListener('click', () => {
    if (!confirm(t('pin_forgot_confirm'))) return;
    Object.keys(localStorage).filter(k => k.startsWith('kyro_') && k !== K.lang).forEach(k => store.del(k));
    location.reload();
  });
  $('pin-cancel').addEventListener('click', () => { changingPin = false; unlockApp(); });

  // Auto-lock after being in background > 30s
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hiddenAt = Date.now();
    else if (appReady && hiddenAt && Date.now() - hiddenAt > 30000 && !lockEl.classList.contains('visible')) lockApp();
  });
  window.addEventListener('pagehide', () => { hiddenAt = Date.now(); });
}

/* =====================================================================
   Onboarding
   ===================================================================== */
let currentOnboardingScreen = 0;
const TOTAL_SCREENS = 7;

function hasCompletedOnboarding() { return store.get(K.onboarded) === 'true'; }

function saveVisions() {
  const anti = ($('anti-vision-input').value || '').slice(0, 500);
  const vis = ($('vision-input').value || '').slice(0, 500);
  const rt = $('reflection-time-input').value || '08:00';
  if (anti) store.set(K.anti, anti);
  if (vis) store.set(K.vision, vis);
  store.set(K.rtime, /^\d{2}:\d{2}$/.test(rt) ? rt : '08:00');
}
function completeOnboarding() {
  saveVisions();
  store.set(K.onboarded, 'true');
  $('onboarding').classList.add('hidden');
  showLock(hasPin() ? 'check' : 'set');
}
function initOnboardingProgress() {
  const c = $('onboarding-progress'); c.innerHTML = '';
  for (let i = 0; i < TOTAL_SCREENS; i++) {
    const d = document.createElement('div');
    d.className = 'onboarding-dot' + (i === 0 ? ' active' : '');
    c.appendChild(d);
  }
}
function goToOnboardingScreen(index) {
  document.querySelectorAll('.onboarding-screen').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`[data-screen="${index}"]`);
  if (!target) return;
  target.classList.add('active');
  target.scrollTop = 0;
  currentOnboardingScreen = index;
  document.querySelectorAll('.onboarding-dot').forEach((d, i) => d.classList.toggle('active', i === index));
  $('onboarding-foot').classList.toggle('visible', index >= 1);
  $('onboarding-progress').classList.toggle('visible', index >= 1);
  $('onboarding-back').classList.toggle('hidden-btn', index < 2);
  if (index === 1) {
    setTimeout(() => $('onboarding-quote').classList.add('visible'), 400);
    setTimeout(() => $('quote-btn-wrapper').classList.add('visible'), 1800);
  }
}
function setupCharCount(inputId, countId) {
  const input = $(inputId), c = $(countId);
  input.addEventListener('input', () => { c.textContent = input.value.length; });
}
function setupOnboarding() {
  if (hasCompletedOnboarding()) {
    $('onboarding').classList.add('hidden');
    showLock(hasPin() ? 'check' : 'set');
    return;
  }
  initOnboardingProgress();
  setTimeout(() => $('onboarding-logo').classList.add('visible'), 300);
  if (isStandalone()) goToOnboardingScreen(1);

  $('onboarding-next-install').addEventListener('click', async () => {
    if (deferredInstallPrompt) await doInstall();
    goToOnboardingScreen(1);
  });
  $('onboarding-skip-install').addEventListener('click', () => goToOnboardingScreen(1));
  $('onboarding-quote-start').addEventListener('click', () => goToOnboardingScreen(2));
  $('onboarding-skip').addEventListener('click', completeOnboarding);
  $('onboarding-back').addEventListener('click', () => goToOnboardingScreen(Math.max(1, currentOnboardingScreen - 1)));
  $('ob-lang-btn').addEventListener('click', openLangSheet);
  for (let i = 2; i <= 5; i++) $(`onboarding-next-${i}`).addEventListener('click', () => goToOnboardingScreen(i + 1));
  $('onboarding-next-5').addEventListener('click', requestNotificationPermission);
  setupCharCount('anti-vision-input', 'anti-char-count');
  setupCharCount('vision-input', 'vision-char-count');
  $('onboarding-start').addEventListener('click', completeOnboarding);
}

/* =====================================================================
   Reflection
   ===================================================================== */
function getRandomQuestion() {
  const list = REFLECTION_QUESTIONS[lang] || REFLECTION_QUESTIONS.en;
  return list[Math.floor(Math.random() * list.length)];
}
function shouldShowReflection() {
  const saved = store.get(K.rtime);
  if (!saved) return false;
  if (store.get(K.rlast) === todayISO()) return false;
  const [h, m] = saved.split(':').map(Number);
  const at = new Date(); at.setHours(h, m, 0, 0);
  const diff = (Date.now() - at.getTime()) / 3600000;
  return diff >= 0 && diff <= 2;
}
function showReflectionModal() {
  $('reflection-question').textContent = getRandomQuestion();
  $('reflection-modal').classList.add('active');
}
function hideReflectionModal() { $('reflection-modal').classList.remove('active'); }
function markReflectionDone() { store.set(K.rlast, todayISO()); hideReflectionModal(); }
function setupReflectionModal() {
  $('reflection-skip').addEventListener('click', hideReflectionModal);
  $('reflection-done').addEventListener('click', markReflectionDone);
}
function requestNotificationPermission() {
  try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (e) {}
}
function scheduleNotificationCheck() {
  setInterval(() => {
    if (!appReady || lockEl.classList.contains('visible')) return;
    if (shouldShowReflection() && document.visibilityState === 'visible') showReflectionModal();
  }, 60000);
  setInterval(() => {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const saved = store.get(K.rtime);
      if (!saved || store.get(K.rlast) === todayISO()) return;
      const [h, m] = saved.split(':').map(Number);
      const now = new Date();
      if (now.getHours() === h && now.getMinutes() === m) {
        new Notification(t('notif_title'), { icon: 'icons/icon-192.png', tag: 'reflection-' + todayISO() });
      }
    } catch (e) {}
  }, 60000);
}

/* =====================================================================
   Settings
   ===================================================================== */
let activeSettingsSection = 'general';

function mkCard(html) { const c = document.createElement('div'); c.className = 'card'; c.innerHTML = html; return c; }
function title(icon, cls, text) { return `<div class="section-title"><span class="icon ${cls}">${icon}</span> ${esc(text)}</div>`; }

function renderSettings() {
  const container = $('settings-content');
  container.innerHTML = '';

  const nav = document.createElement('div');
  nav.className = 'settings-nav';
  [['general', 's_general'], ['vision', 's_vision'], ['reflect', 's_reflect'], ['month', 's_month'], ['tasks', 's_tasks'], ['goals', 's_goals'], ['enemies', 's_enemies'], ['atonements', 's_atone'], ['rewards', 's_rewards']]
    .forEach(([id, key]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'settings-nav-btn' + (activeSettingsSection === id ? ' active' : '');
      b.textContent = t(key);
      b.addEventListener('click', () => { activeSettingsSection = id; renderSettings(); });
      nav.appendChild(b);
    });
  container.appendChild(nav);

  const sec = activeSettingsSection;

  /* ---- GENERAL ---- */
  if (sec === 'general') {
    const langCard = mkCard(title('🌐', 'gold', t('language')) + '<div class="lang-list" id="lang-grid"></div>');
    buildLangList(langCard.querySelector('#lang-grid'));
    container.appendChild(langCard);

    if (!isStandalone()) {
      const inst = mkCard(title('⊕', 'gold', t('install_app')) + `<button class="btn block" id="inst-btn" type="button">${esc(t('inst_btn'))}</button>`);
      inst.querySelector('#inst-btn').addEventListener('click', doInstall);
      container.appendChild(inst);
    }

    const backup = mkCard(`
      ${title('☁', '', t('backup'))}
      <p class="small" style="margin-bottom:14px;">${esc(t('backup_hint'))}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn" id="export-btn" type="button" style="flex:1;min-width:110px;">↓ ${esc(t('export'))}</button>
        <label class="btn ghost" style="flex:1;min-width:110px;cursor:pointer;margin:0;text-transform:none;letter-spacing:0;font-size:13px;color:var(--text-muted);">↑ ${esc(t('import'))}
          <input type="file" id="import-input" accept=".json,application/json" style="display:none;" />
        </label>
      </div>`);
    backup.querySelector('#export-btn').addEventListener('click', () => {
      const data = { ...state, vision: store.get(K.vision) || '', antiVision: store.get(K.anti) || '', reflectionTime: store.get(K.rtime) || '08:00' };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `kyro-backup-${todayISO()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('✓ ' + t('exported'));
    });
    backup.querySelector('#import-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { alert(t('bad_file')); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const raw = JSON.parse(ev.target.result);
          const clean = sanitizeState(raw);
          if (!clean) throw new Error('invalid');
          if (!confirm(t('import_confirm'))) return;
          state = clean;
          if (typeof raw.vision === 'string') store.set(K.vision, raw.vision.slice(0, 500));
          if (typeof raw.antiVision === 'string') store.set(K.anti, raw.antiVision.slice(0, 500));
          if (typeof raw.reflectionTime === 'string' && /^\d{2}:\d{2}$/.test(raw.reflectionTime)) store.set(K.rtime, raw.reflectionTime);
          sanitizeData(); saveState(); refreshAll(); renderSettings();
          toast('✓ ' + t('restored'));
        } catch (err) { alert(t('bad_file')); }
      };
      reader.readAsText(file);
    });
    container.appendChild(backup);

    const sec2 = mkCard(`
      ${title('🔐', '', t('security'))}
      <p class="small" style="margin-bottom:14px;">${esc(t('autolock'))}</p>
      <div style="display:grid;gap:10px;">
        <button class="btn ghost block" id="change-pin-btn" type="button">${esc(t('change_pin'))}</button>
        <button class="btn ghost block" id="lock-now-btn" type="button">${esc(t('lock_now'))}</button>
      </div>`);
    sec2.querySelector('#change-pin-btn').addEventListener('click', () => {
      $('settings-modal').classList.remove('active');
      changingPin = true;
      showLock(hasPin() ? 'old' : 'set');
    });
    sec2.querySelector('#lock-now-btn').addEventListener('click', lockApp);
    container.appendChild(sec2);
  }

  /* ---- VISION ---- */
  if (sec === 'vision') {
    const vc = mkCard(`${title('★', 'gold', t('your_vision'))}
      <p class="small" style="margin-bottom:12px;">${esc(t('vision_hint'))}</p>
      <textarea id="vision-edit" rows="4" maxlength="500"></textarea>
      <button class="btn block" id="save-vision-btn" type="button" style="margin-top:12px;">${esc(t('save'))}</button>`);
    vc.querySelector('#vision-edit').value = store.get(K.vision) || '';
    vc.querySelector('#save-vision-btn').addEventListener('click', () => {
      store.set(K.vision, vc.querySelector('#vision-edit').value.trim().slice(0, 500));
      toast('✓ ' + t('saved')); refreshAll();
    });
    const ac = mkCard(`${title('⚔', 'red', t('your_anti'))}
      <p class="small" style="margin-bottom:12px;">${esc(t('anti_hint'))}</p>
      <textarea id="anti-edit" rows="4" maxlength="500" style="border-color:rgba(239,68,68,.3);"></textarea>
      <button class="btn block" id="save-anti-btn" type="button" style="margin-top:12px;">${esc(t('save'))}</button>`);
    ac.querySelector('#anti-edit').value = store.get(K.anti) || '';
    ac.querySelector('#save-anti-btn').addEventListener('click', () => {
      store.set(K.anti, ac.querySelector('#anti-edit').value.trim().slice(0, 500));
      toast('✓ ' + t('saved')); refreshAll();
    });
    container.appendChild(vc); container.appendChild(ac);
  }

  /* ---- REFLECT ---- */
  if (sec === 'reflect') {
    const tc = mkCard(`${title('◐', 'gold', t('refl_time'))}
      <p class="small" style="margin-bottom:14px;">${esc(t('refl_time_hint'))}</p>
      <div style="display:flex;gap:10px;align-items:center;">
        <input type="time" id="rt-edit" style="flex:1;text-align:center;font-size:20px;" />
        <button class="btn" id="rt-save" type="button">${esc(t('save'))}</button>
      </div>`);
    tc.querySelector('#rt-edit').value = store.get(K.rtime) || '08:00';
    tc.querySelector('#rt-save').addEventListener('click', () => {
      const v = tc.querySelector('#rt-edit').value;
      if (/^\d{2}:\d{2}$/.test(v)) { store.set(K.rtime, v); toast('✓ ' + t('saved')); }
    });
    const nc = mkCard(`${title('💭', '', t('refl_now'))}<button class="btn block" id="rn-btn" type="button">${esc(t('show_q'))}</button>`);
    nc.querySelector('#rn-btn').addEventListener('click', () => { $('settings-modal').classList.remove('active'); showReflectionModal(); });

    const supported = 'Notification' in window;
    const perm = supported ? Notification.permission : 'unsupported';
    const label = !supported ? t('n_unsupported') : perm === 'granted' ? t('n_on') : perm === 'denied' ? t('n_denied') : t('n_default');
    const color = perm === 'granted' ? 'var(--emerald)' : perm === 'denied' ? 'var(--crimson)' : 'var(--text-dim)';
    const nf = mkCard(`${title('🔔', '', t('notif'))}
      <p class="small" style="margin-bottom:12px;">${esc(t('status'))}: <span style="color:${color};">${esc(label)}</span></p>
      ${perm === 'default' ? `<button class="btn ghost block" id="notif-btn" type="button">${esc(t('n_enable'))}</button>` : ''}`);
    const nb = nf.querySelector('#notif-btn');
    if (nb) nb.addEventListener('click', () => { requestNotificationPermission(); setTimeout(renderSettings, 600); });
    container.appendChild(tc); container.appendChild(nc); container.appendChild(nf);
  }

  /* ---- MONTH (theme + tracks) ---- */
  if (sec === 'month') {
    const l = ensureLang();
    const tc = mkCard(`${title('🌸', 'gold', t('lm_theme'))}
      <div class="field"><input id="lm-title-edit" maxlength="60" placeholder="${esc(t('lm_title'))}" /></div>
      <button class="btn block" id="lm-title-save" type="button">${esc(t('save'))}</button>`);
    tc.querySelector('#lm-title-edit').value = l.title;
    tc.querySelector('#lm-title-save').addEventListener('click', () => {
      l.title = tc.querySelector('#lm-title-edit').value.trim().slice(0, 60);
      saveState(); refreshAll(); toast('✓ ' + t('saved'));
    });
    container.appendChild(tc);

    const trc = mkCard(title('✎', 'gold', t('lm_tracks')));
    l.tracks.forEach((tr, i) => {
      const row = document.createElement('div'); row.className = 'row';
      row.innerHTML = `<input class="lm-emoji-in" maxlength="8" aria-label="emoji" style="width:62px;flex:0 0 62px;text-align:center;" />
        <input class="lm-name-in" maxlength="40" style="flex:1;min-width:0;" />
        <button class="btn small ghost" type="button" style="flex-shrink:0;">${esc(t('delete'))}</button>`;
      row.querySelector('.lm-emoji-in').value = tr.emoji;
      row.querySelector('.lm-name-in').value = tr.name;
      row.querySelector('button').addEventListener('click', () => {
        if (l.tracks.length <= 1) { alert(t('lm_min')); return; }
        if (!confirm(t('del_confirm'))) return;
        l.tracks.splice(i, 1);
        Object.keys(l.days).forEach(k => {
          const d = l.days[k];
          d.t = d.t.filter(id => id !== tr.id);
          if (!d.t.length && !d.w) delete l.days[k];
        });
        saveState(); refreshAll(); renderSettings();
      });
      trc.appendChild(row);
    });
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn block'; saveBtn.type = 'button'; saveBtn.style.marginTop = '14px'; saveBtn.textContent = t('save');
    saveBtn.addEventListener('click', () => {
      const rows = trc.querySelectorAll('.row');
      l.tracks.forEach((tr, i) => {
        const r = rows[i]; if (!r) return;
        const nm = r.querySelector('.lm-name-in').value.trim().slice(0, 40);
        if (nm) tr.name = nm;
        tr.emoji = r.querySelector('.lm-emoji-in').value.trim().slice(0, 8);
      });
      saveState(); refreshAll(); toast('✓ ' + t('saved'));
    });
    trc.appendChild(saveBtn);
    const addBtn = document.createElement('button');
    addBtn.className = 'btn ghost block'; addBtn.type = 'button'; addBtn.style.marginTop = '10px'; addBtn.textContent = '+ ' + t('lm_add_track');
    addBtn.addEventListener('click', () => {
      if (l.tracks.length >= 4) { alert(t('lm_max')); return; }
      l.tracks.push({ id: uuid(), name: t('lm_new_track'), emoji: '📘' });
      saveState(); refreshAll(); renderSettings();
    });
    trc.appendChild(addBtn);
    container.appendChild(trc);
  }

  /* ---- generic list/add sections ---- */
  if (sec === 'tasks') {
    const card = mkCard(`${title('✓', 'green', t('add_task'))}
      <div class="field"><label>${esc(t('name'))}</label><input id="f-name" maxlength="100" placeholder="${esc(t('ph_task'))}" /></div>
      <div class="field"><label>${esc(t('points'))}</label><input id="f-pts" type="number" inputmode="numeric" min="1" max="100000" value="5" /></div>
      <div class="field"><label>${esc(t('weekdays'))}</label><div id="wd" class="weekday-chips"></div>
        <div class="small" style="margin-top:6px;">${esc(t('weekdays_hint'))}</div></div>
      <button class="btn block" id="f-add" type="button">${esc(t('add'))}</button>`);
    const picked = new Set([1, 2, 3, 4, 5]);
    WEEKDAYS().forEach((lbl, i) => {
      const s = document.createElement('span');
      s.className = 'weekday' + (picked.has(i) ? ' selected' : ''); s.textContent = lbl;
      s.addEventListener('click', () => { picked.has(i) ? picked.delete(i) : picked.add(i); s.classList.toggle('selected'); });
      card.querySelector('#wd').appendChild(s);
    });
    card.querySelector('#f-add').addEventListener('click', () => {
      const name = card.querySelector('#f-name').value.trim();
      const pts = cleanInt(card.querySelector('#f-pts').value, 0, 100000, 0);
      if (!name || !pts) { alert(t('need_np')); return; }
      state.tasks.push({ id: uuid(), name, type: 'positive', points: pts, daysOfWeek: Array.from(picked) });
      saveState(); refreshAll(); renderSettings();
    });
    container.appendChild(card);
    container.appendChild(listCard(t('your_tasks'), '✓', 'green', getPositiveTasks().map(x => ({
      id: x.id, name: x.name, rename: (v) => { x.name = v; },
      pills: `<span class="pill green">+${x.points}</span><span class="pill subtle">${esc(x.daysOfWeek.length ? x.daysOfWeek.map(d => WEEKDAYS()[d]).join(', ') : t('every_day'))}</span>`,
      remove: () => { state.tasks = state.tasks.filter(z => z.id !== x.id); state.completions = state.completions.filter(c => c.taskId !== x.id); }
    }))));
  }

  if (sec === 'goals') {
    const card = mkCard(`${title('⚑', 'green', t('add_goal'))}
      <div class="field"><label>${esc(t('goal_name'))}</label><input id="f-name" maxlength="100" placeholder="${esc(t('ph_goal'))}" /></div>
      <div class="field"><label>${esc(t('goal_points'))}</label><input id="f-pts" type="number" inputmode="numeric" min="1" max="100000" value="50" /></div>
      <button class="btn block" id="f-add" type="button">${esc(t('add'))}</button>`);
    card.querySelector('#f-add').addEventListener('click', () => {
      const name = card.querySelector('#f-name').value.trim();
      const pts = cleanInt(card.querySelector('#f-pts').value, 0, 100000, 0);
      if (!name || !pts) { alert(t('need_np')); return; }
      state.goals.push({ id: uuid(), name, points: pts });
      saveState(); refreshAll(); renderSettings();
    });
    const done = new Set(state.goalAchievements.map(a => a.goalId));
    container.appendChild(card);
    container.appendChild(listCard(t('your_goals'), '⚑', 'green', state.goals.map(g => ({
      id: g.id, name: g.name, rename: (v) => { g.name = v; }, strike: done.has(g.id),
      pills: `<span class="pill ${done.has(g.id) ? 'subtle' : 'gold'}">+${g.points}</span>${done.has(g.id) ? `<span class="pill green">${esc(t('achieved'))}</span>` : ''}`,
      remove: () => { state.goals = state.goals.filter(z => z.id !== g.id); state.goalAchievements = state.goalAchievements.filter(a => a.goalId !== g.id); }
    }))));
  }

  if (sec === 'enemies') {
    const card = mkCard(`${title('⚔', 'red', t('add_enemy'))}
      <div class="field"><label>${esc(t('name'))}</label><input id="f-name" maxlength="100" placeholder="${esc(t('ph_enemy'))}" /></div>
      <div class="field"><label>${esc(t('debt_points'))}</label><input id="f-pts" type="number" inputmode="numeric" min="1" max="100000" value="5" /></div>
      <button class="btn block" id="f-add" type="button">${esc(t('add'))}</button>`);
    card.querySelector('#f-add').addEventListener('click', () => {
      const name = card.querySelector('#f-name').value.trim();
      const pts = cleanInt(card.querySelector('#f-pts').value, 0, 100000, 0);
      if (!name || !pts) { alert(t('need_np')); return; }
      state.tasks.push({ id: uuid(), name, type: 'anti', points: pts, daysOfWeek: [] });
      saveState(); refreshAll(); renderSettings();
    });
    container.appendChild(card);
    container.appendChild(listCard(t('your_enemies'), '⚔', 'red', getAntiTasks().map(x => ({
      id: x.id, name: x.name, rename: (v) => { x.name = v; }, pills: `<span class="pill red">−${x.points}</span>`,
      remove: () => { state.tasks = state.tasks.filter(z => z.id !== x.id); state.completions = state.completions.filter(c => c.taskId !== x.id); }
    }))));
  }

  if (sec === 'atonements') {
    const card = mkCard(`${title('↺', 'purple', t('add_penalty'))}
      <div class="field"><label>${esc(t('name'))}</label><input id="f-name" maxlength="100" placeholder="${esc(t('ph_penalty'))}" /></div>
      <div class="field"><label>${esc(t('debt_reduce'))}</label><input id="f-pts" type="number" inputmode="numeric" min="1" max="100000" value="5" /></div>
      <button class="btn block" id="f-add" type="button">${esc(t('add'))}</button>`);
    card.querySelector('#f-add').addEventListener('click', () => {
      const name = card.querySelector('#f-name').value.trim();
      const pts = cleanInt(card.querySelector('#f-pts').value, 0, 100000, 0);
      if (!name || !pts) { alert(t('need_np')); return; }
      state.tasks.push({ id: uuid(), name, type: 'punishment', points: pts, daysOfWeek: [] });
      saveState(); refreshAll(); renderSettings();
    });
    container.appendChild(card);
    container.appendChild(listCard(t('your_penalties'), '↺', 'purple', getPunishmentTasks().map(x => ({
      id: x.id, name: x.name, rename: (v) => { x.name = v; }, pills: `<span class="pill violet">${esc(t('debt_cleared', { n: x.points }))}</span>`,
      remove: () => { state.tasks = state.tasks.filter(z => z.id !== x.id); state.completions = state.completions.filter(c => c.taskId !== x.id); }
    }))));
  }

  if (sec === 'rewards') {
    const card = mkCard(`${title('★', 'gold', t('add_reward'))}
      <div class="field"><label>${esc(t('name'))}</label><input id="f-name" maxlength="100" placeholder="${esc(t('ph_reward'))}" /></div>
      <div class="field"><label>${esc(t('cost'))}</label><input id="f-pts" type="number" inputmode="numeric" min="1" max="1000000" value="20" /></div>
      <button class="btn block" id="f-add" type="button">${esc(t('add'))}</button>`);
    card.querySelector('#f-add').addEventListener('click', () => {
      const name = card.querySelector('#f-name').value.trim();
      const cost = cleanInt(card.querySelector('#f-pts').value, 0, 1000000, 0);
      if (!name || !cost) { alert(t('need_np')); return; }
      state.rewards.push({ id: uuid(), name, cost });
      saveState(); refreshAll(); renderSettings();
    });
    container.appendChild(card);
    container.appendChild(listCard(t('your_rewards'), '★', 'gold', state.rewards.map(r => ({
      id: r.id, name: r.name, rename: (v) => { r.name = v; }, pills: `<span class="pill gold">${r.cost} ${esc(t('pts'))}</span>`,
      remove: () => { state.rewards = state.rewards.filter(z => z.id !== r.id); }
    }))));
  }
}

function listCard(heading, icon, cls, items) {
  const card = mkCard(title(icon, cls, heading));
  if (!items.length) { card.insertAdjacentHTML('beforeend', `<p class="small">${esc(t('nothing_yet'))}</p>`); return card; }
  items.forEach(it => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div class="row-main" style="flex:1;min-width:0;"><div class="row-title ${it.strike ? 'done' : ''}">${esc(it.name)}</div><div class="badges">${it.pills}</div></div>
      <div style="display:flex;gap:6px;flex-shrink:0;">${it.rename ? `<button class="btn small ghost" type="button" data-act="edit" aria-label="${esc(t('edit'))}">✎</button>` : ''}<button class="btn small ghost" type="button" data-act="del">${esc(t('delete'))}</button></div>`;
    const editBtn = row.querySelector('[data-act="edit"]');
    if (editBtn) {
      let editing = false, inp = null;
      const commit = () => {
        const v = inp.value.trim().slice(0, 100);
        if (v && v !== it.name) { it.rename(v); saveState(); refreshAll(); }
        renderSettings();
      };
      editBtn.addEventListener('click', () => {
        if (editing) { commit(); return; }
        editing = true;
        inp = document.createElement('input');
        inp.maxLength = 100; inp.value = it.name;
        row.querySelector('.row-title').replaceWith(inp);
        editBtn.textContent = '✓';
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); else if (e.key === 'Escape') renderSettings(); });
        inp.focus(); inp.select();
      });
    }
    row.querySelector('[data-act="del"]').addEventListener('click', () => {
      if (!confirm(t('del_confirm'))) return;
      it.remove(); saveState(); refreshAll(); renderSettings();
    });
    card.appendChild(row);
  });
  return card;
}

/* =====================================================================
   Tabs
   ===================================================================== */
function renderTasksTab() {
  const c = $('tab-tasks'); c.innerHTML = '';

  const vision = (store.get(K.vision) || '').trim();
  const vc = document.createElement('div'); vc.className = 'vision-card';
  vc.innerHTML = `<div class="vision-card-label">${esc(t('your_vision'))}</div>` +
    (vision ? `<div class="vision-card-text">“${esc(vision)}”</div>` : `<div class="vision-card-empty">${esc(t('vision_empty'))}</div>`);
  c.appendChild(vc);

  if (!getPositiveTasks().length) { c.appendChild(emptyCard('✓', 'g', 'empty_tasks_t', 'empty_tasks_d', 'fab_task', () => openQuickAdd(['task']))); return; }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayIso = isoOf(today);
  if (!selectedTaskDate || selectedTaskDate < todayIso) selectedTaskDate = todayIso;

  const scroll = document.createElement('div'); scroll.className = 'week-scroll';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const iso = isoOf(d);
    const n = getPositiveTasks().filter(x => isScheduled(x, d.getDay())).length;
    const el = document.createElement('div');
    el.className = 'week-day' + (iso === selectedTaskDate ? ' selected' : '') + (iso === todayIso ? ' today' : '');
    el.innerHTML = `<div class="week-day-name">${esc(WEEKDAYS()[d.getDay()])}</div><div class="week-day-num">${d.getDate()}</div><div class="week-day-count">${esc(t('tasks_count', { n }))}</div>`;
    el.addEventListener('click', () => { selectedTaskDate = iso; renderTasksTab(); });
    scroll.appendChild(el);
  }
  c.appendChild(scroll);

  const sel = parseISO(selectedTaskDate);
  const viewingToday = selectedTaskDate === todayIso;
  const list = getPositiveTasks().filter(x => isScheduled(x, sel.getDay()));
  const label = viewingToday ? t('today') : `${WEEKDAYS()[sel.getDay()]}, ${sel.toLocaleDateString(LOCALES[lang], { month: 'short', day: 'numeric' })}`;

  const card = mkCard(title('✓', 'green', label));
  if (!list.length) card.insertAdjacentHTML('beforeend', `<p class="small">${esc(t('none_sched'))}</p>`);
  else {
    if (viewingToday) {
      const doneN = list.filter(x => isTaskDoneOnDate(x.id, selectedTaskDate)).length, pct = Math.round(doneN / list.length * 100);
      card.insertAdjacentHTML('beforeend', `<div class="prog-text"><span>${esc(t('today_prog', { d: doneN, n: list.length }))}</span><span>${pct}%</span></div><div class="prog"><i style="width:${pct}%"></i></div>`);
    }
    if (viewingToday && list.every(x => isTaskDoneOnDate(x.id, selectedTaskDate))) {
      card.insertAdjacentHTML('beforeend', `<div class="victory-banner"><div class="victory-icon">◆</div><div class="victory-text">${esc(t('all_done'))}</div></div>`);
    }
    list.forEach(task => {
      const done = isTaskDoneOnDate(task.id, selectedTaskDate);
      const row = document.createElement('div'); row.className = 'row';
      row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title ${done ? 'done' : ''}">${esc(task.name)}</div>
        <div class="badges"><span class="pill green">+${task.points}</span></div></div>` +
        (viewingToday ? `<button class="btn small ${done ? 'ghost' : 'green'}" type="button">${esc(done ? t('btn_undo') : t('btn_done'))}</button>`
                      : `<span class="pill ${done ? 'green' : 'subtle'}">${esc(done ? '✓ ' + t('btn_done') : t('pending'))}</span>`);
      if (viewingToday) row.querySelector('button').addEventListener('click', () => toggleCompletion(task.id));
      card.appendChild(row);
    });
  }
  c.appendChild(card);
}

function renderGoalsTab() {
  const c = $('tab-goals'); c.innerHTML = '';
  const achieved = new Set(state.goalAchievements.map(a => a.goalId));
  const pending = state.goals.filter(g => !achieved.has(g.id));
  if (!state.goals.length) { c.appendChild(emptyCard('⚑', 'g', 'empty_goals_t', 'empty_goals_d', 'fab_goal', () => openQuickAdd(['goal']))); return; }

  const card = mkCard(title('⚑', 'green', t('active_goals')));
  if (!pending.length) card.insertAdjacentHTML('beforeend', `<p class="small">${esc(t('nothing_yet'))}</p>`);
  pending.forEach(goal => {
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title">${esc(goal.name)}</div><div class="badges"><span class="pill gold">+${goal.points}</span></div></div>
      <button class="btn small green" type="button">${esc(t('achieved'))}</button>`;
    row.querySelector('button').addEventListener('click', () => {
      state.goalAchievements.push({ id: uuid(), goalId: goal.id, points: goal.points, date: todayISO() });
      saveState(); refreshAll();
    });
    card.appendChild(row);
  });
  c.appendChild(card);

  if (state.goalAchievements.length) {
    const hist = mkCard(title('✓', 'green', t('achieved')));
    state.goalAchievements.slice().sort((a, b) => b.date.localeCompare(a.date)).forEach(a => {
      const goal = state.goals.find(g => g.id === a.goalId);
      if (!goal) return;
      const row = document.createElement('div'); row.className = 'row';
      row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title" style="color:var(--text-muted);">${esc(goal.name)}</div>
        <div class="badges"><span class="pill green">+${goal.points}</span><span class="pill subtle">${esc(formatDateShort(a.date))}</span></div></div>
        <button class="btn small ghost" type="button" aria-label="${esc(t('btn_undo'))}">✕</button>`;
      row.querySelector('button').addEventListener('click', () => {
        state.goalAchievements = state.goalAchievements.filter(x => x.id !== a.id);
        saveState(); refreshAll();
      });
      hist.appendChild(row);
    });
    c.appendChild(hist);
  }
}

function renderAntiTab() {
  const c = $('tab-anti'); c.innerHTML = '';
  const av = (store.get(K.anti) || '').trim();
  const vc = document.createElement('div'); vc.className = 'vision-card anti';
  vc.innerHTML = `<div class="vision-card-label">${esc(t('your_anti'))}</div>` +
    (av ? `<div class="vision-card-text">“${esc(av)}”</div>` : `<div class="vision-card-empty">${esc(t('anti_empty'))}</div>`);
  c.appendChild(vc);

  if (!getAntiTasks().length) { c.appendChild(emptyCard('⚔', 'r', 'empty_anti_t', 'empty_anti_d', 'fab_enemy', () => openQuickAdd(['enemy']))); return; }

  const iso = todayISO();
  const card = mkCard(title('⚔', 'red', t('know_enemy')));
  const list = getAntiTasks();
  if (!list.length) card.insertAdjacentHTML('beforeend', `<p class="small">${esc(t('nothing_yet'))}</p>`);
  list.forEach(task => {
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title">${esc(task.name)}</div><div class="badges"><span class="pill red">−${task.points}</span></div></div>
      <button class="btn small ghost danger" type="button">${esc(t('btn_slip'))}</button>`;
    row.querySelector('button').addEventListener('click', () => {
      state.completions.push({ id: uuid(), taskId: task.id, date: iso });
      saveState(); refreshAll();
    });
    card.appendChild(row);
  });
  c.appendChild(card);

  const slips = state.completions.filter(x => x.date === iso).map(x => ({ ...x, task: state.tasks.find(z => z.id === x.taskId) })).filter(x => x.task && x.task.type === 'anti');
  if (slips.length) {
    const hist = mkCard(title('↩', 'red', t('today_slips')));
    slips.reverse().forEach(s => {
      const row = document.createElement('div'); row.className = 'row';
      row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title" style="color:var(--crimson);">${esc(s.task.name)}</div>
        <div class="badges"><span class="pill red">−${s.task.points}</span></div></div>
        <button class="btn small ghost" type="button" aria-label="${esc(t('btn_undo'))}">✕</button>`;
      row.querySelector('button').addEventListener('click', () => {
        const i = state.completions.findIndex(x => x.id === s.id);
        if (i >= 0) { state.completions.splice(i, 1); saveState(); refreshAll(); }
      });
      hist.appendChild(row);
    });
    c.appendChild(hist);
  }
}

function renderAnalyticsTab() {
  const c = $('tab-analytics'); c.innerHTML = '';
  const positives = getPositiveTasks();
  if (!positives.length) { c.appendChild(mkCard(`<p class="small">${esc(t('create_task_first'))}</p>`)); return; }
  if (!selectedStreakTaskId || !positives.some(x => x.id === selectedStreakTaskId)) selectedStreakTaskId = positives[0].id;

  const { current, best } = calcStreak(selectedStreakTaskId);
  const tp = getTodaysProgress(), week = getWeekCompletionRate(), clean = getAntiFreeDays();
  const goalsDone = state.goalAchievements.length, goalsAll = state.goals.length;

  const weekColor = week >= 80 ? 'var(--emerald)' : week >= 50 ? 'var(--gold)' : 'var(--crimson)';
  const todayText = tp.total > 0 ? `${tp.done}/${tp.total}` : '—';
  const todayColor = tp.total === 0 ? 'var(--text-dim)' : tp.done === tp.total ? 'var(--emerald)' : 'var(--gold)';

  const stats = mkCard(title('↗', '', t('your_stats')) + `<div class="analytics-grid">
    <div class="analytics-card"><div class="analytics-label">${esc(t('today'))}</div><div class="analytics-value" style="color:${todayColor};">${todayText}</div><div class="analytics-sublabel">${esc(t('sub_tasks_done'))}</div></div>
    <div class="analytics-card"><div class="analytics-label">${esc(t('stat_week'))}</div><div class="analytics-value" style="color:${weekColor};">${week}%</div><div class="analytics-sublabel">${esc(t('sub_exec'))}</div></div>
    <div class="analytics-card"><div class="analytics-label">${esc(t('stat_goals'))}</div><div class="analytics-value" style="color:var(--gold);">${goalsDone}${goalsAll ? '/' + goalsAll : ''}</div><div class="analytics-sublabel">${esc(t('sub_achieved'))}</div></div>
    <div class="analytics-card"><div class="analytics-label">${esc(t('stat_clean'))}</div><div class="analytics-value" style="color:${clean > 0 ? 'var(--emerald)' : 'var(--text-dim)'};">${clean}</div><div class="analytics-sublabel">${esc(t('sub_clean_days'))}</div></div>
    <div class="analytics-card"><div class="analytics-label">${esc(t('stat_best'))}</div><div class="analytics-value" style="color:var(--violet);">${best}</div><div class="analytics-sublabel">${esc(t('sub_days'))}</div></div>
    <div class="analytics-card"><div class="analytics-label">${esc(t('stat_cur'))}</div><div class="analytics-value" style="color:var(--violet);">${current}</div><div class="analytics-sublabel">${esc(t('sub_in_row'))}</div></div>
  </div>`);
  c.appendChild(stats);

  const today = new Date();
  const cal = mkCard(title('🔥', '', t('streak_cal')) + `
    <div class="calendar-header"><div><div class="small" style="margin-bottom:6px;">${esc(t('tracking'))}</div><select id="streak-select"></select></div>
    <span class="pill subtle">${esc(today.toLocaleString(LOCALES[lang], { month: 'long' }))} ${today.getFullYear()}</span></div>`);
  const sel = cal.querySelector('#streak-select');
  positives.forEach(x => {
    const o = document.createElement('option'); o.value = x.id; o.textContent = x.name; if (x.id === selectedStreakTaskId) o.selected = true; sel.appendChild(o);
  });
  sel.addEventListener('change', () => { selectedStreakTaskId = sel.value; renderAnalyticsTab(); });

  const names = document.createElement('div'); names.className = 'calendar';
  WEEKDAYS().forEach(d => { const e = document.createElement('div'); e.className = 'day-name'; e.textContent = d.slice(0, 3); names.appendChild(e); });
  cal.appendChild(names);

  const grid = document.createElement('div'); grid.className = 'calendar';
  const year = today.getFullYear(), month = today.getMonth();
  const firstWd = new Date(year, month, 1).getDay(), last = new Date(year, month + 1, 0).getDate();
  const todayIso = todayISO();
  const task = state.tasks.find(x => x.id === selectedStreakTaskId);
  const dates = new Set(state.completions.filter(x => x.taskId === selectedStreakTaskId).map(x => x.date));
  for (let i = 0; i < firstWd; i++) { const e = document.createElement('div'); e.className = 'day-cell off'; grid.appendChild(e); }
  for (let day = 1; day <= last; day++) {
    const d = new Date(year, month, day), iso = isoOf(d);
    let cls = 'day-cell';
    if (!isScheduled(task, d.getDay())) cls += ' off';
    else if (iso > todayIso) cls += ' future';
    else if (dates.has(iso)) cls += ' done';
    else cls += ' missed';
    if (iso === todayIso) cls += ' today';
    const e = document.createElement('div'); e.className = cls; e.textContent = day; grid.appendChild(e);
  }
  cal.appendChild(grid);
  cal.insertAdjacentHTML('beforeend', `<div class="streak-footer">
    <div><span class="small">${esc(t('cur_streak'))}</span><br/><strong>${current} ${esc(t('d_abbr'))}</strong></div>
    <div style="text-align:end;"><span class="small">${esc(t('best_streak'))}</span><br/><strong>${best} ${esc(t('d_abbr'))}</strong></div></div>`);
  c.appendChild(cal);
}

function renderRedeemTab() {
  const c = $('tab-redeem'); c.innerHTML = '';
  const b = getBalance();
  const netColor = b.net >= 0 ? 'var(--gold)' : 'var(--crimson)';

  // One big number, nothing to calculate
  const hero = mkCard(`<div class="points-hero">
      <div class="points-hero-label">${esc(t('your_points'))}</div>
      <div class="points-hero-value" style="color:${netColor};">${b.net}</div>
      <div class="points-stats">
        <span class="pill green">${esc(t('earned'))}: ${b.earned}</span>
        ${b.spent > 0 ? `<span class="pill gold">${esc(t('spent'))}: ${b.spent}</span>` : ''}
        ${b.debt > 0 ? `<span class="pill red">${esc(t('debt_lbl'))}: ${b.debt}</span>` : ''}
      </div>
      ${b.debt > 0 ? `<div class="debt-warn">${esc(t('debt_warn', { n: b.debt }))}</div>` : ''}
    </div>`);
  c.appendChild(hero);

  // Debt repayment — only shown when there IS debt
  if (b.debt > 0) {
    const pun = getPunishmentTasks();
    if (pun.length) {
      const card = mkCard(title('↺', 'purple', t('pay_debt')));
      pun.forEach(task => {
        const row = document.createElement('div'); row.className = 'row';
        row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title">${esc(task.name)}</div><div class="badges"><span class="pill violet">${esc(t('debt_cleared', { n: task.points }))}</span></div></div>
          <button class="btn small violet" type="button">${esc(t('btn_done'))}</button>`;
        row.querySelector('button').addEventListener('click', () => {
          if (getBalance().debt === 0) { alert(t('no_debt_to_pay')); return; }
          const iso = todayISO();
          state.completions.push({ id: uuid(), taskId: task.id, date: iso });
          state.redemptions.push({ id: uuid(), type: 'punishment', rewardId: '', taskId: task.id, name: task.name, cost: task.points, date: iso });
          saveState(); refreshAll();
        });
        card.appendChild(row);
      });
      c.appendChild(card);
    } else {
      const pc = mkCard(title('↺', 'purple', t('pay_debt')) + `<p class="small" style="margin-bottom:14px;">${esc(t('empty_pen_d'))}</p><button class="btn violet block" type="button">+ ${esc(t('add_penalty'))}</button>`);
      pc.querySelector('button').addEventListener('click', () => openQuickAdd(['penalty', 'reward']));
      c.appendChild(pc);
    }
  }

  // Rewards
  const list = mkCard(title('★', 'gold', t('rewards_title')));
  if (!state.rewards.length) list.appendChild(emptyInner('★', 'y', 'empty_rew_t', 'empty_rew_d', 'fab_reward', () => openQuickAdd(['reward', 'penalty'])));
  state.rewards.forEach(r => {
    const ok = b.net >= r.cost;
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title">${esc(r.name)}</div><div class="badges"><span class="pill gold">${r.cost} ${esc(t('pts'))}</span></div></div>
      <button class="btn small ${ok ? '' : 'ghost'}" type="button" ${ok ? '' : 'disabled'}>${esc(ok ? t('get') : t('not_enough'))}</button>`;
    row.querySelector('button').addEventListener('click', () => {
      if (netPoints() < r.cost) { alert(t('not_enough_alert')); return; }
      state.redemptions.push({ id: uuid(), type: 'reward', rewardId: r.id, taskId: '', name: r.name, cost: r.cost, date: todayISO() });
      saveState(); refreshAll();
    });
    list.appendChild(row);
  });
  c.appendChild(list);

  if (state.redemptions.length) {
    const hist = mkCard(title('↺', '', t('history')));
    state.redemptions.slice().reverse().forEach(r => {
      const isPun = r.type === 'punishment';
      const name = r.name || (isPun ? t('penalty_word') : t('reward_word'));
      const row = document.createElement('div'); row.className = 'row';
      row.innerHTML = `<div style="flex:1;min-width:0;"><div class="row-title" style="font-size:14px;">${esc(name)}</div>
        <div class="badges"><span class="pill ${isPun ? 'violet' : 'gold'}">${esc(isPun ? t('debt_cleared', { n: r.cost }) : '−' + r.cost + ' ' + t('pts'))}</span><span class="pill subtle">${esc(formatDateShort(r.date))}</span></div></div>
        <button class="btn small ghost" type="button" aria-label="${esc(t('btn_undo'))}">✕</button>`;
      row.querySelector('button').addEventListener('click', () => {
        const idx = state.redemptions.findIndex(x => x.id === r.id);
        if (idx < 0) return;
        if (isPun && r.taskId) {
          const ci = state.completions.findIndex(x => x.taskId === r.taskId && x.date === r.date);
          if (ci >= 0) state.completions.splice(ci, 1);
        }
        state.redemptions.splice(idx, 1);
        saveState(); refreshAll();
      });
      hist.appendChild(row);
    });
    c.appendChild(hist);
  }
}

/* =====================================================================
   Language month tab
   ===================================================================== */
const TRACK_COLORS = ['#22c55e', '#8b5cf6', '#c9a66b', '#38bdf8'];
let lmOffset = 0;      // months relative to the current one
let lmSelected = null; // selected ISO date

function ensureLang() {
  if (!state.lang) {
    state.lang = { title: '', tracks: [
      { id: 'tr-1', name: t('lm_def_a'), emoji: '🇸🇦' },
      { id: 'tr-2', name: t('lm_def_b'), emoji: '🇰🇷' }
    ], days: {} };
  }
  return state.lang;
}
function lmEntry(iso) {
  const l = ensureLang();
  return l.days[iso] || (l.days[iso] = { t: [], w: 0 });
}
function lmCleanup(iso) {
  const l = ensureLang(), d = l.days[iso];
  if (d && !d.t.length && !d.w) delete l.days[iso];
}
function lmToggle(iso, trId) {
  const d = lmEntry(iso), i = d.t.indexOf(trId);
  if (i >= 0) d.t.splice(i, 1); else d.t.push(trId);
  lmCleanup(iso); saveState(); renderMonthTab();
}
function lmStreak() {
  const l = ensureLang();
  const c = new Date(); c.setHours(0, 0, 0, 0);
  const has = (d) => { const x = l.days[isoOf(d)]; return !!(x && x.t.length); };
  if (!has(c)) c.setDate(c.getDate() - 1); // today not marked yet — don't break the streak
  let n = 0;
  while (has(c) && n < 3660) { n++; c.setDate(c.getDate() - 1); }
  return n;
}
function lmMonthWords(prefix, dim) {
  const l = ensureLang(); let w = 0;
  for (let d = 1; d <= dim; d++) { const x = l.days[prefix + pad(d)]; if (x) w += x.w || 0; }
  return w;
}

function renderMonthTab() {
  const c = $('tab-month'); c.innerHTML = '';
  const l = ensureLang();
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const todayIso = isoOf(now);
  if (lmOffset === 0 && !lmSelected) lmSelected = todayIso;
  const view = new Date(now.getFullYear(), now.getMonth() + lmOffset, 1);
  const year = view.getFullYear(), month = view.getMonth();
  const dim = new Date(year, month + 1, 0).getDate();
  const prefix = year + '-' + pad(month + 1) + '-';
  const monthName = view.toLocaleString(LOCALES[lang], { month: 'long' });
  const elapsed = lmOffset < 0 ? dim : (lmOffset === 0 ? now.getDate() : 0);

  const counts = Object.create(null);
  l.tracks.forEach(tr => { counts[tr.id] = 0; });
  let fullDays = 0;
  for (let d = 1; d <= dim; d++) {
    const x = l.days[prefix + pad(d)];
    if (!x) continue;
    x.t.forEach(id => { if (id in counts) counts[id]++; });
    if (d <= elapsed && l.tracks.every(tr => x.t.includes(tr.id))) fullDays++;
  }

  /* header + per-language counters */
  const head = mkCard(`
    <div class="lm-head">
      <div style="min-width:0;">
        <div class="lm-title">🌸 ${esc(l.title || t('lm_title'))}</div>
        <div class="small" style="margin-top:4px;">${esc(monthName)} ${year} · ${esc(t('lm_days_n', { n: dim }))}</div>
      </div>
      <div class="lm-nav">
        <button type="button" id="lm-prev" aria-label="${esc(t('lm_prev'))}"><span class="lm-arrow">←</span></button>
        <button type="button" id="lm-next" aria-label="${esc(t('lm_next'))}"><span class="lm-arrow">→</span></button>
      </div>
    </div>
    <div class="lm-tracks">${l.tracks.map((tr, i) => `
      <div class="lm-track">
        <div class="lm-track-name">${esc(tr.emoji)} ${esc(tr.name)}</div>
        <div class="lm-track-val" style="color:${TRACK_COLORS[i % 4]};">${counts[tr.id]}/${dim}</div>
        <div class="small">${esc(t('lm_days_done'))}</div>
      </div>`).join('')}</div>`);
  head.querySelector('#lm-prev').addEventListener('click', () => { lmOffset--; lmSelected = null; renderMonthTab(); });
  head.querySelector('#lm-next').addEventListener('click', () => { lmOffset++; lmSelected = null; renderMonthTab(); });
  c.appendChild(head);

  /* calendar */
  const legend = l.tracks.map((tr, i) => `<span><i style="background:${TRACK_COLORS[i % 4]}"></i>${esc(tr.name)}</span>`).join('') +
    `<span><i class="lm-all-dot"></i>${esc(t('lm_all'))}</span>`;
  const cal = mkCard(`${title('📅', 'gold', t('lm_calendar'))}
    <p class="small">${esc(t('lm_tap_hint'))}</p>
    <div class="lm-legend">${legend}</div>`);
  const grid = document.createElement('div'); grid.className = 'lm-grid';
  [1, 2, 3, 4, 5, 6, 0].forEach(wd => {
    const h = document.createElement('div'); h.className = 'day-name'; h.textContent = WEEKDAYS()[wd]; grid.appendChild(h);
  });
  const lead = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  for (let i = 0; i < lead; i++) { const e = document.createElement('div'); grid.appendChild(e); }
  for (let day = 1; day <= dim; day++) {
    const iso = prefix + pad(day);
    const x = l.days[iso];
    const done = x ? x.t : [];
    const all = done.length > 0 && l.tracks.every(tr => done.includes(tr.id));
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lm-cell' + (all ? ' all' : '') + (iso === todayIso ? ' today' : '') + (iso === lmSelected ? ' sel' : '');
    b.disabled = iso > todayIso;
    b.innerHTML = `<span>${day}</span><span class="lm-dots">${l.tracks.map((tr, i) => done.includes(tr.id) ? `<i style="background:${TRACK_COLORS[i % 4]}"></i>` : '').join('')}</span>`;
    b.addEventListener('click', () => { lmSelected = iso; renderMonthTab(); });
    grid.appendChild(b);
  }
  cal.appendChild(grid);
  c.appendChild(cal);

  /* selected day */
  if (lmSelected && lmSelected.startsWith(prefix)) {
    const d = l.days[lmSelected] || { t: [], w: 0 };
    const det = mkCard(`${title('✎', 'gold', t('lm_selected') + ': ' + formatDateShort(lmSelected))}
      <div class="lm-chips"></div>
      <div class="field" style="margin-bottom:0;"><label for="lm-words">${esc(t('lm_words'))}</label>
        <input id="lm-words" type="number" inputmode="numeric" min="0" max="100000" placeholder="0" /></div>`);
    const chips = det.querySelector('.lm-chips');
    l.tracks.forEach((tr, i) => {
      const on = d.t.includes(tr.id);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'lm-chip' + (on ? ' on' : '');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.innerHTML = `<span><i class="lm-chip-dot" style="background:${TRACK_COLORS[i % 4]}"></i> ${esc(tr.emoji)} ${esc(tr.name)}</span><span>${on ? '✓' : ''}</span>`;
      b.addEventListener('click', () => lmToggle(lmSelected, tr.id));
      chips.appendChild(b);
    });
    const wi = det.querySelector('#lm-words');
    wi.value = d.w ? d.w : '';
    const iso = lmSelected;
    wi.addEventListener('input', () => {
      const w = cleanInt(wi.value, 0, 100000, 0);
      lmEntry(iso).w = w; lmCleanup(iso); saveState();
      const tot = document.getElementById('lm-words-total');
      if (tot) tot.textContent = lmMonthWords(prefix, dim);
    });
    c.appendChild(det);
  }

  /* streak */
  const st = lmStreak();
  c.appendChild(mkCard(`${title('🔥', 'gold', t('lm_streak'))}
    <div class="lm-streak">${st > 0 ? `<strong>${st}</strong>${esc(t('lm_streak_msg', { n: st }))}` : esc(t('lm_streak_zero'))}</div>`));

  /* month summary */
  const pct = elapsed ? Math.round((fullDays / elapsed) * 100) : 0;
  const pctColor = pct >= 80 ? 'var(--emerald)' : pct >= 50 ? 'var(--gold)' : 'var(--crimson)';
  c.appendChild(mkCard(`${title('↗', 'gold', t('lm_summary'))}<div class="analytics-grid">
    ${l.tracks.map((tr, i) => `<div class="analytics-card"><div class="analytics-label">${esc(tr.emoji)} ${esc(tr.name)}</div>
      <div class="analytics-value" style="color:${TRACK_COLORS[i % 4]};">${counts[tr.id]}</div><div class="analytics-sublabel">${esc(t('sub_days'))}</div></div>`).join('')}
    <div class="analytics-card"><div class="analytics-label">${esc(t('lm_total_words'))}</div>
      <div class="analytics-value" id="lm-words-total" style="color:var(--gold);">${lmMonthWords(prefix, dim)}</div></div>
    <div class="analytics-card"><div class="analytics-label">${esc(t('lm_plan'))}</div>
      <div class="analytics-value" style="color:${pctColor};">${pct}%</div><div class="analytics-sublabel">${esc(t('sub_days'))}: ${fullDays}</div></div>
  </div>`));
}

/* =====================================================================
   Empty states, quick add, floating action button
   ===================================================================== */
let currentTab = 'tasks';
const FAB_MAP = {
  tasks:  { kinds: ['task'], label: 'fab_task' },
  goals:  { kinds: ['goal'], label: 'fab_goal' },
  anti:   { kinds: ['enemy'], label: 'fab_enemy' },
  redeem: { kinds: ['reward', 'penalty'], label: 'fab_reward' }
};
function updateFab() {
  const f = FAB_MAP[currentTab], fab = $('fab');
  if (!fab) return;
  if (!f) { fab.hidden = true; return; }
  fab.hidden = false;
  $('fab-label').textContent = t(f.label);
}
function emptyInner(icon, cls, tKey, dKey, bKey, onClick) {
  const d = document.createElement('div');
  d.className = 'empty';
  d.innerHTML = `<div class="empty-ico ${cls}" aria-hidden="true">${icon}</div><h3>${esc(t(tKey))}</h3><p>${esc(t(dKey))}</p><button class="btn" type="button">+ ${esc(t(bKey))}</button>`;
  d.querySelector('button').addEventListener('click', onClick);
  return d;
}
function emptyCard(icon, cls, tKey, dKey, bKey, onClick) {
  const c = mkCard('');
  c.appendChild(emptyInner(icon, cls, tKey, dKey, bKey, onClick));
  return c;
}

const QA = {
  task:    { label: 'add_task',    nameLbl: 'name',      ptsLbl: 'points',      ph: 'ph_task',    def: 5,  max: 100000,  tab: 'tasks' },
  goal:    { label: 'add_goal',    nameLbl: 'goal_name', ptsLbl: 'goal_points', ph: 'ph_goal',    def: 50, max: 100000,  tab: 'goals' },
  enemy:   { label: 'add_enemy',   nameLbl: 'name',      ptsLbl: 'debt_points', ph: 'ph_enemy',   def: 5,  max: 100000,  tab: 'anti' },
  reward:  { label: 'add_reward',  nameLbl: 'name',      ptsLbl: 'cost',        ph: 'ph_reward',  def: 20, max: 1000000, tab: 'redeem', seg: 'reward_word' },
  penalty: { label: 'add_penalty', nameLbl: 'name',      ptsLbl: 'debt_reduce', ph: 'ph_penalty', def: 5,  max: 100000,  tab: 'redeem', seg: 'penalty_word' }
};
const SUGGEST = [['sg_sport', 10], ['sg_read', 5], ['sg_water', 3], ['sg_meditate', 5], ['sg_lang', 5], ['sg_sleep', 5]];

function openQuickAdd(kinds) {
  const body = $('quick-body');
  let kind = kinds[0], draftName = '', draftPts = null;
  const picked = new Set([0, 1, 2, 3, 4, 5, 6]);
  let nameEl = null, ptsEl = null;

  function render() {
    const q = QA[kind];
    $('quick-title').textContent = t(q.label);
    body.innerHTML = '';

    if (kinds.length > 1) {
      const seg = document.createElement('div'); seg.className = 'seg';
      kinds.forEach(k => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = k === kind ? 'on' : ''; b.textContent = t(QA[k].seg);
        b.addEventListener('click', () => { draftName = nameEl ? nameEl.value : ''; draftPts = null; kind = k; render(); });
        seg.appendChild(b);
      });
      body.appendChild(seg);
    }

    let sugg = null;
    if (kind === 'task') {
      sugg = document.createElement('div'); sugg.className = 'sugg';
      body.appendChild(sugg);
    }

    const form = document.createElement('div');
    form.innerHTML = `
      <div class="field"><label for="qa-name">${esc(t(q.nameLbl))}</label>
        <input id="qa-name" maxlength="100" autocomplete="off" enterkeyhint="done" placeholder="${esc(t(q.ph))}" /></div>
      <div class="field"><label for="qa-pts">${esc(t(q.ptsLbl))}</label>
        <div class="stepper"><button type="button" data-d="-1" aria-label="−">−</button>
          <input id="qa-pts" type="number" inputmode="numeric" min="1" max="${q.max}" />
          <button type="button" data-d="1" aria-label="+">+</button></div></div>
      ${kind === 'task' ? `<div class="field"><label>${esc(t('weekdays'))}</label><div class="weekday-chips" id="qa-days"></div></div>` : ''}
      <button class="btn block" id="qa-submit" type="button" style="min-height:54px;font-size:16px;">${esc(t('add'))}</button>`;
    body.appendChild(form);

    nameEl = form.querySelector('#qa-name'); ptsEl = form.querySelector('#qa-pts');
    nameEl.value = draftName; ptsEl.value = draftPts !== null ? draftPts : q.def;

    if (sugg) SUGGEST.forEach(([key, pts]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = t(key);
      b.addEventListener('click', () => { nameEl.value = t(key); ptsEl.value = pts; nameEl.focus(); });
      sugg.appendChild(b);
    });

    form.querySelectorAll('.stepper button').forEach(btn => btn.addEventListener('click', () => {
      const cur = cleanInt(ptsEl.value, 0, q.max, 0), step = cur >= 100 ? 10 : (cur >= 20 ? 5 : 1);
      ptsEl.value = Math.min(q.max, Math.max(1, cur + (btn.dataset.d === '1' ? step : -step)));
    }));

    if (kind === 'task') {
      const wrap = form.querySelector('#qa-days');
      WEEKDAYS().forEach((lbl, i) => {
        const sp = document.createElement('span');
        sp.className = 'weekday' + (picked.has(i) ? ' selected' : ''); sp.textContent = lbl;
        sp.addEventListener('click', () => { picked.has(i) ? picked.delete(i) : picked.add(i); sp.classList.toggle('selected'); });
        wrap.appendChild(sp);
      });
    }

    const submit = () => {
      const name = nameEl.value.trim().slice(0, 100);
      const pts = cleanInt(ptsEl.value, 0, q.max, 0);
      if (!name || !pts) { toast(t('need_np')); (name ? ptsEl : nameEl).focus(); return; }
      if (kind === 'task') state.tasks.push({ id: uuid(), name, type: 'positive', points: pts, daysOfWeek: (picked.size === 7 || picked.size === 0) ? [] : Array.from(picked) });
      else if (kind === 'goal') state.goals.push({ id: uuid(), name, points: pts });
      else if (kind === 'enemy') state.tasks.push({ id: uuid(), name, type: 'anti', points: pts, daysOfWeek: [] });
      else if (kind === 'reward') state.rewards.push({ id: uuid(), name, cost: pts });
      else state.tasks.push({ id: uuid(), name, type: 'punishment', points: pts, daysOfWeek: [] });
      saveState();
      $('quick-modal').classList.remove('active');
      switchTab(q.tab);
      refreshAll();
      toast('✓ ' + t('added'));
    };
    form.querySelector('#qa-submit').addEventListener('click', submit);
    nameEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
  }

  render();
  $('quick-modal').classList.add('active');
  setTimeout(() => { if (nameEl) nameEl.focus(); }, 280);
}

function showHint(name) {
  const el = $('tab-hint'); if (!el) return;
  let seen = false; try { seen = localStorage.getItem('kyro_hint_' + name) === '1'; } catch (e) {}
  if (seen) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `<span class="hint-ico" aria-hidden="true">💡</span><p>${esc(t('hint_' + name))}</p><button type="button">${esc(t('hint_ok'))}</button>`;
  el.querySelector('button').addEventListener('click', () => { try { localStorage.setItem('kyro_hint_' + name, '1'); } catch (e) {} el.hidden = true; });
}
function switchTab(name) {
  currentTab = name;
  document.querySelectorAll('.nav-tab').forEach(x => {
    const on = x.dataset.tab === name;
    x.classList.toggle('active', on);
    x.setAttribute('aria-current', on ? 'page' : 'false');
  });
  ['tasks', 'goals', 'anti', 'analytics', 'month', 'redeem'].forEach(id => { $('tab-' + id).style.display = (id === name) ? '' : 'none'; });
  updateFab(); showHint(name);
  window.scrollTo({ top: 0 });
}

function setupQuick() {
  $('fab').addEventListener('click', () => { const f = FAB_MAP[currentTab]; if (f) openQuickAdd(f.kinds); });
  $('quick-close').addEventListener('click', () => $('quick-modal').classList.remove('active'));
  $('quick-modal').addEventListener('click', e => { if (e.target.id === 'quick-modal') $('quick-modal').classList.remove('active'); });
  $('lang-close').addEventListener('click', () => $('lang-modal').classList.remove('active'));
  $('lang-modal').addEventListener('click', e => { if (e.target.id === 'lang-modal') $('lang-modal').classList.remove('active'); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = document.querySelectorAll('.modal-overlay.active');
    if (open.length) open[open.length - 1].classList.remove('active');
  });
}

/* Android "Back" button / browser Back closes the open sheet instead of leaving the app */
let ovlDepth = 0, ignorePop = false, popClosing = false;
function trackOverlays() {
  const mo = new MutationObserver(muts => muts.forEach(m => {
    const el = m.target;
    const was = (m.oldValue || '').split(/\s+/).includes('active'), now = el.classList.contains('active');
    if (!was && now) { try { history.pushState({ ovl: 1 }, ''); ovlDepth++; } catch (e) {} }
    else if (was && !now) {
      if (popClosing) { popClosing = false; }
      else if (ovlDepth > 0) { ovlDepth--; ignorePop = true; try { history.back(); } catch (e) { ignorePop = false; } }
    }
  }));
  document.querySelectorAll('.modal-overlay').forEach(el => mo.observe(el, { attributes: true, attributeFilter: ['class'], attributeOldValue: true }));
  window.addEventListener('popstate', () => {
    if (ignorePop) { ignorePop = false; return; }
    const open = document.querySelectorAll('.modal-overlay.active');
    if (open.length) { popClosing = true; ovlDepth = Math.max(0, ovlDepth - 1); open[open.length - 1].classList.remove('active'); }
  });
}

/* =====================================================================
   Wiring
   ===================================================================== */
function setupTabs() {
  document.querySelectorAll('.nav-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
}
function setupModal() {
  const modal = $('settings-modal');
  $('settings-btn').addEventListener('click', () => { modal.classList.add('active'); renderSettings(); });
  $('modal-close').addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
  $('lock-btn').addEventListener('click', lockApp);
}
function refreshAll() {
  renderTasksTab(); renderGoalsTab(); renderAntiTab(); renderAnalyticsTab(); renderMonthTab(); renderRedeemTab();
}
function initApp() {
  try {
    loadState();
    sanitizeData();
    setupTabs(); setupModal(); setupReflectionModal(); setupInstallBanner();
    const pos = getPositiveTasks();
    if (pos.length) selectedStreakTaskId = pos[0].id;
    refreshAll();
    setupQuick(); trackOverlays(); switchTab('tasks');
    const addParam = new URLSearchParams(location.search).get('add');
    if (addParam && QA[addParam]) setTimeout(() => openQuickAdd([addParam]), 400);
    else if (!getPositiveTasks().length && !store.get('kyro_first_offer') && !shouldShowReflection()) {
      store.set('kyro_first_offer', '1');
      setTimeout(() => openQuickAdd(['task']), 700);   // first run: offer to create the first task right away
    }
    setTimeout(() => { if (shouldShowReflection()) showReflectionModal(); }, 1000);
    scheduleNotificationCheck();
  } catch (e) { console.error('Init error:', e); }
}

/* ---------- boot ---------- */
applyI18n();
setupPin();
setupOnboarding();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed:', err));
  });
}
})();
