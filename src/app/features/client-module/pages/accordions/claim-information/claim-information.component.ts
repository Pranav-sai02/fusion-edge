import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabStateService } from '../../../services/tab-state-service/tab-state.service';
import { UserService } from '../../../../users/services/user.service';
import { Client } from '../../../models/Client';
import { quillDefaultModules } from '../../../../../shared/config/text-editor-config';
import Quill from 'quill';
import type { ContentChange } from 'ngx-quill';

@Component({
  selector: 'app-claim-information',
  standalone: false,
  templateUrl: './claim-information.component.html',
  styleUrls: ['./claim-information.component.css'],
})
export class ClaimInformationComponent implements OnInit, OnDestroy {
  quillModules = quillDefaultModules;

  // Quill HTML -> goes to payload.ClaimFormDeclaration
  claimDeclaration = '';
  // Plain textarea -> payload.ClaimFormDeclarationPlain
  editorContent = '';

  selectedManager = '';
  processClaims = false;
  nearestClaimCentre = false;
  enableDeathClaimVoucher = false;

  claimsManagers: { value: string; label: string }[] = [];

  private destroy$ = new Subject<void>();
  private quill?: Quill;

  constructor(
    private tabState: TabStateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadClaimsManagers();

    this.tabState.claimInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Partial<Client>) => {
        if (!data) return;
        this.selectedManager = data.ClaimsManager ?? '';
        this.claimDeclaration = data.ClaimFormDeclaration ?? '';
        this.editorContent =
          data.ClaimFormDeclarationPlain ?? this.toPlain(this.claimDeclaration) ?? '';
        this.processClaims = data.ProcessClaims ?? false;
        this.nearestClaimCentre = data.NearestClaimCentre ?? false;
        this.enableDeathClaimVoucher =
          data.EnableVoucherExportOnDeathClaim ?? false;
      });
  }

  // capture instance (optional, handy as a fallback)
  onEditorCreated(editor: Quill): void {
    this.quill = editor;
  }

  // Primary path: Quill emits full change payload with .html
  onContentChanged(e: ContentChange): void {
    this.setHtml(e?.html ?? '');
  }

  // Fallback: if your ngx-quill version pipes through ngModel
  onModelChange(val: string): void {
    this.setHtml(val ?? '');
  }

  // normalize quill HTML and push to state
  private setHtml(raw: string): void {
    const html = this.normalizeHtml(raw);
    if (html !== this.claimDeclaration) {
      this.claimDeclaration = html;
      this.updateClaimState();
    }
  }

  private normalizeHtml(raw: string): string {
    const v = (raw || '').trim();
    return v === '<p><br></p>' ? '' : v; // Quill's “empty” marker
  }

  private toPlain(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || div.innerText || '').trim();
  }

  // push slice that Save() reads later
  updateClaimState(): void {
    const html = (this.claimDeclaration ?? '').trim();

    // derive plain if textarea empty
    const plain = (this.editorContent ?? '').trim() || this.toPlain(html);

    this.tabState.updateClaimInfo({
      ClaimsManager: this.selectedManager,
      ClaimFormDeclaration: html,            // ✅ key field
      ClaimFormDeclarationPlain: plain,
      ProcessClaims: this.processClaims,
      NearestClaimCentre: this.nearestClaimCentre,
      EnableVoucherExportOnDeathClaim: this.enableDeathClaimVoucher,
    });
  }

  loadClaimsManagers(): void {
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.claimsManagers = (users ?? [])
          .filter((u) => u.IsActive)
          .map((u) => ({ value: u.UserName, label: `${u.Firstname} ${u.Lastname}` }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
