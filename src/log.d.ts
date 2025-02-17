type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface Log {
    setCtx: (newCtx: string) => void;
    getCtx: () => string;
    setRedacted: (redacted: boolean) => void;
    getRedacted: () => boolean;
    setRedactionRegex: (regex: RegExp) => void;
    getRedactionRegex: () => RegExp;
    setRedactionSubst: (subst: string) => void;
    getRedactionSubst: () => string;
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
}

export const log: Readonly<Log>;