# Angular17 & 18 Notes

> Study notes for Angular 17 & 18, generated by Xiaoran

## Table of Contents
RxJS
- [sessionStorage](#anchor_ss_1)<br/>

Filter
- [Button Toggle](#anchor_fi_1)<br/>

Form
- [Input Validation](#anchor_fo_1)<br/>
- [Date Filter](#anchor_fo_2)<br/>
- [Button Disable](#anchor_fo_3)<br/>

Table
- [Dynamic Table](#anchor_ta_1)<br/>

## Session Storage, sharing data across multiple components <a name="anchor_ss_1"></a>
#### Subject
session-storage.service.ts (Service)
```typescript
import { Injectable } from "@angular/core";
import { LAST_OFFER_KEY } from 'src/app/constants/constant';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SessionService {
    private offerIdAvailable = new Subject<string>();
    offerIdAvailable$ = this.offerIdAvailable.asObservable();

    constructor() {
        const lastOfferId = sessionStorage.getItem(LAST_OFFER_KEY);
        if (lastOfferId) {
            this.offerIdAvailable.next(lastOfferId);
        }
    }

    setLastOpenedOfferId(offerId: number) {
        sessionStorage.setItem(LAST_OFFER_KEY, offerId.toString());
        this.offerIdAvailable.next(offerId.toString());
    }
}
```
offer-detail.component.ts (Observer)
```typescript
import { SessionService } from 'src/app/services/session-storage.service';

export class OfferDetailComponent implements OnInit, OnDestroy {
    ...
    constructor(
        ...
        private sessionService: SessionService) {
    }
    ...
    setLastOpenedOffer() {
        this.sessionService.setLastOpenedOfferId(this.offerId);
        ...
    }
    ...
}
```
offer-display.component.ts (Observable)
```typescript
import { SessionService } from 'src/app/services/session-storage.service';

export class AppHeaderComponent implements OnInit {
    ...
    constructor(
        ...
        private sessionService: SessionService) {
    }
    ...
    ngOnInit(): void {
        ...
        this.getLastOpenedOffer();
    }
    ...
    getLastOpenedOffer() {
        this.sessionService.offerIdAvailable$.subscribe(offerId => {
            this.offerService.getInternalLiftOfferDetail(Number(offerId)).subscribe({
                next: res => {
                    ...
                },
                error: () => {
                    ...               
                }
            });
        });
    }
}
```
> Subject 不会存储或缓存它发送的最新值，因此当你在 constructor 中调用 next 后，这个值并不会被保留。换句话说，当组件稍后订阅 offerIdAvailable$ 时，它不会自动收到之前调用 next 时发送的值。只有当前活跃的订阅者才能接收到 Subject 的值。在 Angular 中，服务的 constructor 会在服务被首次注入到组件或其他服务时调用。这意味着，当应用启动时，SessionService 的 constructor 会立即执行，获取并尝试发送 sessionStorage 中的初始值。
然而，这个时候可能没有任何组件订阅 offerIdAvailable$。因此，尽管你在 constructor 中调用了 next，但没有任何活跃的订阅者能接收到这个值。

#### BehaviorSubject
session-storage.service.ts
```typescript
import { Injectable } from "@angular/core";
import { LAST_DRAFT_OFFER_KEY } from 'src/app/constants/constant';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SessionService {
    private offerIdAvailable = new BehaviorSubject<string | null>(null);
    offerIdAvailable$ = this.offerIdAvailable.asObservable();

    constructor() {
        const lastOfferId = this.getLastOpenedDraftOfferId();
        if (lastOfferId) {
            this.offerIdAvailable.next(lastOfferId);
        }
    }

    setLastOpenedDraftOfferId(offerId: number) {
        sessionStorage.setItem(LAST_DRAFT_OFFER_KEY, offerId.toString());
        this.offerIdAvailable.next(offerId.toString()); // Notify subscribers
    }

    getLastOpenedDraftOfferId(): string | null {
        return sessionStorage.getItem(LAST_DRAFT_OFFER_KEY);
    }
}
```

## Button Toggle<a name="anchor_fi_1"></a>
> There are two buttons that can filter the table, and the selected button should remain active.

HTML
```html
<button  mat-raised-button (click)="setFlagOn()" [ngClass]="{'flag-button': isFlagOn}">
    <span class="d-none d-xs-none d-sm-none d-md-none d-lg-inline d-xl-inline"> condition_1 </span>
</button>
<button  mat-raised-button (click)="setFlagOff()" [ngClass]="{'flag-button': !isFlagOn}">
    <span class="d-none d-xs-none d-sm-none d-md-none d-lg-inline d-xl-inline"> condition_2 </span>
</button>
```
Typescript
```typescript
isFlagOn = false;
...
setFlagOn(){
    ...
    this.getPrices();
    this.isFlagOn = true;
}
setFlagOff(){
    ...
    this.getPrices();
    this.isFlagOn = false;
}
getPrices() {
    this.loadingBP= true; // Set loading flag to true
    this.subscription.add(this.priceService.getPaginatedPrices(this.pageIndex, this.pageSize, this.sortingParam, ...parameters..., this.flag)
        .subscribe((res) => {
            // Assign fetched prices to Prices variable
            this.bpData.data = res.content.filter(price => price.flag === this.flag);// Filter by condition_1 or condition_2
            this.totalRecords = res.totalRecordCount;
            this.bpData.sort = this.sort;
            this.needUpdate = false; // Reset update flag
            this.loadingBP = false; // Set loading flag to false
        },
        (error) => {
            console.error("Error fetching prices:", error);
            this.loadingBP = false; // Set loading flag to false in case of error
        }));
 }
```
Styles
```css
.flag-button {
    background-color: #FF5722;
    color: white;
}
```

## Form Input Validation with ngModel<a name="anchor_fo_1"></a>
HTML
```html
<mat-form-field  appearance="outline">
    <mat-label>Price</mat-label>
    <input matInput id="price"
        [(ngModel)]="detailModel.price"
        placeholder="Enter Price"
        (ngModelChange)="onFormChange()"
        #price="ngModel"
        required
        [pattern]="priceRegex" >
    <mat-error 
        *ngIf="price.hasError('required') && price.touched && price.dirty">
        Price is required
    </mat-error>
    <mat-error 
        *ngIf="price.hasError('pattern') && price.touched" >
        Numbers only, max 3 digits before decimal
    </mat-error>
</mat-form-field>
```
Typescript
```typescript
isFormInvalid = true; // The save button is disabled until the inputs in the form are valid.
priceRegex : RegExp;
...
onFormChange() {
    this.formChanged = true; 
    // The save button is disabled until the inputs in the form are valid.
    const {validate, error} = this.validateRequest();
    if (validate == false) {
      this.isFormInvalid = true;
    } else {
      this.isFormInvalid = false;
    }
}

validateRequest(): {validate: boolean, error : string}{
    this.priceRegex = /^\d{1,3}(\.\d+)?$/;
    if(!this.detailModel.price) {
      return {validate: false, error : "Enter Price"};
    }
    else if (Number(this.detailModel.price <= 0)) {
      return {validate: false, error : "Price must be positive"};
    }
    else if (isNaN(Number(this.detailModel.price))) {
      return { validate: false, error: "Price must be a number" };
    }
    else if (this.priceRegex.test(this.detailModel.price.toString()) === false) {
      return { validate: false, error: "Price must have up to 3 digits before decimal" };
    }
    else if(!this.detailModel.effectiveDate){
      return {validate: false, error : "Enter Date"};
    }...
    else{
      return {validate: true, error : null};
    }
}
```
Styles
```css
mat-error {
    line-height: 1;
    text-align: center; 
}
```

## Form Date Filter<a name="anchor_fo_2"></a>
HTML
```html
<mat-form-field  appearance="outline">
    <mat-label>Date</mat-label>
    <input 
    matInput 
    type="text" 
    id="date" 
    [(ngModel)]="detailModel.date" 
    [matDatepicker]="picker" 
    placeholder="Choose a date" 
    [matDatepickerFilter]="dateFilter" >
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
 </mat-form-field>    
```
Typescript
```typescript
// Set the date limit to 10 years in the past from the current year.
dateFilter(d: Date): boolean {
    const currDate = new Date();
    const pastDate =  new Date();
    const gap = 10;
    pastDate.setFullYear(currDate.getFullYear() - gap);
    return d >= pastDate && d <= currDate; 
}
```

## Button Disable<a name="anchor_fo_3"></a>
HTML
```html
<button mat-stroked-button color="primary" (click)="addOrUpdate()" [disabled]="isDisable" >
    <mat-icon>save</mat-icon>
    <span class="d-none d-xs-none d-sm-none d-md-none d-lg-inline d-xl-inline">
        Save 
    </span>
</button>
```
Typescript
```typescript
isDisable = true;
...
onFormChange() {
    this.formChanged = true;
    // The save button is disabled until the inputs in the form are valid.
    const {validate, error} = this.validateRequest();
    if (validate == false) {
      this.isDisable = true;
    } else {
      this.isDisable = false;
    }
  }
```


**crud-tutorial-app** resouce: https://www.bezkoder.com/angular-17-crud-example/
