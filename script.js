document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('business-task');
    const startBtn = document.getElementById('start-agent-btn');
    const agentStatus = document.getElementById('agent-status');

    startBtn.addEventListener('click', deployAgent);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !startBtn.disabled) {
            deployAgent();
        }
    });

    async function deployAgent() {
        const task = taskInput.value.trim();
        if (!task) {
            alert('Please enter a business task!');
            return;
        }

        // Disable input during execution
        taskInput.disabled = true;
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executing...';

        window.AutonomousAgent.updateGlobalStatus('planning');

        try {
            await window.AutonomousAgent.deploy(task);
            window.AutonomousAgent.updateResultsUI();
        } catch (error) {
            document.getElementById('final-results').innerHTML = `
                <div style="color: #ef4444; text-align: center; padding: 30px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                    <h2>Agent Encountered an Error</h2>
                    <p>${error.message}</p>
                </div>
            `;
        } finally {
            // Re-enable input
            taskInput.disabled = false;
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="fas fa-rocket"></i> Deploy Agent';
        }
    }

    // Welcome message
    setTimeout(() => {
        agentStatus.innerHTML = '<i class="fas fa-circle"></i> Ready to transform your business';
    }, 500);

    // Example tasks
    const exampleTasks = [
        'Create marketing strategy for SaaS product',
        'Build sales pipeline for B2B software',
        'Plan product launch strategy',
        'Optimize pricing for e-commerce store'
    ];

    taskInput.placeholder = exampleTasks[Math.floor(Math.random() * exampleTasks.length)];
});