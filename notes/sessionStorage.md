# Using `sessionStorage` in Angular

`sessionStorage` is a web storage mechanism provided by the browser that can be used to store temporary data during the current session. It’s suitable for data that should be cleared automatically when the browser tab is closed, making it ideal for session-based data storage.

## Features of `sessionStorage`

- **Temporary**: Data is only available in the current tab or window and is automatically cleared when the tab is closed.
- **Isolated**: Data is isolated per origin and tab. Even if multiple tabs are open on the same site, they won’t share `sessionStorage` data.
- **Capacity Limit**: `sessionStorage` typically has a storage limit of 5-10MB (depending on the browser).

## Basic `sessionStorage` Methods

| Method                                      | Description                                              |
|---------------------------------------------|----------------------------------------------------------|
| `setItem(key: string, value: string): void` | Stores data in `sessionStorage` with a key-value pair (both as strings). |
| `getItem(key: string): string \| null`      | Retrieves data from `sessionStorage` by key, returns a string or `null`. |
| `removeItem(key: string): void`             | Deletes the specified key and its data from `sessionStorage`. |
| `clear(): void`                             | Clears all data in `sessionStorage`.                      |

## Using `sessionStorage` in Angular

To manage `sessionStorage` effectively in Angular, it’s recommended to create a service that wraps `sessionStorage` operations. This makes the code more maintainable and reusable.

### Example: Creating a `SessionStorageService`

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  // Saves data to sessionStorage
  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  // Retrieves data from sessionStorage
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  // Removes data from sessionStorage by key
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clears all data in sessionStorage
  clear(): void {
    sessionStorage.clear();
  }
}
```

