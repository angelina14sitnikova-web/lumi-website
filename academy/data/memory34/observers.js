const round = (prompt, kind, props) => ({ prompt, kind, ...props });
const find = (sample, options, prompt = 'Найди такой же предмет.') =>
  round(prompt, 'find', { sample: [sample], options, answer: sample });
const details = (picture, target, prompt, lens = false) =>
  round(prompt, 'detail', { picture, options: [target], answer: target, lens });
const differences = (left, right, targets, prompt = 'Найди отличия.') =>
  round(prompt, 'difference', { left, right, options: targets, answer: targets });
const chooseSet = (sample, options, prompt) =>
  round(prompt, 'set', { sample, options, answer: sample });
const track = (subject, destinations, path, prompt, distractionPath) =>
  round(prompt, 'track', { subject, destinations, path, distractionPath, options: destinations, answer: destinations[path.at(-1)] });
const task = (title, ...rounds) => ({ title, kind: 'memory34', rounds });
const demo = (text, example) => ({ text, example });
const pair = (sample, options) => find(sample, options, 'Найди точную пару.');
const connect = (sample, options) => ({...pair(sample, options), kind:'pair', prompt:'Нажми на образец, затем на его пару.'});
const shelf = ['ball', 'doll', 'stack', 'bear', 'car', 'duck', 'cup', 'apple'];
const bow = 'bear', car = 'car', blueHouse = 'house-blue', fair = 'fair';

const lessons = [
  [
    [
      demo('Посмотри на мишку. Вот ушки, лапки и бантик.', details(bow, 'ears', 'Нажми на ушки.', true)),
      demo('Вот колёса. А выше окна. Спереди фары.', details(car, 'wheels', 'Нажми на колёса.')),
      demo('Посмотри на всю полку. Вот мяч, кукла и пирамидка.', find('doll', shelf.slice(0, 3))),
    ],
    task('Волшебная лупа', details(bow, 'ears', 'Рассмотри мишку через лупу. Найди его ушки.', true)),
    task('Колёса машинки', details(car, 'wheels', 'Найди колёса у машинки.')),
    task('Детали домика', details(blueHouse, 'roof', 'Найди крышу.'), details(blueHouse, 'door', 'Теперь найди дверь.'), details(blueHouse, 'window', 'А где окно?')),
    task('Полка игрушек', ...['ball', 'doll', 'stack'].map(id => find(id, shelf.slice(0, 5)))),
    task('Стол исследователя', details('desk', 'apple', 'Найди яблоко.'), details('desk', 'cup', 'Найди чашку.'), details('desk', 'leaf', 'Найди листик.'), details('desk', 'ball', 'Найди мяч.'), details('desk', 'bell', 'Найди колокольчик.')),
  ],
  [
    [
      demo('Вот рисунок с мячом. На полке такой же мяч.', find('ball', ['bear', 'ball'])),
      demo('Посмотри на чашку. Вот такая же чашка.', find('cup', ['jug', 'plate', 'cup'])),
      demo('На столе игрушки, фрукты и посуда. Вот яблоко с картинки.', find('apple', ['cup', 'apple', 'doll', 'ball'])),
    ],
    task('Знакомый мяч', find('ball', ['doll', 'ball'])),
    task('Фруктовая полка', find('apple', ['pear', 'apple', 'plum'])),
    task('Чашка', find('cup', ['jug', 'plate', 'cup', 'spoon'])),
    task('Игрушечная полка', ...['bear', 'stack', 'car'].map(id => find(id, shelf.slice(0, 5)))),
    task('Сундучок находок', ...['duck', 'cup', 'doll', 'apple', 'stack'].map(id => find(id, shelf))),
  ],
  [
    [
      demo('У двух яблок совпадают форма, цвет и листик. Это одинаковые рисунки.', pair('apple', ['pear', 'apple'])),
      demo('Посмотри на крылья бабочек. Они разного цвета.', pair('butterfly-blue', ['butterfly-gold', 'butterfly-blue'])),
      demo('Сравни цвет и узор на крыльях. Вот точная копия.', pair('butterfly-pink-spot', ['butterfly-pink', 'butterfly-pink-spot', 'butterfly-gold'])),
    ],
    task('Два одинаковых мяча', pair('ball', ['ball-star', 'ball-blue', 'ball'])),
    task('Точная копия машинки', pair('car-blue-star', ['car-blue', 'car', 'car-blue-star', 'car-star'])),
    task('Три пары', ...['duck', 'doll', 'bear'].map(id => connect(id, ['duck', 'doll', 'bear']))),
    task('Крылышки бабочки', pair('butterfly-pink-spot', ['butterfly-blue', 'butterfly-pink', 'butterfly-gold', 'butterfly-pink-spot'])),
    task('Галерея двойников', connect('ball-star', ['ball', 'ball-blue', 'ball-star']), connect('car-star', ['car-blue-star', 'car', 'car-star']), connect('butterfly-gold', ['butterfly-gold-spot', 'butterfly-gold', 'butterfly-blue']), connect('bear-scarf', ['bear-scarf', 'bear', 'bear-blue']), connect('cup-star', ['cup', 'cup-blue', 'cup-star'])),
  ],
  [
    [
      demo('Домики одной формы. У крыш разный цвет.', differences('house-blue', 'house-pink', ['roof'])),
      demo('Посмотри на мишек. У одного есть шарфик.', differences('bear-scarf', 'bear-plain', ['bow'])),
      demo('Сначала сравни крышу, потом окно. Есть два отличия.', differences('house-blue', 'house-pink-shut', ['roof', 'window'])),
    ],
    task('Разные мячи', differences('ball', 'ball-star', ['center'], 'Найди отличие у мячиков.')),
    task('Бантик мишки', differences('bear', 'bear-plain', ['bow'], 'Нажми на бантик или на место, где его не хватает.')),
    task('Машинки', differences('car', 'car-star', ['body'])),
    task('Два домика', differences('house-blue', 'house-pink-shut', ['roof', 'window'], 'Отыщи два отличия.')),
    task('Картина с секретом', differences(fair, 'fair-changed', ['roof', 'ball', 'tree'], 'Найди три отличия на полянке.')),
  ],
  [
    [
      demo('Мячик покатился. Смотри, он остановился у корзины.', track('ball', ['mat', 'basket'], [0, 1], 'Где остановился мяч?')),
      demo('Бабочка плавно перелетает с цветка на цветок.', track('butterfly-blue', ['flower-pink', 'flower-gold', 'flower-blue'], [1, 2, 0], 'Выбери цветок, где села бабочка.')),
      demo('Вот две машинки. Следи только за красной.', track(car, ['garage-blue', 'garage-green', 'garage-gold'], [0, 1, 2], 'Где красная машинка?', [2, 1, 0])),
    ],
    task('Куда укатился мяч?', track('ball', ['mat', 'basket'], [0, 1], 'Где остановился мяч?')),
    task('Бабочка и цветы', track('butterfly-blue', ['flower-pink', 'flower-gold', 'flower-blue'], [0, 2, 1], 'Выбери цветок, где села бабочка.')),
    task('Две машинки', track(car, ['garage-blue', 'garage-green', 'garage-gold'], [0, 1, 2], 'Куда приехала красная машинка?', [2, 1, 0])),
    task('Волшебная звезда', track('star', ['window-blue', 'window-pink', 'window-gold'], [2, 0, 1], 'Найди окно, где остановилась звезда.')),
    task('Путешествие светлячка', track('firefly', ['leaf', 'flower-pink', 'cup'], [0, 2, 1], 'Где остановился светлячок?'), track('firefly', ['basket', 'leaf', 'flower-blue'], [1, 0, 2], 'Найди новое место светлячка.'), track('firefly', ['house-blue', 'flower-gold', 'leaf'], [1, 2, 0], 'Где остановился светлячок?')),
  ],
  [
    [
      demo('Оставим рисунок на столе. Вот такая же игрушка.', find('stack', ['doll', 'stack'])),
      demo('Для точного совпадения сравним форму и цвет.', find('ball-blue', ['ball', 'cup-blue', 'ball-blue'])),
      demo('На рисунках две игрушки. Положим их в чемодан.', chooseSet(['doll', 'bear'], ['doll', 'bear', 'ball'], 'Собери обе игрушки по образцам.')),
    ],
    task('Предмет на рисунке', find('cup-star', ['cup', 'cup-star', 'cup-blue'])),
    task('Четыре игрушки', find('bear-blue', ['bear-blue', 'bear', 'bear-plain', 'bear-scarf'])),
    task('Три образца', ...['ball-star', 'car-blue', 'butterfly-gold'].map(id => connect(id, ['ball-star', 'car-blue', 'butterfly-gold', 'ball']))),
    task('Две видимые картинки', chooseSet(['duck', 'stack'], ['bear', 'stack', 'duck', 'car'], 'Собери две игрушки с картинок.')),
    task('Набор юного исследователя', ...['cup', 'bear', 'apple', 'stack', 'ball'].map(id => find(id, shelf, 'Положи в чемодан предмет с картинки.'))),
  ],
];

export const observers = Object.fromEntries(lessons.map(([scenes, ...practice], index) => [
  'memory-lesson-1-' + (index + 1),
  { format: 'memory34', world: 'academy', scenes, practice },
]));
