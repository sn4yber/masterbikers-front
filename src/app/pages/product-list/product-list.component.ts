import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, PagedModel } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public products: Product[] = [];
  public totalElements: number = 0;
  public isLoading = false;

  // Filtros
  public filters = {
    name: '',
    brand: '',
    category: '',
    availability: ''
  };

  // Marcas/Proveedores
  public availableBrands = [
    { name: 'Honda', icon: '/honda-icon.png' },
    { name: 'Yamaha', icon: '/yamaha-icon.png' },
    { name: 'Suzuki', icon: '/susuki-icon.png' },
    { name: 'Kawasaki', icon: '/kawasaki-icon.png' },
    { name: 'Bajaj', icon: '/bajaj-icon.png' }
  ];

  // Edición
  public editingProduct: Product | null = null;
  public editForm: Partial<Product> = {};
  public isSaving = false;

  ngOnInit() {
    // 1. Carga inicial obligatoria y directa (evita depender del primer emit del observable)
    this.filters.brand = this.route.snapshot.queryParamMap.get('brand') || '';
    this.loadProducts();

    // 2. Escuchar cambios futuros en la URL si el usuario navega a esta misma ruta
    this.route.queryParams.subscribe(params => {
      const newBrand = params['brand'] || '';
      // Solo recargamos si la marca realmente cambió por navegación externa
      if (this.filters.brand !== newBrand) {
        this.filters.brand = newBrand;
        this.loadProducts();
      }
    });
  }

  selectBrand(brandName: string) {
    if (this.filters.brand.toLowerCase() === brandName.toLowerCase()) {
      this.filters.brand = '';
    } else {
      this.filters.brand = brandName;
    }
    this.updateUrlAndLoad();
  }

  public debugInfo: string = '';

  private cdr = inject(ChangeDetectorRef);

  loadProducts() {
    this.isLoading = true;
    
    // Limpieza estricta de parámetros
    const safeFilters: any = {};
    if (this.filters.name) safeFilters.name = this.filters.name.trim();
    if (this.filters.brand) safeFilters.brand = this.filters.brand.trim();
    if (this.filters.category) safeFilters.category = this.filters.category.trim();
    if (this.filters.availability) safeFilters.availability = this.filters.availability.trim();

    this.debugInfo = `Requesting page=0, size=100, filters=${JSON.stringify(safeFilters)}`;
    this.cdr.detectChanges();

    this.productService.getProducts(0, 100, safeFilters).subscribe({
      next: (res) => {
        this.debugInfo += ` | Success: ${res.content.length} items`;
        this.products = res.content.map(p => ({
          ...p,
          localImage: this.getPlaceholderImage(p.category, p.name, p.sourceUrl)
        }));
        this.totalElements = res.page.totalElements;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.debugInfo += ` | Error: ${err.message || 'Unknown'}`;
        console.error('Error al cargar productos', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.updateUrlAndLoad();
    }
  }

  applyFilters() {
    this.updateUrlAndLoad();
  }

  clearFilters() {
    this.filters = { name: '', brand: '', category: '', availability: '' };
    this.updateUrlAndLoad();
  }
  
  private updateUrlAndLoad() {
    const queryParams: any = {};
    if (this.filters.brand) queryParams.brand = this.filters.brand;
    
    // Al hacer navigate, se disparará el subscribe SOLO si cambian los queryParams
    this.router.navigate([], { queryParams, replaceUrl: true }).then(() => {
      // Forzamos carga porque navigate no dispara evento si los params son idénticos
      this.loadProducts();
    });
  }

  deleteProduct(id: string) {
    if (confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: () => {
          alert('Error al eliminar el producto.');
        }
      });
    }
  }

  openEditModal(product: Product) {
    this.editingProduct = product;
    // Creamos una copia para el formulario
    this.editForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      condition: product.condition,
      availability: product.availability,
      category: product.category,
      brand: product.brand,
      sourceUrl: product.sourceUrl
    };
  }

  closeEditModal() {
    this.editingProduct = null;
    this.editForm = {};
  }

  saveEdit() {
    if (!this.editingProduct) return;
    this.isSaving = true;
    
    // Solo enviamos los campos que se pueden editar
    const updates = {
      name: this.editForm.name,
      description: this.editForm.description,
      price: this.editForm.price,
      condition: this.editForm.condition,
      availability: this.editForm.availability,
      category: this.editForm.category,
      brand: this.editForm.brand,
      sourceUrl: this.editForm.sourceUrl
    };

    this.productService.updateProduct(this.editingProduct.id, updates as Partial<Product>).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeEditModal();
        this.loadProducts();
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar el producto');
        this.isSaving = false;
      }
    });
  }

  getPlaceholderImage(category: string | null, name: string | null, sourceUrl: string | null | undefined): string {
    if (sourceUrl && (sourceUrl.endsWith('.png') || sourceUrl.endsWith('.jpg'))) {
        return sourceUrl;
    }
    const n = name?.toLowerCase() || '';
    if (n.includes('filtro') && n.includes('aceite')) return '/filtro de aceite-xtz250.png';
    if (n.includes('monoshock')) return '/monoshock-xr190.png';
    if (n.includes('motul')) return '/motul7100-10w40.jpg';
    if (n.includes('pastilla') || n.includes('freno')) return '/pastillas de freno xre300.png';
    if (n.includes('arrastre')) return '/kit de arraster gixxer150.png';
    if (n.includes('cilindro')) return '/kit cilindro ninja300.png';
    if (n.includes('estator')) return '/estator dr650.png';
    if (n.includes('casco') && n.includes('abatible')) return '/casco abatible shaft.png';
    if (n.includes('casco') && n.includes('integral')) return '/casco integral mt helmets.png';
    if (n.includes('campana') || n.includes('cluch') || n.includes('clutch')) return '/campana de cluch mt09.png';
    if (n.includes('bomba') && n.includes('agua')) return '/bomba de agua z1000.png';
    if (n.includes('bobina')) return '/bobina alta dominar 400 .png';
    if (n.includes('llanta')) return '/Llanta Trasera Michelin Pilot Street 14070 R17.png';
    if (n.includes('guaya') || n.includes('acelerador')) return '/Guayas de Acelerador Pulsar NS200.png';
    if (n.includes('exploradora')) return '/Exploradoras LED 40W.png';
    
    const cat = category?.toLowerCase() || '';
    if (cat.includes('motor')) return '/kit cilindro ninja300.png';
    if (cat.includes('freno')) return '/pastillas de freno xre300.png';
    if (cat.includes('llanta')) return '/Llanta Trasera Michelin Pilot Street 14070 R17.png';
    if (cat.includes('eléctric')) return '/bobina alta dominar 400 .png';
    if (cat.includes('accesori')) return '/Exploradoras LED 40W.png';
    
    return '/filtro de aceite-xtz250.png';
  }

  getConditionLabel(condition: string): string {
    switch (condition) {
      case 'NEW': return 'Nuevo';
      case 'USED': return 'Usado';
      case 'REFURBISHED': return 'Reacond.';
      default: return condition;
    }
  }

  getAvailabilityLabel(av: string): string {
    switch (av) {
      case 'IN_STOCK': return 'En Stock';
      case 'OUT_OF_STOCK': return 'Agotado';
      default: return 'N/A';
    }
  }
}
