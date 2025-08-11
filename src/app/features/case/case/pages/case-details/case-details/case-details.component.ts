import { Component, OnInit } from '@angular/core';
import { SOUTH_AFRICAN_LANGUAGES } from '../../../../../../constants/south-african-languages';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CaseDetails } from '../../../models/CaseDetails';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { ActivatedRoute } from '@angular/router';
import { CaseDataService } from '../../../services/case-data-service/case-data.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-case-details',
  standalone: false,
  templateUrl: './case-details.component.html',
  styleUrl: './case-details.component.css',
})
export class CaseDetailsComponent {}
