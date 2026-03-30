# Chrome Cool Dashboard

A modern Chrome extension that replaces the new tab page with a customizable dashboard.

## Features

- Clean and modern dashboard interface
- Replaces Chrome's default new tab page
- Customizable widgets and layout
- Responsive design
- **Note Feature** - Create and manage quick notes directly on your dashboard
- **Custom Link Management** - Add, edit, and organize your favorite bookmarks and links
- **AI Tools Sidebar** - Quick access to popular AI tools and services in the sidebar
  - **Search & Filter** - Real-time search to quickly find specific AI tools
  - **Pin to Favorites** - Mark your most-used AI tools as favorites for quick access
  - **Favorites Section** - Dedicated area to view and manage your pinned AI tools
  - **Persistent Storage** - Your preferences and pinned tools are saved automatically
  - **Comprehensive Collection** - Includes ChatGPT, Claude, Gemini, Grok, and many more tools across categories:
    - AI Chatbots (ChatGPT, Claude, Gemini, Perplexity, Poe, You.com, HuggingChat, Character.AI, Grok)
    - Vibe Coding (Bolt, v0, Cursor, Replit AI, Lovable, GitHub Copilot, Codeium, Tabnine)
    - Creative AI (Midjourney, Runway, Pika, Leonardo, Stability AI, Krea, Ideogram)
    - Writing AI (QuillBot, Grammarly, Notion AI)
    - Careers & Social (LinkedIn, GitHub, Twitter, Discord)
    - Automation AI (Zapier AI, Make, IFTTT, n8n)
    - Data & Analytics (Tableau, Data.ai, Hugging Face)

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The dashboard will now appear when you open a new tab

## Usage

### AI Tools Management

1. **Search AI Tools**: Use the search box at the top of the sidebar to quickly find specific AI tools by name
2. **Pin to Favorites**: Hover over any AI tool and click the pin icon to add it to your favorites
3. **View Favorites**: Click "Show Favorites" to display your pinned tools in a dedicated section at the top
4. **Unpin Tools**: Click the star icon on any favorite tool to remove it from favorites
5. **Automatic Saving**: All your preferences and pinned tools are automatically saved and persist across browser sessions

### Other Features

- **Theme Toggle**: Click the moon/sun icon to switch between dark and light themes
- **Color Customization**: Use the palette icon to customize the background color
- **Layout Toggle**: Click the layout icon to show/hide the sidebar
- **Notes**: Click the file-text icon to create and manage quick notes
- **Shortcuts Management**: Click the settings icon to add, edit, or remove custom shortcuts
- **Google Meet**: Click the video icon to instantly create a Google Meet meeting
- **Google Workspace**: Click the grid icon for quick access to Google services

## Development

### File Structure

```
my-dashboard/
├── manifest.json          # Extension configuration
├── index.html            # Main dashboard page
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Requirements

- Google Chrome (latest version)
- Basic knowledge of HTML, CSS, and JavaScript

## Customization

You can customize the dashboard by modifying:
- `index.html` - Main layout and content
- CSS styles for appearance
- JavaScript for functionality

## Icons

The extension uses the following icon sizes:
- 16x16px - Toolbar icon
- 32x32px - Extension management page
- 48x48px - Extension management page
- 128x128px - Chrome Web Store

## Author

Created by Shakil Ahmed

## License

This project is open source and available under the MIT License.
