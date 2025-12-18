# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2025-01-XX

### Added
- Single-select mode now returns a single value (`T | undefined`) instead of an array when `singleSelect={true}`
- Single-select mode displays plain text instead of badges with remove buttons
- `singleSelect` prop documented in API reference

### Changed
- **BREAKING**: `value` prop type changed from `T[]` to `T | T[]` to support both single and multi-select modes
- **BREAKING**: `defaultValue` prop type changed from `T[]` to `T | T[]`
- **BREAKING**: `onValueChange` callback now receives `T | T[]` instead of `T[]`
- Single-select mode automatically closes picker after selection
- Single-select mode hides remove buttons and clear all button

### Fixed
- Single-select mode now correctly returns the selected option object/string instead of an array
- Single-select display now shows plain text without badge styling

## [0.0.1] - Initial Release

### Added
- Multi-select combobox component
- Single-select mode (previously returned array)
- AJAX autocomplete support
- Grouped options support
- Custom object support with label/value getters
- Search functionality
- Responsive design support
- Fully customizable styling via class props
- Accessibility support via Bits UI primitives
