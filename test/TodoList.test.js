// const { assert } = require("chai")

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
        assert.equal(task.content, 'Check out dappuniversity.com')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
    })
})