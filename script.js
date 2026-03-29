// Apply theme immediately when script loads (before DOM ready)
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    console.log('Script load - theme from localStorage:', savedTheme);
    if (savedTheme === 'dark') {
      // Apply to body immediately if it exists
      if (document.body) {
        document.body.classList.add("dark");
        console.log('Applied dark mode immediately at script load');
      } else {
        // If body doesn't exist yet, apply when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
          document.body.classList.add("dark");
          console.log('Applied dark mode at DOM ready');
        });
      }
    }
  } catch (error) {
    console.error('Error applying theme at script load:', error);
  }
})();

// Initialize Icons safely
function initIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      // Only create icons for elements that don't have them yet
      const elementsWithoutIcons = document.querySelectorAll('[data-lucide]:not(.lucide-initialized)');
      if (elementsWithoutIcons.length > 0) {
        window.lucide.createIcons({
          attrs: {
            class: ['lucide-initialized']
          }
        });
      }
    } catch (error) {
      console.warn('Lucide icons initialization failed:', error);
    }
  }
}

// Debounced version for performance
let iconInitTimeout;
function debouncedInitIcons() {
  clearTimeout(iconInitTimeout);
  iconInitTimeout = setTimeout(() => {
    initIcons();
  }, 50);
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Load saved preferences first (including theme)
  loadPreferences();
  
  // 2. Draw Icons immediately
  initIcons();

  // 3. Search Logic
  const searchInput = document.querySelector(".search");
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchInput.value.trim() !== "") {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchInput.value)}`;
    }
  });

  // 4. Theme Toggle
  const themeBtn = document.getElementById("toggleTheme");
  themeBtn.onclick = () => {
    document.body.classList.toggle("dark");
    const icon = themeBtn.querySelector("i");
    
    // Change icon attribute with null check
    if (icon) {
      if (document.body.classList.contains("dark")) {
        icon.setAttribute("data-lucide", "sun");
      } else {
        icon.setAttribute("data-lucide", "moon");
      }
    }
    
    // Save theme preference
    const theme = document.body.classList.contains("dark") ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    console.log('Theme saved:', theme);
    console.log('localStorage theme:', localStorage.getItem('theme'));
    
    // Re-render icons to swap moon/sun
    debouncedInitIcons();
  };

  // 5. Color Picker
  const colorPicker = document.getElementById("bgColorPicker");
  const colorPickerBtn = document.getElementById("colorPickerBtn");
  
  colorPicker.addEventListener('input', (e) => {
    const newColor = e.target.value;
    document.documentElement.style.setProperty('--bg', newColor);
    localStorage.setItem('bgColor', newColor);
  });
  
  colorPickerBtn.addEventListener('click', () => {
    colorPicker.click();
  });

  // 6. Layout Toggle
  const layoutBtn = document.getElementById("toggleLayout");
  const sidebar = document.getElementById("sidebar");
  const main = document.querySelector(".main");
  
  layoutBtn.onclick = () => {
    sidebar.classList.toggle("sidebar-hidden");
    main.classList.toggle("main-full");
    
    const isHidden = sidebar.classList.contains("sidebar-hidden");
    localStorage.setItem('sidebarHidden', isHidden);
    
    const icon = layoutBtn.querySelector("i");
    icon.setAttribute("data-lucide", isHidden ? "layout-sidebar" : "layout");
    debouncedInitIcons();
  };

  // 7. Weather Widget
  initWeatherWidget();

  // 8. Notes Panel
  initNotesPanel();

  // 9. Google Meet and Workspace
  initGoogleMeetAndWorkspace();

  // 10. Shortcuts Management
  initShortcutsPanel();
  renderMainShortcuts(); // Render shortcuts on page load

  // 11. Clock - Bangladesh Time Zone
  function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    
    // Bangladesh time (UTC+6)
    const bangladeshTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    
    clockElement.textContent = bangladeshTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  }
  setInterval(updateClock, 1000);
  updateClock();
});

// Load saved preferences
function loadPreferences() {
  try {
    // Load theme immediately
    const savedTheme = localStorage.getItem('theme');
    console.log('Loading theme from localStorage:', savedTheme);
    
    if (savedTheme === 'dark') {
      document.body.classList.add("dark");
      console.log('Applied dark mode to body');
      
      // Update theme button icon immediately with null check
      const themeBtn = document.getElementById("toggleTheme");
      const icon = themeBtn?.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", "sun");
        console.log('Updated theme icon to sun');
      } else {
        console.warn('Theme button icon not found');
      }
    }
    
    // Fallback: Ensure theme is applied after a short delay
    setTimeout(() => {
      if (savedTheme === 'dark' && !document.body.classList.contains("dark")) {
        document.body.classList.add("dark");
        console.log('Fallback: Applied dark mode');
        const themeBtn = document.getElementById("toggleTheme");
        const icon = themeBtn?.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "sun");
          debouncedInitIcons();
        }
      }
    }, 100);
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
  
  // Load background color
  const savedColor = localStorage.getItem('bgColor');
  if (savedColor) {
    document.documentElement.style.setProperty('--bg', savedColor);
    const colorPicker = document.getElementById('bgColorPicker');
    if (colorPicker) {
      colorPicker.value = savedColor;
    }
  }
  
  // Load sidebar state
  const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
  if (sidebarHidden) {
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");
    const layoutBtn = document.getElementById("toggleLayout");
    
    if (sidebar) sidebar.classList.add("sidebar-hidden");
    if (main) main.classList.add("main-full");
    
    const icon = layoutBtn?.querySelector("i");
    if (icon) {
      icon.setAttribute("data-lucide", "layout-sidebar");
    }
  }
}

// Weather Widget
function initWeatherWidget() {
  // Use Bangladesh location (Dhaka) 
  fetchWeather(23.8103, 90.4125); // Dhaka coordinates
}

function fetchWeather(lat, lon) {
  // Using OpenWeatherMap API (you'll need to get a free API key)
  // For demo purposes, using a mock response for Bangladesh weather
  const weatherData = {
    name: "Dhaka",
    main: {
      temp: 28 // Typical Bangladesh temperature in Celsius
    },
    weather: [
      {
        main: "Clouds",
        icon: "cloud"
      }
    ]
  };
  
  updateWeatherDisplay(weatherData);
}

function updateWeatherDisplay(data) {
  const weatherWidget = document.getElementById("weatherWidget");
  const temp = Math.round(data.main.temp);
  const location = data.name;
  
  weatherWidget.innerHTML = `
    <i data-lucide="cloud" class="weather-icon"></i>
    <span class="weather-temp">${temp}°</span>
    <span class="weather-location">${location}</span>
  `;
  
  debouncedInitIcons();
}

// Notes Panel
function initNotesPanel() {
  const notesPanel = document.getElementById("notesPanel");
  const notesBtn = document.getElementById("toggleNotes");
  const closeNotesBtn = document.getElementById("closeNotes");
  const addNoteBtn = document.getElementById("addNote");
  const clearAllNotesBtn = document.getElementById("clearAllNotes");
  const notesList = document.getElementById("notesList");
  
  // Editor elements
  const noteEditor = document.getElementById("noteEditor");
  const noteTitleInput = document.getElementById("noteTitleInput");
  const noteContentInput = document.getElementById("noteContentInput");
  const saveNoteBtn = document.getElementById("saveNote");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const closeEditorBtn = document.getElementById("closeEditor");
  const editorCharCount = document.getElementById("editorCharCount");
  
  // Make currentEditingId accessible globally for edit functionality
  window.currentEditingId = null;
  
  // Toggle notes panel
  notesBtn.addEventListener('click', () => {
    notesPanel.classList.toggle('hidden');
    if (!notesPanel.classList.contains('hidden')) {
      renderNotes();
    }
  });
  
  closeNotesBtn.addEventListener('click', () => {
    notesPanel.classList.add('hidden');
    hideEditor();
  });
  
  // Add new note
  addNoteBtn.addEventListener('click', () => {
    showEditor();
  });
  
  // Clear all notes
  clearAllNotesBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all notes? This cannot be undone.')) {
      localStorage.removeItem('dashboardNotes');
      renderNotes();
      hideEditor();
    }
  });
  
  // Editor controls
  saveNoteBtn.addEventListener('click', () => {
    saveCurrentNote();
  });
  
  cancelEditBtn.addEventListener('click', () => {
    hideEditor();
  });
  
  closeEditorBtn.addEventListener('click', () => {
    hideEditor();
  });
  
  // Character counter
  noteContentInput.addEventListener('input', () => {
    updateCharCount();
  });
  
  // Auto-save on Ctrl+S
  noteContentInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveCurrentNote();
    }
  });
  
  window.showEditor = function(noteId = null) {
    const notes = getNotes();
    const note = noteId ? notes.find(n => n.id === noteId) : null;
    
    window.currentEditingId = noteId;
    
    if (note) {
      noteTitleInput.value = note.title;
      noteContentInput.value = note.content;
    } else {
      noteTitleInput.value = '';
      noteContentInput.value = '';
    }
    
    noteEditor.classList.remove('hidden');
    updateCharCount();
    noteTitleInput.focus();
  }
  
  window.hideEditor = function() {
    noteEditor.classList.add('hidden');
    window.currentEditingId = null;
    noteTitleInput.value = '';
    noteContentInput.value = '';
  }
  
  window.updateCharCount = function() {
    const count = noteContentInput.value.length;
    editorCharCount.textContent = `${count} characters`;
  }
  
  window.saveCurrentNote = function() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (!title && !content) {
      alert('Please enter a title or content for your note.');
      return;
    }
    
    const finalTitle = title || generateNoteTitle(content);
    const notes = getNotes();
    
    if (window.currentEditingId) {
      // Update existing note
      const note = notes.find(n => n.id === window.currentEditingId);
      if (note) {
        note.title = finalTitle;
        note.content = content;
        note.timestamp = new Date().toISOString();
      }
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        title: finalTitle,
        content: content,
        timestamp: new Date().toISOString()
      };
      notes.unshift(newNote);
    }
    
    saveNotes(notes);
    renderNotes();
    hideEditor();
  }
  
  // Initial render
  renderNotes();
}

function createNewNote() {
  // This function is now handled by showEditor()
}

function generateNoteTitle(content) {
  if (!content) return 'Untitled Note';
  const words = content.split(' ');
  const maxLength = 30;
  let title = words.slice(0, 3).join(' ');
  if (title.length > maxLength) {
    title = title.substring(0, maxLength) + '...';
  }
  return title || 'Untitled Note';
}

function getNotes() {
  const savedNotes = localStorage.getItem('dashboardNotes');
  return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNotes(notes) {
  localStorage.setItem('dashboardNotes', JSON.stringify(notes));
}

function deleteNote(noteId) {
  if (confirm('Are you sure you want to delete this note?')) {
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    saveNotes(filteredNotes);
    renderNotes();
  }
}

function editNote(noteId) {
  window.showEditor(noteId);
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

function generateDescription(content) {
  if (!content) return '';
  const sentences = content.split('.').filter(s => s.trim());
  const firstSentence = sentences[0] || '';
  return firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence;
}

function renderNotes() {
  const notesList = document.getElementById("notesList");
  const notes = getNotes();
  
  if (notes.length === 0) {
    notesList.innerHTML = '<div class="empty-notes">No notes yet. Click "Add Note" to create your first note!</div>';
    return;
  }
  
  notesList.innerHTML = notes.map(note => {
    const description = generateDescription(note.content);
    return `
      <div class="note-item" data-note-id="${note.id}">
        <div class="note-header">
          <div class="note-title">${escapeHtml(note.title)}</div>
          <div class="note-timestamp">${formatTimestamp(note.timestamp)}</div>
        </div>
        ${description ? `<div class="note-description">${escapeHtml(description)}</div>` : ''}
        <div class="note-actions">
          <button class="note-action-btn edit" data-note-id="${note.id}" title="Edit">
            <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
          </button>
          <button class="note-action-btn delete" data-note-id="${note.id}" title="Delete">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners to the new buttons
  notesList.querySelectorAll('.note-action-btn.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const noteId = parseInt(e.target.closest('[data-note-id]').dataset.noteId);
      editNote(noteId);
    });
  });
  
  notesList.querySelectorAll('.note-action-btn.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const noteId = parseInt(e.target.closest('[data-note-id]').dataset.noteId);
      deleteNote(noteId);
    });
  });
  
  // Re-initialize Lucide icons for new elements
  if (window.lucide) {
    debouncedInitIcons();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Shortcuts Management Panel
function initShortcutsPanel() {
  const shortcutsPanel = document.getElementById("shortcutsPanel");
  const manageShortcutsBtn = document.getElementById("manageShortcuts");
  const closeShortcutsBtn = document.getElementById("closeShortcuts");
  const addShortcutBtn = document.getElementById("addShortcut");
  const resetShortcutsBtn = document.getElementById("resetShortcuts");
  const shortcutsList = document.getElementById("shortcutsList");
  
  // Editor elements
  const shortcutEditor = document.getElementById("shortcutEditor");
  const shortcutNameInput = document.getElementById("shortcutNameInput");
  const shortcutUrlInput = document.getElementById("shortcutUrlInput");
  const shortcutIconSelect = document.getElementById("shortcutIconSelect");
  const saveShortcutBtn = document.getElementById("saveShortcut");
  const cancelShortcutBtn = document.getElementById("cancelShortcut");
  const closeShortcutEditorBtn = document.getElementById("closeShortcutEditor");
  
  // Make currentEditingId accessible globally
  window.currentShortcutEditingId = null;
  
  // Check if elements exist
  if (!shortcutsPanel || !manageShortcutsBtn || !closeShortcutsBtn) {
    console.warn('Shortcuts panel elements not found');
    return;
  }
  
  // Toggle shortcuts panel
  manageShortcutsBtn.addEventListener('click', () => {
    shortcutsPanel.classList.toggle('hidden');
    if (!shortcutsPanel.classList.contains('hidden')) {
      renderShortcuts();
    }
  });
  
  closeShortcutsBtn.addEventListener('click', () => {
    shortcutsPanel.classList.add('hidden');
    hideShortcutEditor();
  });
  
  // Add new shortcut
  if (addShortcutBtn) {
    addShortcutBtn.addEventListener('click', () => {
      showShortcutEditor();
    });
  }
  
  // Reset to default shortcuts
  if (resetShortcutsBtn) {
    resetShortcutsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all shortcuts to default? This will remove all your custom shortcuts.')) {
        localStorage.removeItem('customShortcuts');
        loadDefaultShortcuts();
        renderShortcuts();
        renderMainShortcuts();
      }
    });
  }
  
  // Editor controls
  if (saveShortcutBtn) {
    saveShortcutBtn.addEventListener('click', () => {
      saveCurrentShortcut();
    });
  }
  
  if (cancelShortcutBtn) {
    cancelShortcutBtn.addEventListener('click', () => {
      hideShortcutEditor();
    });
  }
  
  if (closeShortcutEditorBtn) {
    closeShortcutEditorBtn.addEventListener('click', () => {
      hideShortcutEditor();
    });
  }
  
  window.showShortcutEditor = function(shortcutId = null) {
    const shortcuts = getShortcuts();
    const shortcut = shortcutId ? shortcuts.find(s => s.id === shortcutId) : null;
    
    window.currentShortcutEditingId = shortcutId;
    
    if (shortcut) {
      shortcutNameInput.value = shortcut.name;
      shortcutUrlInput.value = shortcut.url;
      shortcutIconSelect.value = shortcut.icon;
    } else {
      shortcutNameInput.value = '';
      shortcutUrlInput.value = '';
      shortcutIconSelect.value = 'globe';
    }
    
    shortcutEditor.classList.remove('hidden');
    shortcutNameInput.focus();
  }
  
  window.hideShortcutEditor = function() {
    shortcutEditor.classList.add('hidden');
    window.currentShortcutEditingId = null;
    shortcutNameInput.value = '';
    shortcutUrlInput.value = '';
    shortcutIconSelect.value = 'globe';
  }
  
  window.saveCurrentShortcut = function() {
    const name = shortcutNameInput.value.trim();
    const url = shortcutUrlInput.value.trim();
    const icon = shortcutIconSelect.value;
    
    if (!name || !url) {
      alert('Please enter both name and URL for your shortcut.');
      return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    const shortcuts = getShortcuts();
    
    if (window.currentShortcutEditingId) {
      // Update existing shortcut
      const shortcut = shortcuts.find(s => s.id === window.currentShortcutEditingId);
      if (shortcut) {
        shortcut.name = name;
        shortcut.url = url;
        shortcut.icon = icon;
      }
    } else {
      // Create new shortcut
      const newShortcut = {
        id: Date.now(),
        name: name,
        url: url,
        icon: icon
      };
      shortcuts.push(newShortcut);
    }
    
    saveShortcuts(shortcuts);
    renderShortcuts();
    renderMainShortcuts();
    hideShortcutEditor();
  }
  
  // Initial render
  renderShortcuts();
}

function getShortcuts() {
  const savedShortcuts = localStorage.getItem('customShortcuts');
  if (savedShortcuts) {
    return JSON.parse(savedShortcuts);
  }
  return loadDefaultShortcuts();
}

function saveShortcuts(shortcuts) {
  localStorage.setItem('customShortcuts', JSON.stringify(shortcuts));
}

function loadDefaultShortcuts() {
  const defaultShortcuts = [
    { id: 1, name: 'GitHub', url: 'https://github.com', icon: 'git-branch' },
    { id: 2, name: 'LinkedIn', url: 'https://linkedin.com', icon: 'users' },
    { id: 3, name: 'Facebook', url: 'https://facebook.com', icon: 'share-2' },
    { id: 4, name: 'Gmail', url: 'https://mail.google.com', icon: 'mail' },
    { id: 5, name: 'Twitter', url: 'https://twitter.com', icon: 'message-circle' },
    { id: 6, name: 'Instagram', url: 'https://instagram.com', icon: 'camera' },
    { id: 7, name: 'YouTube', url: 'https://youtube.com', icon: 'play-circle' },
    { id: 8, name: 'Reddit', url: 'https://reddit.com', icon: 'message-square' }
  ];
  localStorage.setItem('customShortcuts', JSON.stringify(defaultShortcuts));
  return defaultShortcuts;
}

function renderShortcuts() {
  const shortcutsList = document.getElementById("shortcutsList");
  const shortcuts = getShortcuts();
  
  if (shortcuts.length === 0) {
    shortcutsList.innerHTML = '<div class="empty-shortcuts">No custom shortcuts yet. Click "Add Shortcut" to create your first shortcut!</div>';
    return;
  }
  
  shortcutsList.innerHTML = shortcuts.map(shortcut => `
    <div class="shortcut-item" data-shortcut-id="${shortcut.id}">
      <div class="shortcut-info">
        <i data-lucide="${shortcut.icon}"></i>
        <div class="shortcut-details">
          <div class="shortcut-name">${escapeHtml(shortcut.name)}</div>
          <div class="shortcut-url">${escapeHtml(shortcut.url)}</div>
        </div>
      </div>
      <div class="shortcut-actions">
        <button class="shortcut-action-btn edit" data-shortcut-id="${shortcut.id}" title="Edit">
          <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
        </button>
        <button class="shortcut-action-btn delete" data-shortcut-id="${shortcut.id}" title="Delete">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to new buttons
  shortcutsList.querySelectorAll('.shortcut-action-btn.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const shortcutId = parseInt(e.target.closest('[data-shortcut-id]').dataset.shortcutId);
      window.showShortcutEditor(shortcutId);
    });
  });
  
  shortcutsList.querySelectorAll('.shortcut-action-btn.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const shortcutId = parseInt(e.target.closest('[data-shortcut-id]').dataset.shortcutId);
      deleteShortcut(shortcutId);
    });
  });
  
  // Re-initialize Lucide icons for new elements
  if (window.lucide) {
    debouncedInitIcons();
  }
}

function deleteShortcut(shortcutId) {
  if (confirm('Are you sure you want to delete this shortcut?')) {
    const shortcuts = getShortcuts();
    const filteredShortcuts = shortcuts.filter(shortcut => shortcut.id !== shortcutId);
    saveShortcuts(filteredShortcuts);
    renderShortcuts();
    renderMainShortcuts();
  }
}

function renderMainShortcuts() {
  const shortcutsContainer = document.querySelector(".shortcuts");
  const shortcuts = getShortcuts();
  
  shortcutsContainer.innerHTML = shortcuts.map(shortcut => `
    <a href="${shortcut.url}" target="_blank">
      <i data-lucide="${shortcut.icon}"></i> ${escapeHtml(shortcut.name)}
    </a>
  `).join('');
  
  // Re-initialize Lucide icons
  if (window.lucide) {
    debouncedInitIcons();
  }
}

// Google Meet and Workspace functionality
function initGoogleMeetAndWorkspace() {
  console.log('Initializing Google Meet and Workspace...');
  
  const googleMeetBtn = document.getElementById("googleMeetBtn");
  const googleWorkspaceBtn = document.getElementById("googleWorkspaceBtn");
  const workspaceDropdown = document.getElementById("workspaceDropdown");
  
  console.log('Google Meet button found:', !!googleMeetBtn);
  console.log('Google Workspace button found:', !!googleWorkspaceBtn);
  console.log('Workspace dropdown found:', !!workspaceDropdown);
  
  // Google Meet button - create instant meeting
  if (googleMeetBtn) {
    googleMeetBtn.addEventListener('click', (e) => {
      console.log('Google Meet button clicked!');
      e.preventDefault();
      e.stopPropagation();
      createGoogleMeetLink();
    });
    console.log('Google Meet button event listener attached');
  } else {
    console.error('Google Meet button not found!');
  }
  
  // Google Workspace dropdown toggle
  if (googleWorkspaceBtn) {
    googleWorkspaceBtn.addEventListener('click', (e) => {
      console.log('Google Workspace button clicked!');
      e.preventDefault();
      e.stopPropagation();
      workspaceDropdown.classList.toggle('hidden');
    });
    console.log('Google Workspace button event listener attached');
  } else {
    console.error('Google Workspace button not found!');
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.google-workspace-dropdown')) {
      workspaceDropdown.classList.add('hidden');
    }
  });
  
  // Prevent dropdown from closing when clicking inside
  if (workspaceDropdown) {
    workspaceDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Create Google Meet link
function createGoogleMeetLink() {
  console.log('Creating Google Meet link...');
  try {
    // Use Google Meet's official "New Meeting" URL
    const meetUrl = 'https://meet.google.com/new';
    
    console.log('Opening Google Meet new meeting:', meetUrl);
    
    // Show notification
    showNotification('Opening Google Meet...', 'success');
    
    // Open Google Meet immediately
    setTimeout(() => {
      window.open(meetUrl, '_blank');
    }, 500);
    
    // Also provide option to copy the generic meet URL for sharing
    navigator.clipboard.writeText('https://meet.google.com').then(() => {
      console.log('Google Meet base URL copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy meet URL:', err);
    });
    
  } catch (error) {
    console.error('Error creating Google Meet link:', error);
    showNotification('Failed to create Google Meet link', 'error');
  }
}

// Show notification (simple implementation)
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Fade in
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}