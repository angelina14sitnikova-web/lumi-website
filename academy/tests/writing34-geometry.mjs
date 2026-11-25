import test from 'node:test';
import assert from 'node:assert/strict';
import {boardPoint} from '../writing/canvas.js';
import {drawnRoute,pathPosition,traceProgress} from '../writing/geometry.js';
const p=(x,y)=>({x,y});
const ink=(...points)=>({tool:'pencil',points});
const start={x:80,y:200,r:27}, end={x:560,y:200,r:27};

test('board coordinates are invariant when the display is resized',()=>{
  assert.deepEqual(boardPoint({left:20,top:10,width:320,height:215},180,117.5),p(320,215));
  assert.deepEqual(boardPoint({left:100,top:40,width:640,height:430},420,255),p(320,215));
});

test('tracing accepts separate strokes and reversed direction, and checks middle and end zones',()=>{
  const target={points:[start,end],tolerance:39};
  assert.equal(traceProgress([ink(end,p(320,207)),ink(p(310,187),start)],target),true);
  assert.equal(traceProgress([ink(start,p(118,201)),ink(p(532,200),end)],target),false);
  assert.equal(traceProgress([ink(start,p(470,200))],target),false);
  assert.equal(traceProgress([ink(p(82,248),p(558,248))],target),false);
  assert.equal(traceProgress([ink(p(82,248),p(558,248))],target,true),true);
});

test('closed polygons accept multiple lifted strokes with corners',()=>{
  const corners=[p(170,80),p(470,80),p(470,350),p(170,350),p(170,80)];
  const strokes=corners.slice(1).map((point,i)=>ink(corners[i],point));
  assert.equal(traceProgress(strokes,{points:corners,tolerance:34,closed:true}),true);
  assert.equal(traceProgress(strokes.slice(1),{points:corners,tolerance:34,closed:true}),false);
});

test('a character route follows connected ink and supports either side of an obstacle',()=>{
  const obstacles=[{x:320,y:200,r:54}];
  const target={start,end,obstacles};
  assert.equal(drawnRoute([ink(start,end)],target),null);
  assert.equal(drawnRoute([ink(start,p(180,200)),ink(p(450,200),end)],target),null);
  for(const y of [110,290]){
    const route=drawnRoute([ink(start,p(250,y),p(320,y)),ink(p(327,y),p(400,y),end)],target);
    assert.ok(route.length>40);
    assert.equal(Math.round(pathPosition(route,.5).y),y);
  }
});

test('a fork accepts either of two corridors and ignores an unfinished branch',()=>{
  const upper=[start,p(230,94),p(410,94),end], lower=[start,p(230,310),p(410,310),end];
  const target={start,end,corridors:[upper,lower,[start,p(185,200)]],width:22};
  assert.equal(drawnRoute([ink(start,p(185,200))],target),null);
  assert.ok(drawnRoute([ink(...upper)],target));
  assert.ok(drawnRoute([ink(...lower)],target));
});
