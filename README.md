# Windows Scheduler
A nodejs wrapper for native windows schtasks command.  
The context under which the tasks runs is setted to SYSTEM user, otherwise every change on a task must be authenticated interactively.  
For Windows XP and Windows Server 2003, or previous, there are options not supported.  
More info [msdn.microsoft.com/Schtasks.exe](https://msdn.microsoft.com/en-us/library/windows/desktop/bb736357(v=vs.85).aspx)

## Usage

#### Install
```javascript
    npm i windows-scheduler
```

#### Test
```javascript
    \some\dir\windows-scheduler\ npm test
```

#### Examples
```javascript
const task = require('windows-scheduler')

// Promise like
task.create('test-task', 'path/to/task.exe', { frequency: 'WEEKLY' })
.then( () => {
    // Do something
})
.catch( (err) => {
    // taskname already exists
    // error during creation
})

// Async-Await like
(async function(){
    try{
        await task.delete('test-task')
    } catch (err) {
        // unexisting taskname
    }
})()
```

#### Schedule examples
```javascript
// every minute during business hours starting from 17th November 2017
await task.create('test', 'run.exe', 
    { 
        frequency: 'MINUTE',
        starttime: '09:00',
        endtime: '18:00',
        startdate: '17/11/2017'
    })

// every 12 days at 13:00 beginning on 31th December 2017
await task.create('test', 'run.exe', 
    { 
        frequency: 'DAILY',
        modifier: 12,
        startdate: '31/12/2017',
        starttime: '13:00'
    })

// every 15 minute during business hours of every 10th of every month
await task.create('test', 'run.exe', 
    { 
        frequency: 'MONTHLY',
        every: 15,
        day: 10,
        starttime: '09:00',
        endtime: '18:00'
    })

// at midnight on mondays of every other week 
await task.create('test', 'run.exe', 
    { 
        frequency: 'WEEKLY',
        modifier: 2,
        day: 'MON',
        starttime: '00:00'
    })
```

## Create
Schedule a new task.
```javascript
function create(taskname, taskrun, schedule) {}
```
```javascript
params {
    taskname : '<string> (required) min length 3',
    taskrun :  '<string> (required) ',
    schedule : {
        frequency : '<string> (required) allowed [MINUTE, HOURLY, DAILY, WEEKLY, MONTHLY]',
        modifier :  '<number> allowed [1439, 23, 365, 52, 12]',
        day :       '<string/number> allowed [*, MON, TUE, WED, THU, FRI, SAT, SUN]',
        month :     '<string> allowed [*, JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC]',
        starttime : '<string> format HH:mm',
        endtime :   '<string> format HH:mm',
        every :     '<number> 1 <= every <=599940',
        startdate : '<string> format DD/MM/YYYY',
        enddate :   '<string> format DD/MM/YYYY'
    }
}
```
Older version of windows can't use params 'every' and 'endtime'.  
The param 'modifier' refines the schedule type to allow for finer control over the schedule recurrence.  
The param 'every' specifies the repetition interval in minutes.  
The param 'day' is a number for 'MONTHLY' frequency, otherwise is 3-letters coded.

## Get
Show one or more scheduled task.
```javascript
function get(taskname, format, verbose) {}
```
```javascript
params {
    taskname : '<string> min length 3',
    format   : '<string> allowed [TABLE, LIST, CSV]',
    verbose  : '<boolean>'
}
```
Older version of windows can't use param 'taskname'.
If noone param is given, it returns all the tasks.

## Update 
Change a scheduled task.
```javascript
function update(taskname, taskrun, schedule, enable) {}
```
```javascript
params {
    taskname : '<string> (required) min length 3',
    taskrun :  '<string> ',
    schedule : {
        starttime : '<string> format HH:mm',
        endtime :   '<string> format HH:mm',
        every :     '<number> 1 <= every <=599940',
        startdate : '<string> format DD/MM/YYYY',
        enddate :   '<string> format DD/MM/YYYY'
    },
    enable :  '<boolean>'
}
```
Older version of windows can use only param 'taskrun'.  
At least one of 'taskrun', 'schedule' or 'enable' must be setted.  

## Delete
Delete a scheduled task.
```javascript
function delete(taskname) {}
```
```javascript
params {
    taskname : '<string> (required) min length 3',
}
```

## Run
Immediately run a scheduled task.
```javascript
function run(taskname) {}
```
```javascript
params {
    taskname : '<string> (required) min length 3',
}
```

## End
Stop a running task.
```javascript
function end(taskname) {}
```
```javascript
params {
    taskname : '<string> (required) min length 3',
}
```

## MIT License

    Copyright (c) 2017 Andrea Franchini

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.