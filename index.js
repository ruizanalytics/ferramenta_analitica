// Bot básico do OpenWA: responde comandos de teste e expõe enviarAlerta().
// Uso: node index.js            -> inicia o bot e mostra o QR code no terminal
//      ALERTA_NUMERO=5521999999999 node index.js  -> envia um alerta de teste ao conectar
const { create } = require('@open-wa/wa-automate');

const SESSION_ID = process.env.WA_SESSION_ID || 'projetos';

// Envia um alerta de texto. `numero` no formato DDI+DDD+número, só dígitos (ex.: 5521999999999).
async function enviarAlerta(client, numero, texto) {
  const chatId = `${numero.replace(/\D/g, '')}@c.us`;
  return client.sendText(chatId, texto);
}

function start(client) {
  client.onMessage(async msg => {
    const texto = (msg.body || '').trim().toLowerCase();
    if (texto === 'oi' || texto === 'ping') {
      await client.sendText(msg.from, texto === 'ping' ? 'pong' : 'Olá! Bot do Projetos no ar.');
    }
  });

  if (process.env.ALERTA_NUMERO) {
    enviarAlerta(client, process.env.ALERTA_NUMERO, '✅ Alerta de teste da ferramenta analítica.')
      .then(() => console.log('Alerta de teste enviado.'))
      .catch(err => console.error('Falha ao enviar alerta:', err));
  }
}

if (require.main === module) {
  create({
    sessionId: SESSION_ID,
    multiDevice: true,
    headless: true,
    qrTimeout: 0,
    authTimeout: 0,
    disableSpins: true,
  })
    .then(start)
    .catch(err => {
      console.error('Erro ao iniciar o OpenWA:', err);
      process.exit(1);
    });
}

module.exports = { enviarAlerta };
