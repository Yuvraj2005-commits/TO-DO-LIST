document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addbtn = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");
    const dustbin = document.querySelector("#dustbin");
    const progressBar = document.getElementById("progress");
    const numberDisplay = document.getElementById("number");

    const updateStats = () => {
        const totalTasks = todoList.children.length;
        const completedTasks = todoList.querySelectorAll('li.completed').length;
        const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        
        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        
        // Update numbers display
        if (numberDisplay) {
            numberDisplay.textContent = `${completedTasks}/${totalTasks}`;
        }
    };

    const toggleemptyList = () => {
        // Show dustbin when list is empty, hide when there are tasks
        dustbin.style.display = todoList.children.length === 0 ? "block" : "none";
        updateStats();
    }

    const savetaskatlocalstorage = () => {
        const tasks=Array.from(tasklist.querySelectorAll("li")).map((li) => {
            return {
                text: li.querySelector(".task-text").textContent,
                completed: li.classList.contains("completed"),
            };
        })
    } 
    
    const addtask = (event) => {
        event.preventDefault();
        const tasktext = taskInput.value.trim();
        if (!tasktext) {
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" class="checkbox">
          <span class="task-text">${tasktext}</span>
          <button class="edit-btn"><i class="fa-solid fa-edit"></i></button>
          <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        `;

        // Add event listeners to the new task
        const checkbox = li.querySelector('.checkbox');
        const taskTextSpan = li.querySelector('.task-text');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        
        // Toggle completed state
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            updateStats(); // Update stats when task is checked/unchecked
            savetaskatlocalstorage();
        });
        
        // Edit task functionality
        editBtn.addEventListener('click', () => {
            const currentText = taskTextSpan.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-input';
            
            // Replace span with input
            taskTextSpan.style.display = 'none';
            li.insertBefore(input, editBtn);
            input.focus();
            
            // Save on Enter or blur
            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText && newText !== currentText) {
                    taskTextSpan.textContent = newText;
                }
                taskTextSpan.style.display = 'inline';
                input.remove();
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                } else if (e.key === 'Escape') {
                    taskTextSpan.style.display = 'inline';
                    input.remove();
                }
            });
        });
        
        // Delete individual task
        deleteBtn.addEventListener('click', () => {
            li.remove();
            toggleemptyList();
        });

        todoList.appendChild(li);
        taskInput.value = "";
        toggleemptyList();
    }
    
    addbtn.addEventListener("click", addtask);
    
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addtask(e);
        }
    });
    
    // Initialize the empty state on page load
    toggleemptyList();
});