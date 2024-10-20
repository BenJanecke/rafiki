# Rafiki with multi party grant authorisation

A submission for the (2024 Interledger Hackathon)[https://interledger.org/summit/hackathon]

See (Our presentation here)[./ApproveMe.pdf]

# Requirements

- Docker
- pnpm v8.15.4
- node v20.18.0
- mailtrap account and inbox - https://mailtrap.io/
- Bruno - https://www.usebruno.com/downloads

# Step one

- touch localenv/mfa/.env
- edit localenv/mfa/.env to have the following contents

```
EMAIL_USER=your mailtrap inbox user
EMAIL_PASS=your mailtrap indbox password
EMAIL_HOST=sandbox.smtp.mailtrap.io
```

# Step two

```
pnpm i
./bin/start
```

note: this will ask for sudo to set up some hosts entries
if you'd prefer not giving this script sudo please add the following to your hosts file (/etc/hosts) or local resolver

```
127.0.0.1 cloud-nine-wallet-test-backend
127.0.0.1 cloud-nine-wallet-test-auth
127.0.0.1 happy-life-bank-test-backend
127.0.0.1 happy-life-bank-test-auth
127.0.0.1 happy-life-bank-backend
127.0.0.1 happy-life-bank-auth
127.0.0.1 mfa-wallet-test-backend
127.0.0.1 mfa-wallet-test-auth
127.0.0.1 mfa-wallet-backend
127.0.0.1 mfa-wallet-auth
```

# Step three

- Open bruno
- Load the bruno collection under bruno/rafiki in this repository
- Run the "Grant Request Outgoing Payment" example, notice the email with a approval link in your mailtrap
- Run the "Grant Request Outgoing Payment additional email" example, notice the _multiple_ emails with a approval links in your mailtrap
