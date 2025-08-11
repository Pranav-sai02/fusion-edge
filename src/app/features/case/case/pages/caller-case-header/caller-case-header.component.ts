import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-caller-case-header',
  standalone: false,
  templateUrl: './caller-case-header.component.html',
  styleUrl: './caller-case-header.component.css',
})
export class CallerCaseHeaderComponent implements OnInit {
  caseRef!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.caseRef = params.get('callRef') ?? '';
    });
  }
}
