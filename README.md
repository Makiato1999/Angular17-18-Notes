# Angular17 & 18 Notes

> Study notes for Angular 17 & 18, generated by Xiaoran

## Table of Contents
Filter
- [Button Toggle](#anchor_fi_1)<br/>

Form
- [Input Validation](#anchor_fo_1)<br/>
- [Date Filter](#anchor_fo_2)<br/>
- [Button Disable](#anchor_fo_3)<br/>

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

**crud-app** resouce: 

**crud-tutorial-app** resouce: https://www.bezkoder.com/angular-17-crud-example/
