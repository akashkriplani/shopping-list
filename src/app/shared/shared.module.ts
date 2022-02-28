import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { PlaceholderDirective } from './placeholder.directive';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ]
})
export class SharedModule {}
