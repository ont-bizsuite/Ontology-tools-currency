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
    url: `/api/v1/getevtty`,
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

export function getBalance(data) {
  return request({
    url: `/api/v1/getadminbalance/${data.eventType}/${data.netType}`,
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

export function queryTableData(data) {
  return request({
    url: `/api/v1/getexcelparam/${data.eventType}/${data.netType}/${data.pageNum}/${data.pageSize}`,
    method: 'GET'
  })
}

export function queryTransferProgress(params) {
  return request({
    url: `/api/v1/gettransferprogress/${params.eventType}/${params.netType}`,
    method: 'GET'
  })
}

export function getHistoryInfo(data) {
  return request({
    url: `/api/v1/gettxinfo/${data.eventType}/${data.netType}/${data.pageNum}/${data.pageSize}/${data.status}`,
    method: 'GET'
  })
}
