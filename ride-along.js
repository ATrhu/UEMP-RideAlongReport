/**
 * UEMP Operations Hub V2 - Ride Along Report Tool
 * Handles the complete ride-along evaluation process
 */

// ========================================
// Ride Along State Management
// ========================================

class RideAlongState {
    constructor() {
        this.traineeName = '';
        this.currentStep = 0;
        this.evaluationData = {};
        this.questions = [
            {
                id: 'flex',
                title: 'Flex App Usage',
                question: 'Flex App Usage',
                options: [
                    { value: 'good', label: '✅ Good understanding of the Amazon Flex app.', points: 5 },
                    { value: 'mid', label: '🔧 Needs time to get used to the Amazon Flex app.', points: 3 },
                    { value: 'bad', label: '❌ Limited understanding of the Amazon Flex app.', points: 1 }
                ]
            },
            {
                id: 'organize_van',
                title: 'Van Organization',
                question: 'Van Organization',
                options: [
                    { value: 'good', label: '✅ Understands the importance of being organized with both overflows and bags.', points: 5 },
                    { value: 'mid', label: '🔧 Understands the importance of being organized, but needs more practice.', points: 3 },
                    { value: 'bad', label: '❌ Does not understand the importance of being organized.', points: 1 }
                ]
            },
            {
                id: 'bag_overflow',
                title: 'Bag vs Overflows',
                question: 'Bag vs Overflows',
                options: [
                    { value: 'good', label: '✅ Understands the difference between packages in a bag and overflows.', points: 5 },
                    { value: 'mid', label: '🔧 Partial understanding of the difference between packages in a bag and overflows.', points: 3 },
                    { value: 'bad', label: '❌ Confuses packages in a bag and overflows; wastes time searching wrong places.', points: 1 }
                ]
            },
            {
                id: 'customer_instructions',
                title: 'Customer Instructions',
                question: 'Customer Instructions',
                options: [
                    { value: 'good', label: '✅ Follows all customer instructions.', points: 5 },
                    { value: 'mid', label: '🔧 Follows most customer instructions with minor issues.', points: 3 },
                    { value: 'bad', label: '❌ Consistently ignores customer instructions.', points: 1 }
                ]
            },
            {
                id: 'language',
                title: 'Language Challenges',
                question: 'Language Challenges',
                options: [
                    { value: 'good', label: '✅ No language challenges noted.', points: 5 },
                    { value: 'mid', label: '🔧 Minor language challenges.', points: 3 },
                    { value: 'bad', label: '❌ Language Barrier.', points: 1 }
                ]
            },
            {
                id: 'mark_undeliverable',
                title: 'Undeliverable Packages',
                question: 'Undeliverable Packages',
                options: [
                    { value: 'good', label: '✅ Knows how to mark undeliverable packages correctly (e.g., damage, missing, business closed).', points: 5 },
                    { value: 'mid', label: '🔧 Needs some guidance on marking undeliverable packages.', points: 3 },
                    { value: 'bad', label: '❌ Doesn\'t know how to mark a package as undeliverable or attempted.', points: 1 }
                ]
            },
            {
                id: 'photos',
                title: 'Picture on Delivery',
                question: 'Picture on Delivery',
                options: [
                    { value: 'good', label: '✅ Takes clear pictures on deliveries.', points: 5 },
                    { value: 'mid', label: '🔧 Occasionally takes unclear or poor pictures.', points: 3 },
                    { value: 'bad', label: '❌ Consistently takes unclear or poor pictures.', points: 1 }
                ]
            },
            {
                id: 'polite',
                title: 'Customer Treatment',
                question: 'Customer Treatment',
                options: [
                    { value: 'good', label: '✅ Polite and respectful with customers.', points: 5 },
                    { value: 'mid', label: '🔧 Generally polite, but gets nervous at times.', points: 3 },
                    { value: 'bad', label: '❌ Not always polite or respectful with customers.', points: 1 }
                ]
            },
            {
                id: 'driving',
                title: 'Driving Aptitudes',
                question: 'Driving Aptitudes',
                options: [
                    { value: 'good', label: '✅ Good driver: full stops, speed limits, follows traffic rules.', points: 5 },
                    { value: 'mid', label: '🔧 Drives well, but has some minor bad habits; needs coaching.', points: 3 },
                    { value: 'bad', label: '❌ Weak driver: ignores stops, speeds, breaks traffic rules.', points: 1 }
                ]
            },
            {
                id: 'building_deliveries',
                title: 'Deliverying at Buildings',
                question: 'Deliverying at Buildings',
                options: [
                    { value: 'good', label: '✅ Understands how to handle building deliveries: door to door, package rooms, receptionists.', points: 5 },
                    { value: 'mid', label: '🔧 Didn\'t experience building deliveries today.(might need coaching on that).', points: 3 },
                    { value: 'bad', label: '❌ Detests building deliveries; complains about having to go upstairs door to door.', points: 1 }
                ]
            },
            {
                id: 'house_deliveries',
                title: 'House Deliveries',
                question: 'House Deliveries',
                options: [
                    { value: 'good', label: '✅ Mastered deliverying to houses; stops with multiple locations are no problem.', points: 5 },
                    { value: 'mid', label: '🔧 Minor difficulty with house deliveries; gets confused by stops with multiple locations.', points: 3 },
                    { value: 'bad', label: '❌ Doesn\'t understand stops with multiple locations. risks deliverying to the wrong address.', points: 1 }
                ]
            },
            {
                id: 'delivery_speed',
                title: 'Delivery Speed',
                question: 'Delivery Speed',
                options: [
                    { value: 'good', label: '✅ Delivers quickly: photo and go.', points: 5 },
                    { value: 'mid', label: '🔧 Delivery speed is average; some extra time at stops.', points: 3 },
                    { value: 'bad', label: '❌ Delivers slowly; spends extra time at stops.', points: 1 }
                ]
            },
            {
                id: 'identify_addresses',
                title: 'Identify Addresses',
                question: 'Identify Addresses',
                options: [
                    { value: 'good', label: '✅ Identifies the correct addresses without difficulty.', points: 5 },
                    { value: 'mid', label: '🔧 Occasionally struggles with identifying the correct address.', points: 3 },
                    { value: 'bad', label: '❌ Constantly struggles with identifying the correct address.', points: 1 }
                ]
            },
            {
                id: 'parking',
                title: 'Propper Parking Sequence',
                question: 'Propper Parking Sequence',
                options: [
                    { value: 'good', label: '✅ Knows and follows the proper parking sequence.', points: 5 },
                    { value: 'mid', label: '🔧 Occasionally misses the propper parking sequence.', points: 3 },
                    { value: 'bad', label: '❌ Didnt have the chance to learn the propper parking sequence.', points: 1 }
                ]
            },
            {
                id: 'gps',
                title: 'Map/GPS Skills',
                question: 'Map/GPS Skills',
                options: [
                    { value: 'good', label: '✅ Good map/GPS skills.', points: 5 },
                    { value: 'mid', label: '🔧 Needs improvement on map/GPS skills.', points: 3 },
                    { value: 'bad', label: '❌ Poor map/GPS skills.', points: 1 }
                ]
            },
            {
                id: 'learner',
                title: 'Learning Speed',
                question: 'Learning Speed',
                options: [
                    { value: 'good', label: '✅ Quick learner overall.', points: 5 },
                    { value: 'mid', label: '🔧 Average learner; takes time.', points: 3 },
                    { value: 'bad', label: '❌ Slow learner overall.', points: 1 }
                ]
            },
            {
                id: 'attitude',
                title: 'Attitude',
                question: 'Attitude',
                options: [
                    { value: 'good', label: '✅ Positive attitude and eager to learn.', points: 5 },
                    { value: 'mid', label: '🔧 Neutral attitude; moderate interest in learning.', points: 3 },
                    { value: 'bad', label: '❌ Negative attitude or reluctant to learn.', points: 1 }
                ]
            },
            {
                id: 'gas_card',
                title: 'Gas Card & Powered by Amazon App',
                question: 'Gas Card & Powered by Amazon App',
                options: [
                    { value: 'good', label: '✅ Knows how to use the gas card and Powered by Amazon app.', points: 5 },
                    { value: 'mid', label: '🔧 Needs more guidance on using the gas card and Powered by Amazon app.', points: 3 },
                    { value: 'bad', label: '❌ Does not know how to use the gas card and Powered by Amazon app.', points: 1 }
                ]
            },
            {
                id: 'time_card',
                title: 'Timecard Editing',
                question: 'Timecard Editing',
                options: [
                    { value: 'good', label: '✅ Knows how to edit timecard and meal period times.', points: 5 },
                    { value: 'mid', label: '🔧 Needs more guidance on editing timecard and meal period times.', points: 3 },
                    { value: 'bad', label: '❌ Does not know how to edit timecard and meal period times.', points: 1 }
                ]
            },
            {
                id: 'feels_ready',
                title: 'Feels Ready',
                question: 'Feels Ready',
                options: [
                    { value: 'good', label: '✅ Feels ready and confident to go solo on the next scheduled day.', points: 5 },
                    { value: 'mid', label: '🔧 Needs one more day of training; does not feel confident going alone yet.', points: 3 },
                    { value: 'bad', label: '❌ Does not feel ready to go solo on the next scheduled day.', points: 1 }
                ]
            },
            {
                id: 'experienced',
                title: 'Experience Level',
                question: 'Experience Level',
                options: [
                    { value: 'good', label: '✅ Experienced from prior amazon (or similar) routes.', points: 5 },
                    { value: 'bad', label: '❌ Zero experience as a carrier before.', points: 1 }
                ]
            },
            {
                id: 'training_needed',
                title: 'Training Needed',
                question: 'Training Needed',
                options: [
                    { value: 'good', label: '✅ Ready to go solo on the next scheduled day.', points: 5 },
                    { value: 'mid', label: '🔧 Might benefit from one more ride along session if possible.', points: 3 },
                    { value: 'bad', label: '❌ Needs more than one additional ride along session.', points: 1 }
                ]
            },
            // Special multiple selection question
            {
                id: 'first_day_issues',
                title: 'First Day Experience Issues',
                question: 'First Day Experience Issues (Select all that apply)',
                isMultiple: true,
                options: [
                    { value: 'morning_van_issues', label: '⚠️ Faced issues with the van at the start of the route.', points: 0 },
                    { value: 'equipment_issues', label: '⚠️ Faced issues with equipment (phone).', points: 0 },
                    { value: 'route_issues', label: '⚠️ Faced issues with the route itself (awful route, bad sequencing).', points: 0 },
                    { value: 'only_buildings', label: '⚠️ Only buildings route.', points: 0 },
                    { value: 'not_nursery', label: '⚠️ Had to do a non-nursery route.', points: 0 }
                ]
            },
            // Special emoji-based questions
            {
                id: 'driver_feeling',
                title: 'Driver Feelings',
                question: 'Driver Feelings',
                isEmoji: true,
                options: [
                    { value: 'overwhelmed', label: '😵‍💫 Feels overwhelmed about the job.', points: 1 },
                    { value: 'happy', label: '😊 Feels happy about the job.', points: 5 },
                    { value: 'confident', label: '💪 Feels confident about the job.', points: 5 },
                    { value: 'challenged', label: '🏆 Feels challenged in a positive way.', points: 4 },
                    { value: 'good_mental', label: '👍 Good mindset and attitude.', points: 5 },
                    { value: 'bad_mental', label: '👎 Bad mindset/ poor attitude.', points: 1 },
                    { value: 'lazy', label: '😴 Seems lazy about the job.', points: 1 }
                ]
            },
            {
                id: 'overall_comment',
                title: 'Overall Comment',
                question: 'Overall Comment',
                isEmoji: true,
                options: [
                    { value: 'killed_it', label: '🔥 Killed it today', points: 5 },
                    { value: 'struggled', label: '🙈 Struggled today', points: 2 },
                    { value: 'had_easy', label: '😎 Had it easy today', points: 3 },
                    { value: 'pushed_through', label: '🫡 Pushed through it today', points: 4 },
                    { value: 'did_amazing', label: '🤩 Did amazing today', points: 5 },
                    { value: 'had_fun', label: '🤪 Had fun today', points: 4 },
                    { value: 'did_crazy', label: '🥶 Did crazy today', points: 3 },
                    { value: 'hmm', label: '🤔 Hmm today', points: 3 },
                    { value: 'overwhelmed_today', label: '🫨 Overwhelmed today', points: 1 },
                    { value: 'did_good', label: '🤘🏼 Did good today', points: 4 }
                ]
            },
            // Regular evaluation questions
            {
                id: 'handled_challenges',
                title: 'Special Deliveries Experience',
                question: 'Special Deliveries Experience',
                options: [
                    { value: 'good', label: '✅ Had the chance to experience special deliveries (lockers or OTP deliveries).', points: 5 },
                    { value: 'mid', label: '🔧 Did not experience special deliveries (Might need guidance on lockers or OTP deliveries).', points: 3 }
                ]
            },
            // Special note questions
            {
                id: 'coached',
                title: 'Emergency Coached On-Road',
                question: 'Emergency Coached On-Road',
                isNote: true,
                hasInput: true,
                inputLabel: 'Enter number of stops behind',
                inputId: 'stops-behind',
                options: [
                    { value: 'include', label: '🚨 Emergency coached on-road: Driver required interruption for re-training due to falling behind.', points: 0 }
                ]
            },
            {
                id: 'more_details',
                title: 'More Details',
                question: 'More Details',
                isNote: true,
                options: [
                    { value: 'include', label: 'More details available if needed.', points: 0 }
                ]
            },
            {
                id: 'checklist',
                title: 'Checklist Posting',
                question: 'Checklist Posting',
                isNote: true,
                emote: '😓',
                options: [
                    { value: 'include', label: 'Ride-along checklist will be posted soon, sorry for the inconvenience.', points: 0 }
                ]
            }
        ];
    }

    setTraineeName(name) {
        this.traineeName = name;
    }

    setEvaluationData(questionId, value, points, inputValue = null) {
        if (value === null || points === null) {
            // Remove the evaluation data for deselection
            delete this.evaluationData[questionId];
        } else {
            // Check if this is a multiple selection question
            const question = this.questions.find(q => q.id === questionId);
            if (question && question.isMultiple) {
                // For multiple selections, store as array
                this.evaluationData[questionId] = Array.isArray(value) ? value : [value];
            } else if (question && question.isNote) {
                // For note questions, store with input value
                this.evaluationData[questionId] = { value, points, inputValue };
            } else {
                // For single selections, store as object
                this.evaluationData[questionId] = { value, points };
            }
        }
    }

    getTotalScore() {
        let totalScore = 0;

        Object.entries(this.evaluationData).forEach(([questionId, data]) => {
            // Skip questions that don't contribute to scoring
            if (['first_day_issues', 'coached', 'handled_challenges', 'more_details', 'checklist'].includes(questionId)) {
                return;
            }

            if (data && data.points !== undefined) {
                totalScore += data.points;
            }
        });

        return totalScore;
    }

    getMaxScore() {
        // Count only questions that contribute to scoring
        const scoringQuestions = this.questions.filter(q =>
            !['first_day_issues', 'coached', 'handled_challenges', 'more_details', 'checklist'].includes(q.id)
        );
        return scoringQuestions.length * 5;
    }

    getScorePercentage() {
        return Math.round((this.getTotalScore() / this.getMaxScore()) * 100);
    }

    getPerformanceLevel() {
        const percentage = this.getScorePercentage();
        if (percentage >= 90) return 'Outstanding';
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 70) return 'Good';
        if (percentage >= 60) return 'Satisfactory';
        if (percentage >= 50) return 'Needs Improvement';
        return 'Unsatisfactory';
    }

    reset() {
        this.traineeName = '';
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

    const traineeNameInput = document.getElementById('trainee-name-input');
    const traineeName = traineeNameInput.value.trim();

    if (!traineeName) {
        showNotification('Please enter the trainee name', 'error');
        return;
    }

    rideAlongState.setTraineeName(traineeName);
    showRideAlongScreen('evaluation-screen');
    renderEvaluationStep();
}

function renderEvaluationStep() {
    const evaluationGrid = document.querySelector('.evaluation-grid');
    if (!evaluationGrid) return;

    const question = rideAlongState.questions[rideAlongState.currentStep];
    if (!question) return;

    evaluationGrid.innerHTML = `
        <div class="evaluation-item">
            <div class="evaluation-question">
                <strong>${question.title}</strong>
            </div>
            <div class="evaluation-options">
                ${question.options.map(option => {
                    let isSelected = false;

                    if (question.isMultiple) {
                        // For multiple selection questions, check if option is in the array
                        const currentSelections = rideAlongState.evaluationData[question.id];
                        isSelected = currentSelections && Array.isArray(currentSelections) && currentSelections.includes(option.value);
                    } else {
                        // For single selection questions, check if this is the selected option
                        const currentSelection = rideAlongState.evaluationData[question.id];
                        isSelected = currentSelection && currentSelection.value === option.value;
                    }

                    return `
                        <button class="option-btn ${isSelected ? 'selected' : ''} ${question.isMultiple ? 'multiple-choice' : ''}"
                                data-value="${option.value}"
                                data-points="${option.points}"
                                onclick="selectEvaluationOption('${question.id}', '${option.value}', ${option.points})">
                            ${option.label}
                        </button>
                    `;
                }).join('')}

                ${question.hasInput ? `
                    <div class="evaluation-input" id="${question.inputId}-container" style="display: ${rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].value === 'include' ? 'block' : 'none'};">
                        <input type="number"
                               id="${question.inputId}-input"
                               placeholder="${question.inputLabel}"
                               min="0"
                               value="${rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].inputValue ? rideAlongState.evaluationData[question.id].inputValue : ''}"
                               oninput="updateNoteInput('${question.id}', '${question.inputId}')"
                               style="margin-top: 10px; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); width: 200px;">
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    updateNavigationButtons();
}

function updateNoteInput(questionId, inputId) {
    const input = document.getElementById(inputId + '-input');
    if (input) {
        const inputValue = input.value;
        const existingData = rideAlongState.evaluationData[questionId];
        if (existingData) {
            existingData.inputValue = inputValue;
        }
    }
    updateNavigationButtons(); // Update navigation buttons when input changes
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

    // Validate coached question if selected
    if (currentQuestion && currentQuestion.id === 'coached') {
        const coachedData = rideAlongState.evaluationData['coached'];
        if (coachedData && coachedData.value === 'include') {
            const input = document.getElementById('stops-behind-input');
            if (input && input.value && input.value.trim() !== '') {
                // Update the input value in the state only if provided
                coachedData.inputValue = input.value.trim();
            }
            // Don't block progression if no input is provided - it's optional
        }
    }

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

function selectEvaluationOption(questionId, value, points) {
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
    handleSingleSelection(questionId, value, points, clickedButton);
}

function handleSingleSelection(questionId, value, points, clickedButton) {
    // Check if this button is already selected
    if (clickedButton.classList.contains('selected')) {
        // If already selected, deselect it
        clickedButton.classList.remove('selected');

        // Remove the selection from state
        rideAlongState.setEvaluationData(questionId, null, null);

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
        rideAlongState.setEvaluationData(questionId, value, points);

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
        const currentSelections = rideAlongState.evaluationData[questionId] || [];
        const updatedSelections = currentSelections.filter(sel => sel !== value);
        rideAlongState.setEvaluationData(questionId, updatedSelections.length > 0 ? updatedSelections : null);

        // Update navigation buttons
        updateNavigationButtons();

        showNotification('Option deselected', 'info');
    } else {
        // If not selected, add it
        clickedButton.classList.add('selected');

        // Add to state array
        const currentSelections = rideAlongState.evaluationData[questionId] || [];
        const updatedSelections = [...currentSelections, value];
        rideAlongState.setEvaluationData(questionId, updatedSelections);

        // Update navigation buttons
        updateNavigationButtons();

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
            rideAlongState.setEvaluationData(questionId, null, null);

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
            rideAlongState.setEvaluationData(questionId, value, 0, inputValue);

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

    // Validate coached question if selected
    if (currentQuestion && currentQuestion.id === 'coached') {
        const coachedData = rideAlongState.evaluationData['coached'];
        if (coachedData && coachedData.value === 'include') {
            const input = document.getElementById('stops-behind-input');
            if (input && input.value && input.value.trim() !== '') {
                // Update the input value in the state only if provided
                coachedData.inputValue = input.value.trim();
            }
            // Don't block progression if no input is provided - it's optional
        }
    }

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

function generateReport() {
    const reportText = document.getElementById('report-text');
    if (!reportText) return;

    const traineeName = rideAlongState.traineeName || 'Unknown Trainee';

    let report = `RIDE-ALONG FEEDBACK\n==========================================\n\n`;

    // SUMMARY section
    report += `SUMMARY\n--------------------------------------------------------- \n`;

    // Handle emergency coached first
    const coached = rideAlongState.questions.find(q => q.id === 'coached');
    if (coached && rideAlongState.evaluationData[coached.id]) {
        const coachedData = rideAlongState.evaluationData[coached.id];
        if (coachedData.value === 'include') {
            let coachedText = `🚨 Emergency Ride-Along: Driver required interruption for re-training due to falling behind excessively.`;
            if (coachedData.inputValue) {
                coachedText += ` The driver was ${coachedData.inputValue} stops behind.`;
            }
            report += coachedText + '\n';
        }
    }

    // Handle overall comment
    const overallComment = rideAlongState.questions.find(q => q.id === 'overall_comment');
    if (overallComment && rideAlongState.evaluationData[overallComment.id]) {
        const commentData = rideAlongState.evaluationData[overallComment.id];
        const selectedOption = overallComment.options.find(opt => opt.value === commentData.value);
        if (selectedOption) {
            report += `Overall: ${selectedOption.label}\n`;
        }
    }

    // Handle driver feelings
    const driverFeeling = rideAlongState.questions.find(q => q.id === 'driver_feeling');
    if (driverFeeling && rideAlongState.evaluationData[driverFeeling.id]) {
        const feelingData = rideAlongState.evaluationData[driverFeeling.id];
        const selectedOption = driverFeeling.options.find(opt => opt.value === feelingData.value);
        if (selectedOption) {
            report += `Driver feelings: ${selectedOption.label}\n`;
        }
    }

    report += '\n';

    // Group evaluations by performance level
    const goods = [];
    const mids = [];
    const bads = [];

    rideAlongState.questions.forEach(question => {
        if (['coached', 'overall_comment', 'first_day_issues', 'driver_feeling', 'more_details', 'checklist'].includes(question.id)) {
            return; // Skip these special questions in the main evaluation
        }

        const response = rideAlongState.evaluationData[question.id];
        if (!response) return;

        let responseText = '';
        // Find the option that matches the selected value
        const selectedOption = question.options.find(option => option.value === response.value);
        if (selectedOption) {
            responseText = selectedOption.label;
            // Group by performance level based on points or value
            if (response.value === 'good' || (response.points && response.points >= 4)) {
                goods.push(responseText);
            } else if (response.value === 'mid' || (response.points && response.points >= 2 && response.points < 4)) {
                mids.push(responseText);
            } else if (response.value === 'bad' || (response.points && response.points < 2)) {
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
        const selectedIssues = rideAlongState.evaluationData[firstDayIssues.id];
        if (Array.isArray(selectedIssues) && selectedIssues.length > 0) {
            const issueTexts = selectedIssues.map(value => {
                const option = firstDayIssues.options.find(opt => opt.value === value);
                return option ? option.label : value;
            });
            specialNotes.push(...issueTexts);
        }
    }

    // Handle other notes
    const moreDetails = rideAlongState.questions.find(q => q.id === 'more_details');
    if (moreDetails && rideAlongState.evaluationData[moreDetails.id]) {
        specialNotes.push(moreDetails.options[0].label);
    }

    const checklist = rideAlongState.questions.find(q => q.id === 'checklist');
    if (checklist && rideAlongState.evaluationData[checklist.id]) {
        specialNotes.push(`${checklist.emote} ${checklist.options[0].label}`);
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
        recommendations.push('Comments: Please help organize the van on the launchpad next working day.');
    }

    if (recommendations.length > 0) {
        report += `RECOMMENDATIONS\n---------------------------------------------------------\n`;
        report += recommendations.join('\n') + '\n';
    }

    reportText.value = report.trim();
    showRideAlongScreen('report-screen');
}

function generateRecommendations(performanceLevel, evaluationData) {
    const recommendations = [];

    // Analyze weak areas
    const weakAreas = Object.entries(evaluationData)
        .filter(([_, data]) => data.points <= 2)
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
        showRideAlongScreen('trainee-name-screen');
        document.getElementById('trainee-name-input').value = '';
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
// Initialization
// ========================================

// Make functions globally accessible for HTML onclick handlers
window.nextEvaluationStep = nextEvaluationStep;
window.prevEvaluationStep = prevEvaluationStep;
window.copyReport = copyReport;
window.startNewReport = startNewReport;

console.log('Ride Along Tool loaded and ready');
