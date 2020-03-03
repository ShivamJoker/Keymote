var bonjour = require('bonjour')()
 
// advertise an HTTP server on port 3000
// bonjour.destroy();

bonjour.unpublishAll()

bonjour.publish({ name: 'wifi remote', host: 'hello.local', type: 'http', port: 8080 })
 
// browse for all http services
bonjour.find({ type: 'http' }, function (service) {
  console.log('Found an HTTP server:', service)
})