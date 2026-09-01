# Changelog

All notable changes to the **Greetly** project will be documented in this file.

## [2026-09-01] - Audio Feedback & Cooldown UI Verification

### Verified
- **Audio Feedback Mechanisms**: Successfully tested and confirmed that the active-low buzzer functions correctly using the Open-Drain hack across all system triggers:
  - Web Dashboard "Test Buzzer" feature.
  - Remote Registration completion.
  - Daily Attendance Scan facial recognition.

### Added
- **Cooldown UI Enhancements**: Implemented visual feedback for users scanning during the active cooldown window. The bounding box now turns **BLUE** and the on-screen text displays **"[Nama Pelajar] (Sudah Hadir)"**. This prevents duplicate database insertions while providing clear, silent visual confirmation to the user.
