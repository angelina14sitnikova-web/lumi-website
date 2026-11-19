(function () {
  'use strict';

  const title = 'Луми и Повелитель времени';
  const intro = 'Главные часы остановились, а семь волшебных шестерёнок исчезли! Помоги Луми пройти испытания, восстановить механизм и вернуть времени его волшебную силу.';
  const journey = 'В Башне времени перепутались прошлое, настоящее и будущее. За каждое испытание ты получишь золотую шестерёнку. Когда соберёшь все семь, установи их на места и запусти часы!';
  const finale = 'Все семь шестерёнок снова на своих местах! Главные часы заработали, и волшебное королевство ожило. Ты настоящий Хранитель времени!';
  const feedback = {
    tryAgain: 'Попробуй ещё раз!',
    listen: 'Послушай внимательно.',
    chooseWord: 'Подумай, какое слово подходит.',
    together: 'Давай попробуем вместе!',
    correct: 'Правильно!',
    gear: 'Ты нашёл золотую шестерёнку!',
    assemble: 'Подбери посадочное место к каждой шестерёнке. Нажми на деталь и на её место или перетащи её.',
    placed: 'Шестерёнка встала на место!',
    misplaced: 'Эта деталь подходит к другому месту. Посмотри на форму.',
    ready: 'Все семь деталей на своих местах! Запусти часы.',
  };
  const positions = ['Начало слова', 'Середина слова', 'Конец слова'];
  const portals = [['Вчера', 'Сегодня', 'Завтра'], ['Уже было', 'Происходит сейчас', 'Будет потом']];
  const phonemes = {А:'a', О:'o', У:'u', И:'i', Ы:'y', М:'m', С:'s', Л:'l', Т:'t', К:'k', Р:'r', Н:'n'};

  const at = (art, word, phoneme, answer) => ({art, word, phoneme, answer});
  const build = (art, word, answer, extras) => ({art, word, answer: answer.split(' '), extras: extras.split(' ')});
  const fill = (art, word, pattern, choices, answer) => ({art, word, pattern, choices: choices.split(' '), answer});
  const tense = (art, sentence, answer) => ({art, sentence, answer});
  const twins = (art, context, choices, answer, explanation) => ({art, context, choices, answer, explanation});

  function permutations(items) {
    if (!items.length) return [[]];
    return items.flatMap((item, index) =>
      permutations(items.filter((_, other) => other !== index)).map(rest => [item, ...rest]));
  }

  function words(art, scrambled, blocks) {
    return {
      art, scrambled: scrambled.split(' '),
      answers: permutations(blocks).map(order => order.join(' ')),
    };
  }

  const story = {
    title: 'Маленькие часы',
    captions: [
      'Луми находит на столе старые остановившиеся часы.',
      'Луми открывает крышку часов и замечает пустое место для шестерёнки.',
      'Луми ищет деталь и находит её под столом.',
      'Луми устанавливает шестерёнку внутрь механизма.',
      'Часы снова работают, а Луми радуется.',
    ],
    tell: 'Теперь расскажи историю своими словами. Используй слова «сначала», «затем», «после этого», «наконец».',
    prompts: [
      'Кого ты видишь на картинках?', 'Что сначала обнаружил Луми?', 'Почему часы не работали?',
      'Как Луми нашёл нужную деталь?', 'Что он сделал потом?', 'Чем закончилась история?',
    ],
    example: 'Однажды Луми нашёл старые часы и заметил, что они остановились. Он открыл крышку и увидел, что в механизме не хватает шестерёнки. Луми поискал деталь и нашёл её под столом. Затем он установил шестерёнку на место, и часы снова заработали. Луми очень обрадовался.',
  };

  const tasks = [
    {
      id:'position', title:'Звуковой механизм',
      instruction:'Послушай слово и звук. Выбери, где в слове слышится этот звук.',
      hint:'Произнеси слово медленно и прислушайся, где находится нужный звук.',
      rounds:[
        at('juice','Сок','s',0), at('wasp','Оса','s',1), at('nose','Нос','s',2),
        at('poppy','Мак','m',0), at('lamp','Лампа','m',1), at('house','Дом','m',2),
      ],
    },
    {
      id:'cipher', title:'Часовой шифр',
      instruction:'Послушай слово. Соедини слоги по порядку и нажми «Проверить».',
      hint:'Произнеси слово по слогам. Какой слог слышится первым? Какой идёт за ним?',
      rounds:[
        build('clock','Часы','ЧА СЫ','КА МА'), build('moon','Луна','ЛУ НА','ЛА РА'),
        build('fish','Рыба','РЫ БА','БО МА'), build('car','Машина','МА ШИ НА','ЛИ РА'),
        build('cow','Корова','КО РО ВА','РА ЛО'), build('rocket','Ракета','РА КЕ ТА','КА ТО'),
      ],
    },
    {
      id:'letter', title:'Потерянная буква',
      instruction:'Послушай слово. Выбери букву, которой не хватает, и нажми «Проверить».',
      hint:'Скажи слово медленно. Прислушайся, какой звук слышится на месте пустой клеточки.',
      rounds:[
        fill('cat','Кот','К_Т','О А У И','О'), fill('house','Дом','Д_М','А О И У','О'),
        fill('onion','Лук','_УК','М С Л Т','Л'), fill('poppy','Мак','МА_','Т К С Р','К'),
        fill('fish','Рыба','Р_БА','И У Ы О','Ы'), fill('moon','Луна','ЛУ_А','М Р Т Н','Н'),
      ],
    },
    {
      id:'tense', title:'Машина времени',
      instruction:'Послушай предложение и выбери, когда это произошло. Затем нажми «Проверить».',
      hint:'Прислушайся к словам о времени и к тому, как звучит действие. Оно уже было, происходит сейчас или будет потом?',
      rounds:[
        tense('past-plant','Зайчик вчера посадил цветок.',0),
        tense('now-paint','Белочка сегодня рисует картину.',1),
        tense('future-trip','Луми завтра отправится в путешествие.',2),
        tense('past-house','Вчера котёнок построил домик.',0),
        tense('now-book','Сегодня медвежонок читает книгу.',1),
        tense('future-pie','Завтра лисёнок приготовит пирог.',2),
        tense('past-toys','Луми уже собрал игрушки.',0),
        tense('future-paint','Белочка нарисует картину.',2),
      ],
    },
    {
      id:'twins', title:'Слова-близнецы',
      instruction:'Послушай словосочетание. Выбери слово, близкое по смыслу, и нажми «Проверить».',
      hint:'Подставь каждое слово в словосочетание. В каком случае получится похожий смысл?',
      rounds:[
        twins('brave','Смелый рыцарь',['Храбрый','Грустный','Медленный'],0,'Смелый и храбрый — это слова, близкие по значению.'),
        twins('lovely','Красивый дворец',['Старый','Прекрасный','Тёмный'],1,'О дворце можно сказать «красивый» или «прекрасный». Эти слова близки по смыслу.'),
        twins('joyful','Весёлый праздник',['Тихий','Долгий','Радостный'],2,'Весёлый и радостный — слова, близкие по смыслу в этом примере.'),
        twins('large','Большой замок',['Огромный','Маленький','Высокий'],0,'Большой и огромный — близкие слова. Огромный значит очень большой.'),
        twins('swift','Быстро бежать',['Медленно','Стремительно','Осторожно'],1,'Быстро и стремительно — близкие слова. Стремительно значит очень быстро.'),
      ],
    },
    {
      id:'sentence', title:'Перепутанное послание',
      instruction:'Посмотри на картинку и послушай слова. Составь из них предложение и нажми «Проверить».',
      hint:'Найди, кто что делает. Прочитай или произнеси вслух всё предложение.',
      rounds:[
        words('sleep','спит котёнок',['котёнок','спит']),
        words('eats','морковку зайчик ест',['зайчик','ест','морковку']),
        words('paints','картину белочка рисует',['белочка','рисует','картину']),
        words('flies','летит бабочка цветком над',['бабочка','летит','над цветком']),
        words('reads','книгу читает Луми интересную',['Луми','читает','интересную','книгу']),
      ],
    },
    {
      id:'story', title:'Хранитель историй',
      instruction:'Разложи пять картинок по порядку. Нажимай на них или перетаскивай в ячейки.',
      hint:'Поищи картинку, где Луми впервые видит часы. Что нужно было сделать до того, как часы заработали?',
    },
  ];

  function sentenceText(raw) {
    return raw.charAt(0).toUpperCase() + raw.slice(1) + '.';
  }

  function collectSpeech() {
    const lines = new Set([intro, journey, finale, ...Object.values(feedback), ...positions, ...portals.flat(),
      story.title, story.tell, story.example, ...story.captions, ...story.prompts]);
    for (const task of tasks) {
      lines.add(task.instruction);
      lines.add(task.hint);
      for (const round of task.rounds ?? []) {
        for (const line of [round.word, round.sentence, round.context, round.explanation]) {
          if (line) lines.add(line);
        }
        if (task.id === 'cipher') [...round.answer, ...round.extras].forEach(line => lines.add(line));
        if (task.id === 'twins') round.choices.forEach(line => lines.add(line));
        if (task.id === 'sentence') {
          round.scrambled.forEach(line => lines.add(line.charAt(0).toUpperCase() + line.slice(1)));
          round.answers.forEach(line => lines.add(sentenceText(line)));
        }
      }
    }
    return [...lines];
  }

  window.TimeContent = Object.freeze({
    id:'time-keeper-6-7', title, intro, journey, finale, tasks, story, feedback, positions, portals, phonemes,
    sentenceText, collectSpeech,
  });
})();
