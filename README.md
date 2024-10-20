# Rafiki with multi party grant authorisation

A submission for the [2024 Interledger Hackathon](https://interledger.org/summit/hackathon).

Our submission extends the existing Rafiki codebase with functionality that:
1. Allows outgoing payment requests to depend on the approval of multiple parties. This can be useful in the context of corporate expense management (approval by supervisor) or stokvel withdrawals (aprroval by other stokvel members).
2. Allows outgoing payment requests to be approved via additional channels (in addition to redirects). In this submission, we use email as a channel to prove the concept.

For more details, see our presentation [here](./ApproveMe.pdf).

## Requirements

- Docker
- pnpm v8.15.4
- node v20.18.0
- Mailtrap account and inbox - https://mailtrap.io/
- Bruno - https://www.usebruno.com/downloads

## Step one: get credentials

1. In your mailtrap account, navigate to Email testing, then click on Inboxes. Click on My Inbox and under the tab Integration, you will see a set of credentials that you will need below.

2. From the root of the project, run the following command to create a .env file in the localenv/mfa directory:

    ```
    touch localenv/mfa/.env
    ```

3. Edit the localenv/mfa/.env file to have the following contents:

    ```
    EMAIL_USER=your mailtrap inbox user
    EMAIL_PASS=your mailtrap indbox password
    EMAIL_HOST=sandbox.smtp.mailtrap.io
    ```

## Step two: get the project up and running

```
pnpm i
cd packages/auth
pnpm i
cd ../..
./bin/start
```

Note: this will ask for sudo to set up some hosts entries.
If you'd prefer not giving this script sudo, please add the following to your hosts file (/etc/hosts) or local resolver:

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

## Step three: mimic the behaviour

- Open Bruno on your computer and click "Open Collection".
- Navigate to bruno/Colelctions/Rafiki and select the folder for upload
- On the left hand panel, go to Rafiki > Examples > Open Payments Without Quote. 
- Set the environment (top right) to Local Playground.
- Run the first 4 http requests in order - this sets the environment variables that you will need below. 
- Then run the "Grant Request Outgoing Payment" example. 
    > Notice the email with an approval link in your Mailtrap inbox. 
    > This demonstrates the "Multiple channels" functionality.
- Skip the next two http requests
- Now run the "Grant Request Outgoing Payment additional email" example.
    >Notice the _multiple_ emails with approval links in your Mailtrap inbox. 
    > This demonstrates the "Multiple approvals" functionality.
