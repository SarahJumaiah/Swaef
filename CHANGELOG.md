# Changelog

## [Unreleased]

### Added
- **Sorting for New Cases**: Added functionality to display newer cases at the top of the active cases list. This is done by sorting cases based on `case_id` in descending order.
- **Case Details Popup Redesign**: Enhanced the design of the case details popup with icons representing case type, reporter name, and contact number for improved visual appeal and readability.
- **Medic Response Distance**: Displayed the distance of each case from the medic's location, with "قريب جدًا" indicating very close proximity and the exact distance (in km) for farther cases.
- **Button Improvements**: Styled accept, reject, and complete buttons with clear icons and hover effects for a better user experience.
- **Acceptance Status Card**: Improved the design of the "Acceptance Status" card to include more visually appealing elements, including icons and estimated arrival time.
  
### Changed
- **Redesigned Case Type Icons**: Updated the icons to better represent each case type and to make the interface more intuitive.
- **Improved Case Details Section**: Enhanced the overall layout, colors, and spacing of the case details information to make it more responsive and user-friendly.
- **Enhanced Responsiveness**: Adjusted the design and layout for better compatibility on smaller screens, ensuring that all elements remain readable and accessible.

### Fixed
- **Merge Conflict Resolution**: Resolved all merge conflicts between the main branch and other branches for a smooth integration of changes.
- **Medic Case Display Issue**: Corrected the issue where only accepted cases would show the patient's phone number to maintain privacy for pending cases.

---

## [Previous Releases]

### Version 1.0.0
- Initial setup of the project with basic structure and components.
- Basic medic dashboard with active and ongoing cases.
- Integration with `Mapbox` for case location visualization.
- Basic acceptance and rejection functionality for cases.
