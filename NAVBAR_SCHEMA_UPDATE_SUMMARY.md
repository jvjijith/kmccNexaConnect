# NavBar Schema Update Summary

## Overview
Updated the NavBar component to use a new menu response schema and added contact functionality.

## Key Changes Made

### 1. Updated Menu Interfaces
- **MultiItemType**: Added `menuSlug` field for navigation
- **MenuItemType**: Added `menuSlug` field for navigation  
- **MenuDataType**: Updated to match new schema with `menuSlug` support

### 2. Added Contact Functionality
- **Import**: Added `ContactSupport as ContactIcon` from Material-UI icons
- **Handler**: Added `handleContactClick()` function to navigate to `/contact`
- **Desktop Menu**: Added contact menu item between Profile and Logout
- **Mobile Menu**: Added contact menu item in mobile user menu

### 3. Navigation Updates
- **Menu Slug Usage**: Updated all navigation to use `menuSlug` with fallback to `menuName`
- **Desktop Menu**: 
  - Main items: `/${item.menuSlug || item.menuName.toLowerCase()}`
  - Sub items: `/${subItem.menuSlug || subItem.menuName.toLowerCase().replace(/\s+/g, '-')}`
- **Mobile Menu**: Same slug-based navigation pattern
- **Active Path**: Updated active path checking to use menuSlug

### 4. Display Updates
- **Menu Names**: Now displays `menuName` directly from schema
- **Removed**: `fetchMenuPageData` function (no longer needed)
- **Removed**: `menuDisplayNames` state (no longer needed)

### 5. User Menu Structure
**Desktop User Menu:**
1. Profile (existing)
2. Contact (new) - navigates to `/contact`
3. Logout (existing)

**Mobile User Menu:**
1. Profile (existing)
2. Contact (new) - navigates to `/contact`  
3. Cart (existing)
4. Logout (existing)

## Schema Example
```javascript
const menuData = {
  _id: "menu123",
  menuName: "Main Menu",
  menuSlug: "main-menu",
  items: [
    {
      menuName: "Home",
      menuSlug: "home",
      menuType: "single"
    },
    {
      menuName: "About",
      menuSlug: "about", 
      menuType: "multiple",
      multiItems: [
        {
          menuName: "Our Story",
          menuSlug: "our-story"
        }
      ]
    }
  ]
}
```

## Navigation Examples
- Home: `/home` (uses menuSlug)
- About: `/about` (uses menuSlug)
- About > Our Story: `/our-story` (uses submenu menuSlug)
- Contact (from user menu): `/contact`

## Backward Compatibility
- Fallback to `menuName.toLowerCase()` if `menuSlug` is not provided
- Maintains existing functionality while supporting new schema

## Files Modified
- `apps/web/app/components/navbar/NavBar.tsx` - Main NavBar component
- `apps/web/test-navbar-schema.js` - Test file demonstrating new schema

## Testing
The contact functionality can be tested by:
1. Logging in to the application
2. Clicking the user avatar/menu
3. Selecting "Contact" from the dropdown
4. Verifying navigation to `/contact` page