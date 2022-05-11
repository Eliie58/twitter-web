import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { environment } from './../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTweetDialogComponent } from '../edit-tweet-dialog/edit-tweet-dialog.component';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {

  @Input() text: string = "";
  @Input() id: BigInt = BigInt(0);
  @Input() owner: string;
  @Input() publishedAt: number = this.currentSeconds();
  @Input() retweets: string[] = [];
  @Input() likes: string[] = [];

  public publishedSince: string;
  public publishDate: Date = new Date();

  private hashtagRegex = new RegExp(/#\S+/, 'ig');
  private dataService: DataService;
  private signedIn: boolean = false;

  constructor(dataService: DataService, private matSnackBar: MatSnackBar, private appComponent: AppComponent, public dialog: MatDialog) {
    this.publishedSince = "";
    this.owner = "";
    this.dataService = dataService;
  }

  isOwner() {
    return this.isCurrentUser(this.owner);
  }

  isCurrentUser(userId: string): boolean {
    return userId == this.dataService.getPublicKey();
  }

  isLiked(): boolean {
    return this.currentUserInList(this.likes);
  }

  isRetweeted(): boolean {
    return this.currentUserInList(this.retweets);
  }

  currentUserInList(list: string[]): boolean {
    let found: boolean = false;
    list.forEach(item => {
      if (item == this.dataService.getPublicKey()) {
        found = true;
        return;
      }
    });
    return found;
  }

  ngOnInit(): void {

    this.publishDate = new Date(Number(this.publishedAt) * 1000);
    this.dataService.isSignedIn.subscribe(value => this.signedIn = value);
    const sinceSeconds = this.currentSeconds() - this.publishedAt;
    if (sinceSeconds < 60) {
      this.publishedSince = `${sinceSeconds}s`;
      return;
    }
    const sinceMinutes = Math.floor(sinceSeconds / 60);
    if (sinceMinutes < 60) {
      this.publishedSince = `${sinceMinutes}m`;
      return;
    }
    const sinceHours = Math.floor(sinceMinutes / 60);
    if (sinceHours < 24) {
      this.publishedSince = `${sinceHours}h`;
      return;
    }
    const sinceDays = Math.floor(sinceHours / 24);
    if (sinceDays < 7) {
      this.publishedSince = `${sinceDays}d`;
      return;
    }
    const sinceWeeks = Math.floor(sinceDays / 7);
    if (sinceWeeks < 4) {
      this.publishedSince = `${sinceWeeks}w`;
      return;
    }
    const sinceMonths = Math.floor(sinceDays / 30);
    if (sinceMonths < 12) {
      this.publishedSince = `${sinceMonths}m`;
      return;
    }
    const sinceYears = Math.floor(sinceDays / 365);
    if (sinceYears < 12) {
      this.publishedSince = `${sinceYears}y`;
      return;
    }
  }

  currentSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  retweet() {
    if (!this.isSignedIn()) {
      this.promptNotLoggedIn();
      return;
    }
    if (Number(this.id) == -1) {
      const snackBarRef = this.matSnackBar.open('You cannot Retwwet yet. Refresh the page please.', 'Refresh', {
        duration: 5000,
        panelClass: 'my-custom-snackbar'
      });
      snackBarRef.onAction().subscribe(() => {
        window.location.reload();
      });
      return;
    }
    if (this.isRetweeted()) {
      this.retweets = this.remove(this.dataService.getPublicKey(), this.retweets);
    } else {
      this.retweets = [...this.retweets, this.dataService.getPublicKey()]
    }
    this.dataService.retweet(Number(this.id));
  }

  like() {
    if (!this.isSignedIn()) {
      this.promptNotLoggedIn();
      return;
    }
    if (Number(this.id) == -1) {
      const snackBarRef = this.matSnackBar.open('You cannot Like yet. Refresh the page please.', 'Refresh', {
        duration: 5000,
        panelClass: 'my-custom-snackbar'
      });
      snackBarRef.onAction().subscribe(() => {
        window.location.reload();
      });
      return;
    }
    if (this.isLiked()) {
      this.likes = this.remove(this.dataService.getPublicKey(), this.likes);
    } else {
      this.likes = [...this.likes, this.dataService.getPublicKey()]
    }
    this.dataService.like(Number(this.id));
  }

  delete() {
    if (!this.isSignedIn()) {
      this.promptNotLoggedIn();
      return;
    }
    if (Number(this.id) == -1) {
      const snackBarRef = this.matSnackBar.open('You cannot Delete yet. Refresh the page please.', 'Refresh', {
        duration: 5000,
        panelClass: 'my-custom-snackbar'
      });
      snackBarRef.onAction().subscribe(() => {
        window.location.reload();
      });
      return;
    }
    this.appComponent.delete(Number(this.id));
    this.dataService.delete(Number(this.id));
  }

  edit() {
    if (!this.isSignedIn()) {
      this.promptNotLoggedIn();
      return;
    }
    if (Number(this.id) == -1) {
      const snackBarRef = this.matSnackBar.open('You cannot Delete yet. Refresh the page please.', 'Refresh', {
        duration: 5000,
        panelClass: 'my-custom-snackbar'
      });
      snackBarRef.onAction().subscribe(() => {
        window.location.reload();
      });
      return;
    }

    const dialogRef = this.dialog.open(EditTweetDialogComponent, {
      width: '40%',
      data: { text: this.text },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.text = result;
        this.dataService.edit(Number(this.id), this.text);
      }
    });
  }

  promptNotLoggedIn() {
    const snackBarRef = this.matSnackBar.open("You are not Signed In.", 'Sign In?', {
      duration: 5000,
      panelClass: 'my-custom-snackbar'
    });
    snackBarRef.onAction().subscribe(() => {
      this.dataService.signIn(window);
    });
  }

  remove(item: string, array: string[]): string[] {
    return array.filter(function (value) {
      return value != item;
    });
  }

  format(text: string): string {
    return text.replace(this.hashtagRegex, '<span class="hashtag">$&</span>');
  }

  isSignedIn(): boolean {
    return this.signedIn;
  }

}
