/**
 * Logger ligero con formato consistente.
 * Sin dependencias externas — reemplazable por Winston/Pino en el futuro.
 */

const LEVELS = {
  info: '\x1b[36m[INFO]\x1b[0m',    // Cyan
  warn: '\x1b[33m[WARN]\x1b[0m',    // Amarillo
  error: '\x1b[31m[ERROR]\x1b[0m',  // Rojo
  debug: '\x1b[90m[DEBUG]\x1b[0m',  // Gris
};

function formatTimestamp() {
  return new Date().toISOString();
}

function formatMessage(level, context, message, meta) {
  const prefix = `${formatTimestamp()} ${LEVELS[level]}`;
  const ctx = context ? ` [${context}]` : '';
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${prefix}${ctx} ${message}${metaStr}`;
}

const logger = {
  info(context, message, meta) {
    console.log(formatMessage('info', context, message, meta));
  },

  warn(context, message, meta) {
    console.warn(formatMessage('warn', context, message, meta));
  },

  error(context, message, meta) {
    console.error(formatMessage('error', context, message, meta));
  },

  debug(context, message, meta) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatMessage('debug', context, message, meta));
    }
  },
};

module.exports = logger;
