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

    // create an event of task creation
    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    // create an event of task completion
    event TaskCompleted(
        uint id,
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


    // Completed tasks
    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];         // obtain the task that is completed using its _id and store it in _task of datatype Task
        _task.completed = !_task.completed;     // set the opposite of what the task status actually is i.e true->false OR false->true 
        tasks[_id] = _task;     // restore the task which got updated in the mapping
        emit TaskCompleted(_id, _task.completed);      // call the event
    }
}