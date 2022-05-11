import { Injectable } from '@angular/core';
import Web3 from "web3";
import { environment } from './../environments/environment';
import contractAbi from './contracts/TwitterApiImpl.js';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public signedIn: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public isSignedIn = this.signedIn.asObservable();
  public initialized: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public hasInitialized = this.initialized.asObservable();

  private web3: any;
  private publicKey: string = '';
  private contract: any;

  constructor() {
    this.init(window);
  }

  async init(window: any) {
    if (!window.ethereum) {
      return;
    }
    await this.initWeb3(window);
    this.contract = await this.initContract();
    this.initDisconnectListener(window);
    this.trySignIn();
    this.initialized.next(true);
  }

  async initWeb3(window: any) {
    this.web3 = new Web3(window.ethereum);
  }

  async initContract() {
    return await new this.web3.eth.Contract(contractAbi, environment.CONTRACT_ADDRESS);
  }

  initDisconnectListener(window: any) {
    if (!window.ethereum) {
      return;
    }
    let me = this;
    window.ethereum.on('accountsChanged', function (accounts: string[]) {
      if (accounts.length != 0) {
        return;
      }
      me.publicKey = "";
      me.signedIn.next(false);
      console.log("Wallet disconnected");
    });
  }

  async trySignIn() {
    if (await this.alreadySignedIn(window)) {
      this.signIn(window);
    }
  }

  async alreadySignedIn(window: any) {
    if (!window.ethereum) {
      return false;
    }
    let accounts: string[] = await window.ethereum
      .request({ method: 'eth_accounts' });
    return accounts.length != 0;
  }

  async signIn(window: any) {
    await window.ethereum.enable();
    await window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
      this.signedIn.next(true);
      this.publicKey = Web3.utils.toChecksumAddress(accounts[0]);
    })
    .catch((err: any) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
  }

  getPublicKey() {
    return this.publicKey;
  }

  async getTweets(fromId: BigInt): Promise<[]> {
    return await this.contract.methods.getTweets(fromId).call();
  }

  async getCurrentAccount() {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }

  async retweet(id: number) {
    const account = await this.getCurrentAccount();
    this.contract.methods.retweet(id).send({ from: account });
  }

  async like(id: number) {
    const account = await this.getCurrentAccount();
    this.contract.methods.like(id).send({ from: account });
  }

  async tweet(tweet: string) {
    const account = await this.getCurrentAccount();
    this.contract.methods.addTweet(tweet).send({ from: account });
  }

  async delete(id: number) {
    const account = await this.getCurrentAccount();
    this.contract.methods.deleteTweet(id).send({ from: account });
  }

  async edit(id: number, text: string) {
    const account = await this.getCurrentAccount();
    this.contract.methods.updateTweet(id, text).send({ from: account });
  }

}
