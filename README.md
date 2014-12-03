kido-scraper-script-generator
=============================

# How to install this Chrome extension
- Make sure you are using Node 0.10.x. If you use nvm:
	- `nvm use 0.10`
- Install all project dependencies
	- `npm install`
- Execute the build that will "browserify" the project
    - `npm run bundle`
- Install this extension in Chrome
	- Go to Chrome --> More tools --> Extensions or simply enter `chrome://extensions/` in the address bar.
	- Make sure the checkbox "Developer mode" is checked.
	- Click on "Load unpacked extension..." and select the "extensions" directory of this project.
- Verify the installation
	- Open any page and toggle Chrome's Developer Tools (More tools --> Developer Tools)
	- You should see a small tab tagged "Kido Scraper". This reflects the extension has been installed successfully.

#To-Do:

- Should the help be on the left hand side? (Western) Readers usually  go from left to right.
- On "New Site" --> use current site name and URL.
- New Site: "Go" button to navigate to URL.
- Add new Step 'form':
	- Submit button: what if there's no button ?
		* Enter
	- Redirect to Site details (instead of Sites list). Done.
	- Add Cancel button logic. Done.
	- Validation in form
- Site Details
	- Edit step
	- Delete Step
- Add new Step 'scrape':
	- remove button throws error: `TypeError: Cannot read property 'steps' of undefined`
	- add more attributes
- Export
	- Display code in a \<pre\>. Done.
- Reuse the navigation header (breadcrumb) somehow.