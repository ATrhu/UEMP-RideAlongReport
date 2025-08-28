// Define skills here - each object has id, label, and texts for good/mid/bad
// Change the texts in 'good', 'mid', 'bad' to update sentences
const skills = [
    {
        id: 'flex',
        label: 'Flex App Usage', // Change label here
        good: 'Good understanding of Flex app usage.',
        mid: 'Needs time to get used to the Flex app.',
        bad: 'Limited understanding of Flex app usage.'
    },
    {
        id: 'organize_van',
        label: 'Organize Van',
        good: 'Knows how to organize van with overflows and bags.',
        mid: 'Needs more practice organizing van with overflows and bags.',
        bad: 'Does not know how to organize van with overflows and bags.'
    },
    {
        id: 'bag_overflow',
        label: 'Bag vs Overflows',
        good: 'Understands difference between bag packages and overflows; knows where to look without wasting time.',
        mid: 'Partial understanding of bag vs overflows; some confusion.',
        bad: 'Confuses bag packages and overflows; wastes time searching wrong places.'
    },
    {
        id: 'customer_instructions',
        label: 'Customer Instructions',
        good: 'Follows customer instructions.',
        mid: 'Follows customer instructions with minor issues.',
        bad: 'Does not follow customer instructions consistently.'
    },
    {
        id: 'language',
        label: 'Language Challenges',
        good: 'No language challenges noted.',
        mid: 'Minor language challenges.',
        bad: 'Language Barrier.'
    },
    {
        id: 'mark_undeliverable',
        label: 'Mark Undeliverable',
        good: 'Knows how to mark undeliverable packages correctly (e.g., damage, missing, closed business).',
        mid: 'Needs guidance on marking undeliverable packages.',
        bad: 'Does not know how to mark undeliverable packages correctly.'
    },
    {
        id: 'photos',
        label: 'Photos',
        good: 'Takes clear photos.',
        mid: 'Photos need improvement.',
        bad: 'Takes unclear or poor photos.'
    },
    {
        id: 'polite',
        label: 'Polite with Customers',
        good: 'Polite with customers.',
        mid: 'Generally polite, but room for improvement.',
        bad: 'Not always polite with customers.'
    },
    {
        id: 'driving',
        label: 'Driving Skills',
        good: 'Strong driver: full stops, speed limits, follows traffic rules.',
        mid: 'Adequate driver, needs some refinement.',
        bad: 'Weak driver: ignores stops, speeds, breaks traffic rules.'
    },
    {
        id: 'building_deliveries',
        label: 'Building Deliveries',
        good: 'Knows how to handle building deliveries: upstairs, package rooms, reception, organizes by floor.',
        mid: 'Needs more practice with building deliveries.',
        bad: 'Struggles with building deliveries: avoids upstairs, mishandles package rooms/reception, poor organization.'
    },
    {
        id: 'house_deliveries',
        label: 'House Deliveries',
        good: 'Knows how to handle house deliveries: organizes packages, special notes (e.g., back door), multiple stops.',
        mid: 'Needs more practice with house deliveries.',
        bad: 'Struggles with house deliveries: poor organization, ignores special notes, risks multiple-stop errors.'
    },
    {
        id: 'delivery_speed',
        label: 'Delivery Speed',
        good: 'Delivers quickly: photo and go.',
        mid: 'Delivery speed is average; some extra time at stops.',
        bad: 'Delivers slowly; spends extra time at stops.'
    },
    {
        id: 'identify_addresses',
        label: 'Identify Addresses',
        good: 'Identifies addresses accurately.',
        mid: 'Occasionally struggles with address identification.',
        bad: 'Struggles to identify addresses accurately.'
    },
    {
        id: 'parking',
        label: 'Parking Sequence',
        good: 'Knows proper parking sequence.',
        mid: 'Needs reminder on parking sequence.',
        bad: 'Does not know proper parking sequence.'
    },
    {
        id: 'gps',
        label: 'Map/GPS Skills',
        good: 'Good map/GPS skills.',
        mid: 'Needs improvement on map/GPS skills.',
        bad: 'Poor map/GPS skills.'
    },
    {
        id: 'learner',
        label: 'Learning Speed',
        good: 'Quick learner overall.',
        mid: 'Average learner; takes time.',
        bad: 'Slow learner overall.'
    },
    {
        id: 'attitude',
        label: 'Attitude',
        good: 'Positive attitude and eager to learn.',
        mid: 'Neutral attitude; moderate interest in learning.',
        bad: 'Negative attitude or reluctant to learn.'
    },
    {
        id: 'gas_card',
        label: 'Gas Card & Powered by Amazon App',
        good: 'Knows how to use the gas card and Powered by Amazon app.',
        mid: 'Needs more guidance on using the gas card and Powered by Amazon app.',
        bad: 'Does not know how to use the gas card and Powered by Amazon app.'
    },
    {
        id: 'time_card',
        label: 'Timecard Editing',
        good: 'Knows how to edit timecard and meal period times.',
        mid: 'Needs more guidance on editing timecard and meal period times.',
        bad: 'Does not know how to edit timecard and meal period times.'
    },
    {
        id: 'feels_ready',
        label: 'Feels Ready',
        good: 'Feels ready and confident to go solo on the next scheduled day.',
        mid: 'Needs one more day of training; does not feel confident going alone yet.',
        bad: 'Does not feel ready to go solo on the next scheduled day.'
    },
    {
        id: 'driver_feeling',
        label: 'Driver Feeling',
        overwhelmed: '😵‍💫 Feels overwhelmed about the job.', // Change emojis or texts here
        happy: '😊 Feels happy about the job.',
        confident: '💪 Feels confident about the job.',
        challenged: '🏆 Feels challenged in a positive way.',
        good_mental: '👍 Good mental state.',
        bad_mental: '👎 Bad mental state.',
        lazy: '😴 Seems lazy about the job.'
    },
    {
        id: 'overall_comment',
        label: 'Overall Comment',
        killed_it: '🔥 Killed it today',
        struggled: '🙈 Struggled today',
        had_easy: '😎 Had it easy today',
        pushed_through: '🫡 Pushed through it today',
        did_amazing: '🤩 Did amazing today',
        had_fun: '🤪 Had fun today',
        did_crazy: '🥶 Did crazy today',
        did_insane: '🤯 Did insaneeee today',
        hmm: '🤔 Hmm today',
        overwhelmed_today: '🫨 Overwhelmed today',
        did_good: '🤘🏼 Did good today'
    },
    {
        id: 'experienced',
        label: 'Experience Level',
        good: 'Experienced from prior routes.',
        mid: '', // No mid option, leave empty
        bad: 'Little or no experience as a carrier.'
    },
    {
        id: 'training_needed',
        label: 'Training Needed',
        good: "Doesn't need more training overall.",
        mid: 'Needs some more training.',
        bad: 'Will need a lot of training.'
    }
];

// Define notes here - similar to skills, change texts in 'text' or 'label'
const notes = [
    {
        id: 'coached',
        text: '🚨 Emergency coached on-road: Driver required interruption for re-training due to falling behind.',
        label: 'Emergency Coached On-Road',
        has_input: true,
        input_label: 'Stops Behind', // Change input placeholder here
        input_id: 'stops-behind'
    },
    {
        id: 'morning_issues',
        text: '⚠️ Faced issues with the van at the start of the route.',
        label: 'Morning Van Issues'
    },
    {
        id: 'equipment_issues',
        text: '⚠️ Faced issues with equipment (phone).',
        label: 'Equipment Issues'
    },
    {
        id: 'route_issues',
        text: '⚠️ Faced issues with the route itself (awful route, bad sequencing).',
        label: 'Route Issues'
    },
    {
        id: 'only_buildings',
        text: '⚠️ Only buildings route.',
        label: 'Only Buildings Route'
    },
    {
        id: 'not_nursery',
        text: '⚠️ Had to do a non-nursery route.',
        label: 'Non-Nursery Route'
    },
    {
        id: 'handled_challenges',
        text: '✅ Handled challenges like OTP issues; strengthened skills.',
        label: 'Handled Challenges'
    },
    {
        id: 'more_details',
        text: 'More details available if needed.',
        label: 'More Details'
    },
    {
        id: 'checklist',
        text: 'Ride-along checklist will be posted soon (time constraint prevented signing today).',
        label: 'Checklist Posting',
        emote: '😓' // Change emote here
    }
];

// App state - change default values if needed
let state = {
    name: '',
    selections: {},
    stops_behind: ''
};

let currentPage = 0;
const totalChoicePages = skills.length + notes.length;
const resultPageIndex = totalChoicePages + 1;

// Cache frequently used DOM elements for better performance
const domCache = {
    app: null,
    nameScreen: null,
    resultScreen: null,
    prevBtn: null,
    nextBtn: null,
    summaryText: null
};

// Initialize DOM cache
function initDOMCache() {
    domCache.app = document.getElementById('app');
    domCache.nameScreen = document.getElementById('name-screen');
    domCache.resultScreen = document.getElementById('result-screen');
    domCache.prevBtn = document.getElementById('prev-btn');
    domCache.nextBtn = document.getElementById('next-btn');
    domCache.summaryText = document.getElementById('summary-text');
}

// Initialize selections to null
skills.forEach(s => { state.selections[s.id] = null; });
notes.forEach(n => { state.selections[n.id] = null; });

// Function to create choice screens dynamically
function createChoiceScreens() {
    function createButtons(item) {
        let buttons = '';

        if (item.id === 'driver_feeling' || item.id === 'overall_comment') {
            const options = Object.keys(item).filter(key => key !== 'id' && key !== 'label');
            options.forEach(opt => {
                buttons += `
                    <button class="choice-button" data-value="${opt}" onclick="selectChoice('${item.id}', '${opt}')">
                        ${item[opt]}
                    </button>`;
            });
        } else if (item.id === 'feels_ready' || item.id === 'training_needed') {
            buttons += `
                <button class="choice-button" data-value="good" onclick="selectChoice('${item.id}', 'good')">
                    ✅ ${item.good}
                </button>
                <button class="choice-button" data-value="mid" onclick="selectChoice('${item.id}', 'mid')">
                    🔧 ${item.mid}
                </button>
                <button class="choice-button" data-value="bad" onclick="selectChoice('${item.id}', 'bad')">
                    ❌ ${item.bad}
                </button>`;
        } else if (item.id === 'experienced') {
            buttons += `
                <button class="choice-button" data-value="good" onclick="selectChoice('${item.id}', 'good')">
                    ✅ ${item.good}
                </button>
                <button class="choice-button" data-value="bad" onclick="selectChoice('${item.id}', 'bad')">
                    🔧 ${item.bad}
                </button>`;
        } else {
            buttons += `
                <button class="choice-button" data-value="good" onclick="selectChoice('${item.id}', 'good')">
                    ✅ ${item.good}
                </button>
                <button class="choice-button" data-value="mid" onclick="selectChoice('${item.id}', 'mid')">
                    🔧 ${item.mid}
                </button>
                <button class="choice-button" data-value="bad" onclick="selectChoice('${item.id}', 'bad')">
                    ❌ ${item.bad}
                </button>`;
        }
        
        buttons += `
                <button class="choice-button" data-value="dna" onclick="selectChoice('${item.id}', 'dna')">
                    DNA
                </button>`;
        
        return buttons;
    }

    skills.forEach((item, index) => {
        const screen = document.createElement('div');
        screen.id = `screen-${index + 1}`;
        screen.className = 'screen';
        screen.innerHTML = `
            <h2>${item.label}</h2>
            ${createButtons(item)}`;
        document.getElementById('app').insertBefore(screen, document.getElementById('result-screen'));
    });

    notes.forEach((item, index) => {
        const screenIndex = skills.length + index + 1;
        const screen = document.createElement('div');
        screen.id = `screen-${screenIndex}`;
        screen.className = 'screen';
        screen.innerHTML = `
            <h2>${item.label}</h2>
            <button class="choice-button" data-value="include" onclick="selectChoice('${item.id}', 'include')">
                ${item.emote ? item.emote + ' ' : ''}${item.text}
            </button>
            <button class="choice-button" data-value="dna" onclick="selectChoice('${item.id}', 'dna')">
                DNA
            </button>
            ${item.has_input ? `<input type="number" id="${item.input_id}-input" placeholder="${item.input_label}" style="display: none;">` : ''}`;
        document.getElementById('app').insertBefore(screen, document.getElementById('result-screen'));
    });
}

// Function to show a specific page
function showPage(page) {
    const allScreens = document.querySelectorAll('.screen');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    allScreens.forEach(s => s.classList.remove('active'));

    if (page === 0) {
        document.getElementById('name-screen').classList.add('active');
        document.getElementById('driver-name').value = state.name;
    } else if (page === resultPageIndex) {
        document.getElementById('result-screen').classList.add('active');
        generateSummary();
    } else {
        const screen = document.getElementById(`screen-${page}`);
        screen.classList.add('active');
        
        const item = page <= skills.length ? skills[page - 1] : notes[page - skills.length - 1];
        const selected = state.selections[item.id];
        
        const buttons = screen.querySelectorAll('button.choice-button');
        buttons.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.value === selected);
        });
        
        const input = screen.querySelector('input');
        if (input) {
            if (selected === 'include') {
                input.style.display = 'block';
                input.value = state.stops_behind || '';
            } else {
                input.style.display = 'none';
            }
        }
    }

    prevBtn.disabled = (page === 0);
    nextBtn.disabled = (page === resultPageIndex);
    currentPage = page;
}

// Function to select a choice
function selectChoice(id, value) {
    state.selections[id] = value === 'dna' ? null : value;
    const item = notes.find(n => n.id === id) || skills.find(s => s.id === id);
    if (item && item.has_input && value === 'include') {
        showPage(currentPage);
        return;
    }
    nextPage();
}

// Function for next page
function nextPage() {
    if (currentPage === 0) {
        const nameInput = document.getElementById('driver-name');
        state.name = nameInput.value.trim().toUpperCase();
        if (!state.name) {
            alert('Please enter a name.');
            return;
        }
    } else {
        const item = currentPage <= skills.length ? skills[currentPage - 1] : notes[currentPage - skills.length - 1];
        if (item.has_input && state.selections[item.id] === 'include') {
            const input = document.getElementById(`${item.input_id}-input`);
            state.stops_behind = input.value.trim();
        }
    }

    if (currentPage < resultPageIndex - 1) {
        currentPage++;
        showPage(currentPage);
    } else {
        currentPage = resultPageIndex;
        showPage(currentPage);
    }
}

// Function for previous page
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    }
}

// Function to generate the summary
function generateSummary() {
    let message = `${state.name}\n\n`;

    function getSkillText(skillId, rating) {
        const skill = skills.find(s => s.id === skillId);
        return skill ? skill[rating] : '';
    }

    function addSection(items) {
        if (items.length > 0) {
            message += items.join('\n') + '\n\n';
        }
    }

    const coached = notes.find(n => n.id === 'coached');
    if (state.selections[coached.id] === 'include') {
        let coachedText = coached.text;
        if (state.stops_behind) {
            coachedText += ` The driver was ${state.stops_behind} stops behind.`;
        }
        message += coachedText + '\n\n';
    } else if (state.selections['overall_comment']) {
        const overall = getSkillText('overall_comment', state.selections['overall_comment']);
        message += `Overall: ${overall}\n\n`;
    }

    const excludedSkills = ['feels_ready', 'driver_feeling', 'overall_comment', 'experienced', 'training_needed'];

    const goods = skills.filter(s => state.selections[s.id] === 'good' && !excludedSkills.includes(s.id)).map(s => `✅ ${s.good}`);
    const handled = notes.find(n => n.id === 'handled_challenges');
    if (state.selections[handled.id] === 'include') {
        goods.push(handled.text);
    }
    const feelsReadyGood = state.selections['feels_ready'] === 'good' ? `✅ ${getSkillText('feels_ready', 'good')}` : '';
    if (feelsReadyGood) goods.push(feelsReadyGood);
    const experiencedGood = state.selections['experienced'] === 'good' ? `✅ ${getSkillText('experienced', 'good')}` : '';
    if (experiencedGood) goods.push(experiencedGood);
    addSection(goods);

    const trainingGood = state.selections['training_needed'] === 'good' ? `✅ ${getSkillText('training_needed', 'good')}` : '';
    if (trainingGood) message += trainingGood + '\n\n';

    const mids = skills.filter(s => state.selections[s.id] === 'mid' && !excludedSkills.includes(s.id)).map(s => `🔧 ${s.mid}`);
    const feelsReadyMid = state.selections['feels_ready'] === 'mid' ? `🔧 ${getSkillText('feels_ready', 'mid')}` : '';
    if (feelsReadyMid) mids.push(feelsReadyMid);
    const experiencedBad = state.selections['experienced'] === 'bad' ? `🔧 ${getSkillText('experienced', 'bad')}` : '';
    if (experiencedBad) mids.push(experiencedBad);
    addSection(mids);

    const trainingMid = state.selections['training_needed'] === 'mid' ? `🔧 ${getSkillText('training_needed', 'mid')}` : '';
    if (trainingMid) message += trainingMid + '\n\n';

    const bads = skills.filter(s => state.selections[s.id] === 'bad' && !excludedSkills.includes(s.id)).map(s => `❌ ${s.bad}`);
    const feelsReadyBad = state.selections['feels_ready'] === 'bad' ? `❌ ${getSkillText('feels_ready', 'bad')}` : '';
    if (feelsReadyBad) bads.push(feelsReadyBad);
    addSection(bads);

    const trainingBad = state.selections['training_needed'] === 'bad' ? `❌ ${getSkillText('training_needed', 'bad')}` : '';
    if (trainingBad) message += trainingBad + '\n\n';

    const unfair = notes.filter(n => state.selections[n.id] === 'include' && ['morning_issues', 'equipment_issues', 'route_issues', 'only_buildings', 'not_nursery'].includes(n.id)).map(n => n.text);
    addSection(unfair);

    const driverFeeling = state.selections['driver_feeling'] ? getSkillText('driver_feeling', state.selections['driver_feeling']) : '';
    if (driverFeeling) message += `Driver feelings: ${driverFeeling}\n\n`;

    if (state.selections['organize_van'] === 'mid' || state.selections['organize_van'] === 'bad') {
        message += `Comments: Please help organize the van on the launchpad next working day.\n\n`;
    }

    let trainerNotes = [];
    const checklist = notes.find(n => n.id === 'checklist');
    if (state.selections[checklist.id] === 'include') {
        trainerNotes.push(`${checklist.emote} ${checklist.text}`);
    }
    const moreDetails = notes.find(n => n.id === 'more_details');
    if (state.selections[moreDetails.id] === 'include') {
        trainerNotes.push(moreDetails.text);
    }
    if (trainerNotes.length > 0) message += `Trainer notes: ${trainerNotes.join('\n')}`;

    document.getElementById('summary-text').value = message.trim();
}

// Function to copy summary to clipboard
function copySummary() {
    const text = document.getElementById('summary-text').value;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Initialize Ride Along Tool
function initRideAlongTool() {
    initDOMCache();
    currentPage = 0;
    if (!document.querySelector('#screen-1')) {
        createChoiceScreens();
    }
    showPage(0);
}
