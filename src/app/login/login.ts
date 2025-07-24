import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
