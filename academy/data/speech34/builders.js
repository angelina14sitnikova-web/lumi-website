export function language(instructionText,speechModel,responseMode,extra={}){
 const adultPrompt=extra.adultPrompt??(extra.requiresAdult?'Прочитайте образец вслух. Дайте ребёнку время показать или ответить вместе с вами.':
  'Прочитайте короткую инструкцию. После игры предложите ребёнку сказать своими словами. Можно проговорить вместе.');
 const narrationText=extra.narrationText??instructionText+' '+speechModel;
 return {narrationText,instructionText,speechModel,adultPrompt,transcript:extra.transcript??narrationText,
  audioSrc:null,requiresAdult:false,responseMode,...extra};
}
export const token=(id,art=id,extra={})=>({id,art,...extra});
const cards=values=>values.map(value=>typeof value==='string'?token(value):value);
export const frame=(art,action='show',extra={})=>({...token(typeof art==='string'?art:'frame',art),action,...extra});
export const panel=(...props)=>({props});
export function scene(instruction,model,...frames){
 return {...language(instruction,model,'demonstration'),frames:cards(frames)};
}
export const adultScene=(instruction,model,frames,transcript=model)=>({
 ...language(instruction,model,'demonstration',{requiresAdult:true,transcript,narrationText:transcript}),frames:cards(frames),
});
export const say=(instruction,model,visual,mode='speak',extra={})=>({
 ...language(instruction,model,mode,extra),cards:cards(visual),
});
export const choose=(instruction,model,options,correct,extra={})=>({
 ...language(instruction,model,'choose',extra),cards:cards(options),correct:[].concat(correct),
});
export const multi=(instruction,model,options,correct,count,extra={})=>({
 ...language(instruction,model,'multi',extra),cards:cards(options),correct,count,
});
export const place=(instruction,model,options,slots,extra={})=>({
 ...language(instruction,model,extra.responseMode??'place',extra),cards:cards(options),
 slots:slots.map(([art,accept,label,area])=>({art,accept:[].concat(accept),label,area})),
});
export const order=(instruction,model,options,expected,extra={})=>
 place(instruction,model,options,expected.map(id=>['arrow',id]),{responseMode:'order',...extra});
export const task=(title,...rounds)=>({kind:'speech34',title,...Object.fromEntries(
 Object.entries(rounds[0]).filter(([key])=>['narrationText','instructionText','speechModel','adultPrompt','transcript','requiresAdult','audioSrc','responseMode'].includes(key))),rounds});
export const lessons=(module,items)=>Object.fromEntries(items.map(([goal,scenes,...practice],i)=>[
 'speech-lesson-'+module+'-'+(i+1),{format:'speech34',world:module,goal,scenes,practice},
]));
export const worlds=['Город оживших вещей','Мастерская волшебных свойств','Мастерская потерянных деталей','Долина оживших глаголов',
 'Деревня маленьких чудес','Железная дорога предложений','Город добрых разговоров','Театр волшебных голосов',
 'Галерея оживших картин','Библиотека тысячи сказок'];
