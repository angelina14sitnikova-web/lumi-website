const scene = (text, sounds, objects, action) => ({ text, sounds, objects, action });
const task = (name, kind, instruction, rounds) => ({ name, kind, instruction, rounds });
const choose = (sound, options, answer = sound) => ({ sounds: [sound], options, answer });
const sequence = (sounds, options, answer = sounds) => ({ sounds, options, answer });
const match = (sounds, options = sounds) => ({ sounds, options, answer: sounds });
const sort = (sounds, options, answer) => ({ sounds, options, answer });
const level = (sound, gain) => ({ sound, gain });
const quiet = sound => level(sound, 0.34);
const louder = sound => level(sound, 0.74);
const volume = (sound, gains, answer) => ({
  sounds: gains.map(gain => level(sound, gain)),
  options: ['first', 'second'],
  answer,
});

export const forest = {
  id: 'literacy-1',
  location: 'Лес поющих звуков',
  introduction: 'Лес потерял свои звуки. Помоги Луми найти пять волшебных колокольчиков и вернуть лесу его голоса.',
  reward: 'Медаль внимательного слушателя',
  lessons: {
    'literacy-lesson-1-1': {
      goal: 'Замечать появление и прекращение звука.',
      scenes: [
        scene('Луми прислушивается на лесной полянке. После паузы звенит колокольчик.', ['silence', 'bell'], ['bell'], 'listen'),
        scene('Луми слушает ручей. Когда журчание стихает, он прикладывает лапку к ушку.', ['stream', 'silence'], ['stream'], 'listen-after'),
        scene('Луми по очереди включает и выключает звучащие предметы.', ['drum', 'silence', 'rattle', 'silence'], ['drum', 'rattle'], 'switch'),
      ],
      practice: [
        task('Проснувшийся колокольчик', 'detect', 'Нажми на колокольчик, когда услышишь звон.', [
          { sounds: ['silence', 'bell'], options: ['bell'], answer: 'bell', audibleIndex: 1 },
        ]),
        task('Звук или тишина', 'choice', 'Послушай. Был звук или было тихо?', [
          choose('bell', ['audible', 'quiet'], 'audible'), choose('silence', ['audible', 'quiet'], 'quiet'),
        ]),
        task('Замри, Луми', 'move-stop', 'Когда играет музыка, включи движение. Когда музыка стихнет, останови Луми.', [
          { sounds: ['music', 'silence'], options: ['move', 'stop'], answer: ['move', 'stop'] },
        ]),
        task('Волшебные окошки', 'multi', 'Прослушай три окошка и отметь те, в которых был звук.', [
          { sounds: ['leaves', 'silence', 'bell'], options: ['first', 'second', 'third'], answer: ['first', 'third'] },
        ]),
        task('Разбуди лес', 'discovery', 'Послушай каждый звук и найди его источник на полянке.', [
          choose('stream', ['stream', 'leaves']), choose('bell', ['bird', 'bell']),
          choose('bird', ['bird', 'stream']), choose('leaves', ['leaves', 'bell']),
        ]),
      ],
    },
    'literacy-lesson-1-2': {
      goal: 'Узнавать знакомых животных по голосам.',
      scenes: [
        scene('Луми встречает кошку и собаку. Кошка мяукает, собака лает.', ['cat', 'dog'], ['cat', 'dog'], 'animal'),
        scene('На полянке слышны корова и утка.', ['cow', 'duck'], ['cow', 'duck'], 'animal'),
        scene('Животные прячутся за кустами. Луми узнаёт их по голосам.', ['duck', 'dog', 'cat', 'cow'], ['duck', 'dog', 'cat', 'cow'], 'reveal'),
      ],
      practice: [
        task('Кто мяукает?', 'choice', 'Послушай и найди, кто подал голос.', [choose('cat', ['cat', 'dog'])]),
        task('Чей голос?', 'choice', 'Послушай и выбери животное.', [choose('dog', ['dog', 'cow']), choose('cow', ['dog', 'cow'])]),
        task('Звуковые домики', 'match', 'Соедини каждый голос с его домиком.', [match(['cat', 'dog', 'duck'])]),
        task('Лесные прятки', 'choice', 'Кто спрятался за кустом? Послушай голос.', [choose('duck', ['cat', 'dog', 'cow', 'duck']), choose('cow', ['cat', 'dog', 'cow', 'duck'])]),
        task('Хор животных', 'sequence', 'Послушай два голоса. Выбери животных в том же порядке.', [
          sequence(['cow', 'cat'], ['cat', 'dog', 'cow', 'duck']), sequence(['duck', 'dog'], ['cat', 'dog', 'cow', 'duck']),
        ]),
      ],
    },
    'literacy-lesson-1-3': {
      goal: 'Различать характерные звуки природы.',
      scenes: [
        scene('Луми слушает, как дождь стучит по листьям.', ['rain'], ['rain'], 'rain'),
        scene('Луми слышит журчание ручья и шелест листьев.', ['stream', 'leaves'], ['stream', 'leaves'], 'nature'),
        scene('Луми слушает дождь, ручей и ветер с закрытыми глазами.', ['rain', 'stream', 'leaves'], [], 'listen'),
      ],
      practice: [
        task('Дождливое облачко', 'choice', 'Послушай. Найди дождь.', [choose('rain', ['rain', 'leaves'])]),
        task('Лесной ручей', 'choice', 'Послушай. Это ручей или листья?', [choose('stream', ['stream', 'leaves']), choose('leaves', ['stream', 'leaves'])]),
        task('Природные пары', 'match', 'Найди картинку для каждого звука.', [match(['rain', 'stream', 'leaves'])]),
        task('Волшебное окно', 'choice', 'Какая картина звучит за окошком?', [choose('leaves', ['rain', 'stream', 'leaves']), choose('rain', ['rain', 'stream', 'leaves'])]),
        task('Оживи пейзаж', 'sequence', 'Послушай, затем оживи пейзаж в том же порядке.', [sequence(['rain', 'stream', 'bird', 'leaves'], ['rain', 'stream', 'bird', 'leaves'])]),
      ],
    },
    'literacy-lesson-1-4': {
      goal: 'Узнавать знакомые предметы по звучанию.',
      scenes: [
        scene('Луми звонит в колокольчик и стучит по барабану.', ['bell', 'drum'], ['bell', 'drum'], 'play'),
        scene('Бумага шуршит, а погремушка гремит.', ['paper', 'rattle'], ['paper', 'rattle'], 'play'),
        scene('Предметы спрятались за ширмой. Луми узнаёт их по звукам.', ['rattle', 'paper', 'bell', 'drum'], ['rattle', 'paper', 'bell', 'drum'], 'reveal'),
      ],
      practice: [
        task('Звон колокольчика', 'choice', 'Послушай звон. Найди колокольчик.', [choose('bell', ['bell', 'drum'])]),
        task('Барабан или погремушка?', 'choice', 'Послушай и найди предмет.', [choose('drum', ['drum', 'rattle']), choose('rattle', ['drum', 'rattle'])]),
        task('Звучащие пары', 'match', 'Соедини четыре звука с предметами.', [match(['bell', 'drum', 'paper', 'rattle'])]),
        task('Звуковой сундук', 'choice', 'Послушай. Какой предмет спрятался в сундуке?', [
          choose('paper', ['bell', 'paper', 'rattle']), choose('drum', ['paper', 'rattle', 'drum']),
        ]),
        task('Мастерская звуков', 'sequence', 'Послушай звуки. Выбери предметы по порядку.', [
          sequence(['rattle', 'bell'], ['bell', 'drum', 'paper', 'rattle']), sequence(['paper', 'drum'], ['bell', 'drum', 'paper', 'rattle']),
        ]),
      ],
    },
    'literacy-lesson-1-5': {
      goal: 'Сравнивать относительную громкость одного и того же звука.',
      scenes: [
        scene('Один колокольчик звенит сначала тихо, затем чуть громче.', [quiet('bell'), louder('bell')], ['bell'], 'play'),
        scene('Луми слушает тихий и более громкий удар одного барабана.', [quiet('drum'), louder('drum')], ['drum'], 'play'),
        scene('Один предмет может звучать по-разному. Послушай погремушку дважды.', [louder('rattle'), quiet('rattle')], ['rattle'], 'play'),
      ],
      practice: [
        task('Тихий звон', 'compare', 'Послушай оба звона. Какой тише?', [volume('bell', [0.74, 0.34], 'second')]),
        task('Более громкий удар', 'compare', 'Послушай оба удара. Какой громче?', [volume('drum', [0.74, 0.34], 'first')]),
        task('Пары по громкости', 'sort', 'В каждой паре положи один звук в тихую корзинку, другой — в более громкую.', [
          sort([quiet('bell'), louder('bell')], ['softer', 'stronger'], ['softer', 'stronger']),
          sort([louder('drum'), quiet('drum')], ['softer', 'stronger'], ['stronger', 'softer']),
          sort([quiet('rattle'), louder('rattle')], ['softer', 'stronger'], ['softer', 'stronger']),
        ]),
        task('Луми спит', 'compare', 'Выбери более тихий звук, чтобы не разбудить Луми.', [volume('bell', [0.34, 0.74], 'first')]),
        task('Звуковой дирижёр', 'sequence', 'Послушай. Повтори тихие и более громкие звуки по порядку.', [
          { ...sequence([quiet('bell'), louder('bell')], ['softer', 'stronger'], ['softer', 'stronger']), choices: { softer: quiet('bell'), stronger: louder('bell') } },
          { ...sequence([louder('drum'), quiet('drum'), louder('drum')], ['softer', 'stronger'], ['stronger', 'softer', 'stronger']), choices: { softer: quiet('drum'), stronger: louder('drum') } },
        ]),
      ],
    },
    'literacy-lesson-1-6': {
      goal: 'Узнавать голоса, звуки природы и предметов по слуху.',
      scenes: [
        scene('Луми вспоминает голоса знакомых животных.', ['cat', 'cow', 'duck'], ['cat', 'cow', 'duck'], 'animal'),
        scene('Ручей журчит, листья шелестят, колокольчик звенит, барабан стучит.', ['stream', 'leaves', 'bell', 'drum'], ['stream', 'leaves', 'bell', 'drum'], 'play'),
        scene('Луми слушает звук, просит повторить и после этого находит его источник.', ['rattle', 'rattle'], ['rattle'], 'reveal-last'),
      ],
      practice: [
        task('Угадай животное', 'choice', 'Кто подаёт голос?', [choose('cat', ['cat', 'cow', 'duck']), choose('dog', ['cat', 'dog', 'cow'])]),
        task('Угадай звук природы', 'choice', 'Что звучит в лесу?', [choose('rain', ['rain', 'stream', 'leaves'])]),
        task('Угадай предмет', 'choice', 'Послушай. Какой предмет звучит?', [choose('paper', ['bell', 'drum', 'paper', 'rattle'])]),
        task('Звуковые корзинки', 'sort', 'Разложи звуки по корзинкам: животные, природа и предметы.', [
          sort(['cow', 'leaves', 'bell', 'duck', 'rain', 'paper'], ['animals', 'nature', 'objects'], ['animals', 'nature', 'objects', 'animals', 'nature', 'objects']),
        ]),
        task('Верни голос лесу', 'discovery', 'Найди пять источников звука. Полянка будет просыпаться по шагам.', [
          choose('bird', ['bird', 'duck', 'cat', 'cow']), choose('rain', ['stream', 'rain', 'leaves', 'paper']),
          choose('rattle', ['bell', 'drum', 'paper', 'rattle']), choose('cat', ['cat', 'dog', 'duck', 'cow']),
          choose('stream', ['stream', 'leaves', 'rain', 'rattle']),
        ]),
      ],
    },
  },
};

export const forestSoundIds = ['silence', 'bell', 'stream', 'drum', 'rattle', 'music', 'leaves', 'bird', 'cat', 'dog', 'cow', 'duck', 'rain', 'paper'];
