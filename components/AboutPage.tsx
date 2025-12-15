

import React, { useState } from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface AboutPageProps {
  onOpenSupportModal: () => void;
}

const FeaturesGuideContent = () => (
    <div className="space-y-6 text-gray-300 text-left">
        <div className="prose-like">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to FMPA v1.2!</h2>
            <p className="mb-4">This guide will walk you through all the features available in the application. All your data is stored locally in your browser, so it's private and available offline.</p>
            
            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-2">The Database Tab</h3>
            <p>The heart of the application, for managing players and managers.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Dual View:</strong> Switch between Player and Manager databases using the dropdown at the top of the list.</li>
                <li><strong>Creation & Editing:</strong> Add new entries with the purple <strong>+</strong> button. Select an entry from the list and click "Edit" on their profile to modify details.</li>
                <li><strong>Searching & Filtering:</strong> Use the search bar for names, dropdowns for nationality/position, and click tags to filter by save game, FM version, newgen status, and more.</li>
                <li><strong>Trophy Cabinet:</strong> Click the "View Cabinet" button on any profile to see a visual display of all honours won.</li>
                <li><strong>Import/Export:</strong> Use the "Import" and "Export" buttons to load or save individual players/managers as `.json` files. This is great for sharing with other users.</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-2">How to Import Data from FM</h3>
            <p>You can import various pieces of data using FM's print feature (<kbd>Ctrl+P</kbd> or <kbd>Cmd+P</kbd>). Save the data using the specified format for each type:</p>
            <ul className="list-disc list-inside space-y-3 pl-4 mt-2">
                <li>
                    <strong>Player Attributes:</strong> On a player's profile, print to <strong>"Webpage, HTML Only"</strong>.
                    You can then use this file to create a new player or update an existing one's attribute history.
                </li>
                <li>
                    <strong>Manager Season Results:</strong> On your manager's history screen, go to the "Fixtures" view for a specific season. Print this view and save it as a <strong>text document (.txt)</strong>.
                    In the app, go to the manager's profile, edit their season stats, and use the "Import Results" button for the corresponding season. Friendlies will be ignored.
                </li>
                <li>
                    <strong>League Table:</strong> On a league screen for a completed season, print the table view to <strong>"Webpage, HTML Only"</strong>.
                    Use the "Import League Table" button on the manager's season stats row to add the final standings.
                </li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-2">Attribute & Value History</h3>
            <p>A powerful suite of tools for tracking player development over time.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Update Attributes:</strong> On a player's page, click this to either upload an HTML file of attributes from Football Manager or manually edit their current stats in a table. Both methods create a new, dated snapshot in their history.</li>
                <li><strong>Compare History:</strong> Compare any two historical snapshots side-by-side to see a detailed breakdown of attribute changes, with green highlights and double-arrows indicating significant improvements.</li>
                <li><strong>Manage History:</strong> View a list of all attribute snapshots for a player. From here, you can delete old records or set any previous snapshot as the player's current attributes.</li>
                <li><strong>Growth History Tab:</strong> Visualize player development on an interactive line graph. Select a player and an attribute to see its value plotted over time. You can also select "Overall Ability" to see a role-based score out of 100, providing a clear overview of their development journey. Lines are color-coded to indicate growth (green), decline (red), or stagnation (white).</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-2">Team Building & Simulation</h3>
            <p>Tools for creating your dream team and putting it to the test.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>All-Time XI Tab:</strong> Build your ultimate squad with a drag-and-drop interface. Choose a formation, drag players from the list onto the pitch, and then save your squad as a shareable `.json` file.</li>
                <li><strong>Match Day Tab:</strong> Simulate a match between two of your saved squads. The app calculates team ratings based on attributes and generates a full-time result, complete with goalscorers. You can then save the result as an image to share.</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-2">Analysis & Sharing</h3>
            <p>Extra features for in-depth analysis and showing off your players.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Compare Tab:</strong> Get a detailed, head-to-head analysis of any two players in your database. The view highlights superior attributes and provides a role-based verdict on who has the edge.</li>
                <li><strong>Player Cards Tab:</strong> Create and export beautiful, FUT-style summary cards. The card's design automatically changes based on the player's calculated ability score, and your favourite players get a special holographic foil effect.</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-2">Customisation</h3>
            <p>Tailor the application's data to your own Football Manager world in the "Customise" tab.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Core Data:</strong> Add and manage your own clubs, leagues, awards, save games, and FM versions to match your personal game world.</li>
                <li><strong>Appearance:</strong> Customize the look of the Trophy Cabinet (background texture, shelf color) and override any trophy icon with pre-designed options or your own uploaded image.</li>
                <li><strong>Backup & Restore:</strong> Use "Export All Data" to save your entire database, including settings, to a single file. "Import All Data" restores from a backup, overwriting everything currently in the app.</li>
                <li><strong>Danger Zone:</strong> The "Reset All Data" option will wipe your entire local database and restore the app to its factory settings. This action is irreversible.</li>
            </ul>
        </div>
    </div>
);


const AboutPage: React.FC<AboutPageProps> = ({ onOpenSupportModal }) => {
    const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);

    return (
        <>
            <div className="bg-gray-800/60 rounded-lg border border-gray-700/50 p-6 md:p-8 max-w-4xl mx-auto text-gray-300 h-full overflow-y-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">FM Player Archive</h2>
                    <p className="text-lg text-purple-400">Player Archive Companion</p>
                </div>

                <div className="space-y-6 text-center leading-relaxed max-w-2xl mx-auto">
                    <p>
                    This is a free, fan-made tool for tracking players and careers in Football Manager.
                    </p>
                    <p className="text-sm text-gray-400">
                    FM Player Archive is not affiliated with, endorsed, or supported by Sports Interactive, SEGA, or any official Football Manager developers.
                    </p>
                    <p className="text-sm text-gray-400">
                    Football Manager™ and related logos are property of Sports Interactive/SEGA.
                    All images, player likenesses, and data are added by users and not distributed by this app.
                    </p>
                    <p className="text-xs text-gray-500">
                    This tool is provided as-is with no warranty or guarantee.
                    </p>
                </div>

                <div className="text-center mt-10 flex justify-center gap-4">
                    <Button onClick={onOpenSupportModal} variant="primary">
                    Support FM Player Archive
                    </Button>
                    <Button onClick={() => setIsFeaturesModalOpen(true)} variant="secondary">
                        How to Use / Features
                    </Button>
                </div>

                <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-700/50 pt-4">
                    <p>© 2025 Chris Sorrell. All rights reserved.</p>
                </div>
            </div>

            <Modal isOpen={isFeaturesModalOpen} onClose={() => setIsFeaturesModalOpen(false)} title="Features & How-to-Use Guide" size="4xl">
                <div className="max-h-[75vh] overflow-y-auto pr-4">
                    <FeaturesGuideContent />
                </div>
            </Modal>
        </>
    );
};

export default AboutPage;