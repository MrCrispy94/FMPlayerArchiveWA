# FM Player Archive

Welcome to the FM Player Archive, a fan-made companion tool designed for enthusiasts of the Football Manager series. This application allows you to create, track, and manage an extensive personal database of your favorite players across different saves, versions, and careers. Build your dream team, simulate matches, and share your creations with friends.

**Disclaimer:** This tool is a fan project and is not affiliated with, endorsed, or supported by Sports Interactive or SEGA.

## Table of Contents

- [Core Features](#core-features)
  - [Dashboard](#dashboard)
  - [Player Database](#player-database)
  - [Attribute & Value History](#attribute--value-history)
  - [All-Time XI Builder](#all-time-xi-builder)
  - [Match Day Simulator](#match-day-simulator)
  - [Deep Customisation](#deep-customisation)
- [How to Use](#how-to-use)
- [Technical Notes](#technical-notes)
- [Credits](#credits)

## Core Features

### Dashboard

The central hub of your FM universe, providing an at-a-glance overview of your entire database.

- **Statistical Summary:** Key metrics like total players, managers, and trophies won are displayed in prominent cards.
- **Leaderboards:** See who's on top with dynamic lists for Top Goalscorers, Top Assists, Top Average Rating, and Most Valuable Players.
- **Player Spotlight:** A special holographic card showcases a random "favourite" player, bringing your stars to the forefront.

### Player Database

The heart of the application. The Player Database is a powerful tool for cataloging every detail about your players.

- **Create & Edit:** Easily add new players and fill out detailed profiles, including personal information, club history, and season-by-season statistics.
- **In-Depth Attributes:** For players with known attributes, you can input their exact stats across Technical, Mental, and Physical categories for both outfield players and goalkeepers.
-   **Dynamic Filtering & Search:** Quickly find players by name, nationality, or position. You can also filter by tags, such as FM Version, Save Game, NewGen status, or Favourites.
- **Favourites:** Mark your most important players with a star. Favourited players are pinned to the top of the list for easy access.
- **Interactive Kits:** Cycle through a player's different club kits directly from the list view.
- **Original Manager:** Every player you create is tagged with your manager name, so you always know who created the entry.

### Attribute & Value History

Track your players' development and market value with powerful analysis tools.

- **Update from HTML:** Upload an HTML file of attributes from Football Manager to automatically create a new, dated snapshot in their history.
- **Value Tracking:** When creating a snapshot, you can log the player's market value at that time.
- **Value History Table:** A dedicated table on the player's profile shows their value progression over time, with arrows indicating increases (↑) or decreases (↓), and double arrows (↑↑ / ↓↓) for major changes (>50%).
- **Compare History:** Compare any two historical snapshots side-by-side to see a detailed breakdown of attribute changes, with highlights for significant improvements.
- **Growth History Graph:** Visualize player development on an interactive line graph. Plot any attribute, their role-based "Overall Ability," or their "Market Value" over time to see their career trajectory.

### All-Time XI Builder

Visualize your dream team with a drag-and-drop interface.

- **Dynamic Formations:** Choose from 12 classic formations (e.g., 4-4-2, 4-3-3, 3-5-2) and see the pitch layout update instantly.
- **Drag & Drop:** Simply drag players from the available list on the right and drop them into position on the pitch.
- **Save & Load Squads:** Name your squad and save your entire All-Time XI, including all player data, to a local `.json` file. This file can be shared with other users, who can then load it into their own app.

### Match Day Simulator

Pit two of your saved squads against each other in a head-to-head showdown.

- **Import Squads:** Load two `.json` squad files (one for Home, one for Away) to set up a match.
- **Team Ratings:** The app automatically calculates and displays ratings for Goalkeeping, Defence, Midfield, Attack, and an Overall team strength based on the attributes of the players in the starting XI.
- **Match Simulation:** With a click of a button, run a weighted simulation that generates a random scoreline, influenced by the overall ratings of the two teams. Results include goalscorers and the minute of each goal.
- **Export Result:** Save a snapshot of the final match result, including team lineups and the score, as a PNG image to share with friends.

### Deep Customisation

Tailor the application's data to fit your Football Manager universe perfectly.

- **Manager Profile:** Set and update your manager name at any time. This name is automatically updated on all players you've created.
- **Manage Game Data:** The "Customise" tab gives you full control to:
    - **Add/Remove FM Versions:** Future-proof the app by adding new versions like "FM26" as they are released.
    - **Create Custom Clubs:** Design new clubs with a full kit creator, including primary/secondary colors and patterns (plain, stripes, hoops).
    - **Create Custom Competitions:** Add any missing leagues, cups, or personal awards to the honours list.
    - **Manage Save Games:** Create and color-code different save game tags to easily filter your players.

## How to Use

Refer to the **About** tab within the application for a detailed feature-by-feature guide.

## Technical Notes

-   **Local Storage:** All of your data—players, custom clubs, settings, etc.—is stored directly in your browser's `localStorage`. There is no backend server, which means your data is completely private and available offline.
-   **Data Persistence:** Because data is stored locally, it will only be available on the browser and device you use to access the app. Clearing your browser's cache or storage may delete your data, so be sure to use the export features to create backups.

## Credits

This application was created by **Chris Sorrell**. It is a fan-made project created for the love of the game.
