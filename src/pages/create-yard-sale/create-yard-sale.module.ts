import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateYardSalePage } from './create-yard-sale';

@NgModule({
  declarations: [
    CreateYardSalePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateYardSalePage),
  ],
})
export class CreateYardSalePageModule {}
