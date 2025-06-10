document.addEventListener("DOMContentLoaded", () => {
            const taskInput = document.getElementById("task-input");
            const addBtn = document.getElementById("add-btn");
            const todoList = document.getElementById("todo-list");
            const dustbin = document.querySelector("#dustbin");
            const progressBar = document.getElementById("progress");
            const numberDisplay = document.getElementById("number");

            // Load tasks from localStorage on page load
            const loadTasksFromStorage = () => {
                const savedTasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
                savedTasks.forEach(task => {
                    addTaskToDOM(task.text, task.completed);
                });
                updateStats();
                toggleEmptyList();
            };

            const saveTasksToStorage = () => {
                const tasks = Array.from(todoList.querySelectorAll("li")).map((li) => {
                    return {
                        text: li.querySelector(".task-text").textContent,
                        completed: li.classList.contains("completed"),
                    };
                });
                localStorage.setItem('todoTasks', JSON.stringify(tasks));
            };

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

            const toggleEmptyList = () => {
                // Show dustbin when list is empty, hide when there are tasks
                dustbin.style.display = todoList.children.length === 0 ? "block" : "none";
            };

            const addTaskToDOM = (taskText, isCompleted = false) => {
                const li = document.createElement("li");
                if (isCompleted) {
                    li.classList.add('completed');
                }
                
                li.innerHTML = `
                    <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
                    <span class="task-text">${taskText}</span>
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
                    updateStats();
                    saveTasksToStorage();
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
                    input.select();
                    
                    // Save on Enter or blur
                    const saveEdit = () => {
                        const newText = input.value.trim();
                        if (newText && newText !== currentText) {
                            taskTextSpan.textContent = newText;
                            saveTasksToStorage();
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
                    updateStats();
                    toggleEmptyList();
                    saveTasksToStorage();
                });

                todoList.appendChild(li);
            };
            
            const addTask = (event) => {
                event.preventDefault();
                const taskText = taskInput.value.trim();
                if (!taskText) {
                    return;
                }

                addTaskToDOM(taskText);
                taskInput.value = "";
                updateStats();
                toggleEmptyList();
                saveTasksToStorage();
            };
            
            addBtn.addEventListener("click", addTask);
            
            taskInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    addTask(e);
                }
            });
            
            // Initialize the app
            loadTasksFromStorage();
        });
