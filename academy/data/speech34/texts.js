import {panel} from './builders.js';

const folklore={origin:'Русское устное народное творчество',rights:'Народный сюжет без указанного автора. Авторская адаптация проекта Lumi.',
 edition:'Краткая редакция Академии Луми, версия 1'};
const tales={...folklore,source:'https://ru.wikisource.org/wiki/Народные_русские_сказки_(Афанасьев)'};
const original={origin:'Оригинальный текст Академии Луми',rights:'Оригинальный материал проекта Lumi',edition:'Редакция для курса 3–4 года, версия 1'};
const episode=(id,text,art)=>({id,text,art});
const plant=panel(['grandpa',1,18,.76],['turnip',101,83,.46,'rise']);
const pull=panel(['grandpa',4,27,.71],['turnip',106,70,.44,'touch']);
const help=panel(['grandma',0,17,.59],['grandpa',72,26,.61],['turnip',125,95,.30,'touch']);
const team=panel(['grandpa',85,5,.48],['grandma',47,10,.46],['girl',8,32,.41],['dog',4,98,.34],['cat',58,104,.33],['mouse',106,113,.27],
 ['turnip',123,44,.44,'jump']);
const house=panel(['house',31,23,.82],['mouse',2,98,.42,'walk']);
const frog=panel(['house',32,21,.74],['mouse',4,90,.35],['frog',97,93,.43,'jump']);
const bigger=panel(['house',33,14,.79],['frog',2,62,.36],['bunny',42,80,.40],['fox',82,76,.43],['wolf',119,70,.34]);
const rebuilt=panel(['house:cream:big:blue-roof',40,10,.80],['bear',7,72,.47],['mouse',72,105,.36],['frog',117,102,.37]);
const bake=panel(['grandma',15,15,.71],['kolobok',110,63,.40,'rise']);
const path=panel(['road',-3,28,1],['kolobok',48,67,.52,'roll']);
const meets=panel(['kolobok',7,65,.48,'roll'],['bunny',91,31,.52]);
const fox=panel(['kolobok',4,52,.48],['fox',89,34,.56,'wave']);
const rain=panel(['lumi',2,55,.63],['umbrella:red',9,23,.68],['rain',87,10,.53,'rise']);
const sky=panel(['lumi',4,60,.59],['flower',118,84,.37],['sun',93,0,.62,'rise']);
export const book={
 repka:{title:'Репка',...tales,heroes:['grandpa','grandma','girl','dog','cat','mouse'],
  episodes:[
   episode('p1','Дед посадил репку. Выросла репка большая-пребольшая.',plant),
   episode('p2','Дед взялся за репку: тянет-потянет, вытянуть не может.',pull),
   episode('p3','Позвал дед бабку. Потом пришли внучка, собака Жучка, кошка и мышка.',help),
   episode('p4','Встали все друг за другом. Вместе потянули — и вытянули репку!',team),
  ]},
 terem:{title:'Теремок',...tales,heroes:['mouse','frog','bunny','fox','wolf','bear'],
  episodes:[
   episode('t1','В поле стоял теремок. Мышка нашла его и стала в нём жить.',house),
   episode('t2','Прискакала лягушка. Мышка позвала её жить вместе.',frog),
   episode('t3','Потом в теремке поселились заяц, лиса и волк.',bigger),
   episode('t4','Медведю домик оказался мал. Теремок развалился, звери выбежали и вместе построили новый, просторный дом.',rebuilt),
  ]},
 kolobok:{title:'Колобок',...tales,heroes:['grandpa','grandma','kolobok','bunny','wolf','bear','fox'],
  episodes:[
   episode('k1','Бабушка испекла Колобка и положила остывать.',bake),
   episode('k2','Колобок укатился с окошка по дорожке.',path),
   episode('k3','На дорожке он встретил зайца, потом волка и медведя. Спел им песенку и покатился дальше.',meets),
   episode('k4','Лиса попросила спеть поближе. Колобок подкатился, а лиса его съела.',fox),
  ]},
 hands:{title:'Ладушки',...folklore,episodes:[
  episode('hands','Ладушки, ладушки! Где были? У бабушки. Что ели? Кашку! Полетели, полетели, на головку сели.',
   panel(['hand',9,42,.57,'wave'],['hand',73,40,.59,'wave'],['bowl',57,101,.35])),
 ]},
 magpie:{title:'Сорока-белобока',...folklore,episodes:[
  episode('magpie','Сорока-белобока кашку варила, деток кормила: этому дала, этому дала, этому дала, этому дала.',
   panel(['bird:gray',2,23,.69,'jump'],['pot',94,67,.52,'rise'],['spoon',123,18,.30,'stir'])),
 ]},
 rain:{title:'Дождик',...original,episodes:[
  episode('rain','Кап-кап-кап, идёт дождик,\nЛуми спрятался под зонтик.\nДождик землю поливает,\nСкоро солнышко выглянет.',rain),
  episode('sky','Скоро солнышко выглянет.',sky),
 ]},
 ball:{title:'Мячик',...original,episodes:[
  episode('ball','Мячик прыгнул: скок да скок!\nПокатился за порог.\nЛуми мячик в дом несёт,\nЗавтра снова он придёт.',panel(['lumi',2,22,.73],['ball',116,78,.38,'jump'])),
 ]},
 colors:{title:'Цветы',...original,episodes:[
  episode('color','У дорожки два цветка,\nРядом песня ручейка.\nЛуми к ним идёт с лейкой,\nЛьёт водичку понемногу.',panel(['lumi',9,21,.68],['watering',83,50,.43,'pour'],['flower',117,79,.36])),
 ]},
};
