const ITERATIONS = 310_000
const HASH_LENGTH = 32
const ALGORITHM = 'PBKDF2'
const DIGEST = 'SHA-256'

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToBuf(hex: string): Uint8Array {
  const arr = hex.match(/.{2}/g)
  if (!arr) throw new Error('Invalid hex string')
  return new Uint8Array(arr.map((h) => parseInt(h, 16)))
}

async function deriveKey(password: string, salt: ArrayBuffer): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    ALGORITHM,
    false,
    ['deriveBits']
  )
  return crypto.subtle.deriveBits(
    { name: ALGORITHM, hash: DIGEST, salt, iterations: ITERATIONS },
    key,
    HASH_LENGTH * 8
  )
}

export async function hashPassword(password: string): Promise<string> {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16))
  const hash = await deriveKey(password, saltBytes.buffer as ArrayBuffer)
  return `pbkdf2:${bufToHex(saltBytes.buffer as ArrayBuffer)}:${bufToHex(hash)}`
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  const parts = hash.split(':')
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false
  const salt = hexToBuf(parts[1])
  const expected = parts[2]
  const computed = bufToHex(await deriveKey(password, salt.buffer as ArrayBuffer))
  return computed === expected
}
