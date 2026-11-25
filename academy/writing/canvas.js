import { BOARD,distance } from './geometry.js';

const brushes = {
  pencil: {opacity:1, size:.72},
  brush: {opacity:.88, size:1.35},
  wax: {opacity:.81, size:1.05},
  eraser: {opacity:1, size:1.6},
};
const midpoint = (a,b) => ({x:(a.x+b.x)/2,y:(a.y+b.y)/2});

export function boardPoint(rect, x, y) {
  return {x:BOARD.width*(x-rect.left)/rect.width,y:BOARD.height*(y-rect.top)/rect.height};
}

export function paintStroke(ctx,stroke) {
  const [first,...rest]=stroke.points;
  if(!first) return;
  const brush=brushes[stroke.tool]??brushes.brush;
  const width=stroke.width*brush.size;
  ctx.save();
  ctx.globalAlpha=brush.opacity;
  if(stroke.tool==='eraser') ctx.globalCompositeOperation='destination-out';
  ctx.strokeStyle=ctx.fillStyle=stroke.color;
  ctx.lineWidth=width;
  ctx.lineCap=ctx.lineJoin='round';
  ctx.beginPath();
  if(!rest.length) {
    ctx.arc(first.x,first.y,width/2,0,2*Math.PI);
    ctx.fill();
  } else {
    ctx.moveTo(first.x,first.y);
    rest.forEach((point,i)=>{
      const next=rest[i+1];
      if(!next) ctx.lineTo(point.x,point.y);
      else {
        const middle=midpoint(point,next);
        ctx.quadraticCurveTo(point.x,point.y,middle.x,middle.y);
      }
    });
    ctx.stroke();
  }
  ctx.restore();
}

export function createDrawing(canvas,{strokes=[],change=()=>{}}={}) {
  const ctx=canvas.getContext('2d');
  let committed=structuredClone(strokes), undone=[], active=null, pending=0;
  let style={tool:'brush',color:'#4a8dc4',width:13};
  canvas.style.touchAction='none';
  canvas.style.aspectRatio=BOARD.width+' / '+BOARD.height;
  function render(){
    const sx=canvas.width/BOARD.width, sy=canvas.height/BOARD.height;
    ctx.setTransform(sx,0,0,sy,0,0);
    ctx.clearRect(0,0,BOARD.width,BOARD.height);
    committed.forEach(stroke=>paintStroke(ctx,stroke));
    if(active) paintStroke(ctx,active.stroke);
  }
  function invalidate(){
    if(!pending) pending=requestAnimationFrame(()=>{pending=0;render();});
  }
  function resize(){
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height) return;
    const density=window.devicePixelRatio||1;
    const width=Math.max(1,Math.round(rect.width*density)), height=Math.max(1,Math.round(rect.height*density));
    if(width!==canvas.width||height!==canvas.height) {
      if(active) finish({pointerId:active.id},false);
      canvas.width=width;canvas.height=height;
      render();
    }
  }
  function position(event){
    const rect=canvas.getBoundingClientRect();
    return boardPoint(rect,event.clientX,event.clientY);
  }
  function add(event){
    const point=position(event), points=active.stroke.points;
    if(point.x<0||point.y<0||point.x>BOARD.width||point.y>BOARD.height) return false;
    if(distance(points.at(-1),point)>.45) points.push(point);
    return true;
  }
  function finish(event,addEnd){
    if(active?.id!==event.pointerId) return;
    if(addEnd) add(event);
    const {stroke,id}=active;
    active=null;
    if(canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
    committed.push(stroke);
    undone=[];
    invalidate();
    change(committed);
  }
  function down(event){
    if(active||event.button!==0||(event.pointerType==='touch'&&!event.isPrimary)) return;
    const point=position(event);
    if(!Number.isFinite(point.x)||!Number.isFinite(point.y))return;
    event.preventDefault();
    active={id:event.pointerId,stroke:{...style,points:[point]}};
    try{ canvas.setPointerCapture(event.pointerId); }catch{}
    invalidate();
  }
  function move(event){
    if(active?.id!==event.pointerId) return;
    const events=event.getCoalescedEvents?.();
    for(const sample of events?.length?events:[event]){
      if(!add(sample)){finish(event,false);break;}
    }
    invalidate();
  }
  const up=e=>finish(e,true), cancel=e=>finish(e,false);
  const handlers={pointerdown:down,pointermove:move,pointerup:up,pointercancel:cancel,lostpointercapture:cancel};
  for(const [name,handler] of Object.entries(handlers)) canvas.addEventListener(name,handler);
  const observer=new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener('resize',resize);
  resize();
  function updated(){invalidate();change(committed);}
  function endActive(){if(active) finish({pointerId:active.id},false);}
  return {
    setStyle(next){style={...style,...next};},
    undo(){endActive();if(committed.length){undone.push(committed.pop());updated();}},
    redo(){endActive();if(undone.length){committed.push(undone.pop());updated();}},
    clear(){endActive();committed=[];undone=[];updated();},
    replace(next){endActive();committed=structuredClone(next);undone=[];updated();},
    read(){return structuredClone(committed);},
    exportInk(){render();return canvas;},
    destroy(){
      if(pending) cancelAnimationFrame(pending);
      observer.disconnect();
      window.removeEventListener('resize',resize);
      for(const [name,handler] of Object.entries(handlers)) canvas.removeEventListener(name,handler);
    },
  };
}
