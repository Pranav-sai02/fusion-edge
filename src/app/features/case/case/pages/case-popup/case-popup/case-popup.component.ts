import { Component, EventEmitter, Output } from '@angular/core';
import { CaseService } from '../../../services/case-service/case.service';
import { Client } from '../../../../../client-module/models/Client';
import { ServicesPage } from '../../../../../service-provider/services-page/models/Services-page';
import { ClientService } from '../../../../../client-module/services/client-services/client.service';
import { ServicesPageService } from '../../../../../service-provider/services-page/services/service-page/services-page.service';

@Component({
  selector: 'app-case-popup',
  standalone: false,
  templateUrl: './case-popup.component.html',
  styleUrl: './case-popup.component.css',
})
export class CasePopupComponent {
  showPopup = false;

  clientName: string = '';
  serviceType: string = '';

  clients: Client[] = [];
services: ServicesPage[] = [];

  @Output() close = new EventEmitter<void>();

  constructor(private caseService: CaseService,private clientService: ClientService,private servicesPageService: ServicesPageService ) {}


  ngOnInit(): void {
  this.loadClients();
  this.loadServices();
}

loadClients() {
  this.clientService.getAllClients().subscribe({
    next: (res) => this.clients = res,
    error: (err) => console.error('Error loading clients', err)
  });
}

loadServices() {
  this.servicesPageService.getAllServices().subscribe({
    next: (res) => this.services = res,
    error: (err) => console.error('Error loading services', err)
  });
}

  onClose() {
    this.close.emit();
    this.showPopup = false;
  }

  openPopup() {
    this.showPopup = true;
  }

  onSave() {
    const newCase: any = {
      ClientName: this.clientName,
      ServiceType: this.serviceType,
      // Add more fields as needed
    };

    this.caseService.createCase(newCase).subscribe({
      next: (response) => {
        console.log('Case saved successfully:', response);
        this.onClose();
      },
      error: (error) => {
        console.error('Error saving case:', error);
      },
    });
  }
}
