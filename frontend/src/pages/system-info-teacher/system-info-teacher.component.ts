import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-system-info-teacher',
  templateUrl: './system-info-teacher.component.html',
  styleUrls: ['./system-info-teacher.component.css']
})
export class SystemInfoTeacherComponent {
  constructor() {}

  ngOnInit(): void {}

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  backToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const btn = document.getElementById('back-to-top');
    if (window.scrollY > 200) {
      btn!.style.display = 'block';
    } else {
      btn!.style.display = 'none';
    }
  }
}
