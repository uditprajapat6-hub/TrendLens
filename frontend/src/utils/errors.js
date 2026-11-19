export function parseApiError(err, defaultMsg = 'An unexpected error occurred.') {
  if (!err) return defaultMsg
  if (!err.response) {
    return 'Unable to reach the server. It may be waking up or offline. Please wait 30 seconds and try again.'
  }

  const detail = err.response?.data?.detail
  if (typeof detail === 'string') {
    return detail
  }
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item
        if (item?.msg) {
          const field = item.loc ? item.loc[item.loc.length - 1] : ''
          return field ? `${field}: ${item.msg}` : item.msg
        }
        return JSON.stringify(item)
      })
      .join(', ')
  }
  if (typeof detail === 'object' && detail !== null) {
    return detail.msg || JSON.stringify(detail)
  }

  return err.message || defaultMsg
}
