App = {
    loading: false,
    contracts : {},

    load : async() => {
        await App.loadWeb3()           // load Web3 library in order to connect blockchain
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // web3.js library will help connect to blockchain, to read and write data from blockchain
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
        } else {
        window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

    // Load the account with metamask that we are connected with i.e first account from genache
    loadAccount: async () => {
        App.account = web3.eth.accounts[0]
        //console.log(App.account)
    },

    // load out the smart contract from blockchain, it will be the todolist where we list out the tasks
    loadContract: async() => {
        // Create a JavaScript version of the smart contract
        // to call the functions we write in the smart contract
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        // i.e getting values from blockchain
        App.todoList = await App.contracts.TodoList.deployed()
    },

    // Render the metamask account in the browser
    render : async() => {
        // Prevent double render
        if (App.loading) {
            return
        }
  
        // Update app loading state
        App.setLoading(true)
  
        // Render Account
        $('#account').html(App.account)

        // Render Tasks
        await App.renderTasks()     // after rendering account, render the tasks
  
        // Update loading state
        App.setLoading(false)
    },

    // rendering tasks from blockchain
    renderTasks: async () => {
        // Load the total task count from the blockchain
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')
    
        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
            // Fetch the task data from the blockchain
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]
    
            // Create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            .on('click', App.toggleCompleted)
    
            // Put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
    
            // Show the task
            $newTaskTemplate.show()
        }
    },    

    // create a new task
    createTask : async() => {
        App.setLoading(true);       // set loading to true
        const content = $('#newTask').val()     // fetch the content from textbox which has id newTask and store in content
        await App.todoList.createTask(content)      // pass the content in createTask() which is in smart contract
        window.location.reload()        // reload the browser to fetch all the tasks
    },

    // Loading.. effect 
    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        }  else {
            loader.hide()
            content.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})