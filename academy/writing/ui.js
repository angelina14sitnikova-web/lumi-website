export const el=(tag,className='',text='')=>{
  const node=document.createElement(tag);
  node.className=className;
  node.textContent=text;
  return node;
};
export function button(label, action, primary = false) {
  const node=el('button',primary?'academy-button':'lesson-secondary',label);
  node.type='button';
  node.addEventListener('click',action);
  return node;
}
export const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
export const svg=(tag,attrs={})=>{
  const node=document.createElementNS('http://www.w3.org/2000/svg',tag);
  for(const [name,value] of Object.entries(attrs)) node.setAttribute(name,value);
  return node;
};
