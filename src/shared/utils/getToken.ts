export function getToken (authorizationHeader = '') {
  if (!authorizationHeader) return null
  const header = authorizationHeader.split('Bearer')
  if (!header[1]) return null
  return header[1].trim()
}
