# Donation Events Implementation

## Overview
This document describes the implementation of minimal display for donation events in the slider component.

## Changes Made

### 1. Updated SlideData Interface
- Added `metadata` property to the `SlideData` interface in `apps/web/src/components/slider.tsx`
- This allows tracking of event metadata including the `name` field used to identify donation events

### 2. Modified getEventInfo Function
- Updated the `getEventInfo` function to include `metadata` from the event data in the returned `SlideData` object
- This ensures donation event metadata is available for rendering decisions

### 3. Created renderDonationEventCard Function
- Added a new `renderDonationEventCard` function that renders minimal donation event cards
- Features:
  - **Same size and layout** as regular event cards for visual consistency
  - Displays only event name (title) and description
  - Removes location, date, and price information
  - Uses left-aligned text (matching regular cards)
  - Includes a "Support This Cause" button instead of "View Event Details"
  - Maintains consistent styling, hover effects, and button styling with other event cards
  - Description gets more space (4 lines instead of 1) since other details are removed

### 4. Updated Render Logic
- Modified the main render logic to check if an event is a donation event (`slide.metadata?.name === 'donation'`)
- Routes donation events to use `renderDonationEventCard` instead of `renderEventCard`
- Maintains backward compatibility for all other event types

## How It Works

1. When event data is fetched, the `getEventInfo` function now preserves the `metadata` from the original event
2. During rendering, the component checks if `slide.metadata?.name === 'donation'`
3. If true, it uses the minimal `renderDonationEventCard` renderer
4. If false, it uses the standard `renderEventCard` renderer with full details

## Event Identification
Donation events are identified by having `metadata.name = "donation"` in their event data structure.

## Visual Differences
- **Regular Events**: Show image, title, location, date, price, description (1 line), and "View Event Details" button
- **Donation Events**: Show image, title, description (4 lines), and "Support This Cause" button only
- **Size**: Both card types have identical dimensions and layout structure

## Key Features
- **Visual Consistency**: Donation cards match the exact size and layout of regular event cards
- **Minimal Content**: Only essential information (title and description) is displayed
- **Enhanced Description**: More space allocated to description since other details are removed
- **Consistent Styling**: Same hover effects, shadows, and button styling as regular cards
- **Responsive Design**: Maintains responsive behavior across different screen sizes

## Testing
The implementation has been tested with:
- Successful build compilation
- No TypeScript errors or warnings
- Maintains existing functionality for non-donation events
- Cards have consistent sizing and appearance