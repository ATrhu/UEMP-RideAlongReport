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
            // 1. Emergency Ride-Along (stays first)
            {
                id: 'coached',
                title: 'Emergency Ride-Along',
                question: 'Was this an emergency interruption during the driver\'s route?',
                hasInput: true,
                inputLabel: 'How many stops was the driver behind?',
                inputId: 'stops-behind',
                options: [
                    { value: 'yes', label: 'Yes - Emergency interruption required', points: 0 },
                    { value: 'no', label: 'No - Regular scheduled ride-along', points: 0 }
                ]
            },
            // 2. Driving Aptitudes
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
            // 3. Van Organization
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
            // 4. Bag vs Overflows
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
            // 5. Flex App Usage
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
            // 6. Picture on Delivery
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
            // 7. Customer Instructions
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
            // 8. House Deliveries
            {
                id: 'house_deliveries',
                title: 'House Deliveries',
                question: 'House Deliveries',
                options: [
                    { value: 'good', label: '✅ Mastered deliverying to houses and stops with multiple locations are no problem.', points: 5 },
                    { value: 'mid', label: '🔧 Minor difficulty with house deliveries; gets confused by stops with multiple locations.', points: 3 },
                    { value: 'bad', label: '❌ Doesn\'t understand stops with multiple locations. risks deliverying to the wrong houses/addresses.', points: 1 }
                ]
            },
            // 9. Building Deliveries
            {
                id: 'building_deliveries',
                title: 'Building Deliveries',
                question: 'Building Deliveries',
                options: [
                    { value: 'good', label: '✅ Understands how to handle building deliveries: door to door, package rooms, receptionists.', points: 5 },
                    { value: 'mid', label: '🔧 Didn\'t experience building deliveries today.(might need coaching on that).', points: 3 },
                    { value: 'bad', label: '❌ Hates apartment buildings; complains about having to go upstairs door to door.', points: 1 }
                ]
            },
            // 10. Delivery Speed
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
            // 11. Identify Addresses
            {
                id: 'identify_addresses',
                title: 'Identify Addresses',
                question: 'Identify Addresses',
                options: [
                    { value: 'good', label: '✅ Identifies the correct addresses without difficulty.', points: 5 },
                    { value: 'mid', label: '🔧 Occasionally struggles with identifying the correct addresses.', points: 3 },
                    { value: 'bad', label: '❌ Constantly struggles with identifying the correct addresses.', points: 1 }
                ]
            },
            // 12. Map/GPS Skills
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
            // 13. Undeliverable Packages
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
            // 14. Proper Parking Sequence
            {
                id: 'parking',
                title: 'Proper Parking Sequence',
                question: 'Proper Parking Sequence',
                options: [
                    { value: 'good', label: '✅ Knows and follows the proper parking sequence.', points: 5 },
                    { value: 'mid', label: '🔧 Occasionally misses the proper parking sequence.', points: 3 },
                    { value: 'bad', label: '❌ Didn\'t have the chance to learn the proper parking sequence.', points: 1 }
                ]
            },
            // 15. Special Deliveries Experience
            {
                id: 'handled_challenges',
                title: 'Special Deliveries Experience',
                question: 'Special Deliveries Experience',
                options: [
                    { value: 'good', label: '✅ Had the chance to experience special deliveries (lockers or OTP deliveries).', points: 5 },
                    { value: 'mid', label: '🔧 Did not experience special deliveries (Might need guidance on lockers or OTP deliveries).', points: 3 }
                ]
            },
            // 16. Gas Card & Powered by Amazon App
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
            // 17. Timecard Editing
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
            // 18. Customer Treatment
            {
                id: 'polite',
                title: 'Customer Treatment',
                question: 'Customer Treatment',
                options: [
                    { value: 'good', label: '✅ Polite and respectful with customers.', points: 5 },
                    { value: 'bad', label: '❌ Not always polite or respectful with customers.', points: 1 }
                ]
            },
            // 19. Language Challenges
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
            // 20. Trainer Feedback
            {
                id: 'trainer_compliments',
                title: 'Trainer Feedback',
                question: 'Trainer Feedback (Select all that apply)',
                isMultiple: true,
                hasInput: true,
                inputLabel: 'Describe the compliment',
                inputId: 'other-compliment',
                options: [
                    { value: 'quick_learner', label: '✅ Quick learner', points: 5 },
                    { value: 'positive_attitude', label: '✅ Very positive attitude', points: 5 },
                    { value: 'great_effort', label: '✅ Showed great effort and determination', points: 5 },
                    { value: 'good_communication', label: '✅ Good communication skills', points: 4 },
                    { value: 'reliable', label: '✅ Reliable and consistent', points: 4 },
                    { value: 'adaptable', label: '✅ Adaptable to changing situations', points: 4 },
                    { value: 'slow_learner', label: '🔧 Takes time to learn new concepts', points: 3 },
                    { value: 'other_compliment', label: '🦋 Other compliment', points: 5 },
                    { value: 'communication_issues', label: '🔧 Struggles to communicate', points: 2 },
                    { value: 'unreliable', label: '❌ Unreliable or inconsistent performance', points: 1 },
                    { value: 'negative_attitude', label: '❌ Negative attitude or reluctant to learn', points: 1 },
                    { value: 'lazy', label: '❌ Seems lazy or unmotivated', points: 1 }
                ]
            },
            // 21. Driver Feelings
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
                    { value: 'bad_mental', label: '👎 Bad mindset/ poor attitude.', points: 1 }
                ]
            },
            // 22. Overall Comment
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
                    { value: 'did_crazy', label: '🥶 Did crazy good today', points: 5 },
                    { value: 'overwhelmed_today', label: '🫨 Overwhelmed today', points: 1 },
                    { value: 'did_good', label: '🤘🏼 Did good today', points: 4 }
                ]
            },
            // 23. First Day Experience Issues
            {
                id: 'first_day_issues',
                title: 'First Day Experience Issues',
                question: 'First Day Experience Issues (Select all that apply)',
                isMultiple: true,
                hasInput: true,
                inputLabel: 'Describe the issue',
                inputId: 'custom-issue',
                options: [
                    { value: 'morning_van_issues', label: '⚠️ Faced issues with the van.', points: 0 },
                    { value: 'equipment_issues', label: '⚠️ Faced issues with equipment (phone, etc.).', points: 0 },
                    { value: 'route_issues', label: '⚠️ Faced issues with the route (awful route, bad sequencing, etc.).', points: 0 },
                    { value: 'only_buildings', label: '⚠️ Had an only buildings route.', points: 0 },
                    { value: 'not_nursery', label: '⚠️ Had to do a non-nursery route on the first day.', points: 0 },
                    { value: 'custom_issue', label: '⚠️ Other issue (describe below)', points: 0 }
                ]
            },
            // 24. Prior Experience
            {
                id: 'experienced',
                title: 'Prior Experience',
                question: 'Does the driver have prior experience with Amazon or similar delivery routes?',
                options: [
                    { value: 'yes', label: 'Yes - Experienced from prior routes', points: 5 },
                    { value: 'no', label: 'No - Zero experience as a carrier', points: 3 }
                ]
            },
            // 25. Driver Confidence
            {
                id: 'feels_ready',
                title: 'Driver Confidence',
                question: 'Does the driver feel ready and confident to go solo?',
                options: [
                    { value: 'yes', label: 'Yes - Ready and confident to go solo', points: 5 },
                    { value: 'no', label: 'No - Not confident going alone yet', points: 3 }
                ]
            },
            // 26. Training Readiness
            {
                id: 'training_needed',
                title: 'Training Readiness',
                question: 'According to you, is the trainee ready to go solo?',
                options: [
                    { value: 'yes', label: 'Yes - Ready to go solo immediately', points: 5 },
                    { value: 'one_more', label: 'No - One more ride-along session needed', points: 3 },
                    { value: 'multiple_more', label: 'No - Multiple additional sessions needed', points: 1 }
                ]
            },
            // 27. Report Accuracy
            {
                id: 'more_details',
                title: 'Report Accuracy',
                question: 'Is the report accurate enough or do you have more details available?',
                options: [
                    { value: 'yes', label: 'Yes - Report is accurate enough', points: 5 },
                    { value: 'no', label: 'No - More details available', points: 0 }
                ]
            },

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
                // For multiple selections, store as object with selections and inputValue
                const existingData = this.evaluationData[questionId];
                this.evaluationData[questionId] = {
                    selections: Array.isArray(value) ? value : [value],
                    inputValue: inputValue || (existingData && existingData.inputValue) || null
                };
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
            if (['first_day_issues', 'coached', 'handled_challenges', 'trainer_compliments', 'more_details'].includes(questionId)) {
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
            !['first_day_issues', 'coached', 'handled_challenges', 'trainer_compliments', 'more_details'].includes(q.id)
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

    evaluationGrid.innerHTML = `
        <div class="evaluation-item">
            <div class="evaluation-question">
                <strong>${question.title}</strong>
                <br><span style="font-weight: normal; font-size: 0.9em; color: var(--text-secondary);">${instructionText}</span>
            </div>
                            <div class="evaluation-options ${question.hasInput ? 'has-input-field' : ''} ${question.id === 'trainer_compliments' ? 'trainer-feedback-circle' : ''}">
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
                                data-points="${option.points}"
                                onclick="selectEvaluationOption('${question.id}', '${option.value}', ${option.points})">
                            ${option.label}
                        </button>
                    `;
                }).join('')}

                ${question.hasInput ? `
                    <div class="evaluation-input" id="${question.inputId}-container" style="min-height: 60px; margin-top: ${question.id === 'trainer_compliments' ? '20px' : '15px'}; opacity: ${question.id === 'coached' ? (rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].value === 'yes' ? '1' : '0') : (question.id === 'trainer_compliments' ? (rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].selections && Array.isArray(rideAlongState.evaluationData[question.id].selections) && rideAlongState.evaluationData[question.id].selections.includes('other_compliment') ? '1' : '0') : (rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].selections && Array.isArray(rideAlongState.evaluationData[question.id].selections) && rideAlongState.evaluationData[question.id].selections.includes('custom_issue') ? '1' : '0'))}; pointer-events: ${question.id === 'coached' ? (rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].value === 'yes' ? 'auto' : 'none') : (question.id === 'trainer_compliments' ? (rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].selections && Array.isArray(rideAlongState.evaluationData[question.id].selections) && rideAlongState.evaluationData[question.id].selections.includes('other_compliment') ? 'auto' : 'none') : (rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].selections && Array.isArray(rideAlongState.evaluationData[question.id].selections) && rideAlongState.evaluationData[question.id].selections.includes('custom_issue') ? 'auto' : 'none'))}; transition: opacity 0.3s ease; text-align: center;">
                        <label for="${question.inputId}-input" style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-primary); text-align: center;">${question.inputLabel}</label>
                        <input type="${question.id === 'coached' ? 'number' : 'text'}"
                               id="${question.inputId}-input"
                               ${question.id === 'coached' ? 'min="0"' : ''}
                               value="${rideAlongState.evaluationData[question.id] && rideAlongState.evaluationData[question.id].inputValue ? rideAlongState.evaluationData[question.id].inputValue : ''}"
                               oninput="updateNoteInput('${question.id}', '${question.inputId}')"
                               style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); width: ${question.id === 'coached' ? '200px' : '300px'}; display: block; margin: 0 auto;">
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    updateNavigationButtons();

    // Update input field visibility for all sections
    if (question.hasInput) {
        if (question.id === 'first_day_issues') {
            const data = rideAlongState.evaluationData[question.id];
            const selections = data && data.selections ? data.selections : data;
            updateCustomIssueVisibility(selections);
        } else if (question.id === 'coached') {
            const inputContainer = document.getElementById('stops-behind-container');
            if (inputContainer) {
                const evaluationData = rideAlongState.evaluationData[question.id];
                if (evaluationData && evaluationData.value === 'yes') {
                    inputContainer.style.opacity = '1';
                    inputContainer.style.pointerEvents = 'auto';
                } else {
                    inputContainer.style.opacity = '0';
                    inputContainer.style.pointerEvents = 'none';
                }
            }
        } else if (question.id === 'trainer_compliments') {
            const inputContainer = document.getElementById('other-compliment-container');
            if (inputContainer) {
                const data = rideAlongState.evaluationData[question.id];
                const selections = data && data.selections ? data.selections : data;
                if (selections && Array.isArray(selections) && selections.includes('other_compliment')) {
                    inputContainer.style.opacity = '1';
                    inputContainer.style.pointerEvents = 'auto';
                    // Position the input field below the circular layout
                    inputContainer.style.position = 'relative';
                    inputContainer.style.zIndex = '10';
                } else {
                    inputContainer.style.opacity = '0';
                    inputContainer.style.pointerEvents = 'none';
                }
            }
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

    // Validate coached question if selected
    if (currentQuestion && currentQuestion.id === 'coached') {
        const coachedData = rideAlongState.evaluationData['coached'];
        if (coachedData && coachedData.value === 'yes') {
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

        // Handle input field for coached question
        if (questionId === 'coached') {
            const inputContainer = document.getElementById('stops-behind-container');
            if (inputContainer) {
                inputContainer.style.opacity = '0';
                inputContainer.style.pointerEvents = 'none';
            }
        }

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

        // Handle input field for coached question
        if (questionId === 'coached') {
            const inputContainer = document.getElementById('stops-behind-container');
            if (value === 'yes') {
                if (inputContainer) {
                    inputContainer.style.opacity = '1';
                    inputContainer.style.pointerEvents = 'auto';
                    const input = document.getElementById('stops-behind-input');
                    if (input) {
                        input.focus();
                        // Store initial value if it exists
                        const existingData = rideAlongState.evaluationData[questionId];
                        if (existingData && existingData.inputValue) {
                            input.value = existingData.inputValue;
                        }
                    }
                }
            } else {
                if (inputContainer) {
                    inputContainer.style.opacity = '0';
                    inputContainer.style.pointerEvents = 'none';
                }
            }
        }

        // Update navigation buttons
        updateNavigationButtons();

        // Show notification
        showNotification('Option selected', 'success');
    }
}

function handleMultipleSelection(questionId, value, clickedButton) {
    // Handle mutually exclusive options for trainer feedback
    if (questionId === 'trainer_compliments') {
        const mutuallyExclusivePairs = [
            ['quick_learner', 'slow_learner'],
            ['needs_encouragement', 'lazy']
        ];

        // Check if the selected value conflicts with any existing selections
        for (const [option1, option2] of mutuallyExclusivePairs) {
            if (value === option1 || value === option2) {
                const conflictValue = value === option1 ? option2 : option1;
                const currentData = rideAlongState.evaluationData[questionId];
                const currentSelections = currentData && currentData.selections ? currentData.selections : [];

                // If the conflicting option is selected, deselect it
                if (currentSelections.includes(conflictValue)) {
                    // Remove the conflicting option from selections
                    const conflictButton = document.querySelector(`button[data-value="${conflictValue}"]`);
                    if (conflictButton) {
                        conflictButton.classList.remove('selected');
                    }

                    // Update the state to remove the conflicting option
                    const updatedSelections = currentSelections.filter(sel => sel !== conflictValue);
                    if (!updatedSelections.includes(value)) {
                        updatedSelections.push(value);
                    }
                    rideAlongState.setEvaluationData(questionId, updatedSelections, 0);

                    clickedButton.classList.add('selected');
                    updateNavigationButtons();
                    showNotification('Conflicting option automatically deselected', 'info');
                    return;
                }
            }
        }
    }

    // Toggle selection for multiple choice questions
    if (clickedButton.classList.contains('selected')) {
        // If already selected, deselect it
        clickedButton.classList.remove('selected');

        // Remove from state array
        const currentData = rideAlongState.evaluationData[questionId];
        const currentSelections = currentData && currentData.selections ? currentData.selections : [];
        const updatedSelections = currentSelections.filter(sel => sel !== value);
        if (updatedSelections.length > 0) {
            rideAlongState.setEvaluationData(questionId, updatedSelections, 0);
        } else {
            rideAlongState.setEvaluationData(questionId, null, null);
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
        rideAlongState.setEvaluationData(questionId, updatedSelections, 0);

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
        if (coachedData && coachedData.value === 'yes') {
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

    // Check if there are any evaluation responses
    const hasEvaluationData = Object.keys(rideAlongState.evaluationData).some(questionId => {
        const question = rideAlongState.questions.find(q => q.id === questionId);
        // Exclude special questions that don't count as evaluation data
        return question && !['coached', 'overall_comment', 'first_day_issues', 'driver_feeling', 'trainer_compliments', 'more_details'].includes(questionId);
    });

    // Only add SUMMARY section if there are evaluation responses
    if (hasEvaluationData) {
        report += `SUMMARY\n--------------------------------------------------------- \n`;
    }

    // Handle emergency ride-along first (appears at the top of report)
    const coached = rideAlongState.questions.find(q => q.id === 'coached');
    if (coached && rideAlongState.evaluationData[coached.id]) {
        const coachedData = rideAlongState.evaluationData[coached.id];
        if (coachedData.value === 'yes') {
            let coachedText = `🚨 EMERGENCY RIDE-ALONG: This was an emergency interruption during the driver's route due to falling excessively behind on deliveries.`;
            if (coachedData.inputValue) {
                coachedText += ` The driver was ${coachedData.inputValue} stops behind.`;
            }
            report += coachedText + '\n\n';
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

    // Only add newline and evaluation sections if there are evaluation responses
    if (hasEvaluationData) {
        report += '\n';

        // Group evaluations by performance level
        const goods = [];
        const mids = [];
        const bads = [];

        rideAlongState.questions.forEach(question => {
            if (['coached', 'overall_comment', 'first_day_issues', 'driver_feeling', 'trainer_compliments', 'more_details'].includes(question.id)) {
                return; // Skip these special questions in the main evaluation
            }

            const response = rideAlongState.evaluationData[question.id];
            if (!response) return;

            let responseText = '';

            // Handle multiple selection questions specially
            if (question.id === 'trainer_compliments' && question.isMultiple) {
                // Skip trainer compliments here as it will be handled separately
                return;
            }

            // Find the option that matches the selected value
            const selectedOption = question.options.find(option => option.value === response.value);
            if (selectedOption) {
                responseText = selectedOption.label;
                // Group by performance level based on points or value
                if (response.value === 'good' || response.value === 'yes' || (response.points && response.points >= 4)) {
                    goods.push(responseText);
                } else if (response.value === 'mid' || response.value === 'no' || (response.points && response.points >= 2 && response.points < 4)) {
                    mids.push(responseText);
                } else if (response.value === 'bad' || response.value === 'one_more' || response.value === 'multiple_more' || (response.points && response.points < 2)) {
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

        // TRAINER FEEDBACK section
        const trainerCompliments = rideAlongState.questions.find(q => q.id === 'trainer_compliments');
        if (trainerCompliments && rideAlongState.evaluationData[trainerCompliments.id]) {
            const complimentsData = rideAlongState.evaluationData[trainerCompliments.id];
            if (complimentsData.selections && Array.isArray(complimentsData.selections) && complimentsData.selections.length > 0) {
                const complimentTexts = complimentsData.selections.map(value => {
                    if (value === 'other_compliment') {
                        // Handle custom compliment with user input
                        const customText = complimentsData.inputValue;
                        return customText ? `🦋 ${customText}` : '🦋 The trainer likes the new hire';
                    }
                    const option = trainerCompliments.options.find(opt => opt.value === value);
                    return option ? option.label : value;
                });
                report += `TRAINER FEEDBACK\n---------------------------------------------------------\n`;
                report += complimentTexts.join('\n') + '\n\n';
            }
        }
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
