class AutonomousBusinessAgent {
    constructor() {
        this.state = 'idle'; // idle, planning, executing, completed, error
        this.currentTask = null;
        this.taskId = 0;
        this.executionLogs = [];
        this.planningSteps = [];
        this.results = null;
    }

    async deploy(task) {
        this.taskId++;
        this.currentTask = task;
        this.state = 'planning';
        this.executionLogs = [];
        
        try {
            // Step 1: Multi-step Reasoning & Task Planning
            await this.createTaskPlan();
            
            // Step 2: Execute each step
            await this.executePlan();
            
            // Step 3: Generate final results
            this.generateResults();
            this.state = 'completed';
            
            return this.results;
        } catch (error) {
            this.state = 'error';
            this.log(`❌ ERROR: ${error.message}`, 'error');
            throw error;
        }
    }

    async createTaskPlan() {
        this.log(`🧠 Starting multi-step reasoning for: "${this.currentTask}"`, 'info');
        
        // Intelligent task decomposition based on business domain
        const plan = this.generateBusinessPlan();
        this.planningSteps = plan.steps;
        
        this.log(`📋 Generated ${plan.steps.length} step plan`, 'success');
        this.updatePlanningUI();
    }

    generateBusinessPlan() {
        const task = this.currentTask.toLowerCase();
        
        // Domain-specific planning logic
        if (task.includes('marketing') || task.includes('strategy')) {
            return {
                steps: [
                    { id: 1, title: 'Market Research', desc: 'Analyze target market & competitors' },
                    { id: 2, title: 'Customer Analysis', desc: 'Identify customer segments & pain points' },
                    { id: 3, title: 'Strategy Development', desc: 'Create positioning & messaging' },
                    { id: 4, title: 'Channel Selection', desc: 'Choose optimal marketing channels' },
                    { id: 5, title: 'Budget Planning', desc: 'Allocate resources & set KPIs' }
                ]
            };
        } 
        else if (task.includes('sales') || task.includes('pipeline')) {
            return {
                steps: [
                    { id: 1, title: 'Lead Analysis', desc: 'Qualify leads & prioritize' },
                    { id: 2, title: 'Sales Process Mapping', desc: 'Define sales stages & criteria' },
                    { id: 3, title: 'Objection Handling', desc: 'Prepare responses to common objections' },
                    { id: 4, title: 'Closing Strategy', desc: 'Develop winning close techniques' },
                    { id: 5, title: 'Pipeline Forecasting', desc: 'Predict revenue & optimize' }
                ]
            };
        }
        else if (task.includes('product') || task.includes('launch')) {
            return {
                steps: [
                    { id: 1, title: 'Market Validation', desc: 'Validate product-market fit' },
                    { id: 2, title: 'Feature Prioritization', desc: 'Rank features by value/impact' },
                    { id: 3, title: 'Pricing Strategy', desc: 'Set optimal pricing model' },
                    { id: 4, title: 'Go-to-Market Plan', desc: 'Plan launch sequence & messaging' },
                    { id: 5, title: 'Success Metrics', desc: 'Define KPIs & tracking' }
                ]
            };
        }
        else {
            // Generic business plan
            return {
                steps: [
                    { id: 1, title: 'Problem Analysis', desc: 'Define core business problem' },
                    { id: 2, title: 'Opportunity Assessment', desc: 'Identify growth opportunities' },
                    { id: 3, title: 'Strategy Formulation', desc: 'Develop action plan' },
                    { id: 4, title: 'Resource Allocation', desc: 'Assign budget & team' },
                    { id: 5, title: 'Execution & Monitoring', desc: 'Launch with tracking' }
                ]
            };
        }
    }

    async executePlan() {
        this.state = 'executing';
        
        for (let i = 0; i < this.planningSteps.length; i++) {
            const step = this.planningSteps[i];
            this.log(`🔄 Executing Step ${step.id}: ${step.title}`, 'info');
            
            // Update UI
            this.updatePlanningUI();
            this.updateProgressUI(i);
            
            // Simulate intelligent execution
            const result = await this.executeStep(step);
            step.result = result;
            
            this.log(`✅ Step ${step.id} completed: ${result.summary}`, 'success');
            
            // Random delay to simulate real work
            await this.sleep(800 + Math.random() * 1200);
        }
    }

    async executeStep(step) {
        // Simulate business intelligence execution
        await this.sleep(500);
        
        return {
            summary: `Successfully completed ${step.title.toLowerCase()}`,
            data: this.generateStepData(step),
            metrics: {
                confidence: Math.floor(85 + Math.random() * 15),
                impact: Math.floor(70 + Math.random() * 30)
            }
        };
    }

    generateStepData(step) {
        const data = {
            1: 'Market size: $2.5B, Growth: 28%, Competitors: 15 active',
            2: 'Primary segment: SMBs (65%), Pain points: Cost, Complexity',
            3: 'Positioning: "Simple SaaS for SMBs", USP: 5x faster setup',
            4: 'Best channels: LinkedIn (40%), Content (30%), Email (20%)',
            5: 'Budget: $50K, KPIs: 200 leads, 15% conversion'
        };
        return data[step.id] || 'Comprehensive analysis completed';
    }

    generateResults() {
        this.results = {
            taskId: this.taskId,
            task: this.currentTask,
            completedAt: new Date().toLocaleString(),
            summary: `Successfully executed ${this.planningSteps.length} step business plan`,
            keyMetrics: {
                totalSteps: this.planningSteps.length,
                successRate: '100%',
                estimatedROI: '320%',
                confidence: '94%'
            },
            deliverables: this.planningSteps.map(step => ({
                step: step.title,
                result: step.result.summary,
                metrics: step.result.metrics
            }))
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            id: this.executionLogs.length + 1,
            timestamp,
            message,
            type
        };
        this.executionLogs.unshift(logEntry);
        
        // Update UI
        this.updateLogsUI();
        document.getElementById('log-count').textContent = `(${this.executionLogs.length})`;
    }

    // UI Update Methods
    updatePlanningUI() {
        const container = document.getElementById('planning-steps');
        container.innerHTML = this.planningSteps.map(step => `
            <div class="step-item ${step.result ? 'completed' : ''}">
                <strong>Step ${step.id}: ${step.title}</strong>
                <p>${step.desc}</p>
                ${step.result ? `<div style="margin-top: 8px; font-size: 12px; color: #4ade80;">
                    ✅ ${step.result.summary}<br>
                    Confidence: ${step.result.metrics.confidence}% | Impact: ${step.result.metrics.impact}%
                </div>` : ''}
            </div>
        `).join('');
    }

    updateProgressUI(currentStep) {
        const totalSteps = this.planningSteps.length;
        const progress = ((currentStep + 1) / totalSteps) * 100;
        
        document.getElementById('execution-progress').innerHTML = `
            <div class="progress-item">
                <span>Step ${currentStep + 1} of ${totalSteps}</span>
                <span>${Math.round(progress)}% Complete</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        `;
    }

    updateLogsUI() {
        const container = document.getElementById('execution-logs');
        container.innerHTML = this.executionLogs.slice(0, 20).map(log => `
            <div class="log-entry ${log.type}">
                <strong>[${log.timestamp}]</strong> ${log.message}
            </div>
        `).join('');
        container.scrollTop = 0;
    }

    updateResultsUI() {
        const container = document.getElementById('final-results');
        if (this.results) {
            container.innerHTML = `
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #4ade80;">🎉 Mission Accomplished!</h2>
                    <p>Task #${this.results.taskId} completed successfully</p>
                </div>
                <div style="display: grid; gap: 15px;">
                    ${this.results.deliverables.map(deliverable => `
                        <div style="background: rgba(255,255,255,0.08); padding: 15px; border-radius: 10px;">
                            <strong>${deliverable.step}</strong><br>
                            ${deliverable.result}<br>
                            <small style="color: #4ade80;">
                                Confidence: ${deliverable.metrics.confidence}% | Impact: ${deliverable.metrics.impact}%
                            </small>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 25px; padding: 20px; background: rgba(74,222,128,0.2); border-radius: 12px; text-align: center;">
                    <strong>📊 Key Metrics:</strong><br>
                    ROI: ${this.results.keyMetrics.estimatedROI} | Success Rate: ${this.results.keyMetrics.successRate}
                </div>
            `;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Status updates for global UI
    updateGlobalStatus(status, message = '') {
        const statusEl = document.getElementById('agent-status');
        this.state = status;
        
        const statusMap = {
            'idle': { icon: 'fa-circle', color: '#888' },
            'planning': { icon: 'fa-brain', color: '#f59e0b' },
            'executing': { icon: 'fa-cogs', color: '#00d4ff' },
            'completed': { icon: 'fa-check-circle', color: '#4ade80' },
            'error': { icon: 'fa-exclamation-triangle', color: '#ef4444' }
        };
        
        const config = statusMap[status];
        statusEl.innerHTML = `
            <i class="fas ${config.icon}" style="color: ${config.color}"></i> 
            ${status.charAt(0).toUpperCase() + status.slice(1)}${message ? ': ' + message : ''}
        `;
    }
}

// Global Agent Instance
window.AutonomousAgent = new AutonomousBusinessAgent();