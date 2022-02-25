import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (this.isLoginMode) {
    } else {
      if (!form.valid) {
        return;
      }
      const { email, password } = form.value;
      this.authService.signup(email, password).subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
    }
    form.reset();
  }
}
