import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { FormBuilder ,ReactiveFormsModule} from '@angular/forms'
import { User } from './user';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = "Life Manager";
  public users: User[] | undefined;
  public aUser: User | undefined;
  user : User = new User(); 
  submitted = false; 

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router){
    this.contactForm = this.formBuilder.group({
      id: [''],
      name: [''],
      usrGrp: [''],
      phone: ['']
    });
  }
  
  contactForm;

  ngOnInit() {
    this.getUsers();
    this.submitted=false;  
  }

  public getUsers(): void {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        console.log(this.users);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  updateUser(user: User){
    this.contactForm.setValue({
      name: user.name,
      id: String(user.id),
      usrGrp: user.usrGrp,
      phone: user.phone
    });
    console.log(this.contactForm.value);
  }

  deleteUser(id: number |null){
    this.userService.deleteUser(id).subscribe( data => {
      console.log(data);
      this.getUsers();
    })
  }

  onSubmit() {
    console.log(this.contactForm.value);
    if(this.UserId?.value != null){
      this.user.id = Number(this.UserId.value);
      this.user.name = this.UserName!.value;
      this.user.usrGrp = this.UserUsrGrp!.value;
      this.user.phone = this.UserPhone!.value;
      this.userService.updateUser(this.user)  
      .subscribe(data => {
        console.log(data);
        this.getUsers();
      }, error => console.log(error));  
    } else{
      this.user=new User();
      this.user.name = this.UserName!.value;
      this.user.usrGrp = this.UserUsrGrp!.value;
      this.user.phone = this.UserPhone!.value;
      this.submitted = true;  
      this.userService.addUser(this.user)  
      .subscribe(data => {
        console.log(data);
        this.getUsers();
      }, error => console.log(error));  
      this.user = new User();
    }
    this.contactForm.reset();
    this.getUsers(); 
  }

  clearForm(){
    this.contactForm.reset();
    this.getUsers(); 
  }

  get UserId(){  
    return this.contactForm.get('id');  
  } 

  get UserName(){  
    return this.contactForm.get('name');  
  }  
  
  get UserUsrGrp(){  
    return this.contactForm.get('usrGrp');  
  }  
  
  get UserPhone(){  
    return this.contactForm.get('phone');  
  } 
}
