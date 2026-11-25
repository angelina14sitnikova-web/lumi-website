// Board coordinates stay the same in portrait and landscape.
export const BOARD = { width: 640, height: 430 };
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const at = (a,b,t) => ({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});

export function samplePath(points, step = 8) {
  if (!points.length) return [];
  const samples = [points[0]];
  for (let i=1;i<points.length;i++) {
    const a=points[i-1], b=points[i], pieces=Math.ceil(distance(a,b)/step);
    for(let part=1;part<=pieces;part++) samples.push(at(a,b,part/pieces));
  }
  return samples;
}

function hits(point, targets, radius) {
  return targets.some(target=>distance(point,target)<=radius);
}

function targetProgress(points, marks, tolerance, minimum) {
  const covered=marks.map(mark=>hits(mark,points,tolerance));
  return covered.filter(Boolean).length>=Math.ceil(marks.length*minimum);
}

/**
 * Group progress by route, not by elapsed time or exact line thickness. Keep
 * each stroke separate so a lift never becomes an invisible connecting line.
 */
export function traceProgress(strokes, target, assisted = false) {
  const tolerance=target.tolerance*(assisted?1.27:1);
  const drawing=strokes.filter(s=>s.tool!=='eraser'&&s.points.length>=2);
  const all=drawing.flatMap(s=>samplePath(s.points));
  const path=samplePath(target.points,12);
  const sections=target.closed?8:5;
  const coverage=targetProgress(all,path,tolerance,target.coverage??(target.closed?.78:.72));
  const checkpoints=Array.from({length:sections},(_,i)=>path[Math.round(i*(path.length-1)/sections)]);
  const mids=checkpoints.slice(1);
  if(!coverage) return false;
  if(target.openCircle) return targetProgress(all,mids,tolerance,.75);
  if(!checkpoints.every(marker=>hits(marker,all,tolerance*1.04))) return false;
  if(!target.closed) return hits(path.at(-1),all,tolerance);
  // Closing a figure does not require one continuous stroke. Nearby points
  // must cover the seam and both sides to allow lifted polygon corners.
  const seam=[path[0],path[1],path.at(-2)];
  return targetProgress(all,seam,tolerance*.68,1);
}

function bucket(point, size) {
  return [Math.floor(point.x/size),Math.floor(point.y/size)];
}

/**
 * Build connections only inside the drawn path. Small gaps between separately
 * entered strokes may be joined, provided the join never crosses an obstacle.
 */
export function drawnRoute(strokes,{start,end,corridors=[],obstacles=[],width=42,join=23}) {
  const nodes=[], graph=[], cells=new Map();
  const guide=corridors.flatMap(path=>samplePath(path));
  const inside=p=>(!guide.length||hits(p,guide,width))&&
    obstacles.every(o=>distance(o,p)>(o.r??0)+4);
  function connect(a,b) {
    if(distance(nodes[a],nodes[b])<=join&&samplePath([nodes[a],nodes[b]],4).every(inside)){
      graph[a].push(b);graph[b].push(a);
    }
  }
  for(const stroke of strokes){
    if(stroke.tool==='eraser'||stroke.points.length<2) continue;
    let prior=-1, strokeStart=nodes.length;
    for(const point of samplePath(stroke.points,7)){
      if(!inside(point)){prior=-1;continue;}
      const index=nodes.length;
      nodes.push(point); graph.push([]);
      if(prior>=0) connect(index,prior);
      const [x,y]=bucket(point,join);
      // Connect endpoints to nearby points in other strokes to allow a lift.
      for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++){
        for(const neighbour of cells.get((x+dx)+','+(y+dy))??[]){
          if(neighbour<strokeStart) connect(index,neighbour);
        }
      }
      const key=x+','+y;
      if(!cells.has(key)) cells.set(key,[]);
      cells.get(key).push(index);
      prior=index;
    }
  }
  const roots=[], parents=new Map();
  nodes.forEach((p,i)=>{if(distance(p,start)<=(start.r??37)){roots.push(i);parents.set(i,-1);}});
  for(let i=0;i<roots.length;i++){
    const index=roots[i];
    if(distance(nodes[index],end)<=(end.r??37)){
      const path=[];
      for(let cursor=index;cursor>=0;cursor=parents.get(cursor)) path.push(nodes[cursor]);
      return path.reverse();
    }
    for(const neighbour of graph[index]){
      if(!parents.has(neighbour)){parents.set(neighbour,index);roots.push(neighbour);}
    }
  }
  return null;
}

export function pathPosition(path,t) {
  const lengths=path.slice(1).map((point,i)=>distance(path[i],point));
  let remaining=lengths.reduce((sum,length)=>sum+length,0)*Math.max(0,Math.min(1,t));
  for(let i=0;i<lengths.length;i++){
    if(remaining<=lengths[i]&&lengths[i]>0) return at(path[i],path[i+1],remaining/lengths[i]);
    remaining-=lengths[i];
  }
  return path.at(-1);
}
