import {findCourse,programUrl} from '../course-model.js';
import {el,button} from '../writing/ui.js';
import {hero,link,style} from './ui.js';
import {picture} from './art.js';
import {mountRound,mountScene} from './board.js';
import {words} from './words.js';
import {book} from '../data/speech34/texts.js';
import {adultScene,frame} from '../data/speech34/builders.js';

const root=document.querySelector('#speech-workshop');
const course=findCourse('speech-3-4');
const modes=[
 ['Волшебный словарь','ball'],['Мастерская описаний','pillow'],['Потерянные детали','wheel'],['Ожившие действия','boy'],
 ['Превращения слов','kitten'],['Поезд предложений','train'],['Город разговоров','hand'],['Театр голосов','voice'],
 ['Галерея историй','paper'],['Сказочная библиотека','book'],
];
const categories=[
 ['toy','Игрушки','ball'],['furniture','Мебель','chair'],['clothes','Одежда','shirt'],['shoes','Обувь','boot'],
 ['dish','Посуда','cup'],['animal','Животные','cat'],['body','Части тела','eye'],['transport','Транспорт','train'],
 ['tool','Предметы для разных дел','watering'],['young','Детёныши','puppy'],
];
style();root.classList.add('speech-lesson');
let board;
function visualButton(label,art,action){
 const n=button(label,action);
 n.classList.add('speech-menu-choice');n.prepend(picture(art));return n;
}
function heading(text,caption){
 board?.dispose();board=null;
 root.replaceChildren(el('h1','',text));
 if(caption)root.append(el('p','speech-grown',caption));
}
function menu(){
 heading('Свободная речевая мастерская');
 root.prepend(hero(7));
 const group=el('div','speech-workshop-menu');
 for(const [i,[text,art]] of modes.entries())group.append(visualButton(text,art,()=>{
  if(i===0){dictionary();return;}
  if(i===9){books();return;}
  play(i,0);
 }));
 root.append(group,link('К урокам курса',programUrl(course)));
}
function play(index,cursor){
 heading(modes[index][0]);
 const pool=course.modules[index].lessons.flatMap(l=>l.practice.flatMap(t=>t.rounds));
 if(!pool.length){menu();return;}
 const host=el('div'),nav=el('div','lesson-actions');
 nav.append(button('Другая игра',menu),button('Другой вариант',()=>play(index,(cursor+1)%pool.length)));
 root.append(host,nav);
 board=mountRound(host,pool[cursor],()=>play(index,(cursor+1)%pool.length));
}
function dictionary(selected='toy',id=null){
 heading('Волшебный словарь','Выберите картинку и назовите предмет вместе.');
 const bar=el('div','speech-workshop-menu');
 for(const [key,name,art] of categories)bar.append(visualButton(name,art,()=>dictionary(key)));
 const list=el('div','speech-workshop-menu');
 for(const word of Object.values(words).filter(w=>w.category===selected))
  list.append(visualButton(word.lemma,word.image,()=>dictionary(selected,word.id)));
 root.append(bar,list);
 if(id){
  const entry=words[id],area=el('section','speech-board');
  area.append(picture(entry.image),el('h2','',entry.lemma),el('p','speech-model',entry.examples.join(' ')));
  const adult=el('details','speech-adult ym-hide-content');
  adult.append(el('summary','','Взрослому — формы и речевой образец'),
   el('p','',entry.singular?'Один предмет: '+entry.singular+'. Вместе: '+entry.plural+'.':entry.plural+'.'),
   el('p','','Нет '+entry.cases.genitive+'.'),
   ...(entry.affection?[el('p','','Ласково: '+entry.affection+'.')]:[]),
   el('p','',entry.speechModel));
  area.append(adult);root.append(area);
 }
 root.append(button('Играть со словами',()=>play(0,0)),button('В мастерскую',menu));
}
function books(){
 heading('Сказочная библиотека','Прочитайте книгу вместе со взрослым.');
 const list=el('div','speech-workshop-menu');
 for(const [id,work] of Object.entries(book))list.append(visualButton(work.title,work.episodes[0].art,()=>read(id,0)));
 root.append(list,button('Литературные игры',()=>play(9,0)),button('В мастерскую',menu));
}
function read(id,index){
 const item=book[id],episode=item.episodes[index],last=index===item.episodes.length-1;
 heading(item.title,'Часть '+(index+1)+' из '+item.episodes.length);
 const section=el('section','speech-scene'),nav=el('div','lesson-actions');
 if(index)nav.append(button('Предыдущая часть',()=>read(id,index-1)));
 nav.append(button('К другим книгам',books));
 const sources=el('details','speech-adult');
 sources.append(el('summary','','О произведении'),el('p','',item.origin+'. '+item.edition+'.'),el('p','',item.rights));
 root.append(section,nav,sources);
 board=mountScene(section,adultScene('Прочитайте текст вместе.',episode.text,[frame(episode.art)],episode.text),{
  next:()=>last?books():read(id,index+1),last,nextLabel:last?'К книгам':'Следующая часть',
 });
}
menu();
