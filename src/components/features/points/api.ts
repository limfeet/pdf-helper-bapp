// src/features/points/api.ts
type CommonParams = {
  token: string
  apiBaseUrl?: string
  apiKey?: string
}

type ChargeParams = CommonParams & {
  jobId: string
  points: number
  ttlMinutes?: number // hold에서만 사용
}

async function req<T>(
  path: string,
  method: 'POST' | 'GET',
  body: unknown,
  { token, apiBaseUrl, apiKey }: CommonParams,
): Promise<T> {
  const base = apiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const headers: Record<string, string> = {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  }
  if (apiKey || process.env.NEXT_PUBLIC_API_KEY) {
    headers['x-api-key'] = apiKey || process.env.NEXT_PUBLIC_API_KEY!
  }

  const resp = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await resp.json().catch(() => ({}))

  if (!resp.ok) {
    throw new Error(data.detail || `HTTP ${resp.status}`)
  }
  return data as T
}

// 비구독자: 선차감
export async function precharge(params: ChargeParams) {
  const { jobId, points, ...rest } = params
  return req<{ ok: boolean; balance: number }>(
    '/points/precharge',
    'POST',
    { job_id: jobId, points },
    rest,
  )
}

// 구독자: 예약(hold)
export async function hold(params: ChargeParams) {
  const { jobId, points, ttlMinutes = 30, ...rest } = params
  return req<{ ok: boolean; hold_id: string }>(
    '/points/hold',
    'POST',
    { job_id: jobId, points, ttl_minutes: ttlMinutes },
    rest,
  )
}

// 예약 해제
export async function releaseHold(holdId: string, opts: CommonParams) {
  return req<{ ok: boolean }>('/points/release', 'POST', { hold_id: holdId }, opts)
}

// 내 포인트 조회
export async function getMyPoints(opts: CommonParams) {
  return req<{ balance: number; is_subscriber: boolean }>('/points/me', 'GET', undefined, opts)
}
