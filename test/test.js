'use strict'

const chai   = require('chai')
const expect = chai.expect
const task   = require('../task')

describe('Task', function(){

	this.timeout(5000)

	describe('create()', function(){

		it('Create a task with correct params', function(done){
			task.create('test', 'run.exe', {frequency: 'MONTHLY'})
			.then( () => {
				done()
			})
			.catch( () => {})
		})
		it('Throw trying to create with same name', function(done){
			task.create('test', 'run.exe', {frequency: 'MONTHLY'})
			.then( () => {})
			.catch( async function() {
				await task.delete('test')
				done()
			})
		})
		it('Throw trying to create with incorrect param number', function(done){
			task.create('newtest', 'run.exe')
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})
		it('Throw trying to create with incorrect taskname', function(done){
			task.create('aa', 'run.exe', {frequency: 'MONTHLY'})
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})
		it('Throw trying to create with incorrect schedule', function(done){
			task.create('newtest', 'run.exe', {frcy: 'MONTHLY'})
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})
		it('Throw trying to create with incorrect frequency', function(done){
			task.create('newtest', 'run.exe', {frequency: 'MOHLY'})
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})
		it('Throw trying to create with incorrect options combination', function(done){
			task.create('newtest', 'run.exe', {frequency: 'MINUTE', every: 5})
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})

		describe('Complex schedule', function(){

			it('every minute during business hours starting from 17th November 2017', async function(){
				await task.create('test', 'run.exe', 
				    { 
				        frequency: 'MINUTE',
				        starttime: '09:00',
				        endtime: '18:00',
				        startdate: '17/11/2017'
				    })
				await task.delete('test')
			})

			it('every 12 days at 13:00 beginning on 31th December 2017', async function(){
				await task.create('test', 'run.exe', 
				    { 
				        frequency: 'DAILY',
				        modifier: 12,
				        startdate: '31/12/2017',
				        starttime: '13:00'
				    })
				await task.delete('test')
			})

			it('every 15 minute during business hours of every 10th of every month', async function(){
				await task.create('test', 'run.exe', 
				    { 
				        frequency: 'MONTHLY',
				        every: 15,
				        day: 10,
				        starttime: '09:00',
				        endtime: '18:00'
				    })
				await task.delete('test')
			})

			it('at midnight on mondays of every other week', async function(){
				await task.create('test', 'run.exe', 
				    { 
				        frequency: 'WEEKLY',
				        modifier: 2,
				        day: 'MON',
				        starttime: '00:00'
				    })
				await task.delete('test')
			})
		})
	})

	describe('get()', function(){

		it('Show all task with no params', function(done){
			task.get()
			.then( () => {
				done()
			})
			.catch( () => {})
		})
		it('Show all task with format', function(done){
			task.get(null, 'TABLE')
			.then( () => {
				done()
			})
			.catch( () => {})
		})
		it('Throw trying to show all task with incorrect format', function(done){
			task.get(null, 'PDF')
			.then( () => {})
			.catch( () => {
				done()
			})
		})
		it('Show an existing task with given taskname', async function(){
			await task.create('test', 'run.exe', {frequency: 'MONTHLY'})
			await task.get('test')
			await task.delete('test')
		})
		it('Throw trying to get unexisting taskname', function(done){
			task.get('test')
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})

	})

	describe('update()', function(){

		it('Change task run-file with correct params', async function(){

			await task.create('test', 'run.exe', {frequency: 'MONTHLY'})
			await task.update('test', 'newrun.exe')
			await task.delete('test')

		})
		it('Throw trying to update unexisting task', function(done){
			task.update('test', 'newrun.exe')
			.then( () => {})
			.catch( () => {
				done()
			})
		})

	})

	describe('delete()', function(){

		it('Delete an existing task with taskname', async function(){
			await task.create('test', 'run.exe', {frequency: 'MONTHLY'})
			await task.delete('test')
		})
		it('Throw trying to delete unexisting taskname', function(done){
			task.get('test')
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})

	})

	describe('run()', function(){

		it('Istant run an existing task with taskname', async function(){
			await task.create('test', 'run.exe', {frequency: 'MONTHLY'})
			await task.run('test')
			await task.delete('test')
		})
		it('Throw trying to run unexisting taskname', function(done){
			task.run('test')
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})

	})

	describe('end()', function(){

		it('Stop an existing task with taskname', async function(){
			await task.create('test', 'run.exe', {frequency: 'MONTHLY'})
			await task.end('test')
			await task.delete('test')
		})
		it('Throw trying to stop unexisting taskname', function(done){
			task.end('test')
			.then( () => {})
			.catch( (err) => {
				done()
			})
		})

	})

})