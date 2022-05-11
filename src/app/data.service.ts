import { Injectable } from '@angular/core';
import Web3 from "web3";
import { providers, Wallet, Contract } from 'ethers';
import { environment } from './../environments/environment';
import contractAbi from './contracts/TwitterApiImpl.js';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  public signedIn: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public isSignedIn = this.signedIn.asObservable();

  private web3: any;
  private provider: any;
  private publicKey: string;
  private contract: any;

  constructor() {
    this.initWeb3();
    this.initProvider();
    this.initContract();
    this.publicKey = "";
    this.initDisconnectListener(window);
    this.trySignIn();
  }

  initDisconnectListener(window: any) {
    if (!window.ethereum) {
      return;
    }
    let me = this;
    window.ethereum.on('accountsChanged', function(accounts : string[]) {
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

  getPublicKey() {
    return this.publicKey;
  }

  initWeb3() {
    this.web3 = new Web3(environment.ADDRESS);
  }

  initProvider() {
    this.provider = new providers.AlchemyProvider(
      environment.NETWORK,
      environment.API_KEY
    );
  }

  initContract() {
    this.contract = new Contract(environment.CONTRACT_ADDRESS, contractAbi, this.provider);
  }

  async getTweets(fromId: BigInt): Promise<[]> {
    return await this.contract.getTweets(fromId);
  }

  async getSignedContract(window: any): Promise<any> {
    let signer: Wallet;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let privateKey = accounts[0];
    signer = new Wallet(privateKey, this.provider);
    let signedContract = new Contract(environment.CONTRACT_ADDRESS, contractAbi, signer);
    await this.setPublicKey(signedContract);
    return signedContract;
  }

  private async setPublicKey(contract: any) {
    contract.getMyAddress().then(publicKey => {
      this.publicKey = publicKey;
      this.signedIn.next(true);
    })
  }

  async retweet(id: number) {

    let latest = await this.web3.eth.getBlock("latest");
    let gasPrice = await this.provider.getGasPrice();

    let signedContract = await this.getSignedContract(window);
    signedContract.retweet(id, {
      gasLimit: latest.gasLimit,
      gasPrice: Math.round(gasPrice.toNumber() * 2)
    }).then((result) => {
      console.log("The response is: ", result)
    }).catch(err => {
      console.log("The error is: ", err)
    });
  }

  async like(id: number) {

    let latest = await this.web3.eth.getBlock("latest");
    let gasPrice = await this.provider.getGasPrice();

    let signedContract = await this.getSignedContract(window);
    signedContract.like(id, {
      gasLimit: latest.gasLimit,
      gasPrice: Math.round(gasPrice.toNumber() * 2)
    }).then((result) => {
      console.log("The response is: ", result)
    }).catch(err => {
      console.log("The error is: ", err)
    });
  }

  async tweet(tweet: string) {

    let latest = await this.web3.eth.getBlock("latest");
    let gasPrice = await this.provider.getGasPrice();

    let signedContract = await this.getSignedContract(window);
    signedContract.addTweet(tweet, {
      gasLimit: latest.gasLimit,
      gasPrice: Math.round(gasPrice.toNumber() * 2)
    }).then((result) => {
      console.log("The response is: ", result)
    }).catch(err => {
      console.log("The error is: ", err)
    });
  }

  async delete(id: number) {

    let latest = await this.web3.eth.getBlock("latest");
    let gasPrice = await this.provider.getGasPrice();

    let signedContract = await this.getSignedContract(window);
    signedContract.deleteTweet(id, {
      gasLimit: latest.gasLimit,
      gasPrice: Math.round(gasPrice.toNumber() * 2)
    }).then((result) => {
      console.log("The response is: ", result)
    }).catch(err => {
      console.log("The error is: ", err)
    });
  }

  async edit(id: number, text: string) {

    let latest = await this.web3.eth.getBlock("latest");
    let gasPrice = await this.provider.getGasPrice();

    let signedContract = await this.getSignedContract(window);
    signedContract.updateTweet(id,text, {
      gasLimit: latest.gasLimit,
      gasPrice: Math.round(gasPrice.toNumber() * 2)
    }).then((result) => {
      console.log("The response is: ", result)
    }).catch(err => {
      console.log("The error is: ", err)
    });
  }

  async signIn(window: any) {
    this.getSignedContract(window);
  }

}
