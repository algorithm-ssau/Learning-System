// developer-info.component.ts
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-developer-info',
  templateUrl: './developer-info.component.html',
  styleUrls: ['./developer-info.component.css']
})
export class DeveloperInfoComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  /**
   * Перейти на предыдущую страницу в истории браузера
   */
  goBack(): void {
    this.location.back();
  }
}




