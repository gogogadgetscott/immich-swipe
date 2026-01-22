# Settings Modal and Album Filters

**Date:** 2025-01-22
**Status:** Implemented
**Related Issues:** #20, #24

## Overview

This document describes the implementation of a centralized Settings Modal and comprehensive album filtering features, addressing GitHub issues #20 and #24.

## Requirements

### Issue #20: Album Awareness and Filtering
1. Visual indicator showing when a picture is in one or several albums
2. Confirmation dialog when deleting pictures that are in albums
3. Filtering capabilities:
   - Only show pics in albums
   - Only show pics in a specific album
   - Only show pics not in any album

### Issue #24: MIT License
- Add an MIT License file to the repository

## Implementation

### 1. MIT License
- **File:** `LICENSE`
- Added standard MIT License with copyright to Immich Swipe Contributors

### 2. Settings Modal Component
- **File:** `src/components/SettingsModal.vue`
- Centralized settings interface with:
  - Skip Videos toggle (moved from AppHeader)
  - Album filter radio buttons:
    - All Assets (default)
    - Only In Albums
    - Not In Albums
    - Specific Album (with dropdown selector)
  - Apply/Cancel buttons
- Dark mode support
- Responsive design

### 3. Delete Confirmation Modal
- **File:** `src/components/DeleteConfirmModal.vue`
- Shows when attempting to delete an asset that's in one or more albums
- Displays:
  - Warning icon and message
  - Number of albums the asset belongs to
  - List of album names (scrollable)
  - Delete Anyway / Cancel buttons
- Prevents accidental deletion of important photos

### 4. Preferences Store Updates
- **File:** `src/stores/preferences.ts`
- Added new state:
  - `albumFilter: AlbumFilter` - Current filter mode
  - `specificAlbumId: string | null` - Selected album when using specific album filter
- New actions:
  - `setAlbumFilter(filter)` - Set the album filter mode
  - `setSpecificAlbumId(albumId)` - Set the specific album to filter by
- Persisted to localStorage per user/server

### 5. Album Membership Tracking
- **File:** `src/composables/useImmich.ts`
- New features:
  - `assetAlbumsCache` - Map of asset IDs to their album IDs
  - `fetchAssetAlbums(assetId)` - Fetch which albums contain a specific asset
  - `getAssetAlbumIds(assetId)` - Get cached album IDs for an asset
  - `checkAlbumFilter(asset)` - Check if an asset passes the current album filter
- Updated `isReviewable()` to be async and check album filters
- Cache cleared when switching users or servers

### 6. Album Indicator on SwipeCard
- **File:** `src/components/SwipeCard.vue`
- Added props:
  - `albumIds?: string[]` - Array of album IDs the asset belongs to
  - `albumNames?: string[]` - Array of album names for display
- Visual badge showing:
  - Album icon
  - Number of albums
  - Tooltip with album name(s)
- Positioned in the media info area at the bottom

### 7. AppHeader Updates
- **File:** `src/components/AppHeader.vue`
- Removed Skip Videos toggle button
- Added Settings button (gear icon)
- Emits `openSettings` event when clicked
- Maintains existing functionality for:
  - Theme toggle
  - Stats display
  - Review order toggle
  - User/logout button

### 8. HomeView Integration
- **File:** `src/views/HomeView.vue`
- Integrated SettingsModal and DeleteConfirmModal
- Manages state for:
  - Settings modal visibility
  - Delete confirmation modal visibility
  - Current asset's album membership
- New functions:
  - `loadCurrentAssetAlbums()` - Load album info for current asset
  - `handleDelete()` - Check albums before deletion, show confirmation if needed
  - `confirmDelete()` / `cancelDelete()` - Handle delete confirmation
  - `openSettingsModal()` / `closeSettingsModal()` - Modal management
  - `handleApplySettings()` - Reload assets when filter settings change
- Watches for:
  - Current asset changes to load album info
  - Review order changes to reload feed
- Passes album info to SwipeCard component

## User Experience Flow

### Opening Settings
1. User clicks Settings button in AppHeader
2. SettingsModal opens with current settings pre-selected
3. User can toggle Skip Videos and select album filter
4. Changes only apply when clicking "Apply Settings"
5. Feed reloads with new filters

### Album Filtering
- **All Assets:** Default behavior, shows everything
- **Only In Albums:** Shows assets that are in at least one album
- **Not In Albums:** Shows only unorganized assets
- **Specific Album:** Shows only assets from the selected album

### Delete Confirmation
1. User attempts to delete an asset (swipe left, arrow key, or delete button)
2. System checks if asset is in any albums
3. If in albums:
   - DeleteConfirmModal appears
   - Shows album names and count
   - User can cancel or confirm deletion
4. If not in albums:
   - Deletes immediately (existing behavior)

### Album Indicator
- Blue badge on SwipeCard shows number of albums
- Visible at bottom of card with filename and date
- Hover/tooltip shows album names
- Updates automatically when asset changes

## Technical Details

### Performance Considerations
1. **Album Membership Caching:**
   - Results cached in `assetAlbumsCache` Map
   - Reduces API calls for previously seen assets
   - Cache cleared when switching users/servers

2. **Lazy Loading:**
   - Album membership fetched on-demand when asset is displayed
   - Albums list loaded only when needed (settings, album picker)

3. **Async Filtering:**
   - `isReviewable()` now async to check album filters
   - Batched processing in chronological mode
   - Maintains performance with sequential async checks

### Storage Keys
- Album filter preferences: `immich-swipe-preferences:<server>:<user>`
- Includes `albumFilter` and `specificAlbumId` fields

### API Calls
- `/albums` - List all albums (owned)
- `/albums?shared=true` - List shared albums
- `/albums/:id` - Get album details including assets

## Testing Checklist

- [x] MIT License added and visible
- [ ] Settings modal opens and closes correctly
- [ ] Skip Videos toggle works in settings modal
- [ ] Album filter options all work correctly
- [ ] Specific album dropdown populated with albums
- [ ] Settings persist across page reloads
- [ ] Delete confirmation shows for assets in albums
- [ ] Delete confirmation lists correct album names
- [ ] Delete proceeds after confirmation
- [ ] Delete cancels when clicking Cancel
- [ ] Album indicator badge shows on assets in albums
- [ ] Album count is accurate
- [ ] Album indicator tooltip works
- [ ] Feed reloads when changing filters
- [ ] Filters work correctly:
  - [ ] All Assets shows everything
  - [ ] Only In Albums shows only assets in albums
  - [ ] Not In Albums shows only unorganized assets
  - [ ] Specific Album shows only assets from selected album
- [ ] Performance is acceptable with filters enabled
- [ ] Dark mode works for all new components
- [ ] Mobile layout works correctly

## Future Enhancements

1. **Bulk Operations:**
   - Select multiple assets for album management
   - Batch delete with confirmation

2. **Advanced Filters:**
   - Combine multiple filters (e.g., videos not in albums)
   - Date range filtering
   - Tag-based filtering

3. **Album Management:**
   - Create albums from settings modal
   - Rename/delete albums
   - Reorder album list

4. **Performance:**
   - Prefetch album membership for next asset
   - Batch API calls for album membership
   - Background sync of album data

## Migration Notes

For existing users:
- Album filter defaults to "All Assets" (no behavior change)
- Skip Videos setting migrates from `immich-swipe-skip-videos` localStorage key
- No data migration required for preferences

## Related Files

**New Files:**
- `LICENSE`
- `src/components/SettingsModal.vue`
- `src/components/DeleteConfirmModal.vue`
- `plan/006-settings-modal-and-album-filters.md`

**Modified Files:**
- `src/stores/preferences.ts`
- `src/composables/useImmich.ts`
- `src/components/AppHeader.vue`
- `src/components/SwipeCard.vue`
- `src/views/HomeView.vue`

## References

- Issue #20: https://github.com/dev-nick421/immich-swipe/issues/20
- Issue #24: https://github.com/dev-nick421/immich-swipe/issues/24
