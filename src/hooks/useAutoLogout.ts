'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
import { heartbeat } from '@/lib/sessionApi'

// 브라우저 호환 타이머 타입
type TimeoutId = ReturnType<typeof setTimeout>
type IntervalId = ReturnType<typeof setInterval>

interface UseAutoLogoutOptions {
  apiKey: string
  warnTimeMs?: number
  logoutTimeMs?: number
  heartbeatIntervalMs?: number
  activityDebounceMs?: number
  maxFailureCount?: number
  heartbeatTimeoutMs?: number
  leaderElectionIntervalMs?: number
  onWarning?: () => void
  onLogout?: () => void
  onSessionExtended?: () => void
  onError?: (error: Error, failureCount: number) => void
  onLeaderChange?: (isLeader: boolean) => void
  onBusyStateChange?: (isBusy: boolean) => void
}

interface UseAutoLogoutReturn {
  pause: () => void
  resume: () => void
  isBusy: () => boolean
  isLeader: () => boolean
  extendSession: () => Promise<boolean>
  getLastHeartbeat: () => number
  getFailureCount: () => number
}

export function useAutoLogout({
  apiKey,
  warnTimeMs = 25 * 60 * 1000,
  logoutTimeMs = 30 * 60 * 1000,
  heartbeatIntervalMs = 5 * 60 * 1000,
  activityDebounceMs = 2000,
  maxFailureCount = 3,
  heartbeatTimeoutMs = 5000,
  leaderElectionIntervalMs = 5000,
  onWarning,
  onLogout,
  onSessionExtended,
  onError,
  onLeaderChange,
  onBusyStateChange,
}: UseAutoLogoutOptions): UseAutoLogoutReturn {
  // ===== refs =====
  const warnTimerRef = useRef<TimeoutId | null>(null)
  const logoutTimerRef = useRef<TimeoutId | null>(null)
  const activityDebounceRef = useRef<TimeoutId | null>(null)
  const heartbeatTimerRef = useRef<TimeoutId | null>(null)
  const leaderElectionTimerRef = useRef<IntervalId | null>(null)
  const pingTimeoutRef = useRef<TimeoutId | null>(null)

  const isActiveRef = useRef(true)
  const busyRef = useRef(false)
  const lastHeartbeatRef = useRef(0)
  const failureCountRef = useRef(0)
  const leaderRef = useRef(false)

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)
  const channelName = `auto-logout-${apiKey?.slice(-8) || 'default'}`

  const activityEvents = useMemo(
    () => ['mousedown', 'keydown', 'scroll', 'touchstart'] as const,
    [],
  )

  // ===== utils =====
  const getTabId = useCallback(() => {
    let tabId = ''
    try {
      tabId = sessionStorage.getItem('tab-id') || ''
      if (!tabId) {
        tabId = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
        sessionStorage.setItem('tab-id', tabId)
      }
    } catch {
      // sessionStorage 불가 환경 대비
      tabId = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    }
    return tabId
  }, [])

  const clearAllTimers = useCallback(() => {
    if (warnTimerRef.current) {
      clearTimeout(warnTimerRef.current)
      warnTimerRef.current = null
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
    if (activityDebounceRef.current) {
      clearTimeout(activityDebounceRef.current)
      activityDebounceRef.current = null
    }
    if (heartbeatTimerRef.current) {
      clearTimeout(heartbeatTimerRef.current)
      heartbeatTimerRef.current = null
    }
    if (leaderElectionTimerRef.current) {
      clearInterval(leaderElectionTimerRef.current)
      leaderElectionTimerRef.current = null
    }
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current)
      pingTimeoutRef.current = null
    }
  }, [])

  // ===== leadership =====
  const claimLeadership = useCallback(() => {
    if (leaderRef.current) return
    leaderRef.current = true
    onLeaderChange?.(true)
    broadcastChannelRef.current?.postMessage({
      type: 'leader-claimed',
      timestamp: Date.now(),
      tabId: getTabId(),
    })
    if (process.env.NODE_ENV === 'development') console.log('🏆 리더 탭이 되었습니다')
  }, [onLeaderChange, getTabId])

  const resignLeadership = useCallback(() => {
    if (!leaderRef.current) return
    leaderRef.current = false
    onLeaderChange?.(false)
    if (process.env.NODE_ENV === 'development') console.log('👋 리더 자리를 양보했습니다')
  }, [onLeaderChange])

  const initializeBroadcastChannel = useCallback(() => {
    if (typeof window === 'undefined' || !(window as any).BroadcastChannel) {
      leaderRef.current = true
      onLeaderChange?.(true)
      return
    }
    try {
      const bc = new BroadcastChannel(channelName)
      broadcastChannelRef.current = bc

      bc.addEventListener('message', (event: MessageEvent) => {
        const { type, timestamp, tabId } = (event.data || {}) as any
        switch (type) {
          case 'leader-claimed':
            // 다른 탭이 리더 선언 → 난 팔로워
            if (tabId !== getTabId() && leaderRef.current) {
              leaderRef.current = false
              onLeaderChange?.(false)
            }
            break
          case 'leader-ping':
            // 리더 생존확인 → 리더면 응답
            if (leaderRef.current) {
              bc.postMessage({ type: 'leader-pong', timestamp: Date.now(), tabId: getTabId() })
            }
            break
          case 'heartbeat-sent':
            // 리더 중복 호출 방지 메타 (참고용)
            if (leaderRef.current && tabId !== getTabId()) {
              lastHeartbeatRef.current = timestamp || Date.now()
            }
            break
        }
      })
    } catch (e) {
      console.warn('BroadcastChannel 초기화 실패:', e)
      leaderRef.current = true
      onLeaderChange?.(true)
    }
  }, [channelName, getTabId, onLeaderChange])

  const performLeaderElection = useCallback(() => {
    if (document.hidden || !isActiveRef.current || leaderRef.current) return

    // 리더 존재 확인
    broadcastChannelRef.current?.postMessage({
      type: 'leader-ping',
      timestamp: Date.now(),
      tabId: getTabId(),
    })

    if (pingTimeoutRef.current) clearTimeout(pingTimeoutRef.current)
    pingTimeoutRef.current = setTimeout(() => {
      if (!leaderRef.current && !document.hidden && isActiveRef.current) claimLeadership()
    }, 1000)
  }, [claimLeadership, getTabId])

  // ===== session timers =====
  const resetSessionTimers = useCallback(() => {
    if (warnTimerRef.current) {
      clearTimeout(warnTimerRef.current)
      warnTimerRef.current = null
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }

    warnTimerRef.current = setTimeout(() => {
      if (isActiveRef.current) onWarning?.()
    }, warnTimeMs)
    logoutTimerRef.current = setTimeout(() => {
      if (isActiveRef.current) handleLogout()
    }, logoutTimeMs)
  }, [warnTimeMs, logoutTimeMs, onWarning])

  const handleLogout = useCallback(() => {
    isActiveRef.current = false
    clearAllTimers()
    try {
      broadcastChannelRef.current?.close()
      broadcastChannelRef.current = null
    } catch (e) {
      console.warn('BroadcastChannel 정리 실패:', e)
    }
    if (onLogout) onLogout()
    else window.location.href = '/login'
  }, [clearAllTimers, onLogout])

  // ===== heartbeat =====
  const sendHeartbeat = useCallback(
    async (force = false): Promise<boolean> => {
      console.log('[HB] enter', {
        apiKey: !!apiKey,
        active: isActiveRef.current,
        hidden: document.hidden,
        leader: leaderRef.current,
        busy: busyRef.current,
        sinceLast: Date.now() - lastHeartbeatRef.current,
      })
      if (!apiKey) {
        console.warn('useAutoLogout: API 키가 필요합니다')
        return false
      }
      if (!isActiveRef.current) return false

      // 작업 중엔 네트워크 생략, 타이머만 연장
      if (busyRef.current) return true

      // 백그라운드/팔로워 탭은 스킵
      if (document.hidden || !leaderRef.current) return true

      const now = Date.now()
      if (!force && now - lastHeartbeatRef.current < heartbeatIntervalMs) return true

      const ac = new AbortController()
      const tid = setTimeout(() => ac.abort(), heartbeatTimeoutMs)

      try {
        // NOTE: sessionApi.heartbeat는 credentials: 'include' 필수로 구현되어야 함
        await heartbeat(apiKey, { signal: ac.signal })
        lastHeartbeatRef.current = now
        failureCountRef.current = 0
        broadcastChannelRef.current?.postMessage({
          type: 'heartbeat-sent',
          timestamp: now,
          tabId: getTabId(),
        })
        onSessionExtended?.()
        if (process.env.NODE_ENV === 'development') console.log('💓 Heartbeat 전송 성공')
        return true
      } catch (err) {
        failureCountRef.current += 1
        onError?.(err instanceof Error ? err : new Error('Heartbeat 실패'), failureCountRef.current)
        if (process.env.NODE_ENV === 'development') {
          console.warn(`💔 Heartbeat 실패 ${failureCountRef.current}/${maxFailureCount}`, err)
        }
        if (failureCountRef.current >= maxFailureCount) {
          console.error('최대 heartbeat 실패 횟수 도달 → 로그아웃')
          handleLogout()
        }
        return false
      } finally {
        clearTimeout(tid)
      }
    },
    [
      apiKey,
      heartbeatIntervalMs,
      heartbeatTimeoutMs,
      maxFailureCount,
      onError,
      onSessionExtended,
      handleLogout,
      getTabId,
    ],
  )

  const schedulePeriodicHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearTimeout(heartbeatTimerRef.current)
      heartbeatTimerRef.current = null
    }

    const loop = async () => {
      console.log('[HB] via periodic loop tick')
      await sendHeartbeat(true)
      if (isActiveRef.current) heartbeatTimerRef.current = setTimeout(loop, heartbeatIntervalMs)
    }
    heartbeatTimerRef.current = setTimeout(loop, heartbeatIntervalMs)
  }, [sendHeartbeat, heartbeatIntervalMs])

  // ===== activity / visibility =====
  const handleUserActivity = useCallback(() => {
    if (document.hidden || !isActiveRef.current) return
    if (activityDebounceRef.current) {
      clearTimeout(activityDebounceRef.current)
      activityDebounceRef.current = null
    }
    activityDebounceRef.current = setTimeout(async () => {
      if (!isActiveRef.current) return
      resetSessionTimers()
      console.log('[HB] via activity, leader=', leaderRef.current)
      await sendHeartbeat(false)
    }, activityDebounceMs)
  }, [resetSessionTimers, sendHeartbeat, activityDebounceMs])

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      resignLeadership()
    } else if (isActiveRef.current) {
      resetSessionTimers()
      performLeaderElection()
      console.log('[HB] via visibility, leader=', leaderRef.current)
      setTimeout(() => {
        if (leaderRef.current) {
          console.log('[HB] visibility -> sending now')
          void sendHeartbeat(true)
        }
      }, 1500)
    }
  }, [resignLeadership, resetSessionTimers, performLeaderElection, sendHeartbeat])

  // ===== external API =====
  const pause = useCallback(() => {
    const wasBusy = busyRef.current
    busyRef.current = true
    resetSessionTimers()
    if (!wasBusy) onBusyStateChange?.(true)
    if (process.env.NODE_ENV === 'development') console.log('⏸️ 작업 보호 모드')
  }, [resetSessionTimers, onBusyStateChange])

  const resume = useCallback(() => {
    const wasBusy = busyRef.current
    busyRef.current = false
    resetSessionTimers()
    void sendHeartbeat(true)
    if (wasBusy) onBusyStateChange?.(false)
    if (process.env.NODE_ENV === 'development') console.log('▶️ 작업 보호 모드 해제')
  }, [resetSessionTimers, sendHeartbeat, onBusyStateChange])

  const isBusy = useCallback(() => busyRef.current, [])
  const isLeader = useCallback(() => leaderRef.current, [])
  const extendSession = useCallback(() => sendHeartbeat(true), [sendHeartbeat])
  const getLastHeartbeat = useCallback(() => lastHeartbeatRef.current, [])
  const getFailureCount = useCallback(() => failureCountRef.current, [])

  // ===== lifecycle =====
  useEffect(() => {
    if (!apiKey) {
      console.warn('useAutoLogout: API 키가 필요합니다. 초기화를 건너뜁니다.')
      return
    }

    isActiveRef.current = true
    busyRef.current = false
    lastHeartbeatRef.current = 0
    failureCountRef.current = 0

    initializeBroadcastChannel()

    const add = () => {
      activityEvents.forEach((e) =>
        document.addEventListener(e, handleUserActivity, { passive: true }),
      )
      window.addEventListener('focus', handleUserActivity) // ✅ focus는 window에서
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }
    const remove = () => {
      activityEvents.forEach((e) => document.removeEventListener(e, handleUserActivity))
      window.removeEventListener('focus', handleUserActivity)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }

    add()
    resetSessionTimers()
    schedulePeriodicHeartbeat()

    performLeaderElection()
    if (leaderElectionTimerRef.current) clearInterval(leaderElectionTimerRef.current)
    leaderElectionTimerRef.current = setInterval(performLeaderElection, leaderElectionIntervalMs)

    const initial = setTimeout(() => {
      void sendHeartbeat(true)
    }, 1000)

    return () => {
      isActiveRef.current = false
      remove()
      clearAllTimers()
      clearTimeout(initial)
      try {
        broadcastChannelRef.current?.close()
        broadcastChannelRef.current = null
      } catch (e) {
        console.warn('BroadcastChannel 정리 실패:', e)
      }
    }
  }, [
    apiKey,
    activityEvents,
    handleUserActivity,
    handleVisibilityChange,
    resetSessionTimers,
    schedulePeriodicHeartbeat,
    performLeaderElection,
    leaderElectionIntervalMs,
    sendHeartbeat,
    clearAllTimers,
    initializeBroadcastChannel,
  ])

  // ===== debug =====
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && apiKey) {
      console.log('🔐 Auto logout hook 초기화됨', {
        warnMin: warnTimeMs / 60000,
        logoutMin: logoutTimeMs / 60000,
        hbMin: heartbeatIntervalMs / 60000,
        maxFailures: maxFailureCount,
        channel: channelName,
      })
    }
  }, [apiKey, warnTimeMs, logoutTimeMs, heartbeatIntervalMs, maxFailureCount, channelName])

  return { pause, resume, isBusy, isLeader, extendSession, getLastHeartbeat, getFailureCount }
}
