const API = process.env.NEXT_PUBLIC_API_BASE_URL! // 예: https://api.example.com

// 1. 현재 쿠키 상태 확인
function checkCurrentCookies() {
  console.log('현재 저장된 쿠키들:', document.cookie)

  // 특정 세션 쿠키 확인
  const sessionCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sessionId=') || row.startsWith('session='))

  console.log('세션 쿠키:', sessionCookie)
  return sessionCookie
}

export async function heartbeat(apiKey: string, options?: { signal?: AbortSignal }) {
  // 요청 전 쿠키 상태 확인
  console.log('요청 전 쿠키 상태:', document.cookie)
  const res = await fetch(`${API}/auth/heartbeat`, {
    method: 'POST',
    credentials: 'include', // 세션 쿠키 전달
    headers: { 'x-api-key': apiKey },
    signal: options?.signal,
  })
  // 서버가 설정한 쿠키 확인
  const setCookies = res.headers.get('set-cookie')
  console.log('Set-Cookie 헤더:', setCookies)
  if (!res.ok) {
    throw new Error(`Heartbeat failed: ${res.status}`)
  }

  return res.json()
}

export async function serverLogout(apiKey: string) {
  await fetch(`${API}/auth/server-logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'x-api-key': apiKey },
  })
}
