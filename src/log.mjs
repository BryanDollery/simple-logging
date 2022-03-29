const dump = (report, level) => {
  let logObject = typeof report === "string" ? { msg: report } : { ...report };
  logObject = { ...logObject, ctx, level, timestamp: new Date(), time: Date.now() };

  // These two lines seem counterintuitive, but they are needed for correct error reporting.
  const isError = report.hasOwnProperty("cause");
  if (isError) logObject.cause = `${report.cause}`;

  console.log(JSON.stringify(logObject));
};

let ctx = `pid=${process.pid}`;

const log = {
  setCtx: newCtx => (ctx = newCtx),
  getCtx: () => ctx,
  debug: report => dump(report, "DEBUG"),
  info: report => dump(report, "INFO"),
  error: report => dump(report, "ERROR")
};

Object.freeze(log);
Object.seal(log);

export { log };
