var config = {
  database: {
    host:        'localhost',
    user:        'root',
    password:    'reallysuperdupersecurepassword',
    port:        '3306',
    db:          'lab6'
  },
  server: {
    host: '127.0.0.1',
    port: '4000'
  }
}

module.exports = config  // Expose current config as module
