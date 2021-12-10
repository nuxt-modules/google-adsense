import { fileURLToPath } from 'url'
import { resolve, dirname } from 'pathe'

export const distDir = resolve(typeof __dirname === 'undefined' ? dirname(fileURLToPath(import.meta.url)) : __dirname)

const _makeResolve = (base: string) => {
  return (...p: string[]) => resolve(base, ...p)
}

export const runtimeDir = resolve(distDir, 'runtime')
export const resolveRuntimeDir = _makeResolve(runtimeDir)

export const templateDir = resolve(distDir, 'templates')
export const resolveTemplateDir = _makeResolve(templateDir)
