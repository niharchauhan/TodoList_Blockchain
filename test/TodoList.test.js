// chai is used for testing
const { assert } = require("chai")

// write the tasks to ensure that contract was initialized properly and we can list out the tasks
const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
    before(async ()=> {
        this.todoList = await TodoList.deployed()
    })

    it('deploys successfully', async () => {
        // address should not be 0, empty, null, undefined
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('list tasks', async() => {
        // task id retrieved is same as the id which it actually belongs to 
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.content, 'Check out google.com')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
    })

    it('creates tasks', async() => {
        const result = await this.todoList.createTask('A new Task')
        const taskCount = await this.todoList.taskCount()
        assert.equal(taskCount, 2)
        const event = result.logs[0].args       // args has task id, content and completed status
        //console.log(result)
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new Task')
        assert.equal(event.completed, false)
    })

    it('toggles task completion', async() => {
        const result = await this.todoList.toggleCompleted(1)
        const task = await this.todoList.tasks(1)
        assert.equal(task.completed, true)
        const event = result.logs[0].args       // args has task id, content and completed status
        //console.log(result)
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
    })
})