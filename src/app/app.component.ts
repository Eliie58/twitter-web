import { Component } from '@angular/core';
import { DataService } from './data.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  dataService: DataService;
  blockNumber: BigInt;
  tweets: [][];
  lastTweetId: BigInt;
  theEnd: boolean;

  constructor(private _dataService: DataService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.dataService = _dataService;
    this.blockNumber = BigInt(0);
    this.tweets = [];
    this.lastTweetId = BigInt(0);
    this.theEnd = false;
    this.matIconRegistry.addSvgIcon(
      `twitter`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svgexport-3.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `comment`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svgexport-17.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `retweet`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svgexport-18.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `retweeted`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svgexport-26.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `like`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svgexport-19.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `liked`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svgexport-22.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `share`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svgexport-20.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `edit`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons8-edit.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `delete`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons8-delete.svg")
    );
  }

  ngOnInit() {
    this.getTweets()
  }

  title = 'twitter-web';

  getTweets() {

    this.dataService.getTweets(this.lastTweetId).then(tweets => {
      if (this.theEnd) {
        return;
      }
      tweets.forEach(tweet => {
        if (tweet["owner"] == "0x0000000000000000000000000000000000000000") {
          this.theEnd = true;
          return;
        }
        this.tweets.push(tweet);
        this.lastTweetId = tweet["id"];
        if (this.lastTweetId.toString() == "0") {
          this.theEnd = true;
        }
      });
    })
  }

  addTweet(text: string) {
    let tweet: [] = [];
    tweet["text"] = text;
    tweet["id"] = -1;
    tweet["owner"] = this.dataService.getPublicKey();
    tweet["publishedAt"] = Math.floor(Date.now() / 1000);
    tweet["retweets"] = [];
    tweet["likes"] = [];
    this.tweets.unshift(tweet);
  }

  signIn() {
    this.dataService.signIn(window);
  }

  isSignedIn() {
    return this.dataService.isSignedIn();
  }
}
