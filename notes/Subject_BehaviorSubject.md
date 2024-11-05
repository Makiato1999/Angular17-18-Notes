# Subject and BehaviorSubject in Angular

In Angular, `Subject` and `BehaviorSubject` are important classes provided by RxJS, often used for data sharing, event triggering, and state management between components. Let's dive into the differences and use cases for each.

---

## Overview of `Subject` and `BehaviorSubject`

- **`Subject`**: A multicast Observable that allows multiple subscribers to share the same data stream.
- **`BehaviorSubject`**: A specialized type of `Subject` that retains the latest value and immediately sends it to any new subscribers.

---

## `Subject` in Angular

A `Subject` is a type of multicast (multi-subscriber) Observable, which means that multiple subscribers can share the same data stream. A `Subject` has no initial value and does not store any previously emitted values. Subscribers only receive data emitted after they subscribe.

### Key Characteristics

- **No Initial Value**: A `Subject` does not hold an initial value when created.
- **No Stored Value**: New subscribers do not receive previously emitted data.
- **Multicasting**: A `Subject` allows multiple subscribers to share the same data stream.


### Using `Subject` to Transfer Data (String) in Angular

In this example, we use a `Subject` to share a string message between multiple components. When one component sends a message, other components subscribed to this `Subject` can receive and respond to the message.

Service:
```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // Create a Subject to share string data
  private messageSubject = new Subject<string>();

  // Expose the Subject as an Observable for other components to subscribe to
  message$ = this.messageSubject.asObservable();

  // Send a message through the Subject
  sendMessage(message: string) {
    this.messageSubject.next(message); // Send the message to all subscribers
  }
}
```
Component:

One component can use the sendMessage method to push a new message to the Subject.

```typescript
import { Component } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-sender',
  template: `<button (click)="send()">Send Message</button>`
})
export class SenderComponent {

  constructor(private messageService: MessageService) {}

  send() {
    this.messageService.sendMessage('Hello from SenderComponent!'); // Send a message
  }
}
```
Component:

Another component can subscribe to message$ to receive and display the message.

```typescript
import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-receiver',
  template: `<p>Received Message: {{ message }}</p>`
})
export class ReceiverComponent implements OnInit {
  message: string = '';

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Subscribe to the message Observable
    this.messageService.message$.subscribe(msg => {
      this.message = msg;  // Update message when a new one is received
    });
  }
}
```

---

## `BehaviorSubject` in Angular TypeScript

`BehaviorSubject` is an extension of `Subject`. It not only multicasts to multiple subscribers but also retains the latest emitted value, which is immediately sent to any new subscribers upon subscription. `BehaviorSubject` requires an initial value and always stores the most recent value.

### Key Characteristics

- **Has an Initial Value**: `BehaviorSubject` requires an initial value upon creation.
- **Stores the Latest Value**: It always stores the latest value emitted, and any new subscribers receive this value immediately.
- **Multicasting**: Like `Subject`, `BehaviorSubject` can have multiple subscribers.

### Using `BehaviorSubject` for State Sharing

Service:

In this example, we use `BehaviorSubject` to share a state (e.g., user login status) across components.

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Create a BehaviorSubject with an initial value of `false` (logged out)
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  // Expose a read-only Observable for components to subscribe to
  loggedIn$ = this.loggedInSubject.asObservable();

  // Update the login status
  setLoggedIn(status: boolean) {
    this.loggedInSubject.next(status);  // Update latest value, all subscribers are notified
  }

  // Get the current login status
  isLoggedIn(): boolean {
    return this.loggedInSubject.getValue();
  }
}
```
Component:

In LoginComponent, we use AuthService to set the login status. 

StatusComponent subscribes to loggedIn$ to react to any changes in login status.
```typescript
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `<button (click)="login()">Login</button>`
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.setLoggedIn(true);  // Log in the user
  }
}

@Component({
  selector: 'app-status',
  template: `<p *ngIf="isLoggedIn">User is logged in</p>`
})
export class StatusComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Subscribe to login status
    this.authService.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }
}
```


