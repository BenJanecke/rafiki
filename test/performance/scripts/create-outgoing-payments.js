import http from 'k6/http'
import { fail } from 'k6'
export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 1,
  // A string specifying the total duration of the test run.
  duration: '600s'
}

const HEADERS = {
  'Content-Type': 'application/json'
}

const MFA_GQL_ENDPOINT = 'http://mfa-wallet-backend:3001/graphql'
const MFA_WALLET_ADDRESS = 'https://mfa-wallet-backend/accounts/gfranklin'
const HAPPY_LIFE_BANK_WALLET_ADDRESS =
  'https://happy-life-bank-backend/accounts/pfry'

export function setup() {
  const c9WalletAddressesRes = http.post(
    MFA_GQL_ENDPOINT,
    JSON.stringify({
      query: `
    query GetWalletAddresses {
      walletAddresses {
        edges {
          node {
            id
            url
          }
        }
      }
    }
  `
    }),
    { headers: HEADERS }
  )

  if (c9WalletAddressesRes.status !== 200) {
    fail(`GraphQL Request failed to find ${MFA_WALLET_ADDRESS}`)
  }
  const c9WalletAddresses = JSON.parse(c9WalletAddressesRes.body).data
    .walletAddresses.edges
  const c9WalletAddress = c9WalletAddresses.find(
    (edge) => edge.node.url === MFA_WALLET_ADDRESS
  ).node
  if (!c9WalletAddress) {
    fail(`could not find wallet address: ${MFA_WALLET_ADDRESS}`)
  }

  return { data: { c9WalletAddress } }
}

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function (data) {
  const {
    data: { c9WalletAddress }
  } = data

  const createReceiverResponse = http.post(
    MFA_GQL_ENDPOINT,
    JSON.stringify({
      query: `
        mutation CreateReceiver($input: CreateReceiverInput!) {
          createReceiver(input: $input) {
            receiver {
              id
            }
          }
        }
      `,
      variables: {
        input: {
          expiresAt: null,
          metadata: {
            description: 'Hello my friend',
            externalRef: null
          },
          incomingAmount: {
            assetCode: 'USD',
            assetScale: 2,
            value: 1002
          },
          walletAddressUrl: HAPPY_LIFE_BANK_WALLET_ADDRESS
        }
      }
    }),
    {
      headers: HEADERS
    }
  )

  const receiver = JSON.parse(createReceiverResponse.body).data.createReceiver
    .receiver

  const createQuoteResponse = http.post(
    MFA_GQL_ENDPOINT,
    JSON.stringify({
      query: `
        mutation CreateQuote($input: CreateQuoteInput!) {
          createQuote(input: $input) {
            quote {
              id
            }
          }
        }
      `,
      variables: {
        input: {
          walletAddressId: c9WalletAddress.id,
          receiveAmount: null,
          receiver: receiver.id,
          debitAmount: {
            assetCode: 'USD',
            assetScale: 2,
            value: 500
          }
        }
      }
    }),
    {
      headers: HEADERS
    }
  )

  const quote = JSON.parse(createQuoteResponse.body).data.createQuote.quote

  http.post(
    MFA_GQL_ENDPOINT,
    JSON.stringify({
      query: `
        mutation CreateOutgoingPayment($input: CreateOutgoingPaymentInput!) {
          createOutgoingPayment(input: $input) {
            payment {
              id
            }
          }
        }
      `,
      variables: {
        input: {
          walletAddressId: c9WalletAddress.id,
          quoteId: quote.id
        }
      }
    }),
    { headers: HEADERS }
  )
}
