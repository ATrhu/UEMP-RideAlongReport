# UEMP Operations Hub V2

A comprehensive operations management system for University Emergency Medical Personnel (UEMP) with modern architecture, enhanced user experience, and advanced data management capabilities.

## 🚀 Features

### Core Functionality
- **Manager Authentication**: Secure login system with user session management
- **Ride Along Report Tool**: Complete evaluation system for driver assessments
- **Handover Report Tool**: Comprehensive fleet and equipment handover reporting
- **Vehicle Damage Check**: Photo-based vehicle damage tracking with organized documentation
- **Equipment Care Tool**: Advanced phone condition tracking with photo comparison and battery pack inventory
- **Fleet Manager**: Vehicle data administration and management
- **Modular Architecture**: Clean separation of concerns and reusable components
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Improvements
- **Modern CSS**: Custom properties, CSS Grid, and Flexbox for maintainable layouts
- **Clean JavaScript**: Modular, event-driven architecture with error handling
- **Local Storage**: Persistent data management for all tools
- **Accessibility**: Keyboard navigation, screen reader support, and focus management
- **Performance**: Optimized loading and smooth transitions
- **Mobile-First**: Responsive design that works across all devices

## 📁 Project Structure

```text
UEMP Operations Hub V2/
├── index.html              # Main application structure and UI
├── styles.css              # Modern CSS with design system and responsive layouts
├── app.js                  # Core application logic and navigation
├── ride-along.js           # Ride along report functionality with evaluation system
├── handover.js             # Handover report tool for fleet and equipment
├── vehicle-damage.js       # Vehicle damage tracking with photo management
├── equipment-care.js       # Phone condition tracking and battery pack inventory
├── fleet-manager.js        # Fleet management and vehicle data
├── damage-history.js       # Damage history tracking and management
├── package.json            # Project dependencies and scripts
├── run.sh                  # Development server startup script
├── publish.sh              # GitHub publishing script with backups
├── README.md               # Project documentation
├── logo.png                # UEMP logo
├── banner.png              # Application banner
├── ride-along-icon.png     # Tool icons
├── handover-icon.png
├── vehicle-damage-icon.png
├── equipment-care-icon.png
└── backup folders/         # Timestamped backups of stable versions
```

## 🎨 Design System

### Color Palette
- **Primary**: `#FFD700` (UEMP Gold)
- **Secondary**: `#DAA520` (Dark Gold)
- **Text**: `#1f2937` (Dark Gray)
- **Background**: `#ffffff` (White)
- **Accent**: `#f9fafb` (Light Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Scale**: Responsive font sizes with CSS custom properties
- **Weights**: 300, 400, 500, 600, 700

### Spacing
- **System**: 4px base unit with responsive scaling
- **Breakpoints**: Mobile (768px), Tablet (1024px), Desktop (1200px+)

## 🔧 Technical Architecture

### CSS Custom Properties
```css
:root {
    --primary-color: #FFD700;
    --spacing-md: 1rem;
    --font-size-lg: 1.125rem;
    /* ... more variables */
}
```

### JavaScript Modules
- **App State Management**: Centralized state with localStorage persistence
- **Screen Navigation**: Clean transition system between views
- **Error Handling**: Comprehensive error catching and user notifications
- **Keyboard Navigation**: Accessibility-first interaction design

### Responsive Grid System
- **Auto-fit Grid**: Adapts to available space automatically
- **Min-max Constraints**: Maintains readable card sizes
- **Flexible Layouts**: Works across all device sizes

## 📱 User Experience

### Login Flow
1. Clean, branded login screen with UEMP Gold theme
2. Form validation with real-time user feedback
3. Session persistence with localStorage for seamless experience
4. Secure authentication for operations managers

### Dashboard
- **5 Main Tool Cards**: Ride Along, Handover Report, Vehicle Damage Check, Equipment Care, and Fleet Management
- **Responsive Grid**: Automatically adapts to screen size
- **Smooth Hover Effects**: Enhanced interactivity with visual feedback
- **Clear Navigation**: Intuitive user flow with keyboard support
- **Session Management**: User greeting and logout functionality

## 🛠️ Available Tools

### 📋 Ride Along Report Tool

#### Overview
The Ride Along Report Tool provides a comprehensive evaluation system for driver performance during ride-along sessions. It supports both new hire training and ongoing assessments for regular drivers.

#### Input Flow
1. **Driver Name (Required)**: Enter the name of the driver being evaluated. The app will not proceed without this.
2. **Trainer Name (Required)**: Enter the name of the trainer conducting the evaluation. This is separate from the manager login to allow device sharing.
3. **Evaluation Questions**: Proceed to 25+ structured questions covering driving skills, organization, app usage, customer interactions, and more.
   - Most questions are single-select with ✅/🔧/❌ options.
   - Some are multi-select (e.g., first-day issues).
   - Special questions for overall comment, driver feelings, readiness assessment, and notes.

#### Report Generation
Reports are generated automatically upon completion and include:
- **Header**:
  ```
  DRIVER: [Driver Name]
  TRAINER: [Trainer Name]
  ==========================================
  ```
- **SUMMARY**:
  - Overall: [Selected emoji/comment]
  - Driver feelings: [Selected emoji/mood]
  - Readiness Assessment: Combined driver confidence and trainer recommendation (e.g., "🥶 Driver feels ready... However, trainer recommends one more ride-along.")
- **STRENGTHS**: List of ✅/good responses.
- **AREAS FOR IMPROVEMENT**: List of 🔧/mid responses.
- **CRITICAL ISSUES**: List of ❌/bad responses.
- **SPECIAL NOTES**: First-day issues, custom notes, or "More details available."
- **RECOMMENDATIONS**: Auto-generated based on responses (e.g., van organization help).

#### Features
- **Auto-Save**: Reports saved to localStorage (up to 50 most recent).
- **View/Copy/Delete**: From saved reports screen—view loads original text without duplication; copy to clipboard.
- **New Report**: Start fresh; confirms data loss.
- **Keyboard Navigation**: Arrow keys/Enter for evaluation steps.
- **Notifications**: Success/error messages for actions.
- **Responsive**: Works on desktop/mobile.
- **Backward Compatible**: Old reports display with "DRIVER: [Old Trainee Name]" and "TRAINER: Not specified."
- **Initial View**: On tool open, shows saved reports first if any exist; otherwise, starts at input screen.

#### Saved Reports Screen
- Prominent "Create New Report" button at top.
- Grid of cards showing Driver, Trainer, Date/Time.
- Empty state: Icon + message if no reports.

#### Data Management
- Persistent via localStorage—no server needed.
- Export: Copy full report text to clipboard for sharing/email.
- Limits: Oldest reports auto-pruned after 50.

### 📦 Handover Report Tool

#### Overview
The Handover Report Tool facilitates complete fleet and equipment handover documentation between shifts or personnel.

#### Input Flow
1. **Date Range**: Select start and end dates for the handover period.
2. **Fleet Selection**: Categorize and select active vehicles:
   - Amazon Branded Vans: Prime (0-17), CDV (32-40)
   - Fleet Share Vans: Prime, CDV
   - Merchant Vans
   - Rental Vans
   - Out of Service Vans
   - "Select All" buttons per category for efficiency.
3. **Additional Notes**: Optional text for vehicle-specific issues (e.g., "26 needs a new tire").
4. **Equipment Counts**: Enter totals for phones, gas cards, handtrucks, chargers, phone holders, cables, walkie-talkies, boosters, iPads.
   - OOS Phones with details.
   - Missing/Needs Ordering textarea.
5. **Review & Generate**: Preview all data before finalizing.

#### Report Generation
- **Header**: Handover Period (dates), Trainer/Manager info.
- **Fleet Status**: Selected vehicles by category with notes.
- **Equipment Inventory**: Counts and notes.
- **Issues/Recommendations**: From input fields.
- Formatted for easy copy/paste into documentation systems.

#### Features
- **Select All**: Quick bulk selection for vans.
- **Real-time Updates**: Dynamic previews during input.
- **Clipboard Integration**: Copy full report.
- **New Handover**: Reset and start fresh.
- **Validation**: Ensures dates and required counts.

#### Data Management
- LocalStorage persistence for incomplete reports (resume on reopen).
- Auto-save on generate; up to 50 handovers stored.

### 🚗 Vehicle Damage Check Tool

#### Overview
Photo-based vehicle damage tracking with history and attribution for fleet maintenance.

#### Input Flow
1. **Vehicle Selection**: Choose from categories (Amazon Branded, Fleet Share, Merchant, Rental).
2. **Damage Upload**: Upload/take photo of damage.
3. **Details**:
   - Driver Name (optional).
   - Date (auto or manual).
   - Description.
   - Severity (Minor/Moderate/Major/Critical).
   - Location on Vehicle.
4. **Save & History**: Add to vehicle's damage log.

#### Features
- **Photo Management**: Upload with preview; comparison if multiple.
- **History View**: Per-vehicle timeline with photos, dates, severity.
- **Search/Filter**: By vehicle category or damage type.
- **Keyboard Support**: Tab/Enter for inputs.
- **Mobile Camera**: File input supports device camera.

#### Data Management
- Per-vehicle localStorage (fleet data in fleet-manager.js).
- Damage history searchable and exportable via copy.
- No auto-prune; manual delete per entry.

### 📱 Equipment Care Tool

#### Overview
Tracks phone conditions and battery pack inventory with photo evidence and history.

#### Tabs & Input Flow
1. **Phone Care Tab**:
   - **Grid Selection**: Phones 0-63 + ORS (64 phones total).
   - **Condition Check**: View latest photo, upload new (with comparison modal).
   - **Damage Report**: Optional description; permanent/temp storage choice.
   - **History**: Per-phone condition timeline with timestamps/photos.
2. **Battery Packs Tab**:
   - **Quick Add**: Enter number (0+) + Enter to add.
   - **Stats**: Today's/Yesterday's counts.
   - **History Search**: Date range query for inventory analysis.
   - **Scrollable List**: All current packs.

#### Features
- **Photo Comparison**: Side-by-side previous vs. new for damage detection.
- **Storage Options**: Temp (auto-clean) vs. permanent.
- **Real-time Updates**: Live stats and history.
- **Zero Support**: Battery Pack 0 included.
- **Validation**: Number inputs, date ranges.

#### Data Management
- LocalStorage per phone/battery; history searchable.
- Photos as base64 (local only for privacy).
- Export via copy for reports.

### 🏢 Fleet Manager Tool

#### Overview
Centralized vehicle data administration, categories, and status tracking.

#### Features
- **Vehicle Categories**: Amazon Branded (Prime/CDV), Fleet Share, Merchant, Rental, Out of Service.
- **Data Population**: Pre-loaded with van numbers (e.g., Prime 0-17).
- **Status Management**: Mark active/OOS; integrate with Handover/Vehicle Damage.
- **Search/Filter**: By category, number, status.
- **Export**: Copy vehicle lists for reports.

#### Data Management
- LocalStorage persistence; syncs with other tools (e.g., damage links to fleet).
- No user input for creation—admin view only.

## 🛠️ Development Features

### Maintainable Code
- **Modular JavaScript**: Clean separation of concerns across 8+ modules
- **CSS Custom Properties**: Comprehensive design system with 20+ variables
- **Semantic HTML**: Fully accessible structure with proper ARIA labels
- **Error Boundaries**: Comprehensive error handling with user-friendly messages
- **State Management**: Centralized state management with localStorage persistence

### Performance Optimizations
- **Efficient Rendering**: Optimized DOM manipulation and event handling
- **Memory Management**: Clean state management and automatic cleanup
- **Responsive Images**: Optimized image loading and display
- **Local Storage**: Fast data persistence without server dependencies
- **Keyboard Support**: Full keyboard navigation for accessibility

### Advanced Features
- **Photo Management**: Upload, comparison, and storage with user preferences
- **Real-time Updates**: Live data synchronization across all tools
- **Data Validation**: Comprehensive input validation and error prevention
- **Export Capabilities**: Clipboard integration for easy data sharing
- **Mobile Optimization**: Touch-friendly interface with responsive design

## 📱 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **Fallbacks**: Graceful degradation for older browsers

## 🚀 Getting Started

### Quick Start
1. **Open the Application**:
   ```bash
   cd "/Users/ruhh/Library/Mobile Documents/com~apple~CloudDocs/Rucarpeta/Programming/HTML Programs/UEMP Operations Hub V2"
   ./run.sh
   ```
   Or use npm scripts:
   ```bash
   npm start    # Enhanced startup with auto-browser opening
   npm run dev  # Live reload development server (requires live-server)
   npm run quick # Quick server start without enhanced features
   ```

### Development Commands
- `npm start` - Full-featured startup (recommended for frequent use)
- `npm test` - Same as start (test your changes locally)
- `npm run publish` - Publish changes to GitHub with backup creation
- `npm run quick` - Basic server without extras
- `npm run lint` - Run code quality checks (when configured)

### Development Workflow
1. **Make changes** to HTML, CSS, or JavaScript files
2. **Test locally**: Run `npm start` (`⌘⇧R`) to start server and open in browser
3. **Publish to GitHub**: Run `npm run publish` (`⌘⇧P`) to backup, commit, and push changes
4. **Access live app**: Visit https://github.com/ATrhu/UEMP-RideAlongReport (GitHub Pages or similar)

### Keyboard Shortcuts
- `⌘⇧R` - Start local development server
- `⌘⇧P` - Publish changes to GitHub
- `^⌥N` - Open current HTML file in default browser

### Open .html with ^⌥N or ^⌥O (Cursor/VS Code)
If pressing ^⌥N on an HTML file shows a blank "TempCodeRunnerFile.html" tab, the Code Runner extension is interfering. The workspace is configured to disable Code Runner for HTML files and use custom VS Code tasks instead.

1) Add `.vscode/settings.json`:
```json
{
  "code-runner.runInTerminal": true,
  "code-runner.executorMapByFileExtension": {
    ".html": "open -a 'Google Chrome' $fullFileName"
  },
  "terminal.integrated.defaultProfile.osx": "zsh"
}
```

2) Add `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Local Server",
      "type": "shell",
      "command": "python3 -m http.server 8000",
      "options": {
        "cwd": "/Users/ruhh/Library/Mobile Documents/com~apple~CloudDocs/Rucarpeta/Programming/HTML Programs/UEMP Operations Hub V2"
      },
      "problemMatcher": []
    },
    {
      "label": "Open Current HTML in Chrome",
      "type": "shell",
      "command": "open -a 'Google Chrome' '${file}'",
      "problemMatcher": []
    }
  ]
}
```

3) Add `.vscode/keybindings.json`:
```json
[
  {
    "key": "ctrl+alt+n",
    "command": "workbench.action.tasks.runTask",
    "args": "Open Current HTML in Chrome",
    "when": "editorLangId == html"
  },
  {
    "key": "cmd+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Start Local Server"
  }
]
```

Usage:
- With an HTML file focused, press ^⌥N to open it in Chrome.
- Press ⌘⇧R to start the local server (or run the task from the command palette).

2. **Access the App**:
   Open `http://localhost:8000` in your browser

3. **Login**:
   Enter your manager name to access the operations hub

### Available Tools
After logging in, you'll have access to five comprehensive tools:

- **📋 Ride Along Report**: Driver evaluation and assessment system
- **📦 Handover Report**: Fleet and equipment handover documentation
- **🚗 Vehicle Damage Check**: Photo-based vehicle damage tracking
- **📱 Equipment Care**: Phone condition tracking and battery pack inventory
- **🏢 Fleet Manager**: Fleet management and vehicle data administration

### Data Management
- **Local Storage**: All data is automatically saved to your browser's local storage
- **No Server Required**: Full functionality works offline
- **Data Persistence**: Your data survives browser refreshes and computer restarts
- **Export Ready**: Easy clipboard integration for sharing reports

## 🔧 Customization

### Changing Colors
Update the CSS custom properties in `:root`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### Adding New Tools
1. Add tool card to dashboard in `index.html`
2. Create tool interface section
3. Add navigation logic in `app.js`
4. Implement tool-specific functionality

### Modifying Evaluations
Edit the `questions` array in `ride-along.js` to customize evaluation criteria.

### Customizing Equipment Care
- **Phone Range**: Modify the phone numbering system in `populatePhoneGrid()` in `equipment-care.js`
- **Battery Pack Validation**: Adjust validation rules in the `addBatteryPack()` function
- **Photo Storage Options**: Customize storage preferences in the photo upload modal

### Fleet Management
- **Vehicle Categories**: Update vehicle types and categories in `fleet-manager.js`
- **Damage Severity Levels**: Modify severity options in `vehicle-damage.js`
- **Handover Equipment**: Customize equipment lists in `handover.js`

### Adding New Tools
1. Create new tool module (e.g., `new-tool.js`)
2. Add tool card to dashboard in `index.html`
3. Create tool interface section with proper styling
4. Add navigation logic in `app.js`
5. Implement tool-specific functionality
6. Update README.md with new tool documentation

## 📈 Future Enhancements

- **Cloud Synchronization**: Server-based data backup and multi-device sync
- **Advanced Analytics**: Performance metrics, trends, and reporting dashboards
- **User Management**: Multiple user profiles with role-based permissions
- **PDF Export**: Automated PDF generation for all reports
- **Email Integration**: Direct email sending of reports and notifications
- **Offline Mode**: Full functionality without internet connectivity
- **Data Import/Export**: CSV import and export capabilities
- **Advanced Search**: Filtering and search across all data types
- **Automated Backups**: Scheduled data backups and recovery options
- **API Integration**: Integration with external systems and databases

## 📄 License

Internal UEMP Operations Tool - Not for external distribution.

---
**Built with modern web standards for maintainable, scalable operations management.**
