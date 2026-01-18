import { env } from "cloudflare:workers";

type LogLevel = "error" | "warn" | "info" | "debug";

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const CURRENT_LEVEL = (env.LOG_LEVEL ?? "info") as LogLevel;

function canLog(level: LogLevel) {
  return LEVELS[level] <= LEVELS[CURRENT_LEVEL];
}

export const logger = {
  error: (...args: unknown[]) => canLog("error") && console.error(...args),
  warn:  (...args: unknown[]) => canLog("warn")  && console.warn(...args),
  info:  (...args: unknown[]) => canLog("info")  && console.log(...args),
  debug: (...args: unknown[]) => canLog("debug") && console.debug(...args),
};
