import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';


@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.css']
})

export class SystemInfoComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Этот метод будет вызван, когда компонент будет инициализирован
  }

  // Метод для прокрутки к элементу с определенным ID
  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      // Прокручиваем страницу до указанного элемента с плавной анимацией
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  // Метод для прокрутки страницы наверх
  backToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // Слушаем событие прокрутки страницы и показываем/скрываем кнопку "Наверх"
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const button = document.getElementById("back-to-top");
    if (window.scrollY > 200) {
      button!.style.display = 'block'; // Показываем кнопку, если прокручено больше 200px
    } else {
      button!.style.display = 'none'; // Скрываем кнопку, если прокручено меньше 200px
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.querySelector("button") as HTMLButtonElement;

    // Обработчик нажатия на кнопку "Назад"
    backButton.addEventListener("click", () => {
        window.history.back(); // Возвращаемся на предыдущую страницу
    });
});
