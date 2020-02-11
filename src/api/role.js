import request from './request'

export function UploadExcel(data) {
  return request({
    url: '/api/v1/uploadexecl',
    method: 'post',
    data
  })
}

export function getEventType() {
  return request({
    url: `/api/v1/getalleventtype`,
    method: 'GET'
  })
}
export function startTransfer(data) {
  return request({
    url: '/api/v1/transfer',
    method: 'post',
    data
  })
}

export function getHistory(data) {
  return request({
    url: '/api/v1/getdatabyeventtype',
    method: 'post',
    data
  })
}

export function getBalance(id) {
  return request({
    url: `/api/v1/getadminbalancebyeventtype/${id}`,
    method: 'GET'
  })
}

export function withDraw(data) {
  return request({
    url: `/api/v1/withdraw`,
    method: 'post',
    data
  })
}

export function downloadFile(data) {
  return request({
    url: `/api/v1/data/download-url?password=${data.password}&fileHash=${data.fileHash}`,
    method: 'GET'
  })
}
