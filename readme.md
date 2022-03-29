# Description

A really basic logging object that produces json logs. 

---
# Usage

## Install
```bash
npm i simple-logs
```

## Import

```javascript
import { log } from "simple-logs";
```

---
# Logging
You can call:

```javascript
log.debug("hello world");
```

To receive a log entry something like:

```json
{"msg":"hello world","ctx":"pid=27143","level":"DEBUG","timestamp":"2022-03-29T09:14:09.863Z","time":1648545249863}
```

Or, assuming you have an object, `data` that you want to log, you can do this:

```javascript
log.info({msg: "this is my world", data});
```

# Interface
The log object will accept `debug`, `info`, or `error` calls, each of which take only a single parameter, which can be a string or an object. If it's a string, then the string will be mapped to a `msg` property in the resulting log message.

The log object also accepts the following call:

```javascript
log.setCtx("my context");
```

Which will add a `ctx` property to all logging messages from that point forward. I find this is helpful if set to a uuid once per application, as it then helps keep track of which instance of an application is logging (very useful for k8s).

## Errors
When 

# Notes:
* 1

The logging part of this lib uses `JSON.stringify()` to convert the log to a string. You must ensure that your objects are serializable in this way. They must not contain circular references.


* 2

I find this very useful when pushing my logs through jq for pretty printing using the following construct:

```bash
npm start | grep "^{" | jq
```
