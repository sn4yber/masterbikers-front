import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExtractionService } from '../../services/extraction.service';
import { ProductService } from '../../services/product.service';
import { ExtractionJob, ExtractionItem } from '../../models/extraction.model';
import { Product } from '../../models/product.model';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-extraction-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extraction-dashboard.component.html',
  styleUrl: './extraction-dashboard.component.css'
})
export class ExtractionDashboardComponent implements OnInit, OnDestroy {
  private extractionService = inject(ExtractionService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  public urlInput: string = '';
  public isSubmitting: boolean = false;

  public currentJobId: string | null = null;
  public currentJob: ExtractionJob | null = null;
  public jobItems: ExtractionItem[] = [];

  private pollingSubscription?: Subscription;

  // Metrics
  public totalExtracted = 0;
  public avgPrice = 0;
  public conditionBreakdown = { new: 0, used: 0, refurb: 0 };
  public availabilityBreakdown = { inStock: 0, outOfStock: 0 };

  ngOnInit() {
    this.loadMetrics();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  private loadMetrics() {
    // Buscar productos cuyo source sea AUTOMATION_EXERCISE
    this.productService.getProducts(0, 100, { source: 'AUTOMATION_EXERCISE' }).subscribe({
      next: (res) => {
        const products = res.content;
        this.totalExtracted = res.page.totalElements;
        
        if (products.length > 0) {
          const totalP = products.reduce((sum, p) => sum + (p.price || 0), 0);
          this.avgPrice = totalP / products.length;

          this.conditionBreakdown = {
            new: products.filter(p => p.condition === 'NEW').length,
            used: products.filter(p => p.condition === 'USED').length,
            refurb: products.filter(p => p.condition === 'REFURBISHED').length
          };

          this.availabilityBreakdown = {
            inStock: products.filter(p => p.availability === 'IN_STOCK').length,
            outOfStock: products.filter(p => p.availability === 'OUT_OF_STOCK').length
          };
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar métricas', err);
        this.cdr.detectChanges();
      }
    });
  }

  public extractIdsFromInput(): number[] {
    if (!this.urlInput) return [];

    const urlsOrIds = this.urlInput.split(/[\s,]+/).filter(i => i.trim() !== '');
    const ids = new Set<number>();

    for (const item of urlsOrIds) {
      const match = item.match(/product_details\/(\d+)/);
      if (match && match[1]) {
        ids.add(parseInt(match[1], 10));
      } else if (/^\d+$/.test(item)) {
        ids.add(parseInt(item, 10));
      }
    }

    return Array.from(ids);
  }

  public startExtraction() {
    const ids = this.extractIdsFromInput();
    if (ids.length === 0) {
      alert('Por favor, ingresa URLs válidas o IDs numéricos.');
      return;
    }

    this.isSubmitting = true;
    this.extractionService.createJob({ productIds: ids }).subscribe({
      next: (response) => {
        this.urlInput = '';
        this.isSubmitting = false;
        this.currentJobId = response.id;
        this.startPolling(response.id);
      },
      error: (err) => {
        console.error('Error al iniciar la extracción', err);
        alert('Ocurrió un error al iniciar el trabajo de extracción.');
        this.isSubmitting = false;
      }
    });
  }

  private startPolling(jobId: string) {
    this.stopPolling();

    this.pollingSubscription = interval(2000).pipe(
      startWith(0),
      switchMap(() => this.extractionService.getJob(jobId))
    ).subscribe({
      next: (job) => {
        this.currentJob = job;

        this.extractionService.getJobItems(jobId).subscribe(items => {
          this.jobItems = items;
          this.cdr.detectChanges();
        });

        if (job.status === 'COMPLETED' || job.status === 'COMPLETED_WITH_ERRORS' || job.status === 'FAILED') {
          this.stopPolling();
          // Reload metrics when job is done
          this.loadMetrics();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error consultando el progreso', err);
        this.stopPolling();
        this.cdr.detectChanges();
      }
    });
  }

  private stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  public getProgressPercentage(): number {
    if (!this.currentJob || this.currentJob.total === 0) return 0;
    return (this.currentJob.processed / this.currentJob.total) * 100;
  }

  public isJobActive(): boolean {
    return this.currentJob?.status === 'PROCESSING' || this.currentJob?.status === 'PENDING';
  }
}
