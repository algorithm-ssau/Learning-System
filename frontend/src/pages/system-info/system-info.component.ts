import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.css']
})
export class SystemInfoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  backToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const button = document.getElementById('back-to-top');
    if (window.scrollY > 200) {
      button!.style.display = 'block';
    } else {
      button!.style.display = 'none';
    }
  }
}

// Скрипт для кнопки "Назад" (если вы его используете)
document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('a[routerLink="/studentjournal"] button') as HTMLButtonElement;
  backButton.addEventListener('click', () => {
    window.history.back();
  });
});
