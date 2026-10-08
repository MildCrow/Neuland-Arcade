(function(){
  'use strict';
  var W=800,H=500,TAU=Math.PI*2,PI=Math.PI;
  var DISP="'Unbounded','Arial Black',sans-serif",BODY="'Instrument Sans',system-ui,sans-serif",MONO="'JetBrains Mono',ui-monospace,monospace";

 /* ---------- Sprache ---------- */
 var lang='de';
  function X(de,en){return lang==='de'?de:en;}
  function L(o){return o[lang]||o.de;}
  var reduced=false;
  try{reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
function $(id){return document.getElementById(id);}

/* ---------- Mauszeiger ---------- */
function svg32(inner){return "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>"+inner+"</svg>";}
var ARROWP='M4 3 L4 24 L10 18.5 L14.5 28 L18 26.5 L13.5 17.5 L22 17.5 Z';
function arrow(fill,stroke){return svg32("<path d='"+ARROWP+"' fill='"+fill+"' stroke='"+stroke+"' stroke-width='1.5' stroke-linejoin='round'/>");}
function pixelArrow(){
  var rows=['X','XX','XXX','XXXX','XXXXX','XXXXXX','XXXXXXX','XXXXXXXX','XXXXXXXXX','XXXXX','XX.XX','X..XX','...XX','...XX'];
  var cols=['#ff5c5c','#ff8a5c','#ffb15c','#ffe45c','#b6f06a','#7cf0c9','#5cd6ff','#5c9dff','#8ea0ff','#a98cff','#d58cff','#ff8cc8','#ff6f9a','#ff5c5c'];
  var out="<g shape-rendering='crispEdges'>";
  rows.forEach(function(r,y){for(var x=0;x<r.length;x++){if(r[x]==='X')out+="<rect x='"+(2+x*2)+"' y='"+(2+y*2)+"' width='2' height='2' fill='"+cols[y]+"'/>";}});
  return svg32(out+"</g>");
}
var CURS=[
  {id:'cur-standard',de:'Standard',en:'Default',hx:4,hy:3,svg:arrow('#fff','#000')},
  {id:'cur-fadenkreuz',de:'Fadenkreuz',en:'Crosshair',hx:16,hy:16,svg:svg32("<g fill='none' stroke='#9fe8ff' stroke-width='2'><circle cx='16' cy='16' r='8'/><path d='M16 2v8M16 22v8M2 16h8M22 16h8'/></g><circle cx='16' cy='16' r='1.5' fill='#fff'/>")},
  {id:'cur-leuchtpunkt',de:'Leuchtpunkt',en:'Glow Dot',hx:16,hy:16,svg:svg32("<defs><radialGradient id='g'><stop offset='0' stop-color='#fff'/><stop offset='.35' stop-color='#9fb0ff'/><stop offset='1' stop-color='#9fb0ff' stop-opacity='0'/></radialGradient></defs><circle cx='16' cy='16' r='14' fill='url(#g)'/>")},
  {id:'cur-goldpfeil',de:'Goldpfeil',en:'Gold Arrow',hx:4,hy:3,svg:arrow('#ffc65a','#3b2a05')},
  {id:'cur-komet',de:'Komet',en:'Comet',hx:9,hy:9,svg:svg32("<defs><linearGradient id='t' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffd9a0'/><stop offset='1' stop-color='#ff8a4a' stop-opacity='0'/></linearGradient></defs><path d='M9 9 L30 20 L20 30 Z' fill='url(#t)'/><circle cx='9' cy='9' r='5.5' fill='#fff3d6' stroke='#ffb55e' stroke-width='2'/>")},
  {id:'cur-ring',de:'Ring',en:'Ring',hx:16,hy:16,svg:svg32("<circle cx='16' cy='16' r='10' fill='none' stroke='#ffc65a' stroke-width='3'/><circle cx='16' cy='16' r='2' fill='#ffc65a'/>")},
  {id:'cur-stern',de:'Stern',en:'Star',hx:16,hy:16,svg:svg32("<polygon points='16,3 19.5,12 29,12.5 21.5,18.5 24,28 16,22.5 8,28 10.5,18.5 3,12.5 12.5,12' fill='#ffe08a' stroke='#7a5300' stroke-width='1.5' stroke-linejoin='round'/>")},
  {id:'cur-raute',de:'Raute',en:'Diamond',hx:16,hy:16,svg:svg32("<path d='M16 3 L29 16 L16 29 L3 16 Z' fill='#6fd6ff' stroke='#06304a' stroke-width='2'/><circle cx='16' cy='16' r='2.2' fill='#06304a'/>")},
  {id:'cur-mint',de:'Minzpfeil',en:'Mint Arrow',hx:4,hy:3,svg:arrow('#7cf0c9','#06352a')},
  {id:'cur-rose',de:'Rosepfeil',en:'Rose Arrow',hx:4,hy:3,svg:arrow('#ff8fb0','#4a0f26')},
  {id:'cur-herz',de:'Herz',en:'Heart',hx:16,hy:16,svg:svg32("<path d='M16 28 C4 18 4 8 10 6 C13 5 15.5 7 16 9 C16.5 7 19 5 22 6 C28 8 28 18 16 28 Z' fill='#ff8fb0' stroke='#4a0f26' stroke-width='1.8' stroke-linejoin='round'/>")},
  {id:'cur-blitz',de:'Blitz',en:'Bolt',hx:16,hy:16,svg:svg32("<polygon points='18,2 7,18 14,18 11,30 25,12 17,12' fill='#ffe45c' stroke='#5a4300' stroke-width='1.6' stroke-linejoin='round'/>")},
  {id:'cur-dreieck',de:'Raumschiff',en:'Starship',hx:16,hy:16,svg:svg32("<polygon points='16,3 28,28 16,22 4,28' fill='#7cf0c9' stroke='#06352a' stroke-width='1.8' stroke-linejoin='round'/>")},
  {id:'cur-pixel',de:'Pixelpfeil',en:'Pixel Arrow',hx:2,hy:2,secret:true,svg:pixelArrow()}
];
var CUR={};
CURS.forEach(function(c){
  c.css=c.id==='cur-standard'?'auto':'url("data:image/svg+xml,'+encodeURIComponent(c.svg)+'") '+c.hx+' '+c.hy+', auto';
  CUR[c.id]=c;
});

/* ---------- Belohnungen ---------- */
var COIN="<svg class='coin' viewBox='0 0 20 20' aria-hidden='true'><circle cx='10' cy='10' r='9' fill='#ffc65a' stroke='#b8801a' stroke-width='1.5'/><circle cx='10' cy='10' r='5.5' fill='none' stroke='#b8801a' stroke-width='1.5'/></svg>";
var DEFAULT_OWNED=['bg-tiefe','cur-standard','theme-standard'];
var REW={};
function addRew(id,type,de,en,extra){var r={type:type,name:{de:de,en:en}};if(extra)Object.keys(extra).forEach(function(k){r[k]=extra[k];});REW[id]=r;}
addRew('bg-tiefe','bg','Tiefe','Deep',{cls:'bgx-tiefe'});
addRew('bg-raster','bg','Neonraster','Neon Grid',{cls:'bgx-raster'});
addRew('bg-sternenstaub','bg','Sternenstaub','Stardust',{cls:'bgx-sternenstaub'});
addRew('bg-daemmerung','bg','Dämmerung','Dusk',{cls:'bgx-daemmerung'});
addRew('bg-aurora','bg','Aurora','Aurora',{cls:'bgx-aurora'});
addRew('bg-lava','bg','Lavafeld','Lava Field',{cls:'bgx-lava'});
addRew('bg-ozean','bg','Ozean','Ocean',{cls:'bgx-ozean'});
addRew('bg-streifen','bg','Streifen','Stripes',{cls:'bgx-streifen'});
addRew('bg-nebel','bg','Nebel','Nebula',{cls:'bgx-nebel'});
addRew('bg-punkte','bg','Punktraster','Halftone',{cls:'bgx-punkte'});
addRew('bg-warp','bg','Hyperraum','Hyperspace',{cls:'bgx-fx',fx:'warp',price:200,premium:true});
addRew('bg-regen','bg','Datenregen','Data Rain',{cls:'bgx-fx',fx:'regen',price:250,premium:true});
addRew('bg-gluehwurm','bg','Glühwurmnacht','Firefly Night',{cls:'bgx-fx',fx:'gluehwurm',price:300,premium:true});
addRew('bg-plasma','bg','Plasma','Plasma',{cls:'bgx-fx',fx:'plasma',price:350,premium:true});
addRew('bg-sternschnuppen','bg','Sternschnuppen','Shooting Stars',{cls:'bgx-fx',fx:'sternschnuppen',price:400,premium:true});
addRew('bg-wellen','bg','Tiefsee','Deep Sea',{cls:'bgx-fx',fx:'wellen',price:450,premium:true});
addRew('bg-gewitter','bg','Gewitter','Thunderstorm',{cls:'bgx-fx',fx:'gewitter',price:500,premium:true});
addRew('bg-sonnenaufgang','bg','Sonnenaufgang','Sunrise',{cls:'bgx-sonnenaufgang'});
addRew('bg-kristall','bg','Kristall','Crystal',{cls:'bgx-kristall'});
addRew('bg-schnee','bg','Schneefall','Snowfall',{cls:'bgx-schnee'});
CURS.forEach(function(c){addRew(c.id,'cursor',c.de,c.en,c.secret?{secret:true}:null);});
addRew('cur-komet2','cursor','Kometenschweif','Comet Trail',{fx:'komet',price:120,premium:true});
addRew('cur-neon','cursor','Neonband','Neon Ribbon',{fx:'neon',price:180,premium:true});
addRew('cur-funkenregen','cursor','Funkenregen','Spark Shower',{fx:'funken',price:240,premium:true});
addRew('cur-satellit','cursor','Satellitenring','Orbit Ring',{fx:'satellit',price:300,premium:true});
addRew('cur-feuer','cursor','Flammenspur','Flame Trail',{fx:'feuer',price:260,premium:true});
addRew('cur-blitz2','cursor','Blitzschlag','Lightning',{fx:'blitz',price:280,premium:true});
addRew('cur-blueten','cursor','Blütenregen','Blossoms',{fx:'blueten',price:300,premium:true});
function addTheme(id,de,en,accent,price,anim){addRew(id,'theme',de,en,price?{accent:accent,price:price,premium:true,anim:!!anim}:{accent:accent});}
addTheme('theme-standard','Standard','Default','#8ea0ff',0);
addTheme('theme-rubin','Rubin','Ruby','#ff7d8d',100);
addTheme('theme-smaragd','Smaragd','Emerald','#5fe0a8',100);
addTheme('theme-eis','Eisblau','Ice Blue','#7fe3ff',100);
addTheme('theme-violett','Violett','Violet','#c58cff',100);
addTheme('theme-orange','Mandarine','Tangerine','#ff9f5a',100);
addTheme('theme-regenbogen','Regenbogen','Rainbow','#8ea0ff',350,true);
addRew('g-stapel','game','Stapel','Stack',{game:'stapel'});
addRew('g-schwerkraft','game','Schwerkraftläufer','Gravity Runner',{game:'lauf'});
addRew('g-meteor','game','Meteorregen','Meteor Shower',{game:'meteor'});
addRew('g-takt','game','Taktfall','Beatfall',{game:'takt'});
addRew('g-orbit','game','Orbit','Orbit',{game:'orbit'});
addRew('g-puls','game','Pulsschlag','Pulse',{game:'puls'});
addRew('g-ziegel','game','Ziegelbruch','Brickbreaker',{game:'ziegel'});
addRew('g-paare','game','Paare','Pairs',{game:'paare'});
addRew('g-nova','game','Nova','Nova',{game:'nova'});
var TYPE_LABEL={game:{de:'Spiel',en:'Game'},bg:{de:'Hintergrund',en:'Background'},cursor:{de:'Mauszeiger',en:'Cursor'},theme:{de:'Farbthema',en:'Color theme'}};
function rewardLabel(id){var r=REW[id];return L(TYPE_LABEL[r.type])+' „'+L(r.name)+'“';}

/* ---------- Spiele und Missionen ---------- */
var GAMES={
  funken:{hue:190,name:{de:'Funkenjagd',en:'Spark Hunt'},unit:{de:'Punkte',en:'points'},main:'score',unlock:null,
    blurb:{de:'Funken leuchten auf und schrumpfen. Fange sie, bevor sie verglühen.',en:'Sparks flare up and shrink. Catch them before they burn out.'},
    hint:{de:'Klicke oder tippe auf die Funken, bevor sie verglühen. Drei verglühte Funken beenden die Runde.',en:'Click or tap the sparks before they burn out. Three lost sparks end the round.'},
    art:"<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><circle cx='32' cy='32' r='26' stroke-dasharray='3 5' opacity='.5'/><circle cx='32' cy='32' r='15'/><circle cx='32' cy='32' r='4' fill='currentColor'/></svg>",
    missions:[
      {id:'f1',text:{de:'Fange 10 Funken in einer Runde.',en:'Catch 10 sparks in one round.'},test:function(s){return s.score>=10;},reward:'bg-raster'},
      {id:'f2',text:{de:'Fange 6 Funken in Folge ohne Fehlklick.',en:'Catch 6 sparks in a row without a miss-click.'},test:function(s){return s.maxCombo>=6;},reward:'cur-fadenkreuz'},
      {id:'f3',text:{de:'Fange 30 Funken in einer Runde.',en:'Catch 30 sparks in one round.'},test:function(s){return s.score>=30;},reward:'g-stapel'},
      {id:'fh',hard:true,coins:150,text:{de:'Fange 60 Funken in einer Runde.',en:'Catch 60 sparks in one round.'},test:function(s){return s.score>=60;}}]},
  echo:{hue:280,name:{de:'Echo',en:'Echo'},unit:{de:'Runden',en:'rounds'},main:'rounds',unlock:null,
    blurb:{de:'Neun Felder leuchten in einer Folge auf. Spiele sie aus dem Gedächtnis nach.',en:'Nine pads light up in a sequence. Play it back from memory.'},
    hint:{de:'Merke dir die Folge und tippe sie nach. Mit den Tasten 1 bis 9 geht es auch.',en:'Remember the sequence and repeat it. Keys 1 to 9 work too.'},
    art:"<svg viewBox='0 0 64 64' fill='currentColor'><g opacity='.35'><rect x='6' y='6' width='14' height='14' rx='2'/><rect x='25' y='6' width='14' height='14' rx='2'/><rect x='44' y='6' width='14' height='14' rx='2'/><rect x='6' y='25' width='14' height='14' rx='2'/><rect x='6' y='44' width='14' height='14' rx='2'/><rect x='44' y='25' width='14' height='14' rx='2'/><rect x='25' y='44' width='14' height='14' rx='2'/><rect x='44' y='44' width='14' height='14' rx='2'/></g><rect x='25' y='25' width='14' height='14' rx='2'/></svg>",
    missions:[
      {id:'e1',text:{de:'Schaffe 4 Runden.',en:'Clear 4 rounds.'},test:function(s){return s.rounds>=4;},reward:'bg-sternenstaub'},
      {id:'e2',text:{de:'Schaffe 7 Runden.',en:'Clear 7 rounds.'},test:function(s){return s.rounds>=7;},reward:'cur-leuchtpunkt'},
      {id:'e3',text:{de:'Schaffe 10 Runden.',en:'Clear 10 rounds.'},test:function(s){return s.rounds>=10;},reward:'g-schwerkraft'},
      {id:'eh',hard:true,coins:150,text:{de:'Schaffe 14 Runden.',en:'Clear 14 rounds.'},test:function(s){return s.rounds>=14;}}]},
  stapel:{hue:35,name:{de:'Stapel',en:'Stack'},unit:{de:'Blöcke',en:'blocks'},main:'height',unlock:'g-stapel',
    blurb:{de:'Ein Block gleitet hin und her. Lass ihn passend fallen und baue den Turm.',en:'A block slides back and forth. Drop it on target and build the tower.'},
    hint:{de:'Klicke, tippe oder drücke die Leertaste, um den Block fallen zu lassen. Was übersteht, fällt ab.',en:'Click, tap or press Space to drop the block. Whatever overhangs falls off.'},
    art:"<svg viewBox='0 0 64 64' fill='currentColor'><rect x='14' y='46' width='36' height='10' rx='1'/><rect x='18' y='34' width='30' height='10' rx='1' opacity='.75'/><rect x='20' y='22' width='24' height='10' rx='1' opacity='.55'/><rect x='24' y='10' width='18' height='10' rx='1' opacity='.4'/></svg>",
    missions:[
      {id:'s1',text:{de:'Stapele 8 Blöcke.',en:'Stack 8 blocks.'},test:function(s){return s.height>=8;},reward:'bg-daemmerung'},
      {id:'s2',text:{de:'Stapele 15 Blöcke.',en:'Stack 15 blocks.'},test:function(s){return s.height>=15;},reward:'cur-goldpfeil'},
      {id:'s3',text:{de:'Setze 3 perfekte Blöcke in Folge.',en:'Land 3 perfect blocks in a row.'},test:function(s){return s.perfectRun>=3;},reward:'g-meteor'},
      {id:'sh',hard:true,coins:200,text:{de:'Stapele 30 Blöcke.',en:'Stack 30 blocks.'},test:function(s){return s.height>=30;}}]},
  lauf:{hue:340,name:{de:'Schwerkraftläufer',en:'Gravity Runner'},unit:{de:'Meter',en:'meters'},main:'meters',unlock:'g-schwerkraft',
    blurb:{de:'Du rennst auf Boden und Decke. Dreh die Schwerkraft und weiche den Blöcken aus.',en:'You run on floor and ceiling. Flip gravity and dodge the blocks.'},
    hint:{de:'Klicke, tippe oder drücke die Leertaste, um die Schwerkraft zu drehen. Das geht nur am Boden oder an der Decke.',en:'Click, tap or press Space to flip gravity. You can only flip while on the floor or ceiling.'},
    art:"<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 12h52M6 52h52' opacity='.5'/><rect x='14' y='38' width='14' height='14' fill='currentColor'/><path d='M44 40V22M38 28l6-7 6 7'/></svg>",
    missions:[
      {id:'l1',text:{de:'Laufe 150 Meter weit.',en:'Run 150 meters.'},test:function(s){return s.meters>=150;},reward:'cur-komet'},
      {id:'l2',text:{de:'Laufe 400 Meter weit.',en:'Run 400 meters.'},test:function(s){return s.meters>=400;},reward:'bg-lava'},
      {id:'l3',text:{de:'Sammle 8 Orbs in einer Runde.',en:'Collect 8 orbs in one run.'},test:function(s){return s.orbs>=8;},reward:'g-takt'},
      {id:'lh',hard:true,coins:200,text:{de:'Laufe 800 Meter weit.',en:'Run 800 meters.'},test:function(s){return s.meters>=800;}}]},
  meteor:{hue:12,name:{de:'Meteorregen',en:'Meteor Shower'},unit:{de:'Sekunden',en:'seconds'},main:'seconds',unlock:'g-meteor',
    blurb:{de:'Weiche den fallenden Felsen aus und sammle Sterne.',en:'Dodge the falling rocks and collect stars.'},
    hint:{de:'Bewege Maus oder Finger über das Feld, oder nutze die Pfeiltasten. Ein Treffer beendet die Runde.',en:'Move the mouse or your finger across the field, or use the arrow keys. One hit ends the run.'},
    art:"<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><path d='M10 8l28 28' opacity='.4'/><path d='M20 6l26 26' opacity='.6'/><circle cx='46' cy='38' r='11' fill='currentColor' opacity='.85'/></svg>",
    missions:[
      {id:'m1',text:{de:'Überlebe 30 Sekunden.',en:'Survive 30 seconds.'},test:function(s){return s.seconds>=30;},reward:'bg-aurora'},
      {id:'m2',text:{de:'Sammle 8 Sterne in einer Runde.',en:'Collect 8 stars in one run.'},test:function(s){return s.stars>=8;},reward:'cur-ring'},
      {id:'m3',text:{de:'Überlebe 60 Sekunden.',en:'Survive 60 seconds.'},test:function(s){return s.seconds>=60;},reward:'g-orbit'},
      {id:'mh',hard:true,coins:250,text:{de:'Überlebe 100 Sekunden.',en:'Survive 100 seconds.'},test:function(s){return s.seconds>=100;}}]},
  takt:{hue:150,name:{de:'Taktfall',en:'Beatfall'},unit:{de:'Treffer',en:'hits'},main:'hits',unlock:'g-takt',
    blurb:{de:'Noten fallen in vier Spuren. Triff sie genau auf der Linie.',en:'Notes fall down four lanes. Hit them right on the line.'},
    hint:{de:'Tippe auf die Spuren oder drücke D, F, J und K. Fünf verpasste Noten beenden die Runde.',en:'Tap the lanes or press D, F, J and K. Five missed notes end the run.'},
    art:"<svg viewBox='0 0 64 64' fill='currentColor'><g opacity='.3'><rect x='8' y='6' width='10' height='52' rx='2'/><rect x='22' y='6' width='10' height='52' rx='2'/><rect x='36' y='6' width='10' height='52' rx='2'/><rect x='50' y='6' width='10' height='52' rx='2'/></g><rect x='8' y='38' width='10' height='7' rx='2'/><rect x='36' y='18' width='10' height='7' rx='2'/><rect x='50' y='44' width='10' height='7' rx='2'/></svg>",
    missions:[
      {id:'t1',text:{de:'Triff 20 Noten.',en:'Hit 20 notes.'},test:function(s){return s.hits>=20;},reward:'bg-ozean'},
      {id:'t2',text:{de:'Spiele eine Serie von 15 Treffern.',en:'Play a streak of 15 hits.'},test:function(s){return s.combo>=15;},reward:'cur-stern'},
      {id:'t3',text:{de:'Triff 50 Noten.',en:'Hit 50 notes.'},test:function(s){return s.hits>=50;},reward:'g-puls'},
      {id:'th',hard:true,coins:250,text:{de:'Spiele eine Serie von 40 Treffern.',en:'Play a streak of 40 hits.'},test:function(s){return s.combo>=40;}}]},
  orbit:{hue:210,name:{de:'Orbit',en:'Orbit'},unit:{de:'Sekunden',en:'seconds'},main:'seconds',unlock:'g-orbit',
    blurb:{de:'Du kreist um die Mitte. Wechsle die Bahn und weiche den Sperren aus.',en:'You circle the core. Switch lanes to dodge the barriers.'},
    hint:{de:'Klicke, tippe oder drücke die Leertaste, um die Bahn zu wechseln. Sperren leuchten kurz vor dem Erscheinen auf.',en:'Click, tap or press Space to switch lanes. Barriers flash briefly before they turn solid.'},
    art:"<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><circle cx='32' cy='32' r='12' opacity='.5'/><circle cx='32' cy='32' r='25'/><circle cx='32' cy='32' r='3' fill='currentColor'/><circle cx='51' cy='19' r='5' fill='currentColor'/></svg>",
    missions:[
      {id:'o1',text:{de:'Überlebe 20 Sekunden.',en:'Survive 20 seconds.'},test:function(s){return s.seconds>=20;},reward:'cur-raute'},
      {id:'o2',text:{de:'Überlebe 45 Sekunden.',en:'Survive 45 seconds.'},test:function(s){return s.seconds>=45;},reward:'bg-streifen'},
      {id:'o3',text:{de:'Sammle 10 Orbs in einer Runde.',en:'Collect 10 orbs in one run.'},test:function(s){return s.orbs>=10;},reward:'cur-mint'},
      {id:'oh',hard:true,coins:250,text:{de:'Überlebe 80 Sekunden.',en:'Survive 80 seconds.'},test:function(s){return s.seconds>=80;}}]},
  puls:{hue:55,name:{de:'Pulsschlag',en:'Pulse'},unit:{de:'Treffer',en:'hits'},main:'hits',unlock:'g-puls',
    blurb:{de:'Ein Ring schrumpft auf sein Ziel. Triff im richtigen Moment.',en:'A ring shrinks onto its target. Hit at the right moment.'},
    hint:{de:'Klicke auf das Ziel, wenn der Ring genau darauf liegt. Mit der Leertaste geht es auch. Drei Fehler beenden die Runde.',en:'Click the target when the ring lines up with it. Space works too. Three misses end the run.'},
    art:"<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><circle cx='32' cy='32' r='27' opacity='.35'/><circle cx='32' cy='32' r='18' opacity='.65'/><circle cx='32' cy='32' r='9'/><circle cx='32' cy='32' r='2.5' fill='currentColor'/></svg>",
    missions:[
      {id:'p1',text:{de:'Triff 10 Pulse.',en:'Land 10 pulses.'},test:function(s){return s.hits>=10;},reward:'bg-nebel'},
      {id:'p2',text:{de:'Triff 5 Pulse in Folge perfekt.',en:'Land 5 perfect pulses in a row.'},test:function(s){return s.perfectRun>=5;},reward:'bg-punkte'},
      {id:'p3',text:{de:'Triff 25 Pulse.',en:'Land 25 pulses.'},test:function(s){return s.hits>=25;},reward:'cur-rose'},
      {id:'ph',hard:true,coins:250,text:{de:'Triff 10 Pulse in Folge perfekt.',en:'Land 10 perfect pulses in a row.'},test:function(s){return s.perfectRun>=10;}}]},
  snake:{hue:100,name:{de:'Neonschlange',en:'Neon Snake'},unit:{de:'Punkte',en:'points'},main:'score',unlock:null,
    blurb:{de:'Friss Leuchtpunkte und werde länger. Wände und dein eigener Schwanz sind tödlich.',en:'Eat glowing dots and grow longer. Walls and your own tail are deadly.'},
    hint:{de:'Steuere mit den Pfeiltasten, WASD oder durch Wischen. Goldene Punkte bringen 3 Punkte, verschwinden aber schnell.',en:'Steer with the arrow keys, WASD or by swiping. Golden dots are worth 3 points but vanish quickly.'},
    art:"<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'><path d='M10 50h30V30H22V14h32' opacity='.85'/><circle cx='54' cy='14' r='3' fill='currentColor' stroke='none'/></svg>",
    missions:[
      {id:'n1',coins:25,reward:'g-ziegel',text:{de:'Friss 8 Punkte.',en:'Eat 8 points.'},test:function(s){return s.score>=8;}},
      {id:'n2',coins:40,text:{de:'Friss 20 Punkte.',en:'Eat 20 points.'},test:function(s){return s.score>=20;}},
      {id:'n3',coins:60,reward:'g-paare',text:{de:'Erreiche Länge 35.',en:'Reach length 35.'},test:function(s){return s.length>=35;}},
      {id:'nh',hard:true,coins:300,text:{de:'Friss 60 Punkte in einer Runde.',en:'Eat 60 points in one run.'},test:function(s){return s.score>=60;}}]},
  ziegel:{hue:15,name:{de:'Ziegelbruch',en:'Brickbreaker'},unit:{de:'Punkte',en:'points'},main:'score',unlock:'g-ziegel',
    blurb:{de:'Lenke den Ball mit dem Schläger und zertrümmere die Ziegelwand.',en:'Bounce the ball with your paddle and smash the brick wall.'},
    hint:{de:'Bewege Maus oder Finger oder nutze die Pfeiltasten. Klick oder Leertaste schießt den Ball ab. Die Aufprallstelle bestimmt den Winkel.',en:'Move the mouse or your finger, or use the arrow keys. Click or Space launches the ball. Where it hits the paddle sets the angle.'},
    art:"<svg viewBox='0 0 64 64' fill='currentColor'><rect x='6' y='8' width='16' height='8' rx='2'/><rect x='24' y='8' width='16' height='8' rx='2' opacity='.7'/><rect x='42' y='8' width='16' height='8' rx='2'/><rect x='15' y='19' width='16' height='8' rx='2' opacity='.7'/><rect x='33' y='19' width='16' height='8' rx='2'/><circle cx='36' cy='42' r='4'/><rect x='22' y='54' width='24' height='5' rx='2.5'/></svg>",
    missions:[
      {id:'z1',coins:20,text:{de:'Zerstöre 30 Ziegel in einer Runde.',en:'Destroy 30 bricks in one run.'},test:function(s){return s.bricks>=30;},reward:'bg-sonnenaufgang'},
      {id:'z2',coins:30,text:{de:'Erreiche Level 3.',en:'Reach level 3.'},test:function(s){return s.level>=3;},reward:'cur-herz'},
      {id:'z3',coins:40,text:{de:'Erreiche Level 5.',en:'Reach level 5.'},test:function(s){return s.level>=5;},reward:'g-nova'},
      {id:'zh',hard:true,coins:350,text:{de:'Erreiche Level 9.',en:'Reach level 9.'},test:function(s){return s.level>=9;}}]},
  paare:{hue:290,name:{de:'Paare',en:'Pairs'},unit:{de:'Level',en:'levels'},main:'levels',unlock:'g-paare',
    blurb:{de:'Decke Karten auf und finde alle Paare, bevor die Zeit abläuft.',en:'Flip cards and find every pair before time runs out.'},
    hint:{de:'Klicke zwei Karten an. Gleiche Symbole verschwinden und bringen Zeit zurück. Mit jedem Level wird es voller.',en:'Click two cards. Matching symbols vanish and give time back. Every level gets more crowded.'},
    art:"<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='3'><rect x='7' y='10' width='22' height='30' rx='4' opacity='.6'/><rect x='35' y='24' width='22' height='30' rx='4'/><path d='M46 33l3 6h-6z' fill='currentColor' stroke='none'/></svg>",
    missions:[
      {id:'a1',coins:20,text:{de:'Schaffe 3 Level.',en:'Clear 3 levels.'},test:function(s){return s.levels>=3;},reward:'bg-kristall'},
      {id:'a2',coins:30,text:{de:'Schaffe ein Level ohne Fehlgriff.',en:'Clear a level without a single mistake.'},test:function(s){return s.flawless>=1;},reward:'cur-blitz'},
      {id:'a3',coins:60,text:{de:'Schaffe 6 Level.',en:'Clear 6 levels.'},test:function(s){return s.levels>=6;}},
      {id:'ah',hard:true,coins:300,text:{de:'Schaffe 10 Level.',en:'Clear 10 levels.'},test:function(s){return s.levels>=10;}}]},
  nova:{hue:225,name:{de:'Nova',en:'Nova'},unit:{de:'Punkte',en:'points'},main:'score',unlock:'g-nova',
    blurb:{de:'Dein Schiff schießt von selbst. Weiche aus, sammle Extras und überlebe Welle um Welle.',en:'Your ship fires on its own. Dodge, grab power-ups and survive wave after wave.'},
    hint:{de:'Bewege Maus oder Finger oder nutze die Pfeiltasten. Gegner, die unten durchkommen, kosten ein Leben. Extras: D doppelt, S Schild, + Leben.',en:'Move the mouse or your finger, or use the arrow keys. Enemies that slip past cost a life. Power-ups: D double shot, S shield, + life.'},
    art:"<svg viewBox='0 0 64 64' fill='currentColor'><path d='M32 8 L46 50 L32 42 L18 50 Z'/><circle cx='14' cy='16' r='3' opacity='.5'/><circle cx='50' cy='22' r='3' opacity='.5'/><circle cx='22' cy='28' r='2' opacity='.35'/></svg>",
    missions:[
      {id:'v1',coins:25,text:{de:'Erreiche Welle 3.',en:'Reach wave 3.'},test:function(s){return s.wave>=3;},reward:'cur-dreieck'},
      {id:'v2',coins:40,text:{de:'Besiege 60 Gegner in einer Runde.',en:'Defeat 60 enemies in one run.'},test:function(s){return s.kills>=60;},reward:'bg-schnee'},
      {id:'v3',coins:60,text:{de:'Erreiche Welle 7.',en:'Reach wave 7.'},test:function(s){return s.wave>=7;}},
      {id:'vh',hard:true,coins:350,text:{de:'Erreiche Welle 12.',en:'Reach wave 12.'},test:function(s){return s.wave>=12;}}]}
};
var ORDER=['funken','echo','stapel','lauf','meteor','takt','orbit','puls','snake','ziegel','paare','nova'];
var RANKS=[
  {min:0,name:{de:'Funkenfänger',en:'Spark Catcher'}},
  {min:6,name:{de:'Kartograf',en:'Cartographer'}},
  {min:14,name:{de:'Pfadfinder',en:'Pathfinder'}},
  {min:24,name:{de:'Entdecker',en:'Explorer'}},
  {min:34,name:{de:'Pionier',en:'Pioneer'}},
  {min:48,name:{de:'Legende',en:'Legend'}}
];
var LOCK="<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='5' y='11' width='14' height='10' rx='2'/><path d='M8 11V8a4 4 0 0 1 8 0v3'/></svg>";

/* ---------- IndexedDB ---------- */
var STORES=['missions','rewards','stats','settings'];
var dbp=null,persistent=true;
function openDB(){
  return new Promise(function(res,rej){
    var timer=setTimeout(function(){rej(new Error('timeout'));},2500);
    function done(f,v){clearTimeout(timer);f(v);}
    try{
      if(!window.indexedDB){rej(new Error('no indexedDB'));return;}
      var r=indexedDB.open('neuland-arcade',1);
      r.onupgradeneeded=function(){var db=r.result;STORES.forEach(function(n){if(!db.objectStoreNames.contains(n))db.createObjectStore(n);});};
      r.onsuccess=function(){done(res,r.result);};
      r.onerror=function(){done(rej,r.error);};
      r.onblocked=function(){done(rej,new Error('blocked'));};
    }catch(e){done(rej,e);}
  });
}
function dbGetAll(store){
  return dbp.then(function(db){return new Promise(function(res,rej){
    var out={};var t=db.transaction(store,'readonly');var rq=t.objectStore(store).openCursor();
    rq.onsuccess=function(){var c=rq.result;if(c){out[c.key]=c.value;c.continue();}else res(out);};
    rq.onerror=function(){rej(rq.error);};
  });});
}
function dbPut(store,key,val){
  return dbp.then(function(db){return new Promise(function(res,rej){
    var t=db.transaction(store,'readwrite');t.objectStore(store).put(val,key);
    t.oncomplete=function(){res();};t.onerror=function(){rej(t.error);};t.onabort=function(){rej(t.error);};
  });}).catch(function(){});
}
function dbClearAll(){
  return dbp.then(function(db){return new Promise(function(res,rej){
    var t=db.transaction(STORES,'readwrite');STORES.forEach(function(n){t.objectStore(n).clear();});
    t.oncomplete=function(){res();};t.onerror=function(){rej(t.error);};
  });}).catch(function(){});
}

/* ---------- Zustand ---------- */
var S={missions:{},rewards:{},stats:{},settings:{bg:'bg-tiefe',cursor:'cur-standard',sound:true,lang:null,coins:0,egg:false,theme:'theme-standard',eggs:{},daily:null,ach:{},earned:0,langSwitched:false,night:false}};
var view={name:'hub'},stopGame=null,resetAsk=false,collTab='bg';
var $app=$('app'),$toasts=$('toasts'),$bg=$('bgfx'),$nav=$('nav');

function owned(id){return DEFAULT_OWNED.indexOf(id)>-1||!!S.rewards[id];}
function allMissions(){var o=[];ORDER.forEach(function(gid){GAMES[gid].missions.forEach(function(m){o.push({id:m.id,text:m.text,reward:m.reward,gid:gid,coins:m.coins,hard:m.hard});});});return o;}
function requirementFor(rid){var a=allMissions();for(var i=0;i<a.length;i++){if(a[i].reward===rid)return a[i];}return null;}
function doneCount(gid){return GAMES[gid].missions.filter(function(m){return S.missions[m.id];}).length;}
function doneTotal(){return allMissions().filter(function(m){return S.missions[m.id];}).length;}
function coins(){return Number(S.settings.coins)||0;}
function addCoins(n){S.settings.coins=coins()+n;dbPut('settings','coins',S.settings.coins);if(n>0){S.settings.earned=(Number(S.settings.earned)||0)+n;dbPut('settings','earned',S.settings.earned);}}
function notSecret(k){return !REW[k].secret;}
function isOpen(gid){var u=GAMES[gid].unlock;return !u||owned(u);}
function ofType(t){return Object.keys(REW).filter(function(k){return REW[k].type===t;});}
function rankFor(n){var r=RANKS[0],nx=null;for(var i=0;i<RANKS.length;i++){if(n>=RANKS[i].min){r=RANKS[i];nx=RANKS[i+1]||null;}}return{rank:r,next:nx};}

function applyLook(){
  var b=REW[S.settings.bg]||REW['bg-tiefe'];
  $bg.className='bgfx '+b.cls;
  if(b.fx)startBgFx(S.settings.bg);else stopBgFx();
  var root=document.documentElement.style,de=document.documentElement,cd=REW[S.settings.cursor]||REW['cur-standard'];
  if(cd.fx){
    stopCursorFx();startCursorFx(S.settings.cursor);
    root.setProperty('--cur','none');root.setProperty('--cur-pt','none');
  }else{
    stopCursorFx();
    var c=CUR[S.settings.cursor]||CUR['cur-standard'];
    if(c.id==='cur-standard'){root.setProperty('--cur','auto');root.setProperty('--cur-pt','pointer');}
    else{root.setProperty('--cur',c.css);root.setProperty('--cur-pt',c.css);}
  }
  var th=REW[S.settings.theme]||REW['theme-standard'];
  if(th.anim){de.classList.add('accent-cycle');root.removeProperty('--accent');}
  else{de.classList.remove('accent-cycle');root.setProperty('--accent',th.accent);}
}

/* ---------- Ton ---------- */
var ac=null;
function beep(f,d,type,v){
  if(!S.settings.sound)return;
  try{
    var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    if(!ac)ac=new AC();
    if(ac.state==='suspended')ac.resume();
    var o=ac.createOscillator(),g=ac.createGain();
    o.type=type||'sine';o.frequency.value=f;
    var t=ac.currentTime,vol=v||.05,dur=d||.12;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+dur+.02);
  }catch(e){}
}

/* ---------- Kopfleiste ---------- */
function renderNav(bump){
  $nav.innerHTML='<div class="nav-in"><button class="logo" data-act="home" aria-label="Neuland Arcade"><span class="mark"></span><span class="lt">Neuland</span></button><span class="sp"></span>'+
    '<button class="btn ghost sm shopbtn" data-act="shop">'+X('Shop','Shop')+'<span class="bal'+(bump?' bump':'')+'">'+COIN+coins()+'</span></button>'+
    '<button class="btn ghost sm pbtn" data-act="profile" aria-label="'+X('Profil','Profile')+'"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="7" r="3.4"/><path d="M3.5 17c.8-3.2 3.3-4.8 6.5-4.8s5.7 1.6 6.5 4.8"/></svg><span class="lbl">'+X('Profil','Profile')+'</span></button>'+
    '<div class="seg" role="group" aria-label="Sprache / Language"><button data-act="lang" data-id="de" aria-pressed="'+(lang==='de')+'">DE</button><button data-act="lang" data-id="en" aria-pressed="'+(lang==='en')+'">EN</button></div>'+
    '<button class="btn ghost sm snd" data-act="sound" aria-pressed="'+!!S.settings.sound+'"><i class="dot'+(S.settings.sound?' on':'')+'"></i><span class="lbl">'+X(S.settings.sound?'Ton an':'Ton aus',S.settings.sound?'Sound on':'Sound off')+'</span></button></div>';
}

/* ---------- Missionen abschliessen ---------- */
function confetti(){
  if(reduced)return;
  var box=document.createElement('div');box.className='confetti';
  var cols=['#ffc65a','#8ea0ff','#6fd6a0','#ff8fa3','#7fe3ff'];
  for(var i=0;i<38;i++){
    var s=document.createElement('i'),a=-PI/2+(Math.random()-.5)*2.4,d=150+Math.random()*280;
    s.style.cssText='--dx:'+(Math.cos(a)*d).toFixed(0)+'px;--dy:'+(Math.sin(a)*d).toFixed(0)+'px;--r:'+(Math.random()*720-360).toFixed(0)+'deg;background:'+cols[i%5]+';animation-delay:'+(Math.random()*.1).toFixed(2)+'s';
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(function(){if(box.parentNode)box.parentNode.removeChild(box);},1700);
}
function pushToast(o){
  var el=document.createElement('div');el.className='toast';
  var btn=o.btn?'<button class="btn gold sm" data-act="'+o.btn.act+'"'+(o.btn.id?' data-id="'+o.btn.id+'"':'')+'>'+o.btn.label+'</button>':'';
  el.innerHTML='<div class="tx"><p class="t1">'+o.t1+'</p>'+(o.t2?'<p class="t2">'+o.t2+'</p>':'')+'<p class="t3">'+o.t3+'</p></div>'+btn+'<button class="x" data-act="close-toast" aria-label="'+X('Schließen','Close')+'">×</button>';
  $toasts.appendChild(el);
  while($toasts.children.length>3)$toasts.removeChild($toasts.firstChild);
  setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},10000);
}
function completeMission(gid,m){
  if(S.missions[m.id])return;
  var now=Date.now(),t3='',btn=null;
  S.missions[m.id]={at:now};dbPut('missions',m.id,S.missions[m.id]);
  if(m.reward){
    var r=REW[m.reward];
    if(!S.rewards[m.reward]){S.rewards[m.reward]={at:now};dbPut('rewards',m.reward,S.rewards[m.reward]);}
    t3=X('Neu: ','New: ')+rewardLabel(m.reward);
    btn=r.type==='game'?{act:'open-game',id:r.game,label:X('Öffnen','Open')}:{act:'equip',id:m.reward,label:X('Ausrüsten','Equip')};
  }
  if(m.coins){
    addCoins(m.coins);
    t3=(t3?t3+' · ':'')+'+'+m.coins+X(' Münzen',' coins');
    if(!btn)btn={act:'shop',label:X('Zum Shop','To the shop')};
  }
  pushToast({t1:m.hard?X('Meistermission geschafft','Master mission complete'):X('Mission geschafft','Mission complete'),t2:L(m.text),t3:t3,btn:btn});
  confetti();if(m.hard)setTimeout(confetti,300);
  renderMissions(m.id);renderNav(!!m.coins);
  beep(523,.12,'triangle',.06);setTimeout(function(){beep(784,.18,'triangle',.06);},120);setTimeout(function(){beep(1046,.22,'triangle',.05);},260);
  checkAch();
}

/* ---------- Startseite ---------- */
function lockedLine(id){
  var r=REW[id];
  if(r.premium)return X('Im Shop für ','In the shop for ')+r.price+X(' Münzen',' coins');
  var req=requirementFor(id);
  return req?L(GAMES[req.gid].name)+': '+L(req.text):'';
}
function tileHtml(id,kind,i){
  var r=REW[id],own=owned(id),key=kind==='bg'?'bg':(kind==='cursor'?'cursor':'theme'),active=S.settings[key]===id;
  var lock='<span class="lockic">'+LOCK+'</span>',prev;
  if(kind==='theme')prev='<div class="pv">'+themeSwatch(r)+(own?'':lock)+'</div>';
  else if(r.fx&&own)prev='<div class="pv"><canvas class="pvx" data-kind="'+(kind==='bg'?'bg':'cur')+'" data-fx="'+r.fx+'" width="160" height="90" aria-hidden="true"></canvas></div>';
  else if(r.fx)prev='<div class="pv pvc"><span class="price">'+COIN+r.price+'</span>'+lock+'</div>';
  else if(kind==='bg')prev='<div class="pv '+r.cls+'">'+(own?'':lock)+'</div>';
  else prev='<div class="pv pvc"><img alt="" width="32" height="32" src="data:image/svg+xml,'+encodeURIComponent(CUR[id].svg)+'">'+(own?'':lock)+'</div>';
  if(own){
    return '<button class="tile own'+(active?' active':'')+'" style="--i:'+i+'" data-act="equip" data-id="'+id+'" aria-pressed="'+active+'">'+prev+'<b>'+L(r.name)+'</b><span>'+(active?X('Aktiv','Active'):X('Ausrüsten','Equip'))+'</span></button>';
  }
  var inner=prev+'<b>'+L(r.name)+'</b><span><b>'+(r.premium?X('Shop.','Shop.'):X('Gesperrt.','Locked.'))+'</b> '+lockedLine(id)+'</span>';
  if(r.premium)return '<button class="tile locked" style="--i:'+i+'" data-act="shop">'+inner+'</button>';
  return '<div class="tile locked" style="--i:'+i+'">'+inner+'</div>';
}
function cardHtml(gid,i){
  var g=GAMES[gid];
  if(isOpen(gid)){
    var pips=g.missions.map(function(m){return '<i class="pip'+(S.missions[m.id]?' on':'')+'"></i>';}).join('');
    var best=S.stats[gid]&&S.stats[gid].best?S.stats[gid].best:0;
    return '<article class="card" style="--h:'+g.hue+';--i:'+i+'"><div class="art">'+g.art+'</div><div class="body"><h3>'+L(g.name)+'</h3><p class="desc">'+L(g.blurb)+'</p><div class="pips">'+pips+'<span class="mono">'+doneCount(gid)+'/'+g.missions.length+'</span></div><p class="best-line mono">'+X('Bestwert','Best')+': '+best+' '+L(g.unit)+'</p><button class="btn" data-act="play" data-id="'+gid+'">'+X('Spielen','Play')+'</button></div></article>';
  }
  var req=requirementFor(g.unlock);
  return '<article class="card locked" style="--h:'+g.hue+';--i:'+i+'"><div class="art">'+LOCK+'</div><div class="body"><h3>'+L(g.name)+'</h3><p class="req"><b>'+X('Versiegelt.','Sealed.')+'</b> '+X('Wird frei durch eine Mission in „','Unlocked by a mission in “')+L(GAMES[req.gid].name)+X('“: ','”: ')+L(req.text)+'</p></div></article>';
}
function collHtml(){
  var ids=ofType(collTab).filter(function(k){return !REW[k].secret||owned(k);});
  return ids.map(function(k,i){return tileHtml(k,collTab,i);}).join('');
}
function titleHtml(){
  var words=['Neuland','Arcade'],n=0;
  return words.map(function(w,wi){
    var letters=w.split('').map(function(c){return '<span class="ch" style="--i:'+(n++)+'" aria-hidden="true">'+c+'</span>';}).join('');
    return '<span class="ln'+(wi===1?' out':'')+'">'+letters+'</span>';
  }).join('');
}
function renderHub(anim){
  stopPreviews();
  view={name:'hub'};
  var total=allMissions().length,done=doneTotal();
  var rk=rankFor(done);
  var openGames=ORDER.filter(isOpen).length;
  var bgs=ofType('bg').filter(notSecret),curs=ofType('cursor').filter(notSecret);
  var C=289.03,off=(C*(1-done/total)).toFixed(2);
  var foot;
  if(resetAsk){foot='<span class="warn">'+X('Alle Missionen und Belohnungen löschen?','Delete all missions and rewards?')+'</span><span class="acts"><button class="btn ghost sm" data-act="reset-yes">'+X('Ja, löschen','Yes, delete')+'</button><button class="btn ghost sm" data-act="reset-no">'+X('Abbrechen','Cancel')+'</button></span>';}
  else{foot='<span>'+(persistent?X('Dein Fortschritt liegt in der IndexedDB-Datenbank dieses Browsers.','Your progress is stored in this browser’s IndexedDB database.'):X('IndexedDB ist hier nicht verfügbar. Der Fortschritt gilt nur, bis du die Seite schließt.','IndexedDB is not available here. Progress lasts only until you close the page.'))+'</span><span class="acts"><button class="btn ghost sm" data-act="reset-ask">'+X('Spielstand zurücksetzen','Reset progress')+'</button></span>';}
  var nextTxt=rk.next?X('Noch '+(rk.next.min-done)+' Missionen bis ','Next: '+(rk.next.min-done)+' missions to ')+L(rk.next.name):X('Alle Missionen geschafft.','Every mission cleared.');
  $app.style.removeProperty('--h');
  $app.className='app view view-hub'+(anim?' enter':'');
  $app.innerHTML=
   '<section class="hero"><div><p class="eyebrow">'+X('Spiele, die noch keiner kennt','Games nobody has seen before')+'</p><h1 aria-label="Neuland Arcade">'+titleHtml()+'</h1><p class="sub">'+X('Schaffe Missionen und schalte neue Spiele, Hintergründe und Mauszeiger frei.','Clear missions to unlock new games, backgrounds and cursors.')+'</p></div>'+
   '<div class="rank"><div class="ring" role="img" aria-label="'+done+' / '+total+'"><svg viewBox="0 0 116 116"><circle class="bgc" cx="58" cy="58" r="46"/><circle class="fg" cx="58" cy="58" r="46" style="--off:'+off+'"/></svg><div class="n"><span id="cnt">'+(anim&&!reduced?0:done)+'</span><small>/ '+total+'</small></div></div>'+
   '<div><p class="lbl">'+X('Rang','Rank')+'</p><p class="name">'+L(rk.rank.name)+'</p><p class="nxt">'+nextTxt+'</p></div></div></section>'+
   dailyHtml()+'<div class="chips"><button class="chip chipbtn" data-act="shop">'+COIN+'<b>'+coins()+'</b> '+X('Münzen · Shop','coins · Shop')+'</button><span class="chip"><b>'+openGames+'/'+ORDER.length+'</b> '+X('Spiele','games')+'</span><span class="chip"><b>'+bgs.filter(owned).length+'/'+bgs.length+'</b> '+X('Hintergründe','backgrounds')+'</span><span class="chip"><b>'+curs.filter(owned).length+'/'+curs.length+'</b> '+X('Mauszeiger','cursors')+'</span></div>'+
   '<div class="sec-head"><h2 class="sec">'+X('Spiele','Games')+'</h2></div><div class="games">'+ORDER.map(cardHtml).join('')+'</div>'+
   '<div class="sec-head"><h2 class="sec">'+X('Sammlung','Collection')+'</h2><div class="tabs" role="tablist"><button role="tab" data-act="tab" data-id="bg" aria-selected="'+(collTab==='bg')+'">'+X('Hintergründe','Backgrounds')+'</button><button role="tab" data-act="tab" data-id="cursor" aria-selected="'+(collTab==='cursor')+'">'+X('Mauszeiger','Cursors')+'</button><button role="tab" data-act="tab" data-id="theme" aria-selected="'+(collTab==='theme')+'">'+X('Farben','Colors')+'</button></div></div>'+
   '<div class="coll">'+collHtml()+'</div>'+
   '<footer class="foot">'+foot+'</footer>';
  if(anim&&!reduced&&done>0){
    var el=$('cnt'),t0=performance.now();
    (function tick(t){
      if(!el.isConnected)return;
      var p=Math.min(1,(t-t0-350)/900);
      if(p<0)p=0;
      el.textContent=Math.round(done*(1-Math.pow(1-p,3)));
      if(p<1)requestAnimationFrame(tick);
    })(t0);
  }
  startPreviews();
}

/* ---------- Spielansicht ---------- */
function updateBest(){
  var el=$('best');if(!el||view.name!=='game')return;
  var g=GAMES[view.gid],b=S.stats[view.gid]&&S.stats[view.gid].best?S.stats[view.gid].best:0;
  el.textContent=X('Bestwert ','Best ')+b+' '+L(g.unit);
}
function renderMissions(fresh){
  var el=$('mlist');if(!el||view.name!=='game')return;
  el.innerHTML=GAMES[view.gid].missions.map(function(m){
    var d=!!S.missions[m.id],rw=m.reward?rewardLabel(m.reward):COIN+m.coins+X(' Münzen',' coins');
    return '<li class="mi'+(d?' done':'')+(m.hard?' hard':'')+(m.id===fresh?' fresh':'')+'"><span class="chk" aria-hidden="true">'+(d?'✓':'')+'</span><div><p>'+L(m.text)+(m.hard?'<span class="tag">'+X('Meister','Master')+'</span>':'')+'</p><p class="rw">'+X('Belohnung: ','Reward: ')+rw+'</p></div></li>';
  }).join('');
}
function fillGame(){
  if(view.name!=='game')return;
  var g=GAMES[view.gid];
  $('gBack').textContent=X('← Übersicht','← Overview');
  $('gTitle').textContent=L(g.name);
  $('gHint').textContent=L(g.hint);
  $('pTitle').textContent=X('Missionen','Missions');
  $('cv').setAttribute('aria-label',X('Spielfeld ','Play field ')+L(g.name));
  updateBest();renderMissions();
}
function renderGame(gid){
  stopPreviews();
  var g=GAMES[gid];
  view={name:'game',gid:gid};
  $app.style.setProperty('--h',g.hue);
  $app.className='app view view-game enter';
  $app.innerHTML=
   '<div class="gbar"><button class="btn ghost sm" data-act="back" id="gBack"></button><h2 id="gTitle"></h2><span class="best mono" id="best"></span></div>'+
   '<div class="stage"><div class="cvwrap"><div class="frame"><canvas id="cv" tabindex="0"></canvas></div><p class="hint" id="gHint"></p></div><aside class="panel"><h3 id="pTitle"></h3><ol id="mlist"></ol></aside></div>';
  fillGame();
  var api={
    report:function(stats){g.missions.forEach(function(m){if(!S.missions[m.id]&&m.test(stats))completeMission(gid,m);});},
    finish:function(stats){
      var val=stats[g.main]||0,cur=S.stats[gid]||{best:0,plays:0};
      cur={best:Math.max(cur.best||0,val),plays:(cur.plays||0)+1};
      S.stats[gid]=cur;dbPut('stats',gid,cur);updateBest();
      if(new Date().getHours()<5&&!S.settings.night){S.settings.night=true;dbPut('settings','night',true);}
      checkAch();
    }
  };
  stopGame=runGame(gid,$('cv'),api);
}
function leaveGame(){if(stopGame){stopGame();stopGame=null;}renderHub(true);window.scrollTo(0,0);}

/* ---------- Spiel-Rahmen ---------- */
function T(ctx,s,x,y,o){o=o||{};ctx.font=(o.weight||500)+' '+(o.size||16)+'px '+(o.font||BODY);ctx.fillStyle=o.color||'#e8ebf4';ctx.textAlign=o.align||'left';ctx.textBaseline='middle';ctx.fillText(s,x,y);}
function overlay(ctx,title,l1,l2){
  ctx.fillStyle='rgba(8,11,20,.82)';ctx.fillRect(0,0,W,H);
  T(ctx,title,W/2,H/2-34,{size:28,weight:800,font:DISP,align:'center'});
  if(l1)T(ctx,l1,W/2,H/2+8,{size:18,align:'center'});
  if(l2)T(ctx,l2,W/2,H/2+40,{size:14,align:'center',color:'#9aa3bd'});
}
function runGame(gid,cv,api){
  var ctx=cv.getContext('2d');
  var dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  var g=FACTORY[gid]({ctx:ctx,api:api,name:function(){return L(GAMES[gid].name);}});
  var alive=true,raf=0,last=performance.now();
  function frame(t){
    if(!alive)return;
    var dt=Math.min(.05,(t-last)/1000);last=t;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(8,11,20,.74)';ctx.fillRect(0,0,W,H);
    g.update(dt);g.draw();
    raf=requestAnimationFrame(frame);
  }
  function pos(e){var r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
  function down(e){e.preventDefault();cv.focus({preventScroll:true});g.pointer(pos(e));}
  function move(e){if(g.move)g.move(pos(e));}
  function key(e){if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;if(g.key&&g.key(e))e.preventDefault();}
  function keyup(e){if(g.keyup)g.keyup(e);}
  cv.addEventListener('pointerdown',down);
  cv.addEventListener('pointermove',move);
  window.addEventListener('keydown',key);
  window.addEventListener('keyup',keyup);
  raf=requestAnimationFrame(frame);
  return function(){alive=false;cancelAnimationFrame(raf);cv.removeEventListener('pointerdown',down);cv.removeEventListener('pointermove',move);window.removeEventListener('keydown',key);window.removeEventListener('keyup',keyup);};
}
var FACTORY={};

/* ---------- Funkenjagd ---------- */
FACTORY.funken=function(o){
  var ctx=o.ctx,api=o.api;
  var st='ready',sparks=[],parts=[],score=0,combo=0,maxC=0,lives=3,spawnT=0,t0=0;
  function stats(){return{score:score,maxCombo:maxC};}
  function burst(x,y,hue,n){for(var i=0;i<n;i++){var a=Math.random()*TAU,s=60+Math.random()*180;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.45+Math.random()*.3,t:0,hue:hue});}}
  function start(){st='play';sparks=[];parts=[];score=0;combo=0;maxC=0;lives=3;spawnT=.3;}
  function spawn(){sparks.push({x:70+Math.random()*(W-140),y:80+Math.random()*(H-150),r0:36+Math.random()*12,t:0,life:Math.max(.75,1.7-score*.022),hue:190+Math.random()*80});}
  function rad(s){return Math.max(6,s.r0*(1-s.t/s.life));}
  function lose(){lives--;combo=0;beep(120,.2,'sawtooth',.04);if(lives<=0){st='over';t0=0;api.finish(stats());}}
  return{
    update:function(dt){
      if(st==='play'){
        spawnT-=dt;
        if(spawnT<=0){spawn();spawnT=Math.max(.42,1.05-score*.016);}
        for(var i=sparks.length-1;i>=0;i--){
          var s=sparks[i];s.t+=dt;
          if(s.t>=s.life){burst(s.x,s.y,0,6);sparks.splice(i,1);lose();if(st==='over')break;}
        }
      }
      if(st==='over')t0+=dt;
      for(var j=parts.length-1;j>=0;j--){var p=parts[j];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;if(p.t>=p.l)parts.splice(j,1);}
    },
    pointer:function(p){
      if(st==='ready'){start();return;}
      if(st==='over'){if(t0>.5)start();return;}
      for(var i=sparks.length-1;i>=0;i--){
        var s=sparks[i],d=Math.hypot(p.x-s.x,p.y-s.y);
        if(d<=Math.max(rad(s),16)+10){
          sparks.splice(i,1);score++;combo++;maxC=Math.max(maxC,combo);
          burst(s.x,s.y,s.hue,14);beep(440+Math.min(combo,12)*40,.09,'triangle',.05);
          api.report(stats());return;
        }
      }
      combo=0;beep(160,.08,'square',.025);
    },
    draw:function(){
      sparks.forEach(function(s){
        var r=rad(s);
        ctx.strokeStyle='hsla('+s.hue+',80%,70%,.28)';ctx.lineWidth=1.5;ctx.setLineDash([4,6]);
        ctx.beginPath();ctx.arc(s.x,s.y,s.r0,0,TAU);ctx.stroke();ctx.setLineDash([]);
        var gr=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,r*1.8);
        gr.addColorStop(0,'hsla('+s.hue+',95%,85%,1)');gr.addColorStop(.35,'hsla('+s.hue+',90%,62%,.9)');gr.addColorStop(1,'hsla('+s.hue+',90%,55%,0)');
        ctx.fillStyle=gr;ctx.beginPath();ctx.arc(s.x,s.y,r*1.8,0,TAU);ctx.fill();
      });
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle=p.hue?'hsl('+p.hue+',90%,70%)':'#7b8299';ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      for(var i=0;i<3;i++){ctx.beginPath();ctx.arc(26+i*24,28,7,0,TAU);if(i<lives){ctx.fillStyle='#8ea0ff';ctx.fill();}else{ctx.strokeStyle='#4a5272';ctx.lineWidth=2;ctx.stroke();}}
      T(ctx,String(score),W/2,30,{size:28,font:MONO,align:'center'});
      if(combo>=2)T(ctx,X('Serie ×','Streak ×')+combo,W-24,30,{size:16,font:MONO,align:'right',color:'#ffc65a'});
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Fange die Funken, bevor sie verglühen.','Catch the sparks before they burn out.'));
      if(st==='over')overlay(ctx,X('Runde vorbei','Round over'),score+X(' Funken gefangen',' sparks caught'),X('Klicke für eine neue Runde. Beste Serie: ','Click for a new round. Best streak: ')+maxC);
    }
  };
};

/* ---------- Echo ---------- */
FACTORY.echo=function(o){
  var ctx=o.ctx,api=o.api;
  var SZ=118,GAP=16,OX=(W-(3*SZ+2*GAP))/2,OY=(H-(3*SZ+2*GAP))/2+24;
  var NOTES=[262,294,330,392,440,523,587,659,784];
  var st='ready',seq=[],idx=0,rounds=0,lit=-1,litT=0,timer=0,showI=0,phase=0,bad=-1,t0=0;
  function rnd(){return Math.floor(Math.random()*9);}
  function dur(){return Math.max(.25,.5-rounds*.02);}
  function light(i,d){lit=i;litT=d;beep(NOTES[i],d*.9,'sine',.06);}
  function startShow(){st='show';showI=0;timer=.7;phase=0;idx=0;lit=-1;}
  function begin(){seq=[rnd(),rnd()];rounds=0;bad=-1;startShow();}
  function press(i){
    if(st==='ready'){begin();return;}
    if(st==='over'){if(t0>.5)begin();return;}
    if(st!=='input')return;
    light(i,.22);
    if(i===seq[idx]){
      idx++;
      if(idx>=seq.length){rounds++;api.report({rounds:rounds});st='wait';timer=.8;}
    }else{bad=i;st='over';t0=0;beep(110,.4,'sawtooth',.05);api.finish({rounds:rounds});}
  }
  return{
    update:function(dt){
      if(litT>0){litT-=dt;if(litT<=0)lit=-1;}
      if(st==='show'){
        timer-=dt;
        if(timer<=0){
          if(phase===0){
            if(showI>=seq.length){st='input';idx=0;}
            else{light(seq[showI],dur());phase=1;timer=dur();}
          }else{phase=0;timer=.18;showI++;}
        }
      }
      if(st==='wait'){timer-=dt;if(timer<=0){seq.push(rnd());startShow();}}
      if(st==='over')t0+=dt;
    },
    pointer:function(p){
      if(st==='ready'||st==='over'){press(-1);return;}
      for(var i=0;i<9;i++){
        var x=OX+(i%3)*(SZ+GAP),y=OY+Math.floor(i/3)*(SZ+GAP);
        if(p.x>=x&&p.x<=x+SZ&&p.y>=y&&p.y<=y+SZ){press(i);return;}
      }
    },
    key:function(e){
      var n=parseInt(e.key,10);
      if(n>=1&&n<=9){press(n-1);return true;}
      return false;
    },
    draw:function(){
      for(var i=0;i<9;i++){
        var x=OX+(i%3)*(SZ+GAP),y=OY+Math.floor(i/3)*(SZ+GAP),h=(i*40+200)%360,on=(i===lit);
        ctx.save();
        if(on){ctx.shadowColor='hsl('+h+',90%,60%)';ctx.shadowBlur=28;}
        ctx.fillStyle=on?'hsl('+h+',85%,62%)':'hsla('+h+',45%,26%,.95)';
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,SZ,SZ,10);else ctx.rect(x,y,SZ,SZ);ctx.fill();
        ctx.restore();
        if(i===bad&&st==='over'){ctx.strokeStyle='#ff7d7d';ctx.lineWidth=4;ctx.strokeRect(x+2,y+2,SZ-4,SZ-4);}
        T(ctx,String(i+1),x+10,y+16,{size:12,font:MONO,color:on?'#0b0e16':'rgba(232,235,244,.45)'});
      }
      var msg=st==='show'?X('Merke dir die Folge','Remember the sequence'):(st==='input'?X('Du bist dran (','Your turn (')+idx+X(' von ',' of ')+seq.length+')':(st==='wait'?X('Richtig','Correct'):''));
      T(ctx,msg,24,30,{size:18,weight:600});
      T(ctx,X('Runde ','Round ')+(rounds+(st==='over'?0:1)),W-24,30,{size:16,font:MONO,align:'right',color:'#9aa3bd'});
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Die Folge wird mit jeder Runde länger.','The sequence grows with every round.'));
      if(st==='over')overlay(ctx,X('Falsches Feld','Wrong pad'),rounds+X(' Runden geschafft',' rounds cleared'),X('Klicke für einen neuen Versuch.','Click to try again.'));
    }
  };
};

/* ---------- Stapel ---------- */
FACTORY.stapel=function(o){
  var ctx=o.ctx,api=o.api;
  var BH=26,BASE=H-70,MINW=4;
  var st='ready',blocks=[],cur=null,debris=[],cam=0,perfect=0,maxP=0,height=0,t0=0,msg='',msgT=0;
  function stats(){return{height:height,perfectRun:maxP};}
  function newCur(){var top=blocks[blocks.length-1],dir=Math.random()<.5?1:-1;cur={x:dir>0?30:W-30-top.w,w:top.w,dir:dir,speed:Math.min(520,210+height*13)};}
  function start(){blocks=[{x:W/2-120,w:240}];debris=[];cam=0;perfect=0;maxP=0;height=0;msg='';st='play';newCur();}
  function drop(){
    var top=blocks[blocks.length-1],idx=blocks.length;
    var left=Math.max(cur.x,top.x),right=Math.min(cur.x+cur.w,top.x+top.w),ov=right-left;
    if(ov<=MINW){debris.push({x:cur.x,w:cur.w,y:BASE-idx*BH,vy:0,h:idx});st='over';t0=0;beep(110,.35,'sawtooth',.05);api.finish(stats());return;}
    if(Math.abs(cur.x-top.x)<=5){
      blocks.push({x:top.x,w:top.w});perfect++;maxP=Math.max(maxP,perfect);
      msg=X('Perfekt','Perfect')+(perfect>1?' ×'+perfect:'');msgT=1;beep(660+perfect*60,.15,'triangle',.05);
    }else{
      perfect=0;
      if(cur.x<top.x)debris.push({x:cur.x,w:top.x-cur.x,y:BASE-idx*BH,vy:0,h:idx});
      else debris.push({x:top.x+top.w,w:cur.x+cur.w-(top.x+top.w),y:BASE-idx*BH,vy:0,h:idx});
      blocks.push({x:left,w:ov});beep(330,.1,'triangle',.04);
    }
    height=blocks.length-1;api.report(stats());newCur();
  }
  function act(){
    if(st==='ready'){start();return;}
    if(st==='over'){if(t0>.5)start();return;}
    drop();
  }
  return{
    update:function(dt){
      if(st==='play'){
        cur.x+=cur.dir*cur.speed*dt;
        if(cur.x<=20){cur.x=20;cur.dir=1;}
        if(cur.x+cur.w>=W-20){cur.x=W-20-cur.w;cur.dir=-1;}
      }
      if(st==='over')t0+=dt;
      if(msgT>0)msgT-=dt;
      debris.forEach(function(d){d.vy+=1400*dt;d.y+=d.vy*dt;});
      debris=debris.filter(function(d){return d.y<BASE+800;});
      var target=Math.max(0,(blocks.length-8))*BH;cam+=(target-cam)*Math.min(1,dt*6);
    },
    pointer:function(){act();},
    key:function(e){if(e.key===' '||e.key==='Enter'||e.key==='ArrowDown'){act();return true;}return false;},
    draw:function(){
      ctx.fillStyle='rgba(30,38,64,.9)';ctx.fillRect(0,BASE+BH+cam,W,H);
      function block(x,y,w,i){ctx.fillStyle='hsl('+((i*14+210)%360)+',62%,60%)';ctx.fillRect(x,y,w,BH-2);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(x,y,w,3);}
      blocks.forEach(function(b,i){block(b.x,BASE-i*BH+cam,b.w,i);});
      if(st==='play'&&cur)block(cur.x,BASE-blocks.length*BH+cam,cur.w,blocks.length);
      debris.forEach(function(d){ctx.globalAlpha=.8;block(d.x,d.y+cam,d.w,d.h);ctx.globalAlpha=1;});
      T(ctx,String(height),W/2,34,{size:34,font:MONO,align:'center'});
      T(ctx,X('Blöcke','Blocks'),W/2,62,{size:13,align:'center',color:'#9aa3bd'});
      if(msgT>0){ctx.globalAlpha=Math.min(1,msgT*2);T(ctx,msg,W/2,96,{size:20,weight:800,font:DISP,align:'center',color:'#ffc65a'});ctx.globalAlpha=1;}
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Lass den Block passend auf den letzten fallen.','Drop the block right onto the last one.'));
      if(st==='over')overlay(ctx,X('Turm gefallen','Tower down'),height+X(' Blöcke gestapelt',' blocks stacked'),X('Klicke für einen neuen Turm. Beste Perfekt-Serie: ','Click for a new tower. Best perfect streak: ')+maxP);
    }
  };
};

/* ---------- Schwerkraftläufer ---------- */
FACTORY.lauf=function(o){
  var ctx=o.ctx,api=o.api;
  var FL=H-34,CE=34,PS=26,G=7000,PX=170;
  var st='ready',cy=FL-PS/2,vy=0,dir=1,grounded=true,rot=0,obs=[],orbs=[],dist=0,speed=300,nextSp=0,orbCount=0,lastM=-1,t0=0,parts=[],buf=0;
  function meters(){return Math.floor(dist/24);}
  function start(){st='play';cy=FL-PS/2;vy=0;dir=1;grounded=true;rot=0;obs=[];orbs=[];dist=0;speed=300;nextSp=120;orbCount=0;lastM=-1;parts=[];buf=0;}
  function spawn(){
    var x=W+40,side=Math.random()<.5?'floor':'ceil',w=34+Math.random()*30,h=60+Math.random()*70;
    obs.push({x:x,w:w,h:h,side:side});
    var gap=speed*.85+Math.random()*120;nextSp=gap+w;
    if(Math.random()<.7){
      var ox=x+w+gap/2-40,r=Math.random(),oy=r<.4?CE+34:(r<.6?(CE+FL)/2:FL-34);
      for(var i=0;i<3;i++)orbs.push({x:ox+i*34,y:oy});
    }
  }
  function burst(x,y){for(var i=0;i<18;i++){var a=Math.random()*TAU,s=80+Math.random()*220;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,l:.6});}}
  function die(){st='over';t0=0;burst(PX,cy);beep(110,.4,'sawtooth',.05);api.finish({meters:meters(),orbs:orbCount});}
  function flip(){
    if(st==='ready'){start();return;}
    if(st==='over'){if(t0>.5)start();return;}
    if(grounded){dir=-dir;grounded=false;vy=0;beep(440,.06,'square',.02);}
    else buf=.14;
  }
  return{
    update:function(dt){
      if(st==='play'){
        speed=300+Math.min(260,meters()*.5);
        var dx=speed*dt;dist+=dx;nextSp-=dx;
        if(nextSp<=0)spawn();
        obs.forEach(function(b){b.x-=dx;});orbs.forEach(function(b){b.x-=dx;});
        obs=obs.filter(function(b){return b.x+b.w>-10;});orbs=orbs.filter(function(b){return b.x>-20;});
        if(buf>0)buf-=dt;
        if(!grounded){
          vy+=dir*G*dt;cy+=vy*dt;rot+=dir*dt*9;
          if(dir>0&&cy>=FL-PS/2){cy=FL-PS/2;vy=0;grounded=true;}
          else if(dir<0&&cy<=CE+PS/2){cy=CE+PS/2;vy=0;grounded=true;}
          if(grounded){rot=Math.round(rot/(PI/2))*(PI/2);if(buf>0){buf=0;dir=-dir;grounded=false;}}
        }
        var l=PX-PS/2+3,r=PX+PS/2-3,t=cy-PS/2+3,b=cy+PS/2-3;
        for(var i=0;i<obs.length;i++){
          var ob=obs[i],ot=ob.side==='floor'?FL-ob.h:CE,obt=ob.side==='floor'?FL:CE+ob.h;
          if(r>ob.x&&l<ob.x+ob.w&&b>ot&&t<obt){die();break;}
        }
        if(st==='play'){
          for(var j=orbs.length-1;j>=0;j--){
            if(Math.hypot(orbs[j].x-PX,orbs[j].y-cy)<24){orbs.splice(j,1);orbCount++;beep(880,.07,'triangle',.05);api.report({meters:meters(),orbs:orbCount});}
          }
          var m=meters();if(m!==lastM){lastM=m;api.report({meters:m,orbs:orbCount});}
        }
      }
      if(st==='over')t0+=dt;
      for(var k=parts.length-1;k>=0;k--){var p=parts[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t>=p.l)parts.splice(k,1);}
    },
    pointer:function(){flip();},
    key:function(e){if(e.key===' '||e.key==='Enter'||e.key==='ArrowUp'||e.key==='ArrowDown'){flip();return true;}return false;},
    draw:function(){
      ctx.fillStyle='rgba(30,38,64,.9)';ctx.fillRect(0,FL,W,H-FL);ctx.fillRect(0,0,W,CE);
      ctx.fillStyle='#8ea0ff';ctx.fillRect(0,FL,W,2);ctx.fillRect(0,CE-2,W,2);
      obs.forEach(function(b){
        var y=b.side==='floor'?FL-b.h:CE;
        ctx.fillStyle='#2b3354';ctx.fillRect(b.x,y,b.w,b.h);
        ctx.fillStyle='#ff9c7a';ctx.fillRect(b.x,b.side==='floor'?y:y+b.h-4,b.w,4);
      });
      orbs.forEach(function(b){
        var gr=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,16);
        gr.addColorStop(0,'#fff6dc');gr.addColorStop(.4,'#ffc65a');gr.addColorStop(1,'rgba(255,198,90,0)');
        ctx.fillStyle=gr;ctx.beginPath();ctx.arc(b.x,b.y,16,0,TAU);ctx.fill();
      });
      if(st!=='over'){
        ctx.save();ctx.translate(PX,cy);ctx.rotate(rot);
        ctx.fillStyle='#8ea0ff';ctx.fillRect(-PS/2,-PS/2,PS,PS);
        ctx.fillStyle='#0b0e16';ctx.fillRect(2,-6,6,6);
        ctx.restore();
      }
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle='#8ea0ff';ctx.fillRect(p.x-2,p.y-2,5,5);});
      ctx.globalAlpha=1;
      T(ctx,meters()+' m',24,CE+34,{size:26,font:MONO});
      T(ctx,'Orbs '+orbCount,W-24,CE+34,{size:16,font:MONO,align:'right',color:'#ffc65a'});
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Drehe die Schwerkraft, um den Blöcken auszuweichen.','Flip gravity to dodge the blocks.'));
      if(st==='over')overlay(ctx,X('Aufgeprallt','Crashed'),meters()+X(' Meter, ',' meters, ')+orbCount+' Orbs',X('Klicke für einen neuen Lauf.','Click for a new run.'));
    }
  };
};

/* ---------- Meteorregen ---------- */
FACTORY.meteor=function(o){
  var ctx=o.ctx,api=o.api;
  var PY=H-48;
  var st='ready',px=W/2,tx=W/2,rocks=[],stars=[],parts=[],t=0,spawnT=0,starT=0,got=0,keys={},t0=0,lastS=-1;
  function secs(){return Math.floor(t);}
  function stats(){return{seconds:secs(),stars:got};}
  function burst(x,y,col,n){for(var i=0;i<n;i++){var a=Math.random()*TAU,s=60+Math.random()*240;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,l:.5+Math.random()*.4,c:col});}}
  function start(){st='play';px=tx=W/2;rocks=[];stars=[];parts=[];t=0;spawnT=.5;starT=1.6;got=0;lastS=-1;keys={};}
  function spawnRock(){
    var r=14+Math.random()*18,sp=150+Math.min(280,t*4.5)+Math.random()*90,pts=[];
    for(var i=0;i<9;i++)pts.push(.76+Math.random()*.3);
    rocks.push({x:r+Math.random()*(W-2*r),y:-r-8,r:r,vy:sp,vx:(Math.random()-.5)*70,rot:Math.random()*TAU,vr:(Math.random()-.5)*3,pts:pts});
  }
  function die(){st='over';t0=0;burst(px,PY,'#ff9c7a',30);beep(100,.45,'sawtooth',.05);api.finish(stats());}
  function begin(){if(st==='ready'||(st==='over'&&t0>.5)){start();return true;}return false;}
  return{
    update:function(dt){
      if(st==='play'){
        t+=dt;
        if(keys.l)tx-=560*dt;if(keys.r)tx+=560*dt;
        tx=Math.max(20,Math.min(W-20,tx));
        px+=(tx-px)*Math.min(1,dt*16);
        spawnT-=dt;
        if(spawnT<=0){spawnRock();spawnT=Math.max(.16,.72-t*.0095)*(.7+Math.random()*.6);}
        starT-=dt;
        if(starT<=0){stars.push({x:30+Math.random()*(W-60),y:-14,vy:130+Math.random()*50,ph:Math.random()*TAU});starT=2.2+Math.random()*1.4;}
        for(var i=rocks.length-1;i>=0;i--){
          var r=rocks[i];r.x+=r.vx*dt;r.y+=r.vy*dt;r.rot+=r.vr*dt;
          if(r.y>H+40){rocks.splice(i,1);continue;}
          if(Math.hypot(r.x-px,r.y-PY)<13+r.r*.82){die();break;}
        }
        if(st==='play'){
          for(var j=stars.length-1;j>=0;j--){
            var s=stars[j];s.y+=s.vy*dt;s.ph+=dt*6;
            if(s.y>H+20){stars.splice(j,1);continue;}
            if(Math.hypot(s.x-px,s.y-PY)<26){stars.splice(j,1);got++;burst(s.x,s.y,'#ffd86b',12);beep(880+got*25,.09,'triangle',.05);api.report(stats());}
          }
          if(secs()!==lastS){lastS=secs();api.report(stats());}
        }
      }
      if(st==='over')t0+=dt;
      for(var k=parts.length-1;k>=0;k--){var p=parts[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.97;p.vy*=.97;if(p.t>=p.l)parts.splice(k,1);}
    },
    pointer:function(p){if(begin())return;if(st==='play')tx=p.x;},
    move:function(p){if(st==='play')tx=p.x;},
    key:function(e){
      var k=e.key;
      if(k==='ArrowLeft'||k==='a'||k==='A'){keys.l=true;return true;}
      if(k==='ArrowRight'||k==='d'||k==='D'){keys.r=true;return true;}
      if(k===' '||k==='Enter'){begin();return true;}
      return false;
    },
    keyup:function(e){
      var k=e.key;
      if(k==='ArrowLeft'||k==='a'||k==='A')keys.l=false;
      if(k==='ArrowRight'||k==='d'||k==='D')keys.r=false;
    },
    draw:function(){
      rocks.forEach(function(r){
        ctx.save();ctx.translate(r.x,r.y);ctx.rotate(r.rot);
        ctx.beginPath();
        for(var i=0;i<9;i++){var a=i/9*TAU,rr=r.r*r.pts[i];if(i===0)ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
        ctx.closePath();ctx.fillStyle='#3a2f3f';ctx.fill();ctx.strokeStyle='#ff9c7a';ctx.lineWidth=2;ctx.stroke();
        ctx.restore();
      });
      stars.forEach(function(s){
        var gr=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,20);
        gr.addColorStop(0,'#fff6dc');gr.addColorStop(.4,'#ffd86b');gr.addColorStop(1,'rgba(255,216,107,0)');
        ctx.fillStyle=gr;ctx.beginPath();ctx.arc(s.x,s.y,20+Math.sin(s.ph)*2,0,TAU);ctx.fill();
      });
      if(st!=='over'){
        ctx.save();ctx.translate(px,PY);
        var fl=8+Math.random()*7;
        ctx.fillStyle='#ff9c7a';ctx.beginPath();ctx.moveTo(-6,12);ctx.lineTo(0,12+fl);ctx.lineTo(6,12);ctx.fill();
        ctx.fillStyle='#8ea0ff';ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(14,14);ctx.lineTo(0,8);ctx.lineTo(-14,14);ctx.closePath();ctx.fill();
        ctx.restore();
      }
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle=p.c;ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      T(ctx,secs()+' s',24,30,{size:26,font:MONO});
      T(ctx,X('Sterne ','Stars ')+got,W-24,30,{size:16,font:MONO,align:'right',color:'#ffd86b'});
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Weiche den Felsen aus und sammle die Sterne.','Dodge the rocks and collect the stars.'));
      if(st==='over')overlay(ctx,X('Getroffen','Hit'),secs()+X(' Sekunden, ',' seconds, ')+got+X(' Sterne',' stars'),X('Klicke für einen neuen Flug.','Click for a new flight.'));
    }
  };
};

/* ---------- Taktfall ---------- */
FACTORY.takt=function(o){
  var ctx=o.ctx,api=o.api;
  var LW=96,GP=12,OX=(W-(4*LW+3*GP))/2,HY=H-92;
  var HUES=[200,280,340,40],KEYS=['D','F','J','K'],FREQ=[392,440,523,659];
  var st='ready',notes=[],fx=[],hits=0,combo=0,maxC=0,lives=5,beatT=0,bpm=96,flash=[0,0,0,0],msg='',msgT=0,msgC='#fff',t0=0;
  function stats(){return{hits:hits,combo:maxC};}
  function lx(i){return OX+i*(LW+GP);}
  function start(){st='play';notes=[];fx=[];hits=0;combo=0;maxC=0;lives=5;beatT=.6;bpm=96;flash=[0,0,0,0];msg='';}
  function spd(){return (HY+24)/Math.max(.95,1.7-hits*.008);}
  function spawn(){
    var n=(hits>=25&&Math.random()<.3)?2:1,used={};
    for(var k=0;k<n;k++){var l;do{l=Math.floor(Math.random()*4);}while(used[l]);used[l]=1;notes.push({lane:l,y:-20});}
  }
  function say(s,c){msg=s;msgC=c;msgT=.6;}
  function burst(x,y,h){for(var i=0;i<12;i++){var a=-PI/2+(Math.random()-.5)*2.4,s=80+Math.random()*200;fx.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,l:.5,h:h});}}
  function lose(){lives--;combo=0;say(X('Verpasst','Missed'),'#ff7d7d');beep(110,.2,'sawtooth',.04);if(lives<=0){st='over';t0=0;api.finish(stats());}}
  function press(lane){
    if(st==='ready'){start();return;}
    if(st==='over'){if(t0>.5)start();return;}
    flash[lane]=.18;
    var best=-1,bd=999;
    for(var i=0;i<notes.length;i++){if(notes[i].lane===lane){var d=Math.abs(notes[i].y-HY);if(d<bd){bd=d;best=i;}}}
    if(best>-1&&bd<=46){
      var perfect=bd<=17;
      notes.splice(best,1);hits++;combo++;maxC=Math.max(maxC,combo);
      say(perfect?X('Perfekt','Perfect'):X('Gut','Good'),perfect?'#ffc65a':'#e8ebf4');
      burst(lx(lane)+LW/2,HY,HUES[lane]);beep(FREQ[lane],.14,'triangle',.06);
      api.report(stats());
    }else{combo=0;beep(150,.08,'square',.025);}
  }
  return{
    update:function(dt){
      if(st==='play'){
        bpm=Math.min(150,96+hits*.7);
        beatT-=dt;
        if(beatT<=0){spawn();beatT=60/bpm*(Math.random()<.2?1.5:1);}
        var v=spd()*dt;
        for(var i=notes.length-1;i>=0;i--){
          notes[i].y+=v;
          if(notes[i].y>HY+50){notes.splice(i,1);lose();if(st==='over')break;}
        }
      }
      if(st==='over')t0+=dt;
      for(var f=0;f<4;f++)if(flash[f]>0)flash[f]-=dt;
      if(msgT>0)msgT-=dt;
      for(var k=fx.length-1;k>=0;k--){var p=fx[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;if(p.t>=p.l)fx.splice(k,1);}
    },
    pointer:function(p){
      if(st!=='play'){press(0);return;}
      for(var i=0;i<4;i++){if(p.x>=lx(i)-GP/2&&p.x<=lx(i)+LW+GP/2){press(i);return;}}
    },
    key:function(e){
      var k=(e.key||'').toUpperCase(),i=KEYS.indexOf(k);
      if(i<0){i=({ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3})[e.key];if(i===undefined)i=-1;}
      if(i>-1){press(i);return true;}
      if(e.key===' '||e.key==='Enter'){if(st!=='play'){press(0);return true;}}
      return false;
    },
    draw:function(){
      for(var l=0;l<4;l++){
        var x=lx(l);
        ctx.fillStyle='hsla('+HUES[l]+',50%,40%,'+(flash[l]>0?.34:.12)+')';ctx.fillRect(x,0,LW,H);
        ctx.fillStyle='hsla('+HUES[l]+',80%,65%,.5)';ctx.fillRect(x,0,1,H);ctx.fillRect(x+LW-1,0,1,H);
        ctx.fillStyle='hsl('+HUES[l]+',80%,'+(flash[l]>0?'72%':'55%')+')';ctx.fillRect(x+6,HY-3,LW-12,6);
        T(ctx,KEYS[l],x+LW/2,H-30,{size:20,weight:600,font:MONO,align:'center',color:'hsl('+HUES[l]+',80%,75%)'});
      }
      notes.forEach(function(n){
        var x=lx(n.lane),h=HUES[n.lane];
        ctx.fillStyle='hsl('+h+',85%,62%)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x+8,n.y-12,LW-16,24,6);else ctx.rect(x+8,n.y-12,LW-16,24);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x+12,n.y-9,LW-24,4);
      });
      fx.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle='hsl('+p.h+',90%,70%)';ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      T(ctx,String(hits),24,30,{size:26,font:MONO});
      T(ctx,X('Treffer','hits'),24+String(hits).length*16+12,32,{size:13,color:'#9aa3bd'});
      for(var i=0;i<5;i++){ctx.beginPath();ctx.arc(W-24-i*20,30,6,0,TAU);if(i<lives){ctx.fillStyle='#8ea0ff';ctx.fill();}else{ctx.strokeStyle='#4a5272';ctx.lineWidth=2;ctx.stroke();}}
      if(combo>=3)T(ctx,X('Serie ×','Streak ×')+combo,W-24,60,{size:15,font:MONO,align:'right',color:'#ffc65a'});
      if(msgT>0){ctx.globalAlpha=Math.min(1,msgT*3);T(ctx,msg,W/2,HY-70,{size:20,weight:800,font:DISP,align:'center',color:msgC});ctx.globalAlpha=1;}
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Tippe die Spuren oder drücke D, F, J, K.','Tap the lanes or press D, F, J, K.'));
      if(st==='over')overlay(ctx,X('Takt verloren','Lost the beat'),hits+X(' Treffer, beste Serie ',' hits, best streak ')+maxC,X('Klicke für eine neue Runde.','Click for a new run.'));
    }
  };
};

/* ---------- Orbit ---------- */
FACTORY.orbit=function(o){
  var ctx=o.ctx,api=o.api;
  var CX=W/2,CY=H/2,R=[96,190];
  var st='ready',a=-PI/2,ring=0,pr=R[0],obs=[],orbs=[],t=0,spawnT=0,orbT=0,got=0,parts=[],t0=0,lastS=-1;
  function secs(){return Math.floor(t);}
  function stats(){return{seconds:secs(),orbs:got};}
  function speed(){return Math.min(3.3,1.5+t*.028);}
  function nd(x){return ((x+PI)%TAU+TAU)%TAU-PI;}
  function burst(x,y,col,n){for(var i=0;i<n;i++){var an=Math.random()*TAU,s=60+Math.random()*220;parts.push({x:x,y:y,vx:Math.cos(an)*s,vy:Math.sin(an)*s,t:0,l:.5,c:col});}}
  function start(){st='play';a=-PI/2;ring=0;pr=R[0];obs=[];orbs=[];t=0;spawnT=.9;orbT=2;got=0;parts=[];lastS=-1;}
  function spawn(){
    var r=Math.floor(Math.random()*2),ang=a+1.3+Math.random()*1.8,hw=.2+Math.random()*.16;
    for(var i=0;i<obs.length;i++){var ob=obs[i];if(ob.ring!==r&&Math.abs(nd(ob.ang-ang))<ob.hw+hw+.7)return;}
    obs.push({ring:r,ang:ang,hw:hw,age:0});
  }
  function die(){st='over';t0=0;burst(CX+pr*Math.cos(a),CY+pr*Math.sin(a),'#8ea0ff',28);beep(100,.45,'sawtooth',.05);api.finish(stats());}
  function act(){
    if(st==='ready'){start();return;}
    if(st==='over'){if(t0>.5)start();return;}
    ring=1-ring;beep(ring?520:400,.06,'square',.02);
  }
  return{
    update:function(dt){
      if(st==='play'){
        t+=dt;a+=speed()*dt;
        pr+=(R[ring]-pr)*Math.min(1,dt*13);
        spawnT-=dt;
        if(spawnT<=0){spawn();spawnT=Math.max(.5,1.3-t*.016);}
        orbT-=dt;
        if(orbT<=0){orbs.push({ring:Math.floor(Math.random()*2),ang:a+1+Math.random()*2,age:0});orbT=2+Math.random()*1.2;}
        for(var i=obs.length-1;i>=0;i--){
          var ob=obs[i];ob.age+=dt;
          if(ob.age>3.9){obs.splice(i,1);continue;}
          if(ob.age>=.9&&ob.age<=3.5&&Math.abs(pr-R[ob.ring])<15&&Math.abs(nd(a-ob.ang))<ob.hw+.05){die();break;}
        }
        if(st==='play'){
          var px=CX+pr*Math.cos(a),py=CY+pr*Math.sin(a);
          for(var j=orbs.length-1;j>=0;j--){
            var ob2=orbs[j];ob2.age+=dt;
            if(ob2.age>7){orbs.splice(j,1);continue;}
            var ox=CX+R[ob2.ring]*Math.cos(ob2.ang),oy=CY+R[ob2.ring]*Math.sin(ob2.ang);
            if(Math.hypot(ox-px,oy-py)<24){orbs.splice(j,1);got++;burst(ox,oy,'#ffc65a',12);beep(880,.08,'triangle',.05);api.report(stats());}
          }
          if(secs()!==lastS){lastS=secs();api.report(stats());}
        }
      }
      if(st==='over')t0+=dt;
      for(var k=parts.length-1;k>=0;k--){var p=parts[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.97;p.vy*=.97;if(p.t>=p.l)parts.splice(k,1);}
    },
    pointer:function(){act();},
    key:function(e){if(e.key===' '||e.key==='Enter'||e.key==='ArrowUp'||e.key==='ArrowDown'){act();return true;}return false;},
    draw:function(){
      ctx.lineWidth=2;
      R.forEach(function(r){ctx.strokeStyle='rgba(142,160,255,.3)';ctx.beginPath();ctx.arc(CX,CY,r,0,TAU);ctx.stroke();});
      var gr=ctx.createRadialGradient(CX,CY,0,CX,CY,50);
      gr.addColorStop(0,'rgba(142,160,255,.5)');gr.addColorStop(1,'rgba(142,160,255,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(CX,CY,50,0,TAU);ctx.fill();
      obs.forEach(function(ob){
        var warn=ob.age<.9,fade=ob.age>3.5?Math.max(0,1-(ob.age-3.5)/.4):1;
        ctx.lineWidth=22;ctx.lineCap='butt';
        if(warn){ctx.setLineDash([8,8]);ctx.strokeStyle='rgba(255,156,122,'+(.25+.25*Math.sin(ob.age*18))+')';}
        else{ctx.setLineDash([]);ctx.strokeStyle='rgba(255,128,100,'+fade+')';}
        ctx.beginPath();ctx.arc(CX,CY,R[ob.ring],ob.ang-ob.hw,ob.ang+ob.hw);ctx.stroke();
        ctx.setLineDash([]);
      });
      orbs.forEach(function(ob){
        var x=CX+R[ob.ring]*Math.cos(ob.ang),y=CY+R[ob.ring]*Math.sin(ob.ang);
        var g2=ctx.createRadialGradient(x,y,0,x,y,16);
        g2.addColorStop(0,'#fff6dc');g2.addColorStop(.4,'#ffc65a');g2.addColorStop(1,'rgba(255,198,90,0)');
        ctx.fillStyle=g2;ctx.beginPath();ctx.arc(x,y,16,0,TAU);ctx.fill();
      });
      if(st!=='over'){
        for(var k=5;k>=1;k--){
          var ta=a-k*.07;ctx.globalAlpha=.12*(6-k)/5;ctx.fillStyle='#8ea0ff';
          ctx.beginPath();ctx.arc(CX+pr*Math.cos(ta),CY+pr*Math.sin(ta),9-k*.8,0,TAU);ctx.fill();
        }
        ctx.globalAlpha=1;
        ctx.fillStyle='#8ea0ff';ctx.beginPath();ctx.arc(CX+pr*Math.cos(a),CY+pr*Math.sin(a),10,0,TAU);ctx.fill();
        ctx.fillStyle='#0b0e16';ctx.beginPath();ctx.arc(CX+pr*Math.cos(a),CY+pr*Math.sin(a),3.5,0,TAU);ctx.fill();
      }
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle=p.c;ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      T(ctx,secs()+' s',24,30,{size:26,font:MONO});
      T(ctx,'Orbs '+got,W-24,30,{size:16,font:MONO,align:'right',color:'#ffc65a'});
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Wechsle die Bahn, bevor die Sperre fest wird.','Switch lanes before the barrier turns solid.'));
      if(st==='over')overlay(ctx,X('Zusammenstoß','Collision'),secs()+X(' Sekunden, ',' seconds, ')+got+' Orbs',X('Klicke für eine neue Runde.','Click for a new run.'));
    }
  };
};

/* ---------- Pulsschlag ---------- */
FACTORY.puls=function(o){
  var ctx=o.ctx,api=o.api;
  var TR=34,START=130;
  var st='ready',tg=null,age=0,dur=1.4,hits=0,run=0,maxRun=0,lives=3,gap=0,res=null,resT=0,parts=[],t0=0;
  function stats(){return{hits:hits,perfectRun:maxRun};}
  function curR(){return TR+(START-TR)*(1-age/dur);}
  function burst(x,y,col){for(var i=0;i<16;i++){var an=Math.random()*TAU,s=70+Math.random()*200;parts.push({x:x,y:y,vx:Math.cos(an)*s,vy:Math.sin(an)*s,t:0,l:.5,c:col});}}
  function start(){st='play';hits=0;run=0;maxRun=0;lives=3;parts=[];res=null;tg=null;gap=.5;}
  function newTarget(){tg={x:120+Math.random()*(W-240),y:140+Math.random()*(H-250)};age=0;dur=Math.max(.62,1.5-hits*.028);}
  function miss(){
    lives--;run=0;res={txt:X('Daneben','Miss'),col:'#ff7d7d'};resT=.7;beep(120,.2,'sawtooth',.04);
    if(tg)burst(tg.x,tg.y,'#7b8299');
    tg=null;gap=.5;
    if(lives<=0){st='over';t0=0;api.finish(stats());}
  }
  function tap(p){
    if(st==='ready'){start();return;}
    if(st==='over'){if(t0>.5)start();return;}
    if(!tg)return;
    if(p&&Math.hypot(p.x-tg.x,p.y-tg.y)>74)return;
    var d=Math.abs(curR()-TR);
    if(d<=7){hits++;run++;maxRun=Math.max(maxRun,run);res={txt:X('Perfekt','Perfect'),col:'#ffc65a'};beep(880,.1,'triangle',.06);burst(tg.x,tg.y,'#ffc65a');}
    else if(d<=20){hits++;run=0;res={txt:X('Gut','Good'),col:'#8ea0ff'};beep(620,.1,'triangle',.05);burst(tg.x,tg.y,'#8ea0ff');}
    else{miss();return;}
    resT=.6;tg=null;gap=.35;
    api.report(stats());
  }
  return{
    update:function(dt){
      if(st==='play'){
        if(tg){
          age+=dt;
          if(curR()<TR-20)miss();
        }else{
          gap-=dt;
          if(gap<=0&&st==='play')newTarget();
        }
      }
      if(st==='over')t0+=dt;
      if(resT>0)resT-=dt;
      for(var k=parts.length-1;k>=0;k--){var p=parts[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;if(p.t>=p.l)parts.splice(k,1);}
    },
    pointer:function(p){tap(p);},
    key:function(e){if(e.key===' '||e.key==='Enter'){tap(null);return true;}return false;},
    draw:function(){
      if(tg){
        var r=curR(),dd=Math.abs(r-TR),near=dd<=7?'#ffc65a':(dd<=20?'#ffe9a8':'#8ea0ff');
        ctx.fillStyle='rgba(142,160,255,.12)';ctx.beginPath();ctx.arc(tg.x,tg.y,TR,0,TAU);ctx.fill();
        ctx.lineWidth=3;ctx.strokeStyle='rgba(232,235,244,.85)';ctx.beginPath();ctx.arc(tg.x,tg.y,TR,0,TAU);ctx.stroke();
        ctx.lineWidth=5;ctx.strokeStyle=near;
        if(dd<=20){ctx.shadowColor=near;ctx.shadowBlur=18;}
        ctx.beginPath();ctx.arc(tg.x,tg.y,Math.max(2,r),0,TAU);ctx.stroke();
        ctx.shadowBlur=0;
      }
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle=p.c;ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      if(resT>0&&res){ctx.globalAlpha=Math.min(1,resT*3);T(ctx,res.txt,W/2,H-56,{size:22,weight:800,font:DISP,align:'center',color:res.col});ctx.globalAlpha=1;}
      T(ctx,String(hits),W/2,30,{size:28,font:MONO,align:'center'});
      for(var i=0;i<3;i++){ctx.beginPath();ctx.arc(26+i*24,28,7,0,TAU);if(i<lives){ctx.fillStyle='#8ea0ff';ctx.fill();}else{ctx.strokeStyle='#4a5272';ctx.lineWidth=2;ctx.stroke();}}
      if(run>=2)T(ctx,X('Perfekt ×','Perfect ×')+run,W-24,30,{size:16,font:MONO,align:'right',color:'#ffc65a'});
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Triff das Ziel, wenn der Ring genau darauf liegt.','Hit the target when the ring lines up.'));
      if(st==='over')overlay(ctx,X('Aus dem Takt','Off beat'),hits+X(' Treffer',' hits'),X('Klicke für eine neue Runde. Beste Perfekt-Serie: ','Click for a new run. Best perfect streak: ')+maxRun);
    }
  };
};

/* ---------- Neonschlange ---------- */
FACTORY.snake=function(o){
  var ctx=o.ctx,api=o.api;
  var CS=25,GW=32,GH=20;
  var st='ready',snake=[],dir={x:1,y:0},queue=[],food=null,bonus=null,score=0,acc=0,iv=.13,t0=0,parts=[],tt=0,swipe=null;
  function stats(){return{score:score,length:snake.length};}
  function burst(c,col){for(var i=0;i<14;i++){var a=Math.random()*TAU,s=60+Math.random()*200;parts.push({x:c.x*CS+CS/2,y:c.y*CS+CS/2,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,l:.5,c:col});}}
  function free(x,y){for(var i=0;i<snake.length;i++){if(snake[i].x===x&&snake[i].y===y)return false;}return true;}
  function place(){var x,y,n=0;do{x=Math.floor(Math.random()*GW);y=Math.floor(Math.random()*GH);n++;}while(!free(x,y)&&n<500);return{x:x,y:y};}
  function start(){st='play';snake=[{x:8,y:10},{x:7,y:10},{x:6,y:10}];dir={x:1,y:0};queue=[];score=0;acc=0;iv=.13;bonus=null;parts=[];swipe=null;food=place();}
  function setDir(dx,dy){
    var last=queue.length?queue[queue.length-1]:dir;
    if((dx===-last.x&&dy===-last.y)||(dx===last.x&&dy===last.y))return;
    if(queue.length<2)queue.push({x:dx,y:dy});
  }
  function die(){st='over';t0=0;burst(snake[0],'#ff9c7a');beep(100,.4,'sawtooth',.05);api.finish(stats());}
  function step(){
    if(queue.length)dir=queue.shift();
    var h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    if(h.x<0||h.y<0||h.x>=GW||h.y>=GH){die();return;}
    var eat=food&&h.x===food.x&&h.y===food.y,eatB=bonus&&h.x===bonus.x&&h.y===bonus.y;
    var len=snake.length-((eat||eatB)?0:1);
    for(var i=0;i<len;i++){if(snake[i].x===h.x&&snake[i].y===h.y){die();return;}}
    snake.unshift(h);
    if(eat){
      score++;burst(h,'#7cf0c9');beep(520+Math.min(score,40)*8,.08,'triangle',.05);
      food=place();iv=Math.max(.06,.13-score*.0012);
      if(!bonus&&score%5===0){var b=place();bonus={x:b.x,y:b.y,life:6};}
      api.report(stats());
    }else if(eatB){
      score+=3;bonus=null;burst(h,'#ffc65a');beep(990,.12,'triangle',.06);api.report(stats());
    }else snake.pop();
  }
  function begin(){if(st==='ready'||(st==='over'&&t0>.5)){start();return true;}return false;}
  return{
    update:function(dt){
      tt+=dt;
      if(st==='play'){
        acc+=dt;
        while(acc>=iv&&st==='play'){acc-=iv;step();}
        if(bonus){bonus.life-=dt;if(bonus.life<=0)bonus=null;}
      }
      if(st==='over')t0+=dt;
      for(var k=parts.length-1;k>=0;k--){var p=parts[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;if(p.t>=p.l)parts.splice(k,1);}
    },
    pointer:function(p){if(begin())return;swipe={x:p.x,y:p.y};},
    move:function(p){
      if(!swipe||st!=='play')return;
      var dx=p.x-swipe.x,dy=p.y-swipe.y;
      if(Math.hypot(dx,dy)<28)return;
      if(Math.abs(dx)>Math.abs(dy))setDir(dx>0?1:-1,0);else setDir(0,dy>0?1:-1);
      swipe={x:p.x,y:p.y};
    },
    key:function(e){
      var k=e.key;
      if(k==='ArrowUp'||k==='w'||k==='W'){setDir(0,-1);return true;}
      if(k==='ArrowDown'||k==='s'||k==='S'){setDir(0,1);return true;}
      if(k==='ArrowLeft'||k==='a'||k==='A'){setDir(-1,0);return true;}
      if(k==='ArrowRight'||k==='d'||k==='D'){setDir(1,0);return true;}
      if(k===' '||k==='Enter'){begin();return true;}
      return false;
    },
    draw:function(){
      ctx.fillStyle='rgba(142,160,255,.08)';
      for(var gx=0;gx<GW;gx++)for(var gy=0;gy<GH;gy++)ctx.fillRect(gx*CS+CS/2-1,gy*CS+CS/2-1,2,2);
      if(food){
        var fr=8+Math.sin(tt*6)*1.5,g=ctx.createRadialGradient(food.x*CS+CS/2,food.y*CS+CS/2,0,food.x*CS+CS/2,food.y*CS+CS/2,fr*2);
        g.addColorStop(0,'#fff');g.addColorStop(.35,'#7cf0c9');g.addColorStop(1,'rgba(124,240,201,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(food.x*CS+CS/2,food.y*CS+CS/2,fr*2,0,TAU);ctx.fill();
      }
      if(bonus){
        var bx=bonus.x*CS+CS/2,by=bonus.y*CS+CS/2;
        ctx.fillStyle='#ffc65a';ctx.beginPath();ctx.arc(bx,by,8,0,TAU);ctx.fill();
        ctx.strokeStyle='rgba(255,198,90,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,14,-PI/2,-PI/2+TAU*(bonus.life/6));ctx.stroke();
      }
      for(var i=snake.length-1;i>=0;i--){
        var s=snake[i];
        ctx.fillStyle='hsl('+(170-Math.min(70,i*2.2))+',80%,'+(i===0?72:Math.max(40,62-i))+'%)';
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(s.x*CS+2,s.y*CS+2,CS-4,CS-4,6);else ctx.rect(s.x*CS+2,s.y*CS+2,CS-4,CS-4);ctx.fill();
      }
      if(snake.length&&st!=='ready'){
        var h=snake[0],ex=dir.x*4,ey=dir.y*4;
        ctx.fillStyle='#0b0e16';
        ctx.beginPath();ctx.arc(h.x*CS+CS/2+ex-dir.y*4,h.y*CS+CS/2+ey+dir.x*4,2.4,0,TAU);ctx.fill();
        ctx.beginPath();ctx.arc(h.x*CS+CS/2+ex+dir.y*4,h.y*CS+CS/2+ey-dir.x*4,2.4,0,TAU);ctx.fill();
      }
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle=p.c;ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      T(ctx,String(score),24,30,{size:26,font:MONO});
      T(ctx,X('Länge ','Length ')+snake.length,W-24,30,{size:16,font:MONO,align:'right',color:'#9aa3bd'});
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Pfeiltasten oder Wischen steuern die Schlange.','Arrow keys or swiping steer the snake.'));
      if(st==='over')overlay(ctx,X('Gecrasht','Crashed'),score+X(' Punkte, Länge ',' points, length ')+snake.length,X('Klicke für eine neue Runde.','Click for a new run.'));
    }
  };
};

/* ---------- Ziegelbruch ---------- */
FACTORY.ziegel=function(o){
  var ctx=o.ctx,api=o.api;
  var PW=112,PH=12,PY=H-40,BR=7,COLS=10,BW=(W-60-9*6)/10,BHT=22,TOP=78,FT=52;
  var st='ready',px=W/2,tx=W/2,bx=0,by=0,vx=0,vy=0,stuck=true,bricks=[],lives=3,level=1,score=0,destroyed=0,parts=[],keys={},t0=0,msg='',msgT=0,combo=0,trail=[];
  function stats(){return{score:score,level:level,bricks:destroyed};}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function speed(){return Math.min(610,340+(level-1)*30);}
  function build(){
    bricks=[];var rows=Math.min(8,4+Math.floor(level/2)),hard=Math.min(3,Math.floor(level/3));
    for(var r=0;r<rows;r++)for(var c=0;c<COLS;c++){
      var hp=r<hard?2:1;
      bricks.push({x:30+c*(BW+6),y:TOP+r*(BHT+6),w:BW,h:BHT,hp:hp,max:hp,hue:(r*40+200)%360});
    }
  }
  function reset(){stuck=true;bx=px;by=PY-PH/2-BR-1;vx=0;vy=0;combo=0;trail=[];}
  function start(){st='play';px=tx=W/2;level=1;score=0;destroyed=0;lives=3;parts=[];build();reset();msg=X('Level 1','Level 1');msgT=1.2;}
  function launch(){if(!stuck)return;stuck=false;var a=(Math.random()-.5)*.7;vx=Math.sin(a)*speed();vy=-Math.cos(a)*speed();beep(330,.06,'square',.03);}
  function burst(x,y,h){for(var i=0;i<10;i++){var a=Math.random()*TAU,s=60+Math.random()*190;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,l:.45,h:h});}}
  function lose(){lives--;beep(110,.3,'sawtooth',.05);if(lives<=0){st='over';t0=0;api.finish(stats());}else reset();}
  function nextLevel(){level++;score+=50;msg=X('Level ','Level ')+level;msgT=1.4;build();reset();beep(784,.16,'triangle',.06);api.report(stats());}
  function hit(b){
    b.hp--;
    if(b.hp<=0){
      bricks.splice(bricks.indexOf(b),1);destroyed++;combo++;score+=10+Math.min(combo,10);
      burst(b.x+b.w/2,b.y+b.h/2,b.hue);beep(500+Math.min(combo,14)*28,.06,'triangle',.04);
      api.report(stats());
      if(!bricks.length)nextLevel();
    }else{beep(290,.05,'square',.03);}
  }
  function stepBall(d){
    bx+=vx*d;by+=vy*d;
    if(bx<BR){bx=BR;vx=Math.abs(vx);}
    if(bx>W-BR){bx=W-BR;vx=-Math.abs(vx);}
    if(by<FT+BR){by=FT+BR;vy=Math.abs(vy);}
    if(vy>0&&by+BR>=PY-PH/2&&by-BR<=PY+PH/2&&bx>=px-PW/2-BR&&bx<=px+PW/2+BR){
      var off=clamp((bx-px)/(PW/2),-1,1),a=off*1.0,sp=speed();
      vx=Math.sin(a)*sp;vy=-Math.cos(a)*sp;by=PY-PH/2-BR;combo=0;beep(260,.05,'square',.03);
    }
    if(by>H+BR*2){lose();return;}
    for(var i=0;i<bricks.length;i++){
      var b=bricks[i],cx=clamp(bx,b.x,b.x+b.w),cy=clamp(by,b.y,b.y+b.h),dx=bx-cx,dy=by-cy;
      if(dx*dx+dy*dy<BR*BR){
        if(dx===0&&dy===0){vy=-vy;}
        else if(Math.abs(dx)>Math.abs(dy)){vx=dx>0?Math.abs(vx):-Math.abs(vx);bx=cx+(dx>0?BR:-BR);}
        else{vy=dy>0?Math.abs(vy):-Math.abs(vy);by=cy+(dy>0?BR:-BR);}
        hit(b);break;
      }
    }
  }
  function begin(){if(st==='ready'||(st==='over'&&t0>.5)){start();return true;}return false;}
  return{
    update:function(dt){
      if(st==='play'){
        if(keys.l)tx-=640*dt;if(keys.r)tx+=640*dt;
        tx=clamp(tx,PW/2,W-PW/2);px+=(tx-px)*Math.min(1,dt*22);
        if(stuck){bx=px;by=PY-PH/2-BR-1;}
        else{
          var n=Math.max(1,Math.ceil(Math.hypot(vx,vy)*dt/5));
          for(var s=0;s<n&&st==='play'&&!stuck;s++)stepBall(dt/n);
          trail.push({x:bx,y:by});if(trail.length>9)trail.shift();
        }
      }
      if(st==='over')t0+=dt;
      if(msgT>0)msgT-=dt;
      for(var k=parts.length-1;k>=0;k--){var p=parts[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=380*dt;if(p.t>=p.l)parts.splice(k,1);}
    },
    pointer:function(p){if(begin())return;if(st==='play'){tx=p.x;launch();}},
    move:function(p){if(st==='play')tx=p.x;},
    key:function(e){
      var k=e.key;
      if(k==='ArrowLeft'||k==='a'||k==='A'){keys.l=true;return true;}
      if(k==='ArrowRight'||k==='d'||k==='D'){keys.r=true;return true;}
      if(k===' '||k==='Enter'||k==='ArrowUp'){if(!begin())launch();return true;}
      return false;
    },
    keyup:function(e){
      var k=e.key;
      if(k==='ArrowLeft'||k==='a'||k==='A')keys.l=false;
      if(k==='ArrowRight'||k==='d'||k==='D')keys.r=false;
    },
    draw:function(){
      ctx.fillStyle='rgba(142,160,255,.3)';ctx.fillRect(0,FT-2,W,2);
      bricks.forEach(function(b){
        var l=b.hp>1?64:56;
        ctx.fillStyle='hsl('+b.hue+',70%,'+l+'%)';
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(b.x,b.y,b.w,b.h,4);else ctx.rect(b.x,b.y,b.w,b.h);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(b.x+3,b.y+2,b.w-6,3);
        if(b.max>1){ctx.strokeStyle=b.hp>1?'#fff':'rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.strokeRect(b.x+1.5,b.y+1.5,b.w-3,b.h-3);}
      });
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle='hsl('+p.h+',80%,65%)';ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      for(var i=0;i<trail.length;i++){ctx.globalAlpha=i/trail.length*.35;ctx.fillStyle='#cfd8ff';ctx.beginPath();ctx.arc(trail[i].x,trail[i].y,BR*(.4+i/trail.length*.5),0,TAU);ctx.fill();}
      ctx.globalAlpha=1;
      ctx.fillStyle='#8ea0ff';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(px-PW/2,PY-PH/2,PW,PH,6);else ctx.rect(px-PW/2,PY-PH/2,PW,PH);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(px-PW/2+8,PY-PH/2+2,PW-16,2);
      if(st!=='ready'){
        var gl=ctx.createRadialGradient(bx,by,0,bx,by,BR*3);gl.addColorStop(0,'rgba(255,255,255,.9)');gl.addColorStop(1,'rgba(200,215,255,0)');
        ctx.fillStyle=gl;ctx.beginPath();ctx.arc(bx,by,BR*3,0,TAU);ctx.fill();
        ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(bx,by,BR,0,TAU);ctx.fill();
      }
      T(ctx,String(score),24,28,{size:24,font:MONO});
      T(ctx,X('Level ','Level ')+level,W/2,28,{size:16,font:MONO,align:'center',color:'#9aa3bd'});
      for(var l=0;l<3;l++){ctx.beginPath();ctx.arc(W-30-l*22,28,6,0,TAU);if(l<lives){ctx.fillStyle='#8ea0ff';ctx.fill();}else{ctx.strokeStyle='#4a5272';ctx.lineWidth=2;ctx.stroke();}}
      if(st==='play'&&stuck)T(ctx,X('Klicken oder Leertaste zum Abschuss','Click or press Space to launch'),W/2,H-76,{size:14,align:'center',color:'#9aa3bd'});
      if(msgT>0&&st==='play'){ctx.globalAlpha=Math.min(1,msgT*2);T(ctx,msg,W/2,H/2+40,{size:26,weight:800,font:DISP,align:'center',color:'#ffc65a'});ctx.globalAlpha=1;}
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Bewege die Maus, um den Schläger zu steuern.','Move the mouse to steer the paddle.'));
      if(st==='over')overlay(ctx,X('Alle Bälle verloren','Out of balls'),score+X(' Punkte, Level ',' points, level ')+level,X('Klicke für eine neue Runde. Ziegel: ','Click for a new run. Bricks: ')+destroyed);
    }
  };
};

/* ---------- Paare ---------- */
FACTORY.paare=function(o){
  var ctx=o.ctx,api=o.api;
  var HUES=[190,340,50,120,280,20,210,310,80,0,160,250];
  var st='ready',level=0,levels=0,cards=[],first=null,second=null,lock=0,timeLeft=0,timeMax=1,mistakes=0,flawless=0,score=0,parts=[],t0=0,msg='',msgT=0,remaining=0,pause=0;
  function stats(){return{levels:levels,flawless:flawless,score:score};}
  function pairsFor(l){return Math.min(12,4+2*l);}
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function burst(x,y,h){for(var i=0;i<14;i++){var a=Math.random()*TAU,s=70+Math.random()*190;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,l:.5,h:h});}}
  function deal(){
    var pairs=pairsFor(level),n=pairs*2,cols=n<=12?4:(n<=16?4:(n<=20?5:6)),rows=n/cols;
    var gap=14,cw=Math.min(120,(W-80-(cols-1)*gap)/cols),ch=Math.min(104,(H-110-(rows-1)*gap)/rows);
    var tw=cols*cw+(cols-1)*gap,th=rows*ch+(rows-1)*gap,ox=(W-tw)/2,oy=76+(H-76-20-th)/2;
    var syms=shuffle([0,1,2,3,4,5,6,7,8,9,10,11]).slice(0,pairs),list=[];
    syms.forEach(function(s){list.push(s);list.push(s);});
    shuffle(list);
    cards=list.map(function(s,i){return{s:s,x:ox+(i%cols)*(cw+gap),y:oy+Math.floor(i/cols)*(ch+gap),w:cw,h:ch,f:0,target:0,done:0};});
    remaining=n;first=second=null;lock=0;mistakes=0;
    timeMax=Math.max(pairs*2.8,pairs*5.6-(level-1)*1.6);timeLeft=timeMax;
  }
  function startLevel(l){level=l;deal();msg=X('Level ','Level ')+l;msgT=1.2;}
  function start(){st='play';levels=0;flawless=0;score=0;parts=[];startLevel(1);}
  function clearLevel(){
    levels++;score+=100+Math.round(timeLeft*5);
    if(mistakes===0)flawless=1;
    msg=mistakes===0?X('Fehlerfrei','Flawless'):X('Geschafft','Cleared');msgT=1.4;pause=1.1;
    beep(659,.12,'triangle',.06);setTimeout(function(){beep(988,.18,'triangle',.06);},120);
    api.report(stats());
  }
  function sym(i,cx,cy,r,hue){
    ctx.fillStyle=ctx.strokeStyle='hsl('+hue+',80%,62%)';ctx.lineWidth=r*.22;ctx.lineJoin='round';
    ctx.beginPath();
    var k;
    switch(i){
      case 0:ctx.arc(cx,cy,r,0,TAU);ctx.fill();break;
      case 1:ctx.moveTo(cx,cy-r);ctx.lineTo(cx+r,cy+r*.8);ctx.lineTo(cx-r,cy+r*.8);ctx.closePath();ctx.fill();break;
      case 2:ctx.rect(cx-r*.82,cy-r*.82,r*1.64,r*1.64);ctx.fill();break;
      case 3:ctx.moveTo(cx,cy-r*1.1);ctx.lineTo(cx+r*.8,cy);ctx.lineTo(cx,cy+r*1.1);ctx.lineTo(cx-r*.8,cy);ctx.closePath();ctx.fill();break;
      case 4:for(k=0;k<10;k++){var a=-PI/2+k*PI/5,rr=k%2?r*.45:r*1.05;ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}ctx.closePath();ctx.fill();break;
      case 5:for(k=0;k<6;k++){var b=k*PI/3;ctx.lineTo(cx+Math.cos(b)*r,cy+Math.sin(b)*r);}ctx.closePath();ctx.fill();break;
      case 6:ctx.moveTo(cx-r*.3,cy-r);ctx.lineTo(cx+r*.3,cy-r);ctx.lineTo(cx+r*.3,cy-r*.3);ctx.lineTo(cx+r,cy-r*.3);ctx.lineTo(cx+r,cy+r*.3);ctx.lineTo(cx+r*.3,cy+r*.3);ctx.lineTo(cx+r*.3,cy+r);ctx.lineTo(cx-r*.3,cy+r);ctx.lineTo(cx-r*.3,cy+r*.3);ctx.lineTo(cx-r,cy+r*.3);ctx.lineTo(cx-r,cy-r*.3);ctx.lineTo(cx-r*.3,cy-r*.3);ctx.closePath();ctx.fill();break;
      case 7:ctx.arc(cx,cy,r*.8,0,TAU);ctx.stroke();break;
      case 8:ctx.moveTo(cx,cy+r);ctx.bezierCurveTo(cx-r*1.5,cy-r*.1,cx-r*.7,cy-r*1.1,cx,cy-r*.3);ctx.bezierCurveTo(cx+r*.7,cy-r*1.1,cx+r*1.5,cy-r*.1,cx,cy+r);ctx.fill();break;
      case 9:ctx.arc(cx,cy,r,.55*PI,1.45*PI,false);ctx.arc(cx+r*.45,cy,r*.82,1.35*PI,.65*PI,true);ctx.closePath();ctx.fill();break;
      case 10:ctx.moveTo(cx+r*.15,cy-r*1.05);ctx.lineTo(cx-r*.7,cy+r*.15);ctx.lineTo(cx-r*.05,cy+r*.15);ctx.lineTo(cx-r*.2,cy+r*1.05);ctx.lineTo(cx+r*.7,cy-r*.2);ctx.lineTo(cx+r*.05,cy-r*.2);ctx.closePath();ctx.fill();break;
      default:ctx.moveTo(cx,cy-r*1.1);ctx.bezierCurveTo(cx+r*.9,cy-r*.1,cx+r*.9,cy+r*.95,cx,cy+r*.95);ctx.bezierCurveTo(cx-r*.9,cy+r*.95,cx-r*.9,cy-r*.1,cx,cy-r*1.1);ctx.fill();
    }
  }
  return{
    update:function(dt){
      if(st==='play'){
        if(pause>0){pause-=dt;if(pause<=0&&st==='play')startLevel(level+1);}
        else timeLeft-=dt;
        if(timeLeft<=0&&pause<=0){timeLeft=0;st='over';t0=0;beep(100,.45,'sawtooth',.05);api.finish(stats());}
        if(second){
          lock-=dt;
          if(lock<=0){
            if(first.s===second.s){
              first.done=second.done=.001;remaining-=2;score+=20;
              burst(first.x+first.w/2,first.y+first.h/2,HUES[first.s]);burst(second.x+second.w/2,second.y+second.h/2,HUES[second.s]);
              timeLeft=Math.min(timeMax,timeLeft+1.5);beep(740,.1,'triangle',.06);
              if(remaining<=0)clearLevel();
            }else{first.target=0;second.target=0;mistakes++;beep(150,.12,'square',.03);}
            first=second=null;
          }
        }
      }
      if(st==='over')t0+=dt;
      if(msgT>0)msgT-=dt;
      cards.forEach(function(c){
        c.f+=(c.target-c.f)*Math.min(1,dt*14);
        if(Math.abs(c.target-c.f)<.01)c.f=c.target;
        if(c.done>0&&c.done<1)c.done=Math.min(1,c.done+dt*3);
      });
      for(var k=parts.length-1;k>=0;k--){var p=parts[k];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;if(p.t>=p.l)parts.splice(k,1);}
    },
    pointer:function(p){
      if(st==='ready'||st==='over'){if(st==='ready'||t0>.5)start();return;}
      if(pause>0||second)return;
      for(var i=0;i<cards.length;i++){
        var c=cards[i];
        if(c.done||c.target===1)continue;
        if(p.x>=c.x&&p.x<=c.x+c.w&&p.y>=c.y&&p.y<=c.y+c.h){
          c.target=1;beep(400+c.s*30,.05,'sine',.04);
          if(!first)first=c;else{second=c;lock=.6;}
          return;
        }
      }
    },
    draw:function(){
      cards.forEach(function(c){
        if(c.done>=1)return;
        var sc=Math.abs(1-2*c.f),face=c.f>.5,cx=c.x+c.w/2,cy=c.y+c.h/2,w=Math.max(2,c.w*sc);
        var al=c.done>0?1-c.done:1,pop=c.done>0?1+c.done*.25:1;
        ctx.save();ctx.globalAlpha=al;ctx.translate(cx,cy);ctx.scale(pop,pop);
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(-w/2,-c.h/2,w,c.h,10);else ctx.rect(-w/2,-c.h/2,w,c.h);
        if(face){ctx.fillStyle='#1b2038';ctx.fill();ctx.strokeStyle='hsl('+HUES[c.s]+',70%,55%)';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.scale(sc,1);sym(c.s,0,0,Math.min(c.w,c.h)*.27,HUES[c.s]);ctx.restore();}
        else{
          var g=ctx.createLinearGradient(-w/2,-c.h/2,w/2,c.h/2);g.addColorStop(0,'#2a3260');g.addColorStop(1,'#171c3a');
          ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(142,160,255,.45)';ctx.lineWidth=2;ctx.stroke();
          ctx.save();ctx.clip();ctx.strokeStyle='rgba(142,160,255,.14)';ctx.lineWidth=1;
          for(var d=-c.h;d<w+c.h;d+=12){ctx.beginPath();ctx.moveTo(-w/2+d,-c.h/2);ctx.lineTo(-w/2+d-c.h,c.h/2);ctx.stroke();}
          ctx.restore();
        }
        ctx.restore();
      });
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle='hsl('+p.h+',85%,66%)';ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      var fr=Math.max(0,timeLeft/timeMax);
      ctx.fillStyle='rgba(142,160,255,.16)';ctx.fillRect(24,52,W-48,6);
      ctx.fillStyle=fr<.25?'#ff7d7d':'#8ea0ff';ctx.fillRect(24,52,(W-48)*fr,6);
      T(ctx,X('Level ','Level ')+level,24,28,{size:20,font:MONO});
      T(ctx,String(score),W-24,28,{size:20,font:MONO,align:'right',color:'#ffc65a'});
      T(ctx,Math.ceil(timeLeft)+' s',W/2,28,{size:16,font:MONO,align:'center',color:'#9aa3bd'});
      if(msgT>0&&st==='play'){ctx.globalAlpha=Math.min(1,msgT*2);T(ctx,msg,W/2,H-28,{size:22,weight:800,font:DISP,align:'center',color:'#ffc65a'});ctx.globalAlpha=1;}
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Finde alle Paare, bevor die Zeit abläuft.','Find all pairs before time runs out.'));
      if(st==='over')overlay(ctx,X('Zeit abgelaufen','Time is up'),levels+X(' Level geschafft, ',' levels cleared, ')+score+X(' Punkte',' points'),X('Klicke für eine neue Runde.','Click for a new run.'));
    }
  };
};

/* ---------- Nova ---------- */
FACTORY.nova=function(o){
  var ctx=o.ctx,api=o.api;
  var PY=H-56;
  var st='ready',px=W/2,tx=W/2,bul=[],ebul=[],en=[],pw=[],parts=[],stars=[],lives=3,score=0,kills=0,wave=0,toSpawn=0,spawnT=0,fireT=0,inv=0,shield=0,dbl=0,keys={},t0=0,banner=0,tt=0;
  for(var i=0;i<60;i++)stars.push({x:Math.random()*W,y:Math.random()*H,s:.4+Math.random()*1.3,v:20+Math.random()*60});
  function stats(){return{score:score,wave:wave,kills:kills};}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function burst(x,y,h,n){for(var i=0;i<(n||12);i++){var a=Math.random()*TAU,s=60+Math.random()*220;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,l:.5,h:h});}}
  function nextWave(){wave++;toSpawn=Math.min(40,5+wave*2);spawnT=.8;banner=1.7;api.report(stats());}
  function start(){st='play';px=tx=W/2;bul=[];ebul=[];en=[];pw=[];parts=[];lives=3;score=0;kills=0;wave=0;fireT=0;inv=1;shield=0;dbl=0;nextWave();}
  function spawn(){
    var r=Math.random(),type='drone';
    if(wave>=3&&r<.18)type='tank';else if(wave>=2&&r<.42)type='zig';
    var hp=type==='tank'?3+Math.floor(wave/6):1+Math.floor(wave/8);
    en.push({type:type,x:36+Math.random()*(W-72),y:-24,x0:0,hp:hp,vy:Math.min(150,50+wave*6)*(type==='tank'?.7:1),r:type==='tank'?20:15,ph:Math.random()*TAU,shoot:wave>=2?1.5+Math.random()*2.5:99});
    en[en.length-1].x0=en[en.length-1].x;
  }
  function hurt(){
    if(inv>0)return;
    if(shield>0){shield--;inv=.6;burst(px,PY,190,10);beep(300,.1,'square',.04);return;}
    lives--;inv=1.8;burst(px,PY,10,20);beep(110,.35,'sawtooth',.05);
    if(lives<=0){st='over';t0=0;api.finish(stats());}
  }
  function kill(e){
    kills++;score+=e.type==='tank'?30:(e.type==='zig'?15:10);
    burst(e.x,e.y,e.type==='tank'?30:(e.type==='zig'?160:340),14);beep(220+Math.random()*140,.08,'square',.03);
    if(Math.random()<.13){var r=Math.random();pw.push({x:e.x,y:e.y,vy:110,k:r<.45?'D':(r<.85?'S':'L')});}
    api.report(stats());
  }
  function begin(){if(st==='ready'||(st==='over'&&t0>.5)){start();return true;}return false;}
  return{
    update:function(dt){
      tt+=dt;
      stars.forEach(function(s){s.y+=s.v*dt;if(s.y>H){s.y=0;s.x=Math.random()*W;}});
      if(st==='play'){
        if(keys.l)tx-=600*dt;if(keys.r)tx+=600*dt;
        tx=clamp(tx,20,W-20);px+=(tx-px)*Math.min(1,dt*18);
        if(inv>0)inv-=dt;if(dbl>0)dbl-=dt;if(banner>0)banner-=dt;
        fireT-=dt;
        if(fireT<=0){fireT=.2;if(dbl>0){bul.push({x:px-9,y:PY-16});bul.push({x:px+9,y:PY-16});}else bul.push({x:px,y:PY-18});beep(880,.025,'square',.012);}
        if(toSpawn>0&&banner<=.7){spawnT-=dt;if(spawnT<=0){spawn();toSpawn--;spawnT=Math.max(.35,1.15-wave*.045);}}
        for(var i=bul.length-1;i>=0;i--){bul[i].y-=640*dt;if(bul[i].y<-12)bul.splice(i,1);}
        for(var j=en.length-1;j>=0;j--){
          var e=en[j];e.y+=e.vy*dt;
          if(e.type==='zig')e.x=clamp(e.x0+Math.sin(tt*2.4+e.ph)*70,20,W-20);
          if(e.type==='drone')e.x=clamp(e.x0+Math.sin(tt*1.1+e.ph)*18,20,W-20);
          e.shoot-=dt;
          if(e.shoot<=0&&e.y>0&&e.y<H-170){e.shoot=Math.max(1.3,3.2-wave*.12)+Math.random()*1.2;var aim=wave>=5?clamp((px-e.x)/260,-.6,.6):0;ebul.push({x:e.x,y:e.y+e.r,vx:aim*80,vy:190+wave*6});}
          var dead=false;
          for(var b=bul.length-1;b>=0;b--){
            if(Math.abs(bul[b].x-e.x)<e.r+3&&Math.abs(bul[b].y-e.y)<e.r+8){bul.splice(b,1);e.hp--;if(e.hp<=0){kill(e);dead=true;break;}else beep(180,.03,'square',.02);}
          }
          if(dead){en.splice(j,1);continue;}
          if(Math.hypot(e.x-px,e.y-PY)<e.r+13){burst(e.x,e.y,30,12);en.splice(j,1);hurt();if(st!=='play')break;continue;}
          if(e.y>H+24){en.splice(j,1);if(inv<=0||true){lives--;burst(e.x,H-10,10,10);beep(110,.3,'sawtooth',.05);if(lives<=0){st='over';t0=0;api.finish(stats());break;}}}
        }
        if(st==='play'){
          for(var q=ebul.length-1;q>=0;q--){
            var eb=ebul[q];eb.x+=eb.vx*dt;eb.y+=eb.vy*dt;
            if(eb.y>H+10||eb.x<-10||eb.x>W+10){ebul.splice(q,1);continue;}
            if(Math.hypot(eb.x-px,eb.y-PY)<14){ebul.splice(q,1);hurt();if(st!=='play')break;}
          }
          for(var w=pw.length-1;w>=0;w--){
            var p=pw[w];p.y+=p.vy*dt;
            if(p.y>H+10){pw.splice(w,1);continue;}
            if(Math.hypot(p.x-px,p.y-PY)<26){
              pw.splice(w,1);beep(990,.12,'triangle',.06);
              if(p.k==='D')dbl=10;else if(p.k==='S')shield=1;else lives=Math.min(5,lives+1);
            }
          }
          if(toSpawn<=0&&en.length===0&&banner<=0)nextWave();
        }
      }
      if(st==='over')t0+=dt;
      for(var k=parts.length-1;k>=0;k--){var pp=parts[k];pp.t+=dt;pp.x+=pp.vx*dt;pp.y+=pp.vy*dt;pp.vx*=.96;pp.vy*=.96;if(pp.t>=pp.l)parts.splice(k,1);}
    },
    pointer:function(p){if(begin())return;tx=p.x;},
    move:function(p){if(st==='play')tx=p.x;},
    key:function(e){
      var k=e.key;
      if(k==='ArrowLeft'||k==='a'||k==='A'){keys.l=true;return true;}
      if(k==='ArrowRight'||k==='d'||k==='D'){keys.r=true;return true;}
      if(k===' '||k==='Enter'){begin();return true;}
      return false;
    },
    keyup:function(e){
      var k=e.key;
      if(k==='ArrowLeft'||k==='a'||k==='A')keys.l=false;
      if(k==='ArrowRight'||k==='d'||k==='D')keys.r=false;
    },
    draw:function(){
      stars.forEach(function(s){ctx.fillStyle='rgba(220,230,255,'+(.25+s.s*.3)+')';ctx.fillRect(s.x,s.y,s.s,s.s*2);});
      pw.forEach(function(p){
        var c=p.k==='D'?'#ffc65a':(p.k==='S'?'#7fe3ff':'#ff8fa3');
        var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,18);g.addColorStop(0,c);g.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,18,0,TAU);ctx.fill();
        T(ctx,p.k==='L'?'+':p.k,p.x,p.y+1,{size:13,weight:800,font:MONO,align:'center',color:'#0b0e16'});
      });
      en.forEach(function(e){
        ctx.save();ctx.translate(e.x,e.y);
        if(e.type==='tank'){
          ctx.fillStyle='hsl(30,80%,'+(48+e.hp*4)+'%)';ctx.beginPath();for(var k=0;k<6;k++){var a=k*PI/3+PI/6;ctx.lineTo(Math.cos(a)*e.r,Math.sin(a)*e.r);}ctx.closePath();ctx.fill();
          ctx.fillStyle='#0b0e16';ctx.fillRect(-6,-3,12,6);
        }else if(e.type==='zig'){
          ctx.fillStyle='#6fe0b0';ctx.beginPath();ctx.moveTo(0,e.r);ctx.lineTo(e.r,-e.r*.8);ctx.lineTo(0,-e.r*.3);ctx.lineTo(-e.r,-e.r*.8);ctx.closePath();ctx.fill();
        }else{
          ctx.fillStyle='#ff6f9a';ctx.beginPath();ctx.moveTo(0,-e.r);ctx.lineTo(e.r,0);ctx.lineTo(0,e.r);ctx.lineTo(-e.r,0);ctx.closePath();ctx.fill();
          ctx.fillStyle='#0b0e16';ctx.fillRect(-3,-3,6,6);
        }
        ctx.restore();
      });
      ctx.fillStyle='#ffe08a';bul.forEach(function(b){ctx.fillRect(b.x-1.5,b.y-9,3,14);});
      ebul.forEach(function(b){var g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,9);g.addColorStop(0,'#fff');g.addColorStop(.4,'#ff7d7d');g.addColorStop(1,'rgba(255,90,90,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,9,0,TAU);ctx.fill();});
      if(st!=='over'&&!(inv>0&&Math.floor(tt*14)%2===0)){
        ctx.save();ctx.translate(px,PY);
        var fl=8+Math.random()*8;ctx.fillStyle='#ff9c7a';ctx.beginPath();ctx.moveTo(-6,12);ctx.lineTo(0,12+fl);ctx.lineTo(6,12);ctx.fill();
        ctx.fillStyle='#8ea0ff';ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(16,14);ctx.lineTo(0,8);ctx.lineTo(-16,14);ctx.closePath();ctx.fill();
        ctx.fillStyle='#e8ebf4';ctx.fillRect(-2,-6,4,8);
        if(shield>0){ctx.strokeStyle='rgba(127,227,255,.85)';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,26,0,TAU);ctx.stroke();}
        ctx.restore();
      }
      parts.forEach(function(p){ctx.globalAlpha=1-p.t/p.l;ctx.fillStyle='hsl('+p.h+',90%,65%)';ctx.fillRect(p.x-2,p.y-2,4,4);});
      ctx.globalAlpha=1;
      T(ctx,String(score),24,28,{size:24,font:MONO});
      T(ctx,X('Welle ','Wave ')+wave,W/2,28,{size:16,font:MONO,align:'center',color:'#9aa3bd'});
      for(var l=0;l<lives;l++){ctx.fillStyle='#8ea0ff';ctx.beginPath();ctx.moveTo(W-24-l*20,18);ctx.lineTo(W-16-l*20,36);ctx.lineTo(W-24-l*20,32);ctx.lineTo(W-32-l*20,36);ctx.closePath();ctx.fill();}
      if(dbl>0)T(ctx,X('Doppelschuss ','Double shot ')+Math.ceil(dbl)+' s',24,52,{size:13,font:MONO,color:'#ffc65a'});
      if(banner>0&&st==='play'){ctx.globalAlpha=Math.min(1,banner*2);T(ctx,X('Welle ','Wave ')+wave,W/2,H/2-60,{size:34,weight:800,font:DISP,align:'center',color:'#ffc65a'});ctx.globalAlpha=1;}
      if(st==='ready')overlay(ctx,o.name(),X('Klicke zum Starten','Click to start'),X('Dein Schiff schießt automatisch. Steuere mit der Maus.','Your ship fires automatically. Steer with the mouse.'));
      if(st==='over')overlay(ctx,X('Schiff zerstört','Ship destroyed'),X('Welle ','Wave ')+wave+', '+kills+X(' Gegner, ',' kills, ')+score+X(' Punkte',' points'),X('Klicke für einen neuen Flug.','Click for a new flight.'));
    }
  };
};

/* ---------- Animierte Hintergründe (Shop) ---------- */
var FXBG={};
function hsl2rgb(h,s,l){
  h=(((h%360)+360)%360)/360;
  var q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;
  function f(t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;}
  return[f(h+1/3)*255,f(h)*255,f(h-1/3)*255];
}
FXBG.warp=function(w,h){
  var N=Math.round(Math.max(130,w*h/5500)),cx=w/2,cy=h/2,st=[];
  function reset(s,first){s.x=(Math.random()-.5)*w*2;s.y=(Math.random()-.5)*h*2;s.z=first?Math.random()*w:w;s.pz=s.z;var r=Math.random();s.hue=r<.65?215:(r<.85?300:40);}
  for(var i=0;i<N;i++){var s={};reset(s,true);st.push(s);}
  return function(ctx,t,dt){
    ctx.fillStyle='rgba(5,7,20,.3)';ctx.fillRect(0,0,w,h);
    var sp=w*(.4+.3*Math.sin(t*.45)),k=w*.5;
    for(var i=0;i<N;i++){
      var s=st[i];s.pz=s.z;s.z-=sp*dt;
      if(s.z<=1){reset(s);continue;}
      var sx=cx+s.x/s.z*k,sy=cy+s.y/s.z*k,px=cx+s.x/s.pz*k,py=cy+s.y/s.pz*k;
      if(sx<-20||sx>w+20||sy<-20||sy>h+20){reset(s);continue;}
      var a=1-s.z/w;
      ctx.strokeStyle='hsla('+s.hue+',90%,'+(62+a*30)+'%,'+(.25+a*.75)+')';
      ctx.lineWidth=.4+a*2.6;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(sx,sy);ctx.stroke();
    }
    var g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.55);
    g.addColorStop(0,'rgba(130,150,255,'+(.16+.07*Math.sin(t*2))+')');g.addColorStop(1,'rgba(130,150,255,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  };
};
FXBG.regen=function(w,h){
  var fs=Math.max(13,Math.round(w/72)),cols=Math.ceil(w/fs),drops=[];
  var chars='01アイウエオカキクケコサシスセソタチツテト+*=<>ΣΩ'.split('');
  for(var i=0;i<cols;i++){var y=-Math.random()*h/fs;drops.push({y:y,row:Math.floor(y),sp:6+Math.random()*16,hx:null,hy:0,hc:''});}
  return function(ctx,t,dt){
    ctx.fillStyle='rgba(3,10,14,.16)';ctx.fillRect(0,0,w,h);
    ctx.font='500 '+fs+'px '+MONO;ctx.textBaseline='top';ctx.textAlign='left';
    for(var i=0;i<cols;i++){
      var d=drops[i];d.y+=d.sp*dt;
      var row=Math.floor(d.y);
      while(d.row<row){
        d.row++;
        if(d.hx!==null){ctx.fillStyle='rgba(40,230,160,.88)';ctx.fillText(d.hc,d.hx,d.hy);}
        d.hc=chars[Math.floor(Math.random()*chars.length)];d.hx=i*fs;d.hy=d.row*fs;
        ctx.fillStyle='rgb(214,255,240)';ctx.fillText(d.hc,d.hx,d.hy);
      }
      if(d.row*fs>h&&Math.random()<.04){d.y=-Math.random()*20;d.row=Math.floor(d.y);d.hx=null;d.sp=6+Math.random()*16;}
    }
  };
};
FXBG.gluehwurm=function(w,h){
  var flies=[],stars=[],N=Math.round(Math.max(30,w*h/15000));
  for(var i=0;i<N;i++)flies.push({x:Math.random()*w,y:h*.3+Math.random()*h*.7,vx:(Math.random()-.5)*14,vy:-3-Math.random()*8,ph:Math.random()*TAU,sp:.6+Math.random()*1.4,r:1.4+Math.random()*1.8});
  for(var j=0;j<80;j++)stars.push({x:Math.random()*w,y:Math.random()*h*.55,s:.5+Math.random()*2,ph:Math.random()*TAU,r:.5+Math.random()*1.1});
  function hill(ctx,t,base,amp,fr,col,spd,seed){
    ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,h);
    for(var x=0;x<=w+8;x+=8)ctx.lineTo(x,h*base+Math.sin(x*fr+t*spd+seed)*h*amp+Math.sin(x*fr*2.3+seed*1.7)*h*amp*.4);
    ctx.lineTo(w,h);ctx.closePath();ctx.fill();
  }
  return function(ctx,t,dt){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#050a1c');g.addColorStop(.6,'#0d1f3a');g.addColorStop(1,'#17334c');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    stars.forEach(function(s){ctx.globalAlpha=.25+.75*Math.abs(Math.sin(t*s.s+s.ph));ctx.fillStyle='#fff';ctx.fillRect(s.x,s.y,s.r,s.r);});
    ctx.globalAlpha=1;
    var mx=w*.78,my=h*.2,mr=Math.min(w,h)*.07,mg=ctx.createRadialGradient(mx,my,mr*.6,mx,my,mr*4);
    mg.addColorStop(0,'rgba(255,244,214,.35)');mg.addColorStop(1,'rgba(255,244,214,0)');
    ctx.fillStyle=mg;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#fff4d6';ctx.beginPath();ctx.arc(mx,my,mr,0,TAU);ctx.fill();
    hill(ctx,t,.7,.045,.004,'#0b1a2b',.06,0);
    hill(ctx,t,.8,.04,.006,'#08121f',.09,3);
    ctx.save();ctx.globalCompositeOperation='lighter';
    flies.forEach(function(f){
      f.x+=(f.vx+Math.sin(t*f.sp+f.ph)*10)*dt;f.y+=(f.vy+Math.cos(t*f.sp*.8+f.ph)*8)*dt;
      if(f.y<h*.2){f.y=h*1.02;f.x=Math.random()*w;}
      if(f.x<-20)f.x=w+20;if(f.x>w+20)f.x=-20;
      var gl=.5+.5*Math.sin(t*f.sp*2+f.ph),rr=f.r*(5+gl*7);
      var fg=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,rr);
      fg.addColorStop(0,'rgba(255,238,140,'+(.35+gl*.65)+')');fg.addColorStop(.3,'rgba(210,255,110,'+(gl*.4)+')');fg.addColorStop(1,'rgba(180,255,80,0)');
      ctx.fillStyle=fg;ctx.beginPath();ctx.arc(f.x,f.y,rr,0,TAU);ctx.fill();
    });
    ctx.restore();
    hill(ctx,t,.9,.035,.009,'#050c14',.12,7);
  };
};
FXBG.plasma=function(w,h){
  var gw=96,gh=Math.max(40,Math.round(gw*h/w)),off=document.createElement('canvas');
  off.width=gw;off.height=gh;
  var oc=off.getContext('2d'),img=oc.createImageData(gw,gh);
  return function(ctx,t,dt){
    var d=img.data,i=0;
    for(var y=0;y<gh;y++){
      for(var x=0;x<gw;x++){
        var u=x/gw*6,v=y/gh*4;
        var val=Math.sin(u+t*.7)+Math.sin(v*1.7-t*.9)+Math.sin((u+v)*.9+t*.5)+Math.sin(Math.hypot(u-3+Math.sin(t*.3)*2,v-2+Math.cos(t*.4)*1.5)*1.8-t*1.1);
        var c=hsl2rgb(250+val*18+30*Math.sin(t*.2),.85,.36+.15*Math.sin(val*1.3+t*.6));
        d[i++]=c[0];d[i++]=c[1];d[i++]=c[2];d[i++]=255;
      }
    }
    oc.putImageData(img,0,0);
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    ctx.drawImage(off,0,0,w,h);
  };
};

/* ---------- Animierte Mauszeiger (Shop) ---------- */
var FXCUR={};
function spark4(ctx,x,y,r){ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.quadraticCurveTo(x,y,x,y+r);ctx.quadraticCurveTo(x,y,x-r,y);ctx.quadraticCurveTo(x,y,x,y-r);ctx.fill();}
FXCUR.komet=function(){
  var ps=[],x=null,y=0,lx=0,ly=0,hv=false;
  return{
    update:function(dt,mx,my,hov){
      hv=hov;
      if(x===null){x=mx;y=my;}
      lx=x;ly=y;x+=(mx-x)*Math.min(1,dt*30);y+=(my-y)*Math.min(1,dt*30);
      var d=Math.hypot(x-lx,y-ly),n=Math.min(6,2+Math.floor(d/4));
      for(var i=0;i<n;i++){var k=i/n;ps.push({x:lx+(x-lx)*k,y:ly+(y-ly)*k,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30+10,t:0,l:.55+Math.random()*.5,r:3+Math.random()*5,sp:0});}
      if(Math.random()<.35)ps.push({x:x,y:y,vx:(Math.random()-.5)*170,vy:(Math.random()-.5)*170,t:0,l:.4,r:1.6,sp:1});
      for(var j=ps.length-1;j>=0;j--){var p=ps[j];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;if(p.t>=p.l)ps.splice(j,1);}
      if(ps.length>260)ps.splice(0,ps.length-260);
    },
    draw:function(ctx){
      if(x===null)return;
      ctx.save();ctx.globalCompositeOperation='lighter';
      ps.forEach(function(p){
        var a=1-p.t/p.l,r=p.r*(p.sp?1:(.4+a*.8)),g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*2.2);
        g.addColorStop(0,p.sp?'rgba(255,240,200,'+a+')':'rgba(255,'+Math.round(120+a*100)+','+Math.round(40+a*40)+','+(a*.55)+')');
        g.addColorStop(1,'rgba(255,80,20,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r*2.2,0,TAU);ctx.fill();
      });
      var hr=hv?22:16,g2=ctx.createRadialGradient(x,y,0,x,y,hr);
      g2.addColorStop(0,'rgba(255,255,255,1)');g2.addColorStop(.35,'rgba(255,214,150,.85)');g2.addColorStop(1,'rgba(255,140,60,0)');
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(x,y,hr,0,TAU);ctx.fill();
      ctx.restore();
    }
  };
};
FXCUR.neon=function(){
  var pts=[],tt=0,hv=false;
  return{
    update:function(dt,mx,my,hov){tt+=dt;hv=hov;pts.push({x:mx,y:my});if(pts.length>34)pts.shift();},
    draw:function(ctx){
      if(pts.length<2)return;
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
      for(var pass=0;pass<2;pass++){
        for(var i=1;i<pts.length;i++){
          var k=i/pts.length,hue=(tt*90+i*7)%360;
          ctx.strokeStyle='hsla('+hue+',100%,'+(pass?78:55)+'%,'+(pass?k:k*.35)+')';
          ctx.lineWidth=(pass?1.6:7)*(.25+k*.9);
          ctx.beginPath();ctx.moveTo(pts[i-1].x,pts[i-1].y);ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
        }
      }
      var h=pts[pts.length-1],hue2=(tt*90+240)%360;
      ctx.fillStyle='hsl('+hue2+',100%,85%)';ctx.beginPath();ctx.arc(h.x,h.y,hv?7:4.5,0,TAU);ctx.fill();
      ctx.strokeStyle='hsla('+hue2+',100%,70%,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(h.x,h.y,hv?15:10,0,TAU);ctx.stroke();
      ctx.restore();
    }
  };
};
FXCUR.funken=function(){
  var ps=[],x=null,y=0,lx=0,ly=0,tt=0,hv=false,HUES=[48,40,330,190];
  return{
    update:function(dt,mx,my,hov){
      tt+=dt;hv=hov;
      if(x===null){x=mx;y=my;}
      lx=x;ly=y;x=mx;y=my;
      var d=Math.hypot(x-lx,y-ly),n=Math.min(8,1+Math.floor(d/6));
      for(var i=0;i<n;i++){var k=Math.random();ps.push({x:lx+(x-lx)*k+(Math.random()-.5)*8,y:ly+(y-ly)*k+(Math.random()-.5)*8,vx:(Math.random()-.5)*60,vy:-20+Math.random()*30,t:0,l:.7+Math.random()*.8,r:2+Math.random()*4.5,h:HUES[Math.floor(Math.random()*4)],ph:Math.random()*TAU});}
      for(var j=ps.length-1;j>=0;j--){var p=ps[j];p.t+=dt;p.vy+=140*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t>=p.l)ps.splice(j,1);}
      if(ps.length>240)ps.splice(0,ps.length-240);
    },
    draw:function(ctx){
      if(x===null)return;
      ctx.save();ctx.globalCompositeOperation='lighter';
      ps.forEach(function(p){
        var a=1-p.t/p.l,tw=.6+.4*Math.sin(p.t*18+p.ph);
        ctx.fillStyle='hsla('+p.h+',100%,'+(70+a*20)+'%,'+(a*tw)+')';
        spark4(ctx,p.x,p.y,p.r*(.5+a*.7));
      });
      var g=ctx.createRadialGradient(x,y,0,x,y,18);g.addColorStop(0,'rgba(255,230,150,.55)');g.addColorStop(1,'rgba(255,200,80,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,18,0,TAU);ctx.fill();
      ctx.save();ctx.translate(x,y);ctx.rotate(tt*2);ctx.fillStyle='#fff3c4';spark4(ctx,0,0,hv?14:10);ctx.restore();
      ctx.restore();
    }
  };
};
FXCUR.satellit=function(){
  var x=null,y=0,tt=0,k=1,hv=false;
  var sats=[{r:15,s:3.2,a:0,c:'#7fe3ff'},{r:23,s:-2.1,a:2,c:'#ffc65a'},{r:31,s:1.4,a:4,c:'#ff8fb0'}];
  return{
    update:function(dt,mx,my,hov){
      tt+=dt;hv=hov;
      if(x===null){x=mx;y=my;}
      x+=(mx-x)*Math.min(1,dt*22);y+=(my-y)*Math.min(1,dt*22);
      k+=((hov?.62:1)-k)*Math.min(1,dt*10);
      sats.forEach(function(s){s.a+=s.s*dt*(hov?1.8:1);});
    },
    draw:function(ctx){
      if(x===null)return;
      ctx.save();
      ctx.lineWidth=1;
      sats.forEach(function(s){ctx.strokeStyle='rgba(200,215,255,.2)';ctx.beginPath();ctx.arc(x,y,s.r*k,0,TAU);ctx.stroke();});
      ctx.globalCompositeOperation='lighter';
      sats.forEach(function(s){
        for(var i=10;i>=0;i--){
          var a=s.a-(s.s>0?1:-1)*i*.1,px=x+Math.cos(a)*s.r*k,py=y+Math.sin(a)*s.r*k;
          ctx.globalAlpha=(1-i/11)*.6;ctx.fillStyle=s.c;ctx.beginPath();ctx.arc(px,py,i===0?3.6:Math.max(.8,2.8-i*.2),0,TAU);ctx.fill();
        }
      });
      ctx.globalAlpha=1;
      var g=ctx.createRadialGradient(x,y,0,x,y,12);
      g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(170,190,255,.7)');g.addColorStop(1,'rgba(120,140,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,12,0,TAU);ctx.fill();
      ctx.restore();
    }
  };
};

/* ---------- Weitere Shop-Hintergründe ---------- */
FXBG.sternschnuppen=function(w,h){
  var stars=[],shoot=[],tNext=.5,i,N=Math.round(Math.max(120,w*h/6000)),ridge=[],ridge2=[];
  for(i=0;i<N;i++)stars.push({x:Math.random()*w,y:Math.random()*h*.85,r:.4+Math.random()*1.4,ph:Math.random()*TAU,sp:.6+Math.random()*2.4});
  for(i=0;i<=48;i++){ridge.push(h*.86+Math.sin(i*.52)*h*.03+Math.sin(i*1.31+2)*h*.025);ridge2.push(h*.93+Math.sin(i*.8+1)*h*.02+Math.sin(i*2.1)*h*.012);}
  function poly(ctx,arr,col){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,h);for(var k=0;k<arr.length;k++)ctx.lineTo(k/(arr.length-1)*w,arr[k]);ctx.lineTo(w,h);ctx.closePath();ctx.fill();}
  return function(ctx,t,dt){
    var g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#04061a');g.addColorStop(.55,'#111b48');g.addColorStop(1,'#2c2560');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    stars.forEach(function(s){ctx.globalAlpha=.25+.75*Math.abs(Math.sin(t*s.sp+s.ph));ctx.fillStyle='#fff';ctx.fillRect(s.x,s.y,s.r,s.r);});
    ctx.globalAlpha=1;
    tNext-=dt;
    if(tNext<=0){
      var a=PI-(.45+Math.random()*.4),sp=650+Math.random()*500;
      shoot.push({x:w*(.3+Math.random()*.8),y:-10+Math.random()*h*.35,dx:Math.cos(a),dy:Math.sin(a),sp:sp,t:0,l:.9+Math.random()*.6,len:120+Math.random()*130});
      tNext=.6+Math.random()*2.2;
    }
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(i=shoot.length-1;i>=0;i--){
      var s=shoot[i];s.t+=dt;s.x+=s.dx*s.sp*dt;s.y+=s.dy*s.sp*dt;
      if(s.t>=s.l||s.y>h||s.x<-200){shoot.splice(i,1);continue;}
      var al=Math.min(1,s.t*8)*(1-s.t/s.l),tx=s.x-s.dx*s.len,ty=s.y-s.dy*s.len;
      var lg=ctx.createLinearGradient(s.x,s.y,tx,ty);lg.addColorStop(0,'rgba(255,255,255,'+al+')');lg.addColorStop(1,'rgba(150,180,255,0)');
      ctx.strokeStyle=lg;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(tx,ty);ctx.stroke();
      var hg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,9);hg.addColorStop(0,'rgba(255,255,255,'+al+')');hg.addColorStop(1,'rgba(180,200,255,0)');
      ctx.fillStyle=hg;ctx.beginPath();ctx.arc(s.x,s.y,9,0,TAU);ctx.fill();
    }
    ctx.restore();
    poly(ctx,ridge,'#0a0d26');poly(ctx,ridge2,'#04061a');
  };
};
FXBG.wellen=function(w,h){
  var bubbles=[],i,N=Math.round(Math.max(24,w*h/22000));
  for(i=0;i<N;i++)bubbles.push({x:Math.random()*w,y:Math.random()*h,r:1.5+Math.random()*4,sp:12+Math.random()*30,ph:Math.random()*TAU});
  var layers=[{y:.36,amp:.035,fr:.006,sp:.5,c:'rgba(40,170,215,.28)'},{y:.5,amp:.04,fr:.0045,sp:-.38,c:'rgba(22,115,175,.36)'},{y:.65,amp:.045,fr:.0035,sp:.3,c:'rgba(12,72,135,.46)'},{y:.8,amp:.04,fr:.005,sp:-.22,c:'rgba(6,38,88,.66)'}];
  return function(ctx,t,dt){
    var g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0b6f90');g.addColorStop(.5,'#06344f');g.addColorStop(1,'#020b18');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(i=0;i<5;i++){
      var rx=w*(.08+i*.2)+Math.sin(t*.25+i)*w*.04,rg=ctx.createLinearGradient(rx,0,rx+w*.12,h*.8);
      rg.addColorStop(0,'rgba(160,240,255,.14)');rg.addColorStop(1,'rgba(160,240,255,0)');
      ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(rx-w*.02,0);ctx.lineTo(rx+w*.05,0);ctx.lineTo(rx+w*.2,h*.8);ctx.lineTo(rx+w*.06,h*.8);ctx.closePath();ctx.fill();
    }
    ctx.restore();
    layers.forEach(function(L,li){
      ctx.fillStyle=L.c;ctx.beginPath();ctx.moveTo(0,h);
      for(var x=0;x<=w+10;x+=10)ctx.lineTo(x,h*L.y+Math.sin(x*L.fr*TAU*.25+t*L.sp+li)*h*L.amp+Math.sin(x*L.fr*TAU*.6-t*L.sp*1.3)*h*L.amp*.4);
      ctx.lineTo(w,h);ctx.closePath();ctx.fill();
    });
    ctx.strokeStyle='rgba(190,240,255,.5)';ctx.lineWidth=1;
    bubbles.forEach(function(b){
      b.y-=b.sp*dt;if(b.y<-10){b.y=h+10;b.x=Math.random()*w;}
      ctx.beginPath();ctx.arc(b.x+Math.sin(t*1.4+b.ph)*6,b.y,b.r,0,TAU);ctx.stroke();
    });
  };
};
FXBG.gewitter=function(w,h){
  var drops=[],clouds=[],i,N=Math.round(Math.max(160,w*h/5500)),flash=0,bolt=null,boltT=0,next=1.4+Math.random()*2;
  for(i=0;i<N;i++)drops.push({x:Math.random()*w*1.2,y:Math.random()*h,l:10+Math.random()*16,sp:700+Math.random()*500});
  for(i=0;i<7;i++)clouds.push({x:Math.random()*w,y:h*(.04+Math.random()*.22),r:Math.max(w,h)*(.18+Math.random()*.16),sp:8+Math.random()*16,a:.5+Math.random()*.3});
  function makeBolt(){
    var pts=[],x=w*(.15+Math.random()*.7),y=0,tx=x+(Math.random()-.5)*w*.2,ty=h*(.5+Math.random()*.35);
    while(y<ty){pts.push([x,y]);y+=h*(.03+Math.random()*.04);x+=(Math.random()-.5)*w*.05+(tx-x)*.08;}
    pts.push([x,y]);return pts;
  }
  return function(ctx,t,dt){
    var g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0a0f1d');g.addColorStop(1,'#1b2640');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    clouds.forEach(function(c){
      c.x+=c.sp*dt;if(c.x-c.r>w)c.x=-c.r;
      var cg=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,c.r);cg.addColorStop(0,'rgba(48,60,88,'+c.a+')');cg.addColorStop(1,'rgba(48,60,88,0)');
      ctx.fillStyle=cg;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,TAU);ctx.fill();
    });
    next-=dt;
    if(next<=0){bolt=makeBolt();boltT=.3;flash=1;next=2.4+Math.random()*4.6;}
    ctx.strokeStyle='rgba(170,190,230,.4)';ctx.lineWidth=1;ctx.beginPath();
    drops.forEach(function(d){
      d.y+=d.sp*dt;d.x-=d.sp*.18*dt;
      if(d.y>h+20||d.x<-30){d.y=-20-Math.random()*60;d.x=Math.random()*w*1.2;}
      ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+d.l*.18,d.y-d.l);
    });
    ctx.stroke();
    if(boltT>0){
      ctx.save();ctx.shadowColor='rgba(180,200,255,1)';ctx.shadowBlur=22;ctx.strokeStyle='rgba(235,242,255,'+Math.min(1,boltT/.18)+')';ctx.lineWidth=3;ctx.lineJoin='round';
      ctx.beginPath();bolt.forEach(function(p,k){if(k)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);});ctx.stroke();ctx.restore();
      boltT-=dt;
    }
    if(flash>0){ctx.fillStyle='rgba(190,205,255,'+(flash*.3)+')';ctx.fillRect(0,0,w,h);flash=Math.max(0,flash-dt*3.2);}
  };
};

/* ---------- Weitere Shop-Mauszeiger ---------- */
FXCUR.blitz=function(){
  var pts=[],hv=false;
  function arc(ctx,fx,fy,tx,ty,jit){
    var dx=tx-fx,dy=ty-fy,L=Math.hypot(dx,dy),n=Math.max(3,Math.round(L/9));
    ctx.beginPath();ctx.moveTo(fx,fy);
    for(var i=1;i<=n;i++){var k=i/n,j=(1-k)*jit;ctx.lineTo(fx+dx*k+(Math.random()-.5)*j*2,fy+dy*k+(Math.random()-.5)*j*2);}
    ctx.strokeStyle='rgba(110,180,255,.5)';ctx.lineWidth=5;ctx.stroke();
    ctx.strokeStyle='rgba(240,248,255,.95)';ctx.lineWidth=1.4;ctx.stroke();
  }
  return{
    update:function(dt,mx,my,hov){hv=hov;pts.push({x:mx,y:my});if(pts.length>16)pts.shift();},
    draw:function(ctx){
      if(pts.length<2)return;
      var h=pts[pts.length-1];
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
      for(var a=0;a<3;a++){var t=pts[Math.max(0,pts.length-1-(3+a*4))];arc(ctx,h.x,h.y,t.x,t.y,hv?14:9);}
      for(var r=0;r<4;r++){var an=Math.random()*TAU,len=(hv?30:18)*(.4+Math.random());arc(ctx,h.x,h.y,h.x+Math.cos(an)*len,h.y+Math.sin(an)*len,5);}
      var g=ctx.createRadialGradient(h.x,h.y,0,h.x,h.y,hv?20:14);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(130,190,255,.7)');g.addColorStop(1,'rgba(80,140,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(h.x,h.y,hv?20:14,0,TAU);ctx.fill();
      ctx.restore();
    }
  };
};
FXCUR.feuer=function(){
  var ps=[],x=null,y=0,hv=false;
  return{
    update:function(dt,mx,my,hov){
      hv=hov;if(x===null){x=mx;y=my;}
      x+=(mx-x)*Math.min(1,dt*35);y+=(my-y)*Math.min(1,dt*35);
      var n=hv?7:4;
      for(var i=0;i<n;i++)ps.push({x:x+(Math.random()-.5)*8,y:y+(Math.random()-.5)*6,vx:(Math.random()-.5)*40,vy:-60-Math.random()*110,t:0,l:.45+Math.random()*.5,r:5+Math.random()*7});
      for(var j=ps.length-1;j>=0;j--){var p=ps[j];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx+=(Math.random()-.5)*120*dt;if(p.t>=p.l)ps.splice(j,1);}
      if(ps.length>320)ps.splice(0,ps.length-320);
    },
    draw:function(ctx){
      if(x===null)return;
      ctx.save();ctx.globalCompositeOperation='lighter';
      ps.forEach(function(p){
        var k=p.t/p.l,r=p.r*(1-k*.8),g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*2);
        g.addColorStop(0,'hsla('+(55-k*50)+',100%,'+(70-k*25)+'%,'+((1-k)*.9)+')');g.addColorStop(1,'hsla('+(20-k*20)+',100%,50%,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r*2,0,TAU);ctx.fill();
      });
      var hr=hv?16:11,g2=ctx.createRadialGradient(x,y,0,x,y,hr);g2.addColorStop(0,'rgba(255,255,230,1)');g2.addColorStop(.5,'rgba(255,200,90,.8)');g2.addColorStop(1,'rgba(255,120,30,0)');
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(x,y,hr,0,TAU);ctx.fill();
      ctx.restore();
    }
  };
};
FXCUR.blueten=function(){
  var ps=[],x=null,y=0,lx=0,ly=0,hv=false;
  return{
    update:function(dt,mx,my,hov){
      hv=hov;if(x===null){x=mx;y=my;}
      lx=x;ly=y;x=mx;y=my;
      var d=Math.hypot(x-lx,y-ly),n=(d>2?1:0)+(Math.random()<.18?1:0)+(hv?1:0);
      for(var i=0;i<n;i++)ps.push({x:x+(Math.random()-.5)*12,y:y+(Math.random()-.5)*12,vx:(Math.random()-.5)*50,vy:10+Math.random()*30,rot:Math.random()*TAU,vr:(Math.random()-.5)*5,t:0,l:1.4+Math.random()*1.2,s:5+Math.random()*5,h:330+Math.random()*25,ph:Math.random()*TAU});
      for(var j=ps.length-1;j>=0;j--){var p=ps[j];p.t+=dt;p.vy=Math.min(70,p.vy+26*dt);p.x+=(p.vx+Math.sin(p.t*3+p.ph)*26)*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;if(p.t>=p.l)ps.splice(j,1);}
      if(ps.length>200)ps.splice(0,ps.length-200);
    },
    draw:function(ctx){
      if(x===null)return;
      ps.forEach(function(p){
        var a=Math.min(1,(1-p.t/p.l)*1.6);
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=a;
        ctx.fillStyle='hsl('+p.h+',85%,80%)';ctx.beginPath();ctx.ellipse(0,0,p.s,p.s*.55,0,0,TAU);ctx.fill();
        ctx.fillStyle='hsl('+p.h+',90%,90%)';ctx.beginPath();ctx.ellipse(-p.s*.25,0,p.s*.45,p.s*.25,0,0,TAU);ctx.fill();
        ctx.restore();
      });
      ctx.save();
      var hr=hv?14:10;ctx.strokeStyle='rgba(255,170,205,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,hr,0,TAU);ctx.stroke();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();
      ctx.restore();
    }
  };
};

/* ---------- Effekt-Motoren ---------- */
var bgEng={raf:0,draw:null,t:0,last:0,ctx:null};
function bgLoop(ts){
  if(!bgEng.draw)return;
  var dt=Math.min(.05,(ts-bgEng.last)/1000||.016);bgEng.last=ts;bgEng.t+=dt;
  try{bgEng.draw(bgEng.ctx,bgEng.t,dt);}catch(e){stopBgFx();return;}
  bgEng.raf=requestAnimationFrame(bgLoop);
}
function stopBgFx(){cancelAnimationFrame(bgEng.raf);bgEng.raf=0;bgEng.draw=null;$bg.classList.remove('fx');}
function startBgFx(id){
  stopBgFx();
  var d=REW[id];if(!d||!FXBG[d.fx])return;
  var cv=$('bgcv'),sc=Math.min(1,1400/Math.max(1,window.innerWidth));
  cv.width=Math.max(320,Math.round(window.innerWidth*sc));cv.height=Math.max(240,Math.round(window.innerHeight*sc));
  bgEng.ctx=cv.getContext('2d');bgEng.draw=FXBG[d.fx](cv.width,cv.height);bgEng.t=0;bgEng.last=performance.now();
  $bg.classList.add('fx');
  if(reduced){for(var i=0;i<60;i++){bgEng.t+=.05;bgEng.draw(bgEng.ctx,bgEng.t,.05);}bgEng.draw=null;return;}
  bgEng.raf=requestAnimationFrame(bgLoop);
}

var $curfx=$('curfx'),curCtx=null,curEng={fx:null,raf:0,x:-999,y:-999,seen:false,hov:false,last:0};
function sizeCur(){
  var d=Math.min(2,window.devicePixelRatio||1);
  $curfx.width=Math.round(window.innerWidth*d);$curfx.height=Math.round(window.innerHeight*d);
  curCtx=$curfx.getContext('2d');curCtx.setTransform(d,0,0,d,0,0);
}
function curLoop(ts){
  if(!curEng.fx)return;
  var dt=Math.min(.05,(ts-curEng.last)/1000||.016);curEng.last=ts;
  try{
    curCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
    if(curEng.seen){curEng.fx.update(dt,curEng.x,curEng.y,curEng.hov);curEng.fx.draw(curCtx);}
  }catch(e){
    stopCursorFx();
    document.documentElement.style.setProperty('--cur','auto');document.documentElement.style.setProperty('--cur-pt','pointer');
    return;
  }
  curEng.raf=requestAnimationFrame(curLoop);
}
function stopCursorFx(){
  curEng.fx=null;cancelAnimationFrame(curEng.raf);curEng.raf=0;
  if(curCtx)curCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
  $curfx.style.display='none';
}
function startCursorFx(id){
  stopCursorFx();
  var d=REW[id];if(!d||!FXCUR[d.fx])return;
  sizeCur();curEng.fx=FXCUR[d.fx]();curEng.last=performance.now();
  $curfx.style.display='block';curEng.raf=requestAnimationFrame(curLoop);
}
window.addEventListener('pointermove',function(e){
  if(e.pointerType==='touch')return;
  curEng.x=e.clientX;curEng.y=e.clientY;curEng.seen=true;
  var t=e.target;curEng.hov=!!(t&&t.closest&&t.closest('button,[data-act]'));
},{passive:true});
document.addEventListener('pointerout',function(e){if(!e.relatedTarget)curEng.seen=false;});
var resizeT=0;
window.addEventListener('resize',function(){
  clearTimeout(resizeT);
  resizeT=setTimeout(function(){
    if(curEng.fx)sizeCur();
    var b=REW[S.settings.bg];if(b&&b.fx)startBgFx(S.settings.bg);
  },250);
});

/* ---------- Vorschauen ---------- */
var pv={raf:0,items:[],last:0};
function pvStep(dt){
  pv.items.forEach(function(it){
    if(!it.cv.isConnected)return;
    it.t+=dt;
    if(it.kind==='bg'){it.draw(it.ctx,it.t,dt);return;}
    var c=it.ctx;
    c.fillStyle='#0b0e1c';c.fillRect(0,0,it.w,it.h);
    c.fillStyle='rgba(142,160,255,.13)';
    for(var gx=10;gx<it.w;gx+=20)for(var gy=10;gy<it.h;gy+=20)c.fillRect(gx,gy,1.5,1.5);
    var p;
    if(it.mt>0){it.mt-=dt;p={x:it.mx,y:it.my};}
    else p={x:it.w/2+Math.cos(it.t*1.3)*it.w*.32,y:it.h/2+Math.sin(it.t*2.1)*it.h*.26};
    it.fx.update(dt,p.x,p.y,false);it.fx.draw(c);
  });
}
function pvLoop(ts){
  var dt=Math.min(.05,(ts-pv.last)/1000||.016);pv.last=ts;
  pvStep(dt);
  pv.raf=requestAnimationFrame(pvLoop);
}
function stopPreviews(){cancelAnimationFrame(pv.raf);pv.raf=0;pv.items=[];}
function startPreviews(){
  stopPreviews();
  var list=$app.querySelectorAll('canvas.pvx');
  Array.prototype.forEach.call(list,function(cv){
    var kind=cv.getAttribute('data-kind'),fxn=cv.getAttribute('data-fx');
    var it={cv:cv,ctx:cv.getContext('2d'),w:cv.width,h:cv.height,kind:kind,t:0,mx:0,my:0,mt:0};
    if(kind==='bg'){if(!FXBG[fxn])return;it.draw=FXBG[fxn](it.w,it.h);}
    else{
      if(!FXCUR[fxn])return;
      it.fx=FXCUR[fxn]();
      cv.addEventListener('pointermove',function(e){
        var r=cv.getBoundingClientRect();
        it.mx=(e.clientX-r.left)*cv.width/r.width;it.my=(e.clientY-r.top)*cv.height/r.height;it.mt=1.2;
      });
    }
    pv.items.push(it);
  });
  if(!pv.items.length)return;
  if(reduced){for(var i=0;i<30;i++)pvStep(.05);return;}
  pv.last=performance.now();pv.raf=requestAnimationFrame(pvLoop);
}

/* ---------- Shop ---------- */
/* ---------- Auswahl (Hintergrund, Mauszeiger, Farbthema) ---------- */
function setEquipped(id){
  var r=REW[id];if(!r)return;
  if(r.type==='bg'){S.settings.bg=id;dbPut('settings','bg',id);}
  else if(r.type==='cursor'){S.settings.cursor=id;dbPut('settings','cursor',id);}
  else if(r.type==='theme'){S.settings.theme=id;dbPut('settings','theme',id);}
  applyLook();
}

/* ---------- Tagesbonus ---------- */
var DAILY=[10,15,20,25,30,40,100];
function pad2(n){return n<10?'0'+n:''+n;}
function dstr(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function todayStr(){return dstr(new Date());}
function yesterdayStr(){var d=new Date();d.setDate(d.getDate()-1);return dstr(d);}
function dailyInfo(){
  var d=S.settings.daily||{last:'',streak:0},t=todayStr(),y=yesterdayStr();
  var avail=d.last!==t,cur=(d.last===t||d.last===y)?(d.streak||0):0;
  var next=avail?(d.last===y?(d.streak||0)+1:1):(d.streak||0)+1;
  var cs=avail?(next-1)%7:((d.streak-1)%7)+1;
  return{avail:avail,cur:cur,next:next,reward:DAILY[(next-1)%7],cs:cs,streak:d.streak||0};
}
function dailyHtml(){
  var di=dailyInfo(),pips='';
  for(var i=0;i<7;i++){
    var cls=i<di.cs?' done':(i===di.cs&&di.avail?' today':'');
    pips+='<div class="dp'+cls+'"><span class="dd">'+(i<di.cs?'✓':(i+1))+'</span><span class="dv">'+COIN+DAILY[i]+'</span></div>';
  }
  var ttl=di.avail?X('Tag '+di.next+': +'+di.reward+' Münzen','Day '+di.next+': +'+di.reward+' coins'):X('Heute abgeholt','Collected today');
  var sub=di.avail?(di.cur>0?X('Deine Serie: '+di.cur+' Tage. Hol den Bonus, damit sie weiterläuft.','Your streak: '+di.cur+' days. Collect to keep it going.'):X('Komm jeden Tag vorbei, der siebte Tag bringt 100 Münzen.','Come back every day, day seven pays 100 coins.')):X('Serie: '+di.cur+' Tage. Morgen warten +'+DAILY[di.next-1>=0?(di.next-1)%7:0]+' Münzen.','Streak: '+di.cur+' days. Tomorrow: +'+DAILY[(di.next-1)%7]+' coins.');
  return '<section class="daily'+(di.avail?' ready':'')+'"><div class="dtxt"><p class="eyebrow">'+X('Tagesbonus','Daily bonus')+'</p><p class="dttl">'+ttl+'</p><p class="dsub">'+sub+'</p></div><div class="dpips">'+pips+'</div>'+(di.avail?'<button class="btn gold" data-act="daily">'+X('Abholen','Collect')+'</button>':'')+'</section>';
}
function claimDaily(){
  var di=dailyInfo();if(!di.avail)return;
  S.settings.daily={last:todayStr(),streak:di.next};dbPut('settings','daily',S.settings.daily);
  addCoins(di.reward);
  pushToast({t1:X('Tagesbonus','Daily bonus'),t2:X('Serie: ','Streak: ')+di.next+X(' Tage',' days'),t3:'+'+di.reward+X(' Münzen',' coins')});
  confetti();beep(659,.1,'triangle',.06);setTimeout(function(){beep(988,.16,'triangle',.06);},110);
  renderNav(true);
  if(view.name==='hub')renderHub(false);
  checkAch();
}

/* ---------- Erfolge ---------- */
function plays(){var n=0;Object.keys(S.stats).forEach(function(k){n+=(S.stats[k]&&S.stats[k].plays)||0;});return n;}
function hardStat(){var a=allMissions().filter(function(m){return m.hard;});return{done:a.filter(function(m){return S.missions[m.id];}).length,total:a.length};}
function shopItems(){return Object.keys(REW).filter(function(k){return REW[k].premium;});}
function eggs(){return S.settings.eggs||{};}
var ACH=[
  {id:'first',coins:10,name:{de:'Erster Schritt',en:'First Step'},desc:{de:'Schließe eine Mission ab.',en:'Complete a mission.'},test:function(){return doneTotal()>=1;}},
  {id:'ten',coins:30,name:{de:'Auf Kurs',en:'On Track'},desc:{de:'Schließe 10 Missionen ab.',en:'Complete 10 missions.'},test:function(){return doneTotal()>=10;}},
  {id:'half',coins:80,name:{de:'Halbzeit',en:'Halfway'},desc:{de:'Schließe die Hälfte aller Missionen ab.',en:'Complete half of all missions.'},test:function(){return doneTotal()>=Math.ceil(allMissions().length/2);}},
  {id:'all',coins:250,name:{de:'Perfektionist',en:'Completionist'},desc:{de:'Schließe alle Missionen ab.',en:'Complete every mission.'},test:function(){return doneTotal()>=allMissions().length;}},
  {id:'master3',coins:60,name:{de:'Meister-Anwärter',en:'Master Apprentice'},desc:{de:'Schaffe 3 Meistermissionen.',en:'Clear 3 master missions.'},test:function(){return hardStat().done>=3;}},
  {id:'masterall',coins:300,name:{de:'Großmeister',en:'Grandmaster'},desc:{de:'Schaffe alle Meistermissionen.',en:'Clear every master mission.'},test:function(){var h=hardStat();return h.done>=h.total;}},
  {id:'games',coins:100,name:{de:'Spielhalle',en:'Arcade Owner'},desc:{de:'Schalte alle Spiele frei.',en:'Unlock every game.'},test:function(){return ORDER.every(isOpen);}},
  {id:'buy',coins:20,name:{de:'Erster Einkauf',en:'First Purchase'},desc:{de:'Kaufe etwas im Shop.',en:'Buy something in the shop.'},test:function(){return shopItems().some(owned);}},
  {id:'collect',coins:40,name:{de:'Sammler',en:'Collector'},desc:{de:'Besitze 8 Hintergründe.',en:'Own 8 backgrounds.'},test:function(){return ofType('bg').filter(owned).length>=8;}},
  {id:'shopall',coins:300,name:{de:'Shop leergekauft',en:'Shop Cleared'},desc:{de:'Kaufe alles im Shop.',en:'Buy everything in the shop.'},test:function(){return shopItems().every(owned);}},
  {id:'rich',coins:50,name:{de:'Goldesel',en:'Gold Hoarder'},desc:{de:'Besitze 1000 Münzen gleichzeitig.',en:'Hold 1000 coins at once.'},test:function(){return coins()>=1000;}},
  {id:'plays50',coins:40,name:{de:'Stammgast',en:'Regular'},desc:{de:'Spiele 50 Runden.',en:'Play 50 rounds.'},test:function(){return plays()>=50;}},
  {id:'plays200',coins:120,name:{de:'Dauerspieler',en:'Marathoner'},desc:{de:'Spiele 200 Runden.',en:'Play 200 rounds.'},test:function(){return plays()>=200;}},
  {id:'streak3',coins:30,name:{de:'Dranbleiber',en:'Keeping Up'},desc:{de:'Hol den Tagesbonus 3 Tage in Folge ab.',en:'Collect the daily bonus 3 days in a row.'},test:function(){return dailyInfo().cur>=3;}},
  {id:'streak7',coins:100,name:{de:'Wochenserie',en:'Weekly Streak'},desc:{de:'Hol den Tagesbonus 7 Tage in Folge ab.',en:'Collect the daily bonus 7 days in a row.'},test:function(){return dailyInfo().cur>=7;}},
  {id:'polyglot',coins:10,name:{de:'Weltenbummler',en:'Globetrotter'},desc:{de:'Wechsle die Sprache.',en:'Switch the language.'},test:function(){return !!S.settings.langSwitched;}},
  {id:'konami',coins:20,secret:true,name:{de:'Retro-Held',en:'Retro Hero'},desc:{de:'Du kennst den Code der Codes.',en:'You know the code of codes.'},test:function(){return !!eggs().konami;}},
  {id:'logo',coins:15,secret:true,name:{de:'Neugierig',en:'Curious'},desc:{de:'Das Logo hat dir keine Ruhe gelassen.',en:'The logo could not leave you alone.'},test:function(){return !!eggs().logo;}},
  {id:'disco',coins:15,secret:true,name:{de:'Partytier',en:'Party Animal'},desc:{de:'Du hast die Tanzfläche gefunden.',en:'You found the dance floor.'},test:function(){return !!eggs().disco;}},
  {id:'night',coins:25,secret:true,name:{de:'Nachteule',en:'Night Owl'},desc:{de:'Spiele eine Runde zwischen Mitternacht und 5 Uhr.',en:'Play a round between midnight and 5 a.m.'},test:function(){return !!S.settings.night;}},
  {id:'agent',coins:100,secret:true,name:{de:'Geheimagent',en:'Secret Agent'},desc:{de:'Finde alle drei versteckten Überraschungen.',en:'Find all three hidden surprises.'},test:function(){var e=eggs();return !!(e.konami&&e.logo&&e.disco);}}
];
function checkAch(){
  if(!S.settings.ach||typeof S.settings.ach!=='object')S.settings.ach={};
  var A=S.settings.ach,got=[];
  ACH.forEach(function(a){
    if(A[a.id])return;
    var ok=false;try{ok=!!a.test();}catch(e){}
    if(ok){A[a.id]=Date.now();got.push(a);}
  });
  if(!got.length)return;
  dbPut('settings','ach',A);
  var sum=0;got.forEach(function(a){sum+=a.coins;});
  addCoins(sum);
  got.forEach(function(a,i){setTimeout(function(){
    pushToast({t1:X('Erfolg freigeschaltet','Achievement unlocked'),t2:L(a.name),t3:'+'+a.coins+X(' Münzen',' coins'),btn:{act:'profile',label:X('Ansehen','View')}});
  },i*400);});
  beep(880,.1,'triangle',.05);setTimeout(function(){beep(1175,.16,'triangle',.05);},100);
  renderNav(true);
  if(view.name==='profile')renderProfile(false);
  checkAch();
}

/* ---------- Spielstand sichern ---------- */
var saveMsg='',pendingImport=null;
function exportSave(){
  try{
    var data={app:'neuland-arcade',v:2,at:Date.now(),missions:S.missions,rewards:S.rewards,stats:S.stats,settings:S.settings};
    var blob=new Blob([JSON.stringify(data,null,1)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='neuland-arcade-spielstand.json';
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);if(a.parentNode)a.parentNode.removeChild(a);},800);
    saveMsg=X('Der Spielstand wurde als Datei heruntergeladen.','Your save was downloaded as a file.');
  }catch(e){saveMsg=X('Der Export ist hier nicht möglich.','Export is not possible here.');}
  renderProfile(false);
}
function sanitizeSave(d){
  var out={missions:{},rewards:{},stats:{},settings:{}},ids={},s=d.settings||{},i;
  allMissions().forEach(function(m){ids[m.id]=1;});
  Object.keys(d.missions||{}).forEach(function(k){if(ids[k]&&d.missions[k])out.missions[k]={at:Number(d.missions[k].at)||Date.now()};});
  Object.keys(d.rewards||{}).forEach(function(k){if(REW[k]&&d.rewards[k])out.rewards[k]={at:Number(d.rewards[k].at)||Date.now(),bought:!!d.rewards[k].bought};});
  Object.keys(d.stats||{}).forEach(function(k){var v=d.stats[k];if(GAMES[k]&&v)out.stats[k]={best:Math.max(0,Number(v.best)||0),plays:Math.max(0,Math.floor(Number(v.plays)||0))};});
  var o=out.settings;
  o.bg=(REW[s.bg]&&REW[s.bg].type==='bg')?s.bg:'bg-tiefe';
  o.cursor=(REW[s.cursor]&&REW[s.cursor].type==='cursor')?s.cursor:'cur-standard';
  o.theme=(REW[s.theme]&&REW[s.theme].type==='theme')?s.theme:'theme-standard';
  o.sound=s.sound!==false;
  o.lang=s.lang==='en'?'en':'de';
  o.coins=Math.max(0,Math.floor(Number(s.coins)||0));
  o.earned=Math.max(0,Math.floor(Number(s.earned)||0));
  o.egg=!!s.egg;o.langSwitched=!!s.langSwitched;o.night=!!s.night;
  o.eggs={};['konami','logo','disco'].forEach(function(k){if(s.eggs&&s.eggs[k])o.eggs[k]=true;});
  o.daily=null;
  if(s.daily&&/^\d{4}-\d{2}-\d{2}$/.test(String(s.daily.last)))o.daily={last:String(s.daily.last),streak:Math.max(0,Math.floor(Number(s.daily.streak)||0))};
  o.ach={};ACH.forEach(function(a){if(s.ach&&s.ach[a.id])o.ach[a.id]=Number(s.ach[a.id])||Date.now();});
  if(o.egg)out.rewards['cur-pixel']=out.rewards['cur-pixel']||{at:Date.now(),secret:true};
  /* Belohnungen abgeschlossener Missionen sicherstellen */
  allMissions().forEach(function(m){if(out.missions[m.id]&&m.reward&&!out.rewards[m.reward])out.rewards[m.reward]={at:out.missions[m.id].at};});
  return out;
}
function readImportFile(file){
  if(!file)return;
  var fr=new FileReader();
  fr.onload=function(){
    try{
      var d=JSON.parse(String(fr.result));
      if(!d||d.app!=='neuland-arcade'||typeof d.missions!=='object'||typeof d.settings!=='object')throw new Error('bad');
      pendingImport=sanitizeSave(d);saveMsg='';
    }catch(e){pendingImport=null;saveMsg=X('Diese Datei ist kein gültiger Spielstand.','This file is not a valid save.');}
    if(view.name==='profile')renderProfile(false);
  };
  fr.onerror=function(){saveMsg=X('Die Datei konnte nicht gelesen werden.','The file could not be read.');if(view.name==='profile')renderProfile(false);};
  fr.readAsText(file);
}
function applyImport(){
  var p=pendingImport;if(!p)return;
  pendingImport=null;
  S.missions=p.missions;S.rewards=p.rewards;S.stats=p.stats;
  var keep={bg:'bg-tiefe',cursor:'cur-standard',theme:'theme-standard',sound:true,lang:lang,coins:0,egg:false,eggs:{},daily:null,ach:{},earned:0,langSwitched:false,night:false};
  S.settings={};Object.keys(keep).forEach(function(k){S.settings[k]=p.settings[k]!==undefined?p.settings[k]:keep[k];});
  if(!owned(S.settings.bg))S.settings.bg='bg-tiefe';
  if(!owned(S.settings.cursor))S.settings.cursor='cur-standard';
  if(!owned(S.settings.theme))S.settings.theme='theme-standard';
  lang=S.settings.lang;document.documentElement.lang=lang;
  dbClearAll().then(function(){
    var ps=[];
    Object.keys(S.missions).forEach(function(k){ps.push(dbPut('missions',k,S.missions[k]));});
    Object.keys(S.rewards).forEach(function(k){ps.push(dbPut('rewards',k,S.rewards[k]));});
    Object.keys(S.stats).forEach(function(k){ps.push(dbPut('stats',k,S.stats[k]));});
    Object.keys(S.settings).forEach(function(k){ps.push(dbPut('settings',k,S.settings[k]));});
    return Promise.all(ps);
  });
  saveMsg=X('Der Spielstand wurde geladen.','The save was loaded.');
  applyLook();renderNav();renderProfile(false);
}

/* ---------- Profil ---------- */
function renderProfile(anim){
  stopPreviews();
  view={name:'profile'};
  $app.style.removeProperty('--h');
  $app.className='app view view-profile'+(anim?' enter':'');
  var total=allMissions().length,done=doneTotal(),hs=hardStat(),rk=rankFor(done),di=dailyInfo(),earned=Number(S.settings.earned)||0;
  var tiles=[[done+'/'+total,X('Missionen','Missions')],[hs.done+'/'+hs.total,X('Meistermissionen','Master missions')],[ORDER.filter(isOpen).length+'/'+ORDER.length,X('Spiele freigeschaltet','Games unlocked')],[plays(),X('Runden gespielt','Rounds played')],[earned,X('Münzen verdient','Coins earned')],[di.cur,X('Tage in Folge','Day streak')]];
  var tilesHtml=tiles.map(function(t,i){return '<div class="stile" style="--i:'+i+'"><b class="mono">'+t[0]+'</b><span>'+t[1]+'</span></div>';}).join('');
  var bestHtml=ORDER.filter(isOpen).map(function(g,i){
    var b=S.stats[g]&&S.stats[g].best?S.stats[g].best:0,n=S.stats[g]&&S.stats[g].plays?S.stats[g].plays:0;
    return '<div class="brow" style="--h:'+GAMES[g].hue+'"><span class="bn">'+L(GAMES[g].name)+'</span><span class="bv mono">'+b+' '+L(GAMES[g].unit)+'</span><span class="bp mono">'+n+'×</span></div>';
  }).join('');
  var A=S.settings.ach||{},got=ACH.filter(function(a){return A[a.id];}).length;
  var achHtml=ACH.map(function(a,i){
    var d=!!A[a.id],hide=a.secret&&!d;
    return '<div class="ach'+(d?' got':'')+'" style="--i:'+i+'"><span class="aic">'+(d?'★':(hide?'?':'☆'))+'</span><div><p class="an">'+(hide?X('Geheimer Erfolg','Secret achievement'):L(a.name))+'</p><p class="ad">'+(hide?X('Nicht entdeckt.','Not discovered yet.'):L(a.desc))+'</p></div><span class="ac price">'+COIN+a.coins+'</span></div>';
  }).join('');
  var saveBar;
  if(pendingImport){
    saveBar='<div class="saveconf"><span class="warn">'+X('Den aktuellen Spielstand mit dieser Datei überschreiben?','Replace your current progress with this file?')+'</span><span class="acts"><button class="btn gold sm" data-act="import-yes">'+X('Ja, laden','Yes, load')+'</button><button class="btn ghost sm" data-act="import-no">'+X('Abbrechen','Cancel')+'</button></span></div>';
  }else{
    saveBar='<div class="acts"><button class="btn ghost sm" data-act="export">'+X('Spielstand exportieren','Export save')+'</button><button class="btn ghost sm" data-act="import-pick">'+X('Spielstand importieren','Import save')+'</button><input type="file" id="impfile" accept="application/json,.json" hidden></div>';
  }
  $app.innerHTML=
   '<section class="shophead"><div><p class="eyebrow">'+X('Dein Fortschritt','Your progress')+'</p><h1 class="sh1">'+X('Profil','Profile')+'</h1><p class="sub">'+X('Rang: ','Rank: ')+'<b>'+L(rk.rank.name)+'</b>'+(rk.next?X(' · noch '+(rk.next.min-done)+' Missionen bis ',' · '+(rk.next.min-done)+' missions to ')+L(rk.next.name):'')+'</p></div><div class="balbig">'+COIN+'<span>'+coins()+'</span></div></section>'+
   '<div class="stats-grid">'+tilesHtml+'</div>'+
   '<div class="sec-head"><h2 class="sec">'+X('Bestwerte','Personal bests')+'</h2></div><div class="bestlist">'+bestHtml+'</div>'+
   '<div class="sec-head"><h2 class="sec">'+X('Erfolge','Achievements')+' · '+got+'/'+ACH.length+'</h2></div><div class="ach-grid">'+achHtml+'</div>'+
   '<div class="sec-head"><h2 class="sec">'+X('Spielstand sichern','Back up your progress')+'</h2></div><div class="foot savebox"><span>'+(saveMsg||X('Deine Daten liegen nur in diesem Browser. Mit einer Sicherungsdatei kannst du sie auf ein anderes Gerät mitnehmen.','Your data lives only in this browser. A backup file lets you take it to another device.'))+'</span>'+saveBar+'</div>';
}

function themeSwatch(r){return '<div class="thprev'+(r.anim?' anim':'')+'" style="--a:'+r.accent+'"><span class="b1"></span><span class="b2"></span><span class="b3"></span></div>';}
function shopCard(id,i){
  var r=REW[id],own=owned(id),key=r.type==='bg'?'bg':(r.type==='cursor'?'cursor':'theme'),active=S.settings[key]===id,bal=coins(),act,prev;
  if(own)act=active?'<button class="btn" disabled>'+X('Aktiv','Active')+'</button>':'<button class="btn" data-act="equip" data-id="'+id+'">'+X('Ausrüsten','Equip')+'</button>';
  else if(bal>=r.price)act='<button class="btn gold" data-act="buy" data-id="'+id+'">'+X('Kaufen','Buy')+'</button>';
  else act='<button class="btn ghost" disabled>'+X('Noch ','Need ')+(r.price-bal)+X(' Münzen',' more coins')+'</button>';
  if(r.type==='theme')prev=themeSwatch(r);
  else prev='<canvas class="pvx" data-kind="'+(r.type==='bg'?'bg':'cur')+'" data-fx="'+r.fx+'" width="320" height="180" aria-hidden="true"></canvas>';
  return '<div class="pcard" style="--i:'+i+'"><div class="in">'+prev+'<div class="pb"><div class="prow"><h3>'+L(r.name)+'</h3>'+(own?'<span class="ownd">'+X('Im Besitz','Owned')+'</span>':'<span class="price">'+COIN+r.price+'</span>')+'</div>'+act+'</div></div></div>';
}
function renderShop(anim){
  stopPreviews();
  view={name:'shop'};
  $app.style.removeProperty('--h');
  $app.className='app view view-shop'+(anim?' enter':'');
  var bgs=ofType('bg').filter(function(k){return REW[k].premium;}),curs=ofType('cursor').filter(function(k){return REW[k].premium;}),ths=ofType('theme').filter(function(k){return REW[k].premium;});
  var rows=allMissions().filter(function(m){return m.coins;}).map(function(m){
    var d=!!S.missions[m.id];
    return '<div class="mrow'+(d?' done':'')+'"><span>'+L(GAMES[m.gid].name)+': '+L(m.text)+(m.hard?'<span class="tag">'+X('Meister','Master')+'</span>':'')+'</span><span class="price">'+(d?'✓ ':'')+COIN+m.coins+'</span></div>';
  }).join('');
  $app.innerHTML=
   '<section class="shophead"><div><p class="eyebrow">'+X('Besondere Fundstücke','Special finds')+'</p><h1 class="sh1">Shop</h1><p class="sub">'+X('Kaufe animierte Hintergründe, Mauszeiger und Farbthemen. Münzen gibt es für Missionen, Erfolge und den Tagesbonus.','Buy animated backgrounds, cursors and color themes. Coins come from missions, achievements and the daily bonus.')+'</p></div><div class="balbig" aria-label="'+X('Münzen','Coins')+'">'+COIN+'<span id="bal">'+coins()+'</span></div></section>'+
   '<div class="sec-head"><h2 class="sec">'+X('Hintergründe','Backgrounds')+'</h2></div><div class="pgrid">'+bgs.map(shopCard).join('')+'</div>'+
   '<div class="sec-head"><h2 class="sec">'+X('Mauszeiger','Cursors')+'</h2><span class="hintsm">'+X('Bewege die Maus über eine Vorschau.','Move your mouse over a preview.')+'</span></div><div class="pgrid">'+curs.map(shopCard).join('')+'</div>'+
   '<div class="sec-head"><h2 class="sec">'+X('Farbthemen','Color themes')+'</h2><span class="hintsm">'+X('Färben Knöpfe, Auswahl und Akzente der ganzen Seite.','Tint buttons, highlights and accents across the site.')+'</span></div><div class="pgrid">'+ths.map(shopCard).join('')+'</div>'+
   '<div class="sec-head"><h2 class="sec">'+X('So kommst du an Münzen','How to earn coins')+'</h2></div><div class="missrows">'+rows+'</div>';
  startPreviews();
}

/* ---------- Easter Eggs ---------- */
var KON=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],kp=0,typed='',logoClicks=0,logoT=0;
function markEgg(k){
  if(!S.settings.eggs||typeof S.settings.eggs!=='object')S.settings.eggs={};
  if(S.settings.eggs[k])return false;
  S.settings.eggs[k]=true;dbPut('settings','eggs',S.settings.eggs);return true;
}
function party(){
  var root=document.documentElement;
  root.classList.add('rainbow');
  setTimeout(function(){root.classList.remove('rainbow');},9000);
  confetti();setTimeout(confetti,250);setTimeout(confetti,500);
  [523,659,784,1046,1318].forEach(function(f,i){setTimeout(function(){beep(f,.2,'square',.04);},i*90);});
}
function refreshView(){
  renderNav(true);
  if(view.name==='hub')renderHub(false);else if(view.name==='shop')renderShop(false);else if(view.name==='profile')renderProfile(false);
}
function easter(){
  party();
  var first=!S.settings.egg;
  if(first){
    S.settings.egg=true;dbPut('settings','egg',true);
    S.rewards['cur-pixel']={at:Date.now(),secret:true};dbPut('rewards','cur-pixel',S.rewards['cur-pixel']);
    addCoins(64);
  }
  markEgg('konami');
  pushToast({
    t1:X('Geheimcode entdeckt','Secret code found'),
    t2:'↑ ↑ ↓ ↓ ← → ← → B A',
    t3:first?'+64 '+X('Münzen und neuer Mauszeiger „Pixelpfeil“','coins and a new cursor “Pixel Arrow”'):X('Du kennst den Klassiker.','You know the classic.'),
    btn:first?{act:'equip',id:'cur-pixel',label:X('Ausrüsten','Equip')}:null
  });
  refreshView();checkAch();
}
function discoEgg(){
  party();
  var first=markEgg('disco');
  pushToast({t1:'Disco!',t2:X('Du hast „disco“ getippt.','You typed “disco”.'),t3:first?X('Geheimnis gefunden. Schau in dein Profil.','Secret found. Check your profile.'):X('Nochmal tanzen?','Dance again?')});
  checkAch();
}
function logoEgg(){
  party();
  var m=document.querySelector('.logo .mark');
  if(m){m.classList.add('fast');setTimeout(function(){m.classList.remove('fast');},3500);}
  var first=markEgg('logo');
  if(first)addCoins(10);
  pushToast({t1:X('Hey, das kitzelt!','Hey, that tickles!'),t2:X('Sieben Klicks auf das Logo.','Seven clicks on the logo.'),t3:first?'+10 '+X('Münzen','coins'):X('Schon wieder du.','You again.')});
  refreshView();checkAch();
}
function logoClick(){
  var n=Date.now();
  if(n-logoT>1500)logoClicks=0;
  logoT=n;logoClicks++;
  if(logoClicks>=7){logoClicks=0;logoEgg();}
}
window.addEventListener('keydown',function(e){
  var k=e.key&&e.key.length===1?e.key.toLowerCase():e.key;
  if(k===KON[kp]){kp++;if(kp===KON.length){kp=0;easter();}}
  else kp=(k===KON[0])?1:0;
  if(e.key&&e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
    typed=(typed+e.key.toLowerCase()).slice(-5);
    if(typed==='disco'){typed='';discoEgg();}
  }
});

/* ---------- Klicks ---------- */
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-act]');if(!el)return;
  var act=el.getAttribute('data-act'),id=el.getAttribute('data-id');
  if(act==='play'||act==='open-game'){
    if(stopGame){stopGame();stopGame=null;}
    var t=el.closest('.toast');if(t)t.remove();
    renderGame(id);window.scrollTo(0,0);
  }else if(act==='back'){leaveGame();}
  else if(act==='home'){
    logoClick();
    if(view.name==='game')leaveGame();
    else if(view.name!=='hub'){renderHub(true);window.scrollTo(0,0);}
    else window.scrollTo(0,0);
  }
  else if(act==='profile'){
    if(stopGame){stopGame();stopGame=null;}
    var tp=el.closest('.toast');if(tp)tp.remove();
    renderProfile(true);window.scrollTo(0,0);
  }
  else if(act==='daily'){claimDaily();}
  else if(act==='export'){exportSave();}
  else if(act==='import-pick'){var inp=$('impfile');if(inp)inp.click();}
  else if(act==='import-yes'){applyImport();}
  else if(act==='import-no'){pendingImport=null;saveMsg='';renderProfile(false);}
  else if(act==='shop'){
    if(stopGame){stopGame();stopGame=null;}
    var ts=el.closest('.toast');if(ts)ts.remove();
    renderShop(true);window.scrollTo(0,0);
  }
  else if(act==='equip'){
    setEquipped(id);
    var tt=el.closest('.toast');if(tt)tt.remove();
    if(view.name==='hub')renderHub(false);else if(view.name==='shop')renderShop(false);else if(view.name==='profile')renderProfile(false);
  }else if(act==='close-toast'){el.closest('.toast').remove();}
  else if(act==='tab'){collTab=id;renderHub(false);}
  else if(act==='lang'){
    lang=id;S.settings.lang=id;dbPut('settings','lang',id);
    document.documentElement.lang=id;
    renderNav();
    if(!S.settings.langSwitched){S.settings.langSwitched=true;dbPut('settings','langSwitched',true);}
    if(view.name==='hub')renderHub(false);else if(view.name==='shop')renderShop(false);else if(view.name==='profile')renderProfile(false);else fillGame();
    checkAch();
  }
  else if(act==='sound'){
    S.settings.sound=!S.settings.sound;dbPut('settings','sound',S.settings.sound);
    renderNav();
  }
  else if(act==='buy'){
    var r2=REW[id];
    if(el.getAttribute('data-confirm')!=='1'){
      el.setAttribute('data-confirm','1');el.textContent=X('Wirklich kaufen?','Really buy?');
      setTimeout(function(){if(el.isConnected&&el.getAttribute('data-confirm')==='1'){el.removeAttribute('data-confirm');el.textContent=X('Kaufen','Buy');}},3500);
    }else if(r2&&r2.price&&coins()>=r2.price&&!owned(id)){
      S.settings.coins=coins()-r2.price;dbPut('settings','coins',S.settings.coins);
      S.rewards[id]={at:Date.now(),bought:true};dbPut('rewards',id,S.rewards[id]);
      setEquipped(id);confetti();beep(659,.1,'triangle',.06);setTimeout(function(){beep(988,.16,'triangle',.06);},110);
      renderNav(true);renderShop(false);checkAch();
    }
  }
  else if(act==='reset-ask'){resetAsk=true;renderHub(false);}
  else if(act==='reset-no'){resetAsk=false;renderHub(false);}
  else if(act==='reset-yes'){
    resetAsk=false;
    S.missions={};S.rewards={};S.stats={};S.settings.bg='bg-tiefe';S.settings.cursor='cur-standard';S.settings.theme='theme-standard';S.settings.coins=0;S.settings.egg=false;
    S.settings.eggs={};S.settings.daily=null;S.settings.ach={};S.settings.earned=0;S.settings.langSwitched=false;S.settings.night=false;
    dbClearAll().then(function(){dbPut('settings','sound',S.settings.sound);dbPut('settings','lang',lang);dbPut('settings','coins',0);});
    applyLook();renderNav();renderHub(false);
  }
});

document.addEventListener('change',function(e){
  var t=e.target;
  if(t&&t.id==='impfile'&&t.files&&t.files[0])readImportFile(t.files[0]);
});

/* ---------- Start ---------- */
function boot(){
  var ready;
  try{
    dbp=openDB();
    ready=Promise.all(STORES.map(dbGetAll)).then(function(r){
      S.missions=r[0];S.rewards=r[1];S.stats=r[2];
      Object.keys(r[3]).forEach(function(k){S.settings[k]=r[3][k];});
    });
  }catch(e){ready=Promise.reject(e);}
  ready.catch(function(){
    persistent=false;dbp=Promise.reject(new Error('offline'));dbp.catch(function(){});
  }).then(function(){
    if(S.settings.lang!=='de'&&S.settings.lang!=='en'){
      var nl=(navigator.language||'de').toLowerCase();
      S.settings.lang=nl.indexOf('de')===0?'de':'en';
    }
    lang=S.settings.lang;document.documentElement.lang=lang;
    /* Belohnungen abgeschlossener Missionen nachtragen, falls sich Zuordnungen geändert haben */
    allMissions().forEach(function(m){
      if(S.missions[m.id]&&m.reward&&!S.rewards[m.reward]){S.rewards[m.reward]={at:S.missions[m.id].at||Date.now()};dbPut('rewards',m.reward,S.rewards[m.reward]);}
    });
    S.settings.coins=coins();
    if(!S.settings.eggs||typeof S.settings.eggs!=='object')S.settings.eggs={};
    if(S.settings.egg&&!S.settings.eggs.konami)S.settings.eggs.konami=true;
    if(!S.settings.ach||typeof S.settings.ach!=='object')S.settings.ach={};
    if(S.settings.earned==null){
      var spent=0;Object.keys(S.rewards).forEach(function(k){if(REW[k]&&REW[k].price&&S.rewards[k]&&S.rewards[k].bought)spent+=REW[k].price;});
      S.settings.earned=S.settings.coins+spent;dbPut('settings','earned',S.settings.earned);
    }
    var thm=REW[S.settings.theme];
    if(!thm||thm.type!=='theme'||!owned(S.settings.theme))S.settings.theme='theme-standard';
    var b=REW[S.settings.bg],c=REW[S.settings.cursor];
    if(!b||b.type!=='bg'||!owned(S.settings.bg))S.settings.bg='bg-tiefe';
    if(!c||c.type!=='cursor'||!owned(S.settings.cursor))S.settings.cursor='cur-standard';
    applyLook();renderNav();renderHub(true);
    setTimeout(checkAch,1200);
  });
}
try{boot();}catch(err){showFatal(err);}
function showFatal(err){
  $app.innerHTML='<p class="loading">Fehler / Error: '+String(err&&err.message||err)+'</p>';
}
window.addEventListener('error',function(e){
  if(document.querySelector('.hero')||document.querySelector('.stage'))return;
  showFatal(e.message);
});
})();
