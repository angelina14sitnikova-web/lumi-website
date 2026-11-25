import {downloadImage,makeGallery,printDrawing,toBlob} from './gallery.js';
import {extraPaints} from './paints.js';
import {el,button} from './ui.js';

const media=new URL('./media/',import.meta.url);
const reward='Юный художник Академии Луми';
function link(label,href){
  const a=el('a','academy-button',label);
  a.href=href;
  return a;
}
function img(src,alt){
  const image=el('img');
  image.src=src;image.alt=alt;
  return image;
}
function diploma(course,date){
  const card=el('section','write-diploma ym-hide-content');
  const label=el('label','','Имя на грамоте по желанию');
  const name=el('input','ym-disable-keys');
  name.type='text';name.maxLength=50;name.autocomplete='off';name.spellcheck=false;
  label.append(name);
  const board=el('canvas','ym-hide-content');
  board.width=1440;board.height=1018;
  board.setAttribute('aria-label','Игровая грамота «'+reward+'»');
  const ctx=board.getContext('2d');
  const lumi=img(new URL('lumi-exhibition.webp',media),'');
  const medal=img(new URL('artists-medal.webp',media),'');
  const art=img(new URL('exhibition.webp',media),'');
  const status=el('p','write-feedback');
  status.setAttribute('role','status');
  const dateText=date?new Intl.DateTimeFormat('ru-RU',{dateStyle:'long'}).format(new Date(date)):'';
  function words(text,x,y,font,size=1250){
    ctx.font=font;ctx.fillStyle='#514061';
    ctx.fillText(text,x,y,size);
  }
  function paint(){
    const paper=ctx.createLinearGradient(0,0,1440,1018);
    paper.addColorStop(0,'#fbebd7');paper.addColorStop(.5,'#fffbec');paper.addColorStop(1,'#e8edf8');
    ctx.fillStyle=paper;ctx.fillRect(0,0,1440,1018);
    if(art.naturalWidth){
      ctx.save();ctx.globalAlpha=.19;
      ctx.drawImage(art,42,441,1356,520);
      ctx.restore();
    }
    ctx.strokeStyle='#bb8e52';ctx.lineWidth=5;
    ctx.strokeRect(28,28,1384,962);
    ctx.lineWidth=2;ctx.strokeRect(42,42,1356,934);
    ctx.textAlign='center';
    words('Игровая грамота',720,133,'bold 62px Georgia');
    words(reward,720,225,'bold 66px Georgia');
    words(course.nameForCourse,720,297,'42px Georgia');
    words('Подготовка руки к письму · 3–4 года',720,354,'28px sans-serif');
    if(lumi.naturalWidth){
      const scale=Math.min(458/lumi.naturalWidth,505/lumi.naturalHeight);
      ctx.drawImage(lumi,112,385,lumi.naturalWidth*scale,lumi.naturalHeight*scale);
    }
    if(medal.naturalWidth){
      const scale=Math.min(156/medal.naturalWidth,167/medal.naturalHeight);
      ctx.drawImage(medal,928,657,medal.naturalWidth*scale,medal.naturalHeight*scale);
    }
    words(name.value.trim()||'Юному художнику',1007,500,'bold 48px Georgia',650);
    words('36 уроков · 6 волшебных красок',1007,573,'30px sans-serif',650);
    if(dateText)words(dateText,1007,627,'28px sans-serif',650);
    words('Памятная игровая награда Академии Луми',720,938,'29px sans-serif');
  }
  for(const picture of [lumi,medal,art])picture.addEventListener('load',paint);
  name.addEventListener('input',paint);
  async function exportAward(printer){
    try{
      await Promise.all([lumi,medal,art].map(image=>image.decode()));
      paint();
      const blob=await toBlob(board);
      if(printer)await printDrawing(blob);
      else downloadImage(blob,'lumi-young-artist.png');
    }catch{status.textContent='Грамота не загрузилась. Попробуй открыть страницу заново.';}
  }
  card.append(el('h2','',reward),label,board,
    button('Сохранить грамоту в PNG',()=>void exportAward(false),true),
    button('Распечатать грамоту',()=>void exportAward(true)),
    el('p','','Памятная игровая награда Академии Луми'),status);
  paint();
  return card;
}

export function mountWritingFinale(panel,course,complete,stars,date){
  const css=el('link');css.rel='stylesheet';css.href=new URL('writing.css',import.meta.url);
  document.head.append(css);
  panel.classList.add('write-finale');
  const title='Маленькие шедевры Луми';
  document.title=title+' · Академия Луми';
  const courseLink=link('К урокам курса','program.html?course=writing-3-4');
  const studioLink=link('Свободная мастерская','writing-studio.html');
  if(!complete){
    panel.replaceChildren(el('h1','',title),
      el('p','',`Пройдено ${stars} из 36 уроков. Выставка откроется после последнего урока.`),courseLink,studioLink);
    return;
  }
  const hero=el('div','write-finale-hero');
  hero.append(img(new URL('lumi-exhibition.webp',media),'Луми с волшебным карандашом'));
  const starsView=el('div','write-stars');
  starsView.setAttribute('aria-label',stars+' звёзд');
  for(let i=0;i<stars;i++){
    const star=el('span','','★');star.setAttribute('aria-hidden','true');starsView.append(star);
  }
  const collection=el('div','write-medals');
  course.modules.forEach((module,index)=>{
    const prize=el('figure','write-medal');
    const medal=img(module.writingMedal,module.reward);
    const paint=el('div','write-finale-paint');
    const [color,label]=extraPaints[index];
    paint.setAttribute('aria-label',label+' краска');
    if(color==='rainbow')paint.append(img(new URL('paint-rainbow.webp',media),''));
    else paint.style.setProperty('--paint',color);
    prize.append(medal,paint,el('figcaption','',module.reward+' · '+label+' краска'));
    collection.append(prize);
  });
  const gallery=makeGallery({exhibition:true});
  const nav=el('nav','write-controls');
  nav.append(studioLink,courseLink,link('Вернуться в Академию','age-3-4.html'));
  panel.replaceChildren(hero,el('h1','',title),starsView,collection,gallery.view,diploma(course,date),nav);
  void gallery.show();
}
