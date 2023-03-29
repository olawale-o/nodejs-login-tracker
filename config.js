const convict = require('convict');
const convict_format_with_validator = require('convict-format-with-validator');

// convict.addFormat(convict_format_with_validator.port);

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 5000,
    env: 'PORT',
    arg: 'port',
  },
  db: {
    username: {
      doc: 'Database username',
      format: String,
      default: '',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: null,
    },
    dialect: {
      doc: 'Database dialect',
      format: String,
      default: 'postgres',
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'auth_tracker',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: 5432,
    },
    host: {
      doc: 'Database host',
      format: String,
      default: 'localhost',
    },
  },
});

const env = config.get('env');
config.loadFile(`./src/config/${env}.json`);

config.validate({ allowed: 'strict' });

module.exports = config;
