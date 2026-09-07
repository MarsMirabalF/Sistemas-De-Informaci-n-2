const tablitaBody = document.getElementById('tablita');
const botonsitoAgregar = document.getElementById('botonsito-agregar');
const estatusEl = document.getElementById('estatus');

async function mostrarPlatos() {
  const res = await fetch('/platos');
  const datos = await res.json();

  if (datos.error) {
    estatusEl.textContent = datos.mensaje;
    return;
  }

  tablitaBody.innerHTML = '';
  datos.forEach(p => {
    const auxiliar = document.createElement('tr');
    auxiliar.innerHTML = `<td>${p.nombre}</td><td>${p.puntaje}</td>`;
    tablitaBody.appendChild(auxiliar);
  });
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const numerosTexto = {
  'cero':0,'uno':1,'dos':2,'tres':3,'cuatro':4,'cinco':5,'seis':6,'siete':7,
  'ocho':8,'nueve':9,'diez':10,'once':11,'doce':12,'trece':13,'catorce':14,
  'quince':15,'dieciseis':16,'diecisiete':17,'dieciocho':18,'diecinueve':19,'veinte':20
};

function escuchar(textoHablado) {
  return new Promise((resolve, reject) => {
    estatusEl.textContent = textoHablado;
    const agarrarVoz = new SpeechRecognition();
    agarrarVoz.lang = 'es-ES';
    agarrarVoz.maxAlternatives = 1;
    let seResolvio = false;

    agarrarVoz.onresult = (e) => {
      seResolvio = true;
      resolve(e.results[0][0].transcript.trim());
    };
    agarrarVoz.onerror = (e) => {
      seResolvio = true;
      reject(e.error);
    };
    agarrarVoz.onend = () => {
      if (!seResolvio) {
        reject('no-result');
      }
    };
    agarrarVoz.start();
  });
}

function extraerNumero(texto) {
  const limpio = texto.toLowerCase().trim();
  const soloDigitos = limpio.match(/-?\d+/);
  if (soloDigitos){
    return parseInt(soloDigitos[0], 10);
  }
  if (limpio in numerosTexto){
    return numerosTexto[limpio];
  }
  return NaN;
}

botonsitoAgregar.addEventListener('click', async () => {
  botonsitoAgregar.disabled = true;
  try {
    const nombre = await escuchar('Diga el nombre del plato...');
    estatusEl.textContent = `Nombre captado: "${nombre}". ahora diga el puntaje...`;

    const puntajeTexto = await escuchar('diga el puntaje un numero...');
    const puntaje = extraerNumero(puntajeTexto);

    if (!nombre || Number.isNaN(puntaje)) {
      estatusEl.textContent = 'no se entendio bien di todo de vuelta';
      return;
    }

    estatusEl.textContent = `guardando: ${nombre} - ${puntaje}...`;
    const res = await fetch('/platos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, puntaje })
    });
    const datos = await res.json();

    if (datos.error) {
      estatusEl.textContent = datos.mensaje;
    } else {
      estatusEl.textContent = datos.mensaje;
      await mostrarPlatos();
    }
  } catch (err) {
    estatusEl.textContent = 'no se entendio bien di todo de vuelta';
  } finally {
    botonsitoAgregar.disabled = false;
  }
});

mostrarPlatos();