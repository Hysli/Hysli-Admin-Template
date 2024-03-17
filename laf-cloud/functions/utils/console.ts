// customConsole.ts
import cloud from '@lafjs/cloud'

// Extend the Console interface
interface ExtendedConsole extends Console {
  /**
   * Custom method to log data to the console and save it to the database
   * @param data - The data to log
   * @returns void
   * @example
   * customConsole.add('This is a log message')
   */
  add(...data: any[]): void
}

function extractOriginalCaller(stack: string): string {
  const stackLines = stack.split('\n')
  for (let i = 3; i < stackLines.length; i++) {
    if (!stackLines[i].includes('consoleInterceptor')) {
      return stackLines[i].trim()
    }
  }
  return 'unknown location'
}

function consoleInterceptor(method: string, ...args: any[]) {
  const stack = new Error().stack || ''
  const caller = extractOriginalCaller(stack)

  // Interception logic
  if (method === 'debug' || method === 'error' || method === 'add') {
    cloud.database().collection('console_logs').add({
      method,
      args,
      caller,
      create_time: Date.now(),
    })
  }
  if (method !== 'add') {
    originalConsole[method].apply(console, [
      ...args,
      `\nCalled from: ${caller}`,
    ])
  }
}

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
}

const customConsole: ExtendedConsole = {
  ...console,
  add: (...args) => consoleInterceptor('add', ...args),
}

customConsole.log = (...args) => consoleInterceptor('log', ...args)
customConsole.error = (...args) => consoleInterceptor('error', ...args)
customConsole.debug = (...args) => consoleInterceptor('debug', ...args)
customConsole.warn = (...args) => consoleInterceptor('warn', ...args)
customConsole.info = (...args) => consoleInterceptor('info', ...args)

export default customConsole
