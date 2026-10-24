import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { InputOtpModule } from 'primeng/inputotp';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield'; 
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { FluidModule } from 'primeng/fluid';
import { ToolbarModule } from 'primeng/toolbar';
import {RouterModule} from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RippleModule } from 'primeng/ripple';
import { KeyFilterModule } from 'primeng/keyfilter';
import { StepperModule } from 'primeng/stepper';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabsModule } from 'primeng/tabs';
import { MessageModule } from 'primeng/message';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports:[
    CardModule,
    TimelineModule,
    TagModule,
    InputIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    PasswordModule,
    InputTextModule,
    DividerModule,
    StyleClassModule,
    PanelModule,
    ToastModule,
    MenuModule,
    TableModule,
    MultiSelectModule,
    FileUploadModule,
    InputOtpModule,
    InputGroupModule,
    InputGroupAddonModule,
    DialogModule,
    ConfirmDialogModule,
    IconFieldModule,
    ProgressSpinnerModule,
    TooltipModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
    AccordionModule,
    FluidModule,
    ToolbarModule,
    RouterModule,
    SelectButtonModule,
    RippleModule,
    KeyFilterModule,
    StepperModule,
    InputNumberModule,
    RadioButtonModule,
    SplitButtonModule,
    TabsModule,
    MessageModule,
    TieredMenuModule,
    ToggleSwitchModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[
    MessageService,
    ConfirmationService,
    DatePipe
  ]
})
export class Shared { }
