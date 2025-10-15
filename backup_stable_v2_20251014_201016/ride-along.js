/**
 * UEMP Operations Hub V2 - Ride Along Report Tool
 * Handles the complete ride-along evaluation process
 */

// ========================================
// Ride Along State Management
// ========================================

class RideAlongState {
    constructor() {
        this.driverName = '';
        this.trainerName = '';
        this.currentStep = 0;
        this.evaluationData = {};
        this.questions = [
            // 1. Driving Aptitudes
            {
                id: 'driving',
                title: 'Driving Aptitudes',
                question: 'Driving Aptitudes',
                options: [
                    { value: 'good', label: '✅ Good driver: full stops, speed limits, follows traffic rules.' },
                    { value: 'mid', label: '🔧 Drives well, but has some minor bad habits; needs coaching.' },
                    { value: 'bad', label: '❌ Weak driver: ignores stops, speeds, breaks traffic rules.' }
                ]
            },
            // 3. Van Organization
            {
                id: 'organize_van',
                title: 'Van Organization',
                question: 'Van Organization',
                options: [
                    { value: 'good', label: '✅ Understands the importance of being organized with both overflows and bags.' },
                    { value: 'mid', label: '🔧 Understands the importance of being organized, but needs more practice.' },
                    { value: 'bad', label: '❌ Does not understand the importance of being organized.' }
                ]
            },
            // 4. Bag vs Overflows
            {
                id: 'bag_overflow',
                title: 'Bag vs Overflows',
                question: 'Bag vs Overflows',
                options: [
                    { value: 'good', label: '✅ Understands the difference between packages in a bag and overflows.' },
                    { value: 'mid', label: '🔧 Partial understanding of the difference between packages in a bag and overflows.' },
                    { value: 'bad', label: '❌ Confuses packages in a bag and overflows; wastes time searching wrong places.' }
                ]
            },
            // 5. Flex App Usage
            {
                id: 'flex',
                title: 'Flex App Usage',
                question: 'Flex App Usage',
                options: [
                    { value: 'good', label: '✅ Good understanding of the Amazon Flex app.' },
                    { value: 'mid', label: '🔧 Needs time to get used to the Amazon Flex app.' },
                    { value: 'bad', label: '❌ Limited understanding of the Amazon Flex app.' }
                ]
            },
            // 6. Picture on Delivery
            {
                id: 'photos',
                title: 'Picture on Delivery',
                question: 'Picture on Delivery',
                options: [
                    { value: 'good', label: '✅ Takes clear pictures on deliveries.' },
                    { value: 'mid', label: '🔧 Occasionally takes unclear or poor pictures.' },
                    { value: 'bad', label: '❌ Consistently takes unclear or poor pictures.' }
                ]
            },
            // 7. Customer Instructions
            {
                id: 'customer_instructions',
                title: 'Customer Instructions',
                question: 'Customer Instructions',
                options: [
                    { value: 'good', label: '✅ Follows all customer instructions.' },
                    { value: 'mid', label: '🔧 Follows most customer instructions with minor issues.' },
                    { value: 'bad', label: '❌ Consistently ignores customer instructions.' }
                ]
            },
            // 8. House Deliveries
            {
                id: 'house_deliveries',
                title: 'House Deliveries',
                question: 'House Deliveries',
                options: [
                    { value: 'good', label: '✅ Doesn\'t get confused by stops with multiple locations.' },
                    { value: 'mid', label: '🔧 Sometimes gets confused by stops with multiple locations.' },
                    { value: 'bad', label: '❌ Doesn\'t understand stops with multiple locations and risks deliverying to the wrong houses/addresses.' }
                ]
            },
            // 9. Building Deliveries
            {
                id: 'building_deliveries',
                title: 'Building Deliveries',
                question: 'Building Deliveries',
                options: [
                    { value: 'good', label: '✅ Understands how to handle building deliveries: door to door, package rooms, receptionists.' },
                    { value: 'mid', label: '🔧 Needs more practice with building deliveries.' },
                    { value: 'bad', label: '❌ Dislikes building deliveries and complains about having to go upstairs door to door.' }
                ]
            },
            // 10. Delivery Speed
            {
                id: 'delivery_speed',
                title: 'Delivery Speed',
                question: 'Delivery Speed',
                options: [
                    { value: 'good', label: '✅ Delivers quickly: photo and go.' },
                    { value: 'mid', label: '🔧 Delivery speed is average; some extra time at stops.' },
                    { value: 'bad', label: '❌ Delivers slowly; spends extra time at stops.' }
                ]
            },
            // 11. Identify Addresses
            {
                id: 'identify_addresses',
                title: 'Identify Addresses',
                question: 'Identify Addresses',
                options: [
                    { value: 'good', label: '✅ Identifies the correct addresses without difficulty.' },
                    { value: 'mid', label: '🔧 Occasionally struggles with identifying the correct addresses.' },
                    { value: 'bad', label: '❌ Constantly struggles with identifying the correct addresses.' }
                ]
            },
            // 12. Map/GPS Skills
            {
                id: 'gps',
                title: 'Map/GPS Skills',
                question: 'Map/GPS Skills',
                options: [
                    { value: 'good', label: '✅ Good map/GPS skills.' },
                    { value: 'mid', label: '🔧 Needs improvement on map/GPS skills.' },
                    { value: 'bad', label: '❌ Poor map/GPS skills.' }
                ]
            },
            // 13. Undeliverable Packages
            {
                id: 'mark_undeliverable',
                title: 'Undeliverable Packages',
                question: 'Undeliverable Packages',
                options: [
                    { value: 'good', label: '✅ Knows how to mark undeliverable packages correctly (e.g., damage, missing, business closed).' },
                    { value: 'mid', label: '🔧 Needs some guidance on marking undeliverable packages.' },
                    { value: 'bad', label: '❌ Doesn\'t know how to mark a package as undeliverable or attempted.' }
                ]
            },
            // 14. Proper Parking Sequence
            {
                id: 'parking',
                title: 'Proper Parking Sequence',
                question: 'Proper Parking Sequence',
                options: [
                    { value: 'good', label: '✅ Knows and follows the proper parking sequence.' },
                    { value: 'mid', label: '🔧 Occasionally misses the proper parking sequence.' },
                    { value: 'bad', label: '❌ Ignores the proper parking sequence or seems reluctant to learn it.' }
                ]
            },
            // 15. Special Deliveries Experience
            {
                id: 'handled_challenges',
                title: 'Special Deliveries Experience',
                question: 'Special Deliveries Experience',
                options: [
                    { value: 'good', label: '✅ Had the chance to experience special deliveries (lockers or OTP deliveries).' },
                    { value: 'mid', label: '🔧 Did not experience special deliveries.' }
                ]
            },
            // 16. Gas Card & Powered by Amazon App
            {
                id: 'gas_card',
                title: 'Gas Card & Powered by Amazon App',
                question: 'Gas Card & Powered by Amazon App',
                options: [
                    { value: 'good', label: '✅ Knows how to use the gas card and Powered by Amazon app.' },
                    { value: 'mid', label: '🔧 Needs more guidance on using the gas card and Powered by Amazon app.' },
                    { value: 'bad', label: '❌ Didn\'t get the chance to use the gas card and Powered by Amazon app.' }
                ]
            },
            // 17. Timecard Editing
            {
                id: 'time_card',
                title: 'Timecard Editing',
                question: 'Timecard Editing',
                options: [
                    { value: 'good', label: '✅ Knows how to edit timecard and meal period times.' },
                    { value: 'mid', label: '🔧 Needs more guidance on editing timecard and meal period times.' },
                    { value: 'bad', label: '❌ Struggles to edit timecard and meal period times.' }
                ]
            },
            // 18. Customer Treatment
            {
                id: 'polite',
                title: 'Customer Treatment',
                question: 'Customer Treatment',
                options: [
                    { value: 'good', label: '✅ Polite and respectful with customers.' },
                    { value: 'mid', label: '🔧 Not always polite or respectful with customers.' }
                ]
            },
            // 19. Language Challenges
            {
                id: 'language',
                title: 'Language Challenges',
                question: 'Language Challenges',
                options: [
                    { value: 'good', label: '✅ No language challenges noted.' },
                    { value: 'mid', label: '🔧 Minor language challenges.' },
                    { value: 'bad', label: '❌ Language Barrier.' }
                ]
            },
            // 20. Driver Feelings
            {
                id: 'driver_feeling',
                title: 'Driver Feelings',
                question: 'Driver Feelings',
                isEmoji: true,
                options: [
                    { value: 'overwhelmed', label: '😵‍💫 Feels overwhelmed about the job.' },
                    { value: 'happy', label: '😊 Feels happy about the job.' },
                    { value: 'confident', label: '💪 Feels confident about the job.' },
                    { value: 'challenged', label: '🏆 Feels challenged in a positive way.' },
                    { value: 'good_mental', label: '👍 Good mindset and attitude.' },
                    { value: 'bad_mental', label: '👎 Bad mindset/ poor attitude.' }
                ]
            },
            // 21. Overall Comment
            {
                id: 'overall_comment',
                title: 'Overall Comment',
                question: 'Overall Comment',
                isEmoji: true,
                options: [
                    { value: 'killed_it', label: '🔥 Killed it today' },
                    { value: 'struggled', label: '🙈 Struggled today' },
                    { value: 'had_easy', label: '😎 Had it easy today' },
                    { value: 'pushed_through', label: '🫡 Pushed through it today' },
                    { value: 'did_amazing', label: '🤩 Did amazing today' },
                    { value: 'had_fun', label: '🤪 Had fun today' },
                    { value: 'did_crazy', label: '🥶 Did crazy good today' },
                    { value: 'overwhelmed_today', label: '🫨 Overwhelmed today' },
                    { value: 'did_good', label: '🤘🏼 Did good today' }
                ]
            },
            // 22. First Day Experience Issues
            {
                id: 'first_day_issues',
                title: 'First Day Experience Issues',
                question: 'First Day Experience Issues (Select all that apply)',
                isMultiple: true,
                hasInput: true,
                inputLabel: 'Describe the issue',
                inputId: 'custom-issue',
                options: [
                    { value: 'morning_van_issues', label: '⚠️ Faced issues with the van.' },
                    { value: 'equipment_issues', label: '⚠️ Faced issues with equipment (phone, etc.).' },
                    { value: 'route_issues', label: '⚠️ Faced issues with the route (awful route, bad sequencing, etc.).' },
                    { value: 'only_buildings', label: '⚠️ Had an only buildings route.' },
                    { value: 'not_nursery', label: '⚠️ Had to do a non-nursery route on the first day.' },
                    { value: 'custom_issue', label: '⚠️ Other issue (describe below)' }
                ]
            },
            // 23. Driver Confidence
            {
                id: 'feels_ready',
                title: 'Driver Confidence',
                question: 'Does the driver feel ready and confident to go solo?',
                options: [
                    { value: 'yes', label: '🥶 Driver feels ready and confident to go solo next day' },
                    { value: 'no', label:  '😟 Driver doesn\'t feel ready or confident to go alone yet' }
                ]
            },
            // 24. Training Readiness
            {
                id: 'training_needed',
                title: 'Training Readiness',
                question: 'According to you, is the trainee ready to go solo?',
                options: [
                    { value: 'yes', label: '🙂‍↕️ Trainer recommends to let the driver go solo next day' },
                    { value: 'one_more', label: '☝🏻 Trainer recommends one more ride-along' },
                    { value: 'multiple_more', label: '🤯 Trainer says multiple additional ride-alongs needed' }
                ]
            },
            // 25. Report Accuracy
            {
                id: 'more_details',
                title: 'Report Accuracy',
                question: 'Is the report accurate enough or do you have more details available?',
                options: [
                    { value: 'yes', label: 'Yes - Report is accurate enough' },
                    { value: 'no', label: 'No - More details available' }
                ]
            },

        ];
    }

    setDriverName(name) {
        this.driverName = name;
    }

    setTrainerName(name) {
        this.trainerName = name;
    }

    setEvaluationData(questionId, value, inputValue = null) {
        if (value === null) {
            // Remove the evaluation data for deselection
            delete this.evaluationData[questionId];
        } else {
            // Check if this is a multiple selection question
            const question = this.questions.find(q => q.id === questionId);
            if (question && question.isMultiple) {
                // For multiple selections, store as object with selections and inputValue
                const existingData = this.evaluationData[questionId];
                this.evaluationData[questionId] = {
                    selections: Array.isArray(value) ? value : [value],
                    inputValue: inputValue || (existingData && existingData.inputValue) || null
                };
            } else if (question && question.isNote) {
                // For note questions, store with input value
                this.evaluationData[questionId] = { value, inputValue };
            } else {
                // For single selections, store as object
                this.evaluationData[questionId] = { value };
            }
        }
    }


    reset() {
        this.driverName = '';
        this.trainerName = '';
        this.currentStep = 0;
        this.evaluationData = {};
    }
}

// Initialize ride along state
const rideAlongState = new RideAlongState();

// ========================================
// UI Management
// ========================================

function initRideAlongTool() {
    console.log('Initializing Ride Along Tool');
    rideAlongState.reset();
    showRideAlongScreen('trainee-name-screen');
}

function showRideAlongScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('#ride-along-app .interface-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Special handling for saved reports screen
    if (screenId === 'saved-reports-screen') {
        renderSavedReports();
    }

    // Update navigation buttons
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.disabled = rideAlongState.currentStep === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = rideAlongState.currentStep >= rideAlongState.questions.length;
    }
}

// ========================================
// Event Handlers
// ========================================

function startRideAlong(event) {
    event.preventDefault();

    const driverNameInput = document.getElementById('driver-name-input');
    const trainerNameInput = document.getElementById('trainer-name-input');
    const driverName = driverNameInput.value.trim();
    const trainerName = trainerNameInput.value.trim();

    if (!driverName) {
        showNotification('Please enter the driver name', 'error');
        driverNameInput.focus();
        return;
    }

    if (!trainerName) {
        showNotification('Please enter the trainer name', 'error');
        trainerNameInput.focus();
        return;
    }

    rideAlongState.setDriverName(driverName);
    rideAlongState.setTrainerName(trainerName);
    showRideAlongScreen('evaluation-screen');
    renderEvaluationStep();
}

function renderEvaluationStep() {
    const evaluationGrid = document.querySelector('.evaluation-grid');
    if (!evaluationGrid) return;

    const question = rideAlongState.questions[rideAlongState.currentStep];
    if (!question) return;

    // Determine the instruction text based on question type
    let instructionText = '';
    if (question.question && question.question !== question.title) {
        // Use the specific question text only if it's different from the title
        instructionText = question.question;
    } else if (question.isMultiple) {
        // For multiple choice questions
        instructionText = 'Select all that apply';
    } else {
        // For single choice questions
        instructionText = 'Select the one that applies';
    }

    const htmlContent = `
        <div class="evaluation-item">
            <div class="evaluation-question">
                <strong>${question.title}</strong>
                <br><span style="font-weight: normal; font-size: 0.9em; color: var(--text-secondary);">${instructionText}</span>
            </div>
                            <div class="evaluation-options ${question.hasInput ? 'has-input-field' : ''}">
                ${question.options.map(option => {
                    let isSelected = false;

                    if (question.isMultiple) {
                        // For multiple selection questions, check if option is in the selections array
                        const currentData = rideAlongState.evaluationData[question.id];
                        isSelected = currentData && currentData.selections && Array.isArray(currentData.selections) && currentData.selections.includes(option.value);
                    } else {
                        // For single selection questions, check if this is the selected option
                        const currentSelection = rideAlongState.evaluationData[question.id];
                        isSelected = currentSelection && currentSelection.value === option.value;
                    }

                    return `
                        <button class="option-btn ${isSelected ? 'selected' : ''} ${question.isMultiple ? 'multiple-choice' : ''}"
                                data-value="${option.value}"
                                onclick="window.selectEvaluationOption('${question.id}', '${option.value}')">
                            ${option.label}
                        </button>
                    `;
                }).join('')}

                ${question.hasInput ? `
                    <div class="evaluation-input" id="${question.inputId}-container" style="min-height: 60px; margin-top: 15px; opacity: ${rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].selections && Array.isArray(rideAlongState.evaluationData[question.id].selections) && rideAlongState.evaluationData[question.id].selections.includes('custom_issue') ? '1' : '0'}; pointer-events: ${rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].selections && Array.isArray(rideAlongState.evaluationData[question.id].selections) && rideAlongState.evaluationData[question.id].selections.includes('custom_issue') ? 'auto' : 'none'}; transition: opacity 0.3s ease; text-align: center;">
                        <label for="${question.inputId}-input" style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-primary); text-align: center;">${question.inputLabel}</label>
                        <input type="text"
                               id="${question.inputId}-input"
                               value="${rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].inputValue ? rideAlongState.evaluationData[question.id].inputValue : ''}"
                               oninput="updateNoteInput('${question.id}', '${question.inputId}')"
                               style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); width: 300px; display: block; margin: 0 auto;">
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    console.log('Generated HTML:', htmlContent);
    evaluationGrid.innerHTML = htmlContent;

    updateNavigationButtons();

    // Update input field visibility for all sections
    if (question.hasInput) {
        if (question.id === 'first_day_issues') {
            const data = rideAlongState.evaluationData[question.id];
            const selections = data && data.selections ? data.selections : data;
            updateCustomIssueVisibility(selections);
        }
}
}
function updateNoteInput(questionId, inputId) {
    const input = document.getElementById(inputId + '-input');
    if (input) {
        const inputValue = input.value;
        const existingData = rideAlongState.evaluationData[questionId];
        if (existingData) {
            // Handle both single selection and multiple selection data structures
            if (existingData.selections) {
                // Multiple selection question
                existingData.inputValue = inputValue;
            } else {
                // Single selection or note question
                existingData.inputValue = inputValue;
            }
        }
    }
    updateNavigationButtons(); // Update navigation buttons when input changes
}

function updateCustomIssueVisibility(selections) {
    const inputContainer = document.getElementById('custom-issue-container');
    if (inputContainer) {
        if (selections && selections.includes && selections.includes('custom_issue')) {
            inputContainer.style.opacity = '1';
            inputContainer.style.pointerEvents = 'auto';
        } else {
            inputContainer.style.opacity = '0';
            inputContainer.style.pointerEvents = 'none';
        }
    }
}

function updateTrainerComplimentVisibility(selections) {
    const inputContainer = document.getElementById('other-compliment-container');
    if (inputContainer) {
        if (selections && selections.includes && selections.includes('other_compliment')) {
            inputContainer.style.opacity = '1';
            inputContainer.style.pointerEvents = 'auto';
            inputContainer.style.position = 'relative';
            inputContainer.style.zIndex = '10';
        } else {
            inputContainer.style.opacity = '0';
            inputContainer.style.pointerEvents = 'none';
        }
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentQuestion = rideAlongState.questions[rideAlongState.currentStep];

    // Previous button: enabled if not on first question
    if (prevBtn) {
        prevBtn.disabled = rideAlongState.currentStep === 0;
    }

    // Next button: always enabled (DNA - Does Not Apply)
    if (nextBtn) {
        nextBtn.disabled = false;

        // Update button text for last question
        if (rideAlongState.currentStep === rideAlongState.questions.length - 1) {
            nextBtn.innerHTML = '<i class="fas fa-file-alt"></i> Complete Evaluation';
        } else {
            nextBtn.textContent = 'Next';
        }
    }
}

function nextEvaluationStep() {
    const currentQuestion = rideAlongState.questions[rideAlongState.currentStep];


    // Move to next question or finish
    if (rideAlongState.currentStep < rideAlongState.questions.length - 1) {
        rideAlongState.currentStep++;
        renderEvaluationStep();
    } else {
        // Generate report
        generateReport();
    }
}

function prevEvaluationStep() {
    if (rideAlongState.currentStep > 0) {
        rideAlongState.currentStep--;
        renderEvaluationStep();
    }
}

function selectEvaluationOption(questionId, value) {
    const clickedButton = event.target;
    const currentQuestion = rideAlongState.questions.find(q => q.id === questionId);

    // Handle multiple selection questions differently
    if (currentQuestion && currentQuestion.isMultiple) {
        handleMultipleSelection(questionId, value, clickedButton);
        return;
    }

    // Handle note questions with input
    if (currentQuestion && currentQuestion.isNote) {
        handleNoteSelection(questionId, value, clickedButton);
        return;
    }

    // Handle regular single-selection questions
    handleSingleSelection(questionId, value, clickedButton);
}

function handleSingleSelection(questionId, value, clickedButton) {
    // Check if this button is already selected
    if (clickedButton.classList.contains('selected')) {
        // If already selected, deselect it
        clickedButton.classList.remove('selected');

        // Remove the selection from state
        rideAlongState.setEvaluationData(questionId, null);


        // Show notification
        showNotification('Option deselected', 'info');
    } else {
        // If not selected, remove previous selections and select this one
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button
        clickedButton.classList.add('selected');

        // Store the selection
        rideAlongState.setEvaluationData(questionId, value);


        // Update navigation buttons
        updateNavigationButtons();

        // Show notification
        showNotification('Option selected', 'success');
    }
}

function handleMultipleSelection(questionId, value, clickedButton) {
    // Toggle selection for multiple choice questions
    if (clickedButton.classList.contains('selected')) {
        // If already selected, deselect it
        clickedButton.classList.remove('selected');

        // Remove from state array
        const currentData = rideAlongState.evaluationData[questionId];
        const currentSelections = currentData && currentData.selections ? currentData.selections : [];
        const updatedSelections = currentSelections.filter(sel => sel !== value);
        if (updatedSelections.length > 0) {
            rideAlongState.setEvaluationData(questionId, updatedSelections);
        } else {
            rideAlongState.setEvaluationData(questionId, null);
        }

        // Update navigation buttons
        updateNavigationButtons();

        // Update input field visibility for first day issues
        if (questionId === 'first_day_issues') {
            updateCustomIssueVisibility(updatedSelections);
        }

        // Update input field visibility for trainer compliments
        if (questionId === 'trainer_compliments') {
            updateTrainerComplimentVisibility(updatedSelections);
        }

        showNotification('Option deselected', 'info');
    } else {
        // If not selected, add it
        clickedButton.classList.add('selected');

        // Add to state array
        const currentData = rideAlongState.evaluationData[questionId];
        const currentSelections = currentData && currentData.selections ? currentData.selections : [];
        const updatedSelections = [...currentSelections, value];
        rideAlongState.setEvaluationData(questionId, updatedSelections);

        // Update navigation buttons
        updateNavigationButtons();

        // Update input field visibility for first day issues
        if (questionId === 'first_day_issues') {
            updateCustomIssueVisibility(updatedSelections);
        }

        // Update input field visibility for trainer compliments
        if (questionId === 'trainer_compliments') {
            updateTrainerComplimentVisibility(updatedSelections);
        }

        showNotification('Option selected', 'success');
    }
}

function handleNoteSelection(questionId, value, clickedButton) {
    const currentQuestion = rideAlongState.questions.find(q => q.id === questionId);

    // Handle note questions (include/exclude)
    if (value === 'include') {
        if (clickedButton.classList.contains('selected')) {
            // Deselect
            clickedButton.classList.remove('selected');
            rideAlongState.setEvaluationData(questionId, null);

            // Hide input if it exists
            if (currentQuestion.hasInput) {
                const input = document.getElementById(currentQuestion.inputId + '-input');
                if (input) input.style.display = 'none';
            }

            // Update navigation buttons
            updateNavigationButtons();

            showNotification('Note deselected', 'info');
        } else {
            // Select
            clickedButton.classList.add('selected');
            const inputValue = currentQuestion.hasInput ?
                document.getElementById(currentQuestion.inputId + '-input').value : null;
            rideAlongState.setEvaluationData(questionId, value, inputValue);

            // Show input if it exists
            if (currentQuestion.hasInput) {
                const inputContainer = document.getElementById(currentQuestion.inputId + '-container');
                if (inputContainer) {
                    inputContainer.style.display = 'block';
                    const input = document.getElementById(currentQuestion.inputId + '-input');
                    if (input) {
                        input.focus();
                        // Store initial value if it exists
                        const existingData = rideAlongState.evaluationData[questionId];
                        if (existingData && existingData.inputValue) {
                            input.value = existingData.inputValue;
                        }
                    }
                }
            }

            // Update navigation buttons
            updateNavigationButtons();

            showNotification('Note selected', 'success');
        }
    }
}

function nextEvaluationStep() {
    const currentQuestion = rideAlongState.questions[rideAlongState.currentStep];


    // Move to next question or finish
    if (rideAlongState.currentStep < rideAlongState.questions.length - 1) {
        rideAlongState.currentStep++;
        renderEvaluationStep();
    } else {
        // Generate report
        generateReport();
    }
}

function prevEvaluationStep() {
    if (rideAlongState.currentStep > 0) {
        rideAlongState.currentStep--;
        renderEvaluationStep();
    }
}

function generateReport(isViewMode = false) {
    showRideAlongScreen('report-screen');  // Ensure screen is active first
    const reportText = document.getElementById('report-text');
    if (!reportText) {
        console.error('Report textarea not found - screen may not be ready');
        showNotification('Error displaying report. Please try again.', 'error');
        return;
    }

    const driverName = rideAlongState.driverName || 'Not specified';
    const trainerName = rideAlongState.trainerName || 'Not specified';

    let report = `DRIVER: ${driverName}\nTRAINER: ${trainerName}\n=====\n\n`;

    // Check if there are any evaluation responses
    const hasEvaluationData = Object.keys(rideAlongState.evaluationData).some(questionId => {
        const question = rideAlongState.questions.find(q => q.id === questionId);
        // Exclude special questions that don't count as evaluation data
        return question && !['overall_comment', 'first_day_issues', 'driver_feeling', 'more_details', 'feels_ready', 'training_needed'].includes(questionId);
    });

    // Readiness Assessment - Combined Driver Confidence and Training Readiness (integrated into SUMMARY, no sub-header)
    const feelsReadyQuestion = rideAlongState.questions.find(q => q.id === 'feels_ready');
    const trainingNeededQuestion = rideAlongState.questions.find(q => q.id === 'training_needed');

    let readinessAssessment = '';
    if (feelsReadyQuestion && trainingNeededQuestion) {
        const driverReady = rideAlongState.evaluationData['feels_ready'];
        const trainerReady = rideAlongState.evaluationData['training_needed'];

        let driverText = '';
        if (driverReady && driverReady.value === 'yes') {
            driverText = '🥶 Driver feels ready and confident to go solo next day.';
        } else if (driverReady && driverReady.value === 'no') {
            driverText = '😟 Driver doesn\'t feel ready or confident to go alone yet.';
        }

        let trainerText = '';
        if (trainerReady && trainerReady.value === 'yes') {
            trainerText = '🙂‍↕️ Trainer recommends letting driver go solo next day.';
        } else if (trainerReady && trainerReady.value === 'one_more') {
            trainerText = '☝🏻 Trainer recommends one more ride-along.';
        } else if (trainerReady && trainerReady.value === 'multiple_more') {
            trainerText = '🤯 Trainer recommends multiple additional ride-alongs.';
        }

        if (driverText && trainerText) {
            if (driverReady.value === 'yes' && trainerReady.value === 'yes') {
                readinessAssessment = `Both driver and trainer assess trainee as ready to go solo.\n`;
            } else if (driverReady.value === 'yes' && (trainerReady.value === 'one_more' || trainerReady.value === 'multiple_more')) {
                readinessAssessment = `${driverText} However, ${trainerText.toLowerCase()}\n`;
            } else if (driverReady.value === 'no' && trainerReady.value === 'yes') {
                readinessAssessment = `${trainerText} However, ${driverText.toLowerCase()}\n`;
            } else {
                readinessAssessment = `${driverText}\n${trainerText}\n`;
            }
        } else if (driverText) {
            readinessAssessment = `${driverText}\n`;
        } else if (trainerText) {
            readinessAssessment = `${trainerText}\n`;
        }
    }

    // Only add SUMMARY section if there are evaluation responses or readiness data
    const hasSummaryContent = hasEvaluationData || readinessAssessment || 
        (rideAlongState.evaluationData['overall_comment'] || rideAlongState.evaluationData['driver_feeling']);
    if (hasSummaryContent) {
        report += `SUMMARY\n--------------------------------------------------------- \n`;

        // Overall comment first
        const overallComment = rideAlongState.questions.find(q => q.id === 'overall_comment');
        if (overallComment && rideAlongState.evaluationData[overallComment.id]) {
            const commentData = rideAlongState.evaluationData[overallComment.id];
            const selectedOption = overallComment.options.find(opt => opt.value === commentData.value);
            if (selectedOption) {
                report += `Overall: ${selectedOption.label}\n`;
            }
        }

        // Driver feelings next
        const driverFeeling = rideAlongState.questions.find(q => q.id === 'driver_feeling');
        if (driverFeeling && rideAlongState.evaluationData[driverFeeling.id]) {
            const feelingData = rideAlongState.evaluationData[driverFeeling.id];
            const selectedOption = driverFeeling.options.find(opt => opt.value === feelingData.value);
            if (selectedOption) {
                report += `Driver feelings: ${selectedOption.label}\n`;
            }
        }

        // Readiness Assessment integrated last (plain text, no sub-header)
        if (readinessAssessment) {
            report += readinessAssessment;
        }

        report += '\n';
    }

    // Group evaluations by performance level (excluding special questions including readiness)
    const goods = [];
    const mids = [];
    const bads = [];

    rideAlongState.questions.forEach(question => {
        if (['overall_comment', 'first_day_issues', 'driver_feeling', 'more_details', 'feels_ready', 'training_needed'].includes(question.id)) {
            return; // Skip these special questions in the main evaluation
        }

        const response = rideAlongState.evaluationData[question.id];
        if (!response) return;

        let responseText = '';

        // Find the option that matches the selected value
        const selectedOption = question.options.find(option => option.value === response.value);
        if (selectedOption) {
            responseText = selectedOption.label;
            // Group by performance level based on value names
            if (response.value === 'good' || response.value === 'yes') {
                goods.push(responseText);
            } else if (response.value === 'mid' || response.value === 'no') {
                mids.push(responseText);
            } else if (response.value === 'bad' || response.value === 'one_more' || response.value === 'multiple_more') {
                bads.push(responseText);
            }
        }
    });

    // STRENGTHS section
    if (goods.length > 0) {
        report += `STRENGTHS\n---------------------------------------------------------\n`;
        report += goods.join('\n') + '\n\n';
    }

    // AREAS FOR IMPROVEMENT section
    if (mids.length > 0) {
        report += `AREAS FOR IMPROVEMENT\n---------------------------------------------------------\n`;
        report += mids.join('\n') + '\n\n';
    }

    // CRITICAL ISSUES section
    if (bads.length > 0) {
        report += `CRITICAL ISSUES\n---------------------------------------------------------\n`;
        report += bads.join('\n') + '\n\n';
    }

    // SPECIAL NOTES section
    const specialNotes = [];

    // Handle first day issues
    const firstDayIssues = rideAlongState.questions.find(q => q.id === 'first_day_issues');
    if (firstDayIssues && rideAlongState.evaluationData[firstDayIssues.id]) {
        const issuesData = rideAlongState.evaluationData[firstDayIssues.id];
        if (issuesData.selections && Array.isArray(issuesData.selections) && issuesData.selections.length > 0) {
            const issueTexts = issuesData.selections.map(value => {
                const option = firstDayIssues.options.find(opt => opt.value === value);
                if (value === 'custom_issue') {
                    // Handle custom issue with user input
                    const customText = issuesData.inputValue;
                    return customText ? `⚠️ Trainer reports: ${customText}` : '⚠️ Other issue (not specified)';
                }
                return option ? option.label : value;
            });
            specialNotes.push(...issueTexts);
        }
    }

    // Handle more details question
    const moreDetails = rideAlongState.questions.find(q => q.id === 'more_details');
    if (moreDetails && rideAlongState.evaluationData[moreDetails.id]) {
        const moreDetailsData = rideAlongState.evaluationData[moreDetails.id];
        if (moreDetailsData.value === 'no') {
            specialNotes.push('More details available upon request.');
        }
    }

    if (specialNotes.length > 0) {
        report += `SPECIAL NOTES\n---------------------------------------------------------\n`;
        report += specialNotes.join('\n') + '\n\n';
    }

    // RECOMMENDATIONS section
    const recommendations = [];

    // Add special notes for certain conditions
    if (rideAlongState.evaluationData['organize_van'] &&
        (rideAlongState.evaluationData['organize_van'].value === 'mid' ||
         rideAlongState.evaluationData['organize_van'].value === 'bad')) {
        recommendations.push('Please help organize the van on the launchpad next working day.');
    }

    if (recommendations.length > 0) {
        report += `RECOMMENDATIONS\n---------------------------------------------------------\n`;
        report += recommendations.join('\n') + '\n';
    }

    reportText.value = report.trim();

    // Only save if not in view mode and evaluation is complete
    if (!isViewMode && rideAlongState.currentStep >= rideAlongState.questions.length - 1) {
        const saved = saveReport(report.trim());
        if (saved) {
            showNotification('Report saved successfully!', 'success');
        } else {
            showNotification('Failed to save report', 'error');
        }
    }

    showRideAlongScreen('report-screen');
}

function generateRecommendations(performanceLevel, evaluationData) {
    const recommendations = [];

    // Analyze weak areas
    const weakAreas = Object.entries(evaluationData)
        .filter(([_, data]) => data.value === 'bad' || data.value === 'one_more' || data.value === 'multiple_more')
        .map(([questionId, _]) => {
            const question = rideAlongState.questions.find(q => q.id === questionId);
            return question ? question.title : questionId;
        });

    if (weakAreas.length > 0) {
        recommendations.push(`Areas requiring immediate attention: ${weakAreas.join(', ')}`);
    }

    // Performance-based recommendations
    switch (performanceLevel) {
        case 'Outstanding':
            recommendations.push('Continue excellent performance. Consider mentoring other trainees.');
            break;
        case 'Excellent':
            recommendations.push('Maintain high standards. Minor refinements in weak areas recommended.');
            break;
        case 'Good':
            recommendations.push('Good performance overall. Focus on areas identified for improvement.');
            break;
        case 'Satisfactory':
            recommendations.push('Performance meets minimum standards. Additional training recommended in identified areas.');
            break;
        case 'Needs Improvement':
            recommendations.push('Significant improvement needed. Consider additional training and supervision.');
            break;
        case 'Unsatisfactory':
            recommendations.push('Performance below acceptable standards. Immediate corrective action required.');
            break;
    }

    return recommendations.join('\n\n');
}

function copyReport() {
    const reportText = document.getElementById('report-text');
    if (reportText && reportText.value) {
        // Use modern Clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(reportText.value).then(function() {
                showNotification('Report Successfully Copied to Clipboard', 'success');
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
                fallbackCopyTextToClipboard(reportText.value);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(reportText.value);
        }
    } else {
        showNotification('❌ No report content to copy', 'error');
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Report Successfully Copied to Clipboard', 'success');
        } else {
            showNotification('❌ Failed to copy report to clipboard', 'error');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showNotification('❌ Failed to copy report to clipboard', 'error');
    }

    document.body.removeChild(textArea);
}

function startNewReport() {
    if (confirm('Start a new evaluation? Current data will be lost.')) {
        rideAlongState.reset();
        showRideAlongScreen('driver-trainer-input-screen');
        const driverInput = document.getElementById('driver-name-input');
        const trainerInput = document.getElementById('trainer-name-input');
        if (driverInput) driverInput.value = '';
        if (trainerInput) trainerInput.value = '';
        if (driverInput) driverInput.focus();
    }
}

// ========================================
// Utility Functions
// ========================================

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }

    // Fallback notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function copyToClipboard(text) {
    if (typeof window.copyToClipboard === 'function') {
        window.copyToClipboard(text);
    }
}

// ========================================
// Report Storage Management
// ========================================

function saveReport(reportText) {
    try {
        // Get existing saved reports or create empty array
        const savedReports = JSON.parse(localStorage.getItem('rideAlongReports') || '[]');

        // Create report object
        const reportData = {
            id: Date.now().toString(),
            driverName: rideAlongState.driverName || 'Not specified',
            trainerName: rideAlongState.trainerName || 'Not specified',
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            reportText: reportText,
            evaluationData: JSON.parse(JSON.stringify(rideAlongState.evaluationData)) // Deep copy
        };

        // Add to beginning of array (most recent first)
        savedReports.unshift(reportData);

        // Keep only last 50 reports to prevent storage bloat
        if (savedReports.length > 50) {
            savedReports.splice(50);
        }

        // Save to localStorage
        localStorage.setItem('rideAlongReports', JSON.stringify(savedReports));

        console.log('Report saved successfully for driver:', reportData.driverName, 'by trainer:', reportData.trainerName);
        return true;
    } catch (error) {
        console.error('Failed to save report:', error);
        return false;
    }
}

function getSavedReports() {
    try {
        return JSON.parse(localStorage.getItem('rideAlongReports') || '[]');
    } catch (error) {
        console.error('Failed to load saved reports:', error);
        return [];
    }
}

function deleteSavedReport(reportId) {
    try {
        const savedReports = getSavedReports();
        const filteredReports = savedReports.filter(report => report.id !== reportId);
        localStorage.setItem('rideAlongReports', JSON.stringify(filteredReports));
        return true;
    } catch (error) {
        console.error('Failed to delete report:', error);
        return false;
    }
}

function copySavedReportToClipboard(reportText) {
    return copyToClipboard(reportText);
}

// ========================================
// Keyboard Navigation
// ========================================

document.addEventListener('keydown', function(event) {
    if (app.currentScreen !== 'tool-interfaces' || app.currentTool !== 'ride-along') {
        return;
    }

    const activeScreen = document.querySelector('#ride-along-app .interface-screen.active');
    if (!activeScreen) return;

    switch (event.key) {
        case 'ArrowLeft':
            if (activeScreen.id === 'evaluation-screen') {
                event.preventDefault();
                prevEvaluationStep();
            }
            break;
        case 'ArrowRight':
            if (activeScreen.id === 'evaluation-screen') {
                event.preventDefault();
                nextEvaluationStep();
            }
            break;
        case 'Enter':
            if (activeScreen.id === 'evaluation-screen') {
                event.preventDefault();
                nextEvaluationStep();
            }
            break;
    }
});

// ========================================
// Saved Reports UI Management
// ========================================

function renderSavedReports() {
    const savedReportsGrid = document.getElementById('saved-reports-grid');
    const savedReportsEmpty = document.getElementById('saved-reports-empty');

    if (!savedReportsGrid) return;

    const savedReports = getSavedReports();

    // No longer add create-new-card here - it's now in the header

    if (savedReports.length > 0) {
        savedReportsEmpty.style.display = 'none';
        savedReportsGrid.innerHTML = savedReports.map(report => `
            <div class="saved-report-item">
                <div class="saved-report-header">
                    <div class="saved-report-info">
                        <h4>Driver: ${report.driverName}</h4>
                        <p class="saved-report-meta">Trainer: ${report.trainerName} | ${report.date} at ${report.time}</p>
                    </div>
                    <div class="saved-report-actions">
                        <button class="btn btn-primary btn-small" onclick="viewSavedReport('${report.id}')">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="copySavedReport('${report.id}')">
                            <i class="fas fa-copy"></i>
                            Copy
                        </button>
                        <button class="btn btn-danger btn-small" onclick="confirmDeleteSavedReport('${report.id}')">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        savedReportsEmpty.style.display = 'block';
        savedReportsGrid.innerHTML = '';
    }
}

function viewSavedReport(reportId) {
    const savedReports = getSavedReports();
    const report = savedReports.find(r => r.id === reportId);

    if (report) {
        // Load the report data into the current state (for potential editing)
        rideAlongState.driverName = report.driverName || 'Not specified';
        rideAlongState.trainerName = report.trainerName || 'Not specified';
        rideAlongState.evaluationData = report.evaluationData;

        // Switch to report screen
        showRideAlongScreen('report-screen');

        // Set the textarea directly to the original saved text (no regeneration or save)
        const reportText = document.getElementById('report-text');
        if (reportText) {
            reportText.value = report.reportText;
        }

        // Optional: Update the "New Report" button text or state if needed, but no auto-save
        showNotification(`Viewing report for driver ${report.driverName} by trainer ${report.trainerName}`, 'info');
    }
}

function copySavedReport(reportId) {
    const savedReports = getSavedReports();
    const report = savedReports.find(r => r.id === reportId);

    if (report) {
        const success = copySavedReportToClipboard(report.reportText);
        if (success) {
            showNotification('Report copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy report', 'error');
        }
    }
}

function confirmDeleteSavedReport(reportId) {
    // Use setTimeout to avoid interfering with the click event
    setTimeout(() => {
        const savedReports = getSavedReports();
        const report = savedReports.find(r => r.id === reportId);

        if (report && confirm(`Are you sure you want to delete the report for "${report.driverName}" from ${report.date}?`)) {
            const success = deleteSavedReport(reportId);
            if (success) {
                showNotification('Report deleted successfully!', 'success');
                renderSavedReports(); // Refresh the list
            } else {
                showNotification('Failed to delete report', 'error');
            }
        }
    }, 10);
}

// ========================================
// Initialization
// ========================================

// Initialize ride-along tool - called when tool is opened from main menu
function initridealongTool() {
    console.log('Initializing Ride Along Tool');
    rideAlongState.reset();  // Reset state to prevent persistence from previous sessions
    document.querySelectorAll('#ride-along-app .interface-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const inputScreen = document.getElementById('driver-trainer-input-screen');
    if (inputScreen) {
        inputScreen.classList.add('active');
    }

    updateNavigationButtons();
}

// Make functions globally accessible for HTML onclick handlers
window.nextEvaluationStep = nextEvaluationStep;
window.prevEvaluationStep = prevEvaluationStep;
window.selectEvaluationOption = selectEvaluationOption;
window.copyReport = copyReport;
window.startNewReport = startNewReport;
window.viewSavedReport = viewSavedReport;
window.copySavedReport = copySavedReport;
window.confirmDeleteSavedReport = confirmDeleteSavedReport;
window.initRideAlongTool = initridealongTool;

console.log('Ride Along Tool loaded and ready');
