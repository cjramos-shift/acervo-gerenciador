const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const DATE_TIME_FORMAT = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' })

export const formatDate = (isoDate: string) => DATE_FORMAT.format(new Date(isoDate))

export const formatDateTime = (isoDate: string) => DATE_TIME_FORMAT.format(new Date(isoDate))
