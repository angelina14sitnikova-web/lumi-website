(function () {
  'use strict';

  const pictures = {
    snowman: 'Снеговик', owl: 'Сова', fox: 'Лиса', fir: 'Ёлка',
    skis: 'Лыжи', moon: 'Луна', hat: 'Шапка', hare: 'Заяц',
    carrot: 'Морковь', bridge: 'Мост', bucket: 'Ведро', sled: 'Санки',
    scarf: 'Шарф', snow: 'Снег', house: 'Дом', cat: 'Кот',
    skates: 'Коньки', mittens: 'Варежки', lantern: 'Фонарь', ice: 'Лёд',
    winter: 'Зима', snowflake: 'Снежинка', mitten: 'Рукавичка',
    'red-mitten': 'Варежка', 'fluffy-snow': 'Снег', 'blue-bucket': 'Ведро',
    boots: 'Сапоги', 'tall-fir': 'Ёлка', rain: 'Дождь', sand: 'Песок',
    leaves: 'Листопад', icicle: 'Сосулька', branch: 'Ветка', candle: 'Свечка',
    socks: 'Носки', bear: 'Медведь', bike: 'Велосипед', car: 'Машина',
    star: 'Звезда', flower: 'Цветок', butterfly: 'Бабочка',
  };

  const firstSound = (sound, phoneme, options, answers) => ({ sound, phoneme, options, answers });
  const syllables = (picture, answer) => ({ picture, answer });
  const speech = (picture, question, options, answer) => ({ picture, question, options, answer });
  const riddle = (question, options) => ({ question, options, answer: options[0] });

  const intro = 'Волшебная снежинка рассыпалась на семь ледяных осколков. Помоги Луми найти их и вернуть свет Снежному королевству!';
  const journey = 'Вместе мы пройдём через заснеженный лес, замёрзшую реку, ледяную пещеру и снежную деревню. За каждое выполненное задание ты получишь один ледяной осколок.';
  const finish = 'Все ледяные осколки собраны! Благодаря тебе волшебная снежинка снова сияет. Ты замечательно справился со всеми заданиями!';
  const story = {
    instruction: 'Разложи картинки по порядку. Можно перетащить картинку или нажать на неё.',
    tell: 'А теперь расскажи эту историю своими словами. Посмотри на картинки, они помогут тебе.',
    hint: 'Вспомни, что зайчик увидел в самом начале. Что должно произойти до того, как он украсит снеговика?',
    prompts: [
      'Что произошло сначала?', 'Что зайчик сделал потом?',
      'Что произошло дальше?', 'Чем закончилась история?',
    ],
    captions: [
      'Зайчик выходит из домика и видит первый снег.',
      'Зайчик катает большие снежные комья.',
      'Зайчик складывает комья друг на друга и лепит снеговика.',
      'Зайчик украшает снеговика морковкой, шарфом и шапкой.',
    ],
    example: 'Однажды зайчик вышел из домика и увидел снег. Он скатал большие снежные комья и слепил снеговика. Затем зайчик надел на снеговика шапку и шарф и сделал ему нос из морковки. Получился красивый снеговик.',
  };

  const tasks = [
    {
      id: 'sounds', type: 'multiple', title: 'Найди первый звук',
      instruction: 'Послушай звук. Выбери все картинки, названия которых начинаются с этого звука, и нажми «Проверить».',
      hint: 'Послушай название картинки. Произнеси его медленно и прислушайся к самому началу слова.',
      rounds: [
        firstSound('с', 's', ['snowman', 'owl', 'fox', 'fir'], ['snowman', 'owl']),
        firstSound('л', 'l', ['skis', 'moon', 'hat', 'hare'], ['skis', 'moon']),
        firstSound('м', 'm', ['carrot', 'bridge', 'bucket', 'sled'], ['carrot', 'bridge']),
        firstSound('ш', 'sh', ['hat', 'scarf', 'snow', 'house'], ['hat', 'scarf']),
        firstSound('к', 'k', ['cat', 'skates', 'mittens', 'lantern'], ['cat', 'skates']),
      ],
    },
    {
      id: 'syllables', type: 'syllables', title: 'Слоговые льдинки',
      instruction: 'Послушай слово. Выбери льдинку, на которой столько точек, сколько слогов в слове.',
      hint: 'Скажи слово медленно и прохлопай каждый слог. Посчитай, сколько хлопков получилось.',
      rounds: [
        syllables('ice', 1), syllables('winter', 2), syllables('snowflake', 3),
        syllables('mitten', 4), syllables('skates', 2), syllables('snowman', 3),
      ],
    },
    {
      id: 'mittens', type: 'speech', title: 'Волшебные варежки',
      instruction: 'Рассмотри картинку. Послушай три варианта, выбери тот, который звучит правильно, и нажми «Проверить».',
      hint: 'Скажи сначала название предмета, а потом опиши, какой он. Произнеси оба слова вместе.',
      rounds: [
        speech('red-mitten', '', ['Красный варежка', 'Красная варежка', 'Красное варежка'], 1),
        speech('fluffy-snow', '', ['Пушистая снег', 'Пушистое снег', 'Пушистый снег'], 2),
        speech('blue-bucket', '', ['Синее ведро', 'Синий ведро', 'Синяя ведро'], 0),
        speech('boots', '', ['Тёплая сапоги', 'Тёплые сапоги', 'Тёплое сапоги'], 1),
        speech('tall-fir', '', ['Высокое ёлка', 'Высокий ёлка', 'Высокая ёлка'], 2),
      ],
    },
    {
      id: 'riddles', type: 'picture', title: 'Загадки ледяной пещеры',
      instruction: 'Послушай загадку и выбери картинку-отгадку.',
      hint: 'Послушай загадку ещё раз. Подумай, какой предмет подходит сразу ко всем подсказкам.',
      rounds: [
        riddle('С неба падает, землю укрывает, белый и холодный, в тепле тает.', ['snow', 'rain', 'sand', 'leaves']),
        riddle('Под крышей выросла прозрачная ледяная палочка. На солнышке она капает и становится короче.', ['icicle', 'branch', 'candle', 'carrot']),
        riddle('Две сестрички согревают руки на морозе. У каждой есть отдельный домик для большого пальца.', ['mittens', 'socks', 'scarf', 'boots']),
        riddle('Из снежных комьев сделан, с морковкой вместо носа. Стоит во дворе и не боится мороза.', ['snowman', 'bear', 'fir', 'hare']),
        riddle('С горки быстро мчатся. У них есть полозья, но нет колёс.', ['sled', 'bike', 'car', 'skates']),
        riddle('Маленькая ледяная звёздочка с узорами. Падает с неба, а на тёплой ладошке тает.', ['snowflake', 'star', 'flower', 'butterfly']),
      ],
    },
    {
      id: 'places', type: 'speech', title: 'Кто где спрятался?',
      instruction: 'Рассмотри сцену и послушай вопрос. Затем послушай варианты, выбери ответ и нажми «Проверить».',
      hint: 'Найди глазами животное и предмет рядом с ним. Покажи пальчиком, где находится животное.',
      rounds: [
        speech('place-hare', 'Где спрятался зайчик?', ['Перед ёлкой', 'За ёлкой', 'Под ёлкой'], 1),
        speech('place-fox', 'Где находится лисёнок?', ['Под скамейкой', 'На скамейке', 'Перед скамейкой'], 0),
        speech('place-owl', 'Где летит сова?', ['Около домика', 'За домиком', 'Над домиком'], 2),
        speech('place-squirrel', 'Где сидит белочка?', ['Между ёлками', 'Перед ёлками', 'На ёлке'], 0),
        speech('place-fawn', 'Где стоит оленёнок?', ['За снеговиком', 'Около снеговика', 'На снеговике'], 1),
        speech('place-wolf', 'Где сидит волчонок?', ['За домиком', 'В домике', 'Перед домиком'], 2),
      ],
    },
    {
      id: 'spells', type: 'speech', title: 'Исправь заклинание',
      instruction: 'Снежный ветер перепутал слова. Послушай три заклинания, выбери то, которое звучит правильно, и нажми «Проверить».',
      hint: 'Посмотри, кто на картинке и что он делает. Произнеси это сам, а потом ещё раз послушай варианты.',
      rounds: [
        speech('spell-snowman', '', ['Снеговик стоят во дворе', 'Снеговик стоит во дворе', 'Снеговик стоять во дворе'], 1),
        speech('spell-squirrel', '', ['Белочка прыгают по веткам', 'Белочка прыгать по веткам', 'Белочка прыгает по веткам'], 2),
        speech('spell-snow', '', ['Снежинки падают с неба', 'Снежинки падает с неба', 'Снежинки падать с неба'], 0),
        speech('spell-hare', '', ['Зайчик нашла морковку', 'Зайчик нашёл морковку', 'Зайчик нашли морковку'], 1),
        speech('spell-children', '', ['Дети лепит снеговика', 'Дети лепить снеговика', 'Дети лепят снеговика'], 2),
      ],
    },
    { id: 'story', type: 'story', title: 'Снежная история', instruction: story.instruction, hint: story.hint },
  ];

  const feedback = {
    retry: 'Попробуй ещё раз!',
    listen: 'Послушай внимательнее.',
    encourage: 'У тебя обязательно получится!',
    correct: 'Правильно!',
    fragment: 'Ты нашёл ледяной осколок!',
    all: 'Все семь ледяных осколков собраны!',
  };

  const collectSpeech = () => {
    const lines = new Set([intro, journey, finish, ...Object.values(feedback), ...Object.values(pictures),
      story.instruction, story.tell, story.hint, ...story.prompts, ...story.captions, story.example]);
    for (const task of tasks) {
      lines.add(task.instruction);
      lines.add(task.hint);
      for (const round of task.rounds || []) {
        if (round.question) lines.add(round.question);
        if (task.type === 'speech') round.options.forEach(line => lines.add(line));
      }
    }
    return [...lines];
  };

  window.SnowContent = Object.freeze({
    id: 'snow-kingdom-5-6', title: 'Луми и Тайна Снежного королевства',
    intro, journey, finish, pictures, tasks, story, feedback, collectSpeech,
  });
})();
