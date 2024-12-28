# DevTinder APIs
authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userID
- POST /request/send/ignored/:userID
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - gets you the profiles of other users

Status: ignore, interested, accepted, rejected