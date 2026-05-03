import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function normalizarTelefone(value: string) {
  const digits = digitsOnly(value)
  if (!digits) return ''
  if (digits.startsWith('55') && digits.length > 11) return digits.slice(2, 13)
  return digits.slice(0, 11)
}

export function formatTelefoneLocal(value: string) {
  const digits = normalizarTelefone(value)
  if (!digits) return ''
  const ddd = digits.slice(0, 2)
  const local = digits.slice(2)
  if (!ddd) return ''
  if (!local) return `(${ddd})`
  if (local.length <= 4) return `(${ddd}) ${local}`
  if (local.length <= 8) return `(${ddd}) ${local.slice(0, 4)}-${local.slice(4)}`
  return `(${ddd}) ${local.slice(0, 5)}-${local.slice(5)}`
}

export function formatTelefoneBR(value: string) {
  const local = formatTelefoneLocal(value)
  return local ? `+55 ${local}` : '-'
}

export function formatCpf(value: string) {
  const nums = digitsOnly(value).slice(0, 11)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return nums.slice(0, 3) + '.' + nums.slice(3)
  if (nums.length <= 9) return nums.slice(0, 3) + '.' + nums.slice(3, 6) + '.' + nums.slice(6)
  return nums.slice(0, 3) + '.' + nums.slice(3, 6) + '.' + nums.slice(6, 9) + '-' + nums.slice(9)
}

export function formatCep(value: string) {
  const nums = digitsOnly(value).slice(0, 8)
  if (nums.length > 5) return nums.slice(0, 5) + '-' + nums.slice(5)
  return nums
}
