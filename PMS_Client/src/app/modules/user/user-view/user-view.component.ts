import { Component } from '@angular/core';
import {User} from "../../../entity/User";
import {UserService} from "../../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../utils/dialog/dialog.component";

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'is_admin', 'delete', 'modify','medrec'];

  constructor(private userService: UserService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadAll()
  }

  async loadAll() {

    this.users = await this.userService.getAllUsers()
// @ts-ignore
    this.users = this.users["users"]
    // @ts-ignore
    console.log(this.users)
  }

  async delete(user: User) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: 'Delete User', message: 'Are you sure you want to Delete this User?\n' + user.username},
    })
    dialogRef.afterClosed().subscribe(async result => {
      let res;
      if (result) {
        res = await this.userService.remove(user.id)
        this.loadAll()
        console.log(res)
      }
    })

  }

}
