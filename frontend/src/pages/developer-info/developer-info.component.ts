import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-developer-info',
  templateUrl: './developer-info.component.html',
  styleUrls: ['./developer-info.component.css']
})

export class DeveloperInfoComponent implements OnInit {
  constructor(





  ) {}

  ngOnInit(): void {

  }
}

// Функция для обработки событий на странице (можно расширять по мере необходимости)
document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.querySelector("button") as HTMLButtonElement;

    // Обработчик нажатия на кнопку "Назад"
    backButton.addEventListener("click", () => {
        window.history.back(); // Возвращаемся на предыдущую страницу
    });
});




