const selfQuestions = [
  '¿He descansado lo suficiente y me encuentro en condiciones apropiadas para conducir?',
  '¿Me siento en buenas condiciones físicas y no tengo dolencia o enfermedad que me impida conducir?',
  '¿No he tomado medicamentos que sean impedimento para conducir?',
  '¿Me encuentro emocionalmente en buenas condiciones para concentrarme durante la conducción?',
  '¿Soy consciente de la responsabilidad de conducir sin poner en riesgo mi integridad ni la de mis compañeros?'
];

const groups = [
  {name:'Sistema eléctrico',items:['Estado de batería','Tablero de indicadores','Luces bajas','Luces altas','Luces de freno','Luces de retroceso','Luces direccionales','Faros neblineros','Faros piratas','Luz de placa','Luz de salón','Cableado general','Luces de carrocería']},
  {name:'Frenos',items:['Estado de frenos de servicio','Nivel de líquido de freno','Freno de parqueo','Ruidos anormales','Estado de cañerías','Fugas de líquido y/o aire']},
  {name:'Transmisión / dirección',items:['Nivel de hidrolina','Ruidos en el tren delantero','Terminales de dirección','Alineamiento','Caja de cambios','Fugas de aceite','Crucetas y eje cardán','Fugas en la corona','Ruidos anormales']},
  {name:'Carrocería y chasis',items:['Estado de carrocería','Fijación carrocería / chasis','Fijación de cabina / chasis','Parachoques delantero','Parachoques posterior','Estribos laterales','Barras antiempotramiento','Tubo de escape','Estado de pintura general']},
  {name:'Rodados derecho / izquierdo',items:['Estado de neumáticos','Presión de aire de neumáticos','Profundidad de cocadas > 5 mm','Estado de tuercas','Traba tuercas','Llanta de repuesto','Soporte de llanta de repuesto','Llave de rueda y palancas']},
  {name:'Otros',items:['Logo de la empresa','Soga para sujetar carga','Kit de desinfección y limpieza']},
  {name:'Estado de motor',items:['Nivel de aceite','Nivel de refrigerante','Fajas y correas','Filtro de aceite','Filtro de combustible','Filtro de aire','Fugas por mangueras','Fugas de líquidos','Sonidos extraños']},
  {name:'Suspensión',items:['Estado de muelles','Estado de amortiguadores','Bloque de válvulas','Acumulador de presión']},
  {name:'Accesorios / varios',items:['Claxon / bocina','Alarma de retroceso audible a 20 m','Alarma antirrobo','Puertas y chapas','Espejos laterales y de punto ciego','Espejo interior','Parabrisas frontal y posterior','Vidrios y alzavidrios laterales','Manubrios y pestillos de puertas','Asientos / forros','Aire acondicionado','Autorradio / parlantes','Radio de comunicación','Cinturones de seguridad','Tapasoles','Estado de limpia parabrisas']},
  {name:'Implementos de seguridad',items:['Botiquín de primeros auxilios','Eslinga de remolque con grilletes','Cable para transferencia de corriente','Extintor de 9 kilos','Gata con accesorios (2 unidades)','Juego de llaves mixtas (N.° 9 al N.° 24)','Desarmadores plano y estrella','Alicate y llave francesa','Juego de tacos (mínimo 2)','Linterna de mano','Medidor de presión de aire','Baliza o circulina color azul','Pico / pala','Conos de seguridad (2 unidades de 90 cm)','Cintas reflectivas','Kit contra derrames']},
  {name:'Otros implementos',items:['Toldo para proteger la carga','Malla para proteger la carga','Señalizaciones de carrocería (MATPEL)']}
];
const statuses=['SI','NO','B','M','N/A'];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

document.querySelector('#selfCheck').innerHTML=selfQuestions.map((q,i)=>`<div class="self-row"><span class="self-question">${i+1}. ${esc(q)}</span>${['Sí','No'].map((v,j)=>`<label class="self-choice">${v}<input type="radio" name="self${i}" value="${j?'No':'Sí'}" required></label>`).join('')}</div>`).join('');
document.querySelector('#inspectionGrid').innerHTML=groups.map((g,gi)=>`<section class="category"><div class="category-title">${esc(g.name)}</div><div class="inspection-head"><span>Descripción</span><span>Resultado</span><span>Observaciones</span></div>${g.items.map((item,ii)=>{const id=`g${gi}i${ii}`;return `<div class="inspection-row"><span>${esc(item)}</span><div class="status">${statuses.map((v,si)=>`<label>${v}<input type="radio" name="${id}" value="${v}" aria-label="${esc(item)}: ${v}" required></label>`).join('')}</div><label class="observation"><input aria-label="Observación: ${esc(item)}" name="obs_${id}" maxlength="120"></label></div>`}).join('')}</section>`).join('');

const dateInput=document.querySelector('#fecha');
const setToday=()=>{const n=new Date();dateInput.value=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`};
setToday();

const canvas=document.querySelector('#signature'),ctx=canvas.getContext('2d');let drawing=false,hasInk=false;
function fitCanvas(){const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;if(!r.width)return;const old=hasInk?canvas.toDataURL():null;canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#102b46';if(old){const im=new Image();im.onload=()=>ctx.drawImage(im,0,0,r.width,r.height);im.src=old}}
function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture(e.pointerId);drawing=true;const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y)});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();hasInk=true});
canvas.addEventListener('pointerup',()=>{drawing=false});canvas.addEventListener('pointercancel',()=>{drawing=false});
document.querySelector('#clearSignature').addEventListener('click',()=>{ctx.clearRect(0,0,canvas.width,canvas.height);hasInk=false});
window.addEventListener('resize',fitCanvas);requestAnimationFrame(fitCanvas);

document.querySelector('[name="conductor"]').addEventListener('input',e=>document.querySelector('#driverName').textContent=e.target.value.trim()||'Nombre del conductor');
function makePdf(){const form=document.querySelector('#checklistForm');if(!form.reportValidity())return;if(!hasInk){alert('El conductor debe firmar antes de generar el PDF.');canvas.scrollIntoView({behavior:'smooth',block:'center'});return}document.activeElement?.blur();window.print()}
document.querySelector('#printButton').addEventListener('click',makePdf);document.querySelector('#printButtonBottom').addEventListener('click',makePdf);

// Filtro básico: el código conserva huellas de los DNI, no los números originales.
const ACCESS_ENTRIES = [
  {hash:"dc960a563eb9858d6892be16bcf8884891dee7fde213f56959c3a417459a17da",name:"AYALA POMA ALEX GUSTAVO"},
  {hash:"468cf547d8aada443f2e22b04a496b7f3807e83205cc46918aba3f236b155d18",name:"BAUTISTA RISCO CARLOS EDUARDO"},
  {hash:"0cad9389b5578cec7336b2c88546da0327841b0a6f8d3b9b62929081d93483f4",name:"CAVIEDES MELENDEZ ELSA CRISTINA"},
  {hash:"6bd6656feba0c70891af6d07ee515376676aaeae396be2f0d364b395f7eeff48",name:"GUTIERREZ GOMEZ CESAR AUGUSTO"},
  {hash:"2f60af131f11f698b74062b39d7a316166db712a8d3ef2b96b1f514ba3ee3769",name:"PANDURO GUERRA YORDAN FREDY"},
  {hash:"b2020cff75d8d67b2df470960379930d29c2556adeb711b21fb78245d6749fbe",name:"PAUCAR MACHACUAY LUCIO"},
  {hash:"ca29aa27ca496ce0c2a6f46bfc36e51b20c2e310597b2f210ab404b146867ede",name:"PUMA MAMANI EYNER WILLY"},
  {hash:"7156e8124377428cec960885e8aebcecdbbdee35c69a5c9d3d0a6e89380bdb2e",name:"QUINTANA ASCENCIO VICTOR CALIXTO"},
  {hash:"efa6e61367cc5071f2ef98c76a4025626180d2ca57dde628c38ac2abd54155c1",name:"RICALDI CARHUAS DENVER DANTE RICHARD"},
  {hash:"2b35de76cef49a50e034af3ac462d316a7d28788348b65143640575400a8b218",name:"ROJAS RAMOS WILLIAN EDUARDO"},
  {hash:"9d909d11b95a2749fcbbb67504abd962f49dceed852b05371648e7acf2de465d",name:"FLORES CHAVEZ JHADIRA AMERICA"},
  {hash:"eb340d638e6fa7564f0b63589193adc455aece359deef71d00585a713279d99e",name:"ROJAS REYES HITLER"},
  {hash:"b07fc5321e165f571bf9a1e6e7db2f95fbf7ffbfecd127292a0711198302baaf",name:"SANABRIA PABLO JOSE ANTONIO"},
  {hash:"30cfab2ef98528f74c7169522fc3a90f335e779a14384488b50f430c90357c15",name:"SOCUALAYA YAURI JUAN JOSE"},
  {hash:"24a468a6dbc216b6187ef2c418f9ec29e1a47c0f873c41969aaad713398fe60a",name:"TELLO ESTELA PABLO"},
  {hash:"8ce8a8d340de055e56f5d1bd5accd30e97fbed4d769ad1093a80ed7d3ffcdc3d",name:"ESPINOZA AYALA MAIK GEORGE"},
  {hash:"b34125b5b61e0a62a41babc78e9c09ce131634e9ec9da2243f3a77758819de70",name:"RODRIGUEZ ALVAREZ GREGORIO DOMINGO"},
  {hash:"40705f81e160020d09cc7bd316dd39200cb70f6299ba1ea42802ad16ad0080e7",name:"RODRIGUEZ ALVAREZ RONALD NILTON"},
  {hash:"9f178e0f0c1ecdadae1e7dc0b1baa5190b85c59b7eb005e7126e693bb8bbd2f2",name:"SAMANIEGO ALVAREZ LINDER"},
  {hash:"cf3e81d44d5e72e3268b254b823c9cafe5a52e10f6a862bb7f33df8963ce79d2",name:"BARRIENTOS BARCENA REYLI JOAQUIN"},
  {hash:"37a6ba05dbb82c2efda4e4217033d7214820ba5ae8217f939baeda86860e53ad",name:"HUAMANI TENORIO JOEL ANTHONY"},
  {hash:"b7552b0d51f587f46cb4b1397921380dfcd46d3b21b1ebc9626262183dcbf5ed",name:"RODRIGUEZ VIDAL EDWIN ALEX"},
  {hash:"5c3634debf4bc71ac972fb1c992c758c8bd500eba4e5d99443bd501ae4c4c88f",name:"CONDORI CASTILLON ROGER"},
  {hash:"fc401f7c0dababec1f707afd8f65916e7c0821ff7cea3e2811a87ba3e1fcf90c",name:"RAMIREZ TORRES LUIS"},
  {hash:"db0eec10e75aabb9d0402de776b3379434b30885a6fbbd303ce94518186dea76",name:"ESPINOZA AYALA JHOSEP CARLOS"},
  {hash:"287ac9ee99316068af66c145e6e9573746691097009014be3c92372ebb19079a",name:"PINAUD SALAZAR LUIS FANOR"},
  {hash:"833cda2563ad34498fb693511ce2c8fd6fe7b1c3c74fc986b8f4d49dab70a3ea",name:"FIERRO RIVAS MUISES DAVID"},
  {hash:"5bd65a4c6beed31885779e7da316587f6404e9d7cf8af5ab8a3ddaabf19d3e16",name:"MEDINA HUARHUACHI ALFREDO"},
  {hash:"9dbfdad8d9944c4d5299752ee47919a3cce15b127ed7193eb8b4e13e52b390a5",name:"IPARRAGUIRRE PUITIZA LUIS PERCY"},
  {hash:"8e21b650403a567adc129d8cf95bb84a1bd5842b0a75e83ce3c1ff463c982419",name:"PIZAN LUNA WILSON"},
  {hash:"0a6f75ee531cb53926ccd003649dcc93243fa574ddab9da8c14c3b22fb038dd7",name:"PAREDES PEÑA ROGER ANIBAL"},
  {hash:"29beac2fef377b3705099773001a4b8fb9e2391fc41d1ebc54eafd14ecdd4139",name:"PAREDES PEÑA CARLOS ENRIQUE"},
  {hash:"78a096ebba9e9869b2846172928ef15f49abdd06fde0b0fa931a04a097d99d15",name:"PAREDES PEÑA DILVER EMANUEL"},
  {hash:"c724765e203b6332274742e65e31ad025fb540fe17d7fedf59c40777a0429593",name:"ROJAS VALLADARES KIMBERLY MARICIELO"}
];
const accessForm = document.querySelector('#accessForm');
const accessMessage = document.querySelector('#accessMessage');
const dniAccess = document.querySelector('#dniAccess');
accessForm.addEventListener('submit', async event => {
  event.preventDefault();
  const dni = dniAccess.value.trim();
  if (!/^\d{8}$/.test(dni)) { accessMessage.textContent = 'Ingresa un DNI de 8 dígitos.'; return; }
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`gp-checklist-v1:${dni}`));
    const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    const driver = ACCESS_ENTRIES.find(entry => entry.hash === hash);
    if (driver) {
      const conductor = document.querySelector('[name="conductor"]');
      conductor.value = driver.name;
      conductor.readOnly = true;
      document.querySelector('#driverName').textContent = driver.name;
      document.body.classList.remove('locked');
      document.querySelector('#fecha')?.focus();
    } else { accessMessage.textContent = 'DNI no autorizado. Verifica el número e intenta nuevamente.'; dniAccess.select(); }
  } catch { accessMessage.textContent = 'No se pudo validar el DNI. Abre la página desde su enlace web y vuelve a intentar.'; }
});
