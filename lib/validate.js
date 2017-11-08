'use strict'

const moment = require('moment')

module.exports = {

	get_params: function(taskname, format, verbose){

		// Optional
		if (taskname && !is_valid_taskname(taskname)) error('Invalid taskname')
		if (format   && !is_valid_format(format))     error('Invalid format')
		if (verbose  && !is_valid_boolean(verbose))   error('Invalid verbose')
		
		return true
	},

	create_params: function(taskname, taskrun, schedule){

		// Mandatory
		if (!taskname) error('Taskname is required')
		if (!taskrun)  error('Taskrun is required')
		if (!schedule) error('Schedule is required')
		if (!schedule.frequency) error('Frequency schedule option is required')

		if (!is_valid_taskname(taskname)) error('Invalid taskname')
		if (!is_valid_taskrun(taskrun))   error('Invalid taskrun')
		if (!is_valid_frequency(schedule.frequency, schedule.modifier)) error('Invalid frequency or modifier')

		const frequency = schedule.frequency
		const modifier  = schedule.modifier
		const day 	    = schedule.day
		const month     = schedule.month
		const starttime = schedule.starttime
		const endtime   = schedule.endtime
		const every     = schedule.every
		const startdate = schedule.startdate
		const enddate   = schedule.enddate
 
		// Optional
		if (day       && !is_valid_day(day))        error('Invalid day')
		if (month     && !is_valid_month(month))    error('Invalid month')
		if (every     && !is_valid_every(every))    error('Invalid every')
		if (starttime && !is_valid_hour(starttime)) error('Invalid starttime')
		if (endtime   && !is_valid_hour(endtime))   error('Invalid endtime')
		if (startdate && !is_valid_date(startdate)) error('Invalid startdate')
		if (enddate   && !is_valid_date(enddate))   error('Invalid enddate')

		// Invalid combinations
		if ( (starttime || every) && (frequency=='MINUTE' || frequency=='HOURLY')) 
			error('Invalid combination: if there is starttime or every options, frequency cannot be set to minute or hourly')
		if ( endtime && !starttime ) 
			error('Invalid combination: endtime require starttime')

		return true
	},

	update_params: function(taskname, taskrun, schedule, enable){

		// Mandatory
		if (!taskname) error('Taskname is required')
		if(!is_valid_taskname(taskname)) error('Invalid taskname')

		// At least one of
		if (!taskrun && !schedule && !enable) error('At least one of taskrun, schedule or enable is required')

		// Optional
		if (taskrun && !is_valid_taskrun(taskrun)) error('Invalid taskrun')
		if (enable  && !is_valid_boolean(enable))  error('Invalid enable')
		if (schedule){
			if (schedule.every     && !is_valid_every(schedule.every))    error('Invalid every')
			if (schedule.starttime && !is_valid_hour(schedule.starttime)) error('Invalid starttime')
			if (schedule.endtime   && !is_valid_hour(schedule.endtime))   error('Invalid endtime')
			if (schedule.startdate && !is_valid_date(schedule.startdate)) error('Invalid startdate')
			if (schedule.enddate   && !is_valid_date(schedule.enddate))   error('Invalid enddate')
		}

		return true
	},

	taskname: function(taskname){

		if (!taskname || !is_valid_taskname(taskname)) error('Invalid taskname')

		return true
	}
}

function error(msg){
	throw new TypeError(`Task: ${msg}\n`)
}

function is_valid_taskname(taskname){
	return (typeof taskname == 'string') && (taskname.length >= 3)
}

function is_valid_taskrun(taskrun){
	return typeof taskrun == 'string'
}

function is_valid_frequency(frequency, modifier){
	if (! ['MINUTE','HOURLY','DAILY','WEEKLY','MONTHLY'].includes(frequency) )
		return false

	if (modifier){
		if (frequency=='MINUTE'  && (modifier<1 || modifier>1439)) return false
		if (frequency=='HOURLY'  && (modifier<1 || modifier>23))   return false
		if (frequency=='DAILY'   && (modifier<1 || modifier>365))  return false
		if (frequency=='WEEKLY'  && (modifier<1 || modifier>52))   return false
		if (frequency=='MONTHLY' && (modifier<1 || modifier>12))   return false
	}
	return true
}

function is_valid_day(day){
	return ['*','MON','TUE','WED','THU','FRI','SAT','SUN'].includes(day)
}

function is_valid_month(month){
	return ['*','JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].includes(month)
}

function is_valid_hour(hour){
	if (typeof hour != 'string') return false
	return moment(hour, 'HH:mm').isValid()
}

function is_valid_every(every){
	if (typeof every != 'number') return false
	return every>=1 && every<=599940
}	

function is_valid_date(date){
	if (typeof date != 'string') return false
	return moment(date, 'MM/DD/YYYY').isValid()
}

function is_valid_format(format){
	return ['TABLE','LIST','CSV'].includes(format)
}

function is_valid_boolean(boolean){
	return typeof boolean == 'boolean'
}