const box=(x,y,w,h,f,r=8)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;
const circle=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const oval=(x,y,a,b,f)=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${f}"/>`;
const path=(d,f,s='none',w=6)=>`<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const tan='#b77b54',cream='#fff0cd',mint='#72a889',ink='#394958',steel='#7e99a3',blue='#80b8d4',red='#cc6361',gold='#e1ab58';
const perforations=Array.from({length:15},(_,i)=>circle(58+i%5*16,87+Math.floor(i/5)*12,3,ink)).join('');
const bike=(pedal=true)=>circle(43,115,32,ink)+circle(43,115,25,'#e8eef1')+circle(137,115,32,ink)+circle(137,115,25,'#e8eef1')+
 path('M43 115 72 64l22 50H43m30-45h48l-27 45m43 1-25-70h16','none',mint,8)+path('M59 63h25m36-18h19','none',tan,8)+(pedal?circle(94,114,7,ink)+path('M94 114 105 125h13','none',steel):'');
const produce=(color,shape)=>shape+path('M90 56q2-18 18-23','none',mint,6)+oval(111,42,11,5,mint);
const stall=(background,color)=>box(25,83,130,58,background)+box(29,41,10,110,tan)+box(141,41,10,110,tan)+
 path('M27 40h126l15 31H12z',color)+path('M64 40 58 71m58-31 6 31','none',cream,11)+box(21,110,138,15,tan);
export const art45={
 'assembly-board':['Схема сборки',()=>box(12,10,156,160,'#fcf8ee',9)+path('M24 150h132','none','#e5d7b9',3)],
 'kettle-diagram':['Чайник',()=>path('M65 73 28 69l13 30 24 5m70-28q41-17 34 22-6 19-37 19','none',tan,11)+
   path('M55 67h72l19 44q9 41-51 41t-48-41z',red)+oval(91,63,42,9,gold)+circle(91,49,8,tan)],
 'ladle':['Половник',()=>oval(67,120,30,21,steel)+oval(65,115,24,11,'#b4c5c8')+path('M84 110 141 42','none',steel,11)],
 'colander':['Дуршлаг',()=>path('M37 77h106q-7 61-53 61T37 77z',steel)+perforations+path('M43 82H23m115 0h20','none',steel,9)+oval(90,75,55,11,'#b1c6d0')],
 'hammer':['Молоток',()=>path('M68 150 106 57','none',tan,17)+path('M48 37l85 16-4 28-37-5-19-16-28-3z',steel)],
 'ruler':['Линейка',()=>box(14,69,152,41,gold,5)+Array.from({length:11},(_,i)=>path(`M${25+i*13} 73v${i%2?12:22}`,'none',tan,2)).join('')],
 'scissors':['Ножницы',()=>path('M67 111 141 33 112 98 67 120 128 132 139 143 68 130z',steel)+circle(50,118,24,red)+circle(50,118,13,cream)+circle(80,143,18,red)+circle(80,143,9,cream)],
 'kettle-body':['Корпус чайника',()=>path('M41 74h98l13 38q6 43-62 42t-62-42z',red)+oval(90,75,49,12,'#99505e')],
 'spout':['Носик чайника',()=>path('M22 143q40-5 70-91l58 11q-18 65-87 93z',red)+oval(123,60,29,10,'#724d59')],
 'bike':['Велосипед',()=>bike()],
 'bike-no-pedal':['Велосипед без педали',()=>bike(false)],
 'handlebar':['Руль',()=>path('M89 140V73Q59 43 35 52m54 21q31-30 56-21','none',steel,15)+path('M34 52h25m60 0h27','none',ink,19)],
 'pedal':['Педаль',()=>path('M44 52 90 89','none',steel,13)+box(55,86,76,29,ink)+path('M63 98h59','none',steel,5)],
 'bike-seat':['Сиденье велосипеда',()=>path('M42 63q13-19 57-4l24 11 24 19q-4 24-43 11H52q-36-8-10-37z',ink)+path('M92 103v42','none',steel,12)],
 'drawer':['Выдвижной ящик',()=>box(26,56,128,75,tan)+box(34,62,112,59,'#dda882')+path('M77 87h26','none',cream,7)],
 'metal':['Металл',()=>path('M25 66 132 43l24 65-103 27z',steel)+path('M54 89 133 67m-74 35 54-15','none','#d8e4e6',5)],
 'glass':['Стекло',()=>path('M41 56 123 41l26 66-84 26z','#c7eafa',blue)+path('M67 74l36-17m-27 32 38-18','none','#fff',5)],
 'glass-cup':['Стеклянный стакан',()=>path('M48 51h84l-12 92H60z','#e0f5fa',blue)+oval(90,51,42,10,'#f2fafb')+path('M67 72l6 55','none','#fff',6)],
 'cloth-bag':['Тканевая сумка',()=>path('M63 72q-5-43 27-43t27 43','none',tan,8)+path('M45 63h90l16 77q-60 20-122 0z',mint)+path('M51 83h78m-73 46h69','none','#cce4c9',4)],
 'paper-box':['Бумажная коробка',()=>path('M29 68 91 43l60 25v60l-60 26-62-26z','#e9ca8e')+path('M29 68l62 24 60-24m-60 24v62','none',tan,4)],
 'plastic':['Пластмасса',()=>box(33,47,114,89,'#a871b1',13)+path('M55 75h43m-48 22h28','none','#e8c4eb',6)],
 'mug':['Кружка',()=>oval(129,97,26,22,tan)+oval(129,97,16,12,cream)+box(40,60,87,78,tan,12)+oval(84,61,43,11,'#865a4a')],
 'pencil':['Карандаш',()=>path('M32 144 49 103l77-73 21 21-78 73z',gold)+path('M32 144l17-41 20 21z',cream)+path('M32 144l8-21 14 5z',ink)],
 'marker':['Фломастер',()=>path('M53 127 126 54','none',blue,24)+path('M119 60 141 38','none',ink,24)+path('M42 138 51 130','none',blue,10)],
 'orange':['Апельсин',()=>produce(gold,circle(90,98,44,'#ed9b45'))],
 'carrot':['Морковь',()=>path('M53 73q37-27 74 7l-34 68q-14 25-28-1z','#e88e54')+path('M92 65 66 35m26 30 3-38m-2 37 29-28','none',mint,9)],
 'cucumber':['Огурец',()=>path('M44 125Q19 95 66 72l56-31q47-18 42 24-5 33-61 58-41 22-59 2z',mint)+path('M53 105q29-19 92-47','none','#9bc790',7)],
 'potato':['Картофель',()=>oval(90,91,62,41,'#caa269')+[[62,84],[99,100],[126,75],[52,102]].map(([x,y])=>circle(x,y,4,tan)).join('')],
 'cabbage':['Капуста',()=>circle(90,94,52,'#8bb37b')+path('M48 113q24-69 75-50m-62 67q27-46 83-32m-53 45 23-34','none','#c3d6a9',6)],
 'fruit-stand':['Фруктовый прилавок',()=>stall(cream,red)+circle(64,100,11,red)+circle(117,100,11,gold)],
 'veg-stand':['Овощной прилавок',()=>stall(cream,mint)+oval(60,100,13,9,mint)+oval(115,100,12,8,'#e88e54')],
 'toyshop':['Магазин игрушек',()=>stall(cream,blue)+circle(62,100,10,gold)+box(102,90,21,20,red,4)],
};

const personBadge=(accent,mark)=>box(24,35,132,110,'#fcf1db',20)+oval(90,118,38,23,accent)+circle(90,76,25,'#edbe94')+
 path('M67 75q-5-26 24-29 23 0 25 25l-19-8-13 9z','#835d4e')+circle(83,77,2.7,ink)+circle(100,77,2.7,ink)+
 path('M86 89q6 5 12 0','none','#a16154',2.8)+mark;
const frame=(tone)=>box(19,30,142,114,'#f0e1bb',9)+box(27,41,126,92,tone)+path('M27 116h126','none','#ae916d',7);
const houseArt=(tone)=>box(38,77,104,76,tone)+path('M23 85 89 30l67 55z',red)+box(80,106,27,47,tan,4)+box(49,95,25,24,blue,4)+box(115,94,16,24,blue,4);
const brickWall=()=>[0,1,2].map(row=>[0,1,2].map(i=>box(29+i*42+(row%2)*8,59+row*25,39,20,['#c77660','#be6555','#d99672'][(row+i)%3],3)).join('')).join('');
const salad=()=>path('M31 84h118q-10 54-59 55T31 84z',blue)+oval(90,84,59,13,'#d0ead8')+
 [[59,80,red],[77,84,gold],[110,81,mint],[119,75,red],[95,78,'#d896ae']].map(([a,b,col])=>box(a,b,13,10,col,3)).join('');
const letter=()=>box(33,53,114,74,'#faf1d8')+path('M35 58l55 43 55-43m-110 64 36-30m74 30-36-30','none','#b97955',4);
Object.assign(art45,{
 'kitchen':['Кухня',()=>frame('#c5d9d1')+box(38,88,103,33,tan,4)+box(62,63,38,19,steel,5)+path('M78 62V52h19','none',ink,4)],
 'clinic':['Кабинет врача',()=>frame('#e1eaf0')+box(51,96,83,20,blue)+path('M60 116v12m67-12v12','none',ink,4)+box(102,52,31,30,'#f9fbf4',3)+path('M118 57v20m-10-10h20','none',red,5)],
 'worksite':['Стройка',()=>box(21,119,140,14,tan)+path('M52 117V39h96v28m-96-28 63 28','none',steel,6)+brickWall()],
 'post-office':['Почта',()=>frame('#e6cb8f')+'<g transform="translate(44 32) scale(.52)">'+letter()+'</g>'],
 'flower-shop':['Цветочная мастерская',()=>stall(cream,'#bb8795')+path('M62 112 54 90m21 22 14-26m35 27-3-23','none',mint,4)+circle(54,87,8,red)+circle(89,86,8,gold)+circle(120,88,8,blue)],
 'kindergarten':['Детский сад',()=>houseArt('#e1b77f')+box(29,147,126,12,mint,4)+circle(92,70,7,cream)],
 'bus-stop':['Остановка',()=>path('M40 149V49m-14 4h33','none',steel,6)+box(68,74,78,59,blue)+path('M72 104h68m-57 14v25m48-25v25','none',tan,8)],
 'stethoscope':['Стетоскоп',()=>path('M48 36v30q0 37 36 37t35-37V36m-35 68v26q1 22 27 22t22-21','none',blue,9)+circle(133,124,12,steel)+box(40,28,17,20,ink,6)+box(110,28,17,20,ink,6)],
 'thermometer':['Термометр',()=>box(73,31,34,118,'#dfedf0',16)+path('M90 50v75','none',red,8)+circle(90,123,11,red)+path('M96 54h9m-9 15h9m-9 15h9m-9 15h9','none',ink,2)],
 'temperature':['Измеряют температуру',()=>personBadge(blue,box(104,90,39,10,'#b2cbd4',5))],
 'doctor':['Врач',()=>personBadge(steel,path('M89 105v17m-8-9h16','none',red,4))],
 'checkup':['Разговор после осмотра',()=>personBadge(blue,box(107,100,43,28,'#ffebc1',5)+path('M115 106h27m-27 9h25','none',tan,2))],
 'knife':['Кухонный нож',()=>path('M23 106q62-8 115-41v29q-32 24-115 20z',steel)+box(111,107,51,14,tan,6)],
 'salad':['Фруктовый салат',salad],
 'cut-fruit':['Нарезанные фрукты',()=>[[58,104,red],[68,70,gold],[98,88,mint],[117,118,gold],[129,63,'#dc7894']].map(([a,b,col])=>box(a-15,b-12,30,24,col,5)).join('')],
 'bread':['Хлеб',()=>path('M35 122V74q0-33 55-33t55 33v48q-27 18-110 0z',tan)+path('M64 62l11 11m11-15 11 12m9-11 13 12','none',cream,5)],
 'soup':['Суп',()=>salad()+oval(90,86,53,11,'#edb570')+circle(70,86,4,mint)+circle(113,83,5,mint)],
 'brick':['Кирпич',()=>box(33,75,114,48,red,5)+path('M33 75l25-20h89v20z','#e88f72')],
 'trowel':['Мастерок',()=>path('M29 139V71l97 62z',steel)+path('M78 106l18-33h34','none',tan,9)],
 'brick-wall':['Кирпичная стена',brickWall],
 'paint-wall':['Покрашенная стена',()=>box(30,49,120,85,mint,3)+path('M42 65h77m-78 13h42','none','#abd3ab',7)],
 'wood-frame':['Деревянная рама',()=>path('M40 40h100v100H40zM90 40v100M40 90h100','none',tan,12)],
 'house':['Дом',()=>houseArt(cream)],
 'roller':['Валик',()=>box(34,45,99,27,'#a1c79e',8)+path('M135 59q21 34-43 35v16','none',steel,7)+box(82,104,19,45,tan,7)],
 'paint-tin':['Краска',()=>box(45,55,90,80,'#b8d1d0',8)+oval(90,55,45,12,mint)+path('M49 67q2 55 80 30','none',steel)+path('M64 69v27m12-32v18','none',mint,8)],
 'scale':['Весы',()=>path('M90 43v86H60m30 0h29M35 72h110','none',tan,7)+path('M23 80h47q0 29-24 29T23 80m85 0h47q0 29-24 29t-23-29',gold)],
 'groceries':['Покупки',()=>path('M42 85h96l-12 49H52z',tan)+circle(66,77,18,red)+circle(108,74,23,gold)+path('M63 112h52','none',cream,5)],
 'envelope':['Письмо',letter],
 'delivered-letter':['Доставленное письмо',()=>box(37,65,105,52,blue)+path('M67 119v28','none',tan,8)+'<g transform="translate(57 18) scale(.42)">'+letter()+'</g>'],
 'group-play':['Игра детей',()=>personBadge(mint,circle(126,111,19,gold)+circle(53,111,17,red))],
 'steering':['Руль автобуса',()=>circle(90,90,57,ink)+circle(90,90,45,'#fbe9ca')+path('M44 86h92m-46 1v45','none',ink,9)+circle(90,91,13,ink)],
 'bus':['Автобус',()=>box(17,55,146,70,gold,13)+[0,1,2].map(i=>box(31+i*41,62,36,27,blue,4)).join('')+
 circle(48,126,14,ink)+circle(128,126,14,ink)],
 'bus-trip':['Поездка на автобусе',()=>box(20,137,141,12,steel)+art45.bus[1]()],
 'bouquet':['Букет',()=>path('M47 84 90 146l43-62z','#d8bca2')+path('M73 103 61 62m28 44V43m9 63 24-44','none',mint,6)+circle(62,61,21,red)+circle(90,46,22,'#ce8fab')+circle(122,61,21,gold)],
});
