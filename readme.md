# Description

A really basic logging object that produces json logs and which has no dependencies. If you want more serious logging, please check out the [Pino](https://www.npmjs.com/package/pino) project.

This project isn't optimised for memory consumption or performance. It has been written to provide simple logging in a proof-of-concept project and released publicly because its convenient to do so. I am actively maintaing this project though (infrequently), so if you are foolish enough to want use this (rather than the excellent Pino) and you would like me fix or change something, please checkout the associated github repo and let me know through the discussion/issues feature.



# Usage

### Install
```bash
npm i @bryandollery/simple-logging
```

### Import

```javascript
import { log } from "@bryandollery/simple-logging";
```

# Logging
You can call:

```javascript
log.debug("hello world");
```

To receive a log entry something like:

```json
{"message":"hello world","ctx":"pid=27143","level":"DEBUG","date":"2022-03-29T09:14:09.863Z"}
```

Or, assuming you have an object, `data` that you want to log, you can do this:

```javascript
const myData = { a: 1, b: 2 };
log.info({msg: "this is my world", myData});
```

to get

```json
{"message":"this is my world","data":{"myData":{"a":1,"b":2}},"ctx":"pid=273848","level":"INFO","date":"2022-03-29T09:14:09.863Z"}
```


Note that the logs always output 'message' as the message property name, but you're free to use 'message' or 'msg' as the property name in the object you pass to logging.

To simplify your logging a bit, the log methods also accept a list of arguments. The first arg will be used as a message, and the rest will be placed in a property called 'data'.

```javascript
const myData = { a: 1, b: 2 };
log.debug("debug something", myData);
```

Results in

```json
{"message":"debug something","data":[{"a":1,"b":2}],"ctx":"pid=273285","level":"DEBUG","date":"2022-03-29T09:14:09.863Z"}
```

Finally, you can supress the message if you'd like by simply not including one:

```javascript
log.debug({ a: 1 });
```

Results in:

```json
{"data":{"a":1},"ctx":"pid=275022","level":"DEBUG","date":"2022-03-29T09:14:09.863Z"}
```

# Interface
The log object will accept `debug`, `info`, `warn` or `error` calls, each of which take a list of arguments the first of which will be used as the message unless the only argument is an object, then the object will be searched for a property 'message' or 'msg'.

The log object also accepts the following call:

```javascript
log.setCtx("my context");
```

Which will set the `ctx` property to all logging messages from that point forward. I find this is helpful if set to a uuid once per application, as it then helps keep track of which instance of an application is logging (very useful for k8s).

By default, the context (`ctx`) is set to the environment variable HOSTNAME, if it exists, or the process id. The HOSTNAME thing is because this lib was created for use in applications running in kubernetes and sometimes its really helpful to know which pod is writing the logs. There are other ways of knowing the same thing, but our team have found this to be quite useful information to have available at a glance when logs have been aggregated.

# Log Levels
The log object pays attention to an environment varialbe called `LOG_LEVEL` and behaves as expected. This defaults to 'DEBUG' and accepts the values: `DEBUG`, `INFO`, `WARN` and `ERROR` in that order.

# Redaction
By default, this library will redact any data property called `'password'`. This can be disabled with `log.setRedacted(false)`. The lib makes the redaction and substitution regexes mutable, so you can use `setRedactionRegex` and `setRedactionSubst` to change how redaction works. This can actually be used to perform a lot of other tasks, but be aware of the simple nature of the underlying code:

```javascript
const beforeRedaction = JSON.stringify(objectToLog);
const redacted = beforeRedaction.replaceAll(redactionRegex, redactionSubst);
```

So, if you're planning on using this feature for anything beyond very simple redaction, beware: here be dragons.

# Notes:

* 1

The logging part of this lib uses `JSON.stringify()` to convert the log to a string. You must ensure that your objects are serializable in this way. They must not contain circular references.


* 2

I find this library very useful when pushing my nodejs logs through jq for pretty printing using the following construct:

```bash
npm start | grep "^{" | jq
```


# Other Options
If you want more serious logging, you should check out the [Pino](https://www.npmjs.com/package/pino) project. It's much better than this library. This is a quick and dirty way to simply output json logs rather than plain text. Pino is a fully-fledged logging library that a lot more thought and effort has gone into. I would highly recommend looking at that project rather than this one.

---
# History
* 1.0: Mar 2021 - Basic logging
* 2.0: Jan 2022 - Simplified passing of data to be logged through the use of varialble argument lists. Added * logging levels. Removed timestamp: dates are now always iso formatted
* 2.1: Jan 2022 - Added simple redaction
* 2.1.2: Feb 2025 - Added typescript definitions
