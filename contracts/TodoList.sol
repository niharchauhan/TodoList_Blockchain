pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    // Model the tasks
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;     // map each task by its id

    // create an event
    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    // whenever the smart contract is deployed this task will be shown by default
    constructor() public {
        createTask("Check out google.com");
    }

    // create task by passing the content of the task
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);        // add the tasks to hash map
        emit TaskCreated(taskCount, _content, false);           // call the event
    } 
}