import * as nearAPI from "near-api-js";
import {
  signTransaction,
  sendTransaction,
  initRequirements
} from "near-easy-transactions";
import { contractName, networkId, keyPair, sender } from "./config";

const provider = new nearAPI.providers.JsonRpcProvider({
  url: `https://rpc.${networkId}.near.org`
});

const testSetGreeting = async () => {
  const { nonce, recentBlockHash } = await initRequirements({
    provider,
    sender,
    publicKey: keyPair.getPublicKey()
  });

  const actions = [
    nearAPI.transactions.functionCall(
      "set_greeting",
      Buffer.from(JSON.stringify({ message: "hello a Mai Xuan Trieu" })),
      10000000000000,
      0
      // nearAPI.utils.format.parseNearAmount('0.1')
    )
  ];

  const signedTransaction = signTransaction({
    actions,
    nonce,
    recentBlockHash,
    sender,
    contractName,
    keyPair
  });

  sendTransaction(provider, signedTransaction);
};

const testGetGreeting = async () => {
  const res = await fetch("https://rpc.testnet.near.org/", {
    headers: {
      accept: "*/*",
      "accept-language":
        "en-GB,en;q=0.9,ja-JP;q=0.8,ja;q=0.7,vi-VN;q=0.6,vi;q=0.5,en-US;q=0.4",
      "content-type": "application/json",
      "sec-ch-ua":
        '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    referrer: "https://wallet.testnet.near.org/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body:
      '{"method":"query","params":{"request_type":"view_account","account_id":"tinisntreal.testnet","finality":"optimistic"},"id":125,"jsonrpc":"2.0"}',
    method: "POST",
    mode: "cors",
    credentials: "omit"
  });

  return (await res.json()).result?.amount || null;
};

window.testSetGreeting = testSetGreeting;
window.testGetGreeting = testGetGreeting;

document.getElementById("app").innerHTML = `<h1>Hello Vanilla!</h1>`;
