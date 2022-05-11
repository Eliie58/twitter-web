import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-tweet',
  templateUrl: './add-tweet.component.html',
  styleUrls: ['./add-tweet.component.css']
})
export class AddTweetComponent implements OnInit {

  public text: string = "";
  private signedIn: boolean = false;

  constructor(private dataService: DataService, private appComponent: AppComponent) {
    this.dataService = dataService;
    this.appComponent = appComponent;
  }

  ngOnInit(): void {
    this.dataService.isSignedIn.subscribe(value => this.signedIn = value);
  }

  async tweet() {
    this.dataService.tweet(this.text);
    this.appComponent.addTweet(this.text);
    this.text = "";
  }

  isSignedIn(): boolean {
    return this.signedIn;
  }

}
