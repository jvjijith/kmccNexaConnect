// Test file to demonstrate the new NavBar menu schema
// This file shows how the new menu schema works with the updated NavBar

// Example menu data with the new schema
const exampleMenuData = {
  _id: "menu123",
  appId: "app456",
  menuName: "Main Menu",
  menuType: "multiple",
  menuSlug: "main-menu",
  layoutType: "top",
  menuPage: "page789",
  imageUrl: "https://example.com/menu-image.jpg",
  allowImage: true,
  items: [
    {
      menuName: "Home",
      menuType: "single",
      menuSlug: "home",
      menuPage: "home-page",
      imageUrl: "https://example.com/home-icon.jpg",
      allowImage: true,
      active: true
    },
    {
      menuName: "About",
      menuType: "multiple",
      menuSlug: "about",
      multiItems: [
        {
          menuName: "Our Story",
          menuType: "single",
          menuSlug: "our-story",
          menuPage: "story-page",
          active: true
        },
        {
          menuName: "Team",
          menuType: "single", 
          menuSlug: "team",
          menuPage: "team-page",
          active: true
        }
      ],
      active: true
    },
    {
      menuName: "Services",
      menuType: "single",
      menuSlug: "services",
      menuPage: "services-page",
      active: true
    },
    {
      menuName: "Contact",
      menuType: "single",
      menuSlug: "contact",
      menuPage: "contact-page",
      active: true
    }
  ],
  active: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
};

// Key changes in the NavBar component:
// 1. Updated interfaces to match new schema
// 2. Added ContactIcon import and contact handler
// 3. Removed fetchMenuPageData function (no longer needed)
// 4. Updated navigation to use menuSlug with fallback to menuName
// 5. Display menuName directly instead of fetching page data
// 6. Added contact option to both desktop and mobile user menus

// Navigation examples:
// - Home: /home (uses menuSlug)
// - About > Our Story: /our-story (uses submenu menuSlug)
// - Services: /services (uses menuSlug)
// - Contact: /contact (uses menuSlug)

// User menu now includes:
// - Profile (existing)
// - Contact (new)
// - Logout (existing)

export { exampleMenuData };