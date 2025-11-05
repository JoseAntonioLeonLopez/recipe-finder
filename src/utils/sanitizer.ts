export function sanitizeString(str: string): string {
  return str.replace(/[&<>"']/g, (match) => {
    const escapeChars: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
    }
    return escapeChars[match]
  })
}
