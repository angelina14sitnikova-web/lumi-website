const title='Хранитель волшебных воспоминаний';
const media=new URL('./media/',import.meta.url);

function node(tag,className='',text=''){
  const element=document.createElement(tag);
  element.className=className;
  element.textContent=text;
  return element;
}
function link(text,href){
  const a=node('a','academy-button',text);
  a.href=href;
  return a;
}
function visual(url,alt){
  const image=node('img');
  image.src=url;
  image.alt=alt;
  return image;
}
function button(text){
  const btn=node('button','academy-button',text);
  btn.type='button';
  return btn;
}
function placeArt(ctx,img,x,y,maxWidth,maxHeight){
  if(!img.naturalWidth) return;
  const scale=Math.min(maxWidth/img.naturalWidth,maxHeight/img.naturalHeight);
  const width=img.naturalWidth*scale,height=img.naturalHeight*scale;
  ctx.drawImage(img,x+(maxWidth-width)/2,y+(maxHeight-height)/2,width,height);
}
function words(ctx,text,x,y,font,maxWidth=1230,color='#28505d'){
  ctx.font=font;
  ctx.fillStyle=color;
  ctx.fillText(text,x,y,maxWidth);
}
function makeCertificate(course,date){
  const section=node('section','academy-diploma mem-certificate ym-hide-content');
  const heading=node('h2','', 'Игровая грамота');
  const label=node('label','','Имя на грамоте по желанию');
  const name=node('input','ym-disable-keys');
  name.type='text';
  name.maxLength=50;
  name.autocomplete='off';
  name.spellcheck=false;
  label.append(name);
  const canvas=node('canvas');
  canvas.width=1440;canvas.height=1018;
  canvas.setAttribute('aria-label','Игровая грамота «'+title+'»');
  const draw=canvas.getContext('2d');
  const player=new Image(), medal=new Image(), locationArt=new Image();
  const download=button('Сохранить PNG'),print=button('Распечатать');
  const explain=node('p','','Памятная игровая награда Академии Луми');
  const status=node('p','');
  status.setAttribute('role','status');
  section.append(heading,label,canvas,download,print,explain,status);
  const total=course.modules.reduce((sum,module)=>sum+module.lessons.length,0);
  const calendar=date?new Intl.DateTimeFormat('ru-RU',{dateStyle:'long'}).format(new Date(date)):'Дата завершения не сохранена';

  function paint(){
    if(!draw) return;
    const paper=draw.createLinearGradient(0,0,1440,1018);
    paper.addColorStop(0,'#e6f6f2');paper.addColorStop(.53,'#fff8de');paper.addColorStop(1,'#e8e2f8');
    draw.fillStyle=paper;draw.fillRect(0,0,1440,1018);
    if(locationArt.naturalWidth){
      draw.save();draw.globalAlpha=.19;
      draw.drawImage(locationArt,44,495,1352,478);
      draw.restore();
    }
    draw.strokeStyle='#ad8250';
    draw.lineWidth=5;draw.strokeRect(29,29,1382,960);
    draw.lineWidth=2;draw.strokeRect(43,43,1354,932);
    draw.textAlign='center';
    words(draw,'Академия Луми',720,111,'bold 38px Georgia');
    words(draw,'Игровая грамота',720,194,'bold 65px Georgia');
    words(draw,title,720,290,'bold 57px Georgia');
    words(draw,course.nameForCourse,720,350,'35px Georgia');
    words(draw,'Внимание и память · 3–4 года',720,405,'28px sans-serif');
    placeArt(draw,player,123,441,480,397);
    placeArt(draw,medal,961,649,168,170);
    words(draw,name.value.trim()||'Юный хранитель воспоминаний',1025,504,'bold 48px Georgia',670);
    words(draw,`${total} уроков · ${course.modules.length} страниц альбома`,1025,572,'29px sans-serif',650);
    words(draw,calendar,1025,620,'26px sans-serif',640);
    words(draw,'Памятная игровая награда Академии Луми',720,935,'27px sans-serif');
  }
  for(const img of [locationArt,player,medal]){
    img.addEventListener('load',paint);
    img.addEventListener('error',()=>{status.textContent='Иллюстрация не загрузилась. Обновите страницу для полной грамоты.';});
  }
  locationArt.src=new URL('island.webp',media);
  player.src=new URL('lumi-album.webp',media);
  medal.src=new URL('island-medal.webp',media);
  const loaded=()=>[locationArt,player,medal].every(img=>img.complete&&img.naturalWidth);
  download.addEventListener('click',()=>{
    if(!loaded()){status.textContent='Дождитесь загрузки иллюстраций.';return;}
    paint();
    canvas.toBlob(blob=>{
      if(!blob){status.textContent='Не удалось сохранить PNG. Попробуйте ещё раз.';return;}
      const href=URL.createObjectURL(blob);
      const a=node('a');
      a.href=href;a.download='lumi-keeper-of-memories.png';
      document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(href),30000);
    },'image/png');
  });
  print.addEventListener('click',()=>{
    if(!loaded()){status.textContent='Дождитесь загрузки иллюстраций.';return;}
    paint(); window.print();
  });
  name.addEventListener('input',paint);
  paint();
  return section;
}

export function mountMemoryFinale(panel,course,complete,stars,date) {
  const css=node('link');
  css.rel='stylesheet';
  css.href=new URL('finale.css',import.meta.url);
  document.head.append(css);
  panel.classList.add('mem-finale');
  const total=course.modules.reduce((sum,module)=>sum+module.lessons.length,0);
  const back=link('К урокам курса','program.html?course=memory-3-4');
  document.title=title+' · Академия Луми';
  if(!complete) {
    panel.replaceChildren(node('h1','', 'Волшебный альбом'),node('p','',`Пройдено ${stars} из ${total} уроков. Праздник откроется, когда все страницы альбома будут собраны.`),back);
    return;
  }
  const banner=node('div','mem-finale-banner');
  const portrait=visual(new URL('lumi-album.webp',media),'Луми с волшебным альбомом');
  banner.append(portrait);
  const starSet=node('div','mem-finale-stars');
  starSet.setAttribute('aria-label',stars+' золотых звёзд');
  for(let i=0;i<stars;i++){
    const star=node('span','','★');
    star.setAttribute('aria-hidden','true');
    starSet.append(star);
  }
  const album=node('div','mem-album');
  album.setAttribute('aria-label','Восстановленные страницы альбома');
  for(const module of course.modules){
    const page=node('figure','mem-album-leaf');
    page.append(visual(module.memoryAlbum.image,''),
      visual(module.memoryAlbum.medal,module.reward),
      node('figcaption','',module.memoryAlbum.title));
    album.append(page);
  }
  const controls=node('div','lesson-actions mem-finale-links');
  controls.append(link('Выбрать урок для повторения',back.href),link('Вернуться в Академию','age-3-4.html'));
  panel.replaceChildren(banner,node('h1','',title),
    node('p','',`Ты собрал ${stars} звёзд, ${course.modules.length} медалей и все страницы альбома.`),
    starSet,album,controls,makeCertificate(course,date));
}
