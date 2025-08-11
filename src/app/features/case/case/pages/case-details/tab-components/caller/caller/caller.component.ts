import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SOUTH_AFRICAN_LANGUAGES } from '../../../../../../../../constants/south-african-languages';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CaseDetails } from '../../../../../models/CaseDetails';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { ActivatedRoute } from '@angular/router';
import { CaseDataService } from '../../../../../services/case-data-service/case-data.service';
import { ServicesPageService } from '../../../../../../../service-provider/services-page/services/service-page/services-page.service';
import { ServicesPage } from '../../../../../../../service-provider/services-page/models/Services-page';
import { privateDecrypt } from 'crypto';
import { Client } from '../../../../../../../client-module/models/Client';
import { ClientService } from '../../../../../../../client-module/services/client-services/client.service';
import { User } from '../../../../../../../users/models/User';
import { UserService } from '../../../../../../../users/services/user.service';

@Component({
  selector: 'app-caller',
  standalone: false,
  templateUrl: './caller.component.html',
  styleUrl: './caller.component.css',
})
export class CallerComponent implements OnInit {
  languages = SOUTH_AFRICAN_LANGUAGES;
  caseRef!: string;
  callerName: string = '';

  activeTab: string = 'caller';
  callerForm!: FormGroup;
  caseData: CaseDetails | null = null;

  client: Client[] = [];
  services: ServicesPage[] = [];
  agentList: User[] = [];

  separateDialCode = false;
  SearchCountryField = [SearchCountryField.Name, SearchCountryField.Iso2];
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.SouthAfrica,
    CountryISO.UnitedStates,
  ];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  // phoneForm!: FormGroup;
  searchFields = [
    SearchCountryField.Name,
    SearchCountryField.DialCode,
    SearchCountryField.Iso2,
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private caseDataService: CaseDataService,
    private servicePageService: ServicesPageService,
    private clientService: ClientService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.caseRef = params.get('callRef') ?? '';
      this.callerName = params.get('callerName') ?? '';
      // this.client = params.get('client') ?? '';
    });
    this.callerForm = this.fb.group({
      client: [''],
      serviceType: [''],
      consent: [''],
      firstName: [''],
      secondName: [''],
      callbackNumber: [''],
      cellNumber: [''],
      isPolicyHolder: [''],
      agent: [null],
      callOpenDate: [''],
      language: [''],
      refGiven: [''],
      contacts: this.fb.array([this.createContactGroup()]),
    });
    this.servicePageService.getAllServices().subscribe((services) => {
      this.services = services;
    });
    this.clientService.getAllClients().subscribe((services) => {
      this.client = services;
    });
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.agentList = users
        .filter(
          (user: User) => user.IsActive && user.AspNetUserId !== undefined
        )
        .map((user: User) => ({
          ...user,
          id: user.AspNetUserId!,
          name: `${user.Firstname} ${user.Lastname}`,
        }));
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  get contacts(): FormArray {
    return this.callerForm.get('contacts') as FormArray;
  }

  private createContactGroup(value: any = {}): FormGroup {
    return this.fb.group({
      firstName: [value.firstName || ''],
      surname: [value.surname || ''],
      callbackNumber: [value.callbackNumber || ''],
      relationship: [value.relationship || ''],
    });
  }

  addContactRow(): void {
    if (this.contacts.length < 2) this.contacts.push(this.createContactGroup());
  }

  removeContactRow(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  onSubmit(): void {
    if (this.callerForm.valid) {
      console.log(this.callerForm.value);
    }
  }

  getYearRange() {
    throw new Error('Method not implemented.');
  }

  // In component.ts
  relationships: { value: string; label: string }[] = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
  ];
}
