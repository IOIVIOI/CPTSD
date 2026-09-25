import methodsFile from "../../methods/methods.json";
import type { MethodsFile, Method } from "../types";

const data = methodsFile as MethodsFile;

export const methods: Method[] = data.methods;

export function getMethodById(id: string): Method | undefined {
  return methods.find((method) => method.id === id);
}
