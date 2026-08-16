import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  brands = [
    { name: 'Honda', icon: '/honda-icon.png' },
    { name: 'Yamaha', icon: '/yamaha-icon.png' },
    { name: 'Suzuki', icon: '/susuki-icon.png' },
    { name: 'Kawasaki', icon: '/kawasaki-icon.png' },
    { name: 'Bajaj', icon: '/bajaj-icon.png' }
  ];

  promotions = [
    { title: 'Nuevos Cascos MT', desc: 'Descubre la nueva colección de cascos integrales con certificación DOT.' },
    { title: 'Llantas Deportivas', desc: 'Agarre extremo en cualquier condición climática. Michelin y Pirelli.' },
    { title: 'Kits de Arrastre', desc: 'Máxima durabilidad para tu moto. Envíos a todo el país.' }
  ];
}
