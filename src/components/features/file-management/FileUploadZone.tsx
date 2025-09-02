//src/components/features/file-management/FileUploadZone.tsx
'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext' // Auth 컨텍스트 추가

// 간단한 Progress 컴포넌트
interface ProgressProps {
  value: number
  className?: string
}

const Progress = ({ value, className }: ProgressProps) => (
  <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
)

interface UploadedFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error' | 'converting' | 'converted'
  progress: number
  fileId?: string // API에서 반환되는 file_id
  error?: string
  csvSize?: number
  downloadUrl?: string
}

interface FileUploadZoneProps {
  onFileSelect?: (files: FileList) => void
  onUploadComplete?: (fileId: string, originalFile: File) => void
  onUploadError?: (error: string, file: File) => void
  onConvertComplete?: (fileId: string, csvSize: number) => void
  onConvertError?: (error: string, fileId: string) => void
  className?: string
  maxFiles?: number
  maxFileSize?: number // bytes
  beforeUpload?: (files: File[]) => Promise<boolean>
}

export function FileUploadZone({
  onFileSelect,
  onUploadComplete,
  onUploadError,
  onConvertComplete,
  onConvertError,
  className,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 50MB
  beforeUpload,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const { user } = useAuth() // Firebase user 가져오기

  // CSV 변환 함수 (필요 포인트 계산 + hold/precharge 분기 + 변환 호출)
  const convertToCSV = async (fileId: string) => {
    console.log('[convert] debug 001')
    if (!user) return
    console.log('[convert] debug 002')
    // 상태 전환
    setUploadedFiles((prev) =>
      prev.map((f) => (f.fileId === fileId ? { ...f, status: 'converting' } : f)),
    )
    console.log('[convert] debug 003')
    // 업로드 목록에서 원본 파일 찾기 (페이지 수 계산용)
    const entry = uploadedFiles.find((f) => f.fileId === fileId)
    if (!entry) {
      console.error('파일 엔트리를 찾을 수 없습니다:', fileId)
      setUploadedFiles((prev) =>
        prev.map((f) => (f.fileId === fileId ? { ...f, status: 'success' } : f)),
      )
      return
    }
    console.log('[convert] debug 004')

    try {
      const token = await user.getIdToken()
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:18181'
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''

      // 1) 로컬에서 페이지 수 계산 → 필요 포인트 산출
      //    PAGES_PER_POINT = 10, required = max(1, ceil(pages/10))
      // v5 ESM 권장 임포트
      const pdfjs: any = await import('pdfjs-dist')
      //pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      const buf = await entry.file.arrayBuffer()
      const docTask = pdfjs.getDocument({ data: buf })
      const pdf = await docTask.promise
      const pages = pdf.numPages

      const requiredPoints = Math.max(1, Math.ceil(pages / 10))
      console.log('[convert] pages=', pages, 'requiredPoints=', requiredPoints)

      // 공통 헤더
      const baseHeaders: Record<string, string> = {
        authorization: `Bearer ${token}`,
        'x-api-key': apiKey,
      }

      // 2) 결제/예약 분기
      //    - 먼저 hold 시도(구독자일 때만 성공). 403이면 비구독자로 판단하고 precharge 진행.
      const jobId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`

      let holdId: string | undefined
      let isSubscriber = false
      console.log('[convert] debug 005')
      // 2-1) hold 먼저 시도 (구독자만 성공)
      {
        const res = await fetch(`${apiBaseUrl}/points/hold`, {
          method: 'POST',
          headers: { ...baseHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_id: jobId,
            points: requiredPoints,
            ttl_minutes: 30,
            service_name: 'pdf2csv',
          }),
        })

        if (res.ok) {
          const data = await res.json()
          holdId = data.hold_id
          isSubscriber = true
          console.log('[convert] hold 생성 성공:', data)
        } else if (res.status === 403) {
          // 비구독자 경로 → precharge로 폴백
          console.log('[convert] hold 금지(비구독자) → precharge로 전환')
        } else if (res.status === 402) {
          // 구독자지만 포인트 부족
          const detail = await res.text().catch(() => '')
          throw new Error(`구독자 포인트 부족(402): ${detail || '포인트가 부족합니다.'}`)
        } else {
          // 기타 에러는 그대로 노출
          const detail = await res.text().catch(() => '')
          throw new Error(`hold 생성 실패 (${res.status}): ${detail || '오류'}`)
        }
      }
      console.log('[convert] debug 006')
      // 2-2) 비구독자면 선차감(precharge)
      if (!isSubscriber) {
        const res = await fetch(`${apiBaseUrl}/points/precharge`, {
          method: 'POST',
          headers: { ...baseHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_id: jobId,
            points: requiredPoints,
            service_name: 'pdf2csv',
          }),
        })

        if (!res.ok) {
          const detail = await res.text().catch(() => '')
          if (res.status === 402) {
            throw new Error(`선결제 실패(402): ${detail || '포인트가 부족합니다.'}`)
          }
          throw new Error(`선결제 실패 (${res.status}): ${detail || '오류'}`)
        }
        console.log('[convert] precharge 성공')
      }

      // 3) 변환 호출
      const formData = new FormData()
      formData.append('file_id', fileId)

      const convertHeaders: Record<string, string> = { ...baseHeaders }
      if (isSubscriber && holdId) {
        convertHeaders['X-Hold-Id'] = holdId
      } else {
        convertHeaders['X-Job-Id'] = jobId
      }

      const response = await fetch(`${apiBaseUrl}/pdf/convert`, {
        method: 'POST',
        headers: convertHeaders,
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(`변환 실패 (${response.status}): ${errorText || '알 수 없는 오류'}`)
      }

      const data = await response.json()
      console.log('변환 성공:', data)

      // 상태 업데이트
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.fileId === fileId ? { ...f, status: 'converted', csvSize: data.csv_size } : f,
        ),
      )
      onConvertComplete?.(fileId, data.csv_size)
    } catch (error) {
      console.error('변환 요청 에러:', error)
      // 실패 시 업로드 완료 상태로 롤백
      setUploadedFiles((prev) =>
        prev.map((f) => (f.fileId === fileId ? { ...f, status: 'success' } : f)),
      )
      onConvertError?.(error instanceof Error ? error.message : '변환 요청 실패', fileId)
    }
  }

  // CSV 다운로드 함수
  const downloadCSV = async (fileId: string) => {
    if (!user) return

    try {
      const token = await user.getIdToken()
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:18181'
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''

      const formData = new FormData()
      formData.append('expires_in', '3600') // 1시간

      const response = await fetch(`${apiBaseUrl}/pdf/download/${fileId}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'x-api-key': apiKey,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('다운로드 URL 생성:', data)

        // 새 탭에서 다운로드 URL 열기
        window.open(data.download_url, '_blank')
      } else {
        const errorData = await response.json().catch(() => ({ detail: '다운로드 실패' }))
        console.error('다운로드 에러:', errorData)
        alert(`다운로드 실패: ${errorData.detail || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('다운로드 요청 에러:', error)
      alert('다운로드 요청 중 오류가 발생했습니다.')
    }
  }

  // 상태 확인 함수
  const checkStatus = async (fileId: string) => {
    if (!user) return

    try {
      const token = await user.getIdToken()
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:18181'
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''

      const response = await fetch(`${apiBaseUrl}/pdf/status/${fileId}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'x-api-key': apiKey,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('상태 확인:', data)
        alert(
          `파일 상태: ${data.message}\nPDF 존재: ${data.pdf_exists}\nCSV 존재: ${data.csv_exists}`,
        )
      } else {
        console.error('상태 확인 실패:', response.status)
      }
    } catch (error) {
      console.error('상태 확인 에러:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    console.log('what is this debug 002')
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) handleFiles(files) // FileList 그대로
  }

  function cloneFileList(src: FileList): FileList {
    const anyWin = window as any
    const dt = anyWin.DataTransfer
      ? new anyWin.DataTransfer()
      : anyWin.ClipboardEvent
      ? new anyWin.ClipboardEvent('').clipboardData
      : null

    if (!dt) {
      // 폴백: 새 input을 만들어 강제 복제 (매우 드묾)
      const input = document.createElement('input')
      input.type = 'file'
      // @ts-ignore - FileList는 직접 세팅 불가: 폴백 미지원 브라우저는 배열로 대체
      return src
    }

    Array.from(src).forEach((file) => dt.items.add(file))
    return dt.files
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('what is this debug 001')
    const fileList = e.target.files
    if (fileList && fileList.length > 0) {
      const cloned = cloneFileList(fileList) // ✅ 새 FileList
      handleFiles(cloned) // ✅ 여전히 FileList 타입
    }
    e.target.value = '' // 이제 비워도 cloned는 영향 없음
  }
  const handleFiles = async (files: FileList) => {
    console.log('🚀 handleFiles 시작')
    if (beforeUpload) {
      const ok = await beforeUpload(Array.from(files))
      if (!ok) return // 사용자가 취소했거나 선차감 실패
    }
    const validFiles: File[] = []
    const errors: string[] = []

    // 파일 검증
    Array.from(files).forEach((file) => {
      if (file.type !== 'application/pdf') {
        errors.push(`${file.name}: PDF 파일만 업로드 가능합니다.`)
        toast.error('업로드 불가', { description: errors.join('\n') })
        return
      }

      if (file.size > maxFileSize) {
        errors.push(`${file.name}: 파일 크기가 ${maxFileSize / 1024 / 1024}MB를 초과합니다.`)
        toast.error('업로드 불가', { description: errors.join('\n') })
        return
      }

      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        errors.push(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
        toast.error('업로드 불가', { description: errors.join('\n') })
        return
      }

      validFiles.push(file)
    })

    // 에러가 있으면 표시
    if (errors.length > 0) {
      errors.forEach((error) => {
        console.error(error)
        // 여기에 토스트 알림 등을 추가할 수 있습니다
      })
    }

    console.log('✅ 유효한 파일 개수:', validFiles.length)
    console.log('👤 현재 user:', user)
    console.log('🔒 user 존재 여부:', !!user)

    // 유효한 파일들을 상태에 추가
    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      file,
      id: `${Date.now()}-${file.name}`,
      status: 'pending',
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // 파일 업로드 시작
    console.log('📤 업로드 시작, 파일 개수:', newFiles.length)
    newFiles.forEach((uploadedFile, index) => {
      console.log(`📤 업로드 시작 ${index + 1}/${newFiles.length}:`, uploadedFile.file.name)
      uploadFile(uploadedFile)
    })

    // 기존 콜백 호출
    if (onFileSelect) {
      onFileSelect(files)
    }
  }

  const uploadFile = async (uploadedFile: UploadedFile) => {
    try {
      if (!user) return
      // 업로딩 상태로 변경
      updateFileStatus(uploadedFile.id, 'uploading', 0)

      const formData = new FormData()
      formData.append('file', uploadedFile.file)

      // FastAPI 서버 정보
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
      // 여러 가능한 토큰 키 시도
      const token = await user.getIdToken()

      const xhr = new XMLHttpRequest()

      // 진행률 추적
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          updateFileStatus(uploadedFile.id, 'uploading', percentComplete)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const response = JSON.parse(xhr.responseText)
          updateFileStatus(uploadedFile.id, 'success', 100, response.file_id)
          if (onUploadComplete) {
            onUploadComplete(response.file_id, uploadedFile.file)
          }
        } else {
          const error = `업로드 실패: ${xhr.status}`
          updateFileStatus(uploadedFile.id, 'error', 0, undefined, error)
          if (onUploadError) {
            onUploadError(error, uploadedFile.file)
          }
        }
      }

      xhr.onerror = () => {
        const error = '네트워크 오류가 발생했습니다.'
        updateFileStatus(uploadedFile.id, 'error', 0, undefined, error)
        if (onUploadError) {
          onUploadError(error, uploadedFile.file)
        }
      }

      // FastAPI 서버로 직접 요청
      xhr.open('POST', `${apiBaseUrl}/pdf/upload`)

      // 인증 헤더 설정
      if (token) {
        xhr.setRequestHeader('authorization', `Bearer ${token}`)
      }

      // API 키 헤더 (보조 보안용)
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
      if (apiKey) {
        xhr.setRequestHeader('x-api-key', apiKey)
      }

      xhr.send(formData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      updateFileStatus(uploadedFile.id, 'error', 0, undefined, errorMessage)
      if (onUploadError) {
        onUploadError(errorMessage, uploadedFile.file)
      }
    }
  }

  const updateFileStatus = (
    id: string,
    status: UploadedFile['status'],
    progress: number,
    fileId?: string,
    error?: string,
  ) => {
    setUploadedFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, status, progress, fileId, error } : file)),
    )
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'converted':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'converting':
        return (
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'uploading':
        return (
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card
        className={cn(
          'border-2 border-dashed transition-colors duration-200 hover:border-primary/50',
          isDragOver && 'border-primary bg-primary/5',
        )}
      >
        <CardContent
          className="flex flex-col items-center justify-center p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload PDF Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop your PDF files here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Maximum {maxFiles} files, up to {maxFileSize / 1024 / 1024}MB each
          </p>
          <div className="relative">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploadedFiles.length >= maxFiles}
            />
            <Button disabled={uploadedFiles.length >= maxFiles}>
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 업로드된 파일 목록 - 스크롤 가능 */}
      {uploadedFiles.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-foreground">
              업로드된 파일 ({uploadedFiles.length}/100)
            </h4>
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {uploadedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                >
                  {getStatusIcon(uploadedFile.status)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>

                    {uploadedFile.status === 'uploading' && (
                      <Progress value={uploadedFile.progress} className="mt-1" />
                    )}

                    {uploadedFile.status === 'error' && uploadedFile.error && (
                      <p className="text-xs text-destructive mt-1">{uploadedFile.error}</p>
                    )}

                    {uploadedFile.status === 'success' && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        업로드 완료 - 작업 후 변환 가능
                      </p>
                    )}

                    {uploadedFile.status === 'converting' && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        CSV 변환 중...
                      </p>
                    )}

                    {uploadedFile.status === 'converted' && uploadedFile.csvSize && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        변환 완료 (CSV: {formatFileSize(uploadedFile.csvSize)})
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    {uploadedFile.status === 'success' && uploadedFile.fileId && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => convertToCSV(uploadedFile.fileId!)}
                          className="text-xs px-2 py-1"
                        >
                          변환
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => checkStatus(uploadedFile.fileId!)}
                          className="text-xs px-2 py-1"
                        >
                          상태
                        </Button>
                      </>
                    )}

                    {uploadedFile.status === 'converted' && uploadedFile.fileId && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => downloadCSV(uploadedFile.fileId!)}
                        className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        다운로드
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="flex-shrink-0 px-2 py-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
