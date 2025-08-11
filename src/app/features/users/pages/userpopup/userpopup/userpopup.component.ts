import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/User';
import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
  selector: 'app-userpopup',
  standalone: false,
  templateUrl: './userpopup.component.html',
  styleUrl: './userpopup.component.css',
})
export class UserpopupComponent implements OnInit {
  CountryISO = CountryISO;
  searchFields = [SearchCountryField.All];

  showSuccess = false;
  providerForm!: FormGroup;

  ProfileImage: String | null = null;
  defaultImage = 'assets/images/profile.png';
  @Input() userData!: User;
  @Output() close = new EventEmitter<void>();
  @Input() isEditMode: boolean = false;
  @Input() initialData: User | null = null;
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      Firstname: ['', Validators.required],
      Lastname: ['', Validators.required],
      UserEmail: ['', [Validators.required, Validators.email]],
      PhoneNumber: [undefined, Validators.required],
      MobileNumber: [undefined, Validators.required],
      EmployeeId: [''],
      Roles: [[]],
      IsActive: [false],
      IsAdmin: [false],
    });

    if (this.userData) {
      const phoneParsed = this.userData.PhoneNumber
        ? parsePhoneNumberFromString(this.userData.PhoneNumber)
        : null;

      const mobileParsed = this.userData.MobileNumber
        ? parsePhoneNumberFromString(this.userData.MobileNumber)
        : null;

      const formatPhone = phoneParsed
        ? {
            number: phoneParsed.nationalNumber,
            internationalNumber: phoneParsed.number,
            countryCode: phoneParsed.country,
            dialCode: `+${phoneParsed.countryCallingCode}`,
          }
        : null;

      const formatMobile = mobileParsed
        ? {
            number: mobileParsed.nationalNumber,
            internationalNumber: mobileParsed.number,
            countryCode: mobileParsed.country,
            dialCode: `+${mobileParsed.countryCallingCode}`,
          }
        : null;

      this.userForm.patchValue({
        ...this.userData,
        PhoneNumber: formatPhone,
        MobileNumber: formatMobile,
        Roles: this.userData.Roles || [],
      });
      this.ProfileImage = this.userData.ProfileImage || null;
    }
  }

  closeForm() {
    this.close.emit();
  }
  onCancel(): void {
    this.close.emit();
  }

  // Handle image file selection
  toggleOptions: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.ProfileImage = reader.result as string;
        this.toggleOptions = false;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.ProfileImage = '';
    this.toggleOptions = false;
  }

  // Stub for camera functionality (can be implemented via plugins if needed)
  openCamera() {
    alert('Camera functionality can be implemented via native device plugins.');
    this.toggleOptions = false;
  }

  clearField(controlName: string): void {
    this.userForm.get(controlName)?.setValue('');
  }

  onSave() {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;

      const user: User = {
        UserName: formValues.UserEmail,
        UserEmail: formValues.UserEmail,
        Firstname: formValues.Firstname,
        Lastname: formValues.Lastname,
        PhoneNumber: formValues.PhoneNumber?.e164Number || '',
        MobileNumber: formValues.MobileNumber?.e164Number || '',
        EmployeeId: formValues.EmployeeId,
        IsActive: formValues.IsActive,
        IsAdmin: formValues.IsAdmin,
        PasswordHash: 'Default@123',
        Roles: formValues.Roles,
        EmailConfirmed: true,
        ProfileImage:
          typeof this.ProfileImage === 'string'
            ? this.ProfileImage.split(',')[1]
            : undefined,
      };

      console.log('Saving user:', user);

      if (this.initialData?.UserName) {
        // 🔁 EDIT MODE
        this.userService
          .updateUser(this.initialData.UserName!, user)
          .subscribe({
            next: () => {
              this.toastr.show('User updated successfully!', 'success');
              this.showSuccess = true;
              this.closeForm();
            },
            error: (err) => console.log(err),
          });
      } else {
        // ➕ ADD MODE
        this.userService.createUser(user).subscribe({
          next: () => {
            this.toastr.show('User saved successfully!', 'success');
            this.showSuccess = true;
            this.closeForm();
          },
          error: (err) => console.log(err),
        });
      }
    } else {
      this.userForm.markAllAsTouched();
      // Collect client-side validation errors
      const errors: string[] = [];
      const firstNameControl = this.userForm.get('Firstname');
      const lastNameControl = this.userForm.get('Lastname');
      const phoneNumberControl = this.userForm.get('PhoneNumber');
      const mobileNumberControl = this.userForm.get('MobileNumber');
      const emailControl = this.userForm.get('UserEmail');

      if (firstNameControl?.hasError('required')) {
        errors.push('First Name is required.');
      }
      if (lastNameControl?.hasError('required')) {
        errors.push('Last Name is required.');
      }
      if (phoneNumberControl?.hasError('required')) {
        errors.push('Phone Number is required.');
      } else if (phoneNumberControl?.hasError('pattern')) {
        errors.push('Please enter a valid 10-digit phone number.');
      }
      if (mobileNumberControl?.hasError('required')) {
        errors.push('Mobile Number is required.');
      } else if (mobileNumberControl?.hasError('pattern')) {
        errors.push('Please enter a valid 10-digit mobile number.');
      }
      if (emailControl?.hasError('required')) {
        errors.push('Email is required.');
      } else if (emailControl?.hasError('email')) {
        errors.push('Please enter a valid email address.');
      }

      // Show errors nicely with line breaks
      const errorMessage = errors.join('<br/>');
    }
  }
}
