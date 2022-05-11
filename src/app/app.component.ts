import { Component, HostListener } from '@angular/core';
import { DataService } from './data.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({ opacity: 0 }),
        animate(200)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(400, style({ opacity: 0 })))
    ])
  ]
})
export class AppComponent {

  blockNumber: BigInt;
  tweets: [][];
  lastTweetId: BigInt;
  theEnd: boolean;
  signedIn: boolean = false;
  fetching: boolean = false;

  constructor(private dataService: DataService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

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
    this.getTweets();
    this.dataService.isSignedIn.subscribe(value => this.signedIn = value);
  }

  title = 'twitter-web';

  getTweets() {

    if (this.fetching) {
      console.log('Already fetching tweets');
      return;
    }
    this.fetching = true;
    this.lastTweetId = BigInt(Number(this.lastTweetId) - 1);
    this.dataService.getTweets(this.lastTweetId).then(tweets => {
      if (this.theEnd) {
        this.fetching = false;
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
      this.fetching = false;
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
    return this.signedIn;
  }

  delete(id: number) {
    const index = this.tweets.findIndex(tweet => tweet["id"] == id)
    if (index >= 0) {
      this.tweets.splice(index, 1);
    }
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event) {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      this.getTweets();
    }
  }
}
