//* Helper to get arguments from the command line

// Imports
import { FuncReturnTypes } from '../interfaces/helpers.interface';

// Types
export type Args = {
  port: number;
  isProd: boolean;
};

// args from process
const argsProcess: string[] = process.argv.slice(1);

//? Get one arg
export const getArg = <K extends keyof Args>(arg: K): Args[K] => {
  const argFunc: FuncReturnTypes<Args> = {
    port: () => getArgPort(),
    isProd: () => getArgProd(),
  };
  return argFunc[arg]() as Args[K];
};

//? Get all args
export const getArgs = (): Args => {
  const args: Args = {
    port: getArg('port'),
    isProd: getArg('isProd'),
  };
  return args;
};

//? If argument can be with value, get it in string
const getArgWithValue = (data: { argName: string }): string | undefined => {
  const { argName } = data;
  const index = argsProcess.findIndex((val) => val === `--${argName}`);
  if (index === -1) return undefined;
  let arg: string;
  if (argsProcess[index].includes('=')) arg = argsProcess[index].split('=')[1];
  else arg = argsProcess[index + 1];
  return arg;
};

//? Get port from args
const getArgPort = (): Args['port'] => {
  const defaultPort = 4200;
  const argName = 'port';
  
  let argPort = getArgWithValue({ argName });
  if (!argPort) return defaultPort;

  // Check if is number
  const port = Number(argPort);
  if (isNaN(port)) return defaultPort;
  return port;
};

//? Get isProd from args
const getArgProd = (): Args['isProd'] => {
  const argName = 'prod';
  const isProd = argsProcess.some((val) => val === `--${argName}`);
  return isProd;
};
