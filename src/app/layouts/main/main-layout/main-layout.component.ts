import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { FooterComponent } from '../../../shared/components/layout/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  activeTab = 'datos-contacto';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set initial active tab based on current route
    this.updateActiveTab(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveTab(event.urlAfterRedirects);
      });
  }

  updateActiveTab(url: string): void {
    if (url.includes('datos-contacto')) {
      this.activeTab = 'datos-contacto';
    } else if (url.includes('documents')) {
      this.activeTab = 'documents';
    } else if (url.includes('infractions-cuotas')) {
      this.activeTab = 'infractions-cuotas';
    } else if (url.includes('confirmation')) {
      this.activeTab = 'confirmation';
    }
  }

  navigateTo(route: string): void {
    this.activeTab = route;
    this.router.navigate(['/registrar-acuerdos', route]);
  }

  isActive(route: string): boolean {
    return this.activeTab === route;
  }
}
