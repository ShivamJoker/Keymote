
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5976/350335', {
  perMessageDeflate: false
});

ws.on('open', function open() {
  ws.send('something');
});