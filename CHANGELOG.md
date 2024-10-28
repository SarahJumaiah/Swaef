# Changelog

## [Unreleased]

### Added
- **Sorting for New Cases**: Added functionality to display newer cases at the top of the active cases list. This is done by sorting cases based on `case_id` in descending order.
- **Case Details Popup Redesign**: Enhanced the design of the case details popup with icons representing case type, reporter name, and contact number for improved visual appeal and readability.
- **Medic Response Distance**: Displayed the distance of each case from the medic's location, with "قريب جدًا" indicating very close proximity and the exact distance (in km) for farther cases.
- **Button Improvements**: Styled accept, reject, and complete buttons with clear icons and hover effects for a better user experience.
- **Acceptance Status Card**: Improved the design of the "Acceptance Status" card to include more visually appealing elements, including icons and estimated arrival time.
- **Database Migration**: Migrated backend from Mocha API to MongoDB, enhancing data storage and scalability.
- **Case Lifecycle Management**: Implemented a complete case flow, including submission, acceptance, and completion states.
- **Case Acceptance and Completion**: Enabled users to submit cases, while medics can accept and mark them as completed for streamlined emergency response.

### Changed
- **Redesigned Case Type Icons**: Updated icons to better represent each case type and improve interface intuitiveness.
- **Improved Case Details Section**: Enhanced the layout, colors, and spacing of the case details to improve responsiveness and user experience.
- **Enhanced Responsiveness**: Adjusted design and layout for smaller screens to ensure readability and accessibility.
- **Enhanced Case Submission Process**: Adjusted backend to accommodate MongoDB integration for smoother data handling.

### Fixed
- **Merge Conflict Resolution**: Resolved all merge conflicts between the main branch and other branches for smoother integration.
- **Medic Case Display Issue**: Corrected the issue where only accepted cases show the patient's phone number, preserving privacy for pending cases.
- **Pending Map Display Issue**: Currently addressing an issue with Mapbox, as the map is not displaying case locations correctly.

### Pending
- **Medic Backend Components**: Awaiting additional backend functionalities for the medic’s dashboard, currently managed by Hasna and Fahd.

---

## [Previous Releases]

### Version 1.0.1
- Initial setup of the project with basic structure and components.
- Basic medic dashboard with active and ongoing cases.
- Integration with `Mapbox` for case location visualization.
- Basic acceptance and rejection functionality for cases.
