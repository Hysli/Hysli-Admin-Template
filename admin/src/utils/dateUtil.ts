import { format } from 'date-fns'

const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
const DATE_FORMAT = 'yyyy-MM-dd '

export function formatToDateTime(date: Date | number, formatStr = DATE_TIME_FORMAT): string {
	return format(date, formatStr)
}

export function formatToDate(date: Date | number, formatStr = DATE_FORMAT): string {
	return format(date, formatStr)
}

export function addDaysByNow(days, formatStr = DATE_FORMAT) {
	if (days == null || days == undefined) return null

	const _date = new Date()
	const newDate = _date.setDate(_date.getDate() + days)
	return format(newDate, formatStr)
}
