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
                    { value: 'bad', label: '🔧 Not always polite or respectful with customers.' }
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

    setTraineeName(name) {
        this.traineeName = name;
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

console.log('Test');
