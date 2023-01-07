let ctx = process.env.HOSTNAME ? `pod=${process.env.HOSTNAME}` : `pid=${process.pid}`;
let isRedacted = true;
let redactionRegex = /"password":".*?"/g;
let redactionSubst = '"password":"redacted"';

const levels = {
  DEBUG: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
  INFO: ['INFO', 'WARN', 'ERROR'],
  WARN: ['WARN', 'ERROR'],
  ERROR: ['ERROR'],
};

const allowedLevel = levels.DEBUG.includes(process.env.LOG_LEVEL || 'DEBUG') ? process.env.LOG_LEVEL || 'DEBUG' : 'DEBUG';

const isAllowed = level => {
  return levels[allowedLevel].includes(level);
};

const _log = (level, ...args) => {
  if (!isAllowed(level)) return;

  let logObject;
  if (args.length === 1) {
    if (typeof args[0] === "string") {
      logObject = { message: args[0], ctx, level, date: Date.now() };
    } else if (args[0].hasOwnProperty('message') || args[0].hasOwnProperty('msg')) {
      const message = args[0].message || args[0].msg;
      delete args[0].message;
      delete args[0].msg;
      logObject = { message, data: { ...args[0] }, ctx, level, date: Date.now() };
    } else {
      logObject = { data: { ...args[0] }, ctx, level, date: Date.now() };
    }
  } else {
    const message = args.shift();
    logObject = { message, data: [...args], ctx, level, date: Date.now() };
  }

  const beforeRedaction = JSON.stringify(logObject);
  const redacted = beforeRedaction.replaceAll(redactionRegex, redactionSubst);

  console.log(isRedacted ? redacted : beforeRedaction);
};

const log = {
  setCtx: newCtx => (ctx = newCtx),
  getCtx: _ => ctx,
  setRedacted: redacted => isRedacted = redacted,
  getRedacted: _ => isRedacted,
  setRedactionRegex: regex => redactionRegex = regex,
  getRedactionRegex: _ => redactionRegex,
  setRedactionSubst: subst => redactionSubst = subst,
  getRedactionSubst: _ => redactionSubst,
  debug: (...args) => _log("DEBUG", ...args),
  info: (...args) => _log("INFO", ...args),
  error: (...args) => _log("ERROR", ...args),
  warn: (...args) => _log("WARN", ...args),
};

Object.freeze(log);
Object.seal(log);

export { log };
