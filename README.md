# Voice Authentication Service

Voice authentication enrollment and verification backend services using MS Azure Speaker Recognition API.
 
#### Usage

To use this repo locally you need to have the [Serverless framework](https://serverless.com) installed.

``` bash
$ npm install serverless -g
```

And run this to deploy to your AWS account.

``` bash
$ serverless deploy
```

The services have some dependencies but above command will do it for you:

1. `database`
2. `uploads3`
3. `enroll`
4. `checkStatus`
